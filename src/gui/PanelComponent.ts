import { Container, Control } from "@babylonjs/gui";
import { UIComponent } from "./UIComponent";
import { Scene } from "@babylonjs/core";

export class UIPanel extends UIComponent {
  private elements: UIComponent[] = [];

  constructor(scene: Scene, panelInstance: Control | Container) {    
    super(scene, panelInstance);
  }

  protected createControl(): Control {
    const board = this.controlInstance as Control;

    return board
  }

  // Add a UI component to the panel
  public addElement(element: UIComponent): void {
    if (this.control instanceof Container) {
      this.elements.push(element);
      this.control.addControl(element.getControl());
    } 

    return
  }

  // Set visibility for the entire panel
  public setPanelVisibility(visible: boolean): void {
    this.setVisibility(visible);
  }

  // Positioning panel
  public setPosition(x: number, y: number): void {
    this.control.left = `${x}px`;
    this.control.top = `${y}px`;
  }
}
