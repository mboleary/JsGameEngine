// Contains scripting for the Debug UI

import genTable from './engine/DebugUI/genTable.js';

function main() {
    let arr = [
        {
            a: "a",
            b: "b",
            c: "c"
        },
        {
            a: "1",
            b: "1",
            c: "1"
        },
        {
            a: "2",
            b: "2",
            c: "2"
        },
        {
            a: "3",
            b: "3",
            c: "3"
        }
    ];
    let cols = [
        {
            path: "a",
            title: "Column A",
            transform: (data) => {
                return "Transformed: " + data
            },
            style: (data) => {
                return "color: blue";
            }
        },
        {
            path: "b",
            title: "Column B",
            transform: (data) => {
                return "Transformed: " + data
            },
            style: (data) => {
                return "color: red";
            }
        },
        {
            path: "c",
            title: "Column C",
            transform: (data) => {
                return "Transformed: " + data
            },
            style: (data) => {
                return "color: green";
            }
        }
    ];
    const handleClick = (item) => e => {
        console.log(item);
    };
    let tbl = genTable(arr, handleClick, cols);
    document.getElementById('table').appendChild(tbl);
}

main();