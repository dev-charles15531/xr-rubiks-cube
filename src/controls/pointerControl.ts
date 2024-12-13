import * as BABYLON from "@babylonjs/core";
import { Rotation } from "../features/rotation";
import { toLocal } from "../core/utils";
import { CubeGrid } from "../core/cubeGrid";

export class PointerControl {
  private scene: BABYLON.Scene;
  private cubeRotation: Rotation;
  
 
  /**
   * The constructor for the PointerControl class.
   *
   * @param {BABYLON.Scene} scene The scene to add the pointer control to.
   * @param {CubeGrid} cubeGrid The CubeGrid instance to control.
   */
  constructor(scene: BABYLON.Scene, cubeGrid: CubeGrid) {
    this.scene = scene;
    this.cubeRotation = new Rotation(cubeGrid);
  }

  /**
   * Handles the pointer down event.
   * 
   * This function is called whenever a pointer (mouse, touch, etc.) is pressed down on the scene.
   * 
   * @param {BABYLON.PointerInfo} pointerInfo The information about the pointer event.
   */
  public handlePointerDown(pointerInfo: BABYLON.PointerInfo) {
    const pickedMesh = pointerInfo.pickInfo?.pickedMesh;
    const sideNode = this.scene.getTransformNodeByName("rotating") as BABYLON.TransformNode;
    const cubeNode = this.scene.getTransformNodeByName("cube") as BABYLON.TransformNode;

    // If the pointer is not on a mesh or the side is already rotating, do nothing
    if (!pickedMesh || sideNode.animations[0].hasRunningRuntimeAnimations) return;

    // Get the facet normal of the picked mesh
    const facetId = pointerInfo.pickInfo.faceId;
    const facetNormal = pickedMesh.getFacetNormal(facetId);

    // Convert the facet normal to local space
    const localFacetNormal = toLocal(facetNormal, cubeNode, true);

    // Create an array of axis values by mapping the local facet normal to an array of 0s and 1s
    // The axis values are determined by whether the corresponding component of the facet normal is
    // greater than 0.5 or less than -0.5. If it is, the axis value is set to 1, otherwise it is set to 0.
    const axis = localFacetNormal.asArray().map((n) => (Math.abs(n) > 0.5 ? Math.sign(n) : 0));

    // Find the index of the first non-zero axis value
    const rotationIndex = axis.findIndex((n) => n !== 0);

    // Get the rotation parameters from the Rotation class based on the rotation index
    // If the axis value is positive, add 3 to the rotation index
    const rotationParams = Rotation.rotateParams[rotationIndex + (axis[rotationIndex] > 0 ? 3 : 0)];

    // Rotate the cube using the rotation parameters
    this.cubeRotation.rotateFaceFromParams(rotationParams);
  }
}
