import { ThunkAction } from "redux-thunk";
import { RootState } from "..";
import { AnyAction } from "redux";
import { hideSiteLoader, showSiteLoader } from "./modal-actions";
import axios from "../../../utils/axios";
import { toast } from "react-toastify";
import {
    config,
    errToast,
    tokenIsValid,
} from "../../../utils/helper";
import { AxiosError } from "axios";
import files from "../reducers/files-slice";
import {
    ApiFilesListObj,
    CommonDownloadObject,
    FilesInitialValue,
    ShapeFilesListObj,
} from "../../models/redux-models";
import { ReturnMsgAndStatus } from "../../models/submit-form";

export const filesActions = files.actions;

// handle files tab index
export const handleFilesTabIndex =
    (
        val: FilesInitialValue["filesTabIndex"]
    ): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch(filesActions.handleFilesTabIndex(val));
    };

// handle Api file List
export const handleApiList =
    (val: {
        data: FilesInitialValue["apiList"];
        apiTotalRecord?: FilesInitialValue["apiTotalRecord"];
        apiPageSize?: FilesInitialValue["apiPageSize"];
        apiPage?: FilesInitialValue["apiPage"];
        notConcat?: boolean;
    }): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch(filesActions.handleApiList(val));
    };

// handle Api page
export const handleApiPage =
    (
        page: FilesInitialValue["apiPage"]
    ): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch(filesActions.handleApiPage(page));
    };

//fetch api file list
export const fetchApiFileList = (
    token: string,
    page: number
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        // dispatch(showSiteLoader());
        await tokenIsValid(token);

        try {
            const res = await axios.get(
                `/api-search/csv-api?page=${page}`,
                config
            );
            const { status, data, msg, total_record, page_size } = res.data;

            if (!data || typeof data === "string") {
                dispatch(
                    handleApiList({
                        data: [],
                        // apiTotalRecord: 0,
                        // apiPageSize: 0,
                    })
                );
                return;
            }

            if (status === 200 && Array.isArray(data)) {
                dispatch(
                    handleApiList({
                        data: data.map(
                            (item: Omit<ApiFilesListObj, "checked">) => ({
                                ...item,
                                checked: false,
                            })
                        ),
                        apiTotalRecord: total_record,
                        apiPageSize: page_size,
                        apiPage: page,
                    })
                );
            } else {
                toast.error(msg);
            }

            // dispatch(hideSiteLoader());
        } catch (err) {
            errToast(err as AxiosError);
            // dispatch(hideSiteLoader());
        }
    };
};

// handle shape file file List
export const handleShapeFileList =
    (val: {
        data: FilesInitialValue["shapeFileList"];
        shapeFileTotalRecord?: FilesInitialValue["shapeFileTotalRecord"];
        apiTotalRecord?: FilesInitialValue["apiTotalRecord"];
        shapeFilePage?: FilesInitialValue["shapeFilePage"];
        shapeFilePageSize?: FilesInitialValue["shapeFilePageSize"];
        notConcat?: boolean;
    }): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch(filesActions.handleShapeFileList(val));
    };

// handle  shape file page
export const handleShapeFilePage =
    (
        page: FilesInitialValue["shapeFilePage"]
    ): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch(filesActions.handleShapeFilePage(page));
    };

//fetch shape file list
export const fetchShapeFileList = (
    token: string,
    page: number
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        // dispatch(showSiteLoader());
        await tokenIsValid(token);

        try {
            const res = await axios.get(
                `/api-search/manage-file?page=${page}`,
                config
            );
            const { status, data, msg, total_record, page_size, csv_count } =
                res.data;

            if (!data) {
                dispatch(
                    handleShapeFileList({
                        data: [],
                        // shapeFileTotalRecord: 0,
                        // shapeFilePage: 0,
                    })
                );
            }

            if (status === 200 && data) {
                dispatch(
                    handleShapeFileList({
                        data: data.map(
                            (item: Omit<ShapeFilesListObj, "checked">) => ({
                                ...item,
                                checked: false,
                            })
                        ),
                        shapeFileTotalRecord: total_record,
                        shapeFilePageSize: page_size,
                        shapeFilePage: page,
                        apiTotalRecord: csv_count,
                    })
                );
            } else {
                status !== 200 && toast.error(msg);
            }

            // dispatch(hideSiteLoader());
        } catch (err) {
            errToast(err as AxiosError);
            // dispatch(hideSiteLoader());
        }
    };
};

//delete api or shape file
export const deleteApiOrShapeFile = (
    tkn: string,
    formData: {
        id: number[];
        type: "csv" | "aoi";
    }
): ThunkAction<Promise<ReturnMsgAndStatus>, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());
        await tokenIsValid(tkn);
        const config = {
            data: {
                ...formData,
            },
            headers: { "Content-Type": "application/json" },
        };
        try {
            const res = await axios.delete(`/api-search/manage-file`, config);

            dispatch(hideSiteLoader());
            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };
};

// // handle  selected Id
// export const handleSelectedId =
//     (
//         id: FilesInitialValue["selectedId"]
//     ): ThunkAction<void, RootState, unknown, AnyAction> =>
//     async (dispatch) => {
//         dispatch(filesActions.handleSelectedId(id));
//     };

// reset api list
export const resetApiList =
    (): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch(filesActions.resetApiList());
    };

// reset shape file list
export const resetShapeFileList =
    (): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch(filesActions.resetShapeFileList());
    };

//api to logs download
export const downloadFileLogs = (
    token: string,
    formData: CommonDownloadObject
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        await tokenIsValid(token);
        // dispatch(showSiteLoader());
        try {
            const res = await axios.post(
                "/api-search/download-log",
                formData,
                config
            );
            const { msg, status } = res.data;
            if (status === 200) {
                // toast.success(msg);
            } else toast.error(msg);
            // dispatch(hideSiteLoader());
            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
            // dispatch(hideSiteLoader());
        }
    };
};
