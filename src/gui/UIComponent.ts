import { Control } from "@babylonjs/gui";
import { Scene } from "@babylonjs/core/scene";

/**
 * Base class for all UI components.
 */
export abstract class UIComponent {
  protected control: Control;
  protected scene: Scene;
  protected controlInstance: Control | undefined;

  /**
   * Constructs a new UI component.
   * 
   * @param scene The scene which the component is a part of.
   * @param controlInstance An optional parameter specifying the Control instance
   *                        that the component should be rendered with.
   */
  constructor(scene: Scene, controlInstance?: Control) {
    this.scene = scene;

    if (controlInstance) {
      this.controlInstance = controlInstance;
    }
    
    this.control = this.createControl();
  }

  /**
   * Abstract method to create a Control instance based on the component's
   * own specific needs.
   * 
   * @returns The created Control instance.
   */
  protected abstract createControl(): Control;

  /**
   * Gets the Control instance for this UI component.
   * 
   * @returns The Control instance for this component.
   */
  public getControl(): Control {
    return this.control;
  }

  /**
   * Sets the position of the UI component on the screen.
   * 
   * @param x The x-coordinate of the position (in pixels).
   * @param y The y-coordinate of the position (in pixels).
   */
  public setPosition(x: number, y: number): void {
    this.control.left = `${x}px`;
    this.control.top = `${y}px`;
  }

  /**
   * Sets the visibility of this UI component.
   * 
   * @param visible true if the component should be visible, false otherwise.
   */
  public setVisibility(visible: boolean): void {
    this.control.isVisible = visible;
  }
}
