import React from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import {
    clearAoiNotiData,
    setAoiNameSelForEdit,
    toggleAoiSideCon,
    toggleSettDrawer,
} from "../store/actions/aoi-actions";
import { AoiListObject } from "../models/redux-models";
import moment from "moment";
import { convertToDisplayFormatShortCurrency } from "../../utils/helper";
import {
    clearProductionData,
    clearRigsData,
    clearWellsData,
    handlePageChange,
    handleSelectedAoiData,
    // handleTabIndex,
    // resetWellsAndRigsSliceToInitial,
} from "../store/actions/wells-rigs-action";

function SavedAoiCard({ item, onDeleteBtnClick }: { item: AoiListObject, onDeleteBtnClick: (id: number) => void }) {
    const {
        aoi: {
            toggleSettingDrawer,
            aoiNotiDataLoading,
            aoiNameSelForEdit: { aoi_id },
            // showAoiSideCon,
        },
        wellsAndRigs: {
            //  tabIndex, 
            selectedAoiData },
    } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();
    const {
        id,
        aoi_name,
        last_updated,
        image_png,
        well_count,
        permit_count,
        operator_count,
        completion_count,
    } = item;
    return (
        <div
            className={`box ${selectedAoiData?.aoi_id === id ? "active" : ""}`}
        >
            <div className="box-top">
                <div className="box-top-left">
                    <div className="small-map">
                        <img
                            src={`${process.env.REACT_APP_AOI_IMAGE_CDN}/${image_png}`}
                            alt=""
                        />
                    </div>
                </div>
                <div
                    className="box-top-right cursor"
                    onClick={() => {
                        // let tempTabIndex = tabIndex;
                        if (id !== selectedAoiData.aoi_id) {
                            // let tempSelAoiId = selectedAoiData.aoi_id;
                            // dispatch(resetWellsAndRigsSliceToInitial());
                            dispatch(handleSelectedAoiData({ aoi_id: id }));

                            // dispatch(handleTabIndex(tempTabIndex));
                            // tempSelAoiId === 0 &&showAoiSideCon && dispatch(toggleAoiSideCon());
                        } else {
                            // dispatch(resetWellsAndRigsSliceToInitial());
                            // dispatch(handleTabIndex(tempTabIndex));
                            dispatch(handleSelectedAoiData({ aoi_id: 0 }));
                        }
                        dispatch(handlePageChange(1));
                        dispatch(clearProductionData());
                        dispatch(clearWellsData());
                        dispatch(clearRigsData());
                    }}
                >
                    <div className="box-top-header">
                        <div title={aoi_name}>
                            {" "}
                            {aoi_name.slice(0, 14) +
                                `${aoi_name.length > 20 ? "..." : ""}`}
                        </div>
                        <span>
                            Last updated: {moment(last_updated).format("MMM-DD-YYYY")}
                        </span>
                    </div>

                    <div className="savedInfo">
                        <ul>
                            <li>
                                <h2>Active Wells</h2>
                                {convertToDisplayFormatShortCurrency(well_count)}
                                {/* <span>
                                    <i className="fa-solid fa-arrow-up"></i> 104
                                </span> */}
                            </li>
                            <li>
                                <h2>Active Permits</h2>
                                {convertToDisplayFormatShortCurrency(
                                    operator_count
                                )}
                                {/* <span className="down">
                                    <i className="fa-solid fa-arrow-down"></i> 2
                                </span> */}
                            </li>
                            <li>
                                <h2>DUCs</h2>

                                {convertToDisplayFormatShortCurrency(
                                    permit_count
                                )}
                                {/* <span>
                                    <i className="fa-solid fa-arrow-up"></i> 86
                                </span> */}
                            </li>
                            <li>
                                <h2>Other</h2>
                                {convertToDisplayFormatShortCurrency(
                                    completion_count
                                )}
                                {/* <span>
                                    <i className="fa-solid fa-arrow-up"></i> 4
                                </span> */}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="box-bottom">
                <button
                    className="btn btn-outline-white edit"
                    onClick={() => {
                        dispatch(
                            setAoiNameSelForEdit({ aoi_id: id, aoi_name })
                        );
                        dispatch(toggleAoiSideCon());
                    }}
                >
                    <i className="fa-solid fa-pen-to-square"></i> Edit
                </button>
                <button
                    type="button"
                    className="btn btn-outline-white"
                    onClick={() => {
                        dispatch(
                            setAoiNameSelForEdit({ aoi_id: id, aoi_name })
                        );
                        if (!aoiNotiDataLoading && aoi_id !== id) {
                            dispatch(clearAoiNotiData());
                        }
                        toggleSettingDrawer === false &&
                            dispatch(toggleSettDrawer());
                    }}
                >
                    <i className="fa-solid fa-gear"></i> Settings
                </button>
                <button
                    type="button"
                    onClick={() => onDeleteBtnClick(id)}
                    className="btn btn-outline-white delete">
                    <i className="fa-solid fa-trash"></i> Delete
                </button>
            </div>
        </div>
    );
}

export default SavedAoiCard;
