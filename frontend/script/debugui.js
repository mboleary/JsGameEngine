// Contains scripting for the Debug UI

import genTable from './engine/DebugUI/genTable.js';

const table = document.getElementById('table');
const view = document.getElementById('view');

const cols = [
    {
        path: "id",
        title: "ID",
        primaryKey: true,
        style: (data) => {
            return "color: gray";
        }
    },
    {
        path: "name",
        title: "Name"
    },
    {
        path: "group",
        title: "Group"
    },
    {
        path: "transform",
        title: "Transform: Position",
        transform: (data) => {
            return `x:${data.position.x} y:${data.position.y} z:${data.position.z}`
        }
    },
    {
        path: "children",
        title: "Number of Children",
        transform: (data) => {
            return data.length
        }
    },
    {
        path: "parent",
        title: "Parent",
        transform: (data) => {
            if (data) {
                return `<a href="#${data.id}">${data.id}</a>`;
            }
            return "";
        }
    },
];

const handleClick = (item) => e => {
    console.log(item);
};

function main() {
    if (!window.opener) {
        table.innerText = "Cannot access main game window!";
        return;
    }
    
    refreshHeader();
    refreshTable();
    
    if (window.location.hash) {
        console.log(window.location.hash);
        const selected = document.getElementById(window.location.hash.substring(1)); // Removes leading #
        if (selected) {
            selected.classList.add("selected");
        }
    }
}

function refreshHeader() {
    const header = document.getElementById('header');

    let h1 = document.createElement('h1');
    h1.innerText = "Debug Window";
    header.appendChild(h1);

    let code = document.createElement('code');
    code.innerText = window.opener.location.href;
    header.appendChild(code);

    let time = document.createElement('p');
    time.innerText = "time";
    setInterval(() => {
        time.innerText = "Game Time: " + window.opener.debug.engine.getTime();
    }, 1000);

    header.appendChild(refreshButtons());

    header.appendChild(time);
}

function refreshButtons() {
    let div = document.createElement('div');
    
    let stopTimeBtn = document.createElement('button');
    stopTimeBtn.onclick = e => {
        window.opener.debug.engine.stopGameLoop();
    }
    stopTimeBtn.innerText = "Stop Game Time";
    div.appendChild(stopTimeBtn);

    let stepTimeBtn = document.createElement('button');
    stepTimeBtn.onclick = e => {
        window.opener.debug.engine.stepGameLoop();
    }
    stepTimeBtn.innerText = "Step Game Time";
    div.appendChild(stepTimeBtn);

    let startTimeBtn = document.createElement('button');
    startTimeBtn.onclick = e => {
        window.opener.debug.engine.restartGameLoop();
    }
    startTimeBtn.innerText = "Restart Game Time";
    div.appendChild(startTimeBtn);

    return div;
}

function refreshTable() {
    let tbl = genTable(window.opener.debug.engine.gameObjects, handleClick, cols);
    table.appendChild(tbl);
}

main();