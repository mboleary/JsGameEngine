// Generate a Disabled Input
export function genDisabledInput(obj, path, labelText) {
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
export function genNumberInput(obj, path, labelText) {
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
export function genTextInput(obj, path, labelText) {
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
export function genCheckboxInput(obj, path, labelText) {
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