import { SET_ATTRIBUTE_FILTER_VALUES } from "./types";
import { createSlice } from "@reduxjs/toolkit";


// reducer
const initialState = { optionValues: [] };

const checkActionAndState = (newState: any, action: { payload: any; type?: string; }) => {
    const { layerId, field, options } = action.payload;
    // Check that everything is at least plausibly valid
    if (!layerId || !field || options === undefined) {
        console.log(
            `There was a problem with the submitted layerId: ${layerId}, field: ${field}, or options: ${options}`
        );
        return false;
    }

    // If all current cases, we'll have a structure like the one below. Here the parameters are:
    // layerID: "Offset Wells"
    // field: "Operator_Name"
    // visible/selected ids: ["NEWFIELD", "ABC", "SMITH MINING"]
    // state = {
    //     "Offset Wells": {
    //         Operator_Name: ["NEWFIELD", "ABC", "SMITH MINING"]
    //     }
    // }
    // So first, we'll do a quick check for that and create this structure if needed.
    if (!newState.optionValues[layerId]) {
        newState.optionValues[layerId] = {};
    }
    if (!newState.optionValues[layerId][field]) {
        newState.optionValues[layerId][field] = [];
    }
    return true;
};

export function attributeFilterReducerBackup(state = initialState, action: { type: any; payload: { layerId: any; field: any; options: any; }; }) {
    const newState = { ...state };
    switch (action.type) {
        case SET_ATTRIBUTE_FILTER_VALUES: {
            if (!checkActionAndState(newState, action)) {
                return state;
            }
            const { layerId, field, options } = action.payload;
            // @ts-ignore
            newState.optionValues[layerId][field] = options;
            return newState;
        }

        default:
            return state;
    }
};

const attributeFilterReducer = createSlice({
    name:"attributeFilter",
    initialState,
    reducers: {
        SET_ATTRIBUTE_FILTER_VALUES: (state, action) => {
            if (!checkActionAndState(state, action)) {
                return state;
            }
            const { layerId, field, options } = action.payload;
            // @ts-ignore
            state.optionValues[layerId][field] = options;
        }
    }
});

export default attributeFilterReducer.reducer;

// Action Creators
export function setAttributeFilterValues(
    layerId: any,
    field: any,
    options: any
) {
    return { type: SET_ATTRIBUTE_FILTER_VALUES, payload: { layerId, field, options } };
}

// Selectors
export function getAttributeFilterValues(state: { optionValues: { [x: string]: { [x: string]: any; }; }; }, layerId: string | number, field: string | number) {
    if (state.optionValues[layerId] && state.optionValues[layerId][field]) {
        return state.optionValues[layerId][field];
    }
    return [];
}
