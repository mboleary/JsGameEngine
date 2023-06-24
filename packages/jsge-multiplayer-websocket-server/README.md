# JSGE Multiplayer Websocket Server

A websocket server used to sync game state among multiple JSGE clients by caching entity updates as they are sent.

This server follows the [Publish Subscribe Pattern](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) where connected clients push updates for the state of the entities they own, and can also send messages directly to other clients as needed.

