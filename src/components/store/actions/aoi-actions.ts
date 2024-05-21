import { ThunkAction } from "redux-thunk";
import { RootState } from "..";
import { AnyAction } from "redux";
import aoiSlice from "../reducers/aoi-slice";
import {
    actionType,
    config,
    errToast,
    tokenIsValid,
} from "../../../utils/helper";
import axios from "../../../utils/axios";
import { AxiosError } from "axios";
import { hideSiteLoader, showSiteLoader } from "./modal-actions";
import { toast } from "react-toastify";
import {
    ReturnMsgAndStatus,
    SendCrsReturnType,
    UploadAoiFileReturnType,
    fetchCrsListReturnType,
} from "../../models/submit-form";
import { AoiModel } from "../../models/redux-models";
import { logUserAction } from "./auth-actions";

export const aoiActions = aoiSlice.actions;

export const toggleSettDrawer = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(aoiActions.toggleSettDrawer());
    };
};

//fetch upload aoi file
export const fetchAoiStats = (
    token: string,
    formData: { geometry: string }
): ThunkAction<
    Promise<UploadAoiFileReturnType>,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token);
        const { geometry } = formData;
        const data = new FormData();
        data.append("geometry", geometry);

        try {
            const res = await axios.post(`/api-aoi/aoi-stats`, data);
            const { status, msg } = res.data;
            if (status === 200) {
                toast.success(msg);
            } else {
                if (status !== 422) toast.error(msg);
            }
            dispatch(hideSiteLoader());
            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };
};

//upload upload aoi file
export const uploadAoiFile = (
    token: string,
    formData: {
        file: Blob;
        aoi_name: string;
        file_name: string;
        buffer_distance: string;
    }
): ThunkAction<
    Promise<UploadAoiFileReturnType>,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token);
        const { file, aoi_name, file_name, buffer_distance } = formData;
        const fileType = (file as Blob).name.split(".").pop();
        const data = new FormData();
        data.append("file", file, file.name);
        data.append("buffer_distance", buffer_distance);

        try {
            axios.defaults.headers.common[
                "Content-Disposition"
            ] = `attachment; filename=${file.name}`;
            const res = await axios.put(
                `/api-aoi/upload-aoi-file?aoi_name=${aoi_name}${
                    file_name ? `&file_name=${file_name}` : ""
                }`,
                data
            );
            const { status, msg } = res.data;
            if (status === 200) {
                //log save aoi file
                dispatch(
                    logUserAction({
                        action_type: actionType["save_aoi"],
                        // action_log_detail: `aoi_name: ${aoi_name}, buffer_distance: ${formData.buffer_distance}`,
                        action_log_detail: JSON.stringify({
                            aoi_name: formData.aoi_name,
                            buffer_distance: formData.buffer_distance,
                        }),
                    })
                );
            }
            if (status === 200) {
                toast.success(msg);
            } else {
                if (status !== 422) toast.error(msg);
            }
            dispatch(hideSiteLoader());
            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };
};

//get aoi file
export const fetchAoiList = (
    token: string,
    showLoader = true
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        showLoader && dispatch(showSiteLoader());
        await tokenIsValid(token);

        try {
            const res = await axios.get(`/api-aoi/upload-aoi-file`);
            const { status, data, msg, max_allowed_aoi } = res.data;
            if (status === 200) {
                if (!("data" in res.data)) {
                    dispatch(
                        aoiActions.fetchAoiList({ data: [], max_allowed_aoi })
                    );
                    return;
                }
                if (Array.isArray(data)) {
                    dispatch(
                        aoiActions.fetchAoiList({ data, max_allowed_aoi })
                    );
                }
            } else {
                toast.error(msg);
            }
            showLoader && dispatch(hideSiteLoader());
        } catch (err) {
            errToast(err as AxiosError);
            showLoader && dispatch(hideSiteLoader());
        }
    };
};

//crsModal
export const clearAoiList = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(aoiActions.clearAoiList());
    };
};

//send crs
export const sendCrs = (
    token: string,
    formData: { crs?: string; file_name: string; aoi_name: string }
): ThunkAction<Promise<SendCrsReturnType>, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token);

        try {
            const res = await axios.post(`/api-aoi/set-crs`, formData, config);
            const {
                data: {
                    data: { file_name },
                },
            } = res.data;
            if (res.data.status === 200) {
                //log user actions
                dispatch(
                    logUserAction({
                        action_type: actionType["upload_shapefile"],
                        action_log_detail: JSON.stringify({ file_name }),
                    })
                );
            }

            dispatch(hideSiteLoader());
            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };
};

//toggle aoi side con
export const toggleAoiSideCon = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(aoiActions.toggleAoiSideCon());
    };
};

//aoi name selected for edit
export const setAoiNameSelForEdit = (data: {
    aoi_name: string;
    aoi_id: number;
}): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(aoiActions.setAoiNameSelForEdit(data));
    };
};

//clear aoi name selected for edit
export const clearAoiNameSelForEdit = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(aoiActions.clearAoiNameSelForEdit());
    };
};

