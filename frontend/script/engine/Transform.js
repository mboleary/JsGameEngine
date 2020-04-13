/**
 * A Transform hold position, rotation, and Scale data for an object
 */

export default class Transform {
    constructor() {
        this.position = new Three(0, 0, 0);
        this.rotation = new Three(0, 0, 0);
        this.scale = new Three(1, 1, 1);
    }
}

/**
 * Stores 3 PArameters that make up a point in 3D space
 */

export class Three {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}