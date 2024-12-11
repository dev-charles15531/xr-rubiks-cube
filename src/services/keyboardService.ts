import { KeyboardControl } from "../controls/keyboardControl";
import { CubeGrid } from "../core/cubeGrid";

export class KeyboardService {
    private onKeyDown: (event: KeyboardEvent) => void;
    private controlKeys: string[];
    private keyboardControl: KeyboardControl;
  
    constructor(cubeGrid: CubeGrid) {
      this.onKeyDown = this.handleKeyDown.bind(this);
      this.controlKeys = ['u', 'd', 'l', 'r', 'f', 'b'];
      this.keyboardControl = new KeyboardControl(cubeGrid);
    }
  
    // Initialize keyboard event
    public init() {
      window.addEventListener('keydown', this.onKeyDown);
    }
  
    // Clean up keyboard event
    public dispose() {
      window.removeEventListener('keydown', this.onKeyDown);
    }
  
    // Handle keydown events 
    private handleKeyDown(event: KeyboardEvent) {

      if (this.controlKeys.includes(event.key.toLowerCase())) {
        console.log("Key down:", event.key);

        this.keyboardControl.handleControls(event);
      }
      else {
        console.log("Key not recognized");
      }
    }
  }
  