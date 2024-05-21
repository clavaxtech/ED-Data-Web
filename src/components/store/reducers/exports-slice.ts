import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExportModel } from "../../models/redux-models";

const initialState: ExportModel = {
    exportData: null,
    exportPageSize: 10,
    exportTotalRecord: 0,
    exportDataLoading: true,
};

const exportsSettings = createSlice({
    name: "exportsSettings",
    initialState: initialState,
    reducers: {
        handleExportsData(
            state,
            action: PayloadAction<{
                exportData: ExportModel["exportData"];
                exportPageSize?: ExportModel["exportPageSize"];
                exportTotalRecord?: ExportModel["exportTotalRecord"];
            }>
        ) {
            return {
                ...state,
                exportData: action.payload.exportData,
                ...(action.payload.exportPageSize && {
                    exportPageSize: action.payload.exportPageSize,
                }),
                ...(action.payload.exportTotalRecord && {
                    exportTotalRecord: action.payload.exportTotalRecord,
                }),
                exportDataLoading: false,
            };
        },
        resetExportsData(state, action: PayloadAction) {
            return {
                ...state,
                exportData: null,
                exportDataLoading: true,
            };
        },
    },
});

export default exportsSettings;
