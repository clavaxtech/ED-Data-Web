import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { sideNavProps } from "../models/page-props";
import { cartSelectBasin, navBarMenu } from "../../utils/helper";
import { NavLink } from "react-router-dom";
import SideBar from "./SideBar";
import AvatarComponent from "../cartSelectBasin/AvatarComponent";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { toast } from "react-toastify";
import { showCheckOutModal } from "../store/actions/modal-actions";

const SideNav = ({ hideSideBar }: sideNavProps) => {
    const dispatch = useAppDispatch();
    const location = useLocation();

    const [state, setState] = useState({
        isActive: false,
        isOpen: false,
    });
    const { isActive, isOpen } = state;
    const { alerts: { alertMsg: { data } }, auth: { user: { trial_remaining_days, company_configs: { free_trial_period_enabled, is_trial_never_end, trial_expired }, subscription_status } }, cartSelectBasinCounty: {
        cartListItems,
    }, } = useAppSelector(state => state)
    const expandToggleMenu = () => {
        setState((prev) => ({ ...prev, isActive: !isActive }));
    };

    const toggleSettingDropDown = () =>
        setState((prev) => ({ ...prev, isOpen: !isOpen }));

    return (
        <>
            <div className={isActive ? "cart-menu open" : "cart-menu"} onClick={() => {
                isOpen && toggleSettingDropDown()
            }}>


                <div className="logo-icon">
                    <Link to={trial_expired ? cartSelectBasin : "/"} className="side-menu-logo" onClick={(e) => {
                        if (trial_expired) {
                            e.preventDefault()
                            cartListItems.length && dispatch(showCheckOutModal());
                            toast.info("Please subscribe to plan.")
                        }
                    }} >
                        <img
                            className="ed-logo-icon"
                            src="images/ed-logo-icon.svg"
                            alt="Logo"
                        />
                        <img
                            className="ed-logo-text"
                            src="images/ed-logo-text.svg"
                            alt="Logo"
                        />
                    </Link>
                    <div className="toggleArrow" onClick={expandToggleMenu}>
                        <div className="expandSidebar"><img src="images/expand.png" alt="" /></div>
                        {/* <i className="fa-solid fa-angles-right"></i> */}
                        <i className="fa-solid fa-angles-left"></i>
                    </div>
                </div>
                <ul className={`navbar-menu scrollSection ${free_trial_period_enabled && !is_trial_never_end && trial_remaining_days !== null ? "freeTrialNav" : ""}`}>
                    {navBarMenu.map((item, index) => {
                        return (
                            <li title={item.title} key={index} className={`${index === 3 && data.filter((item) => !item.read_status).length ? 'unread' : ''}`}>
                                <NavLink
                                    onClick={(e) => {
                                        if (trial_expired) {
                                            e.preventDefault()
                                            cartListItems.length && dispatch(showCheckOutModal());
                                            toast.info("Please subscribe to plan.")
                                        }
                                    }}
                                    to={trial_expired ? "" : item.pathname}
                                    className={({ isActive, isPending }) =>
                                        isActive && !trial_expired ? "active" : ""
                                    }
                                >
                                    <i className={item.fontAwesomeClass}></i>
                                    <span>{item.label}</span>
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
                {(free_trial_period_enabled || (trial_expired && (subscription_status !== "active"))) && !is_trial_never_end && trial_remaining_days !== null ? <div className="subscribe">
                    <p><span className="number">{trial_remaining_days || 0}</span> days <span className="text">left in your Trial</span></p>
                    <Link to={"/cart-select-basin"} type="button" className="btn btn-primary width100">
                        <img src="images/cart-icon.svg" alt="" />
                        <span>Subscribe</span>
                    </Link>
                </div> : <></>}
                <div className="setting">
                    <div className={location.pathname === cartSelectBasin ? "" : "settingLink"}>
                        <a
                            className={location.pathname === cartSelectBasin ? "d-none" : isOpen ? "settingbtn active" : "settingbtn"}
                            href="void:(0)"
                            onClick={(e) => {
                                e.preventDefault();
                                toggleSettingDropDown()
                            }}
                        >
                            <i className="fa-solid fa-gear"></i>

                        </a>
                        {isOpen && (
                            <AvatarComponent
                                dispatch={dispatch}
                                isOpen={isOpen}
                                toggleSettingDropDown={toggleSettingDropDown}
                                hideLogo={true}
                            />
                        )}
                    </div>
                </div>

            </div>
            {!hideSideBar && <SideBar toggleSettingDropDown={toggleSettingDropDown} isOpen={isOpen} />}
        </>
    );
};

export default SideNav;
