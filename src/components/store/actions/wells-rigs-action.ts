import { ThunkAction } from "redux-thunk";
import { RootState } from "..";
import { AnyAction } from "redux";
import wellsAndRigs from "../reducers/wells-rigs-slice";
import {
    ActionType,
    Col,
    CountyStatObject,
    ForecastFilterObj,
    ForecastingFormObj,
    ProductionDataObj,
    RigsDataObj,
    WellsAndPermitsObject,
    WellsRigsModel,
    tableColObje,
} from "../../models/redux-models";
import {
    FetchStateAdvFilterReturnType,
    ReturnMsgAndStatus,
    SaveSegmentAdvFilterFormData,
    WellsOrRigsReturnType,
} from "../../models/submit-form";
import {
    hideSiteLoader,
    showSiteLoader,
    toggleDownloadColMsgModal,
} from "./modal-actions";
import { SetPanelFilter, UpdateCountyTotals } from "../../map/redux/filters";
import {
    ANALYTICS_CUM_TAB,
    LINE_CHART_MAX_ITEM_ALLOWED,
    ANALYTICS_MONTHLY_TAB,
    OPERATOR,
    config,
    errToast,
    tokenIsValid,
    capitalize,
    actionType,
    rigs,
} from "../../../utils/helper";
import axios from "../../../utils/axios";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { logUserAction } from "./auth-actions";

export const wellsAndRigsActions = wellsAndRigs.actions;

export const showHideComp = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.showHideComp());
    };
};

export const showHideAdvFilter = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.showHideAdvFilter());
    };
};

export const showHideColProperties = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.showHideColProperties());
    };
};

export const showHideFullScreen = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.showHideFullScreen());
    };
};

export const showHideCsvDownOpt = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.showHideCsvDownOpt());
    };
};

export const updateTableCol = (
    tableCol:
        | WellsRigsModel["tableCol"]
        | WellsRigsModel["rigsTableCol"]
        | WellsRigsModel["productionCol"],
    tabIndex?: WellsRigsModel["tabIndex"]
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(
            wellsAndRigsActions.updateTableCol({ data: tableCol, tabIndex })
        );
    };
};

export const resetWellsAndRigsSliceToInitial = (
    holdPrevVal = false
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(
            wellsAndRigsActions.resetWellsAndRigsSliceToInitial({
                holdPrevVal,
            })
        );
    };
};

export const toggleChooseColExportToCsvModal = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.toggleChooseColExportToCsvModal());
    };
};

export const toggleExportOtherCsvModal = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.toggleExportOtherCsvModal());
    };
};

export const loadWellsData = (data: {
    data: WellsAndPermitsObject[];
    total_permit: number;
    total_rigs: number;
    total_production: number;
    total_count: number;
    page_size: number;
    notConCatData?: boolean;
}): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.loadWellsData(data));
    };
};

export const loadPermitsData = (data: {
    data: WellsAndPermitsObject[];
    total_rigs: number;
    total_well: number;
    total_production: number;
    total_count: number;
    page_size: number;
    notConCatData?: boolean;
}): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.loadPermitsData(data));
    };
};

export const loadRigsData = (data: {
    data: RigsDataObj[];
    total_permit: number;
    total_well: number;
    total_production: number;
    total_count: number;
    page_size: number;
    notConCatData?: boolean;
}): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.loadRigsData(data));
    };
};

export const loadProductionData = (data: {
    data: ProductionDataObj[];
    total_permit: number;
    total_rigs: number;
    total_well: number;
    total_count: number;
    page_size: number;
    notConCatData?: boolean;
}): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.loadProductionData(data));
    };
};

