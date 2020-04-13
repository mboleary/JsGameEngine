# TODO

## Puppeteer

Write the Websocket client to communicate with the remote server

- Specify a player ID

- Send and recieve updates through the web worker, which should abstract all of the authentication stuff away

## Engine

Finish the Base requirements of the Engine

- Delta Time

- Ability to run scripts from GameObjects

- Ability to add and remove GameObjects from the playfield

- Input System to capture the state of the controller every frame

- Provide API to make adding scripts to a GameObject through extending the GameObject class easier

## Level System

- Block Chunks

- Layers

- Importing data from a remote source
    - Part of web worker

- Removing layers when there is nothing left on them

## Physics

- Implement collision detection

- Implement Colliders

## Scripting

- (Future) - Provide a Block-based API for Scripting