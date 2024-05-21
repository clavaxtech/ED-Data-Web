import authSlice from "../reducers/auth-slice";
import { AnyAction } from "@reduxjs/toolkit";
import { ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "../index";
import axios from "../../../utils/axios";
import utils from "../../../utils";
import Cookies from "js-cookie";

import {
    ActivateNewUserFormData,
    ActivateUserReturnType,
    ForgotPasswordReturnType,
    ForgotPasswordSubmitForm,
    LoginUserReturnType,
    RegisterUserReturnType,
    SignInSubmitForm,
    SignUpFormData,
    SubmitFormUserActionLog,
    UpdatePasswordReturnType,
    UpdatePasswordSubmitFormData,
    verifyResetPasswordTokenReturnType,
} from "../../models/submit-form";
import setAuthToken from "../../../utils/setAuthToken";
import { toast } from "react-toastify";
import {
    handleFreeTrialEndModal,
    hideSiteLoader,
    showSiteLoader,
} from "./modal-actions";
import { config, errToast, tokenIsValid } from "../../../utils/helper";
import { AxiosError } from "axios";
import { AuthModel } from "../../models/redux-models";
import CryptoJS from "crypto-js";
const { isTokenExpired, getNewAuthToken } = utils;

export const authActions = authSlice.actions;
export const fetchToken = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        let userTokenVal;
        if (localStorage.getItem("access_token")) {
            userTokenVal = localStorage.getItem("access_token");
        } else if (sessionStorage.getItem("access_token")) {
            userTokenVal = sessionStorage.getItem("access_token");
        } else {
            userTokenVal = null;
        }

        const userTokenValid = await isTokenExpired(userTokenVal);

        let refresh_token =
            localStorage.getItem("refresh_token") ||
            sessionStorage.getItem("refresh_token");
        const userRefreshTokenValid = await isTokenExpired(refresh_token);

        if (!userTokenValid && userRefreshTokenValid) {
            await getNewAuthToken();
            await dispatch(loadUser());
        } else if (userTokenValid && userRefreshTokenValid) {
            await dispatch(loadUser());
            dispatch(
                authActions.loadUserToken({
                    access_token: userTokenVal as string,
                    refresh_token: refresh_token,
                })
            );
        } else {
            dispatch(authActions.loadToken());
            dispatch(authActions.logout());
        }
    };
};

export const registerUser = (
    formData: SignUpFormData
): ThunkAction<
    Promise<RegisterUserReturnType>,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());
        try {
            const res = await axios.post(
                "/api-user/new-user",
                formData,
                config
            );
            const { msg, status } = res.data;
            if (status === 200) {
                toast.success(
                    `Your account has been created, but isn't quite ready yet! Please check your email inbox for instructions on how to confirm and activate your account`
                );
            } else toast.error(msg);
            dispatch(hideSiteLoader());
            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };
};

// Confirm -- activate user

export const activateNewUser = (
    formData: ActivateNewUserFormData
): ThunkAction<
    Promise<ActivateUserReturnType>,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());
        try {
            const res = await axios.put("/api-user/new-user", formData, config);
            dispatch(hideSiteLoader());
            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };
};

//login

export const login = (
    formData: SignInSubmitForm
): ThunkAction<Promise<LoginUserReturnType>, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());

        const rememberMe = formData?.rememberMe;
        const device_session_id = localStorage.getItem("device_session_id");

        if (device_session_id) {
            axios.defaults.headers.common["X-DEVICE-SESSION-ID"] =
                Number(device_session_id);
        }

        try {
            delete formData["rememberMe"];
            const res = await axios.post(
                "/api-user/login",
                {
                    ...formData,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                },
                config
            );
            const {
                data: { data, status },
            } = res;
            if (status === 200) {
                if (
                    "pass_change_required" in data &&
                    data.pass_change_required
                ) {
                    toast.success(`Please update your password.`);
                    dispatch(
                        handlePassChangeReq({
                            pass_change_required: true,
                            base_user_id: btoa(data.user_id),
                        })
                    );
                } else {
                    if (data) {
                        dispatch(authActions.loadUser(data));

                        const {
                            refresh_token,
                            access_token,
                            device_session_id,
                        } = data;
                        if (device_session_id) {
                            localStorage.setItem(
                                "device_session_id",
                                device_session_id
                            );
                        }
                        if (rememberMe) {
                            // removing if previous cookies before setting new
                            Cookies.get("email") && Cookies.remove("email");
                            Cookies.get("password") &&
                                Cookies.remove("password");

                            Cookies.set(
                                "email",
                                CryptoJS.AES.encrypt(
                                    `${formData.email}`,
                                    `${process.env.REACT_APP_ENCRYPT_DECRYPT_KEY}`
                                ).toString(),
                                {
                                    expires: 90,
                                }
                            );
                            Cookies.set(
                                "password",
                                CryptoJS.AES.encrypt(
                                    `${formData.password}`,
                                    `${process.env.REACT_APP_ENCRYPT_DECRYPT_KEY}`
                                ).toString(),
                                {
                                    expires: 90,
                                }
                            );
                            localStorage.setItem(
                                "access_token",
                                access_token || ""
                            );
                            localStorage.setItem(
                                "refresh_token",
                                refresh_token || ""
                            );
                        } else {
                            sessionStorage.setItem(
                                "access_token",
                                access_token || ""
                            );
                            sessionStorage.setItem(
                                "refresh_token",
                                refresh_token || ""
                            );
                        }
                    }
                }
            }
            dispatch(hideSiteLoader());
            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };
};

