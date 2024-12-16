import { Scene } from "@babylonjs/core";
import { Button, Grid, Image, TextBlock } from "@babylonjs/gui";
import { UIPanel } from "../PanelComponent";

export function leftSection(scene: Scene): UIPanel {
    const grid = new Grid();
    grid.addColumnDefinition(30);
    grid.addColumnDefinition(20);
    grid.addColumnDefinition(50);

    const ctrlKeys = ['u', 'd', 'l', 'r', 'f', 'b'];

    for (let i = 0; i < 5; i++) {
        grid.addRowDefinition(10);
        grid.addControl(createCtrlKeysButton("but" + i, ctrlKeys[i]), i, 0);
        grid.addControl(createArrow(), i, 1);
    }

    const gridPane = new UIPanel(scene, grid);

    return gridPane;
}

function createCtrlKeysButton(name: string, label: string): Button {
    let button = Button.CreateImageWithCenterTextButton(name, label, "../../../assets/textures/paper.jpg");
    button.width = "90px";
    button.height = "90px";
    button.color = "black";
    button.cornerRadius = 8;
    button.fontWeight = "bold";
    button.fontSize = 32;

    return button;
}


function createArrow() {
    const  emojiText = new TextBlock();
    emojiText.text = "➡️";  // Right arrow emoji
    emojiText.fontSize = "35px";  // Set the font size
    emojiText.color = "yellow";    // Set the color
    emojiText.horizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_LEFT;

    return emojiText;
}