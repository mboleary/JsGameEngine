# Asset Loading

Assets need to be loaded in dynamically, when they are needed. This system should support loading asset in arbitrarily as needed.

## Loading method

`asset(...).then(...)`

Use a promise to import and load the asset, but also keep track if the asset has already been loaded. Track assets by name.

Use a loader: `load(<ASSET_OPTIONS>)` to load the asset, set an asset name, and loader/type

then, use `asset(<ASSET_NAME>).then(...)` to access the asset after it has been loaded.

Asset Options look like:
- Asset Options
    - asset name
    - asset path
    - asset options
    - asset type/loader

## Supported Formats

- Image
- Audio
- Text / JSON