//getWells
export const getWellsAndPermitList = (
    token: string,
    formData: {
        page?: number;
        search_type?: string;
        search_param?: string;
        aoi_id?: number;
        sort_order?: string;
        sort_by?: string;
        uid?: string[];
        [x: string]: any;
    },
    showLoader = true
): ThunkAction<
    Promise<WellsOrRigsReturnType>,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        // showLoader && dispatch(showSiteLoader());
        showLoader && dispatch(handleTableLoader(true));
        const {
            wellsAndRigs: {
                wellsData: {
                    data: wellsDataList,
                    total_count: wellsTotalCount,
                },
                rigsData: { data: rigsDataList, total_count: rigsTotalCount },
                permitsData: {
                    data: permitDataList,
                    total_count: permitTotalCount,
                },
                productionData: {
                    data: productionDataList,
                    total_count: productionTotalCount,
                },
                tabIndex,
            },
        } = getState();
        let tempData =
            tabIndex === 0
                ? wellsDataList
                : tabIndex === 1
                ? rigsDataList
                : tabIndex === 2
                ? permitDataList
                : productionDataList;
        await tokenIsValid(token);

        try {
            const res = await axios.post(
                `/api-aoi/get-wells`,
                formData,
                config
            );
            if ("filter_param" in formData) {
                dispatch(
                    handleAdvFilterSearch({
                        filter: "",
                        filter_param: [],
                        segment_id: 0,
                    })
                );
            }
            if ("well_type" in formData) {
                dispatch(SetPanelFilter(formData));
            }
            if (
                "filter" in formData &&
                formData.filter === "advanced" &&
                formData.search_type !== "well_count_by_county"
            ) {
                //log advanced filter
                dispatch(
                    logUserAction({
                        action_type: actionType["execute_advanced_filter"],
                        action_log_detail: JSON.stringify(formData),
                        // action_log_detail: "Advanced filter search."
                    })
                );
            }
            const { data: dataObj, status, msg } = res.data;
            status === 200 && "uid" in formData && dispatch(handleUIDList([]));

            if ("download" in formData) {
                dispatch(handleDownloadCol({ downloadCol: 0, allCol: 0 }));
                dispatch(handleDownloadColMsg(dataObj.message));
                dispatch(toggleDownloadColMsgModal());
                sessionStorage.removeItem("exportCol");
                showLoader && dispatch(handleTableLoader(false));
                //log table data when data is greater than limit
                dispatch(
                    logUserAction({
                        action_type: actionType["download_docs"],
                        // action_log_detail:
                        //     "Table data, when data is greater than download limit.",
                        action_log_detail: JSON.stringify(formData),
                    })
                );
                return;
            }
            //reset the downloadCol and allCol
            status === 200 &&
                "downloadCol" in formData &&
                dispatch(handleDownloadCol({ downloadCol: 0, allCol: 0 }));

            if (!dataObj) {
                if (formData.search_type === "well_count_by_county") {
                    return;
                }
                if (formData.search_type === "permit") {
                    dispatch(
                        loadPermitsData({
                            data: [],
                            total_count: 0,
                            page_size: 0,
                            total_rigs: 0,
                            total_well: 0,
                            total_production: 0,
                            notConCatData: true,
                        })
                    );
                    // dispatch(hideSiteLoader());
                    showLoader && dispatch(handleTableLoader(false));
                    return;
                }

                if (formData.search_type === "rigs") {
                    dispatch(
                        loadRigsData({
                            data: [],
                            total_count: 0,
                            page_size: 0,
                            total_permit: 0,
                            total_well: 0,
                            total_production: 0,
                            notConCatData: true,
                        })
                    );
                    // dispatch(hideSiteLoader());
                    showLoader && dispatch(handleTableLoader(false));
                    return;
                }

                if (formData.search_type === "production") {
                    dispatch(
                        loadProductionData({
                            data: [],
                            total_count: 0,
                            page_size: 0,
                            total_permit: 0,
                            total_well: 0,
                            total_rigs: 0,
                            notConCatData: true,
                        })
                    );
                    // dispatch(hideSiteLoader());
                    showLoader && dispatch(handleTableLoader(false));
                    return;
                }

                dispatch(
                    loadWellsData({
                        data: [],
                        total_count: 0,
                        page_size: 0,
                        total_permit: 0,
                        total_rigs: 0,
                        total_production: 0,
                        notConCatData: true,
                    })
                );
                // dispatch(hideSiteLoader());
                showLoader && dispatch(handleTableLoader(false));
                return;
            }
            if (status === 200 && dataObj) {
                const {
                    data,
                    page_size,
                    total_count,
                    total_permit,
                    total_rigs,
                    total_well,
                    total_production,
                } = dataObj;
                const { search_type, search_param, page } = formData;
                if (search_type) {
                    search_type === "well_count_by_county" &&
                        Array.isArray(dataObj) &&
                        dispatch(
                            UpdateCountyTotals(
                                dataObj.map((item: CountyStatObject) => ({
                                    ...item,
                                }))
                            )
                        );
                    search_type === "permit" &&
                        dispatch(
                            loadPermitsData({
                                data:
                                    "uid" in formData
                                        ? [
                                              ...data.map(
                                                  (
                                                      item: WellsAndPermitsObject
                                                  ) => ({
                                                      ...item,
                                                      id: item.uid,
                                                      checked: true,
                                                  })
                                              ),
                                              ...(
                                                  tempData as WellsAndPermitsObject[]
                                              ).map(
                                                  (
                                                      _item: WellsAndPermitsObject
                                                  ) =>
                                                      JSON.stringify(
                                                          formData.uid
                                                      ).includes(`${_item.uid}`)
                                                          ? {
                                                                ..._item,
                                                                checked: true,
                                                            }
                                                          : _item
                                              ),
                                          ]
                                        : data.map(
                                              (
                                                  item: WellsAndPermitsObject
                                              ) => ({
                                                  ...item,
                                                  checked: false,
                                                  id: item.uid,
                                              })
                                          ),
                                total_count:
                                    "uid" in formData
                                        ? permitTotalCount + total_count
                                        : total_count,
                                page_size,
                                total_rigs,
                                total_well,
                                total_production,
                                ...(search_param !== "undefined" && {
                                    notConCatData: page === 1 ? true : false,
                                }),
                            })
                        );
                    search_type === "rigs" &&
                        dispatch(
                            loadRigsData({
                                data:
                                    "uid" in formData
                                        ? [
                                              ...data.map(
                                                  (item: RigsDataObj) => ({
                                                      ...item,
                                                      id: item.uid,
                                                      checked: true,
                                                  })
                                              ),
                                              ...(
                                                  tempData as RigsDataObj[]
                                              ).map((_item: RigsDataObj) =>
                                                  JSON.stringify(
                                                      formData.uid
                                                  ).includes(`${_item.uid}`)
                                                      ? {
                                                            ..._item,
                                                            checked: true,
                                                        }
                                                      : _item
                                              ),
                                          ]
                                        : data.map((item: RigsDataObj) => ({
                                              ...item,
                                              id: item.uid,
                                              checked: false,
                                          })),
                                total_count:
                                    "uid" in formData
                                        ? rigsTotalCount + total_count
                                        : total_count,
                                page_size,
                                total_permit,
                                total_well,
                                total_production,
                                ...(search_param !== "undefined" && {
                                    notConCatData:
                                        page === 1 || "uid" in formData
                                            ? true
                                            : false,
                                }),
                            })
                        );
                    search_type === "production" &&
                        dispatch(
                            loadProductionData({
                                data:
                                    "uid" in formData
                                        ? [
                                              ...data.map(
                                                  (
                                                      item: WellsAndPermitsObject
                                                  ) => ({
                                                      ...item,
                                                      id: item.uid,
                                                      checked: true,
                                                  })
                                              ),
                                              ...(
                                                  tempData as WellsAndPermitsObject[]
                                              ).map(
                                                  (
                                                      _item: WellsAndPermitsObject
                                                  ) =>
                                                      JSON.stringify(
                                                          formData.uid
                                                      ).includes(`${_item.uid}`)
                                                          ? {
                                                                ..._item,
                                                                checked: true,
                                                            }
                                                          : _item
                                              ),
                                          ]
                                        : data.map(
                                              (
                                                  item: WellsAndPermitsObject
                                              ) => ({
                                                  ...item,
                                                  id: item.uid,
                                                  checked: false,
                                              })
                                          ),
                                total_count:
                                    "uid" in formData
                                        ? productionTotalCount + total_count
                                        : total_count,
                                page_size,
                                total_permit,
                                total_well,
                                total_rigs,
                                ...(search_param !== "undefined" && {
                                    notConCatData:
                                        page === 1 || "uid" in formData
                                            ? true
                                            : false,
                                }),
                            })
                        );
                } else {
                    dispatch(
                        loadWellsData({
                            data:
                                "uid" in formData
                                    ? [
                                          ...data.map(
                                              (
                                                  item: WellsAndPermitsObject
                                              ) => ({
                                                  ...item,
                                                  id: item.uid,
                                                  checked: true,
                                              })
                                          ),
                                          ...(
                                              tempData as WellsAndPermitsObject[]
                                          ).map(
                                              (_item: WellsAndPermitsObject) =>
                                                  JSON.stringify(
                                                      formData.uid
                                                  ).includes(`${_item.uid}`)
                                                      ? {
                                                            ..._item,
                                                            checked: true,
                                                        }
                                                      : _item
                                          ),
                                      ]
                                    : data.map(
                                          (item: WellsAndPermitsObject) => ({
                                              ...item,
                                              id: item.uid,
                                              checked: false,
                                          })
                                      ),
                            total_count:
                                "uid" in formData
                                    ? wellsTotalCount + total_count
                                    : total_count,
                            page_size,
                            total_permit,
                            total_rigs,
                            total_production,
                            ...(search_param !== "undefined" && {
                                notConCatData:
                                    page === 1 || "uid" in formData
                                        ? true
                                        : false,
                            }),
                        })
                    );
                }
            } else {
                status !== 200 && toast.error(msg);
            }
            // showLoader && dispatch(hideSiteLoader());
            showLoader && dispatch(handleTableLoader(false));
            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
            // showLoader && dispatch(hideSiteLoader());
            showLoader && dispatch(handleTableLoader(false));
        }
    };
};

