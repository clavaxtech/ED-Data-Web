import React, { useEffect } from "react";
import Content from "./Content";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { fetchSegmentsList } from "../store/actions/segments-actions";
function ActiveTabContent() {
    const dispatch = useAppDispatch();
    const {
        auth: {
            user: { access_token },
        },
        segments: {
            activeSegmentList: { data, dataLoading, total_record, page_size },
            activeTabIndex,
            selectedRowId,
            page,
        },
    } = useAppSelector((state) => state);

    useEffect(() => {
        if (activeTabIndex === 1 && dataLoading) {
            dispatch(fetchSegmentsList(access_token, { type: "active", page }));
        }
        // eslint-disable-next-line
    }, [activeTabIndex, dataLoading]);
    return (
        <Content
            heading="Save Segments"
            headingHelperText="Manage your saved segments and make changes at any time."
            tabIndex={activeTabIndex}
            data={data}
            selectedRowId={selectedRowId}
            totalRecord={total_record}
            pageSize={page_size}
            page={page}
            id={"scrollDivActive"}
        />
    );
}

export default ActiveTabContent;
