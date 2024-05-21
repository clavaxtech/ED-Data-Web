import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import {
    clearFilterSearch,
    clearPermitData,
    clearProductionData,
    clearRigsData,
    clearWellsData,
    handleCheckedItemList,
    // handlePageChange,
    handleShowAndHideSegmentDropDown,
    // setFilterSearch,
    showHideAdvFilter,
    showHideColProperties,
    showHideCsvDownOpt,
    showHideFullScreen,
    toggleViewAnalytics,
} from "../../store/actions/wells-rigs-action";
// import { debounce } from "lodash";
// import Scrollbars from "react-custom-scrollbars";
import ColFilterOption from "./ColFilterOption";
import ExportToCsvOpt from "./ExportToCsvOpt";
import { toggleAoiSideCon } from "../../store/actions/aoi-actions";
import { handleClearAllFilter, handleHideSearchFilter } from "../../store/actions/cart-basin-to-county-actions";
import {
    aoiPathname, modifyString,
    // numberRegex, 
    searchPathname
} from "../../../utils/helper";
import { ProductionDataObj, RigsDataObj, WellsAndPermitsObject } from "../../models/redux-models";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "../Spinner";
import { fetchSegmentsList, fetchSelectedSegmentDetails, handleSelectedRowId } from "../../store/actions/segments-actions";
import { FilterDataType } from "../../segments/Content";
import { toast } from "react-toastify";

