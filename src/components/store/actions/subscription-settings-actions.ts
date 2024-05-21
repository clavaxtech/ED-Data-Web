import { ThunkAction } from "redux-thunk";
import { RootState } from "..";
import { AnyAction } from "redux";
import subscriptionSettingsSlice from "../reducers/subscription-settings-slice";
import { hideSiteLoader, showSiteLoader } from "./modal-actions";
import axios from "../../../utils/axios";
import { toast } from "react-toastify";
import {
    CancelSubscriptionReturnType,
    ReturnMsgAndStatus,
} from "../../models/submit-form";
import {
    actionType,
    config,
    errToast,
    tokenIsValid,
} from "../../../utils/helper";
import { AxiosError } from "axios";
import { UpdateSubscriptionEditModalFormData } from "../../models/redux-models";
import { logUserAction } from "./auth-actions";

export const subscriptionSettingsActions = subscriptionSettingsSlice.actions;

// fetchSubscriptionData
export const fetchSubscriptionData =
    (token: string): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token);
        try {
            let response = await axios.get(
                "/api-subscriptions/get-details",
                config
            );
            let { data, status, msg } = response.data;
            if (status === 200) {
                if (Object.keys(data).length > 0) {
                    dispatch(
                        subscriptionSettingsActions.fetchSubscriptionData({
                            subscription: data.subscription,
                            details: Array.isArray(data.details)
                                ? [...data.details]
                                : [data.details],
                        })
                    );
                } else {
                    dispatch(subscriptionSettingsActions.noSubscriptionData());
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

// cancelSubscriptionData
export const cancelSubscription =
    (
        token: string
    ): ThunkAction<
        Promise<CancelSubscriptionReturnType>,
        RootState,
        unknown,
        AnyAction
    > =>
    async (dispatch, getState) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token);
        const { subscriptionSettings } = getState();
        try {
            let response = await axios.get(
                "api-subscriptions/cancel-subscription",
                config
            );
            const { status } = response;
            //log user action
            if (status === 200) {
                dispatch(
                    logUserAction({
                        action_type: actionType["cancelled_subscription"],
                        action_log_detail: `subscription_id: ${subscriptionSettings.subscriptionData?.subscription.id}`,
                    })
                );
            }
            dispatch(hideSiteLoader());
            return response.data;
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };

// clearSubscriptionData
export const clearSubscriptionData =
    (): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch(subscriptionSettingsActions.clearSubscriptionData());
    };

// updateSubscription
export const updateSubscription =
    (
        token: string,
        formData: UpdateSubscriptionEditModalFormData
    ): ThunkAction<
        Promise<ReturnMsgAndStatus>,
        RootState,
        unknown,
        AnyAction
    > =>
    async (dispatch) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token);
        const config = {
            data: {
                ...formData,
            },
            headers: { "Content-Type": "application/json" },
        };
        try {
            let response = await axios.delete(
                "/api-subscriptions/cancel-subscription",
                config
            );

            dispatch(hideSiteLoader());
            return response.data;
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };

// payment modal during trial period
export const handlePaymentModalDuringTrial =
    (val: boolean): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch(
            subscriptionSettingsActions.handlePaymentModalDuringTrial(val)
        );
    };

//Free trial for n days subscription
export const freeTrialSubscription = (formData: {
    amount: number;
}): ThunkAction<Promise<ReturnMsgAndStatus>, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());

        try {
            const res = await axios.post(
                "/api-subscriptions/subscribe-free",
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
