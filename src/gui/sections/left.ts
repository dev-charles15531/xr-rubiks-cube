import { Scene } from "@babylonjs/core";
import {
  AdvancedDynamicTexture,
  Button,
  Grid,
  TextBlock,
} from "@babylonjs/gui";
import { UIPanel } from "../PanelComponent";
import { CubeGrid } from "../../core/cubeGrid";

/**
 * Creates the left section of the control panel.
 *
 * The left section contains six rows with the following elements in each row:
 * 1. A button labeled with a letter (u, d, l, r, f, b). These buttons are
 *    used to control the rotation of the cube.
 * 2. A right arrow emoji (➡️) that separates the button from the face panel.
 * 3. A face panel that displays the colors of one of the cube faces. The
 *    colors of the face are updated in real-time as the cube is rotated.
 *
 * The face panels are stored in an object with keys "top", "bottom", "left",
 * "right", "front", and "back". The values for each key is a Rectangle object
 * that is used to display the colors of the face.
 *
 * The grid for the left section is defined with three columns. The first
 * column is 40% of the width of the grid, the second column is 10%, and the
 * third column is 50%. Each row is given a height of 10% of the grid height.
 *
 * @param scene The scene in which the control panel is being rendered.
 * @param cubeGrid The instance of the CubeGrid class that manages the cube.
 * @param advancedTexture The AdvancedDynamicTexture that is used to render the
 *        control panel.
 * @returns The UIPanel that represents the left section of the control panel.
 */
export function leftSection(
  scene: Scene,
  cubeGrid: CubeGrid,
  advancedTexture: AdvancedDynamicTexture
): UIPanel {
  // Create the face panels and store them in an object with the face names as
  // keys.
  const facePlanes = cubeGrid.buildFacePanels(advancedTexture);

  // Get the colors of the cube faces and update the face panels.
  const cubeFaces = cubeGrid.getCubeFaces();
  cubeGrid.updateGUI(facePlanes, cubeFaces);

  // Define the grid for the left section.
  const grid = new Grid();
  grid.addColumnDefinition(40); // 40% of the width
  grid.addColumnDefinition(10); // 10% of the width
  grid.addColumnDefinition(50); // 50% of the width

  // Create the buttons and face panels for each row.
  const ctrlKeys = ["u", "d", "l", "r", "f", "b"];
  const ctrlFaces = ["top", "bottom", "left", "right", "front", "back"];

  for (let i = 0; i <= 5; i++) {
    grid.addRowDefinition(10); // 10% of the height

    // Create the button for each row.
    const button = createCtrlKeysButton("but" + i, ctrlKeys[i]);
    grid.addControl(button, i, 0);

    // Create the right arrow emoji for each row.
    const arrow = createArrow();
    grid.addControl(arrow, i, 1);

    // Add the face panel for each row.
    const facePanel = facePlanes[ctrlFaces[i]];
    grid.addControl(facePanel, i, 2);
  }

  // Create the UIPanel for the left section.
  const gridPane = new UIPanel(scene, grid);

  return gridPane;
}

/**
 * Creates a button for the left section of the UI with the given name and label.
 * The button has a background image of a paper texture, a black color, and a
 * bold font with size 32.
 * @param name The name of the button.
 * @param label The label of the button.
 * @returns The created button.
 */
function createCtrlKeysButton(name: string, label: string): Button {
  let button = Button.CreateImageWithCenterTextButton(
    name,
    label,
    "../../../assets/textures/paper.jpg"
  );
  button.width = "90px";
  button.height = "90px";
  button.color = "black";
  button.cornerRadius = 8;
  button.fontWeight = "bold";
  button.fontSize = 32;

  return button;
}

/**
 * Creates a right arrow emoji as a TextBlock. The emoji has a size of 35px and a yellow color.
 * The text is aligned to the left.
 * @returns The created TextBlock with the right arrow emoji.
 */
function createArrow() {
  const emojiText = new TextBlock();
  emojiText.text = "➡️"; // Right arrow emoji
  emojiText.fontSize = "35px"; // Set the font size
  emojiText.color = "yellow"; // Set the color
  emojiText.horizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_LEFT;

  return emojiText;
}
