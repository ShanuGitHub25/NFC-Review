import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { ReviewCard3D } from "./ReviewCardMesh";
import { CardDesignConfig } from "../types";

export interface Scene3DOptions {
  container: HTMLElement;
  initialConfig: CardDesignConfig;
  enablePointerTilt?: boolean;
  enableAutoRotate?: boolean;
  cameraZ?: number;
  backgroundColor?: string | null;
}

export class Scene3DManager {
  public renderer: THREE.WebGLRenderer;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public card: ReviewCard3D;
  private container: HTMLElement;
  private animationFrameId: number | null = null;
  private clock = new THREE.Clock();

  // Pointer interaction state
  private targetRotation = { x: 0, y: 0 };
  private currentRotation = { x: 0, y: 0 };
  private pointer = { x: 0, y: 0 };
  private isPointerDown = false;
  private previousPointer = { x: 0, y: 0 };
  public enablePointerTilt: boolean;
  public enableAutoRotate: boolean;

  constructor(options: Scene3DOptions) {
    this.container = options.container;
    this.enablePointerTilt = options.enablePointerTilt ?? true;
    this.enableAutoRotate = options.enableAutoRotate ?? false;

    const width = this.container.clientWidth || 400;
    const height = this.container.clientHeight || 300;

    // 1. Scene
    this.scene = new THREE.Scene();
    if (options.backgroundColor) {
      this.scene.background = new THREE.Color(options.backgroundColor);
    }

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.camera.position.set(0, 0, options.cameraZ || 5.2);

    // 3. Renderer with PBR color pipeline
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: !options.backgroundColor,
      powerPreference: "high-performance",
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // 4. Procedural Studio Environment Reflection
    try {
      const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
      this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      pmremGenerator.dispose();
    } catch (e) {
      console.warn("RoomEnvironment init error, continuing with standard lights", e);
    }

    // 5. 3-Point Studio Soft Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    this.scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x123b2b, 0.55);
    hemiLight.position.set(0, 20, 0);
    this.scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xa88bff, 0.8);
    rimLight.position.set(-4, -2, -3);
    this.scene.add(rimLight);

    // 6. ReviewCard 3D Object
    const maxAniso = this.renderer.capabilities.getMaxAnisotropy();
    this.card = new ReviewCard3D(options.initialConfig, maxAniso);
    this.scene.add(this.card);

    // Initial slight natural angle
    this.card.rotation.set(0.1, -0.25, 0.05);

    // 7. Event listeners
    this.bindEvents();

    // 8. Start Loop
    this.animate();
  }

  private bindEvents(): void {
    window.addEventListener("resize", this.onWindowResize);

    this.container.addEventListener("pointermove", this.onPointerMove);
    this.container.addEventListener("pointerdown", this.onPointerDown);
    window.addEventListener("pointerup", this.onPointerUp);
  }

  private onWindowResize = (): void => {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width === 0 || height === 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private onPointerMove = (e: PointerEvent): void => {
    const rect = this.container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    this.pointer.x = x;
    this.pointer.y = y;

    if (this.isPointerDown) {
      const deltaX = e.clientX - this.previousPointer.x;
      const deltaY = e.clientY - this.previousPointer.y;
      this.targetRotation.y += deltaX * 0.01;
      this.targetRotation.x += deltaY * 0.01;
      this.previousPointer = { x: e.clientX, y: e.clientY };
    } else if (this.enablePointerTilt) {
      this.targetRotation.x = -y * 0.35 + 0.1;
      this.targetRotation.y = x * 0.5 - 0.25;
    }
  };

  private onPointerDown = (e: PointerEvent): void => {
    this.isPointerDown = true;
    this.previousPointer = { x: e.clientX, y: e.clientY };
  };

  private onPointerUp = (): void => {
    this.isPointerDown = false;
  };

  public setRotation(rx: number, ry: number, rz = 0): void {
    this.targetRotation.x = rx;
    this.targetRotation.y = ry;
    if (this.card) {
      this.card.rotation.z = rz;
    }
  }

  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();

    // Smooth exponential damping for rotational momentum
    const dampFactor = 6.0 * delta;
    this.currentRotation.x = THREE.MathUtils.damp(
      this.currentRotation.x,
      this.targetRotation.x,
      8.0,
      delta
    );
    this.currentRotation.y = THREE.MathUtils.damp(
      this.currentRotation.y,
      this.targetRotation.y,
      8.0,
      delta
    );

    if (this.card) {
      if (this.enableAutoRotate && !this.isPointerDown) {
        this.targetRotation.y += delta * 0.4;
      }
      this.card.rotation.x = this.currentRotation.x;
      this.card.rotation.y = this.currentRotation.y;

      // Gentle floating levitation
      const elapsed = this.clock.getElapsedTime();
      this.card.position.y = Math.sin(elapsed * 1.5) * 0.06;
      this.card.shadowMesh.position.y = -1.25 - this.card.position.y * 0.5;
    }

    this.renderer.render(this.scene, this.camera);
  };

  public dispose(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    window.removeEventListener("resize", this.onWindowResize);
    if (this.container) {
      this.container.removeEventListener("pointermove", this.onPointerMove);
      this.container.removeEventListener("pointerdown", this.onPointerDown);
    }
    window.removeEventListener("pointerup", this.onPointerUp);

    if (this.card) {
      this.card.dispose();
      this.scene.remove(this.card);
    }

    this.renderer.dispose();
    if (this.renderer.domElement && this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
