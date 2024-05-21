import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BillingSettingsInitialValue } from "../../models/redux-models";

const initialState: BillingSettingsInitialValue = {
    paymentMethodsData: null,
    paymentMethodsDataLoading: true,
    paymentHistoryData: {
        latest: {
            id: 0,
            company_name: "",
            company_subscription_id: 0,
            invoice_date: "",
            invoice_amount: "",
            payment_status: false,
            basin_count: 0,
            county_count: 0,
            stripe_invoice_pdf: "",
        },
        total_record: 0,
        history_data: [],
        page_size: 0,
    },
    paymentHistoryDataLoading: true,
};

const billingSettings = createSlice({
    name: "billingSettings",
    initialState: initialState,
    reducers: {
        fetchPaymentMethodsData: (
            state,
            action: PayloadAction<
                BillingSettingsInitialValue["paymentMethodsData"]
            >
        ) => {
            return {
                ...state,
                paymentMethodsData: action.payload,
                paymentMethodsDataLoading: false,
            };
        },
        clearPaymentMethodsData: (state, action: PayloadAction) => {
            return {
                ...state,
                paymentMethodsData: null,
                paymentMethodsDataLoading: true,
            };
        },
        fetchPaymentHistoryData: (
            state,
            action: PayloadAction<{
                latest?: BillingSettingsInitialValue["paymentHistoryData"]["latest"];
                history_data: BillingSettingsInitialValue["paymentHistoryData"]["history_data"];
                total_record: BillingSettingsInitialValue["paymentHistoryData"]["total_record"];
            }>
        ) => {
            return {
                ...state,
                paymentHistoryData: {
                    ...state.paymentHistoryData,
                    ...action.payload,
                },
                paymentHistoryDataLoading: false,
            };
        },
        clearPaymentHistoryData: (
            state,
            action: PayloadAction<{ removeLatest: boolean }>
        ) => {
            const { removeLatest } = action.payload;
            return {
                ...state,
                paymentHistoryData: {
                    latest: removeLatest
                        ? {
                              id: 0,
                              company_name: "",
                              company_subscription_id: 0,
                              invoice_date: "",
                              invoice_amount: "",
                              payment_status: false,
                              basin_count: 0,
                              county_count: 0,
                              stripe_invoice_pdf: "",
                          }
                        : state.paymentHistoryData.latest,
                    total_record: 0,
                    history_data: null,
                    page_size: 0,
                },
                paymentHistoryDataLoading: true,
            };
        },
    },
});

export default billingSettings;