//handleTabIndex
export const handleTabIndex = (
    index: WellsRigsModel["tabIndex"]
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.handleTabIndex(index));
    };
};

//handleSelectedAoiData
// pass zero to reset to intial
export const handleSelectedAoiData = (data: {
    aoi_id: number;
}): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.handleSelectedAoiData(data));
    };
};

export const clearWellsData = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.clearWellsData());
    };
};

export const clearRigsData = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.clearRigsData());
    };
};

export const clearPermitData = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.clearPermitData());
    };
};

export const clearProductionData = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.clearProductionData());
    };
};

export const handlePageChange = (
    page: WellsRigsModel["wellsPage"]
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.handlePageChange(page));
    };
};

export const setFilterSearch = (
    keyword: string
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.setFilterSearch(keyword));
    };
};

export const clearFilterSearch = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.clearFilterSearch());
    };
};

//handleSortAndOrderBy
export const handleSortAndOrderBy = (data: {
    sort_by?: WellsRigsModel["sort_by"];
    sort_order: WellsRigsModel["sort_order"];
}): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.handleSortAndOrderBy(data));
    };
};

//toggle view Analytics
export const toggleViewAnalytics = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.toggleViewAnalytics());
    };
};

// save segment in advanced filter
export const saveSegmentAdvFilter = (
    token: string,
    formData: SaveSegmentAdvFilterFormData
): ThunkAction<Promise<ReturnMsgAndStatus>, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token);
        try {
            const res = await axios.post(
                "/api-segment/segment",
                formData,
                config
            );
            dispatch(hideSiteLoader());
            const { status, msg } = res.data;
            if (status === 200) {
                toast.success(msg);
            } else {
                toast.error(msg);
            }
            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };
};

