import React, { useEffect, useMemo, useRef, useState } from "react";
import Scrollbars from "react-custom-scrollbars";
import { AlertsTabNotiFormData } from "../models/submit-form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { alertsTabNotiValidation } from "../../Helper/validation";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { deleteAlertMsg, fetchAlertMessage, fetchCountyList, handleAlertMsgData, handleAlertTabIndex, handleAoiALertEnabled, handleCountyAlertsSettings, handleResetData, markFavourite, markNotiUnread, setAlertSetTabNotiData, updateAlertNotiData, updateAoiAlertSetting } from "../store/actions/alert-actions";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "../common/Spinner";
import moment from "moment";
import DeleteConfirmationModal from "../common/Modal/DeleteConfirmationModal";
import CountyDropDown from "./CountyDropDown";
import { highlightSelectedWell } from "../map/redux/locations";

type StateType = {
    deleteAlertModal: boolean;
    selectedIdAlert: number;
    unReadMsgList: number[];
    readMsgList: number[];
    favouriteMsgList: number[];
}

function AlertsTabContent() {
    const { handleSubmit } =
        useForm<AlertsTabNotiFormData>({
            resolver: yupResolver(alertsTabNotiValidation),
        });

    const { alerts: { alertTabIndex, alertSetTabNotiDataLoading, alertSetTabNotiData, is_aoi_alert_enabled, is_county_alert_enabled, alertMsg: { alertMsgLoading, page: unreadPage, readPage, favouritePage, data: unreadData, readData, favouriteData, totalPage: unreadTotalPage, alertReadMsgLoading, alertFavouriteMsgLoading, readTotalPage, favouriteTotalPage } }, auth: { user: { access_token } } } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();
    const [state, setState] = useState<StateType>({
        deleteAlertModal: false,
        selectedIdAlert: 0,
        unReadMsgList: [],
        readMsgList: [],
        favouriteMsgList: []
    })
    const { deleteAlertModal, selectedIdAlert, unReadMsgList, readMsgList, favouriteMsgList } = state;

    // using concept of common data and total page
    const data = alertTabIndex === 0 ? unreadData : alertTabIndex === 1 ? readData : favouriteData;
    const totalPage = alertTabIndex === 0 ? unreadTotalPage : alertTabIndex === 1 ? readTotalPage : favouriteTotalPage;
    const page = alertTabIndex === 0 ? unreadPage : alertTabIndex === 1 ? readPage : favouritePage;
    const initialRef = useRef(true)
    useEffect(() => {
        !initialRef.current && setState((prev) => ({
            ...prev,
            hasMore: false,
            deleteAlertModal: false,
            selectedIdAlert: 0,
            unReadMsgList: [],
            readMsgList: [],
            favouriteMsgList: []
        }))
        initialRef.current && (initialRef.current = false)
    }, [alertTabIndex])

    const onSubmit = (data: AlertsTabNotiFormData) => {
        let tempData = alertSetTabNotiData.map((item, index) => ({
            ...item,
            is_email: data.notification[index].is_email,
            is_in_platform: data.notification[index].is_in_platform,
            // is_mobile_push: data.notification[index].is_mobile_push,
        }));
        if (JSON.stringify(tempData) === JSON.stringify(alertSetTabNotiData)) {
            toast.info("No changes detected.");
            return;
        }
        dispatch(
            updateAlertNotiData(access_token, tempData)
        ).then((res) => {
            const { status, msg } = res;
            if (status === 200) {
                toast.success(msg);
                dispatch(setAlertSetTabNotiData(tempData));
            } else {
                toast.error(msg);
            }
        });
    };

    useEffect(() => {
        if (alertTabIndex === 0 || alertTabIndex === 1 || alertTabIndex === 2) {
            if (alertMsgLoading && alertTabIndex === 0) {
                dispatch(fetchAlertMessage(access_token, page, alertTabIndex));
                return
            }
            if (alertReadMsgLoading && alertTabIndex === 1) {
                dispatch(fetchAlertMessage(access_token, page, alertTabIndex));
                return
            }
            if (alertFavouriteMsgLoading && alertTabIndex === 2) {
                dispatch(fetchAlertMessage(access_token, page, alertTabIndex));
                return
            }
        } else {
            if (alertSetTabNotiDataLoading && alertTabIndex === 3) {
                dispatch(fetchCountyList(access_token))
            }
        }
        // eslint-disable-next-line
    }, [alertTabIndex, alertMsgLoading, alertSetTabNotiDataLoading, alertReadMsgLoading, alertFavouriteMsgLoading])

    const fetchData = () => {
        dispatch(fetchAlertMessage(access_token, page + 1, alertTabIndex, true));

    };

    const contentMemo = useMemo(() => {
        return <>
            {!data.length ? <>
                {/* Default screen goes here */}
                {alertTabIndex === 0 ? <div className="basin-block">
                    <div className="basin-circle">
                        <img src="images/alerticon.svg" alt="" />
                    </div>

                    <div className="block-text-title">No New Alerts</div>
                    <p>
                        Stay informed about new production, rig activities, permit updates, and essential well information relevant to your areas of interest. Customize your alerts to ensure you never miss a beat!
                    </p>
                    <div className="tip">
                        <img src="images/tip.svg" alt="" />
                        Tip: Want to stay ahead? Create an Area of Interest (AOI) or visit Alert Controls to select specific counties for tailored alerts.
                    </div>


                    <div className="button-file">
                        <button type="button" className="btn btn-primary">
                            Create an AOI
                        </button>
                        <ul className="nav" id="myTabalert" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button
                                    className={`nav-link btn btn-outline-blue`}
                                    id={`alert-setting-tab`}
                                    data-bs-toggle="tab"
                                    data-bs-target={`#alert-setting`}
                                    type="button"
                                    onClick={() => {
                                        // alertTabIndex !== 3 &&
                                        dispatch(handleAlertTabIndex(3));
                                    }}
                                    role="tab"
                                    aria-controls={`alert-setting`}
                                    aria-selected={false}
                                >
                                    Alert Controls
                                </button>
                            </li>
                        </ul>

                    </div>
                </div>
                    : alertTabIndex === 1 ?
                        <div className="basin-block">
                            <div className="basin-circle">
                                <img src="images/no-view-alert.svg" alt="" />
                            </div>

                            <div className="block-text-title">No Viewed Alerts</div>
                            <p>
                                Looks like you haven't checked any alerts yet.
                            </p>
                        </div> :
                        <div className="basin-block">
                            <div className="basin-circle">
                                <img src="images/no-favorite-icon.svg" alt="" />
                            </div>

                            <div className="block-text-title">No Favorites Saved</div>
                            <p>
                                No favorites yet. Add important alerts here for quick access.
                            </p>
                        </div>}
            </>
                :
                <div className="saveSegments alertsection">

                    <div className="header-section">
                        <div className="text-block">
                            <h3>Alerts</h3>
                            <p>Your most recent alerts are listed below</p>
                        </div>
                        <div className="actionButtons">
                            {/* Mark viewed is present on tab 0 and 2 */}
                            {unReadMsgList.length && (alertTabIndex === 0 || alertTabIndex === 2) ? <button type="button" className={`btn  btn-primary`} onClick={() => {
                                dispatch(markNotiUnread(access_token, { alert_id: unReadMsgList, action: 'read' })).then((res) => {
                                    if (res.status === 200) {
                                        setState((prev) => ({ ...prev, unReadMsgList: [], favouriteMsgList: [], readMsgList: [] }))
                                    }
                                })
                            }}> <i className="fa-solid fa-eye"></i> Mark viewed</button> : <></>}

                            {/* Mark as new is present on tab 1 and 2 */}
                            {readMsgList.length && (alertTabIndex === 1 || alertTabIndex === 2) ? <button type="button" className={`btn btn-primary`} onClick={() => {
                                dispatch(markNotiUnread(access_token, { alert_id: readMsgList, action: 'new' })).then((res) => {
                                    if (res.status === 200) {
                                        setState((prev) => ({ ...prev, unReadMsgList: [], readMsgList: [], favouriteMsgList: [] }))
                                    }
                                })
                            }}><i className="fa-solid fa-bell"></i> Mark as new</button> : <></>}

                            {/* Favorites is present on tab 0 and 1 */}
                            {favouriteMsgList.length && (alertTabIndex === 0 || alertTabIndex === 1) ? <button type="button"
                                className={`btn btn-primary`}
                                onClick={() => {
                                    dispatch(markFavourite(access_token, { id: favouriteMsgList, favourite: 1 })).then((res) => {
                                        if (res.status === 200) {
                                            setState((prev) => ({ ...prev, unReadMsgList: [], readMsgList: [], favouriteMsgList: [] }))
                                        }
                                    })
                                }}
                            ><i className="fa-solid fa-star"></i> Favorites</button> : <></>}

                            {(unReadMsgList.length || readMsgList.length || favouriteMsgList.length) && <div className="action-block padding"><button type="button"
                                className={`btn btn-primary btn-red`}
                                onClick={() => {
                                    setState((prev) => ({
                                        ...prev,
                                        deleteAlertModal: true,
                                    }))
                                }}
                            ><i className="fa-solid fa-trash"></i> Delete</button></div>}
                        </div>
                    </div>
                    <div className="tableData">
                        <div className="tableHeader">
                            <div className="tableRow">
                                <div className="tableCell">
                                    <div className="custom-checkbox">
                                        <input name={`selectAllscrollDivActive${alertTabIndex}`} className="form-control checkmark" type="checkbox" id={`selectAllscrollDivActive${alertTabIndex}`}
                                            checked={data.filter((item) => !item.checked).length === 0 ? true : false}
                                            onChange={(e) => {
                                                const { checked } = e.target;
                                                let tempArray: number[] = [];
                                                let tempReadArray: number[] = [];
                                                let tempFavArray: number[] = [];
                                                (alertTabIndex === 0 || alertTabIndex === 2) && (tempArray = data.filter(item => !item.read_status).map(item => item.id));

                                                (alertTabIndex === 0 || alertTabIndex === 1) && (tempFavArray = data.filter(item => !item.is_favourite).map(item => item.id));

                                                (alertTabIndex === 1 || alertTabIndex === 2) && (tempReadArray = data.filter(item => item.read_status).map(item => item.id));

                                                if (checked) {
                                                    setState((prev) => ({ ...prev, unReadMsgList: [...tempArray], favouriteMsgList: [...tempFavArray], readMsgList: [...tempReadArray] }))
                                                } else {
                                                    setState((prev) => ({ ...prev, unReadMsgList: [], favouriteMsgList: [], readMsgList: [] }));
                                                }
                                                dispatch(
                                                    handleAlertMsgData(
                                                        { data: data.map((item => ({ ...item, checked }))), conCat: false })
                                                )
                                            }}
                                        />
                                        <label htmlFor={`selectAllscrollDivActive${alertTabIndex}`} className="custom-label"></label>
                                    </div>
                                    {/* Alert Type */}
                                    State
                                </div>
                                {/* <div className="tableCell">State</div> */}
                                <div className="tableCell">County</div>
                                <div className="tableCell">AOI Name</div>
                                <div className="tableCell">Date</div>
                                <div className="tableCell">Action</div>
                            </div>
                        </div>
                        <div className="tableBody segmentsSection-scroll scrollSection" id={`scrollDivAlertActive${alertTabIndex}`} style={{
                            minHeight: 0,
                            maxHeight: "calc(100vh - 28rem)",
                        }}>


                            <InfiniteScroll
                                dataLength={data.length}
                                next={fetchData}
                                hasMore={page < totalPage ? true : false}
                                scrollThreshold={0.8}
                                loader={<Spinner />}
                                style={{ overflow: "hidden" }}
                                scrollableTarget={`scrollDivAlertActive${alertTabIndex}`}
                            >
                                {
                                    // data.length > 0 ? 
                                    data.map((item, index) => {
                                        const { id,
                                            alert_message,
                                            link_url,
                                            read_status,
                                            added_on,
                                            checked,
                                            // alert_type,
                                            state_abbr,
                                            county_name,
                                            aoi_name, is_favourite,
                                        } = item;
                                        return <div className={`tableRow msg ${!read_status ? "unread" : ""}`} key={index}>
                                            <div className="msgTitle">{alert_message}</div>
                                            <div className="tableCell">
                                                <div className="custom-checkbox">
                                                    <input name={`${id}`} checked={checked} className="form-control checkmark" type="checkbox" id={`${id}`}
                                                        onChange={(e) => {
                                                            const { checked } = e.target;
                                                            if (checked) {
                                                                setState((prev) => ({
                                                                    ...prev,
                                                                    ...(!read_status && (alertTabIndex === 0 || alertTabIndex === 2) && { unReadMsgList: [...prev.unReadMsgList, id] }),
                                                                    ...(read_status && (alertTabIndex === 1 || alertTabIndex === 2) && { readMsgList: [...prev.readMsgList, id] }),
                                                                    ...(!is_favourite && (alertTabIndex === 0 || alertTabIndex === 1) && { favouriteMsgList: [...prev.favouriteMsgList, id] })
                                                                }))
                                                            } else {
                                                                setState((prev) => ({
                                                                    ...prev,
                                                                    ...(!read_status && (alertTabIndex === 0 || alertTabIndex === 2) && { unReadMsgList: prev.unReadMsgList.filter(item => item !== id) }),
                                                                    ...(read_status && (alertTabIndex === 1 || alertTabIndex === 2) && { readMsgList: prev.readMsgList.filter(item => item !== id) }),
                                                                    ...(!is_favourite && (alertTabIndex === 0 || alertTabIndex === 1) && { favouriteMsgList: prev.favouriteMsgList.filter(item => item !== id) })
                                                                }));
                                                            }
                                                            dispatch(
                                                                handleAlertMsgData(
                                                                    { data: data.map((item => (item.id === id ? { ...item, checked } : item))), conCat: false })
                                                            )
                                                        }}
                                                    />
                                                    <label htmlFor={`${id}`} className="custom-label"></label>
                                                </div>
                                                {/* {alert_type} */}
                                                {state_abbr}
                                            </div>

                                            {/* <div className="tableCell">{state_abbr}</div> */}
                                            <div className="tableCell">{county_name}</div>
                                            <div className="tableCell">{aoi_name}</div>
                                            <div className="tableCell">{moment(
                                                added_on
                                            ).format("MMM-DD-YYYY")}</div>
                                            <div className="tableCell">
                                                <span className="maplocation" onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    link_url && dispatch(highlightSelectedWell({ well_id: link_url }))

                                                }}><i className="fa-solid fa-map-location"></i></span>
                                                <span onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    setState((prev) => ({
                                                        ...prev,
                                                        deleteAlertModal: true,
                                                        selectedIdAlert: id
                                                    }))
                                                }}><img src="images/trash.svg" alt="" /></span>
                                            </div>
                                        </div>
                                    })
                                }

                            </InfiniteScroll>
                        </div>
                    </div>


                    {deleteAlertModal && (
                        <DeleteConfirmationModal
                            show={deleteAlertModal}
                            handleClose={() =>
                                setState((prev) => ({
                                    ...prev,
                                    deleteAlertModal: false,
                                    ...(selectedIdAlert && { selectedIdAlert: 0 })
                                }))
                            }
                            confirmBtnClick={() => {
                                let temp: number[] = [];
                                let tempId = selectedIdAlert;
                                if (!tempId) {
                                    temp = data.filter(item => item.checked).map((_item) => _item.id);
                                }
                                // let tempTotalRecord = selectedIdAlert ? (alertTabIndex === 0 ? unread_count : alertTabIndex === 1 ? read_count : favourite_count) - 1 : (alertTabIndex === 0 ? unread_count : alertTabIndex === 1 ? read_count : favourite_count) - temp.length
                                setState((prev) => ({
                                    ...prev,
                                    deleteAlertModal: false,
                                    favouriteMsgList: [],
                                    unReadMsgList: [],
                                    readMsgList: [],
                                    ...(selectedIdAlert && { selectedIdAlert: 0 }),
                                }));
                                dispatch(
                                    deleteAlertMsg(access_token, {
                                        alert_id: tempId ? [tempId] : temp,
                                    })
                                ).then((res) => {
                                    const { status, msg } = res;
                                    if (status === 200) {
                                        dispatch(handleResetData(alertTabIndex))

                                        toast.success(msg);

                                    } else {
                                        toast.error(msg);
                                    }
                                });
                            }}
                            content={
                                <p>Do you want to delete the alert ?</p>
                            }
                        />
                    )}
                </div>}
        </>
        // eslint-disable-next-line
    }, [JSON.stringify(data), page, deleteAlertModal,alertTabIndex])


    return (
        <>
            <div className="tab-pane fade show active" id="alert" role="tabpanel" aria-labelledby="alert-tab">
                {alertTabIndex === 0 ? contentMemo : <></>}
            </div >
            <div className="tab-pane fade" id="viewed-alerts" role="tabpanel" aria-labelledby="viewed-alerts-tab">
                {alertTabIndex === 1 ? contentMemo : <></>}
            </div >
            <div className="tab-pane fade" id="favorites" role="tabpanel" aria-labelledby="favorites-tab">
                {alertTabIndex === 2 ? contentMemo : <></>}
            </div >
            <div className="tab-pane fade" id="alert-setting" role="tabpanel" aria-labelledby="alert-setting-tab">
                <div className="saveSegments alertsection generalsettings">
                    <div className="text-block">
                        <h3>Alert Controls</h3>
                        <p>In this section, you can toggle AOI alerts on or off and select specific county-wide notifictaions to stay informed about key activiteis and updates in your areas of interest.</p>
                    </div>

                    <form
                        className="form-block"
                        onSubmit={handleSubmit(onSubmit)}
                        autoComplete="off"
                        autoCapitalize="off"
                    >
                        <Scrollbars
                            className='segmentsSection-scroll'
                            autoHeight
                            autoHeightMin={0}
                            autoHeightMax="calc(100vh - 26rem)"
                            renderThumbVertical={(props) => (
                                <div {...props} className="thumb-vertical" />
                            )}
                            renderTrackVertical={(props) => (
                                <div {...props} className="track-vertical" />
                            )}
                        >
                            <div className="alertblock">
                                <div className="alertControls">
                                    <div className="enableDisable">
                                        <div className="text-block">
                                            <h3>AOI Alerts</h3>
                                            <p>Quickly enable or disable all your AOI alerts with this toggle, streamlining your alert management without the need to adjust each AOI individually.</p>
                                        </div>
                                        <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                                            <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" checked={is_aoi_alert_enabled === false ? true : false} onChange={() => {
                                                if (is_aoi_alert_enabled !== false) {
                                                    dispatch(handleAoiALertEnabled(false))
                                                    dispatch(updateAoiAlertSetting(access_token, { alert_status: 0 }))
                                                }
                                            }} />
                                            <label className="btn btn-primary" htmlFor="btnradio1">Disable</label>

                                            <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off" checked={is_aoi_alert_enabled === true ? true : false} onChange={() => {
                                                if (is_aoi_alert_enabled !== true) {
                                                    dispatch(handleAoiALertEnabled(true))
                                                    dispatch(updateAoiAlertSetting(access_token, { alert_status: 1 }))
                                                }
                                            }} />
                                            <label className="btn btn-primary" htmlFor="btnradio2">Enabled</label>
                                        </div>
                                    </div>
                                    <div className={`enableDisable ${is_county_alert_enabled ? "" : "county"}`}>
                                        <div className="text-block">
                                            <h3>County Alerts Settings</h3>
                                            <p>Quickly enable or disable alerts at the county-wide level without having to create a focused AOI.</p>
                                        </div>
                                        <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                                            <input type="radio" className="btn-check" name="btnradioCounty" id="btnradio3" autoComplete="off" checked={is_county_alert_enabled === false ? true : false} onChange={() => {
                                                if (is_county_alert_enabled !== false) {
                                                    dispatch(handleCountyAlertsSettings(false))
                                                    dispatch(updateAoiAlertSetting(access_token, { county_alert: false }))
                                                }
                                            }} />
                                            <label className="btn btn-primary" htmlFor="btnradio3">Disable</label>

                                            <input type="radio" className="btn-check" name="btnradioCounty" id="btnradio4" autoComplete="off" checked={is_county_alert_enabled === true ? true : false} onChange={() => {
                                                if (is_county_alert_enabled !== true) {
                                                    dispatch(handleCountyAlertsSettings(true))
                                                    dispatch(updateAoiAlertSetting(access_token, { county_alert: true }))
                                                }
                                            }} />
                                            <label className="btn btn-primary" htmlFor="btnradio4">Enabled</label>
                                        </div>
                                    </div>
                                    {is_county_alert_enabled && <div className="enableDisable county">
                                        <div className="text-block">
                                            <h3>County Alerts</h3>
                                            <p>Select specific counties to receive tailored alerts, ensuring you stay informed about critical updates and activities in your choosen regions.</p>
                                        </div>
                                        <div className="selectInputdropDown dynamicSegment-form">
                                            <CountyDropDown />
                                        </div>
                                    </div>}
                                </div>
                            </div>
                        </Scrollbars>
                    </form>
                </div>
            </div>
        </>
    );
}

export default AlertsTabContent;
