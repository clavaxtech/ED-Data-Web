import React, { useLayoutEffect, useState, useEffect } from "react";
import { CartSelectBasinViewProps } from "../models/page-props";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import AvatarComponent from "./AvatarComponent";
import Card from "./Card";
import BasinTabContent from "./BasinTabContent";
import CountyTabContent from "./CountyTabContent";
import CardBottom from "./CardBottom";
import { CartSelectBasinViewState } from "../models/stateModel";
import SearchComponent from "../common/SearchComponent";
import {
    // eslint-disable-next-line
    clearCartItemsList,
    clearSearchList,
    deleteAllCartItems,
    getCartDetails,
    loadSearchList,
    removeCartItems,
} from "../store/actions/cart-select-basin-county-actions";
import SearchList from "./SearchList";
import DeleteConfirmationModal from "../common/Modal/DeleteConfirmationModal";
import { useLocation } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import PaymentModal from "../common/Modal/PaymentModal";
import { hideCheckOutModal } from "../store/actions/modal-actions";
import { loadStripe } from "@stripe/stripe-js";
import Scrollbars from "react-custom-scrollbars";

import { basinsUpdated, countiesUpdated } from "../map/redux/locations";
// import Map from "../map/Map";
import { MapComponent, MapType } from "../common/MapComponent";