//crs options
export const fetchCrsList =
    (
        token: string,
        data: { search: string; page: number }
    ): ThunkAction<
        Promise<fetchCrsListReturnType>,
        RootState,
        unknown,
        AnyAction
    > =>
    async (dispatch) => {
        const { search, page } = data;
        await tokenIsValid(token);
        try {
            const response = await axios.get(
                `/api-setting/crs-lookup?param=${search}&page=${page}`,
                config
            );
            const { status, msg } = response.data;
            if (status !== 200) toast.error(msg);
            return response.data;
        } catch (err) {
            errToast(err as AxiosError);
        }
    };

//setGenTabAoiNotiData
export const setAoiGenTabNotiData = (
    data: AoiModel["aoiGenTabNotiData"]
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(aoiActions.setAoiGenTabNotiData(data));
    };
};

//setAoiNotiData
export const setAoiNotiData = (
    data: AoiModel["aoiNotiData"]
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(aoiActions.setAoiNotiData(data));
    };
};

//get aoi notification
export const getAoiNotiData = (
    token: string,
    // note:- if aoi_id is passed it will used for particular aoi notification settings
    aoi_id?: number
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token);

        try {
            const res = await axios.get(
                `/api-aoi/aoi-notification${aoi_id ? `?aoi_id=${aoi_id}` : ""}`,
                config
            );
            const { data, status, msg } = res.data;
            if (status === 200 && data) {
                if (aoi_id) {
                    dispatch(setAoiNotiData(data));
                } else {
                    dispatch(setAoiGenTabNotiData(data));
                }
            } else {
                toast.error(msg);
            }
            dispatch(hideSiteLoader());
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };
};

//handle aoi-tab index
export const handleAoiTabIndex = (
    index: AoiModel["aoi_tab_index"]
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(aoiActions.handleAoiTabIndex(index));
    };
};

//update AOI Name
export const updateAoiName = (
    token: string,
    formData: {
        aoi_name: string;
        aoi_id: number;
    }
): ThunkAction<Promise<ReturnMsgAndStatus>, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token);

        try {
            const res = await axios.put(
                `api-aoi/update-aoi_name`,
                formData,
                config
            );
            dispatch(hideSiteLoader());
            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };
};

//update aoi Notificatio settings
export const updateAoiNotiData = (
    token: string,
    formData:
        | { notification_settings: AoiModel["aoiGenTabNotiData"] }
        | { notification_settings: AoiModel["aoiNotiData"] },
    // if aoi id is passed it will used to update particular aoi notification settings
    aoi_id?: number
): ThunkAction<Promise<ReturnMsgAndStatus>, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token);

        try {
            // eslint-disable-next-line
            const res = await axios.put(
                `/api-aoi/aoi-notification${aoi_id ? `?aoi_id=${aoi_id}` : ""}`,
                formData,
                config
            );
            dispatch(hideSiteLoader());
            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };
};

//clearAoiNotiData
export const clearAoiNotiData = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(aoiActions.clearAoiNotiData());
    };
};

//clearGenTabAoiNotiData
export const clearAoiGenTabNotiData = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(aoiActions.clearAoiGenTabNotiData());
    };
};

//save upload aoi file using Drawing on map
export const uploadAoiUsingMapFile = (
    token: string,
    formData: {
        aoi_name: string;
        buffer_distance: number;
        crs: number;
        geometry: {
            type: string;
            properties: { id: number };
            geometry: {
                type: string;
                coordinates: any;
            };
        }[];
    }
): ThunkAction<Promise<ReturnMsgAndStatus>, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token);
        try {
            const res = await axios.post(`/api-aoi/create-aoi`, formData);
            const {
                status,
                msg,
                data: { file_name },
            } = res.data;
            dispatch(hideSiteLoader());
            if (status === 200) {
                //log save aoi file
                dispatch(
                    logUserAction({
                        action_type: actionType["save_aoi"],
                        action_log_detail: JSON.stringify({
                            file_name,
                        }),
                    })
                );
                toast.error(msg);
            }
            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };
};

//handle aoi-tab index
export const handleUsingMapCreateAoi = (
    val: AoiModel["usingMapCreateAoi"]
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(aoiActions.handleUsingMapCreateAoi(val));
    };
};

//Delete aoi
export const removeAoi = (
    token: string,
    aoiId: number
): ThunkAction<Promise<ReturnMsgAndStatus>, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token);
        try {
            const config = {
                data: { id: aoiId },
                headers: { "Content-Type": "application/json" },
            };
            const res = await axios.delete("/api-aoi/create-aoi", config);
            const { msg, status } = res.data;

            dispatch(hideSiteLoader());
            if (status === 200) {
                //log delete aoi
                dispatch(
                    logUserAction({
                        action_type: actionType["delete_aoi"],
                        action_log_detail: `aoi_id: ${aoiId}`,
                    })
                );
                toast.success(msg);
            } else {
                status !== 200 && toast.error(msg);
            }
            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };
};

//handle aoi-tab index
export const handlePreviousSearchFilter = (
    val: AoiModel["previousSearchFilter"]
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(aoiActions.handlePreviousSearchFilter(val));
    };
};
