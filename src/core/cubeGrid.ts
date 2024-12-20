import * as BABYLON from "@babylonjs/core";
import { Cube } from "./cube";
import { Animation } from "../features/animation";
import { AdvancedDynamicTexture, Grid, Rectangle } from "@babylonjs/gui";

// CubeGrid to manage the whole Rubik's Cube
export class CubeGrid {
  private scene: BABYLON.Scene;
  private cubeNode: BABYLON.TransformNode;
  private sideNode: BABYLON.TransformNode;
  private cubes: Cube[] = [];
  private panels: Record<string, Rectangle> | undefined;
  private cubeFaces: {
    front: string[];
    back: string[];
    left: string[];
    right: string[];
    top: string[];
    bottom: string[];
  };

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

    // setup animation
    const animation = new Animation();
    animation.buildSideNodeAnimation(this.sideNode);

    // Store the scene and initialize cubes
    this.scene = scene;
    this.initializeCubes();

    this.cubeFaces = {
      front: Array(9).fill("blue"), // Blue face (default front)
      back: Array(9).fill("green"), // Green face (default back)
      left: Array(9).fill("orange"), // Orange face (default left)
      right: Array(9).fill("red"), // Red face (default right)
      top: Array(9).fill("white"), // White face (default top)
      bottom: Array(9).fill("yellow"), // Yellow face (default bottom)
    };
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

    const sideNodeAxis: BABYLON.Vector3 = this.sideNode.position;
    const faces: Record<string, Record<string, [string, string]>> = {
      x: {
        "-1": ["right", "clockwise"],
        "1": ["left", "clockwise"],
      },
      y: {
        "1": ["top", "clockwise"],
        "-1": ["bottom", "clockwise"],
      },
      z: {
        "-1": ["back", "clockwise"],
        "1": ["front", "clockwise"],
      },
    };

    if (sideNodeAxis.x !== 0 || sideNodeAxis.y !== 0 || sideNodeAxis.z !== 0) {
      const faceAndDirection: [string, string] =
        sideNodeAxis.x !== 0
          ? faces.x[sideNodeAxis.x.toString()]
          : sideNodeAxis.y !== 0
          ? faces.y[sideNodeAxis.y.toString()]
          : faces.z[sideNodeAxis.z.toString()];

      this.rotateFaceAndNeighbors(
        faceAndDirection[0],
        faceAndDirection[1] as "clockwise" | "counterclockwise"
      );
    }

