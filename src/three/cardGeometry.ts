import * as THREE from "three";

/**
 * Creates an ISO/IEC 7810 standard credit/review card geometry with rounded corners,
 * realistic thickness, and precision bevels.
 * Standard card aspect: 85.6mm x 54.0mm -> ratio ~ 1.585
 */
export function createReviewCardGeometry(
  width = 3.4,
  height = 2.14,
  radius = 0.16,
  depth = 0.05
): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;

  // Draw rounded rectangle
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: depth,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.012,
    bevelThickness: 0.012,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geometry.center();

  // Custom UV mapping for front and back faces
  const pos = geometry.attributes.position;
  const uvs = geometry.attributes.uv;

  for (let i = 0; i < pos.count; i++) {
    const px = pos.getX(i);
    const py = pos.getY(i);
    const pz = pos.getZ(i);

    // Front face (positive Z)
    if (pz > depth / 2) {
      const u = (px + width / 2) / width;
      const v = (py + height / 2) / height;
      uvs.setXY(i, u, v);
    }
    // Back face (negative Z)
    else if (pz < -depth / 2) {
      const u = 1 - (px + width / 2) / width; // mirrored for back
      const v = (py + height / 2) / height;
      uvs.setXY(i, u, v);
    }
  }
  uvs.needsUpdate = true;
  geometry.computeVertexNormals();

  return geometry;
}
