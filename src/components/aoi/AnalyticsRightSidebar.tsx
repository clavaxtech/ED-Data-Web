import React, { useEffect, useState } from "react";
import Scrollbars from "react-custom-scrollbars";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import {
    getAnalyticsData,
    //  getAnalyticsDonutData,
    handleAnalyticsData, handleAnalyticsProdFilters, handleAnalyticsTabIndex,
    handleForecast,
    //  handleDonutChart, 
    handleFullScrnAnalytics, handleNormalize,
    handleResizableWidth,
    // handleOperatorPieChart,
    handleShowAndHideTable, toggleViewAnalytics
} from "../store/actions/wells-rigs-action";
import LineChart from "../common/LineChart";
import { ActionType, ProductionDataObj, RigsDataObj, WellsAndPermitsObject } from "../models/redux-models";
import {
    ANALYTICS_CUM_TAB, GAS, LINE_CHART_MAX_ITEM_ALLOWED, ANALYTICS_MONTHLY_TAB, OIL,
    //  OPERATOR,
    //  OPERATOR_PIE_CHART, 
    // PRODUCTION_DONUT_CHART,
    //   capitalize, 
    LINE_CHART_XAXIS_FILTERS, VERTICAL, DropDownOption, capitalize, ANALYTICS_DEFAULT_WIDTH,
    // actionType,
    //  downloadGraphImage
} from "../../utils/helper";
import { CSVLink } from "react-csv";
import moment from "moment";
// import DonutChart from "../common/DonutChart";
// import PieChart from "../common/PieChart";
import { DowData } from "../models/stateModel";
import { toast } from "react-toastify";
// import { logUserAction } from "../store/actions/auth-actions";

