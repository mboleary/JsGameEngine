/**
 * Manages plugging and unplugging effects from a track on the fly
 */

// import uuid from '../UUID.js';
import {nanoid} from "../node_modules/nanoid/index.browser.js";

const ID_LEN = 8;

export default class EffectsContainer {
    constructor(source, destination) {
        this.effectsArray = []; // Array of effects to be applied
        this.source = source; // Source Audio Track
        this.destination = destination; // Destination Audio Track
        this.source.connect(this.destination);
    }

    // Inserts an effect at a specific index
    insert = (effect, idx) => {
        if (idx >= this.effectsArray.length || idx < 0) {
            throw new Error("Index out of bounds");
        }
        
        // Find Prev and Next in Effects Chain
        let prev = null, next = null;

        let curr = effect.getEffect();

        if (this.effectsArray.length === 0) {
            prev = this.source;
            next = this.destination;
        } else if (idx === 0) {
            prev = this.source;
            next = this.effectsArray[0].getEffect();
        } else if (idx === this.effectsArray.length) {
            prev = this.effectsArray[idx].getEffect();
            next = this.destination;
        } else {
            prev = this.effectsArray[idx - 1].getEffect();
            next = this.effectsArray[idx].getEffect();
        }

        // Break Prev and Next connection
        prev.disconnect(next);

        // Add the new Effect to the array
        this.effectsArray.splice(idx, 0, effect);

        console.log(prev, next);

        // Connect the new Effect, nd re-connect to the chain
        prev.connect(curr);
        curr.connect(next);
    }

    add = (effect) => {
        // Find Prev and Next in Effects Chain
        let prev = null, next = null;

        let curr = effect.getEffect();

        if (this.effectsArray.length === 0) {
            prev = this.source;
            next = this.destination;
        } else {
            prev = this.effectsArray[this.effectsArray.length - 1].getEffect();
            next = this.destination;
        }

        prev.disconnect(next);

        this.effectsArray.push(effect);

        console.log(prev, curr, next);

        prev.connect(curr);
        curr.connect(next);
    }

    get length() {
        return this.effectsArray.length;
    }

    getEffectByID = (id) => {
        for (const e of this.effectsArray) {
            if (e.id === id) {
                return e;
            }
        }
    }

    getEffectIndexByID = (id) => {
        for (let i = 0; i < this.effectsArray.length; i++) {
            const e = this.effectsArray[i];
            if (e.id === id) {
                return i;
            }
        }
    }

    remove = (effect) => {
        for (let i = 0; i < this.effectsArray.length; i++) {
            const e = this.effectsArray[i];
            if (e.id === effect.id || e.id === effect) {
                console.log("Index:", i);
                // Disconnect the effect
                let prev = null, next = null;

                let curr = e.getEffect();

                if (this.effectsArray.length === 1) {
                    prev = this.source;
                    next = this.destination;
                } else if (i === 0) {
                    prev = this.source;
                    next = this.effectsArray[i + 1].getEffect();
                } else if (i === this.effectsArray.length - 1) {
                    prev = this.effectsArray[i - 1].getEffect();
                    next = this.destination;
                } else {
                    prev = this.effectsArray[i - 1].getEffect();
                    next = this.effectsArray[i + 1].getEffect();
                }

                prev.disconnect(curr);
                curr.disconnect(next);
                prev.connect(next);

                this.effectsArray.splice(i, 1);
                
                return;
            }
        }
    }


}

// Wraps around an AudioNode-based processing module
export class Effect {
    constructor() {
        // this.id = uuid();
        this.id = nanoid(ID_LEN);
    }

    // // connects a source and destination
    // connect(src, dest) {

    // }

    // // disconnects this effect when shuffling things around
    // disconnect(dest) {

    // }

    getEffect() {
        return null;
    }
}

// Wraps around an AudioNode
export class BaseEffect extends Effect {
    /**
     * Constructor
     * @param {AudioNode} effect Node to connect to the EffectsContainer
     */
    constructor(effect) {
        super();
        this.effect = effect;
    }

    getEffect() {
        return this.effect;
    }
}