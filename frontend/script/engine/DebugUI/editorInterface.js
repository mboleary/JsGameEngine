// Provides an interface to the editor for the Debug UI

// import config from "./editorWidgets/config.js";
import {genDisabledInput, genNumberInput, genTextInput, genCheckboxInput} from './editorWidgets/inputs.js';

export default function genScreen(go) {
    let toRet = document.createElement('div');

    let info = document.createComment("Last Updated: " + (new Date()).toTimeString());
    toRet.appendChild(info);

    toRet.appendChild(genHeader(go));

    toRet.appendChild(genUI(go));

    return toRet;
}

function genCanvas(go) {

}

function genHeader(go) {
    let toRet = document.createElement("div");
    toRet.classList.add("lineBottom");

    let h1 = document.createElement("h1");
    h1.innerText = "Object Editor";
    toRet.appendChild(h1);

    let code = document.createElement("code");
    code.innerText = go.constructor.name;
    toRet.appendChild(code);

    return toRet;
}

function genUI(obj, allowObject = 3) {
    let toRet = document.createElement("div");

    // @TODO Add Display for Canvas

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
        } else if (allowObject > 0 && typeof obj[key] === "object") {
            try {
                let div = document.createElement('div');
                
                let label = document.createElement('label');
                label.innerText = `(Object) ${key}:`;
                div.appendChild(label);

                let div2 = genUI(obj[key], (allowObject - 1));
                div2.classList.add('subInput');
                div.appendChild(div2);
                
                toRet.appendChild(div);
            } catch (err) {
                toRet.appendChild(document.createComment("Cannot include Object " + key + " from " + obj));
            }
            
        } else {
            toRet.appendChild(genDisabledInput(obj, key, key));
        }

    });

    return toRet;
}