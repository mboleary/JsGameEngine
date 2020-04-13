/**
 * Puppeteer is responsible for syncing the state of a GameObject across a network connection
 */

let defaultUpdateFrames = 5; // Default frame delta to update everything

/**
 * Defines a Puppet
 * @param {Class} Base Base Class to convert into a Puppet
 * @param {Boolean} master True if this is the master 
 * @param {Number} updateFrames Number of frames to update after
 */
export const Puppet = (Base, master, updateFrames) => class extends Base {
    constructor(...params) {
        super.constructor(...params);

        // Private
        this.master = master || false; // If True, this the state will be sent from this Puppet to the remote ones
        this.keysToUpdate = [];
        this.loopsSinceLastUpdate = 0; // Count the loops since the last update
        this.updateFrames = updateFrames || defaultUpdateFrames;

        // Change GameObject Settings
        if (!this.master) {
            this.priority = 0;
            this.id = "";
        }
    }

    // True when this Puppet needs an update
    needsUpdate() {
        return loopsSinceLastUpdate > updateFrames;
    }

    // returns a list of keys to update when the Puppeteer provides a state update
    initState() {
        if (super.initState) {
            return super.initState();
        }
        return Reflect.ownKeys(this);
    }

    // Get the current State of the Master Puppet
    getState() {
        this.loopsSinceLastUpdate = 0;
        if (super.getState) {
            return super.getState()
        }
        let toRet = {};
        this.keysToUpdate.forEach((key) => {
            toRet[key] = Reflect.get(this, key);
        });
        return toRet;
    }

    // Set the current state of the slave puppet
    updateState(state) {
        this.loopsSinceLastUpdate = 0;
        if (super.updateState) {
            return super.updateState(state);
        }
        Object.keys(state).forEach((key) => {
            if (keysToUpdate.indexOf(key) > -1) {
                Reflect.set(this, key, state[key]);
            }
        });
    }

    loop() {
        this.loopsSinceLastUpdate++;
        if (super.loop) {
            super.loop();
        }
    }
}

// Converts an instance into a Puppet
export function convertInstanceIntoPuppet(instance) {
    if (!instance) return null;
    if (instance instanceof Puppet) return instance;
    let prevState = Reflect.ownKeys(instance);
    let toRet = new Puppet(instance.constructor, true);
    Reflect.apply(toRet, prevState);
    return toRet;
}

export function disablePuppetUpdates(instance) {
    if (!instance) return null;
    if (!instance instanceof Puppet) return instance;
    instance.needsUpdate = () => {
        return false;
    }
    return instance
}