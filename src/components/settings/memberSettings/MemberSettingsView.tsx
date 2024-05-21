import React from "react";
import withSideNav from "../../HOC/withSideNav";
import {
    GlobalTableProps,
    MemberSettingsViewProps,
} from "../../models/page-props";
import { useEffect, useState } from "react";
import InviteMemberCom from "./InviteMemberCom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import { loadInviteMembers } from "../../store/actions/members-setting-actions";
import GlobalTable from "../../common/GlobalTable";
import RequestUserModal from "../../common/Modal/RequestUserModal";
import useColInviteMembers from "./UseColInviteMembers";
import { debounce } from "lodash";
import { membersSettingsActions } from "../../store/actions/members-setting-actions";
import { toast } from "react-toastify";
import { ADMIN, ADMIN_CONSTANT } from "../../../utils/helper";
import DeactivateRemoveModal from "./DeactivateRemoveModal";
import Scrollbars from "react-custom-scrollbars";

const MemberSettingsView = (props: MemberSettingsViewProps) => {
    const dispatch = useAppDispatch();
    const [state, setState] = useState({
        inviteMember: false,
        deactivateRemoveModal: false,
        label: "",
        activeMemberRequired: false,
        userType: "",
        selectedUserId: 0,
        show: false
    });

    const {
        auth: {
            isAuthenticated,
            user: {
                company_data: { allowed_sub_user, company_id },
                access_token,
                signin_as,
                user_id,
            },
            userTokenLoading,
        },
        membersSettings: {
            inviteMemberDataLoading,
            inviteMembersData,
            active_user_count,
        },
    } = useAppSelector((state) => state);

    const {
        inviteMember,
        deactivateRemoveModal,
        label,
        activeMemberRequired,
        userType,
        selectedUserId,
        show
    } = state;

    const onSearchChange = debounce(() => {
        dispatch(membersSettingsActions.clearInviteMembers());
    }, 500);

    const inviteMemberCancelBtnClick = () => {
        setState((prev) => ({ ...prev, inviteMember: false }));
    };
    const searchRef = React.useRef<HTMLInputElement>(null);
    const onSearchEnterKeyPress = (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === "Enter") {
            dispatch(membersSettingsActions.clearInviteMembers());
        }
    };
    useEffect(() => {
        if (inviteMemberDataLoading && isAuthenticated && !userTokenLoading) {
            dispatch(
                loadInviteMembers(access_token, {
                    keyword: searchRef?.current?.value || "",
                })
            );
        }
        // eslint-disable-next-line
    }, [inviteMemberDataLoading, isAuthenticated, userTokenLoading]);

    // showModal
    const showModal = (
        label: string,
        userType: string,
        selectedUserId: number
    ) => {
        setState((prev) => ({
            ...prev,
            deactivateRemoveModal: true,
            label,
            ...(userType === ADMIN_CONSTANT &&
                Array.isArray(inviteMembersData) &&
                inviteMembersData.filter(
                    (item) => item.signin_role === ADMIN_CONSTANT
                ).length === 1 && {
                activeMemberRequired: true,
            }),
            userType,
            selectedUserId,
        }));
    };

    // Handleclose Modal
    const handleClose = () => {
        setState((prev) => ({
            ...prev,
            deactivateRemoveModal: false,
            label: "",
            activeMemberRequired: false,
            userType: "",
            selectedUserId: 0,
        }));
    };

    const handleCloseRequestModal = () => {
        setState((prev) => ({ ...prev, show: false }));
    }

    return (
        <div className="settingsWrapper memberSetting">
            <Scrollbars
                className='settingsWrapper-scroll'
                autoHeightMin={0}
                renderThumbVertical={props => < div {...props} className="thumb-vertical" />}
                renderTrackVertical={props => < div {...props} className="track-vertical" />}
            >
                <div className="settingWrapperInner">
                    <div className="item">
                        <h3>Member Settings</h3>
                        <p>Invite new team members and manage member roles</p>
                        {inviteMember && (
                            <InviteMemberCom
                                inviteMemberCancelBtnClick={inviteMemberCancelBtnClick}
                                allowed_sub_user={allowed_sub_user}
                            />
                        )}
                        <div className="table-header">
                            <div className="search-form">
                                <input
                                    ref={searchRef}
                                    type="search"
                                    className="form-control"
                                    placeholder="Search by name or email"
                                    onChange={onSearchChange}
                                    onKeyDown={onSearchEnterKeyPress}
                                />
                            </div>
                            {signin_as === ADMIN && (
                                <button
                                    type="button"
                                    className={
                                        inviteMember
                                            ? "btn btn-disabled"
                                            : "btn btn-primary"
                                    }
                                    onClick={() => {
                                        if (company_id === null) {
                                            toast.info(
                                                `Please add Company details before proceeding to Invite Users.`
                                            );
                                            return;
                                        }
                                        // Note:- subtracting 1 from active_user_count because it contain admin count also
                                        if (
                                            Number(allowed_sub_user) ===
                                            Number(active_user_count) - 1
                                        ) {
                                            toast.info(
                                                <>
                                                    If you need more than three paid seats please contact Energy Domain sales at <a
                                                        href={`mailto:datasales@ed.com`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{ color: "#fff" }}
                                                    >
                                                        datasales@ed.com
                                                    </a>
                                                </>
                                            );
                                            return;
                                        }
                                        setState((prev) => ({
                                            ...prev,
                                            inviteMember: true,
                                        }));
                                    }}
                                >
                                    <i className="fa-solid fa-user-plus"></i> Invite
                                    members
                                </button>
                            )}
                        </div>
                        <div className="tabelheader">
                            <div className="paid-seats">
                                You are using <strong>{active_user_count}</strong> of{" "}
                                <strong>
                                    {Number(allowed_sub_user) + (company_id ? 1 : 0)}
                                </strong>{" "}
                                paid seats
                            </div>
                            <div className="requestmoreseat" onClick={() => {
                                if (company_id === null) {
                                    toast.info(
                                        `Please add Company details before request more seats.`
                                    );
                                    return;
                                }
                                setState((prev) => ({ ...prev, show: true }))
                            }}>Request more seats</div>
                        </div>
                        <div className="seatsTable">
                            <GlobalTable
                                tableStyle={{
                                    border: 0,
                                    cellPadding: 0,
                                    cellSpacing: 0,
                                }}
                                cols={
                                    useColInviteMembers(
                                        signin_as as number,
                                        user_id as number,
                                        showModal
                                    ) as GlobalTableProps["cols"]
                                }
                                data={
                                    inviteMembersData && inviteMembersData.length !== 0
                                        ? [
                                            ...inviteMembersData.filter(
                                                (item) => item.is_active === true
                                            ),
                                        ]
                                        : []
                                }
                            />
                            {deactivateRemoveModal && (
                                <DeactivateRemoveModal
                                    show={deactivateRemoveModal}
                                    handleClose={handleClose}
                                    label={label}
                                    activeMemberRequired={activeMemberRequired}
                                    userType={userType}
                                    selectedUserId={selectedUserId}
                                />
                            )}
                        </div>
                    </div>
                    <div
                        className={`${Array.isArray(inviteMembersData) &&
                            inviteMembersData.filter((item) => item.is_active === false)
                                .length === 0
                            ? "d-none"
                            : "item minheight"
                            }`}
                    >
                        <h3>Deactivated Members</h3>
                        <p className="mb-4">Members that have been deactivated</p>
                        <div className="seatsTable">
                            <GlobalTable
                                tableStyle={{
                                    border: 0,
                                    cellPadding: 0,
                                    cellSpacing: 0,
                                }}
                                cols={
                                    useColInviteMembers(
                                        signin_as as number,
                                        user_id as number,
                                        showModal
                                    ) as GlobalTableProps["cols"]
                                }
                                data={
                                    inviteMembersData && inviteMembersData.length !== 0
                                        ? [
                                            ...inviteMembersData.filter(
                                                (item) => item.is_active === false
                                            ),
                                        ]
                                        : []
                                }
                            />
                        </div>
                    </div>
                </div>
            </Scrollbars>
            <RequestUserModal show={show} handleClose={handleCloseRequestModal} />
        </div>
    );
};

export default withSideNav(MemberSettingsView);
