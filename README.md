# JsGameEngine

This is a minimal, modular Game Engine built for the Browser. It utilizes modules to add the features required for the game, and nothing more.

This engine, and the core modules still require more work before they should be considered stable enough to use in production.

The project is designed to require minimal dependencies, yet be flexible enough to allow for using other libraries, as well as integrating into other projects.

## Setup

Please see [the setup document](docs/Setup.md) for information on how to run this project locally and build games with it.

## Modules

- Input: This handles managing user input from the Keyboard, and Gamepads.
- Physics: Handles collision detection
- Puppeteer: Syncs GameObject state between players connected to a Websocket Server
- Render: Draws the GameObjects to the page

## Other Notable Parts
- Asset Loader: Manages loading Assets in Groups, or individually
- Spritesheet: Class used to manage pulling images from a spritesheet

## Demo, Included Assets
This repo includes assets from an old demo game I made many years ago