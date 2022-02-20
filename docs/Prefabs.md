# Prefabricated Objects (Prefabs)

Prefabs describe how a GameObject should be constructed from basic building blocks, so that a custom class extending GameObject does not need to be created in order to add a new type of GameObject to the game.

Ideally, prefabs should just be used for GameObjects, but a similar format could be utilized for other types of data and assets.

## Format

Prefabs will be defined as JSON, where it gives basic information about the prefab, some metadata, instructions on how to load the parts, and the data, with neessary features to allow for the Prefab to be properly instantiated.

```json
{
    "name": "TEST Prefab",
    "version": 0,
    "meta": {
        "meta-data-here": true
    },
    "data": [
        // Array of data that will be constructed
        {
            "type": "GameObject",
            "loader": "gameobject",
            "path": "",
            "data": {
                // Actual base data of the GameObject, in this case
                "name": "test",
                "group": "prefabs",
                "zIndex": 0,
                "colliders": []
            }
        }
    ]
}
```

## Producing and Consuming the data

When deconstructing the data, careful consideration must be taken into account on how the data will be re-constructed.

I propose a system where the data will be deconstructed into an array of nodes that will contain type and path information. When the data is re-constructed, it will use that path information to rebuild the data tree.

Order of construction:
- sort the array into depth-first, based on the `path` variable.
- Starting with the root (parent-most), start to re-construct the object
    - Using the node's type data, use the appropriate loader and insert the data

Order of deconstruction:
- Go depth-first into the object, and use the appropriate type data to construct the array of nodes

The deconstruction will behave similarly to how the debug interface's message protocol does, where there the `extra` array is used to define cyclical references, and objects properly

When constructing a prefab, it might be worthwhile to make a "Template" GameObject to clone so that a prefab doesn't need to be loaded over and over, especially if this comes out to be an expensive operation.