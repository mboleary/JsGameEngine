# General Code Path for JSGE Projects

JSGE is complicated and requires some degree of boilerplate code to initialize everything properly.

Starting Point:
- `main.js` - Starting Point, first script loaded
- `init.js` - Initializes everything in a default way
    - Load JSGE Modules
    - Init Keymappings
    - Load Main Assets
    - Load the first Scene
