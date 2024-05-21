import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ProfileSettingProps } from "../../models/page-props";

const initialState: ProfileSettingProps = {
    ProfileSettingUser: {
        id: "",
        first_name: "",
        last_name: "",
        email: "",
    },
    profileFetchDetailsLoading: true,
};

const mySettings = createSlice({
    name: "mySettings",
    initialState: initialState,
    reducers: {
        fetchProfileSettingDetail: (
            state,
            action: PayloadAction<ProfileSettingProps["ProfileSettingUser"]>
        ) => {
            return {
                ...state,
                ProfileSettingUser: {
                    ...action.payload,
                },
                profileFetchDetailsLoading: false,
            };
        },
        clearProfileSettingDetail: (state, action: PayloadAction) => {
            return {
                ...state,
                ProfileSettingUser: {
                    id: "",
                    first_name: "",
                    last_name: "",
                    email: "",
                },
                profileFetchDetailsLoading: true,
            };
        },
    },
});

export default mySettings;
