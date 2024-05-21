import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { SubscriptionSettingsInitialValue } from "../../models/redux-models";

const initialState: SubscriptionSettingsInitialValue = {
    subscriptionData: null,
    loadSubscriptionData: true,
    paymentModalDuringTrialPeriod: false,
};

const subscriptionSettings = createSlice({
    name: "subscriptionSettings",
    initialState: initialState,
    reducers: {
        fetchSubscriptionData: (
            state,
            action: PayloadAction<
                SubscriptionSettingsInitialValue["subscriptionData"]
            >
        ) => {
            return {
                ...state,
                subscriptionData: action.payload,
                loadSubscriptionData: false,
            };
        },
        clearSubscriptionData: (state, action: PayloadAction) => {
            return {
                ...state,
                subscriptionData: null,
                loadSubscriptionData: true,
            };
        },
        noSubscriptionData: (state, action: PayloadAction) => {
            return {
                ...state,
                subscriptionData: null,
                loadSubscriptionData: false,
            };
        },
        handlePaymentModalDuringTrial: (
            state,
            action: PayloadAction<
                SubscriptionSettingsInitialValue["paymentModalDuringTrialPeriod"]
            >
        ) => {
            return {
                ...state,
                paymentModalDuringTrialPeriod: action.payload,
            };
        },
    },
});

export default subscriptionSettings;
