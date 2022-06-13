/**
 * Contains the Animation Object
 */

export default class Animation {
    constructor(frames, advance) {
        this.frames = frames; // Animation Frames
        this.advance = advance; // How many frames to display each animation frame for
        this.currFrame = 0; // Current Animation Frame
        this.waitPeriod = 0; // Current Frame % advance
    }

    // Reset the animation
    reset() {
        this.currFrame = 0;
        this.waitPeriod = 0;
    }

    get currentFrame() {
        if (this.waitPeriod > this.advance) {
            this.waitPeriod = 0;
            this.currFrame++;
            if (this.currFrame >= this.frames.length) {
                this.currFrame = 0;
            }
        } else {
            this.waitPeriod++;
        }
        return this.frames[this.currFrame];
    }
}