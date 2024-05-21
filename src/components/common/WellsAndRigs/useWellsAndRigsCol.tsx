import React, {
    useEffect,
    //  useRef,
    useState
} from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import {
    handleRearrange,
    handleSelectedRowId,
    handleSortAndOrderBy,
    loadPermitsData,
    loadProductionData,
    loadRigsData,
    loadWellsData,
    updateTableCol,
} from "../../store/actions/wells-rigs-action";
import { ProductionDataObj, RigsDataObj, WellsAndPermitsObject } from "../../models/redux-models";
import ArrowSymbol from "../ArrowSymbol";
import moment from "moment";
import { actionType, convertToDisplayFormatShortCurrency, numberFormat } from "../../../utils/helper";
import { highlightSelectedWell } from "../../map/redux/locations";
import { logUserAction } from "../../store/actions/auth-actions";

function useWellsAndRigsCol() {
    const {
        wellsAndRigs: {
            tableCol,
            wellsData: {
                data: wellsDataList,
                total_count: wellsTotalCount,
                page_size: wellsPageSize,
            },
            rigsData: {
                data: rigsDataList,
                total_count: rigsTotalCount,
                page_size: rigsPageSize,
            },
            permitsData: {
                data: permitDataList,
                total_count: permitsTotalCount,
                page_size: permitPageSize,
            },
            productionData: {
                data: productionDataList,
                total_count: productionTotalCount,
                page_size: productionPageSize,
            },
            tabIndex,
            rigsTableCol,
            sort_by,
            sort_order,
            selectedRowId,
            productionCol,
            checkedItemList,
            fullScreen,
            openForeCast,
        },
        // esri: { featuresForStatistics }
    } = useAppSelector((state) => state);
    const onDropItem = React.useRef<any>(null);
    const draggingItem = React.useRef<any>(null);

    const [state, setState] = useState<{
        // highlight: boolean,
        dragOverItem: null | number
    }>({
        // highlight: false,
        dragOverItem: null
    });
    const {
        // highlight,
        dragOverItem } = state;
    const dispatch = useAppDispatch();
    let tableColumn = tabIndex === 1 ? rigsTableCol : tabIndex === 3 ? productionCol : tableCol;
    let data =
        tabIndex === 0
            ? wellsDataList
            : tabIndex === 1
                ? rigsDataList
                : tabIndex === 2 ? permitDataList : productionDataList;
    const onDragStart = (e: React.DragEvent<HTMLSpanElement>, index: number) => {
        (draggingItem.current = index);
        // setState((prev) => ({ ...prev, highlight: true }));
    }

    const onDrop = (e: React.DragEvent<HTMLSpanElement>, index: number) => {
        if (sessionStorage.getItem('HeightDragging')) {
            return
        }
        onDropItem.current = index;
        const copyTablecell = [...tableColumn];
        const draggingItemContent = copyTablecell[draggingItem.current];
        copyTablecell.splice(draggingItem.current, 1);
        copyTablecell.splice(onDropItem.current, 0, draggingItemContent);
        draggingItem.current = onDropItem.current;
        onDropItem.current = null;
        dispatch(updateTableCol(copyTablecell));
        setState((prev) => ({
            ...prev,
            // highlight: false,
            dragOverItem: null
        }));
    };

    const onDragOver = (e: React.DragEvent<HTMLSpanElement>, index: number) => {
        e.preventDefault();
        if (sessionStorage.getItem('HeightDragging')) {
            return
        }
        setState((prev) => ({
            ...prev,
            // highlight: false,
            dragOverItem: typeof (index) === "number" ? index : null
        }));

    }
    const onDragEnd = (e: React.DragEvent<HTMLSpanElement>, index: number) => {
        if (sessionStorage.getItem('HeightDragging')) {
            return
        }
        e.preventDefault();
        setState((prev) => ({
            ...prev,
            // highlight: false,
            dragOverItem: null
        }));

    }


    // const featuresForStatisticsRef = useRef<string[]>([])
    // useEffect(() => {
    //     if (Array.isArray(featuresForStatistics) && data) {
    //         featuresForStatistics.length && (featuresForStatisticsRef.current = featuresForStatistics)
    //         const checkbox = document.getElementById(
    //             `selectAll${tabIndex}`) as HTMLInputElement;
    //         let tempData = (
    //             data as
    //             | WellsAndPermitsObject[]
    //             | RigsDataObj[] | ProductionDataObj[]
    //         ).map((item) => {
    //             if ((featuresForStatistics.length ? featuresForStatistics : featuresForStatisticsRef.current).join(",").includes(`${item.id}`)) {
    //                 return {
    //                     ...item,
    //                     checked: featuresForStatistics.length ? true : false,
    //                 };
    //             } else {
    //                 return item;
    //             }
    //         });
    //         if (
    //             tempData.filter((item) => item.checked)
    //                 .length === tempData.length
    //         ) {
    //             if (checkbox != null) {
    //                 checkbox.checked = true;
    //             }
    //         } else {
    //             if (checkbox != null) {
    //                 checkbox.checked = false;
    //             }
    //         }

    //         !featuresForStatistics.length && (featuresForStatisticsRef.current = [])

    //         if (tabIndex === 0) {
    //             dispatch(
    //                 loadWellsData({
    //                     data: tempData as WellsAndPermitsObject[],
    //                     total_count: wellsTotalCount,
    //                     page_size: wellsPageSize,
    //                     total_rigs: rigsTotalCount,
    //                     total_permit: permitsTotalCount,
    //                     total_production: productionTotalCount,
    //                     notConCatData: true,
    //                 })
    //             );
    //             return;
    //         }

    //         if (tabIndex === 1) {
    //             dispatch(
    //                 loadRigsData({
    //                     data: tempData as RigsDataObj[],
    //                     total_count: rigsTotalCount,
    //                     page_size: rigsPageSize,
    //                     total_well: wellsTotalCount,
    //                     total_permit: permitsTotalCount,
    //                     total_production: productionTotalCount,
    //                     notConCatData: true,
    //                 })
    //             );
    //             return;
    //         }
    //         if (tabIndex === 2) {
    //             dispatch(
    //                 loadPermitsData({
    //                     data: tempData as WellsAndPermitsObject[],
    //                     total_count: permitsTotalCount,
    //                     page_size: permitPageSize,
    //                     total_well: wellsTotalCount,
    //                     total_rigs: rigsTotalCount,
    //                     total_production: productionTotalCount,
    //                     notConCatData: true,
    //                 })
    //             );
    //             return;
    //         }
    //         if (tabIndex === 3) {
    //             dispatch(
    //                 loadProductionData({
    //                     data: tempData as ProductionDataObj[],
    //                     total_count: productionTotalCount,
    //                     page_size: productionPageSize,
    //                     total_well: wellsTotalCount,
    //                     total_rigs: rigsTotalCount,
    //                     total_permit: permitsTotalCount,
    //                     notConCatData: true,
    //                 })
    //             );
    //             return;
    //         }

    //     }
    //     if (Array.isArray(featuresForStatistics) && featuresForStatistics.length) {
    //         const checkbox = document.getElementById(
    //             `selectAll${tabIndex}`) as HTMLInputElement;
    //         let tempData = (
    //             data as
    //             | WellsAndPermitsObject[]
    //             | RigsDataObj[] | ProductionDataObj[]
    //         ).map((item) => {
    //             if (featuresForStatistics.join(",").includes(`${item.id}`)) {
    //                 return {
    //                     ...item,
    //                     checked: true,
    //                 };
    //             } else {
    //                 return item;
    //             }
    //         });
    //         if (
    //             tempData.filter((item) => item.checked)
    //                 .length === tempData.length
    //         ) {
    //             if (checkbox != null) {
    //                 checkbox.checked = true;
    //             }
    //         } else {
    //             if (checkbox != null) {
    //                 checkbox.checked = false;
    //             }
    //         }

    //         if (tabIndex === 0) {
    //             dispatch(
    //                 loadWellsData({
    //                     data: tempData as WellsAndPermitsObject[],
    //                     total_count: wellsTotalCount,
    //                     page_size: wellsPageSize,
    //                     total_rigs: rigsTotalCount,
    //                     total_permit: permitsTotalCount,
    //                     total_production: productionTotalCount,
    //                     notConCatData: true,
    //                 })
    //             );
    //             return;
    //         }

    //         if (tabIndex === 1) {
    //             dispatch(
    //                 loadRigsData({
    //                     data: tempData as RigsDataObj[],
    //                     total_count: rigsTotalCount,
    //                     page_size: rigsPageSize,
    //                     total_well: wellsTotalCount,
    //                     total_permit: permitsTotalCount,
    //                     total_production: productionTotalCount,
    //                     notConCatData: true,
    //                 })
    //             );
    //             return;
    //         }
    //         if (tabIndex === 2) {
    //             dispatch(
    //                 loadPermitsData({
    //                     data: tempData as WellsAndPermitsObject[],
    //                     total_count: permitsTotalCount,
    //                     page_size: permitPageSize,
    //                     total_well: wellsTotalCount,
    //                     total_rigs: rigsTotalCount,
    //                     total_production: productionTotalCount,
    //                     notConCatData: true,
    //                 })
    //             );
    //             return;
    //         }
    //         if (tabIndex === 3) {
    //             dispatch(
    //                 loadProductionData({
    //                     data: tempData as ProductionDataObj[],
    //                     total_count: productionTotalCount,
    //                     page_size: productionPageSize,
    //                     total_well: wellsTotalCount,
    //                     total_rigs: rigsTotalCount,
    //                     total_permit: permitsTotalCount,
    //                     notConCatData: true,
    //                 })
    //             );
    //             return;
    //         }

    //     }
    // }, [featuresForStatistics])

    return [
        ...(openForeCast ? [] : [
            tableColumn.filter((item) => item.status).length > 0 && {
                renderHeadTitle: (
                    rowData: WellsAndPermitsObject | RigsDataObj | ProductionDataObj
                ) => {
                    return (
                        <div className="custom-checkbox">
                            <input
                                name={`selectAll${tabIndex}`}
                                id={`selectAll${tabIndex}`}
                                type="checkbox"
                                className="checkmark"
                                disabled={
                                    Array.isArray(data) && data.length === 0
                                        ? true
                                        : false
                                }
                                checked={checkedItemList.length === data?.length ? true : false}
                                style={
                                    Array.isArray(data) && data.length === 0
                                        ? { cursor: "not-allowed" }
                                        : {}
                                }
                                onChange={(e) => {
                                    const { checked } = e.target;
                                    let tempData = (
                                        data as
                                        | WellsAndPermitsObject[]
                                        | RigsDataObj[] | ProductionDataObj[]
                                    ).map((item) => ({
                                        ...item,
                                        checked,
                                    }));
                                    if (tabIndex === 0) {
                                        dispatch(
                                            loadWellsData({
                                                data: tempData as WellsAndPermitsObject[],
                                                total_count: wellsTotalCount,
                                                page_size: wellsPageSize,
                                                total_rigs: rigsTotalCount,
                                                total_permit: permitsTotalCount,
                                                total_production: productionTotalCount,
                                                notConCatData: true,
                                            })
                                        );
                                        return;
                                    }

                                    if (tabIndex === 1) {
                                        dispatch(
                                            loadRigsData({
                                                data: tempData as RigsDataObj[],
                                                total_count: rigsTotalCount,
                                                page_size: rigsPageSize,
                                                total_well: wellsTotalCount,
                                                total_permit: permitsTotalCount,
                                                total_production: productionTotalCount,
                                                notConCatData: true,
                                            })
                                        );
                                        return;
                                    }
                                    if (tabIndex === 2) {
                                        dispatch(
                                            loadPermitsData({
                                                data: tempData as WellsAndPermitsObject[],
                                                total_count: permitsTotalCount,
                                                page_size: permitPageSize,
                                                total_well: wellsTotalCount,
                                                total_rigs: rigsTotalCount,
                                                total_production: productionTotalCount,
                                                notConCatData: true,
                                            })
                                        );
                                        return;
                                    }
                                    if (tabIndex === 3) {
                                        dispatch(
                                            loadProductionData({
                                                data: tempData as ProductionDataObj[],
                                                total_count: productionTotalCount,
                                                page_size: productionPageSize,
                                                total_well: wellsTotalCount,
                                                total_rigs: rigsTotalCount,
                                                total_permit: permitsTotalCount,
                                                notConCatData: true,
                                            })
                                        );
                                        return;
                                    }
                                }}
                            />
                            <label
                                htmlFor={`selectAll${tabIndex}`}
                                className="custom-label"
                            ></label>
                            &nbsp;
                            {
                                <ArrowSymbol
                                    className="fa fa-caret-up active"
                                    onClick={() => {
                                        dispatch(
                                            handleRearrange()
                                        );
                                    }}
                                />
                            }
                        </div>
                    );
                },
                render: ({
                    id,
                    checked,
                }: WellsAndPermitsObject | RigsDataObj | ProductionDataObj) => {
                    return (
                        <div className="custom-checkbox">
                            <input
                                name={`${id}`}
                                id={`${id}`}
                                type="checkbox"
                                checked={checked}
                                className="checkmark"
                                onChange={(e) => {
                                    const { checked } = e.target;
                                    const checkbox = document.getElementById(
                                        `selectAll${tabIndex}`
                                    ) as HTMLInputElement | null;
                                    let tempData = (
                                        data as
                                        | WellsAndPermitsObject[]
                                        | RigsDataObj[] | ProductionDataObj[]
                                    ).map((item) => {
                                        if (item.id === id) {
                                            return {
                                                ...item,
                                                checked,
                                            };
                                        } else {
                                            return item;
                                        }
                                    });
                                    if (
                                        tempData.filter((item) => item.checked)
                                            .length === tempData.length
                                    ) {
                                        if (checkbox != null) {
                                            checkbox.checked = true;
                                        }
                                    } else {
                                        if (checkbox != null) {
                                            checkbox.checked = false;
                                        }
                                    }

                                    if (tabIndex === 0) {
                                        dispatch(
                                            loadWellsData({
                                                data: tempData as WellsAndPermitsObject[],
                                                total_count: wellsTotalCount,
                                                page_size: wellsPageSize,
                                                total_rigs: rigsTotalCount,
                                                total_permit: permitsTotalCount,
                                                total_production: productionTotalCount,
                                                notConCatData: true,
                                            })
                                        );
                                        return;
                                    }

                                    if (tabIndex === 1) {
                                        dispatch(
                                            loadRigsData({
                                                data: tempData as RigsDataObj[],
                                                total_count: rigsTotalCount,
                                                page_size: rigsPageSize,
                                                total_well: wellsTotalCount,
                                                total_permit: permitsTotalCount,
                                                total_production: productionTotalCount,
                                                notConCatData: true,
                                            })
                                        );
                                        return;
                                    }
                                    if (tabIndex === 2) {
                                        dispatch(
                                            loadPermitsData({
                                                data: tempData as WellsAndPermitsObject[],
                                                total_count: permitsTotalCount,
                                                page_size: permitPageSize,
                                                total_well: wellsTotalCount,
                                                total_rigs: rigsTotalCount,
                                                total_production: productionTotalCount,
                                                notConCatData: true,
                                            })
                                        );
                                        return;
                                    }
                                    if (tabIndex === 3) {
                                        dispatch(
                                            loadProductionData({
                                                data: tempData as ProductionDataObj[],
                                                total_count: productionTotalCount,
                                                page_size: productionPageSize,
                                                total_well: wellsTotalCount,
                                                total_rigs: rigsTotalCount,
                                                total_permit: permitsTotalCount,
                                                notConCatData: true,
                                            })
                                        );
                                        return;
                                    }
                                }}
                            />
                            <label
                                htmlFor={`${id}`}
                                className="custom-label"
                            ></label>
                        </div>
                    );
                },
            },
        ]),
        ...tableColumn
            .filter((item) => item.status)
            .map((_item, _index) => {
                const { header, label } = _item;
                return {
                    title: header.toUpperCase(),
                    // thClassName: highlight && dragOverItem === _index ? "highlight" : "",
                    thClassName: dragOverItem === _index ? "highlight" : "",
                    // colClassName: highlight && draggingItem?.current === _index ? "highlight" : "",
                    ...((label === "cum_oil" || label === "cum_gas") && { unit: label === "cum_oil" ? "MBBLS" : "MCF" }),
                    thStyle: { cursor: "grab" },
                    onDragStart,
                    onDragOver,
                    onDrop,
                    onDragEnd,
                    draggable: true,
                    ...(sort_by && sort_by === label
                        ? sort_order === "ASC"
                            ? {
                                extraContent: (<ArrowSymbol
                                    className="fa fa-caret-up active"
                                    style={{ color: "#0f6bd0" }}
                                    onClick={() => {
                                        dispatch(
                                            handleSortAndOrderBy({
                                                sort_by: label,
                                                sort_order: "DESC",
                                            })
                                        );
                                    }}
                                />
                                ),
                            }
                            : {
                                extraContent: (<ArrowSymbol
                                    className="fa fa-caret-down active"
                                    style={{ color: "#0f6bd0" }}
                                    onClick={() => {
                                        dispatch(
                                            handleSortAndOrderBy({
                                                sort_by: label,
                                                sort_order: "ASC",
                                            })
                                        );
                                    }}
                                />
                                ),
                            }
                        : {
                            extraContent: (<ArrowSymbol
                                className="fas fa-sort"
                                onClick={() => {
                                    dispatch(
                                        handleSortAndOrderBy({
                                            sort_by: label,
                                            sort_order: "ASC",
                                        })
                                    );
                                }}
                            />
                            ),
                        }),
                    renderTdForAction: (
                        rowData: WellsAndPermitsObject | RigsDataObj | ProductionDataObj,
                        key: number
                    ) => {
                        let temp =
                            rowData[
                            label as keyof (
                                | WellsAndPermitsObject
                                | RigsDataObj | ProductionDataObj
                            )
                            ];
                        return (
                            <td
                                key={key}
                                onClick={() => {

                                    if (!openForeCast) {
                                        if (selectedRowId !== rowData.id) {
                                            let tempData: { [x: string]: any, checked?: boolean } = { ...rowData, checked: rowData.checked };
                                            delete tempData['checked']
                                            //log user clicks wells and rigs
                                            dispatch(
                                                logUserAction({
                                                    action_type:
                                                        tabIndex === 0
                                                            ? actionType["click_well"]
                                                            : actionType["click_rig"],
                                                    action_log_detail: JSON.stringify(tempData)
                                                })
                                            );
                                            dispatch(
                                                handleSelectedRowId(rowData.id)
                                            );
                                            !fullScreen && dispatch(highlightSelectedWell({ well_id: rowData.id.toString() }))
                                        } else {
                                            dispatch(handleSelectedRowId(0));
                                            !fullScreen && dispatch(highlightSelectedWell({ well_id: "" }))
                                        }
                                    }

                                }}
                                title={label === "cum_oil" || label === "cum_gas" ? convertToDisplayFormatShortCurrency(Number(temp)).toString() : (label === "depth" || label === "elevation" || label === "permit_count") ?
                                    temp ? numberFormat.format(Number(temp)) : "-" : temp?.toString() ?? "-"}
                                className={dragOverItem === _index ? "highlight" : ""}
                            >
                                <span
                                    className={
                                        label === "well_status" ? "status" : ""
                                    }
                                >
                                    {label === "cum_oil" || label === "cum_gas" ? convertToDisplayFormatShortCurrency(Number(temp)) : label === "spud_date" ||
                                        label === "production_date" ||
                                        label === "permit_date" ||
                                        label === "completion_date" ||
                                        label === "added_on" || label === "updated_on"
                                        ? temp
                                            ? moment(temp as string).format(
                                                "MMM-DD-YYYY"
                                            )
                                            : "-"
                                        : (label === "depth" || label === "elevation" || label === "permit_count") ?
                                            temp ? numberFormat.format(Number(temp)) : "-" : temp
                                                ? typeof temp === "string" &&
                                                    `${temp}`.trim().length > 27
                                                    ? temp.slice(0, 27) + "..."
                                                    : temp.toString()
                                                : "-"}
                                </span>
                            </td>
                        );
                    },
                };
            }),
    ];
}

export default useWellsAndRigsCol;
