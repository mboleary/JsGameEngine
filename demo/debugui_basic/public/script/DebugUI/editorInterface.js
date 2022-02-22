// Provides an interface to the editor for the Debug UI

// import config from "./editorWidgets/config.js";
import {genDisabledInput, genNumberInput, genTextInput, genCheckboxInput} from './editorWidgets/inputs.js';
import genTable from './genTable.js';

export default function genScreen(go) {
    let toRet = document.createElement('div');

    let info = document.createComment("Last Updated: " + (new Date()).toTimeString());
    toRet.appendChild(info);

    toRet.appendChild(genHeader(go));

    // toRet.appendChild(genUI(go));
    toRet.appendChild(genDetailsForObj(go));

    return toRet;
}

function genCanvas(go) {

}

function genHeader(go) {
    let toRet = document.createElement("div");
    toRet.classList.add("lineBottom");

    let h1 = document.createElement("h1");
    h1.innerText = "Object Editor";
    h1.classList.add("accent-3")
    toRet.appendChild(h1);

    let code = document.createElement("code");
    code.innerText = go.constructor.name;
    toRet.appendChild(code);

    return toRet;
}

function genUI(obj) {
    let toRet = document.createElement("div");

    

    // Take and Object and build a Value updater for it

    let objKeys = Reflect.ownKeys(obj);

    objKeys.forEach((key) => {
        console.log(key, typeof obj[key]);
        if (key === "id") {
            toRet.appendChild(genDisabledInput(obj, key, key));
        } else if (typeof obj[key] === "number") {
            toRet.appendChild(genNumberInput(obj, key, key));
        } else if (typeof obj[key] === "string") {
            toRet.appendChild(genTextInput(obj, key, key));
        } else if (typeof obj[key] === "boolean") {
            toRet.appendChild(genCheckboxInput(obj, key, key));
        } else if (typeof obj[key] === "object") {
            toRet.appendChild(preventInfLoop(obj, key, key, () => {
                try {
                    let div = document.createElement('div');
                    
                    let label = document.createElement('label');
                    label.innerText = `(Object) ${key}:`;
                    div.appendChild(label);

                    let div2 = genUI(obj[key]);
                    div2.classList.add('subInput');
                    div.appendChild(div2);
                    
                    return div
                } catch (err) {
                    return document.createComment("Cannot include Object " + key + " from " + obj);
                }
            }));
        } else {
            toRet.appendChild(genDisabledInput(obj, key, key));
        }
    });

    return toRet;
}

function genSummary(obj, key) {
    let toRet = document.createElement('summary');
    let keySpan = document.createElement('span');
    let typeSpan = document.createElement('span');
    keySpan.innerText = key;
    if (typeof obj[key] === 'object' && !obj[key]) {
        typeSpan.innerText = "null";
    } else if (typeof obj[key] === 'object' && Array.isArray(obj[key])) {
        typeSpan.innerText = "array";
    } else {
        typeSpan.innerText = typeof obj[key];
    }
    toRet.appendChild(keySpan);
    toRet.appendChild(typeSpan);
    return toRet;
}

function genDetailsForKey(obj, pathArr) {
    let key = pathArr[pathArr.length - 1];
    console.log("Details:", obj[key], typeof obj[key]);
    let toRet = document.createElement('details');
    let summary = genSummary(obj, key);
    summary.innerText = key + "|";
    toRet.appendChild(summary);
    let open = false;
    let contentDiv = document.createElement('div');
    contentDiv.classList.add('objProperty');
    toRet.appendChild(contentDiv);
    summary.onclick = (e) => {
        open = !open;
        console.log("========Status:", open);
        // Clean Details when closed
        if (!open) {
            while (contentDiv.firstChild) {
                contentDiv.removeChild(contentDiv.firstChild);
            }
            return;
        }
        let content = null;
        if (key === "id") {
            content = genDisabledInput(obj, key, key);
        } else if (typeof obj[key] === "number") {
            content = genNumberInput(obj, key, key);
        } else if (typeof obj[key] === "string") {
            content = genTextInput(obj, key, key);
        } else if (typeof obj[key] === "boolean") {
            content = genCheckboxInput(obj, key, key);
        } else if (typeof obj[key] === "object") {
            content = preventInfLoop(obj, key, key, () => {
                try {
                    let div = document.createElement('div');
                    
                    let label = document.createElement('label');
                    label.innerText = `(Object) ${key}:`;
                    div.appendChild(label);
                    
                    // let div2 = genUI(obj[key]);
                    // div2.classList.add('subInput');
                    // div.appendChild(div2);
                    
                    return div
                } catch (err) {
                    return document.createComment("Cannot include Object " + key + " from " + obj);
                }
            });
        } else {
            content = genDisabledInput(obj, key, key);
        }
        contentDiv.appendChild(content);
    }
    return toRet;
}

function genDetailsForObj(obj, pathArr = []) {
    let toRet = document.createElement('div');
    let objKeys = Reflect.ownKeys(obj);

    // Adds a display for a texture, if there is one

    if (obj.texture && obj.texture.constructor && obj.texture.constructor.name === "HTMLImageElement") {
        // My stylesheets make images be 100% wide. We don't want that here
        obj.texture.style.width = 'unset';
        toRet.appendChild(obj.texture);
    }

    objKeys.forEach((key) => {
        console.log(key, typeof obj[key]);
        let currPath = pathArr.concat(key);
        toRet.appendChild(genDetailsForKey(obj, currPath))
    });

    return toRet;
}

function preventInfLoop(obj, key, labelText, genElem) {
    let div = document.createElement("div");
    let label = document.createElement('label');
    label.innerText = `(Object) ${key}:`;
    div.appendChild(label);
    let btn = document.createElement('button');
    btn.innerText = "Generate UI";
    btn.onclick = () => {
        console.log("CLICK");
        // Clear div
        while (div.firstElementChild) {
            div.removeChild(div.firstElementChild);
        }

        // Generate the UI
        div.appendChild(genElem());
    }
    div.appendChild(btn);
    return div;
}