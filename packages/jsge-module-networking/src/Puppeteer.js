/**
 * Puppeteer is responsible for syncing the state of a GameObject across a network connection
 */

// import { serialize, deserialize, update, getConstructor } from './Serialize.js';
// import { enrollGameObject, deleteGameObject } from './Engine.js';

import { serialize, deserialize, update, getConstructor } from 'jsge-core/src/Serialize.js';
import { enrollGameObject, deleteGameObject } from 'jsge-core/src/Engine.js';

const minFrames = 2;
const defaultFrames = 15;
let defaultUpdateFrames = 5; // Default frame delta to update everything. Will be set by Puppeteer when testing the connection

const puppets = {};
let puppeteerActive = false;
let ws = null;

// Keys to remove then converting back to an instance
const puppetKeys = [
    "isPuppet",
    "master",
    "loopsSinceLastUpdate",
    "updateFrames",
    "updateCounter",
    "puppeteerDisabled"
];

/**
 * Defines a Puppet
 * @param {Class} Base Base Class to convert into a Puppet
 * @param {Boolean} master True if this is the master 
 * @param {Number} updateFrames Number of frames to update after
 */
export const Puppet = (Base, master, updateFrames) => class extends Base {
    constructor(...params) {
        super(...params);

        // Private
        this.isPuppet = true; // Key for GameObjects to look at for checking whether or not it is a Puppet
        this.master = master || false; // If True, this the state will be sent from this Puppet to the remote ones
        this.loopsSinceLastUpdate = 0; // Count the loops since the last update
        this.updateFrames = updateFrames || defaultUpdateFrames;
        this.updateCounter = 0; // Number included with the update to distinguish updates from one another
        this.puppeteerDisabled = false; // True if the puppeteer should not send or recieve updates for this GameObject

        // Change GameObject Settings, since it will inherit the state of a remote GameObject
        if (!this.master) {
            this.priority = 0;
            this.id = "";
        }
    }

    init() {
        console.log("Puppet Init");
        super.init();
        enrollPuppet(this);
    }

    // True when this Puppet needs an update
    needsUpdate() {
        return !this.puppeteerDisabled && this.loopsSinceLastUpdate > this.updateFrames;
    }

    // Gets Update ID Number, and increments
    getUpdateNumber() {
        return this.updateCounter++;
    }

    // Get the current State of the Master Puppet
    getState() {
        this.loopsSinceLastUpdate = 0;
        return serialize(this, false, super.constructor.name);
    }

    // Set the current state of the slave puppet
    updateState(state) {
        this.loopsSinceLastUpdate = 0;
        return update(this, state, super.constructor.name);
    }

    loop() {
        this.loopsSinceLastUpdate++;
        if (super.loop) {
            super.loop();
        }
    }

    onDestroy() {
        removePuppet(this);
        super.onDestroy();
    }
}

// Enrolls a puppet into Puppeteer
function enrollPuppet(obj) {
    if (obj.id) {
        puppets[obj.id] = obj;
        // Send an update
        ws.send(JSON.stringify({
            action: "create",
            target: "*",
            id: obj.id,
            number: obj.getUpdateNumber(),
            data: obj.getState()
        }));
    }
}

function removePuppet(obj) {
    if (obj.id && puppets[obj.id]) {
        delete puppets[obj.id];
        // Send a Delete Event
        ws.send(JSON.stringify({
            action: "delete",
            target: "*",
            id: obj.id,
            data: obj.id,
            number: obj.getUpdateNumber()
        }));
    }
}

// Converts an instance into a Puppet, and enrolls it as a master object
export function convertInstanceIntoPuppet(instance) {
    if (!instance) return null;
    if (instance instanceof Puppet) return instance;
    let prevState = Reflect.ownKeys(instance);
    let toRet = new Puppet(instance.constructor, true);
    Reflect.apply(toRet, prevState);
    enrollPuppet(toRet);
    return toRet;
}

// Converts a Puppet back into its' original instance type, and removes it from the Puppeteer
export function convertPuppetIntoInstance(puppet) {
    if (!puppet) return null;
    if (!puppet instanceof Puppet) return puppet;
    let prevState = Reflect.ownKeys(puppet);
    let toRet = new puppet.super.contructor();
    Reflect.apply(toRet, prevState);
    // Remove Puppeteer Keys
    puppetKeys.forEach((key) => {
        if (toRet[key]) {
            delete toRet[key];
        }
    });
    removePuppet(puppet);
    return toRet;
}

// Disables the puppet from receiving updates from a remote instance, or prevents a master puppet from sending updates
export function disablePuppetUpdates(instance) {
    if (!instance) return null;
    if (!instance instanceof Puppet) return instance;
    instance.puppeteerDisabled = true;
    return instance;
}

// Connect to a PubSub component to receive updates
export function connect(url) {
    console.log("Connecting");
    try {
        ws = new WebSocket(url);
        console.log("Connected to " + url + " Successfully!");
        puppeteerActive = true;
    } catch (error) {
        puppeteerActive = false;
        console.error("Error:", error);
        return;
    }
    ws.onmessage = (msg) => {
        if (msg) {
            let parsed = null;
            try {
                parsed = JSON.parse(msg.data);
            } catch (e) {
                console.log("NOT JSON:", msg.data);
                return;
            }
            // @TODO Check for Message type (update, delete, etc.)
            if (parsed.data && parsed.data.data && parsed.data.data.id) {
                if (puppets[parsed.data.data.id]) {
                    console.log("Update State");
                    puppets[parsed.data.data.id].updateState(parsed.data);
                } else {
                    console.log("Adding new GameObject", parsed.data);
                    let constructor = getConstructor(parsed.data.type);
                    let instance = new (Puppet(constructor, false))();
                    let deser = update(instance, parsed.data);
                    puppets[deser.id] = deser;
                    enrollGameObject(deser);
                }
            } else {
                console.log("No Data");
            }
        } else {
            console.log("No MSG");
        }
    }
}

// Close the Websocket
export function disconnect() {
    if (!ws) return;
    ws.close();
    puppeteerActive = false;
    // Destroy all non-master puppets
    Object.keys(puppets).forEach((key) => {
        if (puppets[key] && puppets[key].master) {
            // This is a master state and needs to be downgraded
            // @TODO Add a 'on-disconnect' event handler
        } else {
            // This is remotely controlled and should be deleted
            deleteGameObject(puppets[key]);
        }
    })
}

// Called every frame to update the puppets
export function checkPuppets() {
    if (!puppeteerActive) {
        return;
    }
    Object.keys(puppets).forEach((key) => {
        if (puppets[key].master && puppets[key].needsUpdate()) {
            ws.send(JSON.stringify({
                action: "update",
                target: "*",
                id: puppets[key].id,
                number: puppets[key].getUpdateNumber(),
                data: puppets[key].getState()
                // @TODO Add owner options here
            }));
        }
    })
}

export const jmod = {
    name: "Puppeteer",
    version: 0,
    loop: () => checkPuppets()
}