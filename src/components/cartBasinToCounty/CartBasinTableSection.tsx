import React from "react";
import { cartFilterprops } from "../models/page-props";
import "react-datepicker/dist/react-datepicker.css";
import CartBasinSearchList from "./CartBasinSearchList";
import SearchComponent from "../common/SearchComponent";
import {
    cartBasinSearchList,
    clearCartBasinSearchList,
    handleHideSearchFilter,
} from "../store/actions/cart-basin-to-county-actions";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import WellsAndRigsCom from "../common/WellsAndRigs/WellsAndRigsCom";
import {
    handleShowAndHideSegmentDropDown,
    showHideColProperties,
    showHideCsvDownOpt,
    toggleViewAnalytics,
} from "../store/actions/wells-rigs-action";
import AoIMap from "../map/AoIMap";
import { MapComponent, MapType } from "../common/MapComponent";
import AnalyticsRightSidebar from "../aoi/AnalyticsRightSidebar";

const CartBasinTableSection = (props: cartFilterprops) => {
    // let { searchBlockRef } = props;
    const dispatch = useAppDispatch();
    const {
        auth: {
            user: { access_token },
        },
        wellsAndRigs: { colProperties, csvDownOpt, viewAnalytics, showSegmentDropDown },
        cartBasinToCounty: { hideSearchFilter }
    } = useAppSelector((state) => state);

    const getSearchList = (value: string) => {
        dispatch(
            cartBasinSearchList(access_token, {
                category: "basin", // or county
                search: value,
            })
        );
    };

    const onSearchChange = (value: string) => {
        if (value?.length === 0) {
            dispatch(clearCartBasinSearchList());
            return;
        }

        if (value && value.length >= 2) {
            dispatch(clearCartBasinSearchList());
            getSearchList(value);
        }
    };

    const onSearchFocus = (e: React.FocusEvent<HTMLInputElement, Element>) => {
        const { value } = e.target;
        if (
            // basinSearchList.length === 0 &&
            // countySearchList.length === 0 &&
            value &&
            value?.length >= 2
        ) {
            dispatch(clearCartBasinSearchList());
            getSearchList(value);
        }
    };

    return (
        <>
            <div
                className="cart-map"
                onClick={() => {
                    //this is to close the menu when use click outside
                    colProperties && dispatch(showHideColProperties());
                    csvDownOpt && dispatch(showHideCsvDownOpt());
                    showSegmentDropDown && dispatch(handleShowAndHideSegmentDropDown(false))
                }}
            >
                {/* <div className="half-map"> */}
                <figure>
                    <div className="expandcollapsefilterbtn" onClick={((e) => {
                        e.preventDefault();
                        if (!hideSearchFilter) {
                            viewAnalytics && dispatch(toggleViewAnalytics());
                            dispatch(handleHideSearchFilter(true))
                        } else {
                            dispatch(handleHideSearchFilter(false));
                        }
                    })}>
                        {!hideSearchFilter ? <img src="images/angle-right.png" alt="" /> : <img src="images/angle-left.png" alt="" />}
                        {/* <img src="images/angle-right.png" alt="" /> */}
                    </div>
                    {/* {!hideSearchFilter && <div className="expand-call-btn" onClick={((e) => {
                        e.preventDefault();
                        viewAnalytics && dispatch(toggleViewAnalytics());
                        dispatch(handleHideSearchFilter(true))
                    })}><div><a href="void:(0)"><i className="fa-solid fa-angles-left"></i> <span>Expand</span></a></div></div>} */}
                    <MapComponent mapType={MapType.AOI} allowCreateAoI={true}/>
                </figure>
                {/* </div> */}
                <div className="search-header-form">
                    <div className="search-form" 
                    // ref={searchBlockRef}
                    >
                        <SearchComponent
                            placeholder={`Permian Basin`}
                            onSearchChange={onSearchChange}
                            onSearchBtnClick={getSearchList}
                            onFocus={onSearchFocus}
                        />
                        <CartBasinSearchList />
                    </div>
                    {/* <button className="filter-btn">
                        <img src="images/reset-filter.svg" alt="" />
                    </button> */}
                </div>
                <WellsAndRigsCom />
            </div>
            {/* {viewAnalytics && <AnalyticsRightSidebar />} */}
        </>
    );
};

export default CartBasinTableSection;