const stripePromise = loadStripe(
    `${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`
);
const CartSelectBasinView = ({ activate }: CartSelectBasinViewProps) => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const {
        auth: {
            user: {
                access_token,
                company_data: { company_id },
                company_configs: { is_trial_never_end, free_trial_period_enabled, no_of_free_days_allowed }
            },
        },
        cartSelectBasinCounty: {
            cartListItems,
            cartItemsTotal,
            basinSearchList,
            countySearchList,
        },
        modal: { checkOutModal },
    } = useAppSelector((state) => state);
    const [state, setState] = useState<CartSelectBasinViewState>({
        isOpen: false,
        tabIndex: 1,
        deleteCartItemModal: false,
        deleteItemId: null,
        deleteItemType: null,
        sub_id: null,
        sub_total: 0,
    });
    const {
        isOpen,
        tabIndex,
        deleteCartItemModal,
        deleteItemId,
        deleteItemType,
        sub_id,
        sub_total,
    } = state;

    const toggleSettingDropDown = () => {
        setState((prev) => ({ ...prev, isOpen: !isOpen }));
    };

    const cancelBasinOrCounty = () => {
        dispatch(deleteAllCartItems(access_token));
        sub_id && setState((prev) => ({ ...prev, sub_id: null }));
    };

    const removeBasinOrCounty = (
        id: number,
        item_type: number,
        sub_total = 0
    ) => {
        setState((prev) => ({
            ...prev,
            deleteItemId: id,
            deleteCartItemModal: true,
            deleteItemType: item_type,
            ...(sub_total && { sub_total }),
        }));
    };

    const getSearchList = (value: string) => {
        dispatch(
            loadSearchList(access_token, {
                category: tabIndex === 1 ? "basin" : "county",
                search: value,
            })
        );
    };

    const onSearchChange = (value: string) => {
        if (value?.length === 0) {
            dispatch(clearSearchList());
            return;
        }

        if (value && value.length >= 2) {
            dispatch(clearSearchList());
            getSearchList(value);
        }
    };

    // const onSearchEnterKeyPress = (e: React.KeyboardEvent<HTMLElement>) => {
    //     if (e.key === "Enter" && searchRef.current) {
    //         getSearchList();
    //     }
    // };

    // const onSearchBlur = () => {
    //     dispatch(clearSearchList());
    // };

    const onSearchFocus = (e: React.FocusEvent<HTMLInputElement, Element>) => {
        const { value } = e.target;
        if (
            basinSearchList.length === 0 &&
            countySearchList.length === 0 &&
            value &&
            value?.length >= 2
        ) {
            dispatch(clearSearchList());
            getSearchList(value);
        }
    };

    useLayoutEffect(() => {
        dispatch(clearCartItemsList());
        if (location?.state?.sub_id) {
            dispatch(getCartDetails(access_token, location.state.sub_id));
            setState((prev) => ({ ...prev, sub_id: location.state.sub_id }));
            window.history.replaceState({}, document.title);
        } else {
            company_id && dispatch(getCartDetails(access_token));
        }
        // eslint-disable-next-line
    }, []);

    const clickOutSideSearch = () => {
        (document.getElementById("search") as HTMLInputElement).value = "";
        dispatch(clearSearchList());
    };

    useEffect(() => {
        if (tabIndex === 1) {
            dispatch(basinsUpdated([]))
        } else {
            dispatch(countiesUpdated([]))
        }
        // eslint-disable-next-line
    }, [tabIndex]);

    return (

        <div className="cart-map" onClick={() => {
            isOpen && toggleSettingDropDown();
        }}>
            <div className="CartSelectCon">
                <div
                    className="cart-select-left"
                    onClick={clickOutSideSearch}
                >
                    <div className="selected-Counties">
                        <img src="images/location.svg" alt="Map" /> Selected
                        Counties
                    </div>
                    <div className="selectbasinCon selectbasintotal">
                        {(free_trial_period_enabled && !is_trial_never_end) ? <h3 className="heading-free-trial">{no_of_free_days_allowed} Day Free Trial</h3> : <></>}
                        <Scrollbars
                            className={`tabcontent-scroll ${free_trial_period_enabled && Array.isArray(cartListItems) && cartListItems.length > 0 ? "tabcontentTrial" : ""}`}
                            autoHeightMin={0}
                            renderThumbVertical={props => < div {...props} className="thumb-vertical" />}
                            renderTrackVertical={props => < div {...props} className="track-vertical" />}
                        >
                            <div
                                className="tab-content"
                                id="pills-tabContent"
                            >
                                <div
                                    className="tab-pane show active"
                                    id="pills-basin"
                                    role="tabpanel"
                                    aria-labelledby="pills-by-basin-tab"
                                >
                                    {Array.isArray(cartListItems) &&
                                        cartListItems.length ? (
                                        cartListItems.map((item, index) => (
                                            <Card
                                                key={index}
                                                item={item}
                                                removeItem={removeBasinOrCounty}
                                                free_trial_period_enabled={free_trial_period_enabled}
                                            />
                                        ))
                                    ) : (
                                        <BasinTabContent />
                                    )}
                                </div>
                                <div
                                    className="tab-pane"
                                    id="pills-county"
                                    role="tabpanel"
                                    aria-labelledby="pills-by-county-tab"
                                >
                                    {Array.isArray(cartListItems) &&
                                        cartListItems.length ? (
                                        cartListItems.map((item, index) => (
                                            <Card
                                                key={index}
                                                item={item}
                                                removeItem={removeBasinOrCounty}
                                                free_trial_period_enabled={free_trial_period_enabled}
                                            />
                                        ))
                                    ) : (
                                        <CountyTabContent />
                                    )}
                                </div>
                            </div>
                        </Scrollbars>
                        <div className="totalandProfileboth">
                            {Array.isArray(cartListItems) &&
                                cartListItems.length > 0 && (
                                    <CardBottom
                                        cancelClick={cancelBasinOrCounty}
                                        total={cartItemsTotal}
                                    />
                                )}
                            {checkOutModal && (
                                <Elements stripe={stripePromise}>
                                    <PaymentModal
                                        onCancelBtnClick={() => {
                                            dispatch(hideCheckOutModal());
                                            activate();
                                        }}
                                        isEdit={
                                            sub_id
                                                ? true
                                                : cartListItems.filter(
                                                    (item) =>
                                                        item.subscription_det_id !==
                                                        null
                                                ).length > 0
                                                    ? true
                                                    : false
                                        }
                                        removeBasinOrCounty={
                                            removeBasinOrCounty
                                        }
                                    />
                                </Elements>
                            )}
                            <div className="bottom-part">
                                <div className="profile-block">
                                    <AvatarComponent
                                        dispatch={dispatch}
                                        isOpen={isOpen}
                                        toggleSettingDropDown={
                                            toggleSettingDropDown
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        {deleteCartItemModal && (
                            <DeleteConfirmationModal
                                show={deleteCartItemModal}
                                handleClose={() => {
                                    setState((prev) => ({
                                        ...prev,
                                        deleteItemId: null,
                                        deleteCartItemModal: false,
                                        deleteItemType: null,
                                    }));
                                }}
                                confirmBtnClick={() => {
                                    deleteItemId &&
                                        dispatch(
                                            removeCartItems(access_token, {
                                                item_id: deleteItemId,
                                                item_type:
                                                    deleteItemType as number,
                                                sub_total,
                                            })
                                        ).then((result) => {
                                            dispatch(
                                                getCartDetails(
                                                    access_token,
                                                    sub_id ? sub_id : 0
                                                )
                                            );
                                            setState((prev) => ({
                                                ...prev,
                                                deleteItemId: null,
                                                deleteCartItemModal: false,
                                                deleteItemType: null,
                                            }));
                                        });
                                }}
                                content={
                                    <p>
                                        Are you sure you want to remove this
                                        item from the cart?
                                    </p>
                                }
                            />
                        )}
                    </div>
                </div>
                <div className="cart-select-right">
                    <div className="search-header-form">
                        <div className="tab-nav">
                            <ul
                                className="nav nav-pills"
                                id="pills-tab"
                                role="tablist"
                            >
                                <li
                                    onClick={() => {
                                        clickOutSideSearch();
                                        setState((prev) => ({
                                            ...prev,
                                            tabIndex: 1,
                                        }));
                                    }}
                                >
                                    <a
                                        href="void:(0)"
                                        onClick={(e) => e.preventDefault()}
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
                                        clickOutSideSearch();
                                        setState((prev) => ({
                                            ...prev,
                                            tabIndex: 2,
                                        }));
                                    }}
                                >
                                    <a
                                        href="void:(0)"
                                        onClick={(e) => e.preventDefault()}
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
                        <div className="search-form">
                            <SearchComponent
                                placeholder={`Search for ${tabIndex === 1 ? "Basin" : "County"
                                    }...`}
                                onSearchChange={onSearchChange}
                                onSearchBtnClick={getSearchList}
                                onFocus={onSearchFocus}
                            />
                            <SearchList />
                        </div>
                    </div>

                    <figure onClick={clickOutSideSearch}>
                        <MapComponent mapType={MapType.Cart} allowSelection={true} />
                    </figure>
                </div>
            </div>
        </div>
    );
};

export default CartSelectBasinView;
