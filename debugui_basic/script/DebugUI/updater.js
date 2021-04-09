// Provides Updates for the Interface

let registered = [];

export function getUpdaterElement() {
    return document.createElement("div");
}

export function registerUpdater(node, selecter, func) {
    registered.push({
        node: node,
        selecter: selecter,
        generater: func
    });
    return node;
}

export function updateAll() {
    // Updates all nodes
}

function updateNode() {
    // Delete all child elements in the node

    // Re-generate the element and append it to the node
}