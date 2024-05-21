import React from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import {
    clearActiveOrArchiveSegmentList,
    handleSegmentTabIndx,
} from "../store/actions/segments-actions";
import { numberFormat } from "../../utils/helper";

function SegmentsTabHeading() {
    const {
        segments: { active_total, archive_total, activeTabIndex },
    } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();
    return (
        <>
            <div className="aoiTab">
                <ul className="nav" id="myTabaoi" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button
                            className="nav-link active"
                            id="active-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#active"
                            type="button"
                            onClick={() => {
                                activeTabIndex !== 1 &&
                                    dispatch(handleSegmentTabIndx(1));
                                dispatch(clearActiveOrArchiveSegmentList());
                            }}
                            role="tab"
                            aria-controls="active"
                            aria-selected="true"
                        >
                            <img src="images/active-icon.svg" alt="" />
                            Active
                            <span className="count">{numberFormat.format(active_total)}</span>
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className="nav-link"
                            id="archived-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#archived"
                            type="button"
                            role="tab"
                            onClick={() => {
                                activeTabIndex !== 2 &&
                                    dispatch(handleSegmentTabIndx(2));
                                dispatch(clearActiveOrArchiveSegmentList());
                            }}
                            aria-controls="archived"
                            aria-selected="false"
                        >
                            <img src="images/archive-icon.svg" alt="" />
                            Archived
                            <span className="count">{numberFormat.format(archive_total)}</span>
                        </button>
                    </li>
                </ul>
            </div>
        </>
    );
}

export default SegmentsTabHeading;
