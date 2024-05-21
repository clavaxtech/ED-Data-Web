import React from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import {
    handleAoiTabIndex,
    toggleAoiSideCon,
} from "../store/actions/aoi-actions";
import { numberFormat } from "../../utils/helper";

function AoiTabHeading() {
    const {
        aoi: { savedAoiData },
    } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();
    return (
        <>
            <div
                // className={savedAoiData.length > 0 ? "back-header" : "d-none"}
                className={"back-header"}
                onClick={(e) => {
                    e.preventDefault()
                    dispatch(toggleAoiSideCon())
                }}
            >
                <a href="void:(0)">
                    <i className="fa-solid fa-arrow-left"></i>{" "}
                    <span>Collapse</span>
                </a>
            </div>
            <div className="aoi-header">
                <span>
                    {" "}
                    <img src="images/location.svg" alt="Location" /> Areas of
                    interest
                </span>
            </div>
            <div className="aoiTab">
                <ul className="nav" id="myTabaoi" role="tablist">
                    <li
                        className="nav-item"
                        role="presentation"
                        onClick={() => {
                            dispatch(handleAoiTabIndex(0));
                        }}
                    >
                        <button
                            className="nav-link active"
                            id="saved-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#saved"
                            type="button"
                            role="tab"
                            aria-controls="saved"
                            aria-selected="true"
                        >
                            <span className="text">Saved</span>{" "}
                            <span
                                className={
                                    savedAoiData.length > 0 ? "count" : "d-none"
                                }
                            >
                                {numberFormat.format(savedAoiData.length)}
                            </span>
                        </button>
                    </li>
                    {/* Note:- For now we are commenting this section in future we will implement it DP-66 */}
                    {/* <li
                        className="nav-item"
                        role="presentation"
                        onClick={() => {
                            dispatch(handleAoiTabIndex(1));
                        }}
                    >
                        <button
                            className="nav-link"
                            id="popular-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#popular"
                            type="button"
                            role="tab"
                            aria-controls="popular"
                            aria-selected="false"
                        >
                            <span className="text">Popular</span>
                        </button>
                    </li> */}
                    <li
                        className="nav-item"
                        role="presentation"
                        onClick={() => {
                            dispatch(handleAoiTabIndex(2));
                        }}
                    >
                        <button
                            className="nav-link"
                            id="gs-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#gs"
                            type="button"
                            role="tab"
                            aria-controls="gs"
                            aria-selected="false"
                        >
                            <span className="text">General Settings</span>
                        </button>
                    </li>
                </ul>
            </div>
        </>
    );
}

export default AoiTabHeading;
