import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks'
import LineChart from './LineChart';
import TabCont from './WellsAndRigs/TabCont';
import {
    handleAnalyticsData,
    handleAnalyticsProdFilters,
    handleForecast,
    handleForecastingData,
    //  handleAnalyticsData, handleAnalyticsProdFilters,
    handleFullScrnAnalytics, handleNormalize, handleSelectedForecastPoint, handleShowAndHideTable, toggleViewAnalytics
} from '../store/actions/wells-rigs-action';
import { CSVLink } from 'react-csv';
import moment from 'moment';
import { DowData } from '../models/stateModel';
import {
    GAS, OIL, OPERATOR_PIE_CHART, PRODUCTION_DONUT_CHART, ANALYTICS_MONTHLY_TAB, capitalize, LINE_CHART_XAXIS_FILTERS, DropDownOption, ANALYTICS_CUM_TAB,
    // downloadGraphImage 
} from '../../utils/helper';
// import DonutChart from './DonutChart';
import { ActionType, ProductionDataObj, RigsDataObj, WellsAndPermitsObject, WellsRigsModel } from '../models/redux-models';
// import PieChart from './PieChart';
import { toast } from 'react-toastify';
import ForecastFilter from './WellsAndRigs/ForecastFilter';

function AnalyticsFullScreen() {
    const { wellsAndRigs: { tabIndex, fullScrnAnalytics, fullScrnAnalyticsType, analyticsData: { oil_data, gas_data, type: analyticsProDataType, cum_gas_data, cum_oil_data, xAxisFilter, xAxisFilterCum, normalized, action, action_cum, apiListObj, apiListObjLength, monthlyDataLoading, cumDataLoading, forecastingData: {
        // dataList: forecastingData,
        forecastingCompleteDataFrame } }, donutChart: { dataList }, operatorPieChart: { operatorPieChartDataList }, showTable, openForeCast } } = useAppSelector(state => state);
    const dispatch = useAppDispatch();
    const [state, setState] = useState<{ dowData: DowData[], showDropDownOption: boolean, }>({ dowData: [], showDropDownOption: false, })

    const { dowData, showDropDownOption } = state;

    const typeCurve = (xAxisFilter === LINE_CHART_XAXIS_FILTERS["Producing Time"] || xAxisFilterCum === LINE_CHART_XAXIS_FILTERS["Producing Time"]) ? true : false;

    const getDowData = (type: WellsRigsModel['fullScrnAnalyticsType']) => {

        let tempData: DowData[] = [];

        // //log download logs
        // dispatch(
        //     logUserAction({
        //         action_type: actionType["download_docs"],
        //         action_log_detail:
        //             `api: ${apiList.join(",")}`,
        //     })
        // );

        switch (type) {
            case OPERATOR_PIE_CHART: (tempData = Object.keys(operatorPieChartDataList).map((item, index) => {
                return {
                    operator_name: item,
                    total: Object.values(operatorPieChartDataList)[index]
                }
            }))
                setState((prev) => ({ ...prev, dowData: tempData }))
                return
            case PRODUCTION_DONUT_CHART: (dataList.forEach((item) => {
                tempData.push({
                    production_type: `${item.label}`,
                    total: item.value as number
                })
            }));
                setState((prev) => ({ ...prev, dowData: tempData }))
                return
            case OIL:
                (forecastingCompleteDataFrame ? analyticsProDataType === ANALYTICS_MONTHLY_TAB ? oil_data : cum_oil_data : []).forEach((item) => {
                    item.values.forEach((_item) => {
                        tempData.push({
                            well_api: item.name,
                            production_date: `${_item.production_date}`,
                            production_quantity: _item.production_quantity.toString()
                        })
                    })
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
                setState((prev) => ({ ...prev, dowData: forecastingCompleteDataFrame ? JSON.parse(forecastingCompleteDataFrame) : tempData }));
                return
            case GAS: (forecastingCompleteDataFrame ? analyticsProDataType === ANALYTICS_MONTHLY_TAB ? gas_data : cum_gas_data : []).forEach((item) => {
                item.values.forEach((_item) => {
                    tempData.push({
                        well_api: item.name,
                        production_date: `${_item.production_date}`,
                        production_quantity: _item.production_quantity.toString()
                    })
                })
            });
                // (forecastingData || []).forEach((obj) => {
                //     obj.values.forEach((_obj) => {
                //         tempData.push({
                //             well_api: obj.name,
                //             production_date: `${_obj.date}`,
                //             production_quantity: _obj.price.toString()
                //         })
                //     })
                // })
                setState((prev) => ({ ...prev, dowData: forecastingCompleteDataFrame ? JSON.parse(forecastingCompleteDataFrame) : tempData }));
                return

            default: tempData = []
        }
    }
    if (!fullScrnAnalytics) {
        return <></>
    }

    return (
        // forcastingOverlay
        <div className={fullScrnAnalytics ? `analyticFullgraph analyticFullGraphOverlap   ${!showTable ? "analyticsFullScreenGraph" : ""} ${openForeCast ? "forcastingOverlay forecastingSingleDraw" : ""} ${apiListObj.length === 1 ? "forecastingSingleDraw" : ""}` : "d-none"} onClick={() => {
            showDropDownOption && setState((prev) => ({ ...prev, showDropDownOption: false }))
        }}>
            <div className="card-box">
                <div className="card-box-header">
                    <div className="labelheading">{openForeCast ? `${apiListObj[0]['well_name']} - ${tabIndex === 1 ? (apiListObj as (RigsDataObj)[])[0]['api'] : (apiListObj as (WellsAndPermitsObject | ProductionDataObj)[])[0]["well_api"]} ` : ''}{capitalize(fullScrnAnalyticsType)} Production {!typeCurve ? " Forecast" : "Type Curve"}</div>
                    <div className="action-btn">
                        <Link to="" onClick={() => {
                            dispatch(handleForecastingData({ data: null }));
                            dispatch(
                                handleSelectedForecastPoint({
                                    data: null,
                                    doNotConCat: true,
                                })
                            );
                            dispatch(handleForecast(false));
                            dispatch(handleShowAndHideTable(!showTable))
                            dispatch(handleFullScrnAnalytics({ fullScrnAnalytics: false }))
                            dispatch(toggleViewAnalytics());

                        }}>
                            <img
                                src="images/full.svg"
                                alt=""
                            />
                        </Link>
                        {/* <Link to="">
                            <img src="images/download.svg" alt="" />
                        </Link> */}
                        <CSVLink
                            asyncOnClick={true}
                            onClick={(event, done) => {
                                getDowData(fullScrnAnalyticsType)
                                done();
                            }}
                            data={dowData}
                            headers={fullScrnAnalyticsType === PRODUCTION_DONUT_CHART ? [
                                { label: "Production Type", key: "production_type" },
                                { label: "Total", key: "total" },
                            ] : fullScrnAnalyticsType === OPERATOR_PIE_CHART ? [
                                { label: "Operator Name", key: "operator_name" },
                                { label: "Total", key: "total" },
                            ] : forecastingCompleteDataFrame ?
                                (xAxisFilter === LINE_CHART_XAXIS_FILTERS["Producing Time"] || xAxisFilterCum === LINE_CHART_XAXIS_FILTERS["Producing Time"]) ? [
                                    { label: "Producing Month", key: "producing_month" },
                                    { label: `${fullScrnAnalyticsType === OIL ? `Oil bbl` : "Gas Mcf"}`, key: "production_quantity_ft" },
                                    // { label: `Production Quantity FT`, key: "production_quantity_ft" },
                                    { label: "DCA", key: "DCA" },

                                ] :
                                    [
                                        { label: "Well Api", key: "api" },
                                        { label: "Production Date", key: "production_date" },
                                        { label: `${fullScrnAnalyticsType === OIL ? `Oil bbl` : "Gas Mcf"}`, key: "production_quantity" },
                                        { label: "DCA", key: "DCA" },
                                        { label: `${fullScrnAnalyticsType === OIL ? `Oil Stream bbl` : "Gas Stream Mcf"}`, key: "product_stream" },
                                        { label: "Data Type", key: "data_type" },
                                    ]

                                : [
                                    { label: "Well Api", key: "well_api" },
                                    { label: "Production Date", key: "production_date" },
                                    { label: `${fullScrnAnalyticsType === OIL ? `Oil bbl` : "Gas Mcf"}`, key: "production_quantity" },
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
                            downloadGraphImage(fullScrnAnalyticsType === OIL ? OIL : GAS)

                        }}>
                            <img src="images/download.svg" alt="" />
                        </Link> */}
                        <Link to="" onClick={() => {
                            dispatch(handleForecastingData({ data: null }));
                            dispatch(
                                handleSelectedForecastPoint({
                                    data: null,
                                    doNotConCat: true,
                                })
                            );
                            dispatch(handleForecast(false));
                            dispatch(handleShowAndHideTable(!showTable))
                            dispatch(handleFullScrnAnalytics({ fullScrnAnalytics: false }))

                        }}>
                            <img src="images/cross.svg" alt="" />
                        </Link>
                    </div>
                </div>
                <div className="box-inside">
                    <div className="normalize">

                        <div className={"aggregation"}>
                            Aggregation: <span onClick={() => setState((prev) => ({ ...prev, showDropDownOption: true }))}>{analyticsProDataType === ANALYTICS_MONTHLY_TAB ? capitalize(action) : capitalize(action_cum)}</span>
                            <div className={showDropDownOption ? "dropmenu" : "d-none"} >
                                <ul>
                                    {DropDownOption.map((item, index) => {
                                        return <li key={index}
                                            className={
                                                typeCurve && openForeCast && item.value === "none" ? "d-none" :
                                                    analyticsProDataType === ANALYTICS_MONTHLY_TAB ? action === item.value ? "selected" : "" : action_cum === item.value ? "selected" : ""
                                            }
                                            onClick={(() => {
                                                if (typeCurve && openForeCast) {
                                                    dispatch(handleForecastingData({ data: null }));
                                                    dispatch(
                                                        handleSelectedForecastPoint({
                                                            data: null,
                                                            doNotConCat: true
                                                        })
                                                    );
                                                }
                                                dispatch(handleAnalyticsProdFilters({ action: item.value as ActionType, type: analyticsProDataType }));

                                                analyticsProDataType === ANALYTICS_MONTHLY_TAB && dispatch(handleAnalyticsData({ oilList: [], gasList: [], type: ANALYTICS_MONTHLY_TAB, monthlyDataLoading: true }));

                                                analyticsProDataType === ANALYTICS_CUM_TAB && dispatch(handleAnalyticsData({ oilList: [], gasList: [], type: ANALYTICS_CUM_TAB, cumDataLoading: true }));

                                                setState((prev) => ({ ...prev, showDropDownOption: false }));

                                            })}
                                        >{item.label}</li>
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
                                        if (checked && apiListObjLength) {
                                            toast.info("Your selection includes vertical wells. These are not included in the normalization calculation.")
                                        }
                                    }
                                    }
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                    <div className="garph scrollSection">
                        {(fullScrnAnalyticsType === OIL || fullScrnAnalyticsType === GAS) ? analyticsProDataType === ANALYTICS_MONTHLY_TAB && monthlyDataLoading ? <div className="norecord">Loading...</div> : analyticsProDataType === ANALYTICS_CUM_TAB && cumDataLoading ? <div className="norecord">Loading...</div> : <LineChart usedFor={fullScrnAnalyticsType} yLabel={`${fullScrnAnalyticsType === OIL ? "BBL" : "MCF"}`} id={fullScrnAnalyticsType} useDateXAxis={(analyticsProDataType === ANALYTICS_MONTHLY_TAB ? xAxisFilter : xAxisFilterCum) === LINE_CHART_XAXIS_FILTERS["Producing Time"] ? false : true} /> : <></>}

                        {/* {fullScrnAnalyticsType === PRODUCTION_DONUT_CHART ? <DonutChart data={dataList} /> : <></>} */}
                        {/* {fullScrnAnalyticsType === OPERATOR_PIE_CHART ? <PieChart data={operatorPieChartDataList} /> : <></>} */}
                    </div>
                    <TabCont onlyCheckedData={true} />
                </div>
            </div>
            <ForecastFilter />
        </div >
    )
}

export default AnalyticsFullScreen