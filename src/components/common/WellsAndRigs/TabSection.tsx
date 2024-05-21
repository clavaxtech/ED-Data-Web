import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import TabHeadingSec from "./TabHeadingSec";
import Filter from "./Filter";
import TabCont from "./TabCont";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import useWindowDimensions from "../../hooks/useWindowDimension";
import _ from "lodash";
import { clearProductionData, clearRigsData, clearWellsData, handlePageChange, handleUIDList } from "../../store/actions/wells-rigs-action";
import DeleteConfirmationModal from "../Modal/DeleteConfirmationModal";

function TabSection() {
    const {
        wellsAndRigs: {
            wellsData: { data: wellsList },
            rigsData: { data: rigsList },
            permitsData: { data: permitsList },
            productionData: { data: productionList },
            showTable,
            showTableLoader,
            fullScreen,
            downloadCol,
            resizableHeight
        },
        esri: { featuresForStatistics },
        modal: { siteLoader }

    } = useAppSelector((state) => state);

    const dispatch = useAppDispatch();

    const { height } = useWindowDimensions()

    const [state, setState] = useState({
        noOfRows: 5,
        showWellsMaxLimitModal: false
    })
    const { noOfRows, showWellsMaxLimitModal } = state;
    const wellsMemo = useMemo(() => {
        return <TabCont />;
        // eslint-disable-next-line
    }, [wellsList]);
    const permitsMemo = useMemo(() => {
        return <TabCont />;
        // eslint-disable-next-line
    }, [permitsList]);
    const rigsMemo = useMemo(() => {
        return <TabCont />;
        // eslint-disable-next-line
    }, [rigsList]);
    const productionMemo = useMemo(() => {
        return <TabCont />;
        // eslint-disable-next-line
    }, [productionList]);

    useEffect(() => {
        if (fullScreen) setState(prev => ({ ...prev, noOfRows: Math.trunc((height - 100) / 32) }));
    }, [
        // showTableLoader
        fullScreen
    ])
    useEffect(() => {
        if (siteLoader) {
            return
        }
        if (featuresForStatistics.length > 1000) {
            !showWellsMaxLimitModal && setState((prev) => ({ ...prev, showWellsMaxLimitModal: true }));
            return
        }
        if (featuresForStatistics.length && featuresForStatistics.length <= 1000) {
            dispatch(handleUIDList(featuresForStatistics))
            // dispatch(handlePageChange(1));
            dispatch(clearProductionData());
            dispatch(clearWellsData());
            dispatch(clearRigsData());
        }
    }, [JSON.stringify(featuresForStatistics)])
    return (
        <>
            <div className={(!downloadCol && showTableLoader) ? "search-con-loader-outlay" : 'd-none'}>
                {/* <div className="search-con-loader-outlay"> */}
                <div className="search-header">
                    <div className="searchTop">
                        <div className="searchByTab">
                            <ul className="nav">
                                <li className="nav-item">
                                    <button className="nav-link" type="button"> <span></span></button>
                                </li>
                                <li className="nav-item bt1"><button className="nav-link" type="button"><span></span></button>
                                </li>
                            </ul>
                        </div>
                        <div className="showhidebtn "></div>
                    </div>
                    <div className="searchbtm">
                        <div className="left">
                            <div className="searchInput"><span></span></div>
                            <div className="searchfilter"><span></span></div>
                        </div>
                        <div className="right">
                            <div className="greenbtn"></div>
                        </div>
                    </div>
                </div>
                <div className="tablelayout">

                    <table>
                        {
                            _.range(1, noOfRows).map((item, key) => {
                                return <tr key={key}>
                                    <th className="chk"><span></span></th>
                                    <th className="td"><span></span></th>
                                    <th className="td"><span></span></th>
                                    <th className="td"><span></span></th>
                                    <th className="td"><span></span></th>
                                    <th className="td"><span></span></th>
                                    <th className="td"><span></span></th>
                                </tr>
                            })
                        }

                        {/* <tr>
                            <td className="chk"><span></span></td>
                            <td className="td"><span></span></td>
                            <td className="td"><span></span></td>
                            <td className="td"><span></span></td>
                            <td className="td"><span></span></td>
                            <td className="td"><span></span></td>
                            <td className="td"><span></span></td>
                        </tr> */}
                        {/* <tr>
                            <td className="chk"><span></span></td>
                            <td className="td"><span></span></td>
                            <td className="td"><span></span></td>
                            <td className="td"><span></span></td>
                            <td className="td"><span></span></td>
                            <td className="td"><span></span></td>
                            <td className="td"><span></span></td>
                        </tr> */}
                        {/* <tr>
                            <td className="chk"><span></span></td>
                            <td className="td"><span></span></td>
                            <td className="td"><span></span></td>
                            <td className="td"><span></span></td>
                            <td className="td"><span></span></td>
                            <td className="td"><span></span></td>
                            <td className="td"><span></span></td>
                        </tr> */}
                        {/* <tr>
                            <td className="chk"><span></span></td>
                            <td className="td"><span></span></td>
                            <td className="td"><span></span></td>
                            <td className="td"><span></span></td>
                            <td className="td"><span></span></td>
                            <td className="td"><span></span></td>
                            <td className="td"><span></span></td>
                        </tr> */}

                    </table>
                </div>
            </div >
            <div className={(downloadCol || !showTableLoader) ? "search-container" : "d-none"}>
                <TabHeadingSec />
                <div className={`tab-content searchCon ${showTable ? "" : "isHide"}`} id="myTabContent">
                    <Filter />
                    <div
                        className="tab-pane fade show active"
                        id="wells"
                        role="tabpanel"
                        aria-labelledby="wells-tab"
                    >
                        {wellsMemo}
                    </div>
                    <div
                        className="tab-pane fade"
                        id="rigs"
                        role="tabpanel"
                        aria-labelledby="rigs-tab"
                    >
                        {rigsMemo}
                    </div>
                    <div
                        className="tab-pane fade"
                        id="permits"
                        role="tabpanel"
                        aria-labelledby="permits-tab"
                    >
                        {permitsMemo}
                    </div>
                    <div
                        className="tab-pane fade"
                        id="production"
                        role="tabpanel"
                        aria-labelledby="production-tab"
                    >
                        {productionMemo}
                    </div>
                </div>
            </div >
            <DeleteConfirmationModal
                show={showWellsMaxLimitModal}
                handleClose={() => { setState((prev) => ({ ...prev, showWellsMaxLimitModal: false })) }}
                confirmBtnClick={() => { setState((prev) => ({ ...prev, showWellsMaxLimitModal: false })) }}
                closeBtn={true}
                content={<p>Please limit your search to 1,000 wells or less.</p>}
            />
        </>
    );
}

export default TabSection;
