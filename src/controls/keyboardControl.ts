import { CubeGrid } from '../core/cubeGrid';
import { Rotation } from '../features/rotation';

export class KeyboardControl {
  private cubeRotation: Rotation;

  /**
   * Creates a new KeyboardControl instance.
   *
   * @param {CubeGrid} cubeGrid The CubeGrid instance to control.
   */
  constructor(cubeGrid: CubeGrid) {
    this.cubeRotation = new Rotation(cubeGrid);
  }

  /**
   * Handle controls
   *
   * @param {KeyboardEvent} event The keydown event from the keyboard.
   */
  public handleControls(event: KeyboardEvent) {
    // Mapping of keyboard keys to faces of the cube
    const faceMap: { [key: string]: string } = {
      'u': 'top',
      'd': 'bottom',
      'l': 'left',
      'r': 'right',
      'f': 'front',
      'b': 'back'
    };

    // The face of the cube to rotate based on the key pressed
    const face = faceMap[event.key.toLowerCase()];

    if (face) {
      // Rotate the cube
      this.cubeRotation.rotateFace(face);
    } else {
      console.warn('Unrecognized key:', event.key);
    }
  }
}
