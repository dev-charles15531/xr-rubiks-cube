import { Scene } from "@babylonjs/core/scene";
import { UIPanel } from "./PanelComponent";
import { AdvancedDynamicTexture, Control, Rectangle } from "@babylonjs/gui";
import { leftSection } from "./sections/left";

export class SceneGUI {
  private scene: Scene;
  private advancedTexture: AdvancedDynamicTexture;
  private panel: UIPanel;

  constructor(scene: Scene) {
    this.scene = scene;
    this.advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI", false, this.scene);

    const rectangularPanel = new Rectangle('rect');
    rectangularPanel.width = "600px"; // Set the width of the control board
    rectangularPanel.height = "60%"; // Set the height of the control board
    rectangularPanel.color = "gray"; // Set the border color
    rectangularPanel.thickness = 3; // Set the border thickness
    rectangularPanel.background = "rgba(0, 0, 0, 0.4)"; // Set a semi-transparent background
    rectangularPanel.cornerRadius = 20; // Round the corners
    rectangularPanel.top = "10px"; // Distance from the top of the screen
    rectangularPanel.left = "50px"; // Distance from the left of the screen
    rectangularPanel.setPadding("10px", "10px", "10px", "10px");
    rectangularPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT; // Align the rectangle to the right

    this.panel = new UIPanel(scene, rectangularPanel);
    this.createUI();
  }

  private createUI(): void {
    const leftPane = leftSection(this.scene);
    this.panel.addElement(leftPane);

    this.advancedTexture.addControl(this.panel.getControl());
  }
}
