import { ThunkAction } from "redux-thunk";
import { RootState } from "..";
import { AnyAction } from "redux";
import notificationSettingsSlice from "../reducers/notification-settings-slice";
import { hideSiteLoader, showSiteLoader } from "./modal-actions";
import axios from "../../../utils/axios";
import { toast } from "react-toastify";
import {
    NotificationSubmitFormDataReturnType,
    saveNotificationOptionsFormData,
} from "../../models/submit-form";
import { config, errToast, tokenIsValid } from "../../../utils/helper";
import { AxiosError } from "axios";

export const notificationSettingsActions = notificationSettingsSlice.actions;

// fetchNotificationOptions
export const fetchNotificationSettingsOption =
    (token: string): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token);
        try {
            let response = await axios.get("/api-setting/event-list", config);
            let { data, status, msg } = response.data;
            if (status === 200) {
                if (data) {
                    dispatch(
                        notificationSettingsActions.fetchNotificationOptions(
                            data
                        )
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

// saveNotificationOptions
export const saveNotificationSettingsOption =
    (
        token: string,
        formData: saveNotificationOptionsFormData["data"]
    ): ThunkAction<
        Promise<NotificationSubmitFormDataReturnType>,
        RootState,
        unknown,
        AnyAction
    > =>
    async (dispatch) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token);
        try {
            let response = await axios.post(
                "/api-user/notification-setting",
                formData,
                config
            );
            dispatch(hideSiteLoader());
            return response.data;
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };

// fetchNotificationDetails
export const fetchNotificationSettingsDetails =
    (token: string): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        dispatch(showSiteLoader());
        try {
            let response = await axios.get(
                "/api-user/notification-setting",
                config
            );
            let { data, status, msg } = response.data;
            if (status === 200) {
                dispatch(
                    notificationSettingsActions.saveNotificationDetails(
                        data ? data : null
                    )
                );
            } else {
                toast.error(msg);
            }
            dispatch(hideSiteLoader());
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };
