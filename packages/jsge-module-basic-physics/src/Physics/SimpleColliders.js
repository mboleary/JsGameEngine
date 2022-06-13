/**
 * Contains classes for Simple 2D Colliders (e.g. Square)
 */

export class Collider {
    constructor(height, width, go) {
        this.height = height;
        this.width = width;
        this.gameObject = go;
    }

    getHeight() {
        return this.height;
    }

    getWidth() {
        return this.width;
    }

    getGameObject() {
        return this.gameObject;
    }

    hasCollidedWith(b) {
        return isCollided(this, b);
    }
}

// Returns true if and b intersect
export function isCollided(a, b) {
    let aObj = {
        x: a.getGameObject().transform.position.x,
        y: a.getGameObject().transform.position.y,
        w: a.getWidth(),
        h: a.getHeight(),
        sclX: a.getGameObject().transform.scale.x,
        sclY: a.getGameObject().transform.scale.y
    };
    let bObj = {
        x: b.getGameObject().transform.position.x,
        y: b.getGameObject().transform.position.y,
        w: b.getWidth(),
        h: b.getHeight(),
        sclX: b.getGameObject().transform.scale.x,
        sclY: b.getGameObject().transform.scale.y
    };

    if (bObj.x > aObj.x + (aObj.w * aObj.sclX) &&
        aObj.x < bObj.x + (bObj.w * bObj.sclX) &&
        bObj.y > aObj.y + (aObj.h * aObj.sclY) &&
        aObj.y < bObj.y + (bObj.h * bObj.sclY)) {
        return true;
    }
    return false;
}