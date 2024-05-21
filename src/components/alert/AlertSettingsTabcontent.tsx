import React, { useEffect } from "react";
import Content from "./Content";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { fetchSegmentsList } from "../store/actions/segments-actions";
function AlertSettingsTabContent() {
    const dispatch = useAppDispatch();
    const {
        auth: {
            user: { access_token },
        },
        segments: {
            archivedSegmentList: { dataLoading, data, total_record, page_size },
            activeTabIndex,
            selectedRowId,
            page,
        },
    } = useAppSelector((state) => state);

    useEffect(() => {
        if (activeTabIndex === 2 && dataLoading) {
            dispatch(
                fetchSegmentsList(access_token, { type: "archive", page })
            );
        }
        // eslint-disable-next-line
    }, [activeTabIndex, dataLoading]);
    return (
        <div
            className="tab-pane fade"
            id="archived"
            role="tabpanel"
            aria-labelledby="archived-tab"
        >
            <Content
                heading="Alert Settings"
                headingHelperText="Your most recent alerts are listed below"
                tabIndex={activeTabIndex}
                data={data}
                selectedRowId={selectedRowId}
                totalRecord={total_record}
                pageSize={page_size}
                page={page}
                id={"scrollDivArchive"}
            />
        </div>
    );
}

export default AlertSettingsTabContent;
