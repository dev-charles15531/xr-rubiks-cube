import * as BABYLON from "@babylonjs/core";
import { Cube } from "./cube";

// CubeGrid to manage the whole Rubik's Cube
export class CubeGrid {
  scene: BABYLON.Scene;
  
  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
    this.initializeCubes();
  }

  // Initialize cubes in a 3x3x3 grid
  initializeCubes() {
    // create array of cublettes, forming the larger cube.
    const cube = Array<Cube>()
    for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++)
            for (let k = 0; k < 3; k++) {
                let positionArray = [i - 1, j - 1, k - 1]
                const c = new Cube(positionArray, this.scene);
                
                cube.push(c)
            }
  } 
}