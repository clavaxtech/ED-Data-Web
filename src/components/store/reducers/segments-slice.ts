import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
    SegmentListPayloadAction,
    SegmentsModel,
} from "../../models/redux-models";

const initialState: SegmentsModel = {
    activeSegmentList: {
        total_record: 0,
        page_size: 10,
        data: [],
        dataLoading: true,
    },
    archivedSegmentList: {
        total_record: 0,
        page_size: 10,
        data: [],
        dataLoading: true,
    },
    activeTabIndex: 1,
    selectedRowId: 0,
    checkBoxSelectedId: [],
    active_total: 0,
    archive_total: 0,
    page: 1,
    selectedSegmentData: [],
};

const segmentsSlice = createSlice({
    name: "segments",
    initialState: initialState,
    reducers: {
        loadActiveSegmentList(
            state,
            action: PayloadAction<{
                data: SegmentListPayloadAction;
                active_total: SegmentsModel["active_total"];
                archive_total: SegmentsModel["archive_total"];
                page: SegmentsModel["page"];
            }>
        ) {
            return {
                ...state,
                activeSegmentList: {
                    total_record: action.payload.data.total_record,
                    page_size: action.payload.data.page_size,
                    data: [
                        ...state.activeSegmentList.data,
                        ...action.payload.data.data,
                    ],
                    dataLoading: false,
                },
                active_total: action.payload.active_total,
                archive_total: action.payload.archive_total,
                page: action.payload.page,
            };
        },
        loadArchivedSegmentList(
            state,
            action: PayloadAction<{
                data: SegmentListPayloadAction;
                active_total: SegmentsModel["active_total"];
                archive_total: SegmentsModel["archive_total"];
                page: SegmentsModel["page"];
            }>
        ) {
            return {
                ...state,
                archivedSegmentList: {
                    total_record: action.payload.data.total_record,
                    page_size: action.payload.data.page_size,
                    data: [
                        ...state.archivedSegmentList.data,
                        ...action.payload.data.data,
                    ],
                    dataLoading: false,
                },
                active_total: action.payload.active_total,
                archive_total: action.payload.archive_total,
                page: action.payload.page,
            };
        },
        handleSegmentTabIndx(
            state,
            action: PayloadAction<SegmentsModel["activeTabIndex"]>
        ) {
            return {
                ...state,
                activeTabIndex: action.payload,
            };
        },
        handleSelectedRowId(
            state,
            action: PayloadAction<SegmentsModel["selectedRowId"]>
        ) {
            return {
                ...state,
                selectedRowId: action.payload,
            };
        },
        handleCheckbox(
            state,
            action: PayloadAction<SegmentsModel["selectedRowId"]>
        ) {
            return {
                ...state,
                ...(state.activeTabIndex === 1 && {
                    activeSegmentList: {
                        ...state.activeSegmentList,
                        data: state.activeSegmentList.data.map((item) =>
                            item.id === action.payload
                                ? { ...item, checked: !item.checked }
                                : item
                        ),
                    },
                }),
                ...(state.activeTabIndex === 2 && {
                    archivedSegmentList: {
                        ...state.archivedSegmentList,
                        data: state.archivedSegmentList.data.map((item) =>
                            item.id === action.payload
                                ? { ...item, checked: !item.checked }
                                : item
                        ),
                    },
                }),
            };
        },
        selectOrDeselectAllCheckbox(state, action: PayloadAction<boolean>) {
            return {
                ...state,
                ...(state.activeTabIndex === 1 && {
                    activeSegmentList: {
                        ...state.activeSegmentList,
                        data: state.activeSegmentList.data.map((item) => ({
                            ...item,
                            checked: action.payload,
                        })),
                    },
                }),
                ...(state.activeTabIndex === 2 && {
                    archivedSegmentList: {
                        ...state.archivedSegmentList,
                        data: state.archivedSegmentList.data.map((item) => ({
                            ...item,
                            checked: action.payload,
                        })),
                    },
                }),
            };
        },
        clearActiveOrArchiveSegmentList(state, action: PayloadAction) {
            return {
                ...state,
                ...(state.activeTabIndex === 1 && {
                    activeSegmentList: {
                        ...initialState.activeSegmentList,
                        dataLoading: true,
                    },
                }),
                ...(state.activeTabIndex === 2 && {
                    archivedSegmentList: {
                        ...initialState.archivedSegmentList,
                        dataLoading: true,
                    },
                }),
                selectedRowId: 0,
                checkBoxSelectedId: [],
                active_total: 0,
                archive_total: 0,
                page: 1,
            };
        },
        handleSegmentPageChange(
            state,
            action: PayloadAction<SegmentsModel["page"]>
        ) {
            return {
                ...state,
                page: action.payload,
            };
        },
        handleSelectedSegmentData(
            state,
            action: PayloadAction<SegmentsModel["selectedSegmentData"]>
        ) {
            return {
                ...state,
                selectedSegmentData: action.payload,
            };
        },
    },
});

export default segmentsSlice;
