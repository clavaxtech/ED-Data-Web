import React from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { handleFilesTabIndex } from "../store/actions/files-actions";
import { numberFormat } from "../../utils/helper";

function FilesTabHeading() {
    const dispatch = useAppDispatch()
    const { files: { filesTabIndex, apiTotalRecord, shapeFileTotalRecord } } = useAppSelector(state => state)
    return (
        <>
            <div className="aoiTab">
                <ul className="nav" id="myTabfiles" role="tablist">
                    <li className="nav-item" role="presentation"
                        onClick={() => {
                            filesTabIndex !== 0 && dispatch(handleFilesTabIndex(0))
                        }}
                    >
                        <button
                            className="nav-link active"
                            id="shapefiles-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#shapefiles"
                            type="button"
                            role="tab"
                            aria-controls="shapefiles"
                            aria-selected="true"
                        >
                            Shape Files
                            <span
                                className="count">
                                {numberFormat.format(shapeFileTotalRecord)}
                            </span>
                        </button>
                    </li>
                    <li className="nav-item" role="presentation"
                        onClick={() => {
                            filesTabIndex !== 1 && dispatch(handleFilesTabIndex(1))
                        }}
                    >
                        <button
                            className="nav-link"
                            id="api-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#api"
                            type="button"
                            role="tab"
                            aria-controls="api"
                            aria-selected="false"
                        >
                            API
                            <span
                                className="count">
                                {numberFormat.format(apiTotalRecord)}
                            </span>
                        </button>
                    </li>
                </ul>
            </div>
        </>
    );
}

export default FilesTabHeading;
