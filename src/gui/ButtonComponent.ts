import { Button } from '@babylonjs/gui';
import { UIComponent } from './UIComponent';
import * as BABYLON from '@babylonjs/core';

export class UIButton extends UIComponent {
  private onClickCallback: () => void;
  private label: string;
  private image?: string;

  constructor(scene: BABYLON.Scene, label: string, x: number, y: number, onClick: () => void, image?: string) {
    super(scene);
    this.onClickCallback = onClick;
    this.setPosition(x, y);
    this.label = label;
    this.image = image;
  }

  // Create the button and return the Babylon.js control
  protected createControl(): Button {
    if(this.image){
      const button = Button.CreateImageWithCenterTextButton('button', this.label, this.image);
      button.width = '150px';
      button.height = '50px';
      button.onPointerUpObservable.add(() => this.onClickCallback());
      return button;
    }
    const button = Button.CreateSimpleButton('button', this.label);
    button.width = '150px';
    button.height = '50px';
    button.onPointerUpObservable.add(() => this.onClickCallback());
    return button;
  }
}
