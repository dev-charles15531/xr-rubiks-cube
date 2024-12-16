import * as BABYLON from "@babylonjs/core";
import { Cube } from "./cube";
import { Animation } from "../features/animation";

// CubeGrid to manage the whole Rubik's Cube
export class CubeGrid {
  private scene: BABYLON.Scene;
  private cubeNode: BABYLON.TransformNode;
  private sideNode: BABYLON.TransformNode;
  private cubes: Cube[] = [];
  private facePlanes: BABYLON.Mesh[] = [];

  /**
   * The constructor for the CubeGrid class.
   *
   * This constructor does the following:
   * 1. Initializes the root node for the cube, cubeNode.
   * 2. Initializes the node for rotating sides, sideNode.
   * 3. Sets the parent of sideNode to cubeNode.
   * 4. Stores the scene.
   * 5. Initializes the cubes.
   *
   * @param {BABYLON.Scene} scene The scene to store and initialize the cubes in.
   */
  constructor(scene: BABYLON.Scene) {
    // Initialize the root node for the cube
    this.cubeNode = new BABYLON.TransformNode("cube");

    // Initialize the node for rotating sides
    this.sideNode = new BABYLON.TransformNode("rotating");
    this.sideNode.position.copyFrom(BABYLON.Vector3.Zero());
    this.sideNode.rotationQuaternion = BABYLON.Quaternion.Identity();
    this.sideNode.parent = this.cubeNode;

    // initialize cubes
    this.cubes = [];

    // Create the planes to represent the 2D faces of the Rubik's Cube
    const frontFacePlane = BABYLON.MeshBuilder.CreatePlane(
      "frontFacePlane",
      { size: 3 },
      scene
    );
    frontFacePlane.position = new BABYLON.Vector3(0, 0, 2); 
    frontFacePlane.rotation = new BABYLON.Vector3(0, Math.PI, 0); 

    const backFacePlane = BABYLON.MeshBuilder.CreatePlane(
      "backFacePlane",
      { size: 3 },
      scene
    );
    backFacePlane.position = new BABYLON.Vector3(0, 0, -2); 
    backFacePlane.rotation = new BABYLON.Vector3(0, -Math.PI, 0); 

    const topFacePlane = BABYLON.MeshBuilder.CreatePlane(
      "topFacePlane",
      { size: 3 },
      scene
    );
    topFacePlane.position = new BABYLON.Vector3(0, 2, 0); 
    topFacePlane.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0); 

    const bottomFacePlane = BABYLON.MeshBuilder.CreatePlane(
      "bottomFacePlane",
      { size: 3 },
      scene
    );
    bottomFacePlane.position = new BABYLON.Vector3(0, -2, 0); 
    bottomFacePlane.rotation = new BABYLON.Vector3(-Math.PI / 2, 0, 0); 

