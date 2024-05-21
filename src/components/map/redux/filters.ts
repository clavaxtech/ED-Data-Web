import UnfilterableWellTypes from "../config/layers/UnfilterableWellTypes";
import { createSlice } from "@reduxjs/toolkit";
import FieldNames from "../config/layers/FieldNames";
import { CountyStatObject } from "../../models/redux-models";

export interface IFilterValues {
    ids: [Number],
    filter: string
}

export interface IFilter { 
    [field: string]: [any]
}

export interface IFilters {
    [layerId: string]: IFilter
}

export interface IPanelFilters {

}

// Reducer
const initialState = { layers: {} as IFilters, panelFilters: {} as IFilter, countyTotals: [] as CountyStatObject[] }

// Helper for reducer
// Returns true if everything looks good, false if there's an issue with something.
// Sets up field filter for the layer if it doesn't already exist.
const checkFilterActionAndState = (newState: any, action: { payload: any; type?: string; }) => {
    const filters:[] = action.payload;
    filters.forEach((filter) => {
        const { layerId, field, value } = filter;
        // Check that everything is at least plausibly valid
        if (!layerId || !field || value === undefined) {
            console.log(`There was a problem with the submitted layerId: ${layerId}, field: ${field}, or value: ${value}`);
            return false;
        }
        let fieldNum = parseInt(field);
        //don't filter on unfilterable well types
        if (UnfilterableWellTypes && UnfilterableWellTypes.Parsed_Status_Id[fieldNum] && UnfilterableWellTypes.Parsed_Status_Id[fieldNum] === value) {
            return false;
        }
        // If all current cases, we'll have a structure like the one below. Here the parameters are:
        // layerID: "All Wells"
        // field: "status_type_id"
        // visible/selected ids: [1, 2, 3, 4]
        // state = {
        //     "All Wells": {
        //         status_type_id: [1,2,3,4]
        //     }
        // }
        // So first, we'll do a quick check for that and create this structure if needed.
        if (!newState.layers[layerId]) {
            newState.layers[layerId] = {};
        }
        if (!newState.layers[layerId][field]) {
            newState.layers[layerId][field] = {ids: [], filter: ''};
        }
    });
    return true;
};

const NULL_FLAG = -1;

const filtersReducer = createSlice({
    name:"filters",
    initialState,
    reducers: {
        SET_FILTER: (state, action) => {
            if (!checkFilterActionAndState(state, action)) {
                return state;
            }
            const allFilters:[] = action.payload;
            allFilters.forEach((filter) => {
                const { layerId, field, value, filterAllIfEmpty } = filter;
                let fieldArray;
                if (Array.isArray(value)) {
                    fieldArray = value;
                } else {
                    fieldArray = [value];
                }
                if (filterAllIfEmpty && fieldArray.length == 0) {
                    fieldArray = NULL_FLAG;
                }
                // if (Array.isArray(value.ids)) {
                //     fieldArray = { ids: value.ids, filter: value.filter };
                // } else {
                //     fieldArray = { ids: [value], filter: value.filter };
                // }
                // if (filterAllIfEmpty && fieldArray.ids.length == 0) {
                //     fieldArray = NULL_FLAG;
                // }
                // @ts-ignore
                state.layers[layerId][field] = fieldArray;
            });
        },
        SetPanelFilter: (state: any, action) => {
            const tmpFilters:any = {};
            let update = false;
            FieldNames.queryPanelKeys.forEach((key) => {
                if (action.payload.hasOwnProperty(key))
                {
                    tmpFilters[key] = action.payload[key];
                    if (!state.panelFilters.hasOwnProperty(key)) {
                        update = true;
                    }
                    if (update || tmpFilters[key].length !== state.panelFilters[key].length) {
                        update = true;
                    }
                    if (update || !tmpFilters[key].every((f:string) => {
                        return state.panelFilters[key].includes(f);
                    })) {
                        update = true;
                    }
                } else {
                    update = state.panelFilters.hasOwnProperty(key) ? true : update;
                }
            });
            if (update) {
                state.panelFilters = {...tmpFilters}
            }
        },
        UpdateCountyTotals: (state: any, action) => {
            state.countyTotals = action.payload;
        },
        TOGGLE_FILTER_VALUE: (state, action) => {
            if (!checkFilterActionAndState(state, action)) {
                return state;
            }
            const { layerId, field, value, filterAllIfEmpty } = action.payload;
            // @ts-ignore
            const fieldArray = [...state.layers[layerId][field]];

            // always clear the NULL flag if filterAllIfEmpty and it is present
            if (filterAllIfEmpty && fieldArray.length == 1 && fieldArray[0] == NULL_FLAG) {
                fieldArray.pop();
            }
            const index = fieldArray.indexOf(value);
            if (index === -1) {
                fieldArray.push(value);
            } else {
                fieldArray.splice(index, 1);
            }
            if (filterAllIfEmpty && fieldArray.length == 0) {
                fieldArray.push(NULL_FLAG);
            }
            // @ts-ignore
            state.layers[layerId][field] = fieldArray;
        }
    }
});

export default filtersReducer.reducer;

export const { SET_FILTER, SetPanelFilter, TOGGLE_FILTER_VALUE, UpdateCountyTotals } = filtersReducer.actions;


