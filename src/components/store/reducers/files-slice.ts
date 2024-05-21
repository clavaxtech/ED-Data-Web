import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
    ApiFilesListObj,
    FilesInitialValue,
    ShapeFilesListObj,
} from "../../models/redux-models";

const initialState: FilesInitialValue = {
    filesTabIndex: 0,
    apiList: null,
    apiPage: 1,
    apiTotalRecord: 0,
    apiPageSize: 0,
    shapeFileList: null,
    shapeFilePage: 1,
    shapeFileTotalRecord: 0,
    shapeFilePageSize: 0,
    // selectedId: 0,
    apiListLoading: true,
    shapeFileListLoading: true,
};

const files = createSlice({
    name: "files",
    initialState: initialState,
    reducers: {
        handleFilesTabIndex: (
            state,
            action: PayloadAction<FilesInitialValue["filesTabIndex"]>
        ) => {
            return {
                ...state,
                filesTabIndex: action.payload,
            };
        },
        handleApiList: (
            state,
            action: PayloadAction<{
                data: FilesInitialValue["apiList"];
                apiTotalRecord?: FilesInitialValue["apiTotalRecord"];
                apiPageSize?: FilesInitialValue["apiPageSize"];
                apiPage?: FilesInitialValue["apiPage"];
                notConcat?: boolean;
            }>
        ) => {
            return {
                ...state,
                apiList: action.payload.notConcat
                    ? action.payload.data
                    : [
                          ...(state.apiList || []),
                          ...(action.payload.data as ApiFilesListObj[]),
                      ],
                ...(action.payload.apiTotalRecord && {
                    apiTotalRecord: action.payload.apiTotalRecord,
                }),
                ...(action.payload.apiPageSize && {
                    apiPageSize: action.payload.apiPageSize,
                }),
                ...(action.payload.apiPage && {
                    apiPage: action.payload.apiPage,
                }),
                apiListLoading: false,
            };
        },
        handleApiPage: (
            state,
            action: PayloadAction<FilesInitialValue["apiPage"]>
        ) => {
            return {
                ...state,
                apiPage: action.payload,
            };
        },
        handleShapeFileList: (
            state,
            action: PayloadAction<{
                data: FilesInitialValue["shapeFileList"];
                shapeFileTotalRecord?: FilesInitialValue["shapeFileTotalRecord"];
                shapeFilePageSize?: FilesInitialValue["shapeFilePageSize"];
                shapeFilePage?: FilesInitialValue["shapeFilePage"];
                apiTotalRecord?: FilesInitialValue["apiTotalRecord"];
                notConcat?: boolean;
            }>
        ) => {
            return {
                ...state,
                shapeFileList: action.payload.notConcat
                    ? action.payload.data
                    : [
                          ...(state.shapeFileList || []),
                          ...(action.payload.data as ShapeFilesListObj[]),
                      ],
                ...(action.payload.shapeFileTotalRecord && {
                    shapeFileTotalRecord: action.payload.shapeFileTotalRecord,
                }),
                ...(action.payload.shapeFilePageSize && {
                    shapeFilePageSize: action.payload.shapeFilePageSize,
                }),
                ...(action.payload.shapeFilePage && {
                    shapeFilePage: action.payload.shapeFilePage,
                }),
                ...(action.payload.apiTotalRecord && {
                    apiTotalRecord: action.payload.apiTotalRecord,
                }),
                shapeFileListLoading: false,
            };
        },
        handleShapeFilePage: (
            state,
            action: PayloadAction<FilesInitialValue["shapeFilePage"]>
        ) => {
            return {
                ...state,
                shapeFilePage: action.payload,
            };
        },
        resetApiList: (state, action: PayloadAction) => {
            return {
                ...state,
                apiListLoading: true,
                apiList: null,
                apiPage: 1,
                apiTotalRecord: 0,
                apiPageSize: 0,
            };
        },
        resetShapeFileList: (state, action: PayloadAction) => {
            return {
                ...state,
                shapeFileListLoading: true,
                shapeFileList: null,
                shapeFilePage: 1,
                shapeFileTotalRecord: 0,
                shapeFilePageSize: 0,
            };
        },
    },
});

export default files;