//forgot password
export const forgotPassword = (
    formData: ForgotPasswordSubmitForm
): ThunkAction<
    Promise<ForgotPasswordReturnType>,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());
        try {
            const res = await axios.post(
                "/api-user/forgot-password",
                { user_email: formData?.email },
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

//verifyResetPassword Link
export const verifyResetPasswordToken = (
    tkn: string
): ThunkAction<
    Promise<verifyResetPasswordTokenReturnType>,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());
        try {
            const res = await axios.get(
                `/api-user/forgot-password?token=${tkn}`,
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

//forgot password
export const updatePassword = (
    formData: UpdatePasswordSubmitFormData
): ThunkAction<
    Promise<UpdatePasswordReturnType>,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());
        try {
            const res = await axios.put(
                "/api-user/update-password",
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

export const logout = (
    token: string | null
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token as string);
        try {
            const res = await axios.get("/api-user/logout", config);
            const { data } = res;
            if (data) {
                const { status, msg } = data;
                if (status === 200) {
                    dispatch(authActions.logout());
                    window.location.reload();
                } else {
                    toast.error(msg);
                }
            }
            dispatch(hideSiteLoader());
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };
};

//loadUser password
export const loadUser = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        // dispatch(showSiteLoader());
        const {
            auth: {
                user: { access_token },
            },
        } = getState();
        let newToken = access_token;
        let refreshToken =
            localStorage.getItem("refresh_token") ||
            sessionStorage.getItem("refresh_token");
        const valid = await isTokenExpired(newToken);
        if (!valid) newToken = (await getNewAuthToken()) as string;
        try {
            setAuthToken(newToken);

            const res = await axios.get("/api-user/exchange-user", config);
            const { status, data, msg } = res.data;
            if (status === 200) {
                if (data) {
                    dispatch(
                        authActions.loadUser({
                            ...data,
                            access_token: newToken,
                            refresh_token: refreshToken,
                        })
                    );
                    if (data.company_configs.trial_expired) {
                        dispatch(handleFreeTrialEndModal(true));
                    }
                }
            } else {
                toast.error(msg);
            }
            // dispatch(hideSiteLoader());
        } catch (err) {
            errToast(err as AxiosError);
            // dispatch(hideSiteLoader());
        }
    };
};

//handle password change required
export const handlePassChangeReq = (val: {
    pass_change_required: AuthModel["pass_change_required"];
    base_user_id: AuthModel["base_user_id"];
}): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(authActions.handlePassChangeReq(val));
    };
};

export const handleSystemRelatedDetails = (
    val: AuthModel["deviceInfo"]
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(authActions.handleSystemRelatedDetails(val));
    };
};

// log user action
export const logUserAction = (
    formData: SubmitFormUserActionLog
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        const {
            auth: {
                deviceInfo,
                user: { access_token },
            },
        } = getState();

        await tokenIsValid(access_token as string);

        const tempData = {
            action_type: formData.action_type,
            remote_addr: deviceInfo.ipAddress,
            device_type: deviceInfo.deviceType,
            user_agent: deviceInfo.userAgent,
            device_os: deviceInfo.operatingSystem,
            action_log_detail: formData.action_log_detail || "-",
        };

        axios
            .post("/api-user/log-user-action", tempData, config)
            .then((res) => {
                const { status, msg } = res.data;
                if (status === 200) {
                } else {
                    status !== 200 && toast.error(msg);
                }
            })
            .catch((err) => {
                errToast(err as AxiosError);
                dispatch(hideSiteLoader());
            });
    };
};
