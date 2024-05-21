import { ThunkAction } from "redux-thunk";
import { RootState } from "..";
import { AnyAction } from "redux";
import { hideSiteLoader, showSiteLoader } from "./modal-actions";
import axios from "../../../utils/axios";
import { config, errToast, tokenIsValid } from "../../../utils/helper";
import { AxiosError } from "axios";
import exportsSettings from "../reducers/exports-slice";
import {
    ExportModel,
    SearchResDowLinkReturnType,
} from "../../models/redux-models";

export const exportsSettingsActions = exportsSettings.actions;

//handleExportsData
export const handleExportsData = (obj: {
    exportData: ExportModel["exportData"];
    exportPageSize?: ExportModel["exportPageSize"];
    exportTotalRecord?: ExportModel["exportTotalRecord"];
}): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(exportsSettingsActions.handleExportsData(obj));
    };
};

//resetExportsData
export const resetExportsData = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(exportsSettingsActions.resetExportsData());
    };
};

// fetch exports logs
export const fetchExportsLogs =
    (
        token: string,
        page: number
    ): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        await tokenIsValid(token);
        try {
            let response = await axios.get(
                `/api-search/download-log?page=${page}`,
                config
            );
            const { status, data, page_size, total_record } = response.data;
            if (status === 200) {
                dispatch(
                    handleExportsData({
                        exportData: Array.isArray(data) ? data : [],
                        exportPageSize: page_size,
                        exportTotalRecord: total_record,
                    })
                );
            }
            return response.data;
        } catch (err) {
            errToast(err as AxiosError);
        }
    };

// get search result download link
export const getSearchResultDownloadLink =
    (
        token: string,
        id: number
    ): ThunkAction<
        Promise<SearchResDowLinkReturnType>,
        RootState,
        unknown,
        AnyAction
    > =>
    async (dispatch) => {
        await tokenIsValid(token);
        dispatch(showSiteLoader());
        try {
            let response = await axios.get(
                `/api-search/file-download?id=${id}`,
                config
            );
            dispatch(hideSiteLoader());
            return response.data;
        } catch (err) {
            dispatch(showSiteLoader());
            errToast(err as AxiosError);
        }
    };
