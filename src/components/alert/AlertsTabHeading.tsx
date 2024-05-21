import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { handleAlertTabIndex, handleResetData } from "../store/actions/alert-actions";
import AlertSettings from "../svg/AlertSettings";
import { numberFormat } from "../../utils/helper";

function AlertsTabHeading() {
    const {
        alerts: { alertTabIndex, alertMsg: { unread_count, read_count, favourite_count } },
    } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();
    const tabHeadingArray = [{
        label: "New Alerts",
        count: unread_count,
        iconSrc: "images/alert-icon.svg",
        onClick: () => {
            if (alertTabIndex !== 0) {
                dispatch(handleAlertTabIndex(0));
                unread_count && dispatch(handleResetData(0))
            }

        },
        id: "alert",
        iconCom: <></>
    },
    {
        label: "Viewed Alerts",
        count: read_count,
        iconSrc: "images/viewed-icon.svg",
        onClick: () => {
            if (alertTabIndex !== 1) {
                dispatch(handleAlertTabIndex(1));
                read_count && dispatch(handleResetData(1))
            }
        },
        id: "viewed-alerts",
        iconCom: <></>
    },
    {
        label: "Favorites",
        count: favourite_count,
        iconSrc: "images/favorites-icon.svg",
        onClick: () => {
            if (alertTabIndex !== 2) {
                dispatch(handleAlertTabIndex(2));
                favourite_count && dispatch(handleResetData(2))
            }
        },
        id: "favorites",
        iconCom: <></>

    },
    {
        label: "Alert Controls",
        count: 0,
        iconSrc: "",
        iconCom: <AlertSettings color={alertTabIndex === 3 ? "#FFF9F9" : "#696B6C"} fill={alertTabIndex === 3 ? "#FFF9F9" : "#696B6C"} />,
        onClick: () => {
            alertTabIndex !== 3 &&
                dispatch(handleAlertTabIndex(3));
        },
        id: "alert-setting",
    }
    ]
    useEffect(() => {
        return () => {
            dispatch(handleAlertTabIndex(0))
        }
        // eslint-disable-next-line
    }, [])
    return (
        <>
            <div className="aoiTab">
                <ul className="nav" id="myTabalert" role="tablist">
                    {tabHeadingArray.map((item, index) => {
                        const { label, id, onClick, iconSrc, count, iconCom } = item
                        return <li className="nav-item" role="presentation" key={index}>
                            <button
                                className={`nav-link ${index === alertTabIndex && alertTabIndex === 0 ? "active-green" : index === alertTabIndex ? "active" : ""}`}
                                id={`${id}-tab`}
                                data-bs-toggle="tab"
                                data-bs-target={`#${id}`}
                                type="button"
                                onClick={onClick}
                                role="tab"
                                aria-controls={`${id}`}
                                aria-selected={index === alertTabIndex ? true : false}
                            >
                                {iconSrc ? <img src={iconSrc} alt="" /> : <>{iconCom}&nbsp;</>}
                                {label}
                                {index !== tabHeadingArray.length - 1 ? <span className="count">{numberFormat.format(count)}</span> : <></>}
                            </button>
                        </li>
                    })}
                </ul >
            </div >
        </>
    );
}

export default AlertsTabHeading;
