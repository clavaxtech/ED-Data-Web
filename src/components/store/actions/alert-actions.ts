import { ThunkAction } from "redux-thunk";
import {
    AlertCountyObj,
    AlertModel,
    AlertMsgObj,
    AlertUpdateFormData,
} from "../../models/redux-models";
import alertSlice from "../reducers/alert-slice";
import { AnyAction } from "redux";
import { RootState } from "..";
import { handleSideContentTabLoading, hideSiteLoader } from "./modal-actions";
import { config, errToast, tokenIsValid } from "../../../utils/helper";
import axios from "../../../utils/axios";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { ReturnMsgAndStatus } from "../../models/submit-form";

export const alertActions = alertSlice.actions;

//handleAlertTabIndex
export const handleAlertTabIndex = (
    val: AlertModel["alertTabIndex"]
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(alertActions.handleAlertTabIndex(val));
    };
};

//clearAlertNotiData
export const clearAlertTabNotiData = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(alertActions.clearAlertTabNotiData());
    };
};

//get alert Settings
export const getAlertSettings = (
    token: string
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(handleSideContentTabLoading(true));
        await tokenIsValid(token);

        try {
            const res = await axios.get(`/api-alert/manage-alert`);
            const { status, data, msg } = res.data;
            if (status === 200) {
                dispatch(setAlertSetTabNotiData(data));
            } else {
                toast.error(msg);
            }
            dispatch(handleSideContentTabLoading(false));
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(handleSideContentTabLoading(false));
        }
    };
};

//setAlertSetTabNotiData
export const setAlertSetTabNotiData = (
    data: AlertModel["alertSetTabNotiData"]
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(alertActions.setAlertSetTabNotiData(data));
    };
};

//update alert Notification settings
export const updateAlertNotiData = (
    token: string,
    formData: AlertModel["alertSetTabNotiData"]
): ThunkAction<Promise<ReturnMsgAndStatus>, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(handleSideContentTabLoading(true));

        await tokenIsValid(token);
        let tempData: AlertUpdateFormData = [];
        formData.forEach((item) => {
            tempData.push({
                id: item.id,
                is_email: item.is_email,
                // is_mobile_push: item.is_mobile_push,
                is_in_platform: item.is_in_platform,
            });
        });

        try {
            // eslint-disable-next-line
            const res = await axios.put(
                `/api-alert/manage-alert`,
                tempData,
                config
            );
            dispatch(handleSideContentTabLoading(false));

            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(handleSideContentTabLoading(false));
        }
    };
};

//handleAlertMsgData
export const handleAlertMsgData = (obj: {
    data: AlertModel["alertMsg"]["data"];
    totalPage?: AlertModel["alertMsg"]["totalPage"];
    unread_count?: AlertModel["alertMsg"]["unread_count"];
    favourite_count?: AlertModel["alertMsg"]["favourite_count"];
    read_count?: AlertModel["alertMsg"]["read_count"];
    pageSize?: AlertModel["alertMsg"]["pageSize"];
    conCat?: boolean;
}): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(alertActions.handleAlertMsgData(obj));
    };
};

//handleAlertMsgPageChange
export const handleAlertMsgPageChange = (
    page: AlertModel["alertMsg"]["page"]
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(alertActions.handleAlertMsgPageChange(page));
    };
};

