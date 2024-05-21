import React from "react";
import { InviteMembersRowDataType } from "../../models/page-props";
import { Link } from "react-router-dom";
import moment from "moment";
import {
    ADMIN,
    ADMIN_CONSTANT,
    MEMBERS,
    MEMBER_CONSTANT,
} from "../../../utils/helper";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import { activateOrRoleChangeUsers } from "../../store/actions/members-setting-actions";
import { toast } from "react-toastify";
import { membersSettingsActions } from "../../store/actions/members-setting-actions";

function useColInviteMembers(
    signin_as: number,
    user_id: number,
    showModal: (label: string, userType: string, selectedUserId: number) => void
) {
    const {
        auth: {
            user: { access_token },
        },
        membersSettings: { inviteMembersData },
    } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();
    return [
        {
            title: "Name",
            render: (rowData: InviteMembersRowDataType) => {
                return (
                    <div className="profile">
                        <figure>
                            <img
                                src={
                                    rowData.profile_pic
                                        ? `${process.env.REACT_APP_ED_DATA_CDN_API}/profile_pic/${rowData.profile_pic}`
                                        : "images/profile-pic.png"
                                }
                                alt="profile-pic"
                            />
                        </figure>
                        <figcaption>{rowData.name}</figcaption>
                    </div>
                );
            },
        },
        {
            title: "Email",
            render: (rowData: InviteMembersRowDataType) => {
                return (
                    <Link
                        to={`mailto:${rowData.email}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {rowData.email}
                    </Link>
                );
            },
        },
        {
            title: "Created",
            render: (rowData: InviteMembersRowDataType) => {
                return (
                    <span>
                        {rowData.date_joined
                            ? moment(rowData.date_joined).format("MMM-DD-YYYY")
                            : "NA"}
                    </span>
                );
            },
        },
        {
            title: "Last Login",
            render: (rowData: InviteMembersRowDataType) => {
                return (
                    <span>
                        {rowData.last_login
                            ? moment(rowData.last_login).format("MMM-DD-YYYY")
                            : "NA"}
                    </span>
                );
            },
        },
        {
            title: "Access Level",
            render: (rowData: InviteMembersRowDataType) => {
                return (
                    <div className="droplink">
                        {rowData.signin_role} &nbsp;
                        <i className="fa-solid fa-angle-down"></i>
                        <div className="dropdown">
                            {(rowData.signin_role === ADMIN_CONSTANT ||
                                (signin_as === ADMIN && rowData.is_active)) && (
                                <>
                                    <h2
                                        className={
                                            rowData.signin_role ===
                                            ADMIN_CONSTANT
                                                ? ""
                                                : "cursor"
                                        }
                                        onClick={() => {
                                            if (
                                                rowData.signin_role !==
                                                ADMIN_CONSTANT
                                            ) {
                                                dispatch(
                                                    activateOrRoleChangeUsers(
                                                        access_token,
                                                        {
                                                            user_id: rowData.id,
                                                            role_id:
                                                                Number(ADMIN),
                                                            type: "role",
                                                        }
                                                    )
                                                ).then((result) => {
                                                    const { msg, status } =
                                                        result || {};
                                                    if (status === 200) {
                                                        toast.success(msg);
                                                        dispatch(
                                                            membersSettingsActions.clearInviteMembers()
                                                        );
                                                    } else {
                                                        toast.error(msg);
                                                    }
                                                });
                                            }
                                        }}
                                    >
                                        Admin
                                    </h2>
                                    <p
                                        className={
                                            rowData.signin_role ===
                                            ADMIN_CONSTANT
                                                ? "mb-4 tick"
                                                : "mb-4"
                                        }
                                    >
                                        Full account access, including billing,
                                        plan information, and member management.{" "}
                                        {rowData.signin_role ===
                                            ADMIN_CONSTANT && (
                                            <i className="fa-solid fa-check"></i>
                                        )}
                                    </p>
                                </>
                            )}
                            {(rowData.signin_role === MEMBER_CONSTANT ||
                                (signin_as === ADMIN && rowData.is_active)) && (
                                <>
                                    <h2
                                        className={
                                            rowData.signin_role ===
                                            MEMBER_CONSTANT
                                                ? ""
                                                : "cursor"
                                        }
                                        onClick={() => {
                                            if (
                                                rowData.signin_role ===
                                                    ADMIN_CONSTANT &&
                                                Array.isArray(
                                                    inviteMembersData
                                                ) &&
                                                inviteMembersData.filter(
                                                    (item) =>
                                                        item.signin_role ===
                                                        ADMIN_CONSTANT
                                                ).length === 1
                                            ) {
                                                toast.info(
                                                    `Please assign the admin role to another member before changing your role from admin to member.`
                                                );
                                                return;
                                            }
                                            if (
                                                rowData.signin_role !==
                                                MEMBER_CONSTANT
                                            ) {
                                                dispatch(
                                                    activateOrRoleChangeUsers(
                                                        access_token,
                                                        {
                                                            user_id: rowData.id,
                                                            type: "role",
                                                            role_id:
                                                                Number(MEMBERS),
                                                        }
                                                    )
                                                ).then((result) => {
                                                    const { msg, status } =
                                                        result || {};
                                                    if (status === 200) {
                                                        toast.success(msg);
                                                        dispatch(
                                                            membersSettingsActions.clearInviteMembers()
                                                        );
                                                    } else {
                                                        toast.error(msg);
                                                    }
                                                });
                                            }
                                        }}
                                    >
                                        Member
                                    </h2>
                                    <p
                                        className={
                                            rowData.signin_role ===
                                            MEMBER_CONSTANT
                                                ? "mb-4 tick"
                                                : "mb-4"
                                        }
                                    >
                                        Full access to Energy Domain Data. No
                                        access to billing, plan information, or
                                        team management.
                                        {rowData.signin_role ===
                                            MEMBER_CONSTANT && (
                                            <i className="fa-solid fa-check"></i>
                                        )}
                                    </p>
                                </>
                            )}
                            <div
                                className={
                                    signin_as === ADMIN ||
                                    user_id === rowData.id
                                        ? ""
                                        : "d-none"
                                }
                            >
                                <h2
                                    className="deactivate-member"
                                    onClick={() => {
                                        if (
                                            rowData.signin_role ===
                                                ADMIN_CONSTANT &&
                                            rowData.is_active &&
                                            Array.isArray(inviteMembersData) &&
                                            inviteMembersData.filter(
                                                (item) =>
                                                    item.signin_role ===
                                                        ADMIN_CONSTANT &&
                                                    item.is_active
                                            ).length === 1
                                        ) {
                                            toast.info(
                                                `Please assign the admin role to another member before deactivating your account.`
                                            );
                                            return;
                                        }
                                        if (rowData.is_active) {
                                            showModal(
                                                "Deactivate",
                                                rowData.signin_role ===
                                                    ADMIN_CONSTANT
                                                    ? ADMIN_CONSTANT
                                                    : MEMBER_CONSTANT,
                                                rowData.id
                                            );
                                        } else {
                                            dispatch(
                                                activateOrRoleChangeUsers(
                                                    access_token,
                                                    {
                                                        user_id: rowData.id,
                                                        type: "status",
                                                    }
                                                )
                                            ).then((result) => {
                                                const { msg, status } =
                                                    result || {};
                                                if (status === 200) {
                                                    toast.success(msg);
                                                    dispatch(
                                                        membersSettingsActions.clearInviteMembers()
                                                    );
                                                } else {
                                                    toast.error(msg);
                                                }
                                            });
                                        }
                                    }}
                                >
                                    <span>
                                        {!rowData.is_active
                                            ? "Activate"
                                            : "Deactivate"}{" "}
                                        {`${
                                            rowData.signin_role ===
                                            ADMIN_CONSTANT
                                                ? ADMIN_CONSTANT
                                                : MEMBER_CONSTANT
                                        }`}
                                    </span>
                                </h2>
                                <p>
                                    {!rowData.is_active
                                        ? "Member will be approved for access and will count against the number of seats approved for your account."
                                        : `Deactivated members do not count towards
                                        you seat limit and can be reinstated
                                        when needed. You will have the option to
                                        transfer AOIs and Segments saved in this
                                        account.`}
                                </p>
                                <div className={!rowData.is_active?"d-none":''}>
                                    <h2
                                        className="remove-member"
                                        onClick={() => {
                                            if (
                                                rowData.signin_role ===
                                                    ADMIN_CONSTANT &&
                                                rowData.is_active &&
                                                Array.isArray(
                                                    inviteMembersData
                                                ) &&
                                                inviteMembersData.filter(
                                                    (item) =>
                                                        item.signin_role ===
                                                            ADMIN_CONSTANT &&
                                                        item.is_active
                                                ).length === 1
                                            ) {
                                                toast.info(
                                                    `Please assign the admin role to another member before removing your account.`
                                                );
                                                return;
                                            }
                                            showModal(
                                                "Remove",
                                                rowData.signin_role ===
                                                    ADMIN_CONSTANT
                                                    ? ADMIN_CONSTANT
                                                    : MEMBER_CONSTANT,
                                                rowData.id
                                            );
                                        }}
                                    >
                                        Remove{" "}
                                        {`${
                                            rowData.signin_role ===
                                            ADMIN_CONSTANT
                                                ? ADMIN_CONSTANT
                                                : MEMBER_CONSTANT
                                        }`}
                                    </h2>
                                    <p>
                                        Member will be removed from your account
                                        forever. You will have the option to
                                        transfer AOIs and Segments saved in this
                                        account.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            },
        },
    ];
}

export default useColInviteMembers;
