import React, { useEffect, useLayoutEffect } from "react";
import SearchComponent from "../common/SearchComponent";
import WellsAndRigsCom from "../common/WellsAndRigs/WellsAndRigsCom";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import {
    clearAoiNameSelForEdit,
    toggleAoiSideCon,
} from "../store/actions/aoi-actions";
import {
    getWellsAndPermitList,
    showHideAdvFilter,
    toggleViewAnalytics,
} from "../store/actions/wells-rigs-action";
import AnalyticsRightSidebar from "./AnalyticsRightSidebar";
import AoIMap from "../map/AoIMap";
import { MapComponent, MapType } from "../common/MapComponent";
// import FilterPanel from "../map/FilterPanel";
// import { UIPosition } from "../map/redux/types";

function AoiMainContent() {
    const onSearchChange = (value: string) => { };
    const onSearchFocus = () => { };
    const {
        aoi: {
            showAoiSideCon,
            aoiNameSelForEdit: { aoi_name },
        },
        wellsAndRigs: {
            tabIndex,
            wellsData: { wellsDataLoading },
            permitsData: { permitsDataLoading },
            rigsData: { rigsDataLoading },
            productionData: { productionDataLoading },
            selectedAoiData: { aoi_id: id },
            filterSearch,
            wellsPage,
            permitsPage,
            rigsPage,
            productionPage,
            sort_by,
            sort_order,
            advFilter,
            viewAnalytics
        },
        auth: {
            user: { access_token },
        },
    } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();

    useLayoutEffect(() => {
        advFilter && dispatch(showHideAdvFilter());
        viewAnalytics && dispatch(toggleViewAnalytics())
        // eslint-disable-next-line 
    }, []);

    useEffect(() => {
        if (wellsDataLoading && tabIndex === 0) {
            dispatch(
                getWellsAndPermitList(
                    access_token,
                    {
                        page: wellsPage,
                        ...(id && { aoi_id: id }),
                        ...(filterSearch && { search_param: filterSearch }),
                        ...(sort_order && { sort_order }),
                        ...(sort_by && { sort_by }),
                    },
                    wellsPage === 1 ? true : false
                )
            );
            return;
        }
        if (permitsDataLoading && tabIndex === 2) {
            dispatch(
                getWellsAndPermitList(
                    access_token,
                    {
                        page: permitsPage,
                        search_type: "permit",
                        ...(id && { aoi_id: id }),
                        ...(filterSearch && { search_param: filterSearch }),
                        ...(sort_order && { sort_order }),
                        ...(sort_by && { sort_by }),
                    },
                    permitsPage === 1 ? true : false
                )
            );
            return;
        }
        if (rigsDataLoading && tabIndex === 1) {
            dispatch(
                getWellsAndPermitList(
                    access_token,
                    {
                        page: rigsPage,
                        search_type: "rigs",
                        ...(id && { aoi_id: id }),
                        ...(filterSearch && { search_param: filterSearch }),
                        ...(sort_order && { sort_order }),
                        ...(sort_by && { sort_by }),
                    },
                    rigsPage === 1 ? true : false
                )
            );
            return;
        }
        if (productionDataLoading && tabIndex === 3) {
            dispatch(
                getWellsAndPermitList(
                    access_token,
                    {
                        page: productionPage,
                        search_type: "production",
                        ...(id && { aoi_id: id }),
                        ...(filterSearch && { search_param: filterSearch }),
                        ...(sort_order && { sort_order }),
                        ...(sort_by && { sort_by }),
                    },
                    productionPage === 1 ? true : false
                )
            );
            return;
        }
        // eslint-disable-next-line
    }, [wellsDataLoading, permitsDataLoading, tabIndex, id, rigsDataLoading, productionDataLoading]);
    return (
        <>
            <div className="cart-map">
                {/* <div className="half-map"> */}
                <figure>
                    <MapComponent mapType={MapType.AOI} allowCreateAoI={true}/>
                </figure>
                {/* </div> */}
                <div className={!showAoiSideCon ? "expand-btn" : "d-none"}>
                    <div onClick={(e) => {
                        e.preventDefault()
                        viewAnalytics && dispatch(toggleViewAnalytics())
                        dispatch(toggleAoiSideCon());
                    }}>
                        <a href="void:(0)">
                            <i className="fa-solid fa-arrow-right"></i>{" "}
                            <span>Expand</span>
                        </a>
                    </div>
                </div>
                <div className={aoi_name ? "aoi-sidebar-btn" : "d-none"}>
                    <ul>
                        <li>
                            <Link to="">
                                <img src="images/aoi-icons6.svg" alt="" />
                            </Link>
                            <div className="actions">
                                <Link className="first" to="">
                                    <img src="images/aoi-icons5.svg" alt="" />
                                </Link>
                                <Link to="">
                                    <img src="images/aoi-icons4.svg" alt="" />
                                </Link>
                                <Link to="">
                                    <img src="images/aoi-icons1.svg" alt="" />
                                </Link>
                                <Link className="last" to="">
                                    <img src="images/aoi-icons2.svg" alt="" />
                                </Link>
                            </div>
                            <div className="saveCart">
                                <h3>
                                    <span>Editing</span>
                                    {aoi_name}
                                </h3>
                                <div className="action-btn">
                                    <Link to="">
                                        <img
                                            src="images/aoi-icons7.svg"
                                            alt=""
                                        />
                                    </Link>
                                    <Link to="">
                                        <img
                                            src="images/aoi-icons8.svg"
                                            alt=""
                                        />
                                    </Link>
                                    <Link to="">
                                        <img
                                            src="images/aoi-icons9.svg"
                                            alt=""
                                        />
                                    </Link>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => {
                                            dispatch(clearAoiNameSelForEdit());
                                            dispatch(toggleAoiSideCon());
                                        }}
                                    >
                                        <i className="fa-regular fa-floppy-disk"></i>{" "}
                                        Save
                                    </button>
                                </div>
                            </div>
                        </li>
                        <li>
                            <Link to="">
                                <img src="images/aoi-icons3.svg" alt="" />
                            </Link>
                        </li>
                    </ul>
                </div>
                {!aoi_name && (
                    <div className="search-header-form">
                        <div className="search-form">
                            <SearchComponent
                                placeholder={`Search`}
                                name={"search"}
                                onSearchChange={onSearchChange}
                                onSearchBtnClick={() => { }}
                                onFocus={onSearchFocus}
                            />
                        </div>
                        {/* <button className="filter-btn">
                            <img src="images/reset-filter.svg" alt="" />
                        </button> */}
                    </div>
                )}

                <WellsAndRigsCom />
            </div>
            {/* {viewAnalytics && <AnalyticsRightSidebar />} */}
        </>
    );
}

export default AoiMainContent;
