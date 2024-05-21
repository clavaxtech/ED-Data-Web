import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AoiModel } from "../../models/redux-models";

const initialState: AoiModel = {
    savedAoiData: [],
    toggleSettingDrawer: false,
    aoiDataLoading: true,
    showAoiSideCon: true,
    aoiNameSelForEdit: {
        aoi_name: "",
        aoi_id: 0,
    },
    max_allowed_aoi: 0,
    aoi_tab_index: 0,
    aoiGenTabNotiData: [],
    aoiGenTabNotiDataLoading: true,
    aoiNotiData: [],
    aoiNotiDataLoading: true,
    usingMapCreateAoi: false,
    previousSearchFilter: "",
};

const aoiSlice = createSlice({
    name: "aoi",
    initialState: initialState,
    reducers: {
        fetchAoiList(
            state,
            action: PayloadAction<{
                data: AoiModel["savedAoiData"];
                max_allowed_aoi: number;
            }>
        ) {
            return {
                ...state,
                savedAoiData: action.payload.data,
                max_allowed_aoi: action.payload.max_allowed_aoi,
                aoiDataLoading: false,
            };
        },
        toggleSettDrawer(state, action: PayloadAction) {
            return {
                ...state,
                toggleSettingDrawer: !state.toggleSettingDrawer,
            };
        },

        clearAoiList(state, action: PayloadAction) {
            return {
                ...state,
                aoiDataLoading: true,
            };
        },
        toggleAoiSideCon(state, action: PayloadAction) {
            return {
                ...state,
                showAoiSideCon: !state.showAoiSideCon,
            };
        },
        setAoiNameSelForEdit(
            state,
            action: PayloadAction<AoiModel["aoiNameSelForEdit"]>
        ) {
            return {
                ...state,
                aoiNameSelForEdit: action.payload,
            };
        },
        clearAoiNameSelForEdit(state, action: PayloadAction) {
            return {
                ...state,
                aoiNameSelForEdit: {
                    aoi_name: "",
                    aoi_id: 0,
                },
            };
        },
        handleAoiTabIndex(
            state,
            action: PayloadAction<AoiModel["aoi_tab_index"]>
        ) {
            return {
                ...state,
                aoi_tab_index: action.payload,
            };
        },
        setAoiGenTabNotiData(
            state,
            action: PayloadAction<AoiModel["aoiGenTabNotiData"]>
        ) {
            return {
                ...state,
                aoiGenTabNotiData: action.payload,
                aoiGenTabNotiDataLoading: false,
            };
        },
        clearAoiGenTabNotiData(state, action: PayloadAction) {
            return {
                ...state,
                aoiGenTabNotiDataLoading: true,
            };
        },
        setAoiNotiData(state, action: PayloadAction<AoiModel["aoiNotiData"]>) {
            return {
                ...state,
                aoiNotiData: action.payload,
                aoiNotiDataLoading: false,
            };
        },
        clearAoiNotiData(state, action: PayloadAction) {
            return {
                ...state,
                aoiNotiDataLoading: true,
            };
        },
        handleUsingMapCreateAoi(
            state,
            action: PayloadAction<AoiModel["usingMapCreateAoi"]>
        ) {
            return {
                ...state,
                usingMapCreateAoi: action.payload,
            };
        },
        handlePreviousSearchFilter(
            state,
            action: PayloadAction<AoiModel["previousSearchFilter"]>
        ) {
            return {
                ...state,
                previousSearchFilter: action.payload,
            };
        },
    },
});

export default aoiSlice;
