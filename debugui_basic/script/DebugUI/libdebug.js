/**
 * Handles communication between the main window and the debug window
 */

let messages = {}; // Keeps track of the messages
let currNum = 1;

export function getData(from, isGameObject, pathArr) {
    const messageNumber = currNum;
    let msgToSend = {
        type: "GET",
        number: messageNumber,
        data: {
            from: from,
            var: pathArr || []
        }
    };
    if (isGameObject) {
        msgToSend.data.select = from;
        msgToSend.data.from = "gameObject";
    }
    if (window.opener) {
        window.opener.postMessage(msgToSend, "*"); // @TODO specify origin
        currNum++;
        return new Promise((resolve) => {
            messages[messageNumber] = resolve;
        })
    }
}

export function setValue(from, isGameObject, pathArr, value, method) {
    const messageNumber = currNum;
    let msgToSend = {
        type: "SET",
        number: messageNumber,
        data: {
            from: from,
            var: pathArr || [],
            data: value,
            method: method
        }
    };
    if (isGameObject) {
        msgToSend.data.select = from;
        msgToSend.data.from = "gameObject";
    }
    if (window.opener) {
        window.opener.postMessage(msgToSend, "*"); // @TODO specify origin
        currNum++;
        return new Promise((resolve) => {
            messages[messageNumber] = resolve;
        })
    }
}

window.addEventListener("message", handleMessage, false);

function handleMessage(e) {
    //@TODO Check origin eventually
    if (e.data && e.data.number) {
        messages[e.data.number](e.data.data);
        delete messages[e.data.number];
    }
}