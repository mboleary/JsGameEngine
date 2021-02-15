# About Networking

This documents the new Networking model for JSGE. The networking system is based around PubSub components that operate using rooms to separate connected clients. My hope is that this networking model can be used for multiple paradigms, such as having the entire game state be controlled by a single trusted "server", or allowing each client to control their own GameObject, or even taking a hybrid approach where the state is verified by the server.

## Anatomy of the Websocket State updater

The Websocket is used to sync the state of GameObjects across different clients. It offers 2 modes: cached and uncached messaging.

### Message format

This is what the typical message looks like:

```js
let msg = {
    action: "update",
    target: "*",
    id: puppets[key].id,
    number: puppets[key].getUpdateNumber(),
    data: puppets[key].getState(),
    owner: ownerInfo
};
```

Let's break it down by part:

- `action`: The type of message this is. Can be 1 of:
    - create
    - update
    - get
    - delete
    - chown (changes ownership of GameObject)
    - message (not meant to update GameObjects)
- `target`: Where the message should be directed. Can be 1 of:
    - '*' (all clients except the sender)
    - 'server' (the pubsub server)
    - any client ID
- `id`: (required for gameobjects only) The ID of the GameObject to CRUD.
- `number`: (optional, used mainly in GameObjects) the message number for a given GameObject or message. This is here to help the client and server make sure that they've received all of the updates and keep things in sync.
- `data`: This is the payload to send. See below for how Puppeteer does this.
- `owner`: (required for creating GameObjects only) This is used to define who the owner of a GameObject is.

For data, there are a few options when it comes to GameObjects:
- create / update: The data should be the serialized state of the GameObject
- get / delete: The data is not used. ID should be set to what GameOBject will be deleted
- chown: The Owner ID to transfer ownership to
- message: Can be anything. The API doesn't care.

In many types of messages, the server will not respond, but there are a few events that the server will broadcast a message for:
- A client joining / leaving the room
- The room being closed
- testing latency

The server generally only responds if an invalid message is sent, or there is some other type of error:
- If a client tries to update a GameObject it doesn't have ownership of
- If a `chown` is done to an invalid client
- If an update is done to an invalid GameObject ID

When a client joins a room, they will receive some data about the current state of the game:

1. their own client information

2. information about other clients

3. gameObject information

### Message response format

For some requests and some events, the server will send a message to all connected clients.

```js
let a = {
    code: "codestr",
    err: "message",
};
let b = {
    event: "join",
    data: {...}
}
```

Let's break down the response format for errors:
- `code`: The response code, generally signifies an error, or success
- `err`: The Error String
- `data`: (optional) Additional Data

And then the response format for Events
- `event`: The name of the event that is occurring
- `data`: The data that is associated with the event

Here are the event names:
- join - Fired when a new client joins the room
- leave - Fired when a client disconnects from the room
- kick - Fired when a client is removed by the server
- init - Sent to a client that has just connected to the room.
    - `data` will contain the other clients and gameObjects in cache

### PingPong

We can use pinging to verify that a client is still connected, and also to measure the connection latency. 

## Reference

https://nodejs.org/api/http.html#http_response_req
- `req` object
https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
- Ready State Constants
https://github.com/websockets/ws/blob/master/doc/ws.md#serverclients
- Websocket Server Detailed Documentation
https://github.com/websockets/ws#api-docs
https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
- Websocket close event codes