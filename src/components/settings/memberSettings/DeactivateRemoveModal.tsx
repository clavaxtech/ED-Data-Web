import React, { useLayoutEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { DeactivateRemoveModalProps, InviteMembersRowDataType } from "../../models/page-props";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
    DeactivateRemoveSubmitForm,
    DeactivateRemoveUsersSubmitFormData,
} from "../../models/submit-form";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import { DeactivateRemoveState } from "../../models/stateModel";
import {
    deactivateRemoveRequiredValidation,
    deactivateRemoveValidation,
} from "../../../Helper/validation";
import { actionType, removeNullOrEmptyValue } from "../../../utils/helper";
import {
    DeactivateRemoveUsers,
    membersSettingsActions,
} from "../../store/actions/members-setting-actions";
import { toast } from "react-toastify";
import { logUserAction, logout } from "../../store/actions/auth-actions";
import { SelectInput } from "../../common/SelectInput";

function DeactivateRemoveModal({
    show,
    handleClose,
    label,
    activeMemberRequired,
    userType,
    selectedUserId,
}: DeactivateRemoveModalProps) {
    const REMOVE = "Remove";
    const [state, setState] = useState<DeactivateRemoveState>({
        activeMembersOptions: [],
    });
    const { activeMembersOptions } = state;
    const {
        auth: {
            isAuthenticated,
            user: { access_token, user_id },
            userTokenLoading,
        },
        membersSettings: { inviteMembersData },
    } = useAppSelector((state) => state);

    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<DeactivateRemoveSubmitForm>({
        resolver: activeMemberRequired
            ? yupResolver(deactivateRemoveRequiredValidation)
            : yupResolver(deactivateRemoveValidation),
    });

    const onSubmit = (data: DeactivateRemoveSubmitForm) => {
        const { activeMember } = data;
        let transformData: DeactivateRemoveUsersSubmitFormData = {
            user_id: selectedUserId,
            delete_type: label === REMOVE ? "all" : "temp",
            ...(activeMember && { assigned_user: Number(activeMember) }),
        };
        removeNullOrEmptyValue(transformData);
        if (isAuthenticated && !userTokenLoading) {
            let temp_data = inviteMembersData?.find(item => item.id === selectedUserId);
            dispatch(DeactivateRemoveUsers(access_token, transformData)).then(
                (result) => {
                    const { status, msg } = result || {};
                    if (status === 200) {
                        //log user detail
                        if (label === REMOVE) {
                            dispatch(
                                logUserAction({
                                    action_type: actionType["remove_user"],
                                    action_log_detail: JSON.stringify({
                                        name: (temp_data as InviteMembersRowDataType)['name'],
                                        role: (temp_data as InviteMembersRowDataType)['signin_role'],
                                        email: (temp_data as InviteMembersRowDataType)['email']
                                    }),
                                })
                            );
                        }
                        if (user_id === selectedUserId) {
                            sessionStorage.setItem(
                                "accountRemoveOrDeactivateMsg",
                                `${msg}`
                            );
                            dispatch(logout(access_token));
                            return;
                        }
                        toast.success(msg);
                        reset();
                        dispatch(membersSettingsActions.clearInviteMembers());
                        handleClose();
                    } else {
                        toast.error(msg);
                    }
                }
            );
        }
    };

    useLayoutEffect(() => {
        if (inviteMembersData) {
            setState((prev) => ({
                ...prev,
                activeMembersOptions: inviteMembersData
                    .filter(
                        (item) => item.id !== selectedUserId && item.is_active
                    )
                    .map((item) => ({
                        label: `${item.name} (${item.email})`,
                        value: item.id,
                    })),
            }));
        }
        // eslint-disable-next-line
    }, [inviteMembersData]);
    return (
        <Modal className="activateModal" show={show} onHide={handleClose}>
            <form
                className="form-block"
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="off"
                autoCapitalize="off"
            >
                <Modal.Body>
                    {/* <h3>{`${label} ${userType}`}</h3> */}
                    <h3>{`${label} Member`}</h3>
                    <p>
                        {label === REMOVE
                            ? `Are you sure you want to remove this member? This action cannot be undone, and the member will be deleted from your account forever. All of this member’s data will be lost unless you transfer their AOIs and Segments to an active member.`
                            : `Are you sure you want to deactivate this member? This
                        member will no longer have access to the platform, but
                        you can reinstate them at any time. All of this member’s
                        data will be lost unless you transfer their AOIs and
                        Segments to an active member.`}
                    </p>
                    <div className="active-member">
                        <p>
                            Select an active member to transfer this member’s
                            AOIs &amp; Segments
                        </p>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group">
                                <div className="selectInput">
                                    {/* <i className="fa-solid fa-chevron-down"></i> */}
                                    <SelectInput
                                        placeholder="Select an active member"
                                        name="activeMember"
                                        register={register}
                                        options={activeMembersOptions}
                                        errorMsg={errors.activeMember?.message}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <div className="action-footer">
                    <button
                        type="button"
                        className="btn btn-outline"
                        onClick={handleClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={
                            label === REMOVE
                                ? "btn btn-tertiary"
                                : "btn btn-confirm"
                        }
                    >
                        {` Confirm ${label === REMOVE ? "Removal" : "Deactivation"
                            }`}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export default DeactivateRemoveModal;
