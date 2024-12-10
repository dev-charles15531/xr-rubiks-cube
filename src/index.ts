import { SceneSetup } from "./sceneSetup";

// Main function to start the Rubik's Cube simulation
function createRubiksCubeSimulation() {
  const sceneSetup = new SceneSetup("renderCanvas");
  sceneSetup.setupCameraAndLight();

  // Start rendering the scene
  sceneSetup.run();
}

// Call the function to create the scene and start the Rubik's Cube simulation
createRubiksCubeSimulation();