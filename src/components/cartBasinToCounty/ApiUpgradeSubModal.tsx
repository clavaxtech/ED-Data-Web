import React, { useEffect, useState } from "react";
import GlobalModal from "../common/GlobalModal";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import {
    showCheckOutModal,
    toggleApiUpgradeSubModal,
    toggleUploadingCsvApiListModal,
} from "../store/actions/modal-actions";
import GlobalTable from "../common/GlobalTable";
import { GlobalTableProps } from "../models/page-props";
import useApiUpgradeSubBasinTab from "./useApiUpgradeSubBasinTab";
import useApiUpgradeSubCountyTab from "./useApiUgradeSubCountyTab";
import { BasinObjApiList, CountyObjApiList } from "../models/submit-form";
import Scrollbars from "react-custom-scrollbars";
import { DO_NOT_SHOW_UPGRADE_MODAL } from "../../utils/helper";
import {
    addAllBasinOrCountyToCart,
    removeItemFromCartInApiListUpgradeModal,
} from "../store/actions/cart-basin-to-county-actions";

function ApiUpgradeSubModal({
    handleConWithoutUpgrade,
    byBasinTabData,
    byCountyTabData,
}: {
    handleConWithoutUpgrade: () => void;
    byBasinTabData: BasinObjApiList[];
    byCountyTabData: CountyObjApiList[];
}) {
    const {
        modal: { apiUpgradeSubModal },
        auth: {
            user: { access_token },
        },
        cartSelectBasinCounty: { cartListItems },
    } = useAppSelector((state) => state);

    const [state, setState] = useState<{
        tabIndex: 1 | 2;
        selectedAll: boolean;
        doNotShowPopAgain: boolean;
        basinTabData: BasinObjApiList[];
        countyTabData: CountyObjApiList[];
    }>({
        tabIndex: 1,
        selectedAll: false,
        doNotShowPopAgain: false,
        basinTabData: [],
        countyTabData: [],
    });

    const {
        tabIndex,
        selectedAll,
        doNotShowPopAgain,
        basinTabData,
        countyTabData,
    } = state;

    const dispatch = useAppDispatch();

    useEffect(() => {
        setState((prev) => ({
            ...prev,
            basinTabData: byBasinTabData,
            countyTabData: byCountyTabData,
        }));
    }, [byBasinTabData, byCountyTabData]);

    const handleBasinOrCountyAdd = () => {
        let countyTemp = byCountyTabData.filter(
            (item) =>
                !JSON.stringify(cartListItems).includes(
                    JSON.stringify(item.basin_name)
                )
        );
        setState((prev) => ({
            ...prev,
            countyTabData: countyTemp,
            selectedAll:
                prev.tabIndex === 2
                    ? countyTemp.length > 0 &&
                      countyTemp.filter((_item) =>
                          JSON.stringify(cartListItems).includes(_item.county)
                      ).length === countyTemp.length
                        ? true
                        : false
                    : basinTabData.length > 0 &&
                      basinTabData.filter((_item) =>
                          JSON.stringify(cartListItems).includes(
                              _item.basin_name
                          )
                      ).length === basinTabData.length
                    ? true
                    : false,
        }));
    };

    useEffect(() => {
        handleBasinOrCountyAdd();
        // eslint-disable-next-line
    }, [cartListItems]);

    return (
        <GlobalModal
            show={apiUpgradeSubModal}
            center={true}
            onHide={() => {
                dispatch(toggleApiUpgradeSubModal());
                dispatch(toggleUploadingCsvApiListModal());
            }}
            contentClass={"saveAsAoi CartSearchCon subscriptionRequired "}
        >
            <h5>
                <i className="fa-solid fa-circle-exclamation"></i> Subscription
                Upgrade Required
            </h5>
            <div className="unsubscribed">
                You've Uploaded Data for an Unsubscribed Region
            </div>
            <div className="content-text">
                <p>
                    It appears that you've uploaded information for counties
                    that are not currently included in your subscription plan.
                    To access data for these counties, you'll need to upgrade
                    your subscription.
                </p>
                <p>
                    By upgrading your subscription, you'll not only gain access
                    to the data you've uploaded but also to a wealth of
                    additional features and insights for counties added to your
                    account.
                </p>
            </div>
            <div className="tabbutton-block">
                <ul className="nav" id="myTabfiles" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button
                            className="nav-link active"
                            id="bybasin-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#bybasin"
                            onClick={() => {
                                tabIndex !== 1 &&
                                    setState((prev) => ({
                                        ...prev,
                                        tabIndex: 1,
                                        selectedAll:
                                            basinTabData.length > 0 &&
                                            basinTabData.filter((_item) =>
                                                JSON.stringify(
                                                    cartListItems
                                                ).includes(_item.basin_name)
                                            ).length === basinTabData.length
                                                ? true
                                                : false,
                                    }));
                            }}
                            type="button"
                            role="tab"
                            aria-controls="bybasin"
                            aria-selected="true"
                        >
                            By Basin
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className="nav-link"
                            id="bycounty-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#bycounty"
                            onClick={() => {
                                tabIndex !== 2 &&
                                    setState((prev) => ({
                                        ...prev,
                                        tabIndex: 2,
                                        selectedAll:
                                            countyTabData.length > 0 &&
                                            countyTabData.filter((_item) =>
                                                JSON.stringify(
                                                    cartListItems
                                                ).includes(_item.county)
                                            ).length === countyTabData.length
                                                ? true
                                                : false,
                                    }));
                            }}
                            type="button"
                            role="tab"
                            aria-controls="bycounty"
                            aria-selected="false"
                        >
                            By County
                        </button>
                    </li>
                </ul>
                <div className="button">
                    {!selectedAll ? (
                        <button
                            type="button"
                            className="btn btn-primary"
                            disabled={
                                tabIndex === 1
                                    ? basinTabData.length === 0
                                        ? true
                                        : false
                                    : countyTabData.length === 0
                                    ? true
                                    : false
                            }
                            onClick={() => {
                                if (tabIndex === 1) {
                                    // For deleting the county that is in cart
                                    let tempArray = byCountyTabData
                                        .filter((item) =>
                                            JSON.stringify(
                                                cartListItems
                                            ).includes(
                                                JSON.stringify(item.county)
                                            )
                                        )
                                        .map((_item) => ({
                                            county: _item.county,
                                            state_abbr: _item.state,
                                        }));
                                    tempArray.length > 0 &&
                                        dispatch(
                                            removeItemFromCartInApiListUpgradeModal(
                                                access_token,
                                                {
                                                    cat: "by_county",
                                                    search: tempArray,
                                                },
                                                true
                                            )
                                        );
                                    // adding left basin in cart
                                    dispatch(
                                        addAllBasinOrCountyToCart(
                                            access_token,
                                            {
                                                cat: "basin",
                                                search: byBasinTabData
                                                    .filter(
                                                        (item) =>
                                                            !JSON.stringify(
                                                                cartListItems
                                                            ).includes(
                                                                item.basin_name
                                                            )
                                                    )
                                                    .map(
                                                        (_item) =>
                                                            _item.basin_name
                                                    ),
                                            }
                                        )
                                    );
                                } else {
                                    dispatch(
                                        addAllBasinOrCountyToCart(
                                            access_token,
                                            {
                                                cat: "county",
                                                search: byCountyTabData
                                                    .filter(
                                                        (item) =>
                                                            !JSON.stringify(
                                                                cartListItems
                                                            ).includes(
                                                                JSON.stringify(
                                                                    item.county
                                                                )
                                                            )
                                                    )
                                                    .map((_item) => ({
                                                        state_abbr: _item.state,
                                                        county: _item.county,
                                                    })),
                                            }
                                        )
                                    );
                                }
                            }}
                        >
                            Add all to cart
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="btn deselect-all"
                            onClick={() => {
                                if (tabIndex === 1) {
                                    dispatch(
                                        removeItemFromCartInApiListUpgradeModal(
                                            access_token,
                                            {
                                                cat: "by_basin",
                                                search: basinTabData.map(
                                                    (item) => item.basin_name
                                                ),
                                            }
                                        )
                                    );
                                } else {
                                    dispatch(
                                        removeItemFromCartInApiListUpgradeModal(
                                            access_token,
                                            {
                                                cat: "by_county",
                                                search: countyTabData.map(
                                                    (item) => ({
                                                        state_abbr: item.state,
                                                        county: item.county,
                                                    })
                                                ),
                                            }
                                        )
                                    );
                                }
                            }}
                        >
                            Deselect all
                        </button>
                    )}
                </div>
            </div>
            <div className="tab-content" id="myTabContentfiles">
                <div
                    className="tab-pane fade show active"
                    id="bybasin"
                    role="tabpanel"
                    aria-labelledby="bybasin-tab"
                >
                    <div className="searchList">
                        <Scrollbars
                            className="subscription-upgrade-scroll"
                            autoHeight
                            autoHeightMax={350}
                            renderThumbVertical={(props) => (
                                <div {...props} className="thumb-vertical" />
                            )}
                            renderTrackVertical={(props) => (
                                <div {...props} className="track-vertical" />
                            )}
                        >
                            <GlobalTable
                                tableStyle={{
                                    border: 0,
                                    cellPadding: 0,
                                    cellSpacing: 0,
                                    minWidth: "inherit",
                                    width:"100%"
                                }}
                                cols={
                                    useApiUpgradeSubBasinTab(
                                        byCountyTabData
                                    ) as GlobalTableProps["cols"]
                                }
                                data={basinTabData}
                            />
                        </Scrollbars>
                    </div>
                </div>
                <div
                    className="tab-pane fade"
                    id="bycounty"
                    role="tabpanel"
                    aria-labelledby="bycounty-tab"
                >
                    <div className="searchList">
                        <Scrollbars
                              autoHeightMax={350}
                            className="subscription-upgrade-scroll"
                            autoHeight
                          renderThumbVertical={(props) => (
                                <div {...props} className="thumb-vertical" />
                            )}
                            renderTrackVertical={(props) => (
                                <div {...props} className="track-vertical" />
                            )}
                        >
                            <GlobalTable
                                tableStyle={{
                                    border: 0,
                                    cellPadding: 0,
                                    cellSpacing: 0,
                                    minWidth: "inherit",
                                }}
                                cols={
                                    useApiUpgradeSubCountyTab() as GlobalTableProps["cols"]
                                }
                                data={countyTabData}
                            />
                        </Scrollbars>
                    </div>
                </div>
            </div>
            <div className="donot">
                <div className="custom-checkbox">
                    <input
                        name="rememberMe"
                        className="form-control checkmark"
                        type="checkbox"
                        checked={doNotShowPopAgain}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setState((prev) => ({
                                    ...prev,
                                    doNotShowPopAgain: e.target.checked,
                                }));
                                sessionStorage.setItem(
                                    DO_NOT_SHOW_UPGRADE_MODAL,
                                    JSON.stringify(true)
                                );
                            } else {
                                setState((prev) => ({
                                    ...prev,
                                    doNotShowPopAgain: e.target.checked,
                                }));
                                sessionStorage.removeItem(
                                    DO_NOT_SHOW_UPGRADE_MODAL
                                );
                            }
                        }}
                        id="rem"
                    />
                    <label htmlFor="rem" className="custom-label"></label>
                </div>{" "}
                {!doNotShowPopAgain ? (
                    <span
                        className="cursor"
                        onClick={() =>
                            setState((prev) => ({
                                ...prev,
                                doNotShowPopAgain: true,
                            }))
                        }
                    >
                        Do not show me this popup again.
                    </span>
                ) : (
                    <span
                        className="cursor"
                        onClick={() =>
                            setState((prev) => ({
                                ...prev,
                                doNotShowPopAgain: false,
                            }))
                        }
                    >
                        This popup will not appear again for the current
                        session.
                    </span>
                )}
            </div>
            <div className="action-footer">
                <button
                    type="button"
                    className="btn btn-outline-white"
                    onClick={handleConWithoutUpgrade}
                >
                    Continue without Upgrading
                </button>
                <button
                    type="button"
                    className="btn btn-green"
                    disabled={cartListItems.length ? false : true}
                    onClick={() => dispatch(showCheckOutModal())}
                >
                    Checkout
                </button>
            </div>
        </GlobalModal>
    );
}

export default ApiUpgradeSubModal;
