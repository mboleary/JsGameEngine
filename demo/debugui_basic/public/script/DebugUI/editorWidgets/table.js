// Allows the table to be used as an input widget

import genTable from '../genTable.js';

// import { registerUpdater } from '../updater.js';

export default function table(obj, path, debugObj) {
    function update() {
        if (debugObj.data.columns) {
            return genTable(obj[path], null, debugObj.data.columns);
        }
        return genTable(obj[path], null, debugObj.data.columns);
    }
    // registerUpdater()
    return update();
}