    const leftFacePlane = BABYLON.MeshBuilder.CreatePlane(
      "leftFacePlane",
      { size: 3 },
      scene
    );
    leftFacePlane.position = new BABYLON.Vector3(-2, 0, 0); 
    leftFacePlane.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0); 

    const rightFacePlane = BABYLON.MeshBuilder.CreatePlane(
      "rightFacePlane",
      { size: 3 },
      scene
    );
    rightFacePlane.position = new BABYLON.Vector3(2, 0, 0); 
    rightFacePlane.rotation = new BABYLON.Vector3(0, -Math.PI / 2, 0); 

    this.facePlanes.push(
      frontFacePlane, // front
      backFacePlane,  // back
      rightFacePlane,
      leftFacePlane,  
      topFacePlane, 
      bottomFacePlane,
    );

    // setup animation
    const animation = new Animation();
    animation.buildSideNodeAnimation(this.sideNode);

    // Store the scene and initialize cubes
    this.scene = scene;
    this.initializeCubes();
  }

  /**
   * Initializes the cubes in a 3x3x3 grid.
   *
   * This function creates an array of Cube instances to form the larger cube.
   * It iterates over the 3x3x3 grid of positions, creates a new Cube instance at
   * each position, and sets the parent of each cube to the root node.
   */
  private initializeCubes() {
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        for (let k = 0; k < 3; k++) {
          const positionArray: number[] = [i - 1, j - 1, k - 1];
          const c: Cube = new Cube(positionArray, this.scene);

          // Set the parent of each cube to the root node
          c.mesh.setParent(this.cubeNode);

          this.cubes.push(c);
        }

    // rotate the larger cube to test rotation is independent of larger cube pos/rot.
    this.cubeNode.rotation = new BABYLON.Vector3(Math.PI / 4, Math.PI / 4, 0);

    // Set the parent of the front face plane to the root node
    this.facePlanes.forEach((p, idx) => {
      p.parent = this.cubeNode; // Set the parent of the front face plane to the root node(this.cubeNode);

      this.initFacePlane(p, idx);
    });
  }

  /**
   * Returns the TransformNode of the side of the cube that can be rotated.
   *
   * @returns {BABYLON.TransformNode} The TransformNode of the side of the cube.
   */
  public getSideNode(): BABYLON.TransformNode {
    return this.sideNode;
  }

  /**
   * Resets the sideNode's position and rotation to identity, and sets the
   * parent of its child meshes back to the cubeNode.
   */
  private sideNodeCleanup() {
    this.sideNode
      .getChildMeshes(true)
      .forEach((c) => c.setParent(this.cubeNode));
    this.sideNode.position.copyFrom(BABYLON.Vector3.Zero());
    this.sideNode.rotationQuaternion?.copyFrom(BABYLON.Quaternion.Identity());
  }

  /**
   * Starts the animation of rotating a side of the cube.
   *
   * This function does the following:
   * 1. Sets the position of the sideNode to the rotation axis.
   * 2. Selects and groups meshes on the chosen side into the sideNode.
   * 3. Prepares the final frame of the animation.
   * 4. Begins the animation and binds the cleanup method.
   *
   * @param {Function} choosingFunction A function that determines whether a mesh belongs on the side.
   * @param {BABYLON.Vector3} axis The axis of rotation.
   * @param {number} amount The amount of rotation.
   */
  public sideNodeStartup(
    choosingFunction: any,
    axis: BABYLON.DeepImmutableObject<BABYLON.Vector3>,
    amount: number
  ) {
    // Set the position of the sideNode to the rotation axis
    this.sideNode.position.copyFrom(axis);

    // Select and group meshes on the chosen side
    var side = Array.from(
      this.sideNode.parent!.getChildMeshes(true).filter(choosingFunction)
    );
    side.forEach((c) => c.setParent(this.sideNode));

    // Prepare the final frame of the animation
    const rotAnim = this.sideNode.animations[0];
    const keys = rotAnim.getKeys();
    const key = keys[keys.length - 1];
    BABYLON.Quaternion.RotationAxisToRef(axis, amount, key.value);

    // Begin the animation and bind the cleanup method
    this.scene.beginAnimation(
      this.sideNode,
      0,
      key.frame,
      false,
      1,
      this.sideNodeCleanup.bind(this)
    );

    // Apply the colors from the Rubik's Cube to the texture
    this.facePlanes.forEach((p, idx) => {
      this.initFacePlane(p, idx);
    });
  }

  /**
   * Initializes the front face plane of the Rubik's Cube with a dynamic texture.
   *
   * This function creates a dynamic texture and applies it to the `frontFacePlane` mesh.
   * It extracts the colors from the smaller cubes that form the front face and fills the
   * dynamic texture with these colors arranged in a 3x3 grid. Grid lines are drawn to
   * delineate the individual cells. The texture is then applied to the front face plane.
   *
   * @param {BABYLON.Mesh} frontFacePlane - The mesh representing the front face plane.
   */
  private initFacePlane(frontFacePlane: BABYLON.Mesh, planeIdx: number) {
    // Create a dynamic texture for the front face
    const texture = new BABYLON.DynamicTexture(
      "faceTexture",
      { width: 512, height: 512 },
      this.scene
    );
    const context = texture.getContext();

    const cellSize = 512 / 3; // Divide texture width by 3 for a 3x3 grid
    const frontFaceCubes: BABYLON.Mesh[] = [];

    const posIndex = (planeIdx + 3) % 3;
    const posValue = (planeIdx + 2) % 2 === 0 ? 1 : -1;

    // Find the cubes that form the front face (i.e., where z = 1)
    this.cubes.forEach((cube) => {
      if (cube.position[posIndex] === posValue) {
        // Check if it's part of the front face
        frontFaceCubes.push(cube.mesh);
      }
    });

    // Fill the dynamic texture with colors from the smaller cubes
    let idx = 0; // To keep track of which cube color to copy
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const cube = frontFaceCubes[idx];
        const multiMaterial = cube.material as BABYLON.MultiMaterial;

        // Get the material for the front face of the cube (0 is typically the front)
        const color = (
          multiMaterial.subMaterials[planeIdx] as BABYLON.StandardMaterial
        ).diffuseColor;

        // Set the color to the texture context (draw the color for this cell)
        context.fillStyle = color.toHexString(); // Convert color to hex string
        context.fillRect(
          i * cellSize,
          j * cellSize,
          cellSize - 1,
          cellSize - 1
        ); // Draw the color at the correct position

        idx++;
      }
    }
    // Draw the grid lines
    context.strokeStyle = "#000000"; // Black color for grid lines
    context.lineWidth = 3; // Line width for grid
    // Vertical grid lines
    context.beginPath();
    context.moveTo(cellSize, 0);
    context.lineTo(cellSize, 512);
    context.moveTo(cellSize * 2, 0);
    context.lineTo(cellSize * 2, 512);
    context.stroke();

    // Horizontal grid lines
    context.beginPath();
    context.moveTo(0, cellSize);
    context.lineTo(512, cellSize);
    context.moveTo(0, cellSize * 2);
    context.lineTo(512, cellSize * 2);
    context.stroke();

    texture.update(); // Update the texture to reflect the new color map

    // Create a material for the front face and apply the texture
    const frontFaceMaterial = new BABYLON.StandardMaterial(
      "frontFaceMaterial",
      this.scene
    );
    frontFaceMaterial.diffuseTexture = texture;
    frontFacePlane.material = frontFaceMaterial;
  }
}