//Api to get alert message
export const fetchAlertMessage = (
    token: string,
    page: number,
    alertTabIndex: AlertModel["alertTabIndex"],
    conCat?: boolean
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        page === 1 && dispatch(handleSideContentTabLoading(true));
        await tokenIsValid(token);

        try {
            const res = await axios.get(
                `/api-alert/alert-message?page=${page}${
                    alertTabIndex === 0 || alertTabIndex === 1
                        ? `&unread=${alertTabIndex}`
                        : `&favourite=1`
                }`
            );
            // if (page !== 1) {
            // dispatch(handleAlertMsgPageChange(page));
            // }
            const {
                status,
                data,
                msg,
                page_size,
                unread_count,
                favourite_count,
                read_count,
                total_record,
            } = res.data;
            if (status === 200) {
                dispatch(handleAlertMsgPageChange(page));
                dispatch(
                    handleAlertMsgData({
                        data:
                            "data" in res.data
                                ? data.map((item: AlertMsgObj) => ({
                                      ...item,
                                      checked: false,
                                  }))
                                : [],
                        ...(page === 1 &&
                            alertTabIndex === 0 && {
                                totalPage:
                                    Math.floor(total_record / page_size) +
                                    (total_record % 10 > 0 ? 1 : 0),
                            }),
                        ...(page === 1 &&
                            alertTabIndex === 1 && {
                                totalPage:
                                    Math.floor(total_record / page_size) +
                                    (total_record % 10 > 0 ? 1 : 0),
                            }),
                        ...(page === 1 &&
                            alertTabIndex === 2 && {
                                totalPage:
                                    Math.floor(total_record / page_size) +
                                    (total_record % 10 > 0 ? 1 : 0),
                            }),
                        // ...(page === 1 && {
                        ...(unread_count >= 0 && {
                            unread_count: unread_count,
                        }),
                        // ...(page === 1 && {
                        ...(favourite_count >= 0 && {
                            favourite_count: favourite_count,
                        }),
                        // ...(page === 1 && {
                        ...(read_count >= 0 && {
                            read_count: read_count,
                        }),
                        ...(page === 1 && {
                            pageSize: page_size,
                        }),
                        ...(conCat && { conCat: true }),
                    })
                );
            } else {
                toast.error(msg);
            }
            page === 1 && dispatch(handleSideContentTabLoading(false));
        } catch (err) {
            errToast(err as AxiosError);
            page === 1 && dispatch(handleSideContentTabLoading(false));
        }
    };
};

//delete alert msg
export const deleteAlertMsg = (
    token: string,
    formData: { alert_id: number[] }
): ThunkAction<Promise<ReturnMsgAndStatus>, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        // dispatch(showSiteLoader());
        dispatch(handleSideContentTabLoading(true));
        await tokenIsValid(token);
        const config = {
            data: {
                ...formData,
            },
            headers: { "Content-Type": "application/json" },
        };
        try {
            const res = await axios.delete("/api-alert/alert-message", config);

            // dispatch(hideSiteLoader());
            dispatch(handleSideContentTabLoading(false));

            return res.data;
        } catch (err) {
            // dispatch(hideSiteLoader());
            dispatch(handleSideContentTabLoading(false));

            errToast(err as AxiosError);
        }
    };
};

//fetch county list for alert setting
export const fetchCountyList = (
    token: string
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(handleSideContentTabLoading(true));

        await tokenIsValid(token);

        try {
            const res = await axios.get(`/api-alert/alert-county`);
            const {
                status,
                data,
                msg,
                is_aoi_alert_enabled,
                selected_data,
                is_county_alert_enabled,
            } = res.data;
            if (status === 200) {
                if (data && Array.isArray(data)) {
                    dispatch(
                        fetchAlertCountyList(
                            data.map((item) => {
                                return {
                                    label: `${item.county_name} (${item.state_abbr})`,
                                    value: `${item.county_name}_${item.state_abbr}`,
                                };
                            })
                        )
                    );
                }
                dispatch(handleAoiALertEnabled(is_aoi_alert_enabled));
                dispatch(handleCountyAlertsSettings(is_county_alert_enabled));
                if (selected_data && selected_data.length > 0) {
                    dispatch(
                        handleSelectedCountyList(
                            selected_data.map(
                                (item: {
                                    id: number;
                                    state_abbr: string;
                                    county: string;
                                    alert_status: boolean;
                                    user: number;
                                }) => ({
                                    id: item.id,
                                    label: `${item.county} (${item.state_abbr})`,
                                    value: `${item.county}_${item.state_abbr}`,
                                    alert_status: item.alert_status,
                                    user: item.user,
                                })
                            )
                        )
                    );
                }
            } else {
                toast.error(msg);
            }
            dispatch(handleSideContentTabLoading(false));
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };
};

//fetch Alert county change
export const fetchAlertCountyList = (
    data: AlertModel["countyList"]
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(alertActions.fetchAlertCountyList(data));
    };
};

