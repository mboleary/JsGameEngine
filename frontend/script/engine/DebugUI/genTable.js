// Generates a table from an array

// Generates an arbitrary Table
export default function genTable(arr, handleClick, columns) {
    let table = document.createElement("table");
    let cols = {};

    if (columns) {
        cols = columns;
    } else {
        cols = getColumns(arr);
    }

    table.appendChild(getHeader(cols));

    arr.forEach((item) => {
        let tr = getRow(item, cols);
        if (handleClick) {
            tr.onclick = handleClick(item);
        }
        table.appendChild(tr);
    });

    return table;
}

// gets the columns from an array of Objects
function getColumns(arr) {
    let columns = {};
    let toRet = [];
    arr.forEach((item) => {
        // Get all the columns
        Object.keys(item).forEach((key) => {
            if (!columns[key]) {
                columns[key] = true;
            }
        });
    });

    Object.keys(columns).sort().forEach((col) => {
        toRet.push({
            path: col, // Object Key
            title: col, // Title of Column
            transform: null, // Will transform the data content
            style: "" // Style to be applied to the cell
        });
    });
    return toRet;
}

function getHeader(cols) {
    let row = document.createElement('tr');
    cols.forEach((col) => {
        let th = document.createElement('th');
        th.innerText = col.title;
        row.appendChild(th);
    });
    return row;
}

function getRow(item, cols) {
    let tr = document.createElement('tr');

    cols.forEach((col) => {
        let td = document.createElement('td');
        let content = td.innerText = item[col.path] || "";
        if (col.transform) {
            content = col.transform(content);
        }
        if (col.style) {
            td.style = col.style(content);
        }
        tr.appendChild(td);
    });
    return tr;
}