const AnalyticsRightSidebar = ({ resizableWidth, draggableRef, startDrag }: { resizableWidth: number, draggableRef: React.RefObject<HTMLDivElement>, startDrag: (event: React.MouseEvent<HTMLDivElement>) => void }) => {
    const {
        wellsAndRigs: { viewAnalytics, tabIndex,
            analyticsData: { oil_data, gas_data, monthlyDataLoading, cumDataLoading, type, cum_gas_data, cum_oil_data, xAxisFilter, xAxisFilterCum, normalized, action, action_cum, apiList, apiListObj, apiListObjLength, forecastingData: { dataList: forecastingData } },
            checkedItemList,
            // donutChart: {
            //     dataLoading: donutChartDataLoading,
            //     dataList
            // },
            showTable,
            analyticsTabIndex,
            // operatorPieChart: {
            // operatorPieChartDataList,
            // operatorPieChartDataLoading }
        },
        auth: { user: { access_token } }
    } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();
    const typeCurve = (xAxisFilter === LINE_CHART_XAXIS_FILTERS["Producing Time"] || xAxisFilterCum === LINE_CHART_XAXIS_FILTERS["Producing Time"]) ? true : false;

    useEffect(() => {

        if (checkedItemList.length === 0 && viewAnalytics) {
            dispatch(toggleViewAnalytics());
            dispatch(handleResizableWidth(ANALYTICS_DEFAULT_WIDTH));
            return
        }

        if (checkedItemList.length > 0 && viewAnalytics) {
            // let tempList = (checkedItemList.length > LINE_CHART_MAX_ITEM_ALLOWED ? [...checkedItemList].slice(0, LINE_CHART_MAX_ITEM_ALLOWED) : checkedItemList)
            let tempList = checkedItemList

            if (JSON.stringify(tempList) === JSON.stringify(apiListObj)) {
                return
            }

            let tempApiListObjLength = tempList.filter((_item) => {
                return tabIndex === 1 ? (_item as RigsDataObj)['profile']?.toLocaleLowerCase() === VERTICAL : (_item as WellsAndPermitsObject)["drill_type"]?.toLocaleLowerCase() === VERTICAL
            }).length
            // clean the data
            // dispatch(handleDonutChart({ dataLoading: true, data: [] }))
            // dispatch(handleOperatorPieChart({ operatorPieChartDataLoading: true, data: {} }));
            dispatch(handleAnalyticsData({ oilList: [], gasList: [], type: ANALYTICS_MONTHLY_TAB, monthlyDataLoading: true }));
            dispatch(handleAnalyticsData({ oilList: [], gasList: [], type: ANALYTICS_CUM_TAB, cumDataLoading: true }));


            dispatch(handleAnalyticsProdFilters({
                apiList: tempList?.map((item) => (tabIndex === 0 || tabIndex === 2) ? (item as WellsAndPermitsObject).well_api : tabIndex === 3 ? (item as ProductionDataObj).well_api : (item as RigsDataObj).api),
                apiListObj: tempList,
                apiListObjLength: tempApiListObjLength
            }))
            if (checkedItemList.length > LINE_CHART_MAX_ITEM_ALLOWED) {
                setState((prev) => ({
                    ...prev,
                    // showDropDownOption: true,
                    closeOilMaxMsg: false, closeGasMaxMsg: false
                }))
            }
            dispatch(handleAnalyticsProdFilters({ action: checkedItemList.length > LINE_CHART_MAX_ITEM_ALLOWED ? 'average' : 'none', type }));
            // setState((prev) => {
            //     return {
            //         ...prev,
            //         apiList: tempList?.map((item) => (tabIndex === 0 || tabIndex === 2) ? (item as WellsAndPermitsObject).well_api : tabIndex === 3 ? (item as ProductionDataObj).well_api : (item as RigsDataObj).api),
            //         apiListObj: tempList,
            //         apiListObjLength: tempApiListObjLength
            //     }
            // })
            ((tempApiListObjLength && normalized) || tempApiListObjLength) && toast.info("Your selection includes vertical wells.  These are not included in the normalization calculation.")
            tempList.length === tempApiListObjLength && dispatch(handleNormalize(false))

        }
        // eslint-disable-next-line
    }, [checkedItemList, viewAnalytics])

    const [state, setState] = useState<{ dowData: DowData[], showDropDownOption: boolean, closeOilMaxMsg: boolean, closeGasMaxMsg: boolean }>({ dowData: [], showDropDownOption: false, closeOilMaxMsg: false, closeGasMaxMsg: false })

    const { dowData, showDropDownOption, closeOilMaxMsg, closeGasMaxMsg } = state;

    useEffect(() => {
        if (apiList.length) {
            // if (apiList.length > LINE_CHART_MAX_ITEM_ALLOWED && (action === "none" && action_cum === "none")) {
            //     return
            // }
            if (analyticsTabIndex === 0) {
                //only selecting number (LINE_CHART_MAX_ITEM_ALLOWED) max allowed items api to send to backend
                // monthlyDataLoading && type === ANALYTICS_MONTHLY_TAB && dispatch(getAnalyticsData(access_token, { api_id: apiList, type: ANALYTICS_MONTHLY_TAB, action }, checkedItemList.length > LINE_CHART_MAX_ITEM_ALLOWED ? true : false));

                // cumDataLoading && type === ANALYTICS_CUM_TAB && dispatch(getAnalyticsData(access_token, { api_id: apiList, type: ANALYTICS_CUM_TAB, action: action_cum }, checkedItemList.length > LINE_CHART_MAX_ITEM_ALLOWED ? true : false))

                monthlyDataLoading && type === ANALYTICS_MONTHLY_TAB && dispatch(getAnalyticsData(access_token, { api_id: apiList, type: ANALYTICS_MONTHLY_TAB, action }, false));

                cumDataLoading && type === ANALYTICS_CUM_TAB && dispatch(getAnalyticsData(access_token, { api_id: apiList, type: ANALYTICS_CUM_TAB, action: action_cum }, false))


                // donutChartDataLoading && dispatch(getAnalyticsDonutData(access_token, { api_id: apiList }))

                return
            }

            // if (analyticsTabIndex === 1) {

            //     operatorPieChartDataLoading && dispatch(getAnalyticsDonutData(access_token, { api_id: apiList, type: OPERATOR }))
            //     return
            // }
        }

        // eslint-disable-next-line    
    }, [JSON.stringify(apiList), analyticsTabIndex, type, action, action_cum])

    const RenderForecastBtn = ({ typePro }: { typePro: typeof OIL | typeof GAS }) => {
        return <div className="graphBtn">
            <button
                onClick={() => {
                    if (checkedItemList.length > 1) { toast.info("Please limit selection to one well for forecasting."); }
                    else {
                        dispatch(handleShowAndHideTable(!showTable))
                        dispatch(toggleViewAnalytics());
                        dispatch(handleFullScrnAnalytics({ fullScrnAnalytics: true, fullScrnAnalyticsType: typePro === OIL ? OIL : GAS }))
                        dispatch(handleForecast(true))
                    }
                }}
                className={`btn ${((type === ANALYTICS_MONTHLY_TAB && xAxisFilter === LINE_CHART_XAXIS_FILTERS["Date Time"]) || (type === ANALYTICS_CUM_TAB && xAxisFilterCum === LINE_CHART_XAXIS_FILTERS["Date Time"])) ? "active" : ""}`}
                disabled={((type === ANALYTICS_MONTHLY_TAB && xAxisFilter === LINE_CHART_XAXIS_FILTERS["Date Time"]) || (type === ANALYTICS_CUM_TAB && xAxisFilterCum === LINE_CHART_XAXIS_FILTERS["Date Time"])) ? false : true}>Run Forecast{((type === ANALYTICS_MONTHLY_TAB && xAxisFilter === LINE_CHART_XAXIS_FILTERS["Date Time"]) || (type === ANALYTICS_CUM_TAB && xAxisFilterCum === LINE_CHART_XAXIS_FILTERS["Date Time"])) ? <></> : <span>Switch to Date Time view to enable Run Forecast functionality.</span>}</button>
            <button onClick={() => {
                if (checkedItemList.length > 1 && ((type === ANALYTICS_CUM_TAB && action_cum === "none") || (type === ANALYTICS_MONTHLY_TAB && action === "none"))) { toast.info(typeCurve ? "Please limit selection to one well to run type curve or perform aggregation." : "Please limit selection to one well for forecasting."); } else {
                    dispatch(handleShowAndHideTable(!showTable))
                    dispatch(toggleViewAnalytics());
                    dispatch(handleFullScrnAnalytics({ fullScrnAnalytics: true, fullScrnAnalyticsType: typePro === OIL ? OIL : GAS }))
                    dispatch(handleForecast(true))
                }
            }}
                className={`btn ${((type === ANALYTICS_MONTHLY_TAB && xAxisFilter === LINE_CHART_XAXIS_FILTERS["Producing Time"]) || (type === ANALYTICS_CUM_TAB && xAxisFilterCum === LINE_CHART_XAXIS_FILTERS["Producing Time"])) ? "active" : ""}`}
                disabled={((type === ANALYTICS_MONTHLY_TAB && xAxisFilter === LINE_CHART_XAXIS_FILTERS["Producing Time"]) || (type === ANALYTICS_CUM_TAB && xAxisFilterCum === LINE_CHART_XAXIS_FILTERS["Producing Time"])) ? false : true}>Run Type Curve{((type === ANALYTICS_MONTHLY_TAB && xAxisFilter === LINE_CHART_XAXIS_FILTERS["Producing Time"]) || (type === ANALYTICS_CUM_TAB && xAxisFilterCum === LINE_CHART_XAXIS_FILTERS["Producing Time"])) ? <></> : <span>Switch to Producing Time view to enable Type Curve functionality.</span>}</button>
        </div>
    }

    if (!viewAnalytics) {
        return <></>
    }

    return (
        <>
            <div className={`${viewAnalytics ? "analyticsCon open" : "d-none"}`}
                onClick={() => {
                    showDropDownOption && setState((prev) => ({ ...prev, showDropDownOption: false }))
                }}
                id="Resizable2"
                style={{
                    ...(viewAnalytics && { width: `${100 - (resizableWidth)}%` }),
                }}
            >
                <div
                    ref={draggableRef}
                    onMouseDown={startDrag}
                    className="draggableEle"
                ></div>
                <div className="analytics-header">
                    <span>
                        {" "}
                        <img src="images/analytics.svg" alt="" /> Analytics
                    </span>{" "}
                    <span className="close-btn"
                        onClick={(e) => {
                            dispatch(toggleViewAnalytics());
                            dispatch(handleResizableWidth(ANALYTICS_DEFAULT_WIDTH));
                            // dispatch(toggleAoiSideCon());
                        }}
                    >
                        <i className="fa-solid fa-xmark" />
                    </span>
                </div>
                <div className="analyticsTab">
                    <ul className="nav" id="myTabaoi" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button
                                className="nav-link active"
                                id="productionAnalytics-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#productionAnalytics"
                                type="button"
                                role="tab"
                                onClick={() => {
                                    if (analyticsTabIndex !== 0) {
                                        dispatch(handleFullScrnAnalytics({ fullScrnAnalytics: false }))
                                        dispatch(handleAnalyticsTabIndex(0))
                                    }
                                }}
                                aria-controls="productionAnalytics"
                                aria-selected={true}
                            >
                                <span className="text">Production</span>{" "}
                            </button>
                        </li>
                        {/* <li className="nav-item" role="presentation">
                        <button
                            className="nav-link"
                            id="operators-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#operators"
                            type="button"
                            role="tab"
                            aria-controls="operators"
                            onClick={() => {

                                if (analyticsTabIndex !== 1) {
                                    dispatch(handleFullScrnAnalytics({ fullScrnAnalytics: false }))
                                    dispatch(handleAnalyticsTabIndex(1))
                                }

                            }}
                            aria-selected={false}
                        >
                            <span className="text">Operators</span>{" "}
                        </button>
                    </li> */}
                        {/* <li className="nav-item" role="presentation">
                            <button
                                className="nav-link"
                                id="welltype-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#welltype"
                                type="button"
                                role="tab"
                                onClick={() => {
                                    if (analyticsTabIndex !== 2) {
                                        dispatch(handleFullScrnAnalytics({ fullScrnAnalytics: false }))
                                        dispatch(handleAnalyticsTabIndex(2))
                                    }
                                }}
                                aria-controls="welltype"
                                // aria-selected="false"
                                aria-selected={false}
                            >
                                <span className="text">Well</span>
                            </button>
                        </li> */}
                    </ul>
                </div>
                <div className="tab-content tabSection" id="myTabContentaoi">
                    <div
                        className="tab-pane fade show active"
                        id="productionAnalytics"
                        role="tabpanel"
                        aria-labelledby="productionAnalytics-tab"
                    >
                        <Scrollbars
                            className="cardsection-scroll"
                            renderThumbVertical={(props) => (
                                <div {...props} className="thumb-vertical" />
                            )}
                            renderTrackVertical={(props) => (
                                <div {...props} className="track-vertical" />
                            )}
                        >
                            <div className="analyticsHeader">
                                <div className="navli monthly">
                                    <Link className={type === ANALYTICS_MONTHLY_TAB ? "active" : ""} to={""}
                                        onClick={() => {
                                            if (type !== ANALYTICS_MONTHLY_TAB) {
                                                dispatch(handleFullScrnAnalytics({ fullScrnAnalytics: false }))
                                                dispatch(handleAnalyticsProdFilters({ type: ANALYTICS_MONTHLY_TAB }));
                                            }
                                        }}
                                    >Monthly</Link>
                                    <Link className={type === ANALYTICS_CUM_TAB ? "active" : ""} to={""} onClick={() => {
                                        if (type !== ANALYTICS_CUM_TAB) {
                                            dispatch(handleFullScrnAnalytics({ fullScrnAnalytics: false }))
                                            dispatch(handleAnalyticsProdFilters({ type: ANALYTICS_CUM_TAB }));
                                        }
                                    }}>Cum</Link>
                                </div>
                                <div className="navli timely">
                                    {Object.keys(LINE_CHART_XAXIS_FILTERS).map((item, index) => {
                                        let tempValue = LINE_CHART_XAXIS_FILTERS[item as keyof typeof LINE_CHART_XAXIS_FILTERS];

                                        return <Link className={tempValue === (type === ANALYTICS_MONTHLY_TAB ? xAxisFilter : xAxisFilterCum) ? "active" : ""} to={""} key={index}
                                            onClick={() => {
                                                if ((type === ANALYTICS_MONTHLY_TAB ? xAxisFilter : xAxisFilterCum) !== tempValue) {
                                                    dispatch(handleAnalyticsProdFilters({ xAxisFilterVal: tempValue, type }));
                                                }
                                            }}
                                        >{item}</Link>
                                    })}
                                </div>
                            </div>
                            <div className="card-box">
                                <div className="card-box-header">
                                    <div className="labelheading">Oil Production</div>
                                    <div className="action-btn">
                                        <Link to="" onClick={() => {
                                            dispatch(handleShowAndHideTable(!showTable))
                                            dispatch(toggleViewAnalytics());
                                            dispatch(handleFullScrnAnalytics({ fullScrnAnalytics: true, fullScrnAnalyticsType: OIL }))
                                        }}>
                                            <img
                                                src="images/full-screen.svg"
                                                alt=""
                                            />
                                        </Link>
                                        <CSVLink
                                            asyncOnClick={true}
                                            onClick={(event, done) => {



                                                let tempData: { well_api: string, production_date: string, production_quantity: string, production_month?: number }[] = [];
                                                (type === ANALYTICS_MONTHLY_TAB ? oil_data : cum_oil_data).forEach((item) => {
                                                    let nonZero = false;

                                                    item.values.forEach((_item) => {
                                                        if (
                                                            (_item.production_quantity === 0 ||
                                                                _item.production_quantity === null) &&
                                                            !nonZero
                                                        ) {
                                                        } else {
                                                            !nonZero && (nonZero = true);
                                                            tempData.push({
                                                                well_api: item.name,
                                                                production_date: `${_item.production_date}`,
                                                                production_quantity: _item.production_quantity.toString(),
                                                                production_month: tempData.length
                                                            })
                                                        }

                                                    });
                                                });
                                                // (forecastingData || []).forEach((obj) => {
                                                //     obj.values.forEach((_obj) => {
                                                //         let temp = apiListObj.filter((item) => item.well_name === obj.name)[0]
                                                //         tempData.push({
                                                //             well_api: Object.keys(temp).length ? tabIndex === 1 ? (temp as RigsDataObj)['api'] : (temp as WellsAndPermitsObject | ProductionDataObj)['well_api'] : "",
                                                //             production_date: `${_obj.date}`,
                                                //             production_quantity: _obj.price.toString()
                                                //         })
                                                //     })
                                                // })

                                                setState((prev) => ({ ...prev, dowData: tempData }))
                                                // //log download logs
                                                // dispatch(
                                                //     logUserAction({
                                                //         action_type: actionType["download_docs"],
                                                //         action_log_detail:
                                                //             `api: ${apiList.join()}`,
                                                //     })
                                                // );
                                                done();
                                            }}
                                            data={dowData}
                                            headers={typeCurve ? [
                                                { label: "Production Month", key: "production_month" },
                                                { label: `Oil bbl`, key: "production_quantity" },
                                            ] : [
                                                { label: "Well Api", key: "well_api" },
                                                { label: "Production Date", key: "production_date" },
                                                { label: `Oil bbl`, key: "production_quantity" },
                                            ]}
                                            filename={`ED_Data_Export_${moment(new Date()).format(
                                                "MMM-DD-YYYY, h:mm:ss a"
                                            )}`}
                                        >
                                            {/* <Link to=""> */}
                                            {/* <img src="images/three-dots.svg" alt="" /> */}
                                            <img src="images/download.svg" alt="" />
                                            {/* </Link> */}
                                        </CSVLink>

                                        <Link to="">
                                            <img src="images/three-dots.svg" alt="" />
                                        </Link>
                                        {/* <Link to="" onClick={() => {
                                            downloadGraphImage(OIL)

                                        }}>
                                            <img src="images/download.svg" alt="" />
                                        </Link> */}
                                    </div>
                                </div>
                                {checkedItemList.length > LINE_CHART_MAX_ITEM_ALLOWED && !sessionStorage.getItem("oilMaxMsg") && !closeOilMaxMsg ? <div className="excedsMessage">
                                    <div className="text-block">
                                        <img src="images/exclamation.svg" alt="" />
                                        Your selection exceeded 50 wells, so we've aggregated them for simplicity. You can change the aggregation method from the dropdown.
                                    </div>
                                    <span className="close" onClick={() => {
                                        setState((prev) => ({ ...prev, closeOilMaxMsg: true }))
                                    }}><img src="images/close.svg" alt="" /></span>

                                    <div className="custom-checkbox">
                                        <input name="rememberMe" className="form-control checkmark" type="checkbox" id="exceds" onChange={e => {
                                            const { checked } = e.target;
                                            if (checked) {
                                                sessionStorage.setItem("oilMaxMsg", "true");
                                            } else {
                                                sessionStorage.removeItem("oilMaxMsg");
                                            }
                                        }} />
                                        <label htmlFor="exceds" className="custom-label"> Don’t show this message again</label>
                                    </div>
                                </div> : <></>}
                                <div className="normalize">
                                    <div className={"aggregation"}>
                                        Aggregation: <span onClick={() => setState((prev) => ({ ...prev, showDropDownOption: true }))}>{type === ANALYTICS_MONTHLY_TAB ? capitalize(action) : capitalize(action_cum)}</span>
                                        <div className={showDropDownOption ? "dropmenu" : "d-none"}>
                                            <ul>
                                                {DropDownOption.map((item, index) => {
                                                    return <li key={index} className={type === ANALYTICS_MONTHLY_TAB ? action === item.value ? "selected" : "" : action_cum === item.value ? "selected" : ""} onClick={(() => {


                                                        dispatch(handleAnalyticsProdFilters({ action: item.value as ActionType, type }));

                                                        type === ANALYTICS_MONTHLY_TAB && dispatch(handleAnalyticsData({ oilList: [], gasList: [], type: ANALYTICS_MONTHLY_TAB, monthlyDataLoading: true }));

                                                        type === ANALYTICS_CUM_TAB && dispatch(handleAnalyticsData({ oilList: [], gasList: [], type: ANALYTICS_CUM_TAB, cumDataLoading: true }));

                                                        setState((prev) => ({ ...prev, showDropDownOption: false }));

                                                    })}>{item.label}</li>
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="noramlizeBlock">
                                        Normalize&nbsp;<img src="images/exclamation.svg" alt="" />
                                        <label className={`switch`}>
                                            <input
                                                disabled={apiListObjLength === apiListObj.length ? true : false}
                                                type="checkbox"
                                                checked={normalized ? true : false}
                                                onChange={(e) => {
                                                    const { checked } = e.target
                                                    dispatch(handleNormalize(checked))
                                                    // if (checked && apiListObjLength) {
                                                    //     toast.info("Your selection includes vertical wells. These are not included in the normalization calculation.")
                                                    // }
                                                }
                                                }
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                </div>

                                <h3 style={{ display: "none" }}>Cumulative</h3>
                                <div className="cardInfo" style={{ display: "none" }}>
                                    <ul>
                                        <li className="active">
                                            <span className="highlight oil"></span>{" "}
                                            Oil
                                            <div className="result">
                                                40.21 <sub>MMbbl</sub>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="highlight gas"></span>{" "}
                                            Gas
                                            <div className="result">
                                                53.06 <sub>Bcf</sub>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="highlight boe"></span>{" "}
                                            BOE
                                            <div className="result">
                                                49.05 <sub>MMBOE</sub>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="garph">
                                    {/* <img src="images/graph-1.svg" alt="" /> */}
                                    {type === ANALYTICS_MONTHLY_TAB ? apiList.length === 0 ? <></> : (monthlyDataLoading) ? <div className="norecord">Loading...</div> : <LineChart usedFor={OIL} yLabel={"BBL"} id={OIL}
                                        useDateXAxis={xAxisFilter === LINE_CHART_XAXIS_FILTERS["Producing Time"] ? false : true} /> : <></>}
                                    {type === ANALYTICS_CUM_TAB ? apiList.length === 0 ? <></> : (cumDataLoading) ? <div className="norecord">Loading...</div> : <LineChart usedFor={OIL} yLabel={"BBL"} id={OIL} useDateXAxis={xAxisFilterCum === LINE_CHART_XAXIS_FILTERS["Producing Time"] ? false : true} /> : <></>}
                                </div>
                                <RenderForecastBtn typePro={OIL} />
                                {/* <div className="graphBtn">
                                    <button className="btn active">Run Forecast</button>
                                    <button className="btn">Run Type Curve</button>
                                </div> */}
                            </div>
                            <div className="card-box">
                                <div className="card-box-header">
                                    <div className="labelheading">Gas Production</div>
                                    <div className="action-btn">
                                        <Link to="" onClick={() => {
                                            dispatch(handleShowAndHideTable(!showTable))
                                            dispatch(toggleViewAnalytics());
                                            dispatch(handleFullScrnAnalytics({ fullScrnAnalytics: true, fullScrnAnalyticsType: GAS }))
                                        }}>
                                            <img
                                                src="images/full-screen.svg"
                                                alt=""
                                            />
                                        </Link>
                                        {/* <Link to="">
                                        <img src="images/download.svg" alt="" />
                                    </Link> */}
                                        <CSVLink
                                            asyncOnClick={true}
                                            onClick={(event, done) => {

                                                let tempData: { well_api: string, production_date: string, production_quantity: string, production_month?: number }[] = [];
                                                (type === ANALYTICS_MONTHLY_TAB ? gas_data : cum_gas_data).forEach((item) => {
                                                    let nonZero = false;

                                                    item.values.forEach((_item) => {
                                                        if (
                                                            (_item.production_quantity === 0 ||
                                                                _item.production_quantity === null) &&
                                                            !nonZero
                                                        ) {
                                                        } else {
                                                            !nonZero && (nonZero = true);
                                                            tempData.push({
                                                                well_api: item.name,
                                                                production_date: `${_item.production_date}`,
                                                                production_quantity: _item.production_quantity.toString(),
                                                                production_month: tempData.length
                                                            })
                                                        }

                                                    });
                                                });
                                                (forecastingData || []).forEach((obj) => {
                                                    obj.values.forEach((_obj) => {
                                                        tempData.push({
                                                            well_api: obj.name,
                                                            production_date: `${_obj.date}`,
                                                            production_quantity: _obj.price.toString()
                                                        })
                                                    })
                                                })
                                                setState((prev) => ({ ...prev, dowData: tempData }))
                                                // //log download logs
                                                // dispatch(
                                                //     logUserAction({
                                                //         action_type: actionType["download_docs"],
                                                //         action_log_detail:
                                                //             `api: ${apiList.join(",")}`,
                                                //     })
                                                // );
                                                done();
                                            }}
                                            data={dowData}
                                            headers={typeCurve ? [
                                                { label: "Production Month", key: "production_month" },
                                                { label: `Oil bbl`, key: "production_quantity" },
                                            ] : [
                                                { label: "Well Api", key: "well_api" },
                                                { label: "Production Date", key: "production_date" },
                                                { label: "Gas Mcf", key: "production_quantity" },
                                            ]}
                                            filename={`ED_Data_Export_${moment(new Date()).format(
                                                "MMM-DD-YYYY, h:mm:ss a"
                                            )}`}
                                        >
                                            <img src="images/download.svg" alt="" />

                                        </CSVLink>
                                        <Link to="">
                                            <img src="images/three-dots.svg" alt="" />
                                        </Link>
                                        {/* <Link to="" onClick={() => {
                                            downloadGraphImage(GAS)

                                        }}>
                                            <img src="images/download.svg" alt="" />
                                        </Link> */}
                                    </div>
                                </div>
                                <h3 style={{ display: "none" }}>Cumulative</h3>
                                <div className="cardInfo" style={{ display: "none" }}>
                                    <ul>
                                        <li className="active">
                                            <span className="highlight oil"></span>{" "}
                                            Oil
                                            <div className="result">
                                                40.21 <sub>MMbbl</sub>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="highlight gas"></span>{" "}
                                            Gas
                                            <div className="result">
                                                53.06 <sub>Bcf</sub>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="highlight boe"></span>{" "}
                                            BOE
                                            <div className="result">
                                                49.05 <sub>MMBOE</sub>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                {checkedItemList.length > LINE_CHART_MAX_ITEM_ALLOWED && !sessionStorage.getItem("gasMaxMsg") && !closeGasMaxMsg ? <div className="excedsMessage">
                                    <div className="text-block">
                                        <img src="images/exclamation.svg" alt="" />
                                        Your selection exceeded 50 wells, so we've aggregated them for simplicity. You can change the aggregation method from the dropdown.
                                    </div>
                                    <span className="close" onClick={() => {
                                        setState((prev) => ({ ...prev, closeGasMaxMsg: true }))
                                    }}><img src="images/close.svg" alt="" /></span>

                                    <div className="custom-checkbox">
                                        <input name="rememberMeGas" className="form-control checkmark" type="checkbox" id="gasMaxMsg" onChange={e => {
                                            const { checked } = e.target;
                                            if (checked) {
                                                sessionStorage.setItem("gasMaxMsg", "true");
                                            } else {
                                                sessionStorage.removeItem("gasMaxMsg");
                                            }
                                        }} />
                                        <label htmlFor="gasMaxMsg" className="custom-label"> Don’t show this message again</label>
                                    </div>
                                </div> : <></>}
                                <div className="garph">
                                    {/* <img src="images/graph-1.svg" alt="" /> */}
                                    {type === ANALYTICS_MONTHLY_TAB ? apiList.length === 0 ? <></> : (monthlyDataLoading) ? <div className="norecord">Loading...</div> : <LineChart usedFor={GAS} yLabel={"MCF"} id={GAS} useDateXAxis={xAxisFilter === LINE_CHART_XAXIS_FILTERS["Producing Time"] ? false : true} /> : <></>}
                                    {type === ANALYTICS_CUM_TAB ? apiList.length === 0 ? <></> : (cumDataLoading) ? <div className="norecord">Loading...</div> : <LineChart usedFor={GAS} yLabel={"MCF"} id={GAS} useDateXAxis={xAxisFilterCum === LINE_CHART_XAXIS_FILTERS["Producing Time"] ? false : true} /> : <></>}
                                </div>
                                <RenderForecastBtn typePro={GAS} />
                            </div>
                            {/* <div className="card-box">
                            <div className="card-box-header">
                                <div className="labelheading">Production By Well Count</div>
                                <div className="action-btn">
                                    <Link to="" onClick={() => {
                                        dispatch(handleFullScrnAnalytics({ fullScrnAnalytics: true, fullScrnAnalyticsType: PRODUCTION_DONUT_CHART }))
                                    }}>
                                        <img
                                            src="images/full-screen.svg"
                                            alt=""
                                        />
                                    </Link>
                                    <CSVLink
                                        asyncOnClick={true}
                                        onClick={(event, done) => {
                                            let tempData: { production_type: string, total: number }[] = [];
                                            dataList.forEach((item) => {
                                                tempData.push({
                                                    production_type: `${item.label}`,
                                                    total: item.value as number
                                                })
                                            })
                                            setState((prev) => ({ ...prev, dowData: tempData }))
                                            done();
                                        }}
                                        data={dowData}
                                        headers={[
                                            { label: "Production Type", key: "production_type" },
                                            { label: "Total", key: "total" },
                                        ]}
                                        filename={`ED_Data_Export_${moment(new Date()).format(
                                            "MMM-DD-YYYY, h:mm:ss a"
                                        )}`}
                                    >
                                        <img src="images/download.svg" alt="" />

                                    </CSVLink>
                                    <Link to="">
                                        <img src="images/three-dots.svg" alt="" />
                                    </Link>
                                </div>
                            </div>
                            <h3 style={{ display: "none" }}>Cumulative</h3>
                            <div className="cardInfo" style={{ display: "none" }}>
                                <ul>
                                    <li className="active">
                                        <span className="highlight oil"></span>{" "}
                                        Oil
                                        <div className="result">
                                            40.21 <sub>MMbbl</sub>
                                        </div>
                                    </li>
                                    <li>
                                        <span className="highlight gas"></span>{" "}
                                        Gas
                                        <div className="result">
                                            53.06 <sub>Bcf</sub>
                                        </div>
                                    </li>
                                    <li>
                                        <span className="highlight boe"></span>{" "}
                                        BOE
                                        <div className="result">
                                            49.05 <sub>MMBOE</sub>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="garph">                                
                                {apiList.length === 0 ? <></> : donutChartDataLoading ? <div className="norecord">Loading...</div> : <DonutChart data={dataList} />}
                            </div>
                        </div> */}
                        </Scrollbars>
                    </div>
                    {/* <div
                    className="tab-pane fade"
                    id="operators"
                    role="tabpanel"
                    aria-labelledby="operators-tab"
                >
                    <Scrollbars
                        className="cardsection-scroll"
                        renderThumbVertical={(props) => (
                            <div {...props} className="thumb-vertical" />
                        )}
                        renderTrackVertical={(props) => (
                            <div {...props} className="track-vertical" />
                        )}
                    >
                        <div className="card-box">
                            <div className="card-box-header">
                                <div className="labelheading">Operator by well count</div>
                                <div className="action-btn">
                                    <Link to="">
                                        <img src="images/pencil.svg" alt="" />
                                    </Link>
                                    <CSVLink
                                        asyncOnClick={true}
                                        onClick={(event, done) => {
                                            let tempData: { operator_name: string, total: number }[] = [];
                                            tempData = Object.keys(operatorPieChartDataList).map((item, index) => {
                                                return {
                                                    operator_name: item,
                                                    total: Object.values(operatorPieChartDataList)[index]
                                                }
                                            })
                                            setState((prev) => ({ ...prev, dowData: tempData }))
                                            done();
                                        }}
                                        data={dowData}
                                        headers={[
                                            { label: "Operator Name", key: "operator_name" },
                                            { label: "Total", key: "total" },
                                        ]}
                                        filename={`ED_Data_Export_${moment(new Date()).format(
                                            "MMM-DD-YYYY, h:mm:ss a"
                                        )}`}
                                    >
                                        <img src="images/download.svg" alt="" />
                                    </CSVLink>
                                    <Link to="" onClick={() => {
                                        dispatch(handleFullScrnAnalytics({ fullScrnAnalytics: true, fullScrnAnalyticsType: OPERATOR_PIE_CHART }))
                                    }}>
                                        <img
                                            src="images/full-screen.svg"
                                            alt=""
                                        />
                                    </Link>
                                </div>
                            </div>
                            <h3 style={{ display: "none" }}>Cumulative</h3>
                            <div className="cardInfo" style={{ display: "none" }}>
                                <ul>
                                    <li className="active">
                                        <span className="highlight oil"></span>{" "}
                                        Oil
                                        <div className="result">
                                            40.21 <sub>MMbbl</sub>
                                        </div>
                                    </li>
                                    <li>
                                        <span className="highlight gas"></span>{" "}
                                        Gas
                                        <div className="result">
                                            53.06 <sub>Bcf</sub>
                                        </div>
                                    </li>
                                    <li>
                                        <span className="highlight boe"></span>{" "}
                                        BOE
                                        <div className="result">
                                            49.05 <sub>MMBOE</sub>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="garph">
                                {apiList.length === 0 ? <></> : operatorPieChartDataLoading ? <div className="norecord">Loading...</div> : <PieChart data={operatorPieChartDataList} />}
                            </div>
                        </div>
                        <div className="card-box">
                            <div className="card-box-header">
                                <div className="labelheading">Oil Production</div>
                                <div className="action-btn">
                                    <Link to="">
                                        <img src="images/pencil.svg" alt="" />
                                    </Link>
                                    <Link to="">
                                        <img
                                            src="images/full-screen.svg"
                                            alt=""
                                        />
                                    </Link>
                                </div>
                            </div>
                            <h3 style={{ display: "none" }}>Cumulative</h3>
                            <div className="cardInfo" style={{ display: "none" }}>
                                <ul>
                                    <li className="active">
                                        <span className="highlight oil"></span>{" "}
                                        Oil
                                        <div className="result">
                                            40.21 <sub>MMbbl</sub>
                                        </div>
                                    </li>
                                    <li>
                                        <span className="highlight gas"></span>{" "}
                                        Gas
                                        <div className="result">
                                            53.06 <sub>Bcf</sub>
                                        </div>
                                    </li>
                                    <li>
                                        <span className="highlight boe"></span>{" "}
                                        BOE
                                        <div className="result">
                                            49.05 <sub>MMBOE</sub>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="garph">
                                <img src="images/graph-1.svg" alt="" />
                            </div>
                        </div>
                        <div className="card-box">
                            <div className="card-box-header">
                                <div className="labelheading">Production By Well Count</div>
                                <div className="action-btn">
                                    <Link to="">
                                        <img src="images/pencil.svg" alt="" />
                                    </Link>
                                    <Link to="">
                                        <img
                                            src="images/full-screen.svg"
                                            alt=""
                                        />
                                    </Link>
                                </div>
                            </div>
                            <h3 style={{ display: "none" }}>Cumulative</h3>
                            <div className="cardInfo" style={{ display: "none" }}>
                                <ul>
                                    <li className="active">
                                        <span className="highlight oil"></span>{" "}
                                        Oil
                                        <div className="result">
                                            40.21 <sub>MMbbl</sub>
                                        </div>
                                    </li>
                                    <li>
                                        <span className="highlight gas"></span>{" "}
                                        Gas
                                        <div className="result">
                                            53.06 <sub>Bcf</sub>
                                        </div>
                                    </li>
                                    <li>
                                        <span className="highlight boe"></span>{" "}
                                        BOE
                                        <div className="result">
                                            49.05 <sub>MMBOE</sub>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="garph">
                                <img src="images/graph-1.svg" alt="" />
                            </div>
                        </div>
                    </Scrollbars>
                </div> */}
                    <div
                        className="tab-pane fade"
                        id="welltype"
                        role="tabpanel"
                        aria-labelledby="welltype-tab"
                    >
                        <div className="tabBlockContent">Well</div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default AnalyticsRightSidebar;
