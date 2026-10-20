import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { ReviewCard3D } from "../../three/ReviewCardMesh";
import { CardDesignConfig } from "../../types";

interface Cinematic3DStoryProps {
  onExploreCards: () => void;
  onOrderCustom: () => void;
}

export const Cinematic3DStory: React.FC<Cinematic3DStoryProps> = ({
  onExploreCards,
  onOrderCustom,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);

  const [activeScene, setActiveScene] = useState<1 | 2 | 3 | 4>(1);
  const [scrollProgress, setScrollProgress] = useState(0);

  // References for Three.js instance
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cardRef = useRef<ReviewCard3D | null>(null);
  const phoneGroupRef = useRef<THREE.Group | null>(null);
  const phoneScreenMatRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const clockRef = useRef(new THREE.Clock());

  // Mouse tilt variables
  const mouseTilt = useRef({ x: 0, y: 0 });

  // Default card configuration for cinematic hero
  const heroCardConfig: CardDesignConfig = {
    templateId: "black-gold",
    shape: "standard-card",
    themeMode: "dark",
    primaryColor: "#111114",
    secondaryColor: "#1d1d24",
    textColor: "#F7F4ED",
    accentColor: "#FFD447",
    fontFamily: "Plus Jakarta Sans",
    businessName: "L’Atelier Artisan",
    tagline: "Your Feedback Makes Us Better.",
    subText: "Tap with your phone or scan to review",
    googleReviewUrl: "https://g.page/r/latelier-artisan",
    logoScale: 1,
    qrStyle: "classic",
    enableNfc: true,
    enableQr: true,
    showGoogleLogo: true,
    showRatingStars: true,
    starRating: 5,
  };

  useEffect(() => {
    if (!canvasMountRef.current) return;
    const mount = canvasMountRef.current;
    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.2);
    cameraRef.current = camera;

    // 2. Renderer with PBR color setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mount.appendChild(renderer.domElement);

    // 3. Studio Environment Map
    try {
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      pmrem.dispose();
    } catch (e) {
      console.warn("Studio reflection fallback", e);
    }

    // 4. Studio Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x111114, 0.7);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(5, 6, 6);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xa88bff, 1.0);
    rimLight.position.set(-6, -2, -4);
    scene.add(rimLight);

    // 5. Hero 3D Card
    const card = new ReviewCard3D(heroCardConfig);
    card.rotation.set(0.1, -0.2, 0.04);
    scene.add(card);
    cardRef.current = card;

    // 6. 3D Smartphone Object for Scene 3 Tap demonstration
    const phoneGroup = new THREE.Group();
    // Phone body
    const phoneShape = new THREE.Shape();
    const pw = 2.4;
    const ph = 4.8;
    const pr = 0.28;
    const px = -pw / 2;
    const py = -ph / 2;
    phoneShape.moveTo(px + pr, py);
    phoneShape.lineTo(px + pw - pr, py);
    phoneShape.quadraticCurveTo(px + pw, py, px + pw, py + pr);
    phoneShape.lineTo(px + pw, py + ph - pr);
    phoneShape.quadraticCurveTo(px + pw, py + ph, px + pw - pr, py + ph);
    phoneShape.lineTo(px + pr, py + ph);
    phoneShape.quadraticCurveTo(px, py + ph, px, py + ph - pr);
    phoneShape.lineTo(px, py + pr);
    phoneShape.quadraticCurveTo(px, py, px + pr, py);

    const phoneGeo = new THREE.ExtrudeGeometry(phoneShape, {
      depth: 0.12,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    });
    phoneGeo.center();

    const phoneBodyMat = new THREE.MeshPhysicalMaterial({
      color: 0x1d1e22,
      metalness: 0.85,
      roughness: 0.2,
      clearcoat: 0.6,
    });

    const phoneMesh = new THREE.Mesh(phoneGeo, phoneBodyMat);
    phoneGroup.add(phoneMesh);

    // Phone Screen with procedural Google review prompt
    const screenCanvas = document.createElement("canvas");
    screenCanvas.width = 512;
    screenCanvas.height = 1024;
    const sctx = screenCanvas.getContext("2d");
    if (sctx) {
      sctx.fillStyle = "#FFFFFF";
      sctx.fillRect(0, 0, 512, 1024);

      // Status bar
      sctx.fillStyle = "#111114";
      sctx.font = "bold 24px monospace";
      sctx.fillText("9:41", 40, 50);

      // Card Header
      sctx.fillStyle = "#2864FF";
      sctx.beginPath();
      sctx.roundRect(40, 100, 70, 70, 16);
      sctx.fill();
      sctx.fillStyle = "#FFFFFF";
      sctx.font = "bold 36px 'Plus Jakarta Sans', sans-serif";
      sctx.fillText("G", 62, 150);

      sctx.fillStyle = "#111114";
      sctx.font = "bold 32px 'Plus Jakarta Sans', sans-serif";
      sctx.fillText("L’Atelier Artisan", 130, 135);
      sctx.font = "22px sans-serif";
      sctx.fillStyle = "#666666";
      sctx.fillText("Google Business Profile", 130, 165);

      // Rating Box
      sctx.fillStyle = "#F8F9FA";
      sctx.beginPath();
      sctx.roundRect(40, 210, 432, 280, 20);
      sctx.fill();

      sctx.fillStyle = "#111114";
      sctx.font = "bold 28px sans-serif";
      sctx.fillText("Rate your experience", 70, 260);

      // Stars
      sctx.fillStyle = "#FBBC05";
      sctx.font = "48px sans-serif";
      sctx.fillText("★★★★★", 70, 330);

      sctx.fillStyle = "#2864FF";
      sctx.beginPath();
      sctx.roundRect(70, 390, 372, 60, 14);
      sctx.fill();
      sctx.fillStyle = "#FFFFFF";
      sctx.font = "bold 24px sans-serif";
      sctx.fillText("Post Review", 185, 430);
    }

    const screenTex = new THREE.CanvasTexture(screenCanvas);
    screenTex.colorSpace = THREE.SRGBColorSpace;
    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTex,
      transparent: true,
      opacity: 0.95,
    });
    phoneScreenMatRef.current = screenMat;

    const screenPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 4.4),
      screenMat
    );
    screenPlane.position.z = 0.08;
    phoneGroup.add(screenPlane);

    // Initial position of phone: hidden off-screen above
    phoneGroup.position.set(2.4, 6.0, 1.2);
    phoneGroup.rotation.set(-0.3, -0.4, 0.2);
    scene.add(phoneGroup);
    phoneGroupRef.current = phoneGroup;

    // 7. Render Loop with Smooth Scroll Choreography
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clockRef.current.getDelta();
      const elapsed = clockRef.current.getElapsedTime();

      // Read current scroll progress from container
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const totalHeight = containerRef.current.scrollHeight - window.innerHeight;
        const currentY = -rect.top;
        const progress = Math.max(0, Math.min(1, currentY / (totalHeight || 1)));
        setScrollProgress(progress);

        // Determine scene based on progress
        if (progress < 0.25) setActiveScene(1);
        else if (progress < 0.55) setActiveScene(2);
        else if (progress < 0.82) setActiveScene(3);
        else setActiveScene(4);

        // Choreograph 3D objects based on normalized progress
        if (cardRef.current) {
          const card = cardRef.current;

          if (progress < 0.25) {
            // SCENE 1: Reveal & Hero
            const t = progress / 0.25;
            const targetX = 0;
            const targetY = Math.sin(elapsed * 1.5) * 0.08;
            const targetZ = 0;
            const targetRotX = 0.1 + mouseTilt.current.y * 0.25;
            const targetRotY = -0.25 + mouseTilt.current.x * 0.35 + Math.sin(elapsed * 0.6) * 0.05;
            const targetRotZ = 0.04;

            card.position.x = THREE.MathUtils.damp(card.position.x, targetX, 5, delta);
            card.position.y = THREE.MathUtils.damp(card.position.y, targetY, 5, delta);
            card.position.z = THREE.MathUtils.damp(card.position.z, targetZ, 5, delta);
            card.rotation.x = THREE.MathUtils.damp(card.rotation.x, targetRotX, 5, delta);
            card.rotation.y = THREE.MathUtils.damp(card.rotation.y, targetRotY, 5, delta);
            card.rotation.z = THREE.MathUtils.damp(card.rotation.z, targetRotZ, 5, delta);
            card.scale.set(1.0, 1.0, 1.0);

            // Hide phone
            if (phoneGroupRef.current) {
              phoneGroupRef.current.position.y = THREE.MathUtils.damp(
                phoneGroupRef.current.position.y,
                6.0,
                5,
                delta
              );
            }
          } else if (progress < 0.55) {
            // SCENE 2: Approach & Thickness inspection
            const t = (progress - 0.25) / 0.3;
            // Move close to camera and turn edge to reveal 0.84mm thickness
            const targetX = 0.4;
            const targetY = 0;
            const targetZ = 1.2;
            const targetRotX = 0.2;
            const targetRotY = 1.25; // angled side profile
            const targetRotZ = 0.15;

            card.position.x = THREE.MathUtils.damp(card.position.x, targetX, 6, delta);
            card.position.y = THREE.MathUtils.damp(card.position.y, targetY, 6, delta);
            card.position.z = THREE.MathUtils.damp(card.position.z, targetZ, 6, delta);
            card.rotation.x = THREE.MathUtils.damp(card.rotation.x, targetRotX, 6, delta);
            card.rotation.y = THREE.MathUtils.damp(card.rotation.y, targetRotY, 6, delta);
            card.rotation.z = THREE.MathUtils.damp(card.rotation.z, targetRotZ, 6, delta);

            if (phoneGroupRef.current) {
              phoneGroupRef.current.position.y = THREE.MathUtils.damp(
                phoneGroupRef.current.position.y,
                5.0,
                5,
                delta
              );
            }
          } else if (progress < 0.82) {
            // SCENE 3: The Tap with Smartphone
            const t = (progress - 0.55) / 0.27;
            // Card settles flat slightly to left
            const targetX = -1.1;
            const targetY = -0.1;
            const targetZ = 0.4;
            const targetRotX = 0.45;
            const targetRotY = -0.1;
            const targetRotZ = 0.02;

            card.position.x = THREE.MathUtils.damp(card.position.x, targetX, 6, delta);
            card.position.y = THREE.MathUtils.damp(card.position.y, targetY, 6, delta);
            card.position.z = THREE.MathUtils.damp(card.position.z, targetZ, 6, delta);
            card.rotation.x = THREE.MathUtils.damp(card.rotation.x, targetRotX, 6, delta);
            card.rotation.y = THREE.MathUtils.damp(card.rotation.y, targetRotY, 6, delta);
            card.rotation.z = THREE.MathUtils.damp(card.rotation.z, targetRotZ, 6, delta);

            // Phone glides in near the top of the card
            if (phoneGroupRef.current) {
              const phoneTargetX = 0.9;
              const phoneTargetY = 0.15;
              const phoneTargetZ = 0.8;
              const phoneTargetRotX = 0.25;
              const phoneTargetRotY = -0.3;
              const phoneTargetRotZ = 0.08;

              phoneGroupRef.current.position.x = THREE.MathUtils.damp(
                phoneGroupRef.current.position.x,
                phoneTargetX,
                6,
                delta
              );
              phoneGroupRef.current.position.y = THREE.MathUtils.damp(
                phoneGroupRef.current.position.y,
                phoneTargetY,
                6,
                delta
              );
              phoneGroupRef.current.position.z = THREE.MathUtils.damp(
                phoneGroupRef.current.position.z,
                phoneTargetZ,
                6,
                delta
              );
              phoneGroupRef.current.rotation.x = THREE.MathUtils.damp(
                phoneGroupRef.current.rotation.x,
                phoneTargetRotX,
                6,
                delta
              );
              phoneGroupRef.current.rotation.y = THREE.MathUtils.damp(
                phoneGroupRef.current.rotation.y,
                phoneTargetRotY,
                6,
                delta
              );
              phoneGroupRef.current.rotation.z = THREE.MathUtils.damp(
                phoneGroupRef.current.rotation.z,
                phoneTargetRotZ,
                6,
                delta
              );
            }
          } else {
            // SCENE 4: The Result (Tap. Review. Grow.)
            const targetX = 0;
            const targetY = -0.4;
            const targetZ = -0.2;
            const targetRotX = 0.05;
            const targetRotY = 0;
            const targetRotZ = 0;

            card.position.x = THREE.MathUtils.damp(card.position.x, targetX, 5, delta);
            card.position.y = THREE.MathUtils.damp(card.position.y, targetY, 5, delta);
            card.position.z = THREE.MathUtils.damp(card.position.z, targetZ, 5, delta);
            card.rotation.x = THREE.MathUtils.damp(card.rotation.x, targetRotX, 5, delta);
            card.rotation.y = THREE.MathUtils.damp(card.rotation.y, targetRotY, 5, delta);
            card.rotation.z = THREE.MathUtils.damp(card.rotation.z, targetRotZ, 5, delta);

            // Hide phone
            if (phoneGroupRef.current) {
              phoneGroupRef.current.position.y = THREE.MathUtils.damp(
                phoneGroupRef.current.position.y,
                5.0,
                5,
                delta
              );
            }
          }
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Pointer move for subtle hero tilt
    const handlePointerMove = (e: MouseEvent) => {
      mouseTilt.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener("mousemove", handlePointerMove);

    // Resize handler
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("resize", handleResize);

      if (cardRef.current) cardRef.current.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="relative bg-[#111114] text-[#F7F4ED]">
      {/* Fixed Sticky WebGL Canvas Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none z-10">
        <div
          ref={canvasMountRef}
          className="w-full h-full pointer-events-auto"
          title="Cinematic 3D NFC Review Card"
        />

        {/* Ambient Vignette & Cinema Lettering */}
        <div className="absolute inset-0 pointer-events-none bg-radial from-transparent via-[#111114]/20 to-[#111114]/80" />
      </div>

      {/* Scrollable Story HTML Chapters (Layered on Top of the 3D Scene) */}
      <div className="relative z-20 -mt-[100vh]">
        {/* SCENE 1 — REVEAL (Hero Stage) */}
        <section id="hero" className="min-h-screen flex items-center px-6 lg:px-16 pointer-events-none">
          <div className="max-w-2xl space-y-6 pointer-events-auto text-left pt-20">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#FFD447]">
              <span>01 // Cinematic Reveal</span>
              <span aria-hidden="true">·</span>
              <span>13.56 MHz Contactless NFC</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95] text-white [text-wrap:balance]">
              Turn Every Experience
              <br />
              <span className="text-neutral-400 font-serif font-normal italic">
                Into a Review.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 max-w-md font-normal leading-relaxed">
              One tap makes sharing feedback effortless. Engineered with tactile matte PVC, precision NTAG microchips, and optical QR verification.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onExploreCards}
                className="px-7 py-4 bg-white hover:bg-neutral-200 text-[#111114] font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Explore the Cards</span>
                <span>↓</span>
              </button>

              <button
                onClick={onOrderCustom}
                className="px-6 py-4 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center justify-center"
              >
                Order a Custom Design
              </button>
            </div>
          </div>
        </section>

        {/* SCENE 2 — APPROACH & THICKNESS */}
        <section className="min-h-screen flex items-center justify-end px-6 lg:px-16 pointer-events-none">
          <div className="max-w-xl space-y-5 pointer-events-auto text-left bg-black/40 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl">
            <span className="text-xs font-mono font-bold tracking-widest text-[#2864FF] uppercase">
              Scene 02 // Physical Craft
            </span>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Designed to Be Remembered.
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              Calibrated to the exact 0.84mm standard card profile with CNC-milled 3.18mm rounded corners. Tactile velvet-touch coating resists finger oils, counter spills, and heavy commercial use.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-neutral-400 block text-[10px]">Thickness</span>
                <span className="font-bold text-white text-base">0.84 mm</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-neutral-400 block text-[10px]">Transponder</span>
                <span className="font-bold text-[#FFD447] text-base">NTAG213</span>
              </div>
            </div>
          </div>
        </section>

        {/* SCENE 3 — THE TAP */}
        <section className="min-h-screen flex items-center px-6 lg:px-16 pointer-events-none">
          <div className="max-w-xl space-y-5 pointer-events-auto text-left bg-black/40 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl">
            <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
              Scene 03 // Contactless Interaction
            </span>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              One Tap.
              <br />
              <span className="text-neutral-400 font-serif font-normal italic">
                Direct to Your Review.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              No apps to install. No searching for your business name. When customers hold any iPhone or Android phone near the card, an instant prompt opens your official Google review dialog.
            </p>

            <div className="flex items-center gap-4 text-xs font-mono text-emerald-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Under 0.5s Connection
              </span>
              <span>·</span>
              <span>100% Battery-Free</span>
            </div>
          </div>
        </section>

        {/* SCENE 4 — THE RESULT */}
        <section id="how-it-works" className="min-h-screen flex items-center justify-center px-6 lg:px-16 pointer-events-none">
          <div className="max-w-2xl space-y-8 pointer-events-auto text-center bg-black/60 backdrop-blur-md p-10 sm:p-12 rounded-3xl border border-white/10 shadow-2xl">
            <span className="text-xs font-mono font-bold tracking-widest text-[#FFD447] uppercase">
              Scene 04 // The Result
            </span>

            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-white">
              Tap. Review. Grow.
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 max-w-lg mx-auto leading-relaxed">
              Happy customers leave reviews when it's effortless. ReviewTap eliminates friction at checkout, turning delightful dining, shopping, and clinic visits into 5-star public ratings.
            </p>

            <div className="grid grid-cols-3 gap-4 text-xs font-mono pt-4 text-left border-t border-white/10">
              <div className="space-y-1">
                <span className="text-[#2864FF] font-bold block text-sm">01 / Tap</span>
                <span className="text-neutral-400 block text-[11px]">Hold phone over NFC chip or scan QR</span>
              </div>
              <div className="space-y-1">
                <span className="text-[#FFD447] font-bold block text-sm">02 / Review</span>
                <span className="text-neutral-400 block text-[11px]">5-star rating box opens automatically</span>
              </div>
              <div className="space-y-1">
                <span className="text-emerald-400 font-bold block text-sm">03 / Grow</span>
                <span className="text-neutral-400 block text-[11px]">Local Google Maps authority multiplies</span>
              </div>
            </div>

            <button
              onClick={onExploreCards}
              className="px-8 py-4 bg-white hover:bg-neutral-200 text-[#111114] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <span>Explore Ready-Made Designs</span>
              <span>↓</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
