import { ThunkAction } from "redux-thunk";
import { RootState } from "..";
import { AnyAction } from "redux";
import mySettingSlice from "../reducers/my-setting-slice";
import {
    FetchProfilePicReturnType,
    ProfilePicFormData,
    RemoveProfilePicReturnType,
    UpdateProfilePicReturnType,
    UploadProfilePicReturnType,
} from "../../models/submit-form";
import { hideSiteLoader, showSiteLoader } from "./modal-actions";
import axios from "../../../utils/axios";
import { MysettingbasicInfo } from "../../models/page-props";
import { config, errToast, tokenIsValid } from "../../../utils/helper";
import { AxiosError } from "axios";

export const mySettingActions = mySettingSlice.actions;

// FetchProfileDetail
export const fetchProfileDetail =
    (
        token: string
    ): ThunkAction<
        Promise<FetchProfilePicReturnType>,
        RootState,
        unknown,
        AnyAction
    > =>
    async (dispatch) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token);
        try {
            let response = await axios.get("/api-user/update-profile", config);
            let { data } = response.data;
            if (data) {
                dispatch(mySettingActions.fetchProfileSettingDetail(data));
            }
            dispatch(hideSiteLoader());
            return response.data;
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };

// UpdateProfileDetail
export const updateProfileDetail =
    (
        token: string,
        payload: MysettingbasicInfo
    ): ThunkAction<
        Promise<UpdateProfilePicReturnType>,
        RootState,
        unknown,
        AnyAction
    > =>
    async (dispatch) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token);
        try {
            let response = await axios.put(
                "/api-user/update-profile",
                payload,
                config
            );
            dispatch(hideSiteLoader());
            return response.data;
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };

//uploadProfilePic
export const uploadProfilePic = (
    token: string | null,
    formData: ProfilePicFormData
): ThunkAction<
    Promise<UploadProfilePicReturnType>,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token as string);
        try {
            const res = await axios.put(
                "/api-user/update-profile-pic",
                formData,
                config
            );
            dispatch(hideSiteLoader());
            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
            // dispatch(hideSiteLoader());
        }
    };
};

//removeProfilePic
export const removeProfilePic = (
    token: string | null
): ThunkAction<
    Promise<RemoveProfilePicReturnType>,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token as string);
        try {
            const res = await axios.delete(
                "/api-user/update-profile-pic",
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
