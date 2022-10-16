/**
 * Contains functions used in multiple places in the game
 */

export function deg2rad(deg) {
    return (deg / 180) * Math.PI;
}

export function randInt(min, max) {
    return Math.floor((Math.random() * (max - min)) + min);
}