//handle advanced filter search
export const handleAdvFilterSearch = (data: {
    filter: WellsRigsModel["filter"];
    filter_param: WellsRigsModel["filter_param"];
    segment_id: WellsRigsModel["segment_id"];
}): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.handleAdvFilterSearch(data));
    };
};

//state options
export const fetchStateInAdvFilter =
    (
        token: string,
        data: { county: string }
    ): ThunkAction<
        Promise<FetchStateAdvFilterReturnType>,
        RootState,
        unknown,
        AnyAction
    > =>
    async (dispatch) => {
        const { county } = data;
        await tokenIsValid(token);
        try {
            const response = await axios.get(
                `/api-segment/get-state?county_name=${county}`,
                config
            );
            const { status, msg } = response.data;
            if (status !== 200) toast.error(msg);
            return response.data;
        } catch (err) {
            errToast(err as AxiosError);
        }
    };

// update segment in advanced filter
export const updateSegmentAdvFilter = (
    token: string,
    formData: SaveSegmentAdvFilterFormData
): ThunkAction<Promise<ReturnMsgAndStatus>, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token);
        try {
            const res = await axios.put(
                "/api-segment/segment",
                formData,
                config
            );
            dispatch(hideSiteLoader());
            const { status, msg } = res.data;
            if (status === 200) {
                toast.success(msg);
            } else {
                toast.error(msg);
            }
            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };
};

