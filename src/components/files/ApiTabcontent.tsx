import React, { useEffect, useState } from "react";
import TabContent from "./TabContent";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { fetchApiFileList } from "../store/actions/files-actions";


function ApiTabcontent() {
    const dispatch = useAppDispatch();
    const { auth: { user: { access_token } }, files: { apiList, apiPage, apiPageSize, apiTotalRecord, apiListLoading, filesTabIndex } } = useAppSelector(state => state)
    const [state, setState] = useState({
        hasMore: false,
    })
    const { hasMore } = state



    const fetchData = () => {
        dispatch(fetchApiFileList(access_token, apiPage + 1));
    }
    useEffect(() => {
        if (apiListLoading && filesTabIndex === 1) {
            dispatch(fetchApiFileList(access_token, apiPage));
        }
        // eslint-disable-next-line
    }, [apiListLoading, filesTabIndex])

    useEffect(() => {
        if (apiTotalRecord && apiList) {
            let pages =
                Math.floor(apiTotalRecord / apiPageSize) +
                (apiTotalRecord % apiPageSize > 0 ? 1 : 0);
            setState((prev) => ({
                ...prev,
                pages,
                hasMore: apiPage < pages ? true : false,
            }));
        }
        // eslint-disable-next-line
    }, [apiTotalRecord, apiPage, apiList]);

    return (
        <div
            className="tab-pane fade"
            id="api"
            role="tabpanel"
            aria-labelledby="api-tab"
        >
            <TabContent data={apiList} id={"apiFileContent"} hasMore={hasMore} fetchData={fetchData} type={"csv"} tkn={access_token} filesTabIndex={filesTabIndex} />
        </div>
    );
}

export default ApiTabcontent;
