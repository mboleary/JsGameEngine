# TODO for NPM Package refactor

- [ ] Separate Packages
    - [ ] Asset Loader
    - [ ] Core Engine
    - [ ] Debug Module
    - [ ] Graphics Module
        - Camera
        - G.O. Component
    - [ ] Basic Audio Module
    - [ ] Puppeteer (Multiplayer) Module
        - Need to figure out what to do about the debug UI code, could probably integrate that into the existing code
        - Could just put in the Debug API in here, then make the user include the static HTML needed
    - [ ] Multiplayer Server
    - [ ] Input Module
- [ ] Build Demos
    - [ ] Old Demo
        - Should contain the bootstrapping code


## Next Stage of development

- Add more complex timer, where multiple timers can be initialized and manipulated at the same time
- Integrate actual uuid / shortid packages into core code
- Integrate actual Physics into game engine
- Refactor GameObjects to take in components for all attributes, turning the Engine into an Entity-Component system
    - Involves turning Scripts into Components
- Refactor Serialization to accomodate new G.O. architecture
- Change Debug / Serialization code to use the same code for sending data back and forth
- Fix issues with controller API in Input Module
- Investigate how to implement building GameObject based on prefab

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