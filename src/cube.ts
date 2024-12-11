import * as BABYLON from "@babylonjs/core";

export class Cube {
  position: number[];
  mesh: BABYLON.Mesh;
  materials: BABYLON.MultiMaterial;

  constructor(position: number[], scene: BABYLON.Scene) {
    this.position = position;
    this.mesh = this.createCubeMesh(scene);
    this.materials = this.createCubeMaterials(scene);
    this.applyMaterials();
  }

  // Create cube mesh
  createCubeMesh(scene: BABYLON.Scene): BABYLON.Mesh {
    const cube = BABYLON.MeshBuilder.CreateBox("cube", { size: 1 }, scene);
    cube.position.copyFromFloats(this.position[0], this.position[1], this.position[2])
    cube.enableEdgesRendering();
    cube.edgesColor = new BABYLON.Color4(0, 0, 0, 1);
    cube.edgesWidth = 5;

    // Apply different materials to each face of the box
    cube.subMeshes = []; // Reset any default subMeshes
    const vertices: BABYLON.Nullable<BABYLON.FloatArray> = cube.getVerticesData(
      BABYLON.VertexBuffer.PositionKind
    );

    // Create sub-meshes for each face
    for (let i = 0; i < 6; i++) {
      new BABYLON.SubMesh(i, 0, vertices?.length! / 3, i * 6, 6, cube);
    }

    return cube;
  }

  // Create cube materials
  createCubeMaterials(scene: BABYLON.Scene): BABYLON.MultiMaterial {
    const redMaterial = new BABYLON.StandardMaterial("redMaterial", scene);
    redMaterial.diffuseColor = BABYLON.Color3.Red();
    const greenMaterial = new BABYLON.StandardMaterial("greenMaterial", scene);
    greenMaterial.diffuseColor = BABYLON.Color3.Green();
    const blueMaterial = new BABYLON.StandardMaterial("blueMaterial", scene);
    blueMaterial.diffuseColor = BABYLON.Color3.Blue();
    const yellowMaterial = new BABYLON.StandardMaterial(
      "yellowMaterial",
      scene
    );
    yellowMaterial.diffuseColor = BABYLON.Color3.Yellow();
    const whiteMaterial = new BABYLON.StandardMaterial("whiteMaterial", scene);
    whiteMaterial.diffuseColor = BABYLON.Color3.White();
    const orangeMaterial = new BABYLON.StandardMaterial(
      "orangeMaterial",
      scene
    );
    orangeMaterial.diffuseColor = new BABYLON.Color3(1, 0.647, 0); // Orange

    // Apply the materials to the faces of the cube
    const multiMaterial = new BABYLON.MultiMaterial("multiMat", scene);
    multiMaterial.subMaterials = [
      blueMaterial, // Front face
      greenMaterial, // Back face
      redMaterial, // Left face
      orangeMaterial, // Right face
      whiteMaterial, // Top face
      yellowMaterial, // Bottom face
    ];

    return multiMaterial;
  }

  // Apply the materials to the cube's mesh
  applyMaterials() {
    this.mesh.material = this.materials;
  }
}