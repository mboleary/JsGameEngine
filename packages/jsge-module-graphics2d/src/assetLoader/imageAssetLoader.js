/**
 * Contains asset loaders for images
 */

export async function imageAssetLoader(options) {
    let p = new Promise((res, rej) => {
        let i = new Image();
        i.src = options.path;
        i.onload = () => res(i);
        i.onerror = (e) => rej(e);
    });
    options.data = await p;
    options.loaded = true;
}