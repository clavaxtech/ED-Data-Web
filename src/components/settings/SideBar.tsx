import React from "react";
import { actionType, companySettingAdminMembersOption } from "../../utils/helper";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { SideBarProps } from "../models/page-props";
import Scrollbars from "react-custom-scrollbars";
import { logUserAction } from "../store/actions/auth-actions";

function SideBar({ toggleSettingDropDown, isOpen }: SideBarProps) {
    const navigate = useNavigate();
    const {
        auth: {
            user: { first_name, last_name, company_data, signin_as },
        },
    } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();
    const { company_name } = company_data || {};
    return (
        <>
            {/* Start Settings Sidebar  */}
            <div
                className="settingSidebar"
                onClick={() => {
                    isOpen && toggleSettingDropDown && toggleSettingDropDown();
                }}
            >
                <div className="back-header">
                    <a
                        href="void:(0)"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate(-1);
                        }}
                    >
                        <i className="fa-solid fa-arrow-left"></i>{" "}
                        <span>Back</span>
                    </a>
                </div>
                <div className="setting-inner">
                    <Scrollbars
                        className='settinginner-scroll'
                        autoHeightMin={0}
                        autoHeight={false}
                        autoHeightMax={"100%"}
                        renderThumbVertical={props => < div {...props} className="thumb-vertical" />}
                        renderTrackVertical={props => < div {...props} className="track-vertical" />}
                    >
                        <div className="setting-inner-scroll">
                            <div className="heading">Settings</div>
                            {company_name && (
                                <div className="companyName">{company_name}</div>
                            )}
                            <div className="sidebarNavs">
                                <ul>
                                    {companySettingAdminMembersOption.map(
                                        (item, index) => {
                                            return (
                                                item.signin_as === signin_as && (
                                                    <li key={index} onClick={() => {
                                                        if (item.label === "Settings") {
                                                            dispatch(
                                                                logUserAction({
                                                                    action_type: actionType["view_settings"],
                                                                    action_log_detail: "visited Settings page.",
                                                                })
                                                            );
                                                        }
                                                    }}>
                                                        <NavLink
                                                            to={item.pathname}
                                                            className={({
                                                                isActive,
                                                                isPending,
                                                            }) =>
                                                                isActive ? "active" : ""
                                                            }
                                                        >
                                                            {item.label}
                                                        </NavLink>
                                                    </li>
                                                )
                                            );
                                        }
                                    )}
                                </ul>
                            </div>
                            <div className="line">&nbsp;</div>
                            <div className="companyName">{`${first_name} ${last_name}`}</div>
                            <div className="sidebarNavs">
                                <ul>
                                    <li>
                                        <NavLink
                                            to={"/my-settings"}
                                            className={({ isActive, isPending }) =>
                                                isActive ? "active" : ""
                                            }
                                        >
                                            My Settings
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to={"/notification-settings"}
                                            className={({ isActive, isPending }) =>
                                                isActive ? "active" : ""
                                            }
                                        >
                                            Notifications
                                        </NavLink>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </Scrollbars>
                </div>
            </div>
        </>
    );
}

export default SideBar;