//toggle table loader
export const handleTableLoader = (
    val: boolean
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.handleTableLoader(val));
    };
};

//handle selected row id
export const handleSelectedRowId = (
    val: string | number
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.handleSelectedRowId(val));
    };
};
//download col
export const handleDownloadCol = (data: {
    downloadCol: WellsRigsModel["downloadCol"];
    allCol?: WellsRigsModel["allCol"];
}): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.handleDownloadCol(data));
    };
};

//download col msg
export const handleDownloadColMsg = (
    val: WellsRigsModel["downloadColMsg"]
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.handleDownloadColMsg(val));
    };
};

//toggle table
export const handleShowAndHideTable = (
    val: WellsRigsModel["showTable"]
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.handleShowAndHideTable(val));
    };
};

//toggle segment dropdown
export const handleShowAndHideSegmentDropDown = (
    val: WellsRigsModel["showSegmentDropDown"]
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.handleShowAndHideSegmentDropDown(val));
    };
};

// get analytics data
export const getAnalyticsData = (
    token: string,
    formData: {
        api_id: string[];
        type: typeof ANALYTICS_MONTHLY_TAB | typeof ANALYTICS_CUM_TAB;
        action: ActionType;
    },
    showToast?: boolean
): ThunkAction<Promise<ReturnMsgAndStatus>, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        // dispatch(showSiteLoader());
        await tokenIsValid(token);
        let path =
            formData.action && formData.action !== "none"
                ? "/api-search/aggregate-data"
                : formData.type === ANALYTICS_MONTHLY_TAB
                ? "/api-search/graph-data"
                : "/api-search/commulative-data";
        try {
            const res = await axios.post(
                path,
                {
                    api_id: formData.api_id,
                    ...(formData.action === "none" && {
                        type: formData.type,
                    }),
                    ...(formData.action !== "none" && {
                        action: formData.action,
                    }),
                    ...(formData.action !== "none" &&
                        formData.type === ANALYTICS_CUM_TAB && {
                            cum_data: "cum_data",
                        }),
                },
                config
            );
            const { status, msg, oil_data, gas_data } = res.data;
            if (status === 200) {
                //log use view_analytics
                dispatch(
                    logUserAction({
                        action_type: actionType["view_analytics"],
                        action_log_detail: `api_id: ${formData["api_id"]}`,
                    })
                );
                // toast.success(msg);
                if (formData.action !== "none") {
                    dispatch(
                        handleAnalyticsData({
                            oilList: oil_data
                                ? [
                                      {
                                          name: capitalize(formData.action),
                                          values: oil_data,
                                      },
                                  ]
                                : [],
                            gasList: gas_data
                                ? [
                                      {
                                          name: capitalize(formData.action),
                                          values: gas_data,
                                      },
                                  ]
                                : [],
                            type: formData.type,
                        })
                    );
                } else {
                    let gasKeys = gas_data ? Object.keys(gas_data) : [];
                    let oilKeys = oil_data ? Object.keys(oil_data) : [];
                    dispatch(
                        handleAnalyticsData({
                            oilList:
                                oilKeys.length > 0
                                    ? oilKeys.map((item) => {
                                          return {
                                              name: item,
                                              values: oil_data[`${item}`],
                                          };
                                      })
                                    : [],
                            gasList:
                                gasKeys.length > 0
                                    ? gasKeys.map((_item) => {
                                          return {
                                              name: _item,
                                              values: gas_data[`${_item}`],
                                          };
                                      })
                                    : [],
                            type: formData.type,
                        })
                    );
                }
            } else {
                toast.error(msg);
            }
            // dispatch(hideSiteLoader());
            showToast &&
                toast.info(
                    `Graph is limited to production data from your first ${LINE_CHART_MAX_ITEM_ALLOWED} selections in the list below.`,
                    { autoClose: 5000 }
                );
            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
            // dispatch(hideSiteLoader());
        }
    };
};

