/**
 * This contains the Editor Configuration
 */

import {genDisabledInput, genNumberInput, genTextInput, genCheckboxInput} from './inputs.js';

const config = [
    {
        // Selects the type of Input Element by type
        selector: {
            parentInstance: "GameObject", // Parent Object Instance. Optional.
            type: "string", // Property Type. Also checks for array
            instance: null, // Property Instance (Optional)
            name: "id", // Property Name (Optional)
        },
        // Generates the Input Element
        inputElement: {
            label: "ID", // Input Label
            description: "Test Description",
            element: genDisabledInput // Function that will generate the element
        },
        // Additional Data to be fed into the Input Element
        data: {
            // Custom data/constraints for Input Element go here. 
        }
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