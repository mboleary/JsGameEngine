/**
 * Audio Module
 */

 import { BaseEffect } from './EffectsContainer.js';
import AudioPlayer from './Player.js';

export default {
    name: "Audio",
    version: 0,
    init: () => {
        initAudio();
    },
    loop: () => {}
}

let audioContext = null;

export function initAudio() {
    audioContext = new AudioContext();
    console.log(audioContext);
    // @TODO init mixer
}

export function getAudioContext() {
    return audioContext;
}

function devDemo () {
    const asset = "/asset/final.wav";
    let ap = new AudioPlayer(asset);
    ap.play(true);
    return ap;
}

function devDemo2(ap) {
    const eff = new BaseEffect(audioContext.createGain());
    ap.effects.add(eff);
}

window.devDemo = devDemo;
window.devDemo2 = devDemo2;