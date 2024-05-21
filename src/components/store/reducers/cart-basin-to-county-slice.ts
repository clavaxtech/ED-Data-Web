import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { cartBasinState } from "../../models/redux-models";

const initialState: cartBasinState = {
    // well_status_list: [],
    // operator_list: [],
    state_list: [],
    // county_list: [],
    // basin_list: [],
    basinSearchList: [],
    countySearchList: [],
    wellApiListAfterCsvUpload: [],
    sliderMinMaxValue: {
        measured_depth: 40000,
        true_vertical_depth: 30000,
        lateral_length: 30000,
        minMeasuredDepth: 0,
        minTrueVerticalDepth: 0,
        minLateralLength: 0,
        maxMeasuredDepth: 40000,
        maxTrueVerticalDepth: 30000,
        maxLateralLength: 30000,
        dataLoading: true,
    },
    hideSearchFilter: true,
    clearAllFilter: false,
};

export const cartBasinToCountySlice = createSlice({
    name: "cartbasin",
    initialState,
    reducers: {
        clearSearchList(state, action: PayloadAction) {
            return {
                ...state,
                basinSearchList: [],
                countySearchList: [],
            };
        },
        fetchBasinSearchList(
            state,
            action: PayloadAction<cartBasinState["basinSearchList"]>
        ) {
            return {
                ...state,
                countySearchList: [],
                basinSearchList: action.payload,
            };
        },
        handleWellApiListAfterCsvUpload(
            state,
            action: PayloadAction<cartBasinState["wellApiListAfterCsvUpload"]>
        ) {
            return {
                ...state,
                wellApiListAfterCsvUpload: action.payload,
            };
        },
        handleSliderValue(
            state,
            action: PayloadAction<cartBasinState["sliderMinMaxValue"]>
        ) {
            return {
                ...state,
                sliderMinMaxValue: {
                    ...state.sliderMinMaxValue,
                    ...action.payload,
                },
            };
        },
        handleHideSearchFilter(
            state,
            action: PayloadAction<cartBasinState["hideSearchFilter"]>
        ) {
            return {
                ...state,
                hideSearchFilter: action.payload,
            };
        },
        handleStateList(
            state,
            action: PayloadAction<cartBasinState["state_list"]>
        ) {
            return {
                ...state,
                state_list: action.payload,
            };
        },
        handleClearAllFilter(
            state,
            action: PayloadAction<cartBasinState["clearAllFilter"]>
        ) {
            return {
                ...state,
                clearAllFilter: action.payload,
            };
        },
    },
});

export default cartBasinToCountySlice;
