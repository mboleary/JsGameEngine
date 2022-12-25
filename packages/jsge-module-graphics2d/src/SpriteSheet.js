/**
 * Contains Sprites
 */

export class SpriteSheet {
    
    constructor() {
        this.image = new Image();
        this.sheet = new Map();
    }

    // Use this if all of the sprites are the same dimensions
    async importFromPath(fpath, width, height) {
        let p = new Promise((res, rej) => {
            if (fpath && width && height) {
                this.image.src = fpath;
                this.spriteWidth = width;
                this.spriteHeight = height;
                this.image.onload = generateSpriteSheet.bind(this, res, rej);
                this.image.onerror = rej;
            } else {
                rej("Invalid parameters");
            }
        });
        this.ready = p;
        return p;
    }

    // Alternate (more powerful) way to create the Sprite Sheet
    async importFromOptions(options) {
        let p = new Promise((res, rej) => {
            if (options && options.path && options.contains && options.contains.length) {
                this.image.src = options.path;
                this.contains = options.contains;
                this.image.onload = generateSpriteSheetWithOptions.bind(this, res, rej);
                this.image.onerror = rej;
                return this.ready;
            } else {
                rej("Invalid Options");
            }
            });
        this.ready = p;
        return p;
    }
}

function generateSpriteSheet(resolve, reject) {
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

function generateSpriteSheetWithOptions(resolve, reject) {
    if (this.contains) {
        let width = this.image.width;
        let height = this.image.height;
        let promises = [];
        let keysOrder = [];
        this.contains.forEach((item) => {
            console.log(item);
            if (item.name && item.x >= 0 && item.y >= 0 && item.width && item.height && item.scaleX && item.scaleY) {
                promises.push(createImageBitmap(this.image, item.x, item.y, item.width, item.height));
                keysOrder.push(item.name);
            }
        })
        console.log(promises, this.contains);
        Promise.all(promises).then((sprites) => {
            sprites.forEach((sprite, index) => {
                this.sheet.set(keysOrder[index], sprite);
            });
            resolve();
        });
    } else {
        reject(new Error("No Options Supplied"));
    }
}