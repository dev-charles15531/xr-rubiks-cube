## 📁 **Project Structure**

Here’s the overall structure of the project. The aim is to keep things modular, so contributors can easily add their own features without interfering with others.

```
rubiks-cube-playground/
│
├── src/                             # Main source code for the project
│   ├── controls/                    # Control logic for interacting with the cube
│   │   ├── keyboardControl.ts       # Keyboard control logic
│   │   └── pointerControl.ts        # Pointer/Mouse control logic
│   │
│   ├── features/                    # Cube features, mechanics, or enhancements
│   │   ├── animation.ts             # Cube animation
│   │   └── rotation.ts              # Cube rotation
│   │
│   ├── core/                        # Core logic and utility functions
│   │   ├── utils.ts                 # Helper functions for stuffs.
│   │   ├── cube.ts                  # Cube class
│   │   ├── cubeGrid.ts              # 3D Grid of cubes forming the Rubik’s Cube
│   │   └── sceneSetup.ts            # Babylon.js scene, camera, and light setup
│   │
│   ├── services/                    # Supporting and utility logic.
│   │   ├── inputManager.ts          # For initializing and managing various input mechanisms
│   │   ├── keyboardService.ts       # Handles keyboard input
│   │   └── pointerService.ts        # Handles pointer (mouse or touch) input.
│   │
│   └── index.ts                     # Entry point: setting up everything
│
├── assets/                          # Assets such as textures, models, or sounds
│
├── public/                          # Static assets for the web app
│
├── index.html                       # Main HTML file
├── .gitignore                       # Git ignore file
├── LICENSE                          # Project license
├── README.md                        # Project overview and instructions
├── PROJECT_STRUCTURE.md             # Project structure description
├── package.json                     # Project dependencies and scripts
└── tsconfig.json                    # TypeScript configuration
```

### **Explanation of Key Folders:**

- **`src/`**: Contains all the source code for the XR Rubiks Cube.

  - **`controls/`**: Contains logic for user interaction (keyboard, pointer, VR controls).
  - **`features/`**: Houses any new features you want to add, like animations, multiplayer, or game mechanics.
  - **`core/`**: The fundamental codebase of the Rubik’s Cube itself, including utility functions, cube logic, and Babylon.js scene setup.
  - **`services/`**: Includes services for handling game logic and user inputs in a modular manner.
  - **`index.ts`**: The entry point of the app, where everything is brought together and the scene is initialized.

- **`assets/`**: This folder will hold your game’s textures, models, and sound files.

- **`public/`**: Static assets that are served to the user, such as `index.html` and `style.css`.
