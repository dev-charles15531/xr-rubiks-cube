import * as BABYLON from "@babylonjs/core";

export class SceneSetup {
  engine: BABYLON.Engine;
  scene: BABYLON.Scene;
  canvas: HTMLCanvasElement;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    
    this.engine = new BABYLON.Engine(this.canvas, true);
    this.engine.setHardwareScalingLevel( .5)

    this.scene = new BABYLON.Scene(this.engine);
  }

  // Create camera and light
  setupCameraAndLight() {
    const camera = new BABYLON.ArcRotateCamera(
      "camera1",
      Math.PI / 2,
      Math.PI / 2,
      10,
      BABYLON.Vector3.Zero(),
      this.scene
    );
    camera.attachControl(this.canvas, true);

    new BABYLON.HemisphericLight("light1", BABYLON.Vector3.Up(), this.scene);
  }

  // Run render loop
  run() {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    window.addEventListener("resize", () => {
      this.engine.resize();
    });
  }
}