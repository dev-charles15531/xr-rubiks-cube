import * as BABYLON from "@babylonjs/core";

export class Animation {

  constructor() {
  }

  /**
   * Builds an animation for a side of the cube and stores it in the sideNode's animations array.
   * 
   * The animation is a quaternion rotation that runs for 1 second, with the end rotation being set when the animation is run.
   * The animation is configured with a quintic ease out.
   * 
   * @param {BABYLON.TransformNode} sideNode - The TransformNode of the side of the cube.
   */
 public buildSideNodeAnimation(sideNode: BABYLON.TransformNode) {
   const animationFPS = 60;
       
    // set up animation. When run, parameters will be the same except the last keyFrame value (end rotation)
    // store the animation within sideNode.animations
    const anim = new BABYLON.Animation("rotate side", "rotationQuaternion",
        animationFPS, 
        BABYLON.Animation.ANIMATIONTYPE_QUATERNION, 
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    )

    const secondsRuntime = 1
    anim.setKeys([
        {frame:0,value:BABYLON.Quaternion.Identity()}, 
        {frame:secondsRuntime*animationFPS,value:
            BABYLON.Quaternion.Identity() // this will be replaced when run
        },
    ])
    
    // animation config
    const ease = new BABYLON.QuinticEase();
    ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
    anim.setEasingFunction(ease);
    sideNode.animations.push(anim);
 }
}
