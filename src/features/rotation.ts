import * as BABYLON from "@babylonjs/core";
import { CubeGrid } from "../core/cubeGrid";

export class Rotation {
  private cubeGrid: CubeGrid;
  static rotateParams: Array<[(c: BABYLON.Mesh) => boolean, BABYLON.Vector3]> =
    Array.from([
      [(c) => c.position.x < -0.5, new BABYLON.Vector3(-1, 0, 0)], //left
      [(c) => c.position.y < -0.5, new BABYLON.Vector3(0, -1, 0)], //bottom
      [(c) => c.position.z < -0.5, new BABYLON.Vector3(0, 0, -1)], //back
      [(c) => c.position.x > 0.5, new BABYLON.Vector3(1, 0, 0)], //right
      [(c) => c.position.y > 0.5, new BABYLON.Vector3(0, 1, 0)], //top
      [(c) => c.position.z > 0.5, new BABYLON.Vector3(0, 0, 1)], //front
    ]);

  constructor(cubeGrid: CubeGrid) {
    this.cubeGrid = cubeGrid;
  }

  static getRotationParams() {
    return Rotation.rotateParams;
  }

  /**
   * Rotates a face of the cube.
   * @param {string} face The face to rotate. Supported values are "top", "left", "right", "bottom", "back", and "front".
   */
  public rotateFace(face: string) {
    // Check if the cube is already rotating
    if (this.cubeGrid.getSideNode().animations[0].hasRunningRuntimeAnimations)
      return;

    const rotationParams = this.getRotationParams(face);
    if (rotationParams) {
      const [choosingFunction, pivotPoint] = rotationParams;
      // Start the animation
      this.cubeGrid.sideNodeStartup(choosingFunction, pivotPoint, Math.PI / 2);
    } else {
      // Handle the case where getRotationParams returns undefined
      console.error(`Invalid face: ${face}`);
    }
  }

  public rotateFaceFromParams(
    rotationParam: [(c: BABYLON.Mesh) => boolean, BABYLON.Vector3]
  ) {
    // Get the face from the rotation parameters
    const face = this.getFaceFromRotationParams(rotationParam);
    this.rotateFace(face);
  }

  private getRotationParams(
    face: string
  ): [(c: BABYLON.Mesh) => boolean, BABYLON.Vector3] | undefined {
    switch (face) {
      case "top":
        return Rotation.rotateParams[4];
      case "left":
        return Rotation.rotateParams[0];
      case "right":
        return Rotation.rotateParams[3];
      case "bottom":
        return Rotation.rotateParams[1];
      case "back":
        return Rotation.rotateParams[2];
      case "front":
        return Rotation.rotateParams[5];
      default:
        return;
    }
  }

  private getFaceFromRotationParams(
    rotationParam: [(c: BABYLON.Mesh) => boolean, BABYLON.Vector3]
  ): string {
    // Loop through the rotateParams array to find the matching rotation function and vector
    for (let i = 0; i < Rotation.rotateParams.length; i++) {
      const param = Rotation.rotateParams[i];
      // Compare function and vector
      if (param[0] === rotationParam[0] && param[1].equals(rotationParam[1])) {
        switch (i) {
          case 0:
            return "left";
          case 1:
            return "bottom";
          case 2:
            return "back";
          case 3:
            return "right";
          case 4:
            return "top";
          case 5:
            return "front";
          default:
            return "unknown";
        }
      }
    }
    return "unknown";
  }
}