//handle analytics data
export const handleAnalyticsData = (data: {
    oilList: WellsRigsModel["analyticsData"]["oil_data"];
    gasList: WellsRigsModel["analyticsData"]["gas_data"];
    type: WellsRigsModel["analyticsData"]["type"];
    cumDataLoading?: WellsRigsModel["analyticsData"]["cumDataLoading"];
    monthlyDataLoading?: WellsRigsModel["analyticsData"]["monthlyDataLoading"];
}): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.handleAnalyticsData(data));
    };
};

//handle full screen analytics view
export const handleFullScrnAnalytics = (val: {
    fullScrnAnalytics: WellsRigsModel["fullScrnAnalytics"];
    fullScrnAnalyticsType?: WellsRigsModel["fullScrnAnalyticsType"];
}): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.handleFullScrnAnalytics(val));
    };
};

//handle checked Item List
export const handleCheckedItemList = (
    data: WellsRigsModel["checkedItemList"]
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.handleCheckedItemList(data));
    };
};

// get analytics data
export const getAnalyticsDonutData = (
    token: string,
    formData: { api_id: string[]; type?: typeof OPERATOR }
): ThunkAction<Promise<ReturnMsgAndStatus>, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        await tokenIsValid(token);
        try {
            const res = await axios.post(
                "/api-search/production-count",
                formData,
                config
            );
            const { status, msg, data: resData } = res.data;
            if (status === 200) {
                if (formData.type) {
                    let tempObj: { [x: string]: number } = {};
                    resData.forEach(
                        (obj: { operator_name: string; total: number }) => {
                            const { operator_name, total } = obj;
                            Object.assign(tempObj, { [operator_name]: total });
                        }
                    );
                    dispatch(
                        handleOperatorPieChart({
                            data: tempObj,
                        })
                    );
                } else {
                    dispatch(
                        handleDonutChart({
                            data: Array.isArray(resData)
                                ? resData.map((item) => ({
                                      label: item.production_type,
                                      value: item.total,
                                  }))
                                : [],
                        })
                    );
                }
            } else {
                toast.error(msg);
            }

            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
        }
    };
};

//handle donut chart
export const handleDonutChart = (data: {
    data: WellsRigsModel["donutChart"]["dataList"];
    dataLoading?: WellsRigsModel["donutChart"]["dataLoading"];
}): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.handleDonutChart(data));
    };
};

//handle operator pie chart
export const handleOperatorPieChart = (data: {
    data: WellsRigsModel["operatorPieChart"]["operatorPieChartDataList"];
    operatorPieChartDataLoading?: WellsRigsModel["operatorPieChart"]["operatorPieChartDataLoading"];
}): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.handleOperatorPieChart(data));
    };
};

//handle Analytics tab index
export const handleAnalyticsTabIndex = (
    val: WellsRigsModel["analyticsTabIndex"]
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.handleAnalyticsTabIndex(val));
    };
};

