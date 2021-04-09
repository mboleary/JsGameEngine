# Tile Grid

This is a grid that holds tiles of a uniform size.

## Classes

- Grid
    - Override for different layouts (isometric)
    - This generates the Tiles that are added to the scene, and manages culling the tiles that are not active
    - Contains some properties, such as tile size

- Tile
    - This is the unit of the tile grid
    - Override this to give behaviors to certain tiles