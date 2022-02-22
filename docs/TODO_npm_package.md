# TODO for NPM Package refactor

- [~] Separate Packages
    - [x] Asset Loader
    - [x] Core Engine
    - [x] Debug Module
    - [x] Graphics Module
        - Camera
        - G.O. Component
    - [x] Basic Audio Module
    - [x] Puppeteer (Multiplayer) Module
        - Need to figure out what to do about the debug UI code, could probably integrate that into the existing code
        - Could just put in the Debug API in here, then make the user include the static HTML needed
    - [ ] Multiplayer Server
    - [x] Input Module
- [ ] Build Demos
    - [~] Old Demo
        - Should contain the bootstrapping code
- [ ] Use NPM Packages
    - [x] uuid
    - [ ] rewrite Transform to use `gl-matrix`
- [ ] Modify Jmods
    - New Hooks
        - [ ] pause
        - [ ] destroy
        - [ ] buildDebug
    - Context passed in during loop
        - [ ] Add array of loaded modules


## Next Stage of development

- Find a better package to use for 3d coordinates
    - Add proper support for layering 2d graphics with a priority (z axis)
- Add more complex timer, where multiple timers can be initialized and manipulated at the same time
- Integrate actual uuid / shortid packages into core code
- Integrate actual Physics into game engine
- Refactor GameObjects to take in components for all attributes, turning the Engine into an Entity-Component system
    - Involves turning Scripts into Components
- Refactor Serialization to accomodate new G.O. architecture
- Change Debug / Serialization code to use the same code for sending data back and forth
- Fix issues with controller API in Input Module
- Investigate how to implement building GameObject based on prefab

## JSGE Generics library

This library will contain generic data structures and components to help facilitate interoperability with other modules.

Types:
- 2d graphics
- Transform
- Audio Source

## Existing PRs

These will need to be merged into master, or otherwise moved to a safe place, and then everything will be moved around

- 2d render rotation
- New Multiplayer server
- Tilemap
- Prefabs (no actual code there, though)
- Audio Module
- Basic Collision
- Debug UI (has separate static assets in the debug UI)
- WebGL (Make this a separate module)
    - Merge Last

## New Standard libraries

These are standard libraries to be used throughout the project.

- https://www.npmjs.com/package/gl-matrix
- https://www.npmjs.com/package/uuid
- https://www.npmjs.com/package/shortid
