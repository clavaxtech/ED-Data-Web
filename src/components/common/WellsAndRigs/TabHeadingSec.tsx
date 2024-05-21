import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import {
    handleResizableWidth,
    handleShowAndHideTable,
    handleTabIndex,
    resetWellsAndRigsSliceToInitial,
    toggleViewAnalytics,
} from "../../store/actions/wells-rigs-action";
import { handleSelectedRowId } from "../../store/actions/segments-actions";
import { ANALYTICS_DEFAULT_WIDTH, numberFormat } from '../../../utils/helper';
// import { handleClearAllFilter } from "../../store/actions/cart-basin-to-county-actions";

function TabHeadingSec() {
    const dispatch = useAppDispatch();
    const {
        wellsAndRigs: {
            tabIndex,
            wellsData: {
                total_count: wells_total_count,
                // page_size: wellsPageSize,
            },
            rigsData: {
                total_count: rigs_total_count,
                // page_size: rigsPageSize,
            },
            // permitsData: {
            // total_count: permits_total_count,
            // page_size: permitPageSize,
            // },
            // productionData: {
            //     total_count: production_total_count,
            // page_size: permitPageSize,
            // },
            showTable,
            fullScrnAnalytics,
            resizableWidth,
            viewAnalytics
        },
    } = useAppSelector((state) => state);
    const tabHeading: { label: string; count: number; tab_index: 0 | 1 | 2 | 3 }[] =
        [
            {
                label: "Wells",
                count: wells_total_count,
                tab_index: 0,
            },
            // {
            //     label: "Permits",
            //     count: permits_total_count,
            //     tab_index: 2,
            // },
            // {
            //     label: "Production",
            //     count: production_total_count,
            //     tab_index: 3,
            // },
            {
                label: "Rigs",
                count: rigs_total_count,
                tab_index: 1,
            },
        ];

    return (
        <div className={`search-header ${fullScrnAnalytics ? "tableSearchHeaderTop" : ""}`}>
            <div className="search-top">
                <div className="searchByTab">
                    <ul className="nav" id="myTab" role="tablist">
                        {tabHeading.map((item, index) => {
                            const { label, count, tab_index } = item;
                            return (
                                <li
                                    className="nav-item"
                                    role="presentation"
                                    key={index}
                                    onClick={() => {
                                        if (tabIndex !== tab_index) {
                                            dispatch(handleTabIndex(tab_index));
                                            dispatch(handleSelectedRowId(0))
                                            dispatch(
                                                resetWellsAndRigsSliceToInitial(
                                                    true
                                                )
                                            );
                                        }
                                    }}
                                >
                                    <button
                                        className={`nav-link ${tab_index === tabIndex ? "active" : ""
                                            }`}
                                        id={`${label.toLowerCase()}-tab`}
                                        data-bs-toggle="tab"
                                        data-bs-target={`#${label.toLowerCase()}`}
                                        type="button"
                                        role="tab"
                                        aria-controls={`${label.toLowerCase()}`}
                                        aria-selected={
                                            index === 0 ? "true" : "false"
                                        }
                                    >
                                        {label}{" "}
                                        {/* {count !== 0 && <span>{count}</span>} */}
                                        <span>{numberFormat.format(count)}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className="clearfilterright">
                    {/* <button className={`btn clear-btn ${resizableWidth !== ANALYTICS_DEFAULT_WIDTH && viewAnalytics ? "d-none" : ""}`}
                        onClick={() => {
                            dispatch(handleClearAllFilter(true))
                        }}
                    ><img src="images/clear-filter.svg" alt="" /> Clear All Filters</button> */}
                    <div className={`showhidebtn ${fullScrnAnalytics ? "disabled" : ""}`} onClick={() => {
                        !fullScrnAnalytics && dispatch(handleShowAndHideTable(!showTable))
                        if (resizableWidth !== ANALYTICS_DEFAULT_WIDTH && viewAnalytics) {
                            dispatch(toggleViewAnalytics());
                            dispatch(handleResizableWidth(ANALYTICS_DEFAULT_WIDTH));
                        }

                    }}>
                        <button className="btn">{showTable ? "Hide" : "Show"} {showTable ? <img src="images/down-angle.png" alt="" /> : <img src="images/up-arrow2.svg" alt="" />}</button>
                    </div>
                </div>
                {/* <div className="search-menu">
                    <ul>
                        <li>
                            <a
                                href="void:(0)"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    dispatch(showHideColProperties());
                                    csvDownOpt &&
                                        dispatch(showHideCsvDownOpt());
                                }}
                            >
                                <img src="images/search-icon1.svg" alt="" />
                            </a>
                            <div
                                className={
                                    colProperties
                                        ? "column-properties-dropdown open"
                                        : "d-none"
                                }
                            >
                                <Scrollbars
                                    className="customTable lead-scroll"
                                    style={{ width: "100%" }}
                                    autoHeight
                                    autoHeightMin={0}
                                    autoHeightMax="22rem"
                                    renderThumbVertical={(props) => (
                                        <div
                                            {...props}
                                            className="thumb-vertical"
                                        />
                                    )}
                                    renderTrackVertical={(props) => (
                                        <div
                                            {...props}
                                            className="track-vertical"
                                        />
                                    )}
                                >
                                    <h2>Column properties</h2>
                                    <ColFilterOption />
                                </Scrollbars>
                            </div>
                        </li>
                        <li>
                            <a
                                href="void:(0)"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    !fullScreen &&
                                        advFilter &&
                                        dispatch(showHideAdvFilter());
                                    dispatch(showHideFullScreen());
                                }}
                            >
                                <img src="images/search-icon2.svg" alt="" />
                            </a>
                        </li>
                        <li>
                            <a
                                href="void:(0)"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    colProperties &&
                                        dispatch(showHideColProperties());
                                    dispatch(showHideCsvDownOpt());
                                }}
                            >
                                <img src="images/search-icon3.svg" alt="" />
                            </a>
                            <ExportToCsvOpt />
                        </li>
                        <li
                            onClick={() => {
                                window.location.pathname === aoiPathname && showAoiSideCon && dispatch(toggleAoiSideCon());
                                window.location.pathname === searchPathname && dispatch(handleHideSearchFilter(false));
                                dispatch(toggleViewAnalytics());
                            }}
                        >
                            <a
                                className="view-analytics"
                                onClick={(e) => e.preventDefault()}
                                href="void:(0)"
                            >
                                <img src="images/search-icon4.svg" alt="" />{" "}
                                View analytics
                            </a> */}
                {/* <AnalyticsRightSidebar /> */}
                {/* </li>
                    </ul>
                </div> */}
            </div>
        </div>
    );
}

export default TabHeadingSec;
