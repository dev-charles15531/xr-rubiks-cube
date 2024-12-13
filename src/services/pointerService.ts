import * as BABYLON from "@babylonjs/core";
import { PointerControl } from "../controls/pointerControl";
import { CubeGrid } from "../core/cubeGrid";

export class PointerService {
  private scene: BABYLON.Scene;
  private pointerControl: PointerControl;

  /**
   * Creates a new PointerService instance.
   *
   * This constructor initializes a PointerControl and stores the scene.
   * It also sets up the event listener for pointerdown events.
   *
   * @param {BABYLON.Scene} scene The scene to add the pointer control to.
   * @param {CubeGrid} cubeGrid The CubeGrid instance to control.
   */
  constructor(scene: BABYLON.Scene, cubeGrid: CubeGrid) {
    this.scene = scene;
    this.pointerControl = new PointerControl(scene, cubeGrid);
  }

  /**
   * Initializes the pointer service by adding an event listener for pointer down events.
   * 
   * This method binds the `handlePointerDown` function of `pointerControl` to the scene's
   * `onPointerObservable`, allowing the system to respond to pointer down interactions.
   */
  public init() {
    this.scene.onPointerObservable.add(
      this.pointerControl.handlePointerDown.bind(this.pointerControl),
      BABYLON.PointerEventTypes.POINTERDOWN
    );
  }
}
