import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { NotificationSettingsInitialValue } from "../../models/redux-models";

const initialState: NotificationSettingsInitialValue = {
    notificationOptions: null,
    notificationDetails: null,
    notificationDetailsLoading: true,
};

const notificationSettings = createSlice({
    name: "notificationSettings",
    initialState: initialState,
    reducers: {
        fetchNotificationOptions: (
            state,
            action: PayloadAction<
                NotificationSettingsInitialValue["notificationOptions"]
            >
        ) => {
            return {
                ...state,
                notificationOptions: action.payload,
            };
        },
        saveNotificationDetails: (
            state,
            action: PayloadAction<
                NotificationSettingsInitialValue["notificationDetails"]
            >
        ) => {
            return {
                ...state,
                notificationDetailsLoading: false,
                notificationDetails: action.payload,
            };
        },
        clearNotificationDetails: (state, action: PayloadAction) => {
            return {
                ...state,
                notificationDetails: null,
                notificationDetailsLoading: true,
            };
        },
    },
});

export default notificationSettings;
