/**
 * Contains Sprites
 */

let resolve = null;

export default class SpriteSheet {
    constructor(fpath, width, height) {
        this.image = new Image();
        this.image.src = fpath;
        this.sheet = new Map();
        this.spriteWidth = width;
        this.spriteHeight = height;
        this.ready = new Promise((res, rej) => {
            resolve = res;
            this.image.onload = generateSpriteSheet.bind(this);
            
        });
    }
    
    
}

function generateSpriteSheet() {
    let width = this.image.width;
    let height = this.image.height;
    let promises = [];
    for (let h = 0; h < height; h += this.spriteHeight) {
        for (let w = 0; w < width; w += this.spriteWidth) {
            promises.push(createImageBitmap(this.image, w, h, this.spriteWidth, this.spriteHeight));
        }
    }
    Promise.all(promises).then((sprites) => {
        sprites.forEach((sprite, index) => {
            this.sheet.set(index, sprite);
        });
        resolve();
    });
}