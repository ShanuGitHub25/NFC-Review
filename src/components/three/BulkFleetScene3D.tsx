import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { ReviewCard3D } from "../../three/ReviewCardMesh";
import { CardDesignConfig } from "../../types";

interface BulkFleetScene3DProps {
  onOpenBulkForm: () => void;
}

export const BulkFleetScene3D: React.FC<BulkFleetScene3DProps> = ({ onOpenBulkForm }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [spreadMode, setSpreadMode] = useState<"fanned" | "stacked" | "grid">("fanned");

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 3. Environment & Lighting
    try {
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      pmrem.dispose();
    } catch {
      // Fallback
    }

    const hemi = new THREE.HemisphereLight(0xffffff, 0x111114, 0.8);
    scene.add(hemi);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // 4. Create 3 distinct branch fleet cards
    const fleetConfigs: CardDesignConfig[] = [
      {
        templateId: "cream-forest",
        shape: "standard-card",
        themeMode: "light",
        primaryColor: "#164C37",
        secondaryColor: "#123B2B",
        textColor: "#FFFFFF",
        accentColor: "#FFD447",
        fontFamily: "Plus Jakarta Sans",
        businessName: "Flagship / Indiranagar",
        tagline: "Your Feedback Makes Us Better.",
        subText: "Branch #01 · Central Counter",
        googleReviewUrl: "https://g.page/r/flagship-ind",
        logoScale: 1,
        qrStyle: "classic",
        enableNfc: true,
        enableQr: true,
        showGoogleLogo: true,
        showRatingStars: true,
        starRating: 5,
      },
      {
        templateId: "black-gold",
        shape: "standard-card",
        themeMode: "dark",
        primaryColor: "#17191D",
        secondaryColor: "#23262C",
        textColor: "#F8F6F0",
        accentColor: "#FFD447",
        fontFamily: "Playfair Display",
        businessName: "Suite / Bandra West",
        tagline: "Your Feedback Makes Us Better.",
        subText: "Branch #02 · VIP Lounge",
        googleReviewUrl: "https://g.page/r/suite-ban",
        logoScale: 1,
        qrStyle: "classic",
        enableNfc: true,
        enableQr: true,
        showGoogleLogo: true,
        showRatingStars: true,
        starRating: 5,
      },
      {
        templateId: "sky-blue",
        shape: "standard-card",
        themeMode: "light",
        primaryColor: "#EEF4FF",
        secondaryColor: "#DCE8FD",
        textColor: "#122A5E",
        accentColor: "#2864F0",
        fontFamily: "Manrope",
        businessName: "Kiosk / Airport T2",
        tagline: "Your Feedback Makes Us Better.",
        subText: "Branch #03 · Express Departure",
        googleReviewUrl: "https://g.page/r/kiosk-t2",
        logoScale: 1,
        qrStyle: "classic",
        enableNfc: true,
        enableQr: true,
        showGoogleLogo: true,
        showRatingStars: true,
        starRating: 5,
      },
    ];

    const cardMeshes: ReviewCard3D[] = [];
    fleetConfigs.forEach((cfg, idx) => {
      const card = new ReviewCard3D(cfg);
      card.scale.set(0.9, 0.9, 0.9);
      cardMeshes.push(card);
      scene.add(card);
    });

    // 5. Animation loop with fanned layout
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      cardMeshes.forEach((card, idx) => {
        const offset = idx - 1; // -1, 0, 1

        if (spreadMode === "fanned") {
          const targetX = offset * 2.2;
          const targetY = Math.sin(elapsed + idx) * 0.1 - Math.abs(offset) * 0.2;
          const targetRotZ = -offset * 0.12;
          const targetRotY = offset * 0.25;

          card.position.x = THREE.MathUtils.damp(card.position.x, targetX, 5, 0.016);
          card.position.y = THREE.MathUtils.damp(card.position.y, targetY, 5, 0.016);
          card.position.z = THREE.MathUtils.damp(card.position.z, -Math.abs(offset) * 0.6, 5, 0.016);
          card.rotation.z = THREE.MathUtils.damp(card.rotation.z, targetRotZ, 5, 0.016);
          card.rotation.y = THREE.MathUtils.damp(card.rotation.y, targetRotY, 5, 0.016);
        } else if (spreadMode === "stacked") {
          const targetX = offset * 0.1;
          const targetY = offset * 0.1;
          const targetZ = -offset * 0.3;

          card.position.x = THREE.MathUtils.damp(card.position.x, targetX, 5, 0.016);
          card.position.y = THREE.MathUtils.damp(card.position.y, targetY, 5, 0.016);
          card.position.z = THREE.MathUtils.damp(card.position.z, targetZ, 5, 0.016);
          card.rotation.z = THREE.MathUtils.damp(card.rotation.z, 0, 5, 0.016);
          card.rotation.y = THREE.MathUtils.damp(card.rotation.y, 0, 5, 0.016);
        } else {
          // Grid
          const targetX = offset * 2.6;
          card.position.x = THREE.MathUtils.damp(card.position.x, targetX, 5, 0.016);
          card.position.y = THREE.MathUtils.damp(card.position.y, 0, 5, 0.016);
          card.position.z = THREE.MathUtils.damp(card.position.z, 0, 5, 0.016);
          card.rotation.z = THREE.MathUtils.damp(card.rotation.z, 0, 5, 0.016);
          card.rotation.y = THREE.MathUtils.damp(card.rotation.y, 0, 5, 0.016);
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      cardMeshes.forEach((c) => c.dispose());
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [spreadMode]);

  return (
    <div className="w-full flex flex-col items-center">
      <div
        ref={mountRef}
        className="w-full h-[360px] sm:h-[420px] relative cursor-pointer"
        title="3D Multi-Branch Review Fleet"
      />

      {/* Spatial Spread Mode Selector */}
      <div className="flex items-center gap-2 p-1 bg-white/10 rounded-xl text-xs font-semibold backdrop-blur-md border border-white/10 mt-2">
        <button
          onClick={() => setSpreadMode("fanned")}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            spreadMode === "fanned" ? "bg-white text-[#111114]" : "text-neutral-300 hover:text-white"
          }`}
        >
          Fanned Out Fleet
        </button>
        <button
          onClick={() => setSpreadMode("grid")}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            spreadMode === "grid" ? "bg-white text-[#111114]" : "text-neutral-300 hover:text-white"
          }`}
        >
          Branch Alignment
        </button>
        <button
          onClick={() => setSpreadMode("stacked")}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            spreadMode === "stacked" ? "bg-white text-[#111114]" : "text-neutral-300 hover:text-white"
          }`}
        >
          Deck Stack
        </button>
      </div>
    </div>
  );
};
