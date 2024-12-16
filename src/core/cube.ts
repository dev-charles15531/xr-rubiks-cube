import * as BABYLON from "@babylonjs/core";

export class Cube {
  position: number[];
  mesh: BABYLON.Mesh;
  materials: BABYLON.MultiMaterial;

  /**
   * A cube in a 3D scene.
   * 
   * @class
   * @param {number[]} position - The position of the cube in 3D space.
   * @param {BABYLON.Scene} scene - The Babylon.js scene.
   */
  constructor(position: number[], scene: BABYLON.Scene) {
    /**
     * The position of the cube in 3D space.
     * @type {number[]}
     */
    this.position = position;
    /**
     * The mesh of the cube.
     * @type {BABYLON.Mesh}
     */
    this.mesh = this.createCubeMesh(scene);
    /**
     * The multi-material of the cube.
     * @type {BABYLON.MultiMaterial}
     */
    this.materials = this.createCubeMaterials(scene);
    this.applyMaterials(); // Apply the materials to the mesh
  }

  /**
   * Creates a cube mesh.
   * 
   * @param {BABYLON.Scene} scene - The Babylon.js scene.
   * @returns {BABYLON.Mesh} - The cube mesh.
   */
  createCubeMesh(scene: BABYLON.Scene): BABYLON.Mesh {
    const cube = BABYLON.MeshBuilder.CreateBox("cube", { size: 1 }, scene);
    cube.position.copyFromFloats(this.position[0], this.position[1], this.position[2])

    // Add a black outline to the cube
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
      // The number of vertices per face is 6 (2 triangles x 3 vertices each)
      new BABYLON.SubMesh(i, 0, vertices?.length! / 3, i * 6, 6, cube);
    }

    return cube;
  }

  /**
   * Creates materials for each face of the cube and assigns them to a MultiMaterial.
   * 
   * @param {BABYLON.Scene} scene - The Babylon.js scene.
   * @returns {BABYLON.MultiMaterial} - The MultiMaterial containing face-specific materials.
   */
  createCubeMaterials(scene: BABYLON.Scene): BABYLON.MultiMaterial {
    // Create red material for the left face
    const redMaterial = new BABYLON.StandardMaterial("redMaterial", scene);
    redMaterial.diffuseColor = BABYLON.Color3.Red();

    // Create green material for the back face
    const greenMaterial = new BABYLON.StandardMaterial("greenMaterial", scene);
    greenMaterial.diffuseColor = BABYLON.Color3.Green();

    // Create blue material for the front face
    const blueMaterial = new BABYLON.StandardMaterial("blueMaterial", scene);
    blueMaterial.diffuseColor = BABYLON.Color3.Blue();

    // Create yellow material for the bottom face
    const yellowMaterial = new BABYLON.StandardMaterial("yellowMaterial", scene);
    yellowMaterial.diffuseColor = BABYLON.Color3.Yellow();

    // Create white material for the top face
    const whiteMaterial = new BABYLON.StandardMaterial("whiteMaterial", scene);
    whiteMaterial.diffuseColor = BABYLON.Color3.White();

    // Create orange material for the right face
    const orangeMaterial = new BABYLON.StandardMaterial("orangeMaterial", scene);
    orangeMaterial.diffuseColor = new BABYLON.Color3(1, 0.647, 0); // Orange

    // Create a MultiMaterial and assign each face-specific material
    const multiMaterial = new BABYLON.MultiMaterial("multiMat", scene);
    multiMaterial.subMaterials = [
      blueMaterial,   // Front face
      greenMaterial,  // Back face
      redMaterial,    // Left face
      orangeMaterial, // Right face
      whiteMaterial,  // Top face
      yellowMaterial,  // Bottom face
    ];

    return multiMaterial;
  }

  // Apply the materials to the cube's mesh
  applyMaterials() {
    this.mesh.material = this.materials;
  }
}