import { ThunkAction } from "redux-thunk";
import { RootState } from "..";
import { AnyAction } from "redux";
import billingSettingsSlice from "../reducers/billing-settings-slice";
import { hideSiteLoader, showSiteLoader } from "./modal-actions";
import axios from "../../../utils/axios";
import { toast } from "react-toastify";
import {
    FetchPaymentHistoryDataSubmitForm,
    UpdateBillingAddressModalSubmitForm,
    UpdateBillingAddressReturnType,
    UpdateCardDetailsFormData,
    UpdateCardDetailsReturnType,
} from "../../models/submit-form";
import { config, errToast, tokenIsValid } from "../../../utils/helper";
import { AxiosError } from "axios";

export const billingSettingsActions = billingSettingsSlice.actions;

// fetchSubscriptionData
export const fetchPaymentMethodsData =
    (token: string): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token);
        try {
            let response = await axios.get(
                "api-subscriptions/update-payment-info",
                config
            );
            let { data, status, msg } = response.data;
            if (status === 200) {
                if (data?.stripe_cust_id) {
                    const {
                        company_name,
                        billing_email,
                        cc_details: {
                            cc_no,
                            name_on_card,
                            cc_exp_month,
                            cc_exp_year,
                        },
                        billing_address: {
                            first_address,
                            second_address,
                            city,
                            state,
                            zip_code,
                            country,
                        },
                    } = data;
                    dispatch(
                        billingSettingsActions.fetchPaymentMethodsData({
                            company_name,
                            billing_email,
                            cc_no,
                            name_on_card,
                            cc_exp_month,
                            cc_exp_year,
                            first_address,
                            second_address,
                            city,
                            state,
                            zip_code,
                            country,
                        })
                    );
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

// clearSubscriptionData
export const clearPaymentMethodsData =
    (): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch(billingSettingsActions.clearPaymentMethodsData());
    };

//updateCardDetails
export const updateCardDetails = (
    token: string,
    formData: UpdateCardDetailsFormData,
    showLoader = false
): ThunkAction<
    Promise<UpdateCardDetailsReturnType>,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        showLoader && dispatch(showSiteLoader());
        await tokenIsValid(token);
        try {
            const res = await axios.post(
                "/api-subscriptions/update-payment-info",
                formData,
                config
            );
            showLoader && dispatch(hideSiteLoader());
            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
            showLoader && dispatch(hideSiteLoader());
        }
    };
};

//updateBillingDetails
export const updateBillingDetail = (
    token: string,
    formData: UpdateBillingAddressModalSubmitForm,
    showLoader = false
): ThunkAction<
    Promise<UpdateBillingAddressReturnType>,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        showLoader && dispatch(showSiteLoader());
        await tokenIsValid(token);
        try {
            const res = await axios.post(
                "/api-subscriptions/update-billing",
                formData,
                config
            );
            showLoader && dispatch(hideSiteLoader());
            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
            showLoader && dispatch(hideSiteLoader());
        }
    };
};

//fetchPaymentHistoryData
export const fetchPaymentHistoryData = (
    token: string,
    formData: FetchPaymentHistoryDataSubmitForm
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());
        const { page, recent } = formData;
        try {
            const res = await axios.get(
                `/api-subscriptions/invoice-details?page=${page}${
                    typeof recent !== "undefined" ? `&recent=${recent}` : ""
                }`,
                config
            );
            const { status, msg, data } = res.data;
            if (status === 200) {
                if (data) {
                    dispatch(
                        billingSettingsActions.fetchPaymentHistoryData(data)
                    );
                }
            } else {
                toast.error(msg);
            }
            dispatch(hideSiteLoader());
            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };
};

// clearPaymentHistoryData
export const clearPaymentHistoryData =
    (removeLatest = false): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch(
            billingSettingsActions.clearPaymentHistoryData({ removeLatest })
        );
    };
