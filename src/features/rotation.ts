import * as BABYLON from "@babylonjs/core";
import { CubeGrid } from '../core/cubeGrid';

export class Rotation {
  private cubeGrid: CubeGrid;
  private rotateParams: Array<[ (c: BABYLON.Mesh) => boolean, BABYLON.Vector3 ]>

  constructor(cubeGrid: CubeGrid) {
    this.cubeGrid = cubeGrid;
    this.rotateParams = Array.from([
      [c => c.position.y > .5, new BABYLON.Vector3(0, 1, 0)], // top
      [c => c.position.x > .5, new BABYLON.Vector3(1, 0, 0)], // left
      [c => c.position.x < -.5, new BABYLON.Vector3(-1, 0, 0)], // right
      [c => c.position.y < -.5, new BABYLON.Vector3(0, -1, 0)], // bottom
      [c => c.position.z < -.5, new BABYLON.Vector3(0, 0, -1)], // back
      [c => c.position.z > .5, new BABYLON.Vector3(0, 0, 1)], // front
    ]);

  }

  /**
   * Rotates a face of the cube.
   * @param {string} face The face to rotate. Supported values are "top", "left", "right", "bottom", "back", and "front".
   */
  public rotateFace(face: string) {
    
    // Check if the cube is already rotating
    if (this.cubeGrid.getSideNode().animations[0].hasRunningRuntimeAnimations) return;

    // Get the parameters for the rotation
    const [choosingFunction, pivotPoint] = this.getRotationParams(face);

    // Start the animation
    this.cubeGrid.sideNodeStartup(choosingFunction, pivotPoint, Math.PI/2);
  }

  private getRotationParams(face: string): [ (c: BABYLON.Mesh) => boolean, BABYLON.Vector3 ] {
    switch (face) {
      case "top":
        return this.rotateParams[0];
      case "left":
        return this.rotateParams[1];
      case "right":
        return this.rotateParams[2];
      case "bottom":
        return this.rotateParams[3];
      case "back":
        return this.rotateParams[4];
      case "front":
        return this.rotateParams[5];
      default:
        return this.rotateParams[0];
    }
  }
}
