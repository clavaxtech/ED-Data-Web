import { useNavigate } from "react-router-dom";
import withSideNav from "../../HOC/withSideNav";
import { PlanSettingsViewProps } from "../../models/page-props";
import { useEffect, useState } from "react";
import {
    cancelSubscription,
    clearSubscriptionData,
    fetchSubscriptionData,
} from "../../store/actions/subscription-settings-actions";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import { FormatLongNumber, USDollar } from "../../../utils/helper";
import moment from "moment";
import { toast } from "react-toastify";
import DeleteConfirmationModal from "../../common/Modal/DeleteConfirmationModal";
import NoDataFound from "../../common/NoDataFound";
import Scrollbars from "react-custom-scrollbars";
import EditSubModal from "./EditSubModal";
import Map from "../../map/Map";
import { toggleEditSubscriptionModal } from "../../store/actions/modal-actions";
import { calculateTax } from "../../store/actions/cart-select-basin-county-actions";
import { MapComponent, MapType } from "../../common/MapComponent";
import { basinsUpdated, countiesUpdated } from "../../map/redux/locations";
const PlanSettingsView = (props: PlanSettingsViewProps) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [state, setState] = useState({
        cancelSubscriptionModal: false,
        tabIndex: 1
    });
    const { cancelSubscriptionModal, tabIndex } = state;
    const {
        auth: {
            user: { access_token, trial_remaining_days },
        },
        subscriptionSettings: { loadSubscriptionData, subscriptionData },
        modal: { editSubscriptionModal },
    } = useAppSelector((state) => state);

    let tempTotalCost = subscriptionData
        ? Number(
            subscriptionData.details
                .filter((item) => !item.unsubscribe_status)
                .reduce(
                    (accumulator, currentValue) =>
                        accumulator + Number(currentValue.total_cost),
                    0
                )
                .toFixed(2)
        )
        : 0;

    useEffect(() => {
        if (access_token && loadSubscriptionData) {
            dispatch(fetchSubscriptionData(access_token));
        }
        return () => {
            dispatch(clearSubscriptionData());
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (tabIndex === 1) {
            dispatch(basinsUpdated([]))
        } else {
            dispatch(countiesUpdated([]))
        }
    }, [tabIndex]);

    return (
        <div className="settingsWrapper">
            <Scrollbars
                className="settingsWrapper-scroll"
                autoHeightMin={0}
                renderThumbVertical={(props) => (
                    <div {...props} className="thumb-vertical" />
                )}
                renderTrackVertical={(props) => (
                    <div {...props} className="track-vertical" />
                )}
            >
                <div className="settingWrapperInner">
                    <div className="item subscriptionBlock">
                        <div className="planContent">
                            <h3>Subscription</h3>
                            <p>Manage your company name, logo and information</p>
                        </div>
                        <div className="gonatinalAccess">
                            <div className="graph">
                                <img src="images/s-graph.svg" alt="" />
                            </div>
                            <div className="dollerInfo">
                                <h3>Go National!<span>Get Nationwide Data Access</span></h3>
                                <p>Enhance your analytics and save with Nationwide Data Access. Broaden your perspective, compare regions, and secure confident decision-making across all states.</p>
                            </div>
                            <button className="btn btn-green">Upgrade Now</button>
                        </div>
                    </div>
                    {subscriptionData === null ? (
                        <NoDataFound
                            ImageSrc="images/no-subscription.svg"
                            headingLabel="No Subscriptions Found"
                            description="You haven't subscribed to any geographic areas
                        yet. Explore our data offerings and choose the
                        regions that interest you to gain access to
                        valuable oil and gas insights."
                            onBtnClick={() => navigate("/cart-select-basin")}
                            btnLabel="Subscribe Now"
                        />
                    ) : (
                        <>
                            <div className="subscription-list">
                                <ul>
                                    <li>
                                        <div className="icon">
                                            <i className="fa-solid fa-user-group"></i>
                                        </div>
                                        <div className="detail">
                                            <span>Users</span>
                                            {subscriptionData
                                                ? `${subscriptionData.subscription.total_user}/${subscriptionData.subscription.allowed_user}`
                                                : `0/0`}
                                        </div>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <i className="fa-solid fa-clipboard"></i>
                                        </div>
                                        <div className="detail">
                                            <span>Counties/Basins</span>
                                            {subscriptionData
                                                ? `${subscriptionData.details.filter(
                                                    (item) =>
                                                        item.line_item_type ===
                                                        2
                                                ).length
                                                }/${subscriptionData.details.filter(
                                                    (item) =>
                                                        item.line_item_type ===
                                                        1
                                                ).length
                                                }`
                                                : 0}
                                        </div>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <i className="fa-solid fa-clipboard"></i>
                                        </div>
                                        <div className="detail">
                                            <span>Subscription Cost</span>
                                            {/* {subscriptionData */}
                                            {/* ? USDollar.format(tempTotalCost) */}
                                            {USDollar.format(tempTotalCost)}
                                            {/* : USDollar.format(0)} */}
                                        </div>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <i className="fa-solid fa-clipboard"></i>
                                        </div>
                                        <div className="detail">
                                            <span>
                                                {subscriptionData.subscription
                                                    .is_canceled
                                                    ? "Expiry Date"
                                                    : "Renewal Date"}
                                            </span>
                                            {`${trial_remaining_days}` === "Never" ? "Continuous" : subscriptionData
                                                ? moment(
                                                    subscriptionData
                                                        .subscription
                                                        .renewal_date
                                                ).format("MMM-DD-YYYY")
                                                : "NA"}
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="plan-map-con">
                                <div className="row">
                                    <div className="col-md-9">
                                        <div className="map-con">
                                            <MapComponent mapType={MapType.Cart} />
                                            <div className="tab-nav planTabs">
                                                <ul
                                                    className="nav nav-pills"
                                                    id="pills-tab"
                                                    role="tablist"
                                                >
                                                    <li
                                                        onClick={() => {
                                                            setState((prev) => ({
                                                                ...prev,
                                                                tabIndex: 1,
                                                            }));
                                                        }}>
                                                        <a
                                                            href="void:(0)"
                                                            id="pills-by-basin-tab"
                                                            data-bs-toggle="pill"
                                                            data-bs-target="#pills-basin"
                                                            type="button"
                                                            role="tab"
                                                            aria-controls="pills-home"
                                                            aria-selected="true"
                                                            className="active"
                                                        >
                                                            By Basin
                                                        </a>
                                                    </li>
                                                    <li
                                                        onClick={() => {
                                                            setState((prev) => ({
                                                                ...prev,
                                                                tabIndex: 2,
                                                            }));
                                                        }}>
                                                        <a
                                                            href="void:(0)"
                                                            id="pills-by-county-tab"
                                                            data-bs-toggle="pill"
                                                            data-bs-target="#pills-county"
                                                            type="button"
                                                            role="tab"
                                                            aria-controls="pills-profile"
                                                            aria-selected="false"
                                                        >
                                                            By County
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="basin-sidebar">
                                            <button
                                                type="button"
                                                // className={`btn  width100 mb-3 ${
                                                //     subscriptionData
                                                //         ?.subscription
                                                //         ?.is_canceled
                                                //         ? "btn-disabled"
                                                //         : "btn-primary"
                                                // }`}
                                                className={`btn  width100 mb-3 btn-primary`}
                                                onClick={() => {
                                                    // !subscriptionData
                                                    //     ?.subscription
                                                    //     ?.is_canceled &&
                                                    navigate(
                                                        "/cart-select-basin",
                                                        // {
                                                        //     state: {
                                                        //         sub_id: subscriptionData
                                                        //             ?.subscription
                                                        //             .id,
                                                        //     },
                                                        // }
                                                    );
                                                    // navigate(
                                                    //     "/cart-select-basin"
                                                    // );
                                                }}
                                            >
                                                <i className="fa-solid fa-circle-plus"></i>{" "}
                                                Add Subscription
                                            </button>

                                            <div className="monthly-plan">
                                                <h2>Monthly Subscription</h2>
                                                <ul className="planCart scrollSection">
                                                    {subscriptionData &&
                                                        ([...subscriptionData.details.filter(item => !item.unsubscribe_status), ...subscriptionData.details.filter(item => item.unsubscribe_status)]).map(
                                                            (item, index) => {
                                                                return (
                                                                    <li
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        <div className="small-map">
                                                                            <img
                                                                                src={
                                                                                    item.image_data
                                                                                }
                                                                                alt=""
                                                                            />
                                                                        </div>
                                                                        <div className="description">
                                                                            <h4>
                                                                                {
                                                                                    item.line_item_name
                                                                                }
                                                                            </h4>
                                                                            <p
                                                                                style={{
                                                                                    color: item.unsubscribe_status
                                                                                        ? "#D94141"
                                                                                        : "#48637B",
                                                                                }}
                                                                            >
                                                                                {item.unsubscribe_status
                                                                                    ? `Cancelled Active Untill: ${moment(
                                                                                        item.end_period
                                                                                    ).format(
                                                                                        "MMM-DD-YYYY"
                                                                                    )}`
                                                                                    : `Current monthly subscription`}
                                                                            </p>
                                                                            <p>
                                                                                <span>
                                                                                    {
                                                                                        item.total_counties
                                                                                    }{" "}
                                                                                    Counties
                                                                                </span>
                                                                                <span>
                                                                                    {
                                                                                        item.total_hz_wells
                                                                                    }{" "}
                                                                                    Horizontal Wells
                                                                                </span>
                                                                                <span>
                                                                                    {
                                                                                        item.total_active_wells
                                                                                    }{" "}
                                                                                    Active Wells
                                                                                </span>
                                                                                <span>
                                                                                    {
                                                                                        item.total_rigs
                                                                                    }{" "}
                                                                                    Rigs
                                                                                </span>
                                                                                <span>
                                                                                    {
                                                                                        item.total_permits
                                                                                    }{" "}
                                                                                    Permit
                                                                                </span>
                                                                                <span>
                                                                                    {FormatLongNumber(item.total_oil_production)}{" "}
                                                                                    bbl/day
                                                                                    {" "}
                                                                                    Oil Production
                                                                                </span>
                                                                                <span>
                                                                                    {FormatLongNumber(item.total_gas_production)}
                                                                                    {" "}
                                                                                    cf/day
                                                                                    {" "}
                                                                                    Gas Production
                                                                                </span>
                                                                                {USDollar.format(
                                                                                    Number(
                                                                                        item.total_cost
                                                                                    )
                                                                                )}{" "}
                                                                                /
                                                                                month
                                                                                -
                                                                                Billed
                                                                                monthly
                                                                            </p>
                                                                        </div>
                                                                        <div className="price">
                                                                            {USDollar.format(
                                                                                Number(
                                                                                    item.total_cost
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    </li>
                                                                );
                                                            }
                                                        )}
                                                </ul>
                                                <div
                                                    className="editsubs"
                                                    onClick={() => {
                                                        if (
                                                            subscriptionData &&
                                                            subscriptionData?.details.filter(
                                                                (item) =>
                                                                    !item.unsubscribe_status
                                                            ).length > 0
                                                        ) {
                                                            dispatch(
                                                                calculateTax(
                                                                    access_token,
                                                                    {
                                                                        sub_total:
                                                                            tempTotalCost,
                                                                    }
                                                                )
                                                            );
                                                            dispatch(
                                                                toggleEditSubscriptionModal()
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <button
                                                        className={`btn btn-outline-white ${subscriptionData &&
                                                            subscriptionData?.details.filter(
                                                                (item) =>
                                                                    !item.unsubscribe_status
                                                            ).length > 0
                                                            ? ""
                                                            : "btn-disabled"
                                                            }`}
                                                    >
                                                        Edit Subscription
                                                    </button>
                                                </div>
                                                <div className="bottom-total-fixed">
                                                    Total{" "}
                                                    <span>
                                                        {USDollar.format(
                                                            tempTotalCost
                                                        )}

                                                        {/* {subscriptionData
                                                            ? USDollar.format(
                                                                  Number(
                                                                      subscriptionData.details
                                                                          .reduce(
                                                                              (
                                                                                  accumulator,
                                                                                  currentValue
                                                                              ) =>
                                                                                  accumulator +
                                                                                  Number(
                                                                                      currentValue.total_cost
                                                                                  ),
                                                                              0
                                                                          )
                                                                          .toFixed(
                                                                              2
                                                                          )
                                                                  )
                                                              )
                                                            : USDollar.format(
                                                                  0
                                                              )} */}
                                                    </span>
                                                </div>
                                            </div>
                                            {!subscriptionData?.subscription
                                                ?.is_canceled && (
                                                    <div
                                                        className="cancelSubscription cursor"
                                                        onClick={() => {
                                                            setState((prev) => ({
                                                                ...prev,
                                                                cancelSubscriptionModal:
                                                                    true,
                                                            }));
                                                        }}
                                                    >
                                                        Cancel Subscription
                                                    </div>
                                                )}
                                            {cancelSubscriptionModal && (
                                                <DeleteConfirmationModal
                                                    show={
                                                        cancelSubscriptionModal
                                                    }
                                                    handleClose={() =>
                                                        setState((prev) => ({
                                                            ...prev,
                                                            cancelSubscriptionModal:
                                                                false,
                                                        }))
                                                    }
                                                    confirmBtnClick={() => {
                                                        dispatch(
                                                            cancelSubscription(
                                                                access_token
                                                            )
                                                        ).then((result) => {
                                                            if (result) {
                                                                const {
                                                                    status,
                                                                    msg,
                                                                } = result;
                                                                if (
                                                                    status ===
                                                                    200
                                                                ) {
                                                                    editSubscriptionModal &&
                                                                        dispatch(
                                                                            toggleEditSubscriptionModal()
                                                                        );
                                                                    dispatch(
                                                                        clearSubscriptionData()
                                                                    );
                                                                    toast.success(
                                                                        msg
                                                                    );
                                                                    navigate(
                                                                        "/search"
                                                                    );
                                                                } else {
                                                                    toast.error(
                                                                        msg
                                                                    );
                                                                }
                                                            }
                                                        });
                                                    }}
                                                    content={
                                                        <p>
                                                            Are you sure you
                                                            want to cancel
                                                            subscription ?
                                                        </p>
                                                    }
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </Scrollbars>
            {editSubscriptionModal && (
                <EditSubModal
                    handleSubModal={() => {
                        setState((prev) => ({
                            ...prev,
                            cancelSubscriptionModal: true,
                        }));
                    }}
                />
            )}
        </div>
    );
};

export default withSideNav(PlanSettingsView);
