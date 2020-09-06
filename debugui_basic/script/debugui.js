// Contains scripting for the Debug UI

import genTable from './DebugUI/genTable.js';

import genScreen from './DebugUI/editorInterface.js';

import {getData, setValue, callFunction} from './DebugUI/libdebug.js';

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
    // console.log(item, Reflect.ownKeys(item));
    getData(item.id, true, [], ["parent"]).then(data => {
        refreshView(data);
    })
};

function main() {
    if (!window.opener) {
        table.innerText = "Cannot access main game window!";
        return;
    }

    window.getData = getData;
    window.setValue = setValue;
    window.callFunction = callFunction;
    
    refreshHeader();
    refreshTable();
    
    if (window.location.hash) {
        handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
}

function handleHashChange() {
    console.log(window.location.hash);
    const selected = document.getElementById(window.location.hash.substring(1)); // Removes leading #
    if (selected) {
        selected.classList.add("selected");
    }
}

function refreshHeader() {
    const header = document.getElementById('header');

    let h1 = document.createElement('h1');
    h1.innerText = "Debug Window";
    header.appendChild(h1);

    let code = document.createElement('code');
    // code.innerText = window.opener.location.href;
    getData("location", false, []).then((location) => {
        code.innerText = location;
    })
    header.appendChild(code);

    let time = document.createElement('p');
    time.innerText = "time";
    setInterval(() => {
        callFunction("engine", false, ["getTime"]).then((value) => {
            time.innerText = "Game Time: " + value;
        })
    }, 1000);

    header.appendChild(refreshButtons());

    header.appendChild(time);
}

function refreshButtons() {
    let div = document.createElement('div');
    
    let stopTimeBtn = document.createElement('button');
    stopTimeBtn.onclick = e => {
        callFunction("engine", false, ["stopGameLoop"]);
    }
    stopTimeBtn.innerText = "Stop Game Time";
    div.appendChild(stopTimeBtn);

    let stepTimeBtn = document.createElement('button');
    stepTimeBtn.onclick = e => {
        callFunction("engine", false, ["stepGameLoop"]);
    }
    stepTimeBtn.innerText = "Step Game Time";
    div.appendChild(stepTimeBtn);

    let startTimeBtn = document.createElement('button');
    startTimeBtn.onclick = e => {
        callFunction("engine", false, ["restartGameLoop"]);
    }
    startTimeBtn.innerText = "Restart Game Time";
    div.appendChild(startTimeBtn);

    return div;
}

function refreshTable() {
    getData("engine", false, ["gameObjects"]).then((data) => {
        let tbl = genTable(data, handleClick, cols);
        table.appendChild(tbl);
    });
}

function refreshView(item) {
    while (view.firstChild) {
        view.removeChild(view.firstChild);
    }
    view.appendChild(genScreen(item));
}

main();