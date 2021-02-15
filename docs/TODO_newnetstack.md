# TODO for new network stack

## Client

- Implement connection retry
- Create a Network manager class to manage getting, creating, deleting rooms
    - It should handle joining / leaving rooms, sending messages to other parts of the application, like Puppeteer
    - Should also have events that can be hooked into, such as a room join or leave event, connect, disconnect events

## Server

- Track message numbers from GameObjects for cache
- Implement get message when a message is missed
- Implement Latency Tracking by using the pingpong messages
- When Authentication is implemented, implement access token verification when connecting
    - This should be modular, since not everyone is going to use the same authentication system
- Implement a way to add "repeater" rooms
    - These rooms repeat signals from another room
- Implement environment variable for max room size
- Implement a "redirect" message
    - Could be used to move a client from one room to another seamlessly

## External

- Implement a way to authenticate players
- Implement a storage mechanism for assets with authorization