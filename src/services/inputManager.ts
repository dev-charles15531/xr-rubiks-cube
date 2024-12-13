import * as BABYLON from "@babylonjs/core";
import { CubeGrid } from '../core/cubeGrid';
import { KeyboardService } from './keyboardService';
import { PointerService } from './pointerService';

export class InputManager {
  private keyboardService: KeyboardService;
  private pointerService: PointerService;
  private activeService: string | string[];

  constructor(scene: BABYLON.Scene, cubeGrid: CubeGrid) {
    this.keyboardService = new KeyboardService(cubeGrid);
    this.pointerService = new PointerService(scene, cubeGrid);
    this.activeService = 'keyboard';  // Default 
  }

  // Initialize the input
  public init() {
    if (this.isKeyboardInput()) {
      this.activeService = 'keyboard';
      this.keyboardService.init();
    } 

    if(typeof this.activeService === 'string') {
      this.activeService = [this.activeService, 'pointer'];
      this.pointerService.init();
    }
  }

  // Helper method to detect if keyboard input should be used
  private isKeyboardInput(): boolean {
    // This is the only way that makes sense i can think of
    // The below condition is likely true for a device with a physical keyboard (desktop or laptop)
    // TODO: Add more or a more reliable keyboard detection check
    if (window.innerWidth > 600) {
      return true;
    } 

    return false;
  }
}
