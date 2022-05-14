# JSGE Events

I've realized that having an event handler for GameObjects would be very useful, and that having one that's similar to the existing one for HTML Elements would be convenient for JS developers.

## Event Module

Events are going to be built into the Engine. It will NOT be implemented as an optional module. Since everything is a GameObject in the engine, we want the events to bubble up the GameObjects like how it would on HTML elements.

## Built-in events

Here are some examples of events that are fired by various JSGE GameOjects:

- Puppeteer
    - connect
    - disconnect
    - update
- GameObject
    - destroy
- Collision
    - collide
- Audio
    - play
    - loop
    - pause
    - stop
- Engine (events should be fired on Scene or whatever is on the highest level)
    - pause
- UI (Implement this through the scene or other top-level object)
    - some ui event
- Input
    - click
    - keyevent

## Architecture

Since it looks like it's going to be hard to use the existing DOM-related classes, we're going to use a custom event class that's similar enough to the DOM ones, but with some improvements to make it more convenient to use.

An event dispatch should be asyncronous, where the first call isn't blocked by all of the event listeners being executed. The event listeners, however should be executed syncronously, since we need to look for things like stopping event bubbling.

The event handling classes could wrap around other systems, and could be made to use existing event systems, such as the NodeJS one, or the one used in HTMLElements.

### Functions

- Subscribe to an event type

- Unsubscribe from an event type

- Emit an event
    - Specify how the event will handle bubbling

- Get number of handlers for an event

### Classes and  Interfaces

- JSGEEvent
    - Contains the Event name and data
- JSGEEventTarget
    - Defines functions used for handling and emitting events