function Filter() {
    const searchRef = React.createRef<HTMLInputElement>();
    const dispatch = useAppDispatch();
    const {
        wellsAndRigs: { colProperties, tabIndex, filterSearch, csvDownOpt,
            fullScreen,
            checkedItemList,
            advFilter, wellsData: { data: wellsDataList }, permitsData: { data: permitDataList }, rigsData: { data: rigsDataList }, showSegmentDropDown, productionData: { data: productionDataList } },
        aoi: { showAoiSideCon },
        segments: {
            activeSegmentList: { data: segmentData, dataLoading, total_record, page_size },
            page,
            selectedRowId,
            selectedSegmentData
        },
        auth: { user: { access_token } },
        cartBasinToCounty: { clearAllFilter }
    } = useAppSelector((state) => state);


    const clearSearch = () => {
        searchRef.current &&
            (searchRef.current.value = "");
        dispatch(clearFilterSearch());
        // note:- if clearAllFilter is true do not call reset data
        if (!clearAllFilter) {
            if (tabIndex === 0) {
                dispatch(clearWellsData());
            } else if (tabIndex === 1) {
                dispatch(clearRigsData());
            } else if (tabIndex === 2) {
                dispatch(clearPermitData());
            } else {
                dispatch(clearProductionData())
            }
        }

    }

    useEffect(() => {
        if (clearAllFilter) {
            clearSearch();
            dispatch(handleClearAllFilter(false))
        }
        // eslint-disable-next-line
    }, [clearAllFilter])


    // const onSearchChange = debounce(
    //     (e: React.ChangeEvent<HTMLInputElement>) => {
    //         const { value } = e.target;
    //         if (value === "") {
    //             if (tabIndex === 0) {
    //                 dispatch(setFilterSearch(""));
    //                 dispatch(handlePageChange(1));
    //                 dispatch(clearWellsData());
    //             } else if (tabIndex === 1) {
    //                 dispatch(setFilterSearch(""));
    //                 dispatch(handlePageChange(1));
    //                 dispatch(clearRigsData());
    //             } else if (tabIndex === 2) {
    //                 dispatch(setFilterSearch(""));
    //                 dispatch(handlePageChange(1));
    //                 dispatch(clearPermitData());
    //             } else {
    //                 dispatch(setFilterSearch(""));
    //                 dispatch(handlePageChange(1));
    //                 dispatch(clearProductionData());
    //             }
    //             return;
    //         }
    //         if (value.length >= 2) {
    //             dispatch(setFilterSearch(numberRegex.test(value.trim().replace(',', '')) ? value.trim().replace(',', '') : value.trim()));
    //             if (tabIndex === 0) {
    //                 dispatch(handlePageChange(1));
    //                 dispatch(clearWellsData());
    //             } else if (tabIndex === 1) {
    //                 dispatch(handlePageChange(1));
    //                 dispatch(clearRigsData());
    //             } else if (tabIndex === 2) {
    //                 dispatch(handlePageChange(1));
    //                 dispatch(clearPermitData());
    //             }
    //             else {
    //                 dispatch(handlePageChange(1));
    //                 dispatch(clearProductionData());
    //             }
    //         }
    //     },
    //     500
    // );
    // const onSearchChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    //     const { key } = e;
    //     console.log({ searchRef })
    //     if (key === "Enter") {
    //         if (searchRef.current && (searchRef.current.value === "")) {
    //             if (tabIndex === 0) {
    //                 dispatch(setFilterSearch(""));
    //                 dispatch(handlePageChange(1));
    //                 dispatch(clearWellsData());
    //             } else if (tabIndex === 1) {
    //                 dispatch(setFilterSearch(""));
    //                 dispatch(handlePageChange(1));
    //                 dispatch(clearRigsData());
    //             } else if (tabIndex === 2) {
    //                 dispatch(setFilterSearch(""));
    //                 dispatch(handlePageChange(1));
    //                 dispatch(clearPermitData());
    //             } else {
    //                 dispatch(setFilterSearch(""));
    //                 dispatch(handlePageChange(1));
    //                 dispatch(clearProductionData());
    //             }
    //             return;
    //         }
    //         if (searchRef.current && searchRef.current.value.length >= 1) {
    //             dispatch(setFilterSearch(numberRegex.test(searchRef.current.value.trim().replace(',', '')) ? searchRef.current.value.trim().replace(',', '') : searchRef.current.value.trim()));
    //             if (tabIndex === 0) {
    //                 dispatch(handlePageChange(1));
    //                 dispatch(clearWellsData());
    //             } else if (tabIndex === 1) {
    //                 dispatch(handlePageChange(1));
    //                 dispatch(clearRigsData());
    //             } else if (tabIndex === 2) {
    //                 dispatch(handlePageChange(1));
    //                 dispatch(clearPermitData());
    //             }
    //             else {
    //                 dispatch(handlePageChange(1));
    //                 dispatch(clearProductionData());
    //             }
    //         }
    //     }
    // }
    // useEffect(() => {
    //     searchRef.current && (searchRef.current.value = "");
    //     // eslint-disable-next-line
    // }, [tabIndex]);

    const fetchData = () => {
        dispatch(
            fetchSegmentsList(access_token, {
                type: "active",
                page: page + 1,
            })
        );
    };

    const [state, setState] = useState({
        hasMore: false,
        segmentName: "",
        segmentId: 0
    })
    const { hasMore, segmentName, segmentId } = state
    useEffect(() => {
        if (showSegmentDropDown && total_record) {
            let pages =
                Math.floor(total_record / page_size) +
                (total_record % page_size > 0 ? 1 : 0);
            setState((prev) => ({
                ...prev,
                hasMore: page < pages ? true : false,
            }));
        }

        // eslint-disable-next-line
    }, [total_record, page]);

    useEffect(() => {
        if (dataLoading && showSegmentDropDown) {
            dispatch(fetchSegmentsList(access_token, { type: "active", page }, true));
        }
        // eslint-disable-next-line
    }, [showSegmentDropDown])

    useEffect(() => {
        if (selectedSegmentData.length > 0) {
            advFilter && dispatch(showHideAdvFilter());

            let tempData = [...selectedSegmentData];
            tempData[0] = { ...tempData[0], group_cond: "4" };
            let tempTransformData: FilterDataType[] = [];
            tempData.forEach((item) => {
                if (item.group_cond) {
                    tempTransformData.push({
                        condition: item.option_choice,
                        groupCondition: item.group_cond,
                        filter: [
                            {
                                id: item.id,
                                segment_id: item.segment_id,
                                dataPoint: item.data_point,
                                fields: item.data_point_field,
                                operator: item.operator_choice,
                                //this value key will be over written by the below condition this is just done to overcome the typescript error
                                value: item.filter_value as any,
                                ...((item.data_point_field === "16" ||
                                    item.data_point_field === "17" ||
                                    item.data_point_field === "18") &&
                                    item.operator_choice === "14"
                                    ? {
                                        value: new Date(
                                            JSON.parse(
                                                modifyString(
                                                    item.filter_value as string
                                                )
                                            ).start
                                        ),
                                        endDate: new Date(
                                            JSON.parse(
                                                modifyString(
                                                    item.filter_value as string
                                                )
                                            ).end
                                        ),
                                    }
                                    : item.data_point_field === "7"
                                        ? {
                                            ...(item.operator_choice === "4" && {
                                                value: (
                                                    item.filter_value as string
                                                ).split("_")[0],
                                                upperValue: (
                                                    item.filter_value as string
                                                ).split("_")[1],
                                            }),
                                            ...(item.operator_choice !== "4" && {
                                                value: item.filter_value,
                                            }),
                                        }
                                        : item.data_point_field === "9"
                                            ? {
                                                value: (
                                                    item.filter_value as string
                                                ).split("_")[0],
                                                //   upperValue: `${
                                                //       (
                                                //           item.filter_value as string
                                                //       ).split("_")[1]
                                                //   } ( ${
                                                //       (
                                                //           item.filter_value as string
                                                //       ).split("_")[2]
                                                //   } )`,
                                                upperValue: {
                                                    label: (
                                                        item.filter_value as string
                                                    ).split("_")[1],
                                                    value: (
                                                        item.filter_value as string
                                                    ).split("_")[2],
                                                },
                                            }
                                            : { value: item.filter_value }),
                            },
                        ],
                    });
                } else {
                    let index = tempTransformData.length - 1;
                    tempTransformData[index] = {
                        ...tempTransformData[index],
                        filter: [
                            ...tempTransformData[index]?.filter,
                            {
                                id: item.id,
                                segment_id: item.segment_id,
                                dataPoint: item.data_point,
                                fields: item.data_point_field,
                                operator: item.operator_choice,
                                //this value key will be over written by the below condition this is just done to overcome the typescript error
                                value: item.filter_value as any,
                                ...((item.data_point_field === "16" ||
                                    item.data_point_field === "17" ||
                                    item.data_point_field === "18") &&
                                    item.operator_choice === "14"
                                    ? {
                                        value: new Date(
                                            JSON.parse(
                                                modifyString(
                                                    item.filter_value as string
                                                )
                                            ).start
                                        ),
                                        endDate: new Date(
                                            JSON.parse(
                                                modifyString(
                                                    item.filter_value as string
                                                )
                                            ).end
                                        ),
                                    }
                                    : item.data_point_field === "7"
                                        ? {
                                            ...(item.operator_choice === "4" && {
                                                value: (
                                                    item.filter_value as string
                                                ).split("_")[0],
                                                upperValue: (
                                                    item.filter_value as string
                                                ).split("_")[1],
                                            }),
                                            ...(item.operator_choice !== "4" && {
                                                value: item.filter_value,
                                            }),
                                        }
                                        : item.data_point_field === "9"
                                            ? {
                                                value: (
                                                    item.filter_value as string
                                                ).split("_")[0],
                                                //   upperValue: (
                                                //       item.filter_value as string
                                                //   ).split("_")[1],
                                                upperValue: {
                                                    label: (
                                                        item.filter_value as string
                                                    ).split("_")[2],
                                                    value: (
                                                        item.filter_value as string
                                                    ).split("_")[1],
                                                },
                                            }
                                            : { value: item.filter_value }),
                            },
                        ],
                    };
                }
            });
            localStorage.setItem(
                "advFilData",
                JSON.stringify({
                    data: tempTransformData,
                    segmentName,
                    segmentId
                })
            );
            dispatch(showHideAdvFilter());
        }
        // eslint-disable-next-line
    }, [JSON.stringify(selectedSegmentData)])

    useEffect(() => {
        let data = tabIndex === 0 ? wellsDataList?.filter(item => item.checked) : tabIndex === 1 ? rigsDataList?.filter(item => item.checked) : tabIndex === 2 ? permitDataList?.filter(item => item.checked) : productionDataList?.filter(item => item.checked);
        data && dispatch(handleCheckedItemList(data));
        // eslint-disable-next-line
    }, [JSON.stringify(wellsDataList), JSON.stringify(permitDataList), JSON.stringify(productionDataList), JSON.stringify(rigsDataList), tabIndex])

    return (
        <>
            <div className="search-bottom">
                <div className="search-bottom-left">
                    {/* <div className="search-frm">
                        <div className="api">
                            <input
                                className="form-control"
                                placeholder={`Search for specific ${tabIndex === 0
                                    ? "wells"
                                    : tabIndex === 1
                                        ? "rigs"
                                        : tabIndex === 2 ? "permits" : "production"
                                    }`}
                                // onChange={onSearchChange}
                                onKeyDown={onSearchChange}
                                name="search"
                                ref={searchRef}
                            />
                        </div>
                        <span className="error"></span>
                    </div> */}
                    <div
                        className="ad-filter"
                        onClick={() => {
                            fullScreen && dispatch(showHideFullScreen());
                            dispatch(showHideAdvFilter());
                        }}
                    >
                        <a
                            href="void:(0)"
                            onClick={(e) => e.preventDefault()}
                            className="btn"
                        >
                            <img src="images/ad-filter.svg" alt="" />
                            Advanced Filters
                            <span onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                dispatch(handleShowAndHideSegmentDropDown(!showSegmentDropDown));
                            }} className="down-arrow">&nbsp;</span>
                        </a>
                        {/*add open to open dropdown  */}
                        <div className={`dropdownMenu segmentsSection-scroll scrollSection ${showSegmentDropDown ? "open" : ""}`}
                            id={'segmentList'}
                            style={{
                                minHeight: 0,
                                // maxHeight: "calc(100vh - 50rem)",
                                maxHeight: "16rem"
                            }}
                        >
                            <InfiniteScroll
                                dataLength={segmentData.length}
                                next={fetchData}
                                hasMore={hasMore}
                                scrollThreshold={0.8}
                                loader={<Spinner />}
                                style={{ overflow: "hidden" }}
                                scrollableTarget={"segmentList"}
                            >
                                <h2>Saved Segments</h2>
                                <ul>
                                    {dataLoading ? <li><a href="void:(0)" onClick={(e) => { e.preventDefault(); e.stopPropagation() }}>Loading...</a></li> :
                                        segmentData.map((item, index) => {
                                            return <li key={index}><a href="void:(0)" onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (
                                                    item.id !==
                                                    selectedRowId
                                                ) {
                                                    advFilter && dispatch(showHideAdvFilter())
                                                    setState((prev) => ({ ...prev, segmentId: item.id, segmentName: item.segment_name }))
                                                    dispatch(
                                                        handleSelectedRowId(
                                                            item.id
                                                        )
                                                    );
                                                    dispatch(
                                                        fetchSelectedSegmentDetails(
                                                            access_token,
                                                            item.id
                                                        )
                                                    );
                                                } else {
                                                    dispatch(
                                                        handleSelectedRowId(
                                                            0
                                                        )
                                                    );
                                                    dispatch(showHideAdvFilter())
                                                }
                                            }}>{item.segment_name}{item.id === selectedRowId ? <span style={{ color: "#fff", background: "#16A15E", borderRadius: "100%", padding: "1px", fontSize: "10px", width: "16px", height: "16px", textAlign: "center" }}><i className="fa-solid fa-check"></i></span> : <></>}</a></li>
                                        })
                                    }
                                </ul>
                            </InfiniteScroll>

                        </div>
                    </div>
                </div>
                <div className="search-menu">
                    <ul>
                        <li
                            title="Choose Columns"
                        >
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

                                <h2>Column properties</h2>
                                <ColFilterOption />

                            </div>
                        </li>
                        <li
                            title={fullScreen ? "Minimize" : "Maximize"}
                        >
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
                        <li
                            title={"Export Data"}
                        >
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
                            {checkedItemList?.length && !csvDownOpt ? <span className="badge">{checkedItemList.length}</span> : <></>}
                            <ExportToCsvOpt selectedRowData={(checkedItemList || []) as (WellsAndPermitsObject[] | RigsDataObj[] | ProductionDataObj[])} />
                        </li>
                        <li
                            onClick={() => {

                                if (checkedItemList.length) {
                                    window.location.pathname === aoiPathname && showAoiSideCon && dispatch(toggleAoiSideCon());
                                    window.location.pathname === searchPathname && dispatch(handleHideSearchFilter(false));
                                    dispatch(toggleViewAnalytics());
                                } else {
                                    toast.info("Please select at-least one well.")
                                }
                            }}
                        >
                            <a
                                className="view-analytics"
                                onClick={(e) => e.preventDefault()}
                                href="void:(0)"
                            >
                                <img src="images/search-icon4.svg" alt="" />{" "}
                                View analytics
                            </a>
                            {/* <AnalyticsRightSidebar /> */}
                        </li>
                    </ul>
                </div>
            </div>
            <div className="filterbySection">
                {filterSearch && (
                    <div className="filter-by">
                        Filter By:{" "}
                        <span>
                            {filterSearch}
                            <small
                                className="cursor"
                                onClick={() => {
                                    clearSearch()
                                }}
                            >
                                X
                            </small>
                        </span>
                    </div>
                )}
            </div>
        </>
    );
}

export default Filter;
