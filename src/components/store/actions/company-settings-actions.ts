import { ThunkAction } from "redux-thunk";
import { RootState } from "..";
import { AnyAction } from "redux";
import companySettingsSlice from "../reducers/company-setting-slice";
import {
    CompanyPicFormData,
    CompanyPicRemoveFormData,
    CompanySettingSubmitReturnType,
    FetchCompanySettingReturnType,
    RemoveCompanyPicReturnType,
    UploadCompanyPicReturnType,
    submitBasicCompanyInfo,
} from "../../models/submit-form";

import axios from "../../../utils/axios";
import { hideSiteLoader, showSiteLoader } from "./modal-actions";
import {
    actionType,
    config,
    errToast,
    tokenIsValid,
} from "../../../utils/helper";
import { AxiosError } from "axios";
import { logUserAction } from "./auth-actions";

export const companySettingsActions = companySettingsSlice.actions;
//uploadCompanyPic
export const uploadCompanyPic = (
    token: string | null,
    formData: CompanyPicFormData
): ThunkAction<
    Promise<UploadCompanyPicReturnType>,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        // dispatch(showSiteLoader());
        await tokenIsValid(token as string);
        try {
            const res = await axios.post(
                "/api-user/upload-resourece",
                formData,
                config
            );
            // dispatch(hideSiteLoader());
            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
            // dispatch(hideSiteLoader());
        }
    };
};

//save company Details
export const saveCompanyDetails = (
    token: string | null,
    formData: submitBasicCompanyInfo,
    isEdit = false
): ThunkAction<
    Promise<CompanySettingSubmitReturnType>,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token as string);
        try {
            let res;
            if (isEdit) {
                res = await axios.put(
                    "/api-user/manage-company",
                    formData,
                    config
                );
            } else {
                res = await axios.post(
                    "/api-user/manage-company",
                    formData,
                    config
                );
            }
            dispatch(hideSiteLoader());
            const { status, msg } = res.data;
            return isEdit ? { status, msg } : res.data;
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };
};

//removeCompanyPic
export const removeCompanyLogo = (
    token: string | null,
    formData: CompanyPicRemoveFormData
): ThunkAction<
    Promise<RemoveCompanyPicReturnType>,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token as string);
        try {
            const config = {
                data: formData,
                headers: { "Content-Type": "application/json" },
            };
            const res = await axios.delete(
                "/api-user/upload-resourece",
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

//fetchCompanySettingDetail
export const fetchCompanySettingDetail = (
    token: string | null
): ThunkAction<
    Promise<FetchCompanySettingReturnType>,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token as string);
        try {
            const res = await axios.get("/api-user/manage-company", config);

            const { data, status } = res.data;

            // if (status === 200) {
            //     dispatch(
            //         logUserAction({
            //             action_type: actionType["view_settings"],
            //             action_log_detail: "visited Settings page.",
            //         })
            //     );
            // }

            if (data) {
                const {
                    address: {
                        city,
                        first_address,
                        phone_no,
                        second_address,
                        state,
                        zip_code,
                    },
                    company: {
                        billing_email,
                        company_email,
                        company_logo,
                        company_name,
                    },
                } = data;
                dispatch(
                    companySettingsActions.loadCompanySettingsDetails({
                        address: {
                            city,
                            first_address,
                            phone_no,
                            second_address,
                            state,
                            zip_code,
                            address_id: data?.address?.id,
                        },
                        company: {
                            billing_email,
                            company_email,
                            company_logo,
                            company_name,
                            company_id: data?.company?.id,
                        },
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

export const clearCompanySettingsDetails = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(companySettingsActions.clearCompanySettingsDetails());
    };
};
