import { InputManager } from "./services/inputManager";
import { CubeGrid } from "./core/cubeGrid";
import { SceneSetup } from "./core/sceneSetup";
import { SceneGUI } from "./gui/sceneGUI";

// Main function to start the Rubik's Cube simulation
function createRubiksCubeSimulation() {
  const sceneSetup = new SceneSetup("renderCanvas");
  sceneSetup.setupCameraAndLight();

  const cubeGrid = new CubeGrid(sceneSetup.scene);

  // initialize input manager
  const inputManager = new InputManager(sceneSetup.scene, cubeGrid);
  inputManager.init();

  // init GUI
  const gui = new SceneGUI(sceneSetup.scene);

  // Start rendering the scene
  sceneSetup.run();
}

// create the scene and start the Rubik's Cube simulation
createRubiksCubeSimulation();