//fetch county list for alert setting
export const saveCountyList = (
    token: string,
    formData: AlertCountyObj[]
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(handleSideContentTabLoading(true));

        const {
            alerts: { selectedCountyList },
        } = getState();
        await tokenIsValid(token);

        try {
            const res = await axios.post(`/api-alert/alert-county`, formData);
            const { status, msg, data } = res.data;
            if (status === 200 && data) {
                const { state_abbr, id, county } = data[0];
                dispatch(
                    handleSelectedCountyList(
                        [...selectedCountyList].map((item) =>
                            JSON.stringify(item).includes(
                                `${county}_${state_abbr}`
                            )
                                ? { ...item, id }
                                : item
                        )
                    )
                );
                toast.success(msg);
            } else {
                toast.error(msg);
            }
            dispatch(handleSideContentTabLoading(false));
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(handleSideContentTabLoading(false));
        }
    };
};

//hanlde AOI Alert Enabled
export const handleAoiALertEnabled = (
    val: AlertModel["is_aoi_alert_enabled"]
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(alertActions.handleAoiALertEnabled(val));
    };
};

//hanlde reset data
export const handleResetData = (
    val: AlertModel["alertTabIndex"]
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(alertActions.handleResetData(val));
    };
};

//handle selected county list
export const handleSelectedCountyList = (
    data: AlertModel["selectedCountyList"]
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(alertActions.handleSelectedCountyList(data));
    };
};

//update AlertSetting
export const updateAoiAlertSetting = (
    token: string,
    formData: { alert_status?: 0 | 1; county_alert?: boolean }
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(handleSideContentTabLoading(true));

        await tokenIsValid(token);

        try {
            const res = await axios.put(`/api-alert/alert-county`, formData);
            const { status, msg } = res.data;
            if (status === 200) {
                toast.success(msg);
            } else {
                toast.error(msg);
            }
            dispatch(handleSideContentTabLoading(false));
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(handleSideContentTabLoading(false));
        }
    };
};

//delete alert msg
export const deleteAlertCounty = (
    token: string,
    formData: { id: number }
): ThunkAction<Promise<ReturnMsgAndStatus>, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(handleSideContentTabLoading(true));

        await tokenIsValid(token);
        const config = {
            data: {
                ...formData,
            },
            headers: { "Content-Type": "application/json" },
        };
        try {
            const res = await axios.delete("/api-alert/alert-county", config);

            const { status, msg } = res.data;

            if (status === 200) {
                toast.success(msg);
            } else {
                toast.error(msg);
            }

            dispatch(handleSideContentTabLoading(false));

            return res.data;
        } catch (err) {
            dispatch(handleSideContentTabLoading(false));
            errToast(err as AxiosError);
        }
    };
};

//handle county Alerts Settings
export const handleCountyAlertsSettings = (
    val: AlertModel["is_county_alert_enabled"]
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(alertActions.handleCountyAlertsSettings(val));
    };
};

//api to mark notification unread
export const markNotiUnread = (
    token: string,
    formData: { alert_id: number[]; action: "new" | "read" }
): ThunkAction<Promise<ReturnMsgAndStatus>, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(handleSideContentTabLoading(true));
        await tokenIsValid(token);
        const {
            alerts: { alertTabIndex },
        } = getState();
        try {
            const res = await axios.post(`/api-alert/mark-read`, formData);
            const { status, msg } = res.data;
            if (status === 200) {
                dispatch(handleResetData(alertTabIndex));
                toast.success(msg);
            } else {
                toast.error(msg);
            }
            dispatch(handleSideContentTabLoading(false));
            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(handleSideContentTabLoading(false));
        }
    };
};

//api to mark favourite and un favourite
export const markFavourite = (
    token: string,
    formData: { id: number[]; favourite: 0 | 1 }
): ThunkAction<Promise<ReturnMsgAndStatus>, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(handleSideContentTabLoading(true));
        await tokenIsValid(token);
        const {
            alerts: { alertTabIndex },
        } = getState();
        try {
            const res = await axios.post(`/api-alert/favourite`, formData);
            const { status, msg } = res.data;
            if (status === 200) {
                dispatch(handleResetData(alertTabIndex));
                toast.success(msg);
            } else {
                toast.error(msg);
            }
            dispatch(handleSideContentTabLoading(false));
            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(handleSideContentTabLoading(false));
        }
    };
};
