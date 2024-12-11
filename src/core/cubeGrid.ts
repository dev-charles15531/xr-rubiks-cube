import * as BABYLON from "@babylonjs/core";
import { Cube } from "./cube";
import { Animation } from "../features/animation";

// CubeGrid to manage the whole Rubik's Cube
export class CubeGrid {
  private scene: BABYLON.Scene;
  private cubeNode: BABYLON.TransformNode;
  private sideNode: BABYLON.TransformNode;

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
    // Create an array of Cube instances to form the larger cube
    const cubes: Cube[] = [];

    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        for (let k = 0; k < 3; k++) {
          const positionArray: number[] = [i - 1, j - 1, k - 1];
          const c: Cube = new Cube(positionArray, this.scene);

          // Set the parent of each cube to the root node
          c.mesh.setParent(this.cubeNode);

          cubes.push(c);
        }

    // rotate the larger cube to test rotation is independent of larger cube pos/rot.
    this.cubeNode.rotation = new BABYLON.Vector3(Math.PI / 10, Math.PI / 10, Math.PI / 22);
    
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
  }
}
