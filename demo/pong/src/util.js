/**
 * Contains functions used in multiple places in the game
 */

export function deg2rad(deg) {
    return (deg / 180) * Math.PI;
}

export function randInt(min, max) {
    return Math.floor((Math.random() * (max - min)) + min);
}

export function randColor() {
    const r = randInt(0,255);
    const g = randInt(0,255);
    const b = randInt(0,255);
    return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
}