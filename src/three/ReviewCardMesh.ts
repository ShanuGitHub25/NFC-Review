import * as THREE from "three";
import { CardDesignConfig } from "../types";
import { createReviewCardGeometry } from "./cardGeometry";
import {
  createCardFrontTexture,
  createCardBackTexture,
  createContactShadowTexture,
} from "./cardTextures";

export class ReviewCard3D extends THREE.Group {
  public cardMesh: THREE.Mesh;
  public shadowMesh: THREE.Mesh;
  public nfcRingsGroup: THREE.Group;
  private frontMaterial: THREE.MeshPhysicalMaterial;
  private backMaterial: THREE.MeshPhysicalMaterial;
  private edgeMaterial: THREE.MeshPhysicalMaterial;
  private ringMaterials: THREE.MeshBasicMaterial[] = [];
  public currentConfig: CardDesignConfig;

  constructor(initialConfig: CardDesignConfig, maxAnisotropy = 8) {
    super();
    this.currentConfig = { ...initialConfig };

    // 1. Card Geometry
    const geometry = createReviewCardGeometry(3.4, 2.14, 0.16, 0.045);

    // 2. Materials
    this.frontMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.22,
      metalness: 0.04,
      clearcoat: 0.85,
      clearcoatRoughness: 0.12,
      reflectivity: 0.6,
    });

    this.backMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.25,
      metalness: 0.02,
      clearcoat: 0.6,
      clearcoatRoughness: 0.18,
    });

    this.edgeMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(initialConfig.primaryColor),
      roughness: 0.35,
      metalness: 0.1,
    });

    // Multi-material assignment: [side/edges, front, back]
    // ExtrudeGeometry generates 2 groups: 0 = sides/bevels, 1 = front/back caps
    // Or we can use front/back faces with groups:
    geometry.clearGroups();
    // In ExtrudeGeometry: sides are from 0 to vertexCount - capsCount
    const totalVertices = geometry.attributes.position.count;
    geometry.addGroup(0, totalVertices, 0); // edge & bevels
    geometry.addGroup(0, totalVertices, 1); // front
    geometry.addGroup(0, totalVertices, 2); // back

    this.cardMesh = new THREE.Mesh(geometry, [
      this.edgeMaterial,
      this.frontMaterial,
      this.backMaterial,
    ]);
    this.cardMesh.castShadow = true;
    this.cardMesh.receiveShadow = false;
    this.add(this.cardMesh);

    // 3. Contact Shadow Plane Grounding
    const shadowGeo = new THREE.PlaneGeometry(4.2, 3.0);
    const shadowTex = createContactShadowTexture();
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });
    this.shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    this.shadowMesh.rotation.x = -Math.PI / 2;
    this.shadowMesh.position.y = -1.25;
    this.add(this.shadowMesh);

    // 4. Contactless NFC Pulse Rings (for interaction animation)
    this.nfcRingsGroup = new THREE.Group();
    this.nfcRingsGroup.position.set(0, 0, 0.06);
    this.nfcRingsGroup.visible = false;

    for (let r = 0; r < 3; r++) {
      const ringGeo = new THREE.RingGeometry(0.3, 0.34, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(0x2864ff),
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      this.ringMaterials.push(ringMat);
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      this.nfcRingsGroup.add(ringMesh);
    }
    this.add(this.nfcRingsGroup);

    // Initial texture generation
    this.updateDesign(initialConfig, maxAnisotropy);
  }

  /**
   * Updates textures and materials dynamically when user adjusts customization options
   */
  public async updateDesign(config: CardDesignConfig, maxAnisotropy = 8): Promise<void> {
    this.currentConfig = { ...config };

    // Update edge color to match primary substrate
    this.edgeMaterial.color.set(config.primaryColor);

    // Generate fresh front texture
    const frontTex = await createCardFrontTexture(config, maxAnisotropy);
    if (this.frontMaterial.map) {
      this.frontMaterial.map.dispose();
    }
    this.frontMaterial.map = frontTex;
    this.frontMaterial.needsUpdate = true;

    // Generate fresh back texture
    const backTex = createCardBackTexture(config, maxAnisotropy);
    if (this.backMaterial.map) {
      this.backMaterial.map.dispose();
    }
    this.backMaterial.map = backTex;
    this.backMaterial.needsUpdate = true;
  }

  /**
   * Triggers an animated contactless NFC pulse wave
   */
  public triggerNfcPulse(): void {
    this.nfcRingsGroup.visible = true;
    let progress = 0;

    const animateRings = () => {
      progress += 0.025;
      this.ringMaterials.forEach((mat, idx) => {
        const ringProgress = (progress - idx * 0.2 + 1) % 1;
        const scale = 0.5 + ringProgress * 2.8;
        this.nfcRingsGroup.children[idx].scale.set(scale, scale, 1);
        mat.opacity = Math.max(0, 1 - ringProgress) * 0.75;
      });

      if (progress < 2.0) {
        requestAnimationFrame(animateRings);
      } else {
        this.nfcRingsGroup.visible = false;
        this.ringMaterials.forEach((m) => (m.opacity = 0));
      }
    };

    animateRings();
  }

  public dispose(): void {
    if (this.cardMesh.geometry) this.cardMesh.geometry.dispose();
    if (this.shadowMesh.geometry) this.shadowMesh.geometry.dispose();
    if (this.frontMaterial.map) this.frontMaterial.map.dispose();
    if (this.backMaterial.map) this.backMaterial.map.dispose();
    this.frontMaterial.dispose();
    this.backMaterial.dispose();
    this.edgeMaterial.dispose();
    this.ringMaterials.forEach((m) => m.dispose());
  }
}
