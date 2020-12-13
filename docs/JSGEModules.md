# Modular Game Engine

I realized that all of the different parts of the Game Engine all do the following "tasks":

1. Initialize
2. Loop

In addition, we will probably need to hook on a few events

1. Closing the Browser Window / Game End
2. Debug Events
    - On Debug Game Pause
    - On Debug Game Step
    - On Debug Game Restart

## Role of the Engine

The Engine functions are responsible for handling the different tasks associated with running a game. It is responsible for running core functions (storing GameObjects, running the Game Loop, and keeping track of time), and enforcing some of the engine-specific rules, such as the GameObject Order.

## JSGE Modules (jmod)

JSGE Modules provide functionality to the Game Engine, doing things like handling input, or rendering images on the screen. They can implement one or more of the events here, and will be run accordingly when the Engine is initialized.

All JSGE Modules will extend the Jmod class:

Jmod Functions:
- init()
- loop()
- onClose()
- onDebugEvent()
    - Will have event details about which event

Jmod Variables:
- name: Module Name
- version: Module Version

Parameters passed to the functions
- Event Details
- GameObject Array
- 

## Engine API for Jmods

The Modules can ONLY be loaded before the engine is initialized. Modules will be initialized and run in the order that they are added.

Functions:
- addJmod(jmod): Adds a Jmod to the engine. Call this before initializing the engine
- initGameLoop() [Already Implemented]: Initialize the Game Engine. Disallow jmods from being loaded afterwards

Modules will be run in the order that they are added, which is why we cannot allow modules to be loaded after the Engine is started.

## Conventions and Best Practices

Rendering should always be done last, after everything else has run.