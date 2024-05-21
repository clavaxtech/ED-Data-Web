import React, { useEffect, useState } from "react";
import TabContent from "./TabContent";
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import { fetchShapeFileList } from "../store/actions/files-actions";

function ShapefilesTabcontent() {
    const dispatch = useAppDispatch();
    const { auth: { user: { access_token } }, files: { shapeFileList, shapeFilePage, shapeFilePageSize, shapeFileTotalRecord, shapeFileListLoading, filesTabIndex } } = useAppSelector(state => state)
    const [state, setState] = useState({
        hasMore: false,
    })
    const { hasMore } = state



    const fetchData = () => {
        dispatch(fetchShapeFileList(access_token, shapeFilePage + 1));
    }
    useEffect(() => {
        if (shapeFileListLoading && filesTabIndex === 0) {
            dispatch(fetchShapeFileList(access_token, shapeFilePage));
        }
        // eslint-disable-next-line
    }, [shapeFileListLoading, filesTabIndex])

    useEffect(() => {
        if (shapeFileTotalRecord && shapeFileList) {
            let pages =
                Math.floor(shapeFileTotalRecord / shapeFilePageSize) +
                (shapeFileTotalRecord % shapeFilePageSize > 0 ? 1 : 0);
            setState((prev) => ({
                ...prev,
                pages,
                hasMore: shapeFilePage < pages ? true : false,
            }));
        }
        // eslint-disable-next-line
    }, [shapeFileTotalRecord, shapeFilePage,shapeFileList]);
    return (
        <div
            className="tab-pane fade show active"
            id="shapefiles"
            role="tabpanel"
            aria-labelledby="shapefiles-tab"
        >
            <TabContent data={shapeFileList} id={"shapeFileContent"} hasMore={hasMore} fetchData={fetchData} type={"aoi"} tkn={access_token} filesTabIndex={filesTabIndex}/>
        </div>
    );
}

export default ShapefilesTabcontent;
