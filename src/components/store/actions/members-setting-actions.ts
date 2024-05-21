import { ThunkAction } from "redux-thunk";
import { RootState } from "..";
import { AnyAction } from "redux";
import membersSettingsSlice from "../reducers/members-setting-slice";
import { hideSiteLoader, showSiteLoader } from "./modal-actions";
import axios from "../../../utils/axios";
import {
    ActivateOrRemoveUsersReturnType,
    ActivateOrRoleChangedUsersSubmitFormData,
    DeactivateRemoveUsersReturnType,
    DeactivateRemoveUsersSubmitFormData,
    InvitMembersReturnType,
    InviteMemberSubmitData,
    ReturnMsgAndStatus,
    SetPasswordReturnType,
    SetPasswordSubmitFormData,
    verifyInviteMembersTokenReturnType,
} from "../../models/submit-form";
import { toast } from "react-toastify";
import {
    actionType,
    config,
    errToast,
    tokenIsValid,
} from "../../../utils/helper";
import { AxiosError } from "axios";
import { logUserAction } from "./auth-actions";
export const membersSettingsActions = membersSettingsSlice.actions;

export const inviteMembers = (
    token: string,
    formData: InviteMemberSubmitData
): ThunkAction<
    Promise<InvitMembersReturnType>,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token);
        try {
            const res = await axios.post(
                "/api-user/invite-user",
                formData,
                config
            );
            const { status } = res.data;
            if (status === 200) {
                //log user detail
                dispatch(
                    logUserAction({
                        action_type: actionType["invite_member"],
                        action_log_detail: JSON.stringify(formData),
                    })
                );
            }
            dispatch(hideSiteLoader());
            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };
};

//verifyInviteMemberTkn Link
export const verifyInviteMemberToken = (
    tkn: string
): ThunkAction<
    Promise<verifyInviteMembersTokenReturnType>,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());

        try {
            const res = await axios.get(
                `/api-user/verify-invite?token=${tkn}`,
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

//set password for Invite user
export const setPasswordInviteUser = (
    formData: SetPasswordSubmitFormData
): ThunkAction<
    Promise<SetPasswordReturnType>,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());

        try {
            const res = await axios.post(
                "/api-user/verify-invite",
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

//Invite member List
export const loadInviteMembers = (
    token: string,
    formData?: { keyword: string }
): ThunkAction<void, RootState, unknown, AnyAction> => {
    const { keyword } = formData || {};
    return async (dispatch, getState) => {
        !keyword && dispatch(showSiteLoader());
        await tokenIsValid(token);
        try {
            const res = await axios.get(
                keyword
                    ? `/api-user/sub-user?search=${keyword}`
                    : "/api-user/sub-user",
                config
            );
            const { status, msg, data, result_count, active_user_count } =
                res.data;
            if (status === 200) {
                if (data) {
                    dispatch(
                        membersSettingsActions.loadInviteMembers({
                            data: data,
                            result_count,
                            active_user_count,
                        })
                    );
                }
            } else {
                toast.error(msg);
            }

            !keyword && dispatch(hideSiteLoader());
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };
};

//Deactivate Remove Users
export const DeactivateRemoveUsers = (
    token: string,
    formData: DeactivateRemoveUsersSubmitFormData
): ThunkAction<
    Promise<DeactivateRemoveUsersReturnType>,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token);
        try {
            const config = {
                data: formData,
                headers: { "Content-Type": "application/json" },
            };
            const res = await axios.delete("/api-user/sub-user", config);

            dispatch(hideSiteLoader());
            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };
};

//Deactivate Remove Users
export const activateOrRoleChangeUsers = (
    token: string,
    formData: ActivateOrRoleChangedUsersSubmitFormData
): ThunkAction<
    Promise<ActivateOrRemoveUsersReturnType>,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token);

        try {
            const res = await axios.put("/api-user/sub-user", formData, config);

            dispatch(hideSiteLoader());
            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };
};

//Request for more seat
export const requestMoreSeat = (
    token: string,
    msgString: string
): ThunkAction<Promise<ReturnMsgAndStatus>, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token);

        try {
            const response = await axios.post(
                "/api-alert/slack-post",
                {
                    text: msgString,
                },
                config
            );
            const { status, msg } = response.data;
            if (status === 200) {
                toast.info(
                    "Your request for additional seats has been received. Our team will reach reach out to you shortly to assist with your expansion needs."
                );
            } else {
                toast.error(msg);
            }
            console.log(
                `Successfully send message ${response} in conversation ${process.env.REACT_APP_SLACK_CHANNEL_ID}`
            );
            dispatch(hideSiteLoader());
            return response.data;
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };
};
