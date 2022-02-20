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


## Next Stage of development

- Add more complex timer, where multiple timers can be initialized and manipulated at the same time
- Integrate actual uuid / shortid packages into core code
- Integrate actual Physics into game engine
- Refactor GameObjects to take in components for all attributes, turning the Engine into an Entity-Component system
- Refactor Serialization to accomodate new G.O. architecture
- Change Debug / Serialization code to use the same code for sending data back and forth
- Fix issues with controller API in Input Module
- Investigate how to implement building GameObject based on prefab
