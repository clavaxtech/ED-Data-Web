import React, { useEffect, useState } from "react";
import GlobalTable from "../GlobalTable";
import useWellsAndRigsCol from "./useWellsAndRigsCol";
import { GlobalTableProps } from "../../models/page-props";
import { Scrollbars } from "react-custom-scrollbars";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import {
    clearPermitData,
    clearProductionData,
    clearRigsData,
    clearWellsData,
    handlePageChange,
} from "../../store/actions/wells-rigs-action";
import Spinner from "../Spinner";
import LazyLoad from "react-lazy-load";
import { LINE_CHART_MAX_ITEM_ALLOWED } from "../../../utils/helper";

// onlyCheckedData is used to
function TabCont({ onlyCheckedData }: { onlyCheckedData?: boolean }) {
    const {
        wellsAndRigs: {
            wellsData: {
                data: wellsDataList,
                total_count: wellsTotalCount,
                page_size: wellsPageSize,
            },
            fullScreen,
            rigsData: {
                data: rigsDataList,
                total_count: rigsTotalCount,
                page_size: rigsPageSize,
            },
            permitsData: {
                data: permitDataList,
                total_count: permitTotalCount,
                page_size: permitPageSize,
            },
            productionData: {
                data: productionDataList,
                total_count: productionTotalCount,
                page_size: productionPageSize,
            },
            tabIndex,
            // fullScreen,
            wellsPage,
            rigsPage,
            permitsPage,
            productionPage,
            selectedRowId,
            viewAnalytics,
            checkedItemList,
            fullScrnAnalytics,
            resizableHeight
        },
    } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();
    const [state, setState] = useState<{
        totalPage: number;
        nextPageDataLoading: boolean;
        page: number;
    }>({
        totalPage: 1,
        nextPageDataLoading: false,
        page: 1,
    });
    const { totalPage, nextPageDataLoading, page } = state;
    const onPageChange = () => {
        switch (tabIndex) {
            case 0:
                dispatch(handlePageChange(wellsPage + 1));
                dispatch(clearWellsData());
                break;
            case 1:
                dispatch(handlePageChange(rigsPage + 1));
                dispatch(clearRigsData());
                break;
            case 2:
                dispatch(handlePageChange(permitsPage + 1));
                dispatch(clearPermitData());
                break;
            case 3:
                dispatch(handlePageChange(productionPage + 1));
                dispatch(clearProductionData());
                break;
            default:
                dispatch(handlePageChange(wellsPage + 1));
                dispatch(clearWellsData());
        }
    };
    useEffect(() => {
        if (
            (Array.isArray(wellsDataList) && wellsDataList.length > 0) ||
            (Array.isArray(rigsDataList) && rigsDataList.length > 0) ||
            (Array.isArray(permitDataList) && permitDataList.length > 0) ||
            (Array.isArray(productionDataList) && productionDataList.length > 0)
        ) {
            setState((prev) => ({
                ...prev,
                totalPage:
                    tabIndex === 0
                        ? Math.floor(wellsTotalCount / wellsPageSize) +
                        (wellsTotalCount % wellsPageSize > 0 ? 1 : 0)
                        : tabIndex === 1
                            ? Math.floor(rigsTotalCount / rigsPageSize) +
                            (rigsTotalCount % rigsPageSize > 0 ? 1 : 0)
                            : tabIndex === 2 ? Math.floor(permitTotalCount / permitPageSize) +
                                (permitTotalCount % permitPageSize > 0 ? 1 : 0) : Math.floor(productionTotalCount / productionPageSize) +
                            (productionTotalCount % productionPageSize > 0 ? 1 : 0),
                nextPageDataLoading: false,
                page:
                    tabIndex === 0
                        ? wellsPage
                        : tabIndex === 1
                            ? rigsPage
                            : tabIndex === 2 ? permitsPage : productionPage,
            }));
        } else {
            setState((prev) => ({
                ...prev,
                totalPage: 1,
                nextPageDataLoading: false,
                page: 1,
            }));
        }
        // eslint-disable-next-line
    }, [wellsDataList, rigsDataList, permitDataList, tabIndex, productionDataList]);


    // useEffect(() => {
    //     showTableLoader && intitalRef.current && (intitalRef.current = false);
    // }, [showTableLoader]);

    return (
        <div className="searchList scrollSection">
            <LazyLoad>
                <>
                    <Scrollbars
                        className={`${nextPageDataLoading
                            ? "customTable lead-scroll spinnerdiv"
                            : ""
                            } customTable lead-scroll`}
                        style={{ width: "100%" }}
                        autoHeight
                        autoHeightMin={0}
                        autoHeightMax={`${fullScreen
                            ? "calc(100vh - 12rem)"
                            : resizableHeight
                            } `}
                        // autoHeightMax="25vh"
                        renderThumbVertical={(props) => (
                            <div {...props} className="thumb-vertical" />
                        )}
                        renderTrackVertical={(props) => (
                            <div {...props} className="track-vertical" />
                        )}
                        renderThumbHorizontal={(props) => (
                            <div {...props} className="thumb-horizontal" />
                        )}
                        onScrollFrame={(event) => {
                            const {
                                top,
                                scrollTop,
                                clientHeight,
                                scrollHeight,
                            } = event;
                            if (
                                top &&
                                Math.round(scrollTop + clientHeight) >=
                                Math.round((scrollHeight * 50) / 100) &&
                                !nextPageDataLoading &&
                                page < totalPage && !fullScrnAnalytics
                            ) {
                                setState((prev) => ({
                                    ...prev,
                                    nextPageDataLoading: true,
                                }));
                                onPageChange();
                            }
                        }}
                    >
                        <GlobalTable
                            tableStyle={{
                                border: 0,
                                cellPadding: 0,
                                cellSpacing: 0,
                            }}
                            cols={
                                useWellsAndRigsCol() as GlobalTableProps["cols"]
                            }
                            loadingMsg={"Loading..."}
                            rowId={tabIndex === 0 ? (selectedRowId as string) : (selectedRowId as number)}
                            data={
                                onlyCheckedData ? checkedItemList.length > LINE_CHART_MAX_ITEM_ALLOWED ? [...checkedItemList].slice(0, LINE_CHART_MAX_ITEM_ALLOWED) : checkedItemList : Array.isArray(wellsDataList) ||
                                    Array.isArray(rigsDataList) ||
                                    Array.isArray(permitDataList) || Array.isArray(productionDataList)
                                    ? tabIndex === 0
                                        ? // ? fullScreen
                                        wellsDataList
                                        : // : wellsDataList.slice(0, 3)
                                        tabIndex === 1
                                            ? // ? fullScreen
                                            rigsDataList
                                            : // : rigsDataList.slice(0, 3)
                                            // : fullScreen
                                            tabIndex === 2 ? permitDataList : productionDataList
                                    : (null as any)
                                // ? permitDataList
                                // : permitDataList.slice(0, 3)
                            }
                            graySelected={viewAnalytics}
                            showColGroup={true}
                        />
                        {/* {nextPageDataLoading && <Spinner />} */}
                    </Scrollbars>
                    {nextPageDataLoading && <Spinner />}
                </>
            </LazyLoad>
        </div>
    );
}

export default TabCont;
