import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AlertModel } from "../../models/redux-models";

const initialState: AlertModel = {
    alertSetTabNotiData: [],
    alertSetTabNotiDataLoading: true,
    alertTabIndex: 0,
    alertMsg: {
        data: [],
        page: 1,
        readPage: 1,
        favouritePage: 1,
        totalPage: 1,
        readTotalPage: 1,
        favouriteTotalPage: 1,
        alertMsgLoading: true,
        alertReadMsgLoading: true,
        alertFavouriteMsgLoading: true,
        unread_count: 0,
        pageSize: 10,
        read_count: 0,
        favourite_count: 0,
        readData: [],
        favouriteData: [],
    },
    countyList: [],
    selectedCountyList: [],
    is_aoi_alert_enabled: true,
    is_county_alert_enabled: true,
};

const aoiSlice = createSlice({
    name: "alerts",
    initialState: initialState,
    reducers: {
        setAlertSetTabNotiData(
            state,
            action: PayloadAction<AlertModel["alertSetTabNotiData"]>
        ) {
            return {
                ...state,
                alertSetTabNotiData: action.payload,
                alertSetTabNotiDataLoading: false,
            };
        },
        clearAlertTabNotiData(state, action: PayloadAction) {
            return {
                ...state,
                alertSetTabNotiData: [],
                aoiGenTabNotiDataLoading: true,
            };
        },
        handleAlertTabIndex(
            state,
            action: PayloadAction<AlertModel["alertTabIndex"]>
        ) {
            return {
                ...state,
                alertTabIndex: action.payload,
            };
        },
        handleAlertMsgData(
            state,
            action: PayloadAction<{
                data: AlertModel["alertMsg"]["data"];
                totalPage?: AlertModel["alertMsg"]["totalPage"];
                unread_count?: AlertModel["alertMsg"]["unread_count"];
                favourite_count?: AlertModel["alertMsg"]["favourite_count"];
                read_count?: AlertModel["alertMsg"]["read_count"];
                conCat?: boolean;
            }>
        ) {
            return {
                ...state,
                alertMsg: {
                    ...state.alertMsg,
                    ...(state.alertTabIndex === 0 && {
                        data: !action.payload.conCat
                            ? [...action.payload.data]
                            : [...state.alertMsg.data, ...action.payload.data],
                    }),
                    ...(state.alertTabIndex === 1 && {
                        readData: !action.payload.conCat
                            ? [...action.payload.data]
                            : [
                                  ...state.alertMsg.readData,
                                  ...action.payload.data,
                              ],
                    }),
                    ...(state.alertTabIndex === 2 && {
                        favouriteData: !action.payload.conCat
                            ? [...action.payload.data]
                            : [...state.alertMsg.favouriteData, ...action.payload.data],
                    }),
                    ...(action.payload.totalPage &&
                        state.alertTabIndex === 0 && {
                            totalPage: action.payload.totalPage,
                        }),
                    ...(action.payload.totalPage &&
                        state.alertTabIndex === 1 && {
                            readTotalPage: action.payload.totalPage,
                        }),
                    ...(action.payload.totalPage &&
                        state.alertTabIndex === 2 && {
                            favouriteTotalPage: action.payload.totalPage,
                        }),
                    ...((action.payload.unread_count as number) >= 0 && {
                        unread_count: action.payload.unread_count,
                    }),
                    ...((action.payload.read_count as number) >= 0 && {
                        read_count: action.payload.read_count,
                    }),
                    ...((action.payload.favourite_count as number) >= 0 && {
                        favourite_count: action.payload.favourite_count,
                    }),
                    ...(state.alertTabIndex === 0 && {
                        alertMsgLoading: false,
                    }),
                    ...(state.alertTabIndex === 1 && {
                        alertReadMsgLoading: false,
                    }),
                    ...(state.alertTabIndex === 2 && {
                        alertFavouriteMsgLoading: false,
                    }),
                },
            };
        },
        clearAlertMsgData(
            state,
            action: PayloadAction<AlertModel["alertMsg"]["data"]>
        ) {
            return {
                ...state,
                alertMsg: {
                    ...initialState.alertMsg,
                },
            };
        },
        handleAlertMsgPageChange(
            state,
            action: PayloadAction<AlertModel["alertMsg"]["page"]>
        ) {
            return {
                ...state,
                alertMsg: {
                    ...state.alertMsg,
                    ...(state.alertTabIndex === 0 && { page: action.payload }),
                    ...(state.alertTabIndex === 1 && {
                        readPage: action.payload,
                    }),
                    ...(state.alertTabIndex === 2 && {
                        favouritePage: action.payload,
                    }),
                },
            };
        },
        fetchAlertCountyList(
            state,
            action: PayloadAction<AlertModel["countyList"]>
        ) {
            return {
                ...state,
                countyList: action.payload,
                alertSetTabNotiDataLoading: false,
            };
        },
        handleAoiALertEnabled(
            state,
            action: PayloadAction<AlertModel["is_aoi_alert_enabled"]>
        ) {
            return {
                ...state,
                is_aoi_alert_enabled: action.payload,
            };
        },
        handleSelectedCountyList(
            state,
            action: PayloadAction<AlertModel["selectedCountyList"]>
        ) {
            return {
                ...state,
                selectedCountyList: action.payload,
            };
        },
        handleCountyAlertsSettings(
            state,
            action: PayloadAction<AlertModel["is_county_alert_enabled"]>
        ) {
            return {
                ...state,
                is_county_alert_enabled: action.payload,
            };
        },
        handleResetData(
            state,
            action: PayloadAction<AlertModel["alertTabIndex"]>
        ) {
            return {
                ...state,
                alertMsg: {
                    ...state.alertMsg,
                    ...(action.payload === 0 && {
                        alertMsgLoading: true,
                        page: 1,
                    }),
                    ...(action.payload === 1 && {
                        alertReadMsgLoading: true,
                        readPage: 1,
                    }),
                    ...(action.payload === 2 && {
                        alertFavouriteMsgLoading: true,
                        favouritePage: 1,
                    }),
                },
            };
        },
    },
});

export default aoiSlice;
