import { SET_DEFAULT_FILTER } from "./types";
import { createSlice } from "@reduxjs/toolkit";

// reducer
const initialState = { filterDefs: {} };

const checkActionAndState = (newState: any, action: { payload: any; type?: string; }) => {
    const { layerId, filterDef } = action.payload;
    // Check that everything is at least plausibly valid
    if (!layerId || !filterDef) {
        console.log(`There was a problem with the submitted layerId: ${layerId} or its Filter definition.`);
        return false;
    }

    // Create empty structure if not already.
    if (!newState.filterDefs[layerId]) {
        newState.filterDefs[layerId] = {};
    }
    return true;
};

export function defaultFilterbackup(state = initialState, action: { type: any; payload: { layerId: any; filterDef: any; }; }) {
    const newState = { ...state };
    switch (action.type) {
        case SET_DEFAULT_FILTER: {
            if (!checkActionAndState(newState, action)) {
                return state;
            }
            const { layerId, filterDef } = action.payload;
            // @ts-ignore
            newState.filterDefs[layerId] = filterDef;
            return newState;
        }

        default:
            return state;
    }
};

const defaultReducer = createSlice({
    name:"default",
    initialState,
    reducers: {
        SET_DEFAULT_FILTER: (state, action) => {
            if (!checkActionAndState(state, action)) {
                return state;
            }
            const { layerId, filterDef } = action.payload;
            // @ts-ignore
            state.filterDefs[layerId] = filterDef;
        }
    }
});

export default defaultReducer.reducer;

// Action Creators
export function setDefaultFilter(layerId: any, filterDef: any) {
    return { type: SET_DEFAULT_FILTER, payload: { layerId, filterDef } };
}

// Selectors
export function getDefaultFilter(state: { defaultFilters: { filterDefs: { [x: string]: any; }; }; }, layerId: string | number) {
    return state.defaultFilters.filterDefs[layerId];
}
