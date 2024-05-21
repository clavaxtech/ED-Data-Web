import React from "react";
import { AvatarProps } from "../models/page-props";
import { useAppSelector } from "../hooks/redux-hooks";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { actionType, companySettingAdminMembersOption } from "../../utils/helper";
import { logUserAction, logout } from "../store/actions/auth-actions";
import { showCheckOutModal } from "../store/actions/modal-actions";
import { toast } from "react-toastify";

function AvatarComponent({
    dispatch,
    isOpen,
    toggleSettingDropDown,
    hideLogo,
}: AvatarProps) {
    const {
        auth: {
            user: {
                first_name,
                last_name,
                company_data,
                signin_as,
                profile_pic,
                access_token,
                company_configs: { trial_expired }
            },
        },
        cartSelectBasinCounty: {
            cartListItems,
        }
    } = useAppSelector((state) => state);
    const { company_logo, company_name } = company_data || {};
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <>
            {!hideLogo && (
                <a
                    className="profile-link"
                    onClick={(e) => {
                        e.preventDefault();
                        toggleSettingDropDown();
                    }}
                    href="void:(0)"
                >
                    <div className="profile-icon">
                        <img
                            src={
                                company_logo
                                    ? `${process.env.REACT_APP_ED_DATA_CDN_API}/company_logo/${company_logo}`
                                    : "images/profile-icon.svg"
                            }
                            alt="company_logo"
                        />
                    </div>
                    <div className="profile-pic">
                        <img
                            src={
                                profile_pic
                                    ? `${process.env.REACT_APP_ED_DATA_CDN_API}/profile_pic/${profile_pic}`
                                    : "images/profile-pic.png"
                            }
                            alt="profile-pic"
                        />
                    </div>
                </a>
            )}
            <div
                className={
                    isOpen ? "profile-drop-down open" : "profile-drop-down"
                }
            >
                <div className="profilenav">
                    <div className="profile-left">
                        <div className="company-profile">
                            <figure>
                                {company_logo ? (
                                    <div className="profile-icon">
                                        <img
                                            src={
                                                company_logo
                                                    ? `${process.env.REACT_APP_ED_DATA_CDN_API}/company_logo/${company_logo}`
                                                    : "images/profile-icon.svg"
                                            }
                                            alt="company_logo"
                                        />
                                    </div>
                                ) : company_name ? (
                                    company_name.split(" ").length === 1 ? (
                                        `${company_name
                                            ?.slice(0, 1)
                                            ?.toUpperCase()}`
                                    ) : (
                                        `${company_name
                                            ?.split(" ")[0]
                                            ?.slice(0, 1)
                                            ?.toUpperCase()}${company_name
                                                ?.split(" ")[1]
                                                ?.slice(0, 1)
                                                ?.toUpperCase()}`
                                    )
                                ) : (
                                    "CO"
                                )}
                            </figure>
                            {company_name ? `${company_name}` : "Company"}
                        </div>
                        <ul className="settings-nav">
                            {companySettingAdminMembersOption.map(
                                (item, index) => {
                                    return (
                                        signin_as === item.signin_as && (
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
                                                <Link onClick={(e) => {
                                                    if (trial_expired) {
                                                        e.preventDefault()

                                                        cartListItems.length && dispatch(showCheckOutModal());
                                                        toast.info("Please subscribe to plan.")
                                                    }
                                                }} to={trial_expired ? "" : item.pathname}>
                                                    {item.label}
                                                </Link>
                                            </li>
                                        )
                                    );
                                }
                            )}
                        </ul>
                    </div>
                    <div className="profile-right">
                        <div className="user-profile">
                            <figure>
                                <img
                                    src={
                                        profile_pic
                                            ? `${process.env.REACT_APP_ED_DATA_CDN_API}/profile_pic/${profile_pic}`
                                            : "images/profile-pic.png"
                                    }
                                    alt="profile-pic"
                                />
                            </figure>
                            {`${first_name} ${last_name}`}
                        </div>
                        <ul className="settings-nav">
                            <li>
                                <Link onClick={(e) => {
                                    if (trial_expired) {
                                        e.preventDefault()
                                        cartListItems.length && dispatch(showCheckOutModal());
                                        toast.info("Please subscribe to plan.")
                                    }
                                }} to={trial_expired ? "" : "/my-settings"}>My settings</Link>
                            </li>
                            <li>
                                <Link onClick={(e) => {
                                    if (trial_expired) {
                                        e.preventDefault()
                                        cartListItems.length && dispatch(showCheckOutModal());
                                        toast.info("Please subscribe to plan.")
                                    }
                                }} to={trial_expired ? "" : "/notification-settings"}>
                                    Notification
                                </Link>
                            </li>
                        </ul>
                        <ul className="settings-nav logout" onClick={() => {
                            navigate(location.pathname);
                        }}>
                            <li>
                                <a
                                    href="void:(0)"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        dispatch(logout(access_token));
                                    }}
                                >
                                    Log out{" "}
                                    <i className="fa-solid fa-right-from-bracket"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AvatarComponent;
