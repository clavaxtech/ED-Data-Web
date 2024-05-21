import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CompanySettingInitialValue } from "../../models/redux-models";

const initialState: CompanySettingInitialValue = {
    address: {
        city: "",
        first_address: "",
        address_id: null,
        phone_no: "",
        second_address: "",
        state: "",
        zip_code: "",
    },
    company: {
        billing_email: "",
        company_email: "",
        company_logo: "",
        company_name: "",
        company_id: null,
    },
};

const companySettings = createSlice({
    name: "companySettings",
    initialState: initialState,
    reducers: {
        loadCompanySettingsDetails(
            state,
            action: PayloadAction<CompanySettingInitialValue>
        ) {
            const { address, company } = action.payload;
            return {
                ...state,
                address,
                company,
            };
        },
        clearCompanySettingsDetails(
            state,
            action: PayloadAction
        ) {
            return {
                ...initialState,
            };
        },
    },
});

export default companySettings;
