/**
 * Handles communication between the main window and the debug window
 */

let messages = {}; // Keeps track of the messages
let currNum = 1;

export function getData(from, isGameObject, pathArr, blacklist = [], maxDepth = -1) {
    const messageNumber = currNum;
    let msgToSend = {
        type: "GET",
        number: messageNumber,
        data: {
            from: from,
            var: pathArr || [],
            blacklist: blacklist,
            maxDepth: maxDepth
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

export function callFunction(from, isGameObject, pathArr, params) {
    const messageNumber = currNum;
    let msgToSend = {
        type: "ACTION",
        number: messageNumber,
        data: {
            from: from,
            var: pathArr || [],
            params: params
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
    console.log("Received Message:", e);
    if (e.data && e.data.number) {
        // @TODO Properly rebuild the data being sent here
        messages[e.data.number](e.data.data.data);
        setTimeout(() => {
            delete messages[e.data.number];
        }, 100)
    }
}

// Constructs a proper object from the data sent from the Debug Messages
function deserializeDebugData(data) {
    if (!data.extra.length) {
        return data.data;
    }

    let toRet = {};
    data.extra.forEach((item) => {

    })
}