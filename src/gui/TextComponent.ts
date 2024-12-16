import { TextBlock } from '@babylonjs/gui';
import { UIComponent } from './UIComponent';
import { Scene } from '@babylonjs/core';

export class UIText extends UIComponent {
  private text: string;

  constructor(scene: Scene, text: string, x: number, y: number) {
    super(scene);
    this.text = text;
    this.setPosition(x, y);
    this.control = this.createControl();
  }

  // Create the text element
  protected createControl(): TextBlock {
    const textBlock = new TextBlock();
    textBlock.text = this.text;
    textBlock.fontSize = 24;
    textBlock.color = 'white';
    return textBlock;
  }
}
