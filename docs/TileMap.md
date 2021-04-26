# TileMaps

This Tilemap container is built to render Orthagonal Tile-based maps.

The class is extended from a GameObject and pre-renders the entire map, giving a chunk of that render the base image of the map

## Classes

### TileMap
Top-Level Class that builds the TileMap, is in charge of providing the buffer to draw the map to

### Layer
Contains a series of Chunks that make up the level. The Layer is also responsible for drawing the tiles onto a buffer that will then be copied over to the parent TileMAp and eventually drawn to the screen.

This contains an off-screen context;

There are also layers that can hold GameObjects, and others that can hold images.

Layers also can be offset from origin.

### Chunk
Contains a series of tiles. Chunks always have the same size, but this size can be defined at runtime for each layer. If this is a smaller level, it should be safe to only have 1 chunk that contains the entire level.

Keeps track of whether or not the tiles are drawn, and if the GameObjects are spawned in.

Chunks store tiles as an id with a data number as well, formatted `ID:dd`

### Tile
This is what's drawn. 