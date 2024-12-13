import { InputManager } from "../services/inputManager";
import { CubeGrid } from "./cubeGrid";
import { SceneSetup } from "./sceneSetup";

// Main function to start the Rubik's Cube simulation
function createRubiksCubeSimulation() {
  const sceneSetup = new SceneSetup("renderCanvas");
  sceneSetup.setupCameraAndLight();

  const cubeGrid = new CubeGrid(sceneSetup.scene);

  // initialize input manager
  const inputManager = new InputManager(sceneSetup.scene, cubeGrid);
  inputManager.init();

  // Start rendering the scene
  sceneSetup.run();
}

// create the scene and start the Rubik's Cube simulation
createRubiksCubeSimulation();