    this.updateGUI(this.panels!, this.cubeFaces);
  }

  public buildFacePanels(texture: AdvancedDynamicTexture) {
    ["u", "d", "l", "r", "f", "b"];

    this.panels = {
      top: this.createFacePanel("top", texture),
      bottom: this.createFacePanel("bottom", texture),
      left: this.createFacePanel("left", texture),
      right: this.createFacePanel("right", texture),
      front: this.createFacePanel("front", texture),
      back: this.createFacePanel("back", texture),
    };

    return this.panels;
  }

  /**
   * Creates a panel for a face of the cube
   * @param {string} name The name of the panel
   * @param {AdvancedDynamicTexture} texture The texture that the panel should be added to
   * @returns {Rectangle} The panel that was created
   */
  private createFacePanel(
    name: string,
    texture: AdvancedDynamicTexture
  ): Rectangle {
    let panel = new Rectangle(name);
    panel.width = "100px";
    panel.height = "100px";
    panel.thickness = 2;
    panel.color = "black";

    texture.addControl(panel);

    return panel;
  }

  /**
   * Updates a panel for a face of the cube
   * @param {Rectangle} panel The panel to update
   * @param {string[]} faceColors The colors to display on the face
   */
  private updatePanel(panel: Rectangle, faceColors: string[]): void {
    // Clear any existing controls in the panel
    panel.clearControls();

    // Create a 3x3 grid for the face
    const grid = new Grid();
    for (let i = 0; i < 3; i++) {
      grid.addRowDefinition(1 / 3); // 3 rows
      grid.addColumnDefinition(1 / 3); // 3 columns
    }

    // Add squares (cells) to the grid
    faceColors.forEach((color, index) => {
      const square = new Rectangle();
      square.background = color; // Set the background color
      square.thickness = 1; // Add a border
      square.color = "black"; // Border color
      square.width = "30px"; // Square size
      square.height = "30px";

      // Calculate row and column index
      const row = Math.floor(index / 3);
      const col = index % 3;

      // Add the square to the grid
      grid.addControl(square, row, col);
    });

    // Add the grid to the panel
    panel.addControl(grid);
  }

  /**
   * Updates all the panels in the GUI to reflect the current state of the cube.
   * @param {Record<string, Rectangle>} panels - The panels to update. Keys are face names (e.g. "front", "back", etc.),
   *                                               and values are the corresponding Rectangle objects.
   * @param {Record<string, string[]>} cubeFaces - The current state of the cube. Keys are face names, and values are
   *                                               arrays of 9 strings representing the colors of the face.
   */
  public updateGUI(
    panels: Record<string, Rectangle>,
    cubeFaces: Record<string, string[]>
  ): void {
    Object.keys(panels).forEach((face) => {
      this.updatePanel(panels[face], cubeFaces[face]);
    });
  }

  /**
   * Rotates the given array of colors in either a clockwise or counterclockwise direction.
   * @param {string[]} colors - The array of colors to rotate.
   * @param {RotationDirection} direction - The direction to rotate the array. Supports "clockwise" and "counterclockwise".
   * @returns {string[]} The rotated array of colors.
   */
  private rotateColors(
    colors: string[],
    direction: "clockwise" | "counterclockwise"
  ): string[] {
    if (direction === "clockwise") {
      return this.rotateColorsClockwise(colors);
    } else if (direction === "counterclockwise") {
      return this.rotateColorsCounterclockwise(colors);
    } else {
      throw new Error(
        "Invalid rotation direction: Use 'clockwise' or 'counterclockwise'."
      );
    }
  }

  private rotateColorsClockwise(colors: string[]) {
    return [
      colors[6],
      colors[3],
      colors[0],
      colors[7],
      colors[4],
      colors[1],
      colors[8],
      colors[5],
      colors[2],
    ];
  }

  private rotateColorsCounterclockwise(colors: string[]) {
    return [
      colors[2],
      colors[5],
      colors[8],
      colors[1],
      colors[4],
      colors[7],
      colors[0],
      colors[3],
      colors[6],
    ];
  }

  private rotateFaceAndNeighbors(
    face: string,
    direction: "clockwise" | "counterclockwise"
  ) {
    const neighbors = {
      front: [
        { face: "top", indices: [6, 7, 8] }, // Bottom row of the top face
        { face: "right", indices: [0, 3, 6] }, // Left column of the right face
        { face: "bottom", indices: [2, 1, 0] }, // Top row of the bottom face (reversed)
        { face: "left", indices: [8, 5, 2] }, // Right column of the left face (reversed)
      ],
      back: [
        { face: "top", indices: [2, 1, 0] }, // Top row of the top face (reversed)
        { face: "left", indices: [0, 3, 6] }, // Left column of the left face
        { face: "bottom", indices: [6, 7, 8] }, // Bottom row of the bottom face
        { face: "right", indices: [8, 5, 2] }, // Right column of the right face (reversed)
      ],
      left: [
        { face: "top", indices: [0, 3, 6] }, // Left column of the top face
        { face: "front", indices: [0, 3, 6] }, // Left column of the front face
        { face: "bottom", indices: [0, 3, 6] }, // Left column of the bottom face
        { face: "back", indices: [8, 5, 2] }, // Right column of the back face (reversed)
      ],
      right: [
        { face: "top", indices: [8, 5, 2] }, // Right column of the top face (reversed)
        { face: "back", indices: [0, 3, 6] }, // Left column of the back face
        { face: "bottom", indices: [8, 5, 2] }, // Right column of the bottom face
        { face: "front", indices: [8, 5, 2] }, // Right column of the front face (reversed)
      ],
      top: [
        { face: "back", indices: [2, 1, 0] }, // Top row of the back face (reversed)
        { face: "right", indices: [2, 1, 0] }, // Top row of the right face (reversed)
        { face: "front", indices: [2, 1, 0] }, // Top row of the front face (reversed)
        { face: "left", indices: [2, 1, 0] }, // Top row of the left face (reversed)
      ],
      bottom: [
        { face: "front", indices: [6, 7, 8] }, // Bottom row of the front face
        { face: "right", indices: [6, 7, 8] }, // Bottom row of the right face
        { face: "back", indices: [6, 7, 8] }, // Bottom row of the back face
        { face: "left", indices: [6, 7, 8] }, // Bottom row of the left face
      ],
    };

    // Rotate the face itself
    const cubeFace = face as keyof typeof this.cubeFaces;
    this.cubeFaces[cubeFace] = this.rotateColors(
      this.cubeFaces[cubeFace],
      direction
    );

    // Get the neighbors and strips
    const faceNeighbors = neighbors[cubeFace];

    // Store the strips of colors from adjacent faces
    let strips = faceNeighbors.map(
      (neighbor: { indices: any[]; face: string | number }) =>
        neighbor.indices.map(
          (i: number) =>
            this.cubeFaces[neighbor.face as keyof typeof this.cubeFaces][i]
        )
    );

    // Rotate the strips between neighbors
    if (direction === "clockwise") {
      strips.unshift(strips.pop() ?? []); // Shift strips clockwise
    } else {
      strips.push(strips.shift() ?? []); // Shift strips counterclockwise
    }

    // Update the neighbors with the rotated strips
    faceNeighbors.forEach(
      (neighbor: { indices: any[]; face: string | number }, i: number) => {
        neighbor.indices.forEach((index: number, j: number) => {
          this.cubeFaces[neighbor.face as keyof typeof this.cubeFaces][index] =
            strips[i][j];
        });
      }
    );
  }

  public getCubeFaces(): Record<string, string[]> {
    return this.cubeFaces;
  }
}
