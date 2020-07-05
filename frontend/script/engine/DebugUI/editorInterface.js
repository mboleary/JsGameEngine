// Provides an interface to the editor for the Debug UI

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

function genUI(obj, allowObject = true) {
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
        } else if (allowObject && typeof obj[key] === "object") {
            try {
                let div = document.createElement('div');
                
                let label = document.createElement('label');
                label.innerText = `(Object) ${key}:`;
                div.appendChild(label);

                let div2 = genUI(obj[key], false);
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

// Generate a Disabled Input
function genDisabledInput(obj, path, labelText) {
    let toRet = document.createElement('div');
    toRet.classList.add("inputSeperator");

    let label = document.createElement('label');
    label.innerText = labelText;
    toRet.appendChild(label);

    toRet.appendChild(document.createElement('br'));

    let input = document.createElement('input');
    input.type = "text";
    input.disabled = true;
    input.value = obj[path];
    toRet.appendChild(input);

    return toRet;
}

// Generate a Numeric Input
function genNumberInput(obj, path, labelText) {
    let toRet = document.createElement('div');
    toRet.classList.add("inputSeperator");

    let label = document.createElement('label');
    label.innerText = labelText;
    toRet.appendChild(label);

    toRet.appendChild(document.createElement('br'));

    let input = document.createElement('input');
    input.type = "number";
    input.value = obj[path];
    // Update when element loses focus
    input.onblur = (e) => {
        obj[path] = e.target.value;
    };
    toRet.appendChild(input);

    return toRet;
}

// Generate a Text Input
function genTextInput(obj, path, labelText) {
    let toRet = document.createElement('div');
    toRet.classList.add("inputSeperator");

    let label = document.createElement('label');
    label.innerText = labelText;
    toRet.appendChild(label);

    toRet.appendChild(document.createElement('br'));

    let input = document.createElement('input');
    input.type = "text";
    input.value = obj[path];
    // Update when element loses focus
    input.onblur = (e) => {
        obj[path] = e.target.value;
    };
    toRet.appendChild(input);

    return toRet;
}

// Generate a Checkbox Input
function genCheckboxInput(obj, path, labelText) {
    let toRet = document.createElement('div');
    toRet.classList.add("inputSeperator");

    let label = document.createElement('label');
    label.innerText = labelText;
    toRet.appendChild(label);

    toRet.appendChild(document.createElement('br'));

    let input = document.createElement('input');
    input.type = "checkbox";
    input.checked = obj[path];
    // Update when element loses focus
    input.onblur = (e) => {
        obj[path] = e.target.checked;
    };
    toRet.appendChild(input);

    return toRet;
}