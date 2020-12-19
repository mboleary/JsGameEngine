/**
 * Audio Module
 */

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

window.devDemo = devDemo;