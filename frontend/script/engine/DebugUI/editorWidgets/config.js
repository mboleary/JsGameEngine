/**
 * This contains the Editor Configuration
 */

import {genDisabledInput, genNumberInput, genTextInput, genCheckboxInput} from './inputs.js';

const config = [
    // {
    //     parentInstance: "GameObject", // Parent Object Instance. Optional.
    //     type: "string", // Property Type
    //     array: true, // Check if this is an array
    //     instance: null, // Property Instance (Optional)
    //     name: "id", // Property Name (Optional)
    //     label: "ID", // Input Label
    //     element: genDisabledInput // Function that will generate the element
    // },
    {
        parentInstance: "GameObject",
        type: "string",
        instance: null,
        name: "id",
        label: "ID",
        element: genDisabledInput
    },
    {
        type: "number",
        element: genNumberInput
    },
    {
        type: "string",
        element: genTextInput
    },
    {
        type: "boolean",
        element: genCheckboxInput
    },
];

export default config;