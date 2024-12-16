import * as BABYLON from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";

export class Board {
  private scene: BABYLON.Scene;

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
  }

  // Initialize the input
  public init() {
    this.createBoard();
  }

  private createBoard() {
    // Create a GUI layer on top of the 3D scene
    const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI(
      "UI",
      true,
      this.scene
    );

    // Create a basic "board" using a `Rectangle` (this can serve as a background)
    const board = new GUI.Rectangle();
    board.width = "300px"; // Set the width of the control board
    board.height = "200px"; // Set the height of the control board
    board.color = "white"; // Set the border color
    board.thickness = 4; // Set the border thickness
    board.background = "rgba(0, 0, 0, 0.5)"; // Set a semi-transparent background
    board.cornerRadius = 20; // Round the corners
    board.top = "10px"; // Distance from the top of the screen
    board.left = "50px"; // Distance from the left of the screen
    board.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT; // Align the rectangle to the right

    advancedTexture.addControl(board); // Add the rectangle to the GUI

    // Create a title or label inside the control board
    const title = new GUI.TextBlock();
    title.text = "Control Board"; // Text for the title
    title.color = "white"; // Text color
    title.fontSize = 24; // Font size
    title.top = "10px"; // Position from the top inside the rectangle
    board.addControl(title);

    // Add a button to the control board
    const button = GUI.Button.CreateSimpleButton("button1", "Rotate Cube");
    button.width = "180px";
    button.height = "40px";
    button.color = "white";
    button.background = "green";
    button.top = "50px"; // Position below the title
    board.addControl(button);

    // Add another button to the control board
    const resetButton = GUI.Button.CreateSimpleButton(
      "resetButton",
      "Reset Cube"
    );
    resetButton.width = "180px";
    resetButton.height = "40px";
    resetButton.color = "white";
    resetButton.background = "blue";
    resetButton.top = "100px"; // Position below the first button
    board.addControl(resetButton);
  }
}
