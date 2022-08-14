# Components for GameObjects

In an effort to make JSGE use a truly Entity-Component system instead of extending the GameObject class, we need to refactor how the GameObject class stores attributes, such as the Transform, and textures for graphics. This also has the added advantage of making the engine more modular and enabling generic loaders that can cater to different modules being loaded and used across different games.

## Old GameObject structure

The old GameObject class contains all of the fields needed by the core engine as well as the various extensions that other modules need mixed together. This makes it harder to distinguish what parts are extensions and what parts are important to the core engine, as well as making it harder to serialize properly.

- GameObject
    - id
    - name
    - group
    - parent
    - zIndex
    - children[]
    - scripts[]
    - transform
    - colliders[]
    - texture
    - priority
    - (...otherExtensions)

## New GameObject structure

The GameObject class will now put all components that extend the functionality of the game into a separate array to help separate the concerns of the game engine and increase modularity

- GameObject
    - id
    - name
    - group
    - parent
    - transform
    - children[]
    - components[]
        - id
        - name
        - gameObject (reference to GO that contains this component)

### Example Component Implementations

- ComponentBase
    - id
    - name
    - gameObject
- Behavior extends ComponentBase
    - init()
    - loop()
    - onDestroy()
- Transform extends ComponentBase
    - x
    - y
    - z
- RenderBehavior extends Behavior
    - render(...)
- RenderComponent extends ComponentBase
    - getTexture()
    - zIndex

## Module Hooks

Since Components are loosely tied to JSGE Modules (Jmods), they will need to have added hooks to deal with adding and destroying GameObjects. These also give the modules the opportunity to add or remove components or GameObjects from their internal arrays. This could mean that it takes longer to add or remove GameObjects, but this is something that can be fixed down the line (extra operations to cycle through all components).

Perhaps we can find a good way to earmark certain components to be handled by certain modules?

Also, how do we handle a component being added after a GameObject has already been enrolled into the Engine? This approach might create problems... maybe we can ~~just add the behavior script hooks to all of the Components, or we can~~ add things inside of the parent constructors to make sure things are being enrolled properly. I don't think there's going to be much of a downside to having Components be tightly associated with Modules.

- destroy - gets called when a GO is destroyed
- enroll - gets called when a new GO is enrolled