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
            messages[messageNumber] = {
                resolve: resolve,
                params: {
                    from,
                    isGameObject,
                    pathArr,
                    blacklist,
                    maxDepth
                }
            }
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
            messages[messageNumber] = {
                resolve: resolve,
                params: {
                    from,
                    isGameObject,
                    pathArr,
                    value,
                    method
                }
            }
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
            messages[messageNumber] = {
                resolve: resolve,
                params: {
                    from,
                    isGameObject,
                    pathArr,
                    params
                }
            }
        })
    }
}

window.addEventListener("message", handleMessage, false);

function handleMessage(e) {
    //@TODO Check origin eventually
    console.log("Received Message:", e);
    if (e.data && e.data.number) {
        // @TODO Properly rebuild the data being sent here
        let resData = deserializeDebugData(e.data.data);
        console.log("Data:", resData);
        messages[e.data.number].resolve(resData);
        setTimeout(() => {
            delete messages[e.data.number];
        }, 100)
    }
}

// Constructs a proper object from the data sent from the Debug Messages
function deserializeDebugData(data, msgParams) {
    if (!data.extra.length) {
        return data.data;
    }

    let toRet = {};
    if (data.constructor === "Array") {
        toRet = [];
    }
    Object.assign(toRet, data.data);
    data.extra.forEach((item) => {
        if (item.type === "ref") {
            let keyRef = toRet;
            let last = item.key.pop();
            item.key.forEach((part) => {
                keyRef = keyRef[part];
            });
            // Set the ref
            let value = toRet;
            item.to.forEach((part) => {
                value = value[part];
            });
            keyRef[last] = value;
        } else if (item.type === "function") {
            let newFunc = (...params) => {
                const callFctParams = {};
                Object.assign(callFctParams, msgParams);
                callFctParams.params = params;
            };
            let keyRef = toRet;
            let last = item.key.pop();
            item.key.forEach((part) => {
                keyRef = keyRef[part];
            });
            keyRef[last] = newFunc;
        } else if (item.type === "constructed" && constructorTypes[item.constructor]) {
            let newInstance = constructorTypes[item.constructor](item.data);
            console.log("New Item:", newInstance);
            let keyRef = toRet;
            let last = item.key.pop();
            item.key.forEach((part) => {
                keyRef = keyRef[part];
            });
            keyRef[last] = newInstance;
        }
    });
    return toRet;
}

// Re-construct deconstructed classes
const constructorTypes = {
    HTMLImageElement: (data) => {
        console.log("Image Constructor", data);
        if (data.url) {
            let i = new Image();
            i.src = data.url;
            return i;
        }
    }
}