/**
 * A Transform hold position, rotation, and Scale data for an object
 */

export default class Transform {
    constructor() {
        this.position = new Three(0, 0, 0);
        this.rotation = new Three(0, 0, 0);
        this.scale = new Three(1, 1, 1);
    }

    deepCopy(transform) {
        this.position = new Three(transform.position.x, transform.position.y, transform.position.z);
        this.rotation = new Three(transform.rotation.x, transform.rotation.y, transform.rotation.z);
        this.scale = new Three(transform.scale.x, transform.scale.y, transform.scale.z);
    }

    // @TODO Figure out a way to get coordinates for rendering things
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

    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
        this.z += vec.z;
    }

    subtract(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        this.z -= vec.z;
    }

    scale(num) {
        this.x *= num;
        this.y *= num;
        this.z *= num;
    }

    subtract(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        this.z -= vec.z;
    }

    multiply(vec) {
        this.x *= vec.x;
        this.y *= vec.y;
        this.z *= vec.z;
    }
}