//handle Analytics production tab filter
export const handleAnalyticsProdFilters = (val: {
    type?: WellsRigsModel["analyticsData"]["type"];
    xAxisFilterVal?: WellsRigsModel["analyticsData"]["xAxisFilter"];
    action?: WellsRigsModel["analyticsData"]["action"];
    apiList?: WellsRigsModel["analyticsData"]["apiList"];
    apiListObj?: WellsRigsModel["analyticsData"]["apiListObj"];
    apiListObjLength?: WellsRigsModel["analyticsData"]["apiListObjLength"];
}): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.handleAnalyticsProdFilters(val));
    };
};

//handle normalized checkbox
export const handleNormalize = (
    val: boolean
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.handleNormalize(val));
    };
};

//handle forecast screen opening
export const handleForecast = (
    val: WellsRigsModel["openForeCast"]
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.handleForecast(val));
    };
};
// handle resize
export const handleResizableWidth = (
    resizableWidth: WellsRigsModel["resizableWidth"]
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.handleResizableWidth(resizableWidth));
    };
};

// get forecasting data
export const forecastingData = (
    token: string,
    formData: ForecastFilterObj & {
        data: ForecastingFormObj[];
        sample_data: ForecastingFormObj[];
    },
    typeCurve = false
): ThunkAction<Promise<ReturnMsgAndStatus>, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());
        const {
            wellsAndRigs: {
                analyticsData: { apiListObj },
                tabIndex,
            },
        } = getState();
        await tokenIsValid(token);
        try {
            const res = await axios.post(
                typeCurve ? "/api-search/type-curves" : "/api-search/forecast",
                formData,
                config
            );
            dispatch(hideSiteLoader());
            const {
                status,
                msg,
                data,
                eur,
                qi,
                b,
                ai,
                tlim,
                start_date_select,
                peakmo,
            } = res.data;
            if (status === 200 && data) {
                dispatch(
                    logUserAction({
                        action_type: actionType["run_forecast"],
                        action_log_detail: JSON.stringify(
                            apiListObj.map((_i) => ({
                                api:
                                    tabIndex === 1
                                        ? (_i as RigsDataObj)["api"]
                                        : (_i as WellsAndPermitsObject)[
                                              "well_api"
                                          ],
                                well_name: _i["well_name"],
                                county: _i["county"],
                                state: _i["state_abbr"],
                                operator: _i["operator_name"],
                            }))
                        ),
                    })
                );
                type obj = {
                    production_date: string;
                    api: string;
                    production_quantity: string;
                    DCA: number;
                    product_stream: number;
                    data_type: string;
                };
                type typeCurveObj = {
                    producing_month: number;
                    production_quantity: number;
                    production_quantity_ft: string;
                    DCA: number;
                };
                let tempData = data
                    .filter((item: obj | typeCurveObj) => item.DCA)
                    .map((_item: obj | typeCurveObj, index: number) => ({
                        ...(!typeCurve && {
                            date: (_item as obj).production_date,
                        }),
                        price: _item.DCA,
                        ...(!typeCurve && { numValue: index }),
                        ...(typeCurve && {
                            numValue: (_item as typeCurveObj).producing_month,
                        }),
                        highlight: true,
                    }));
                tempData.length &&
                    dispatch(
                        handleForecastingData({
                            data: [
                                {
                                    name: apiListObj[0]["well_name"],
                                    values: tempData,
                                },
                            ],
                            forecastingCompleteDataFrame: JSON.stringify(data),
                            eur: Math.trunc(eur),
                            ...(qi !== 0 && { qi }),
                            ...(b !== 0 && { b }),
                            // ...(ai !== 0 && { ai: Math.trunc(ai) }),
                            ...(ai !== 0 && { ai }),
                            ...(tlim !== 0 && { tlim: Math.ceil(ai) }),
                            ...(start_date_select && { start_date_select }),
                            ...(peakmo !== 0 && typeCurve && { peakmo }),
                        })
                    );
            } else {
                toast.error(msg);
            }
            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };
};

// handle forecasting data
export const handleForecastingData = (val: {
    data: WellsRigsModel["analyticsData"]["forecastingData"]["dataList"];
    dataLoading?: WellsRigsModel["analyticsData"]["forecastingData"]["dataLoading"];
    forecastingCompleteDataFrame?: WellsRigsModel["analyticsData"]["forecastingData"]["forecastingCompleteDataFrame"];
    eur?: WellsRigsModel["analyticsData"]["forecastingData"]["eur"];
    ai?: WellsRigsModel["analyticsData"]["forecastingData"]["ai"];
    b?: WellsRigsModel["analyticsData"]["forecastingData"]["b"];
    qi?: WellsRigsModel["analyticsData"]["forecastingData"]["qi"];
    tlim?: WellsRigsModel["analyticsData"]["forecastingData"]["tlim"];
    start_date_select?: WellsRigsModel["analyticsData"]["forecastingData"]["start_date_select"];
    peakmo?: WellsRigsModel["analyticsData"]["forecastingData"]["peakmo"];
}): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.handleForecastingData(val));
    };
};

// handle selected forecast point data
export const handleSelectedForecastPoint = (val: {
    data: WellsRigsModel["analyticsData"]["selectedForecastPoint"];
    doNotConCat?: boolean;
}): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.handleSelectedForecastPoint(val));
    };
};

//handle rearrange of table row
export const handleRearrange = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.handleRearrange());
    };
};

// Fetch column properties
export const fetchColumnProperties = (): ThunkAction<
    Promise<void>,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        const {
            auth: {
                user: { access_token },
            },
            wellsAndRigs: { rigsTableCol, tableCol },
        } = getState();

        await tokenIsValid(access_token);

        axios
            .get("/api-user/search-settings", config)
            .then((res) => {
                const { status, msg, data } = res.data;
                if (status === 200) {
                    if (data) {
                        let tempRigsCols: tableColObje[] = [];
                        let tempTableCol: tableColObje[] = [];
                        data.forEach((_item: Col) => {
                            let currentItem = (
                                _item.tab_opt === rigs ? rigsTableCol : tableCol
                            ).find((obj) => obj.label === _item.column_key);

                            if (_item.tab_opt === rigs) {
                                tempRigsCols.push({
                                    ...(currentItem as tableColObje),
                                    status: _item.is_visible,
                                });
                            } else {
                                tempTableCol.push({
                                    ...(currentItem as tableColObje),
                                    status: _item.is_visible,
                                });
                            }
                        });

                        tempTableCol.length === tableCol.length &&
                            dispatch(updateTableCol(tempTableCol));
                        tempRigsCols.length === rigsTableCol.length &&
                            dispatch(updateTableCol(tempRigsCols, 1));
                    }
                    // toast.success(msg);
                } else {
                    toast.error(msg);
                }
            })
            .catch((err) => {
                errToast(err as AxiosError);
                dispatch(hideSiteLoader());
            });
    };
};

// set default column properties
export const setDefaultColumnProperties = (): ThunkAction<
    Promise<void>,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        const {
            auth: {
                user: { access_token },
            },
            wellsAndRigs: { tabIndex, rigsTableCol, tableCol },
        } = getState();

        await tokenIsValid(access_token);

        axios
            .post(
                "/api-user/search-settings",
                {
                    tab: tabIndex !== 1 ? (tabIndex === 0 ? 1 : 2) : 3,
                    data:
                        tabIndex !== 1
                            ? tableCol.map((_item) => ({
                                  label: _item.label,
                                  status: _item.status,
                              }))
                            : rigsTableCol.map((_item) => ({
                                  label: _item.label,
                                  status: _item.status,
                              })),
                },
                config
            )
            .then((res) => {
                const { status, msg } = res.data;
                if (status === 200) {
                    // toast.success(msg);
                } else {
                    toast.error(msg);
                }
            })
            .catch((err) => {
                errToast(err as AxiosError);
                dispatch(hideSiteLoader());
            });
    };
};

// handle resize
export const handleResizableHeight = (
    resizableHeight: WellsRigsModel["resizableHeight"]
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.handleResizableHeight(resizableHeight));
    };
};

//handle uid
export const handleUIDList = (
    val: WellsRigsModel["uid"]
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(wellsAndRigsActions.handleUIDList(val));
    };
};
