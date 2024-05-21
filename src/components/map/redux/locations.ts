import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { esriReducerBackup } from "./esri";
import { BASINS, COUNTIES } from "./types";
import { HighlightSelectedWellAction } from "../../models/redux-models";

//{title:"Western Gulf Basin", image:'./images/basin.svg', counties:32, wells:11980, operators:586, completions:2500, cost:150}
const initialState = { selectedType: BASINS, basins: [], counties: [], selectedFeature: '' };

const locationsReducer = createSlice({
    name:"locations",
    initialState,
    reducers: {
        CLEAR: (state, action) => {
            if (action.payload) {
                const newBasins = [...state.basins];
                const removeBasin:[] = action.payload.filter((p:any) => {if (state.basins.find((b:any) => b.OBJECTID === p.OBJECTID)) return p;});
                if (removeBasin.length > 0) {
                    state.basins = newBasins.filter((nb:any) => {if(removeBasin.find((b:any) => b.OBJECTID === nb.OBJECTID)) return nb;})
                }
                const newCounties = [...state.counties];
                const removeCounty:[] = action.payload.filter((p:any) => {if (state.counties.find((b:any) => b.OBJECTID === p.OBJECTID)) return p;});
                if (removeCounty.length > 0) {
                    state.counties = newCounties.filter((nb:any) => {if(removeCounty.find((b:any) => b.OBJECTID === nb.OBJECTID)) return nb;})
                }
            } else {
                state.basins = [];
                state.counties = [];
            }
        },
        SET_BASINS: (state, action) => {
            state.selectedType = BASINS;
            const updates:[] = action.payload.filter((p:any) => {if (!state.basins.find((b:any) => b.OBJECTID === p.OBJECTID)) return p;});
            state.basins = [...state.basins, ...updates];
        },
        SET_COUNTIES: (state, action) => {
            state.selectedType = COUNTIES;
            const updates:[] = action.payload.filter((p:any) => {if (!state.counties.find((b:any) => b.OBJECTID === p.OBJECTID)) return p;});
            state.counties = [...state.counties, ...updates];
        },
        UPDATE_SELECTED: (state, action) => {
            state.selectedType = action.payload;
        },
        highlightSelectedWell: (state, action:PayloadAction<HighlightSelectedWellAction>) => {
            const { well_id } = action.payload;
            state.selectedFeature = well_id;
        }
    }
});

export const { CLEAR, SET_BASINS, SET_COUNTIES, UPDATE_SELECTED, highlightSelectedWell } = locationsReducer.actions;

export function basinsUpdated(feature: any) {
    return { type: SET_BASINS, payload: feature };
}

export function countiesUpdated(feature: any) {
    return { type: SET_COUNTIES, payload: feature };
}

export function setSelectedType(selType: string) {
    if (selType === COUNTIES) {
        return { type: UPDATE_SELECTED, payload: COUNTIES }
    }
    return {type: UPDATE_SELECTED, payload: BASINS }
}


export default locationsReducer.reducer;
