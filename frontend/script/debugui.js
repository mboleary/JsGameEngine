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
    
    refreshTable();
    
    if (window.location.hash) {
        console.log(window.location.hash);
        const selected = document.getElementById(window.location.hash.substring(1)); // Removes leading #
        if (selected) {
            selected.classList.add("selected");
        }
    }
}

function refreshTable() {
    let tbl = genTable(window.opener.debug.engine.gameObjects, handleClick, cols);
    table.appendChild(tbl);
}

main();