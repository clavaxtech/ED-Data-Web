import {
    AuthModel,
    LoadUserTokenAction,
    User,
} from "../../models/redux-models";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthModel = {
    isAuthenticated: null,
    userLoading: true,
    user: {
        user_id: null,
        first_name: "",
        last_name: "",
        is_admin: false,
        access_token: "",
        refresh_token: "",
        signin_as: null,
        profile_pic: null,
        phone_no: "",
        trial_remaining_days: null,
        counties_price_below_of_basin: 0,
        company_data: {
            allowed_sub_user: null,
            company_logo: "",
            company_name: "",
            company_id: null,
            billing_email: "",
        },
        device_session_id: null,
        company_configs: {
            download_enabled: false,
            free_trial_period_enabled: false,
            no_of_free_days_allowed: 0,
            is_trial_never_end: false,
            paid_expired: false,
            trial_expired: false,
        },
    },
    userTokenLoading: true,
    pass_change_required: true,
    base_user_id: "",
    deviceInfo: {
        ipAddress: null,
        deviceType: null,
        userAgent: null,
        operatingSystem: null,
    },
};

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        loadToken(state, action: PayloadAction) {
            return {
                ...state,
                isAuthenticated: false,
            };
        },
        loadUserToken(state, action: PayloadAction<LoadUserTokenAction>) {
            const { access_token, refresh_token } = action.payload;
            if (localStorage.getItem("refresh_token")) {
                localStorage.setItem("access_token", access_token || "");
                localStorage.setItem("refresh_token", refresh_token || "");
            } else {
                sessionStorage.setItem("access_token", access_token || "");
                sessionStorage.setItem("refresh_token", refresh_token || "");
            }

            return {
                ...state,
                isAuthenticated: true,
                user: {
                    ...state.user,
                    access_token,
                    refresh_token: refresh_token as string,
                },
                userTokenLoading: false,
            };
        },
        loadUser(state, action: PayloadAction<User>) {
            return {
                ...state,
                isAuthenticated: true,
                userLoading: false,
                user: {
                    ...state.user,
                    ...action.payload,
                    ...("trial_remaining_days" in action.payload && {
                        trial_remaining_days:
                            action.payload.trial_remaining_days,
                    }),
                    ...(action.payload.company_configs
                        .free_trial_period_enabled &&
                        !("trial_remaining_days" in action.payload) && {
                            trial_remaining_days:
                                action.payload.company_configs
                                    .no_of_free_days_allowed,
                        }),
                },
                userTokenLoading: false,
            };
        },
        logout(state, action: PayloadAction) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            sessionStorage.removeItem("access_token");
            sessionStorage.removeItem("refresh_token");
            // sessionStorage.removeItem("maxValue");
            sessionStorage.removeItem("doNotShowShapeFileInfoModal");
            sessionStorage.removeItem("oilMaxMsg");
            sessionStorage.removeItem("gasMaxMsg");
            return {
                ...state,
                isAuthenticated: false,
                userLoading: true,
                user: {
                    user_id: null,
                    first_name: "",
                    last_name: "",
                    is_admin: false,
                    access_token: "",
                    refresh_token: "",
                    signin_as: null,
                    profile_pic: null,
                    device_session_id: null,
                    phone_no: "",
                    ...(state.user.trial_remaining_days && {
                        trial_remaining_days: null,
                    }),
                    counties_price_below_of_basin: 0,
                    company_data: {
                        allowed_sub_user: null,
                        company_logo: "",
                        company_name: "",
                        company_id: null,
                        billing_email: "",
                    },
                    company_configs: {
                        download_enabled: false,
                        free_trial_period_enabled: false,
                        no_of_free_days_allowed: 0,
                        is_trial_never_end: false,
                        paid_expired: false,
                        trial_expired: false,
                    },
                },
                userTokenLoading: true,
            };
        },
        handlePassChangeReq(
            state,
            action: PayloadAction<{
                pass_change_required: AuthModel["pass_change_required"];
                base_user_id: AuthModel["base_user_id"];
            }>
        ) {
            return {
                ...state,
                pass_change_required: action.payload.pass_change_required,
                base_user_id: action.payload.base_user_id,
            };
        },
        handleSystemRelatedDetails(
            state,
            action: PayloadAction<AuthModel["deviceInfo"]>
        ) {
            return {
                ...state,
                deviceInfo: action.payload,
            };
        },
    },
});

export default authSlice;
