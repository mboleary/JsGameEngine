/**
 * Plays an audio file
 */

import { getAudioContext } from './Audio.js';

export default class AudioPlayer {

    constructor(fname) {
        const audioContext = getAudioContext();
        this.audio = new Audio(fname);
        this.track = audioContext.createMediaElementSource(this.audio);
        this.track.connect(audioContext.destination);
        this.playing = false;
    }

    play = (loop) => {
        const audioContext = getAudioContext();

        // Fixes audio not playing when page loads due to permissions
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        if (this.audio.ended) {
            this.playing = false;
        }

        if (!this.playing) {
            this.playing = true;
            if (loop) {
                this.audio.loop = true;
            }
            this.audio.play();
        } else {
            console.log("not playing");
        }
    }

    pause = () => {
        if (this.playing) {
            this.playing = false;
            this.audio.pause();
        }
    }

    stop = () => {
        if (this.playing) {
            this.playing = false;
            this.audio.pause();
            this.audio.currentTime = 0;
        }
    }

    getTime = () => {
        return this.audio.currentTime;
    }

    getDuration = () => {
        return this.audio.duration;
    }

    isMuted = () => {
        this.audio.muted;
    }

    isLooping = () => {
        return this.audio.loop;
    }

    mute = (mute) => {
        this.audio.muted = mute;
    }

    loop = (loop) => {
        this.audio.loop = loop;
    }

    setTime = (time) => {
        return this.audio.currentTime = time;
    }

    

    setLoop
}