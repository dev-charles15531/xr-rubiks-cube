import { CubeGrid } from '../core/cubeGrid';
import { KeyboardService } from './keyboardService';

export class InputManager {
  private keyboardService: KeyboardService;
  private activeService: string;

  constructor(cubeGrid: CubeGrid) {
    this.keyboardService = new KeyboardService(cubeGrid);
    this.activeService = 'keyboard';  // Default 
  }

  // Initialize the input
  public init() {
   if (this.isKeyboardInput()) {
      this.activeService = 'keyboard';
      this.keyboardService.init();
    } 
  }

  // Dispose of all active services when done
  public dispose() {
    switch (this.activeService) {
      case 'keyboard':
        this.keyboardService.dispose();
        break;
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
