import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { WellsRigsModel } from "../../models/redux-models";

const initialState: WellsRigsModel = {
    comp: true,
    advFilter: false,
    colProperties: false,
    fullScreen: false,
    csvDownOpt: false,
    chooseColExportToCsvModal: false,
    exportOtherCsvModal: false,
    tableCol: [
        {
            header: "Well Name",
            label: "well_name",
            status: true,
        },
        {
            header: "Well Api",
            label: "well_api",
            status: true,
        },
        {
            header: "Operator",
            label: "operator_name",
            status: true,
        },
        {
            header: "County",
            label: "county",
            status: true,
        },
        {
            header: "State",
            label: "state_abbr",
            status: true,
        },
        {
            header: "Basin",
            label: "basin_name",
            status: true,
        },
        {
            header: "Measured Depth",
            label: "measured_depth",
            status: true,
        },
        {
            header: "True Vertical Depth",
            label: "true_vertical_depth",
            status: true,
        },
        {
            header: "Lateral Length",
            label: "lateral_length",
            status: true,
        },
        {
            header: "Permit Date",
            label: "permit_date",
            status: true,
        },
        {
            header: "Spud Date",
            label: "spud_date",
            status: true,
        },
        {
            header: "Completion Date",
            label: "completion_date",
            status: true,
        },
        {
            header: "Well Type",
            label: "well_type_name",
            status: true,
            dbKeyName: "well_type",
        },
        {
            header: "Well Status",
            label: "well_status",
            status: true,
        },
        {
            header: "Well Orientation",
            label: "drill_type",
            status: true,
        },
        {
            header: "Production Type",
            label: "production_type",
            dbKeyName: "well_product",
            status: true,
        },
        {
            header: "RESERVOIR",
            label: "reservoir",
            status: true,
        },
        // {
        //     header: "Well Type",
        //     label: "well_type",
        //     status: false,
        // },

        // {
        //     header: "Geometry",
        //     label: "geom",
        //     status: false,
        // },
        // {
        //     header: "Vertical",
        //     label: "vertical",
        //     status: false,
        // },
        {
            header: "Latitude",
            label: "latitude",
            status: false,
        },
        {
            header: "State Link",
            label: "state_link",
            status: false,
        },
        // {
        //     header: "Altid Name",
        //     label: "altid_name",
        //     status: false,
        // },
        // {
        //     header: "Altid Value",
        //     label: "altid_value",
        //     status: false,
        // },
        {
            header: "Legaldesc Text",
            label: "legaldesc_text",
            status: false,
        },
        {
            header: "Legaldesc Abbr",
            label: "legaldesc_abbr",
            status: false,
        },
        {
            header: "Township",
            label: "township",
            status: false,
        },
        {
            header: "Range",
            label: "range",
            status: false,
        },
        {
            header: "Section",
            label: "section",
            status: false,
        },
        {
            header: "Quarter Section",
            label: "quartersection",
            status: false,
        },
        {
            header: "Abstract",
            label: "abstract",
            status: false,
        },
        {
            header: "Block",
            label: "block",
            status: false,
        },
        {
            header: "Lot",
            label: "legaldesc_lot",
            status: false,
        },
        {
            header: "Survey",
            label: "survey",
            status: false,
        },
        // {
        //     header: "Parcel",
        //     label: "parcel_id",
        //     status: false,
        // },
        {
            header: "First Production Date",
            label: "production_date",
            status: false,
        },

        {
            header: "Field",
            label: "field",
            status: false,
        },
        {
            header: "Elevation",
            label: "elevation",
            status: false,
        },

        {
            header: "Longitude",
            label: "longitude",
            status: false,
        },
        {
            header: "Alternate Link",
            label: "alternate_link",
            status: false,
        },
        {
            header: "Permit Exp Date",
            label: "permit_exp_date",
            status: false,
        },
        {
            header: "Stacked Lateral",
            label: "stacked_lateral",
            status: false,
        },
        {
            header: "Lateral ID",
            label: "lateral_id",
            status: false,
        },
        {
            header: "Parsed Status ID",
            label: "parsed_status_id",
            status: false,
        },

        // {
        //     header: "Point Type",
        //     label: "point_type",
        //     status: false,
        // },
        {
            header: "Bottomhole latitude",
            label: "bh_latitude",
            status: false,
        },
        {
            header: "Bottomhole longitude",
            label: "bh_longitude",
            status: false,
        },
        {
            header: "State Name",
            label: "state_name",
            status: false,
        },
        {
            header: "Line Geometry",
            label: "line_geometry",
            status: false,
        },
        {
            header: "Point Geometry",
            label: "point_geometry",
            status: false,
        },
        {
            header: "Lateral Length Source",
            label: "lateral_length_source",
            status: false,
        },
        {
            header: "Added On",
            label: "added_on",
            status: false,
        },
        {
            header: "Updated On",
            label: "updated_on",
            status: false,
        },
        {
            header: "Permit Count",
            label: "permit_count",
            status: false,
        },
    ],
    tabIndex: 0,
    wellsData: {
        data: null,
        total_count: 0,
        page_size: 0,
        wellsDataLoading: true,
    },
    rigsData: {
        data: null,
        total_count: 0,
        page_size: 0,
        rigsDataLoading: true,
    },
    permitsData: {
        data: null,
        total_count: 0,
        page_size: 0,
        permitsDataLoading: true,
    },
    productionData: {
        data: null,
        total_count: 0,
        page_size: 0,
        productionDataLoading: true,
    },
    selectedAoiData: {
        aoi_id: 0,
    },
    rigsTableCol: [
        {
            header: "Driller",
            label: "driller",
            status: true,
        },
        {
            header: "Well Name",
            label: "well_name",
            status: true,
            dbKeyName: "rig_well_name",
        },
        {
            header: "Well Api",
            label: "api",
            status: true,
            dbKeyName: "rig_api_id",
        },
        {
            header: "Operator",
            label: "operator_name",
            status: true,
            dbKeyName: "rig_operator_name",
        },
        {
            header: "County",
            label: "county",
            status: true,
            dbKeyName: "rig_county",
        },
        {
            header: "State",
            label: "state_abbr",
            status: true,
            dbKeyName: "rig_state_abbr",
        },
        {
            header: "Basin",
            label: "basin_name",
            status: true,
        },
        {
            header: "PERMIT DATE",
            label: "permit_date",
            status: true,
        },
        {
            header: "Spud Date",
            label: "spud_date",
            status: true,
            dbKeyName: "rig_spud_date",
        },
        {
            header: "Orientation",
            label: "drill_type",
            status: true,
        },
        {
            header: "RESERVOIR",
            label: "reservoir",
            status: true,
        },

        {
            header: "Township",
            label: "legaldesc_township",
            status: false,
        },

        {
            header: "Range",
            label: "range",
            status: false,
        },

        {
            header: "Section",
            label: "section",
            status: false,
        },

        {
            header: "Quarter Section",
            label: "quartersection",
            status: false,
        },

        {
            header: "Block",
            label: "block",
            status: false,
        },

        {
            header: "Survey",
            label: "survey",
            status: false,
        },

        // {
        //     header: "State Name",
        //     label: "state_name",
        //     status: false,
        // },
    ],
    wellsPage: 1,
    rigsPage: 1,
    permitsPage: 1,
    productionPage: 1,
    filterSearch: "",
    sort_by: "",
    sort_order: null,
    viewAnalytics: false,
    groupChoices: [
        { value: "1", label: "Wells" },
        { value: "2", label: "Permits" },
        { value: "3", label: "Rigs" },
        { value: "4", label: "All (AND)" },
        { value: "5", label: "At least one (OR)" },
        { value: "6", label: "Production" },
    ],
    wellsAndPermitFieldChoices: [
        { value: "1", label: "Operator" },
        { value: "2", label: "Well name" },
        { value: "3", label: "API" },
        { value: "4", label: "Well type" },
        { value: "7", label: "Depth" },
        { value: "8", label: "Well Orientation" },
        { value: "9", label: "County" },
        { value: "10", label: "State" },
        { value: "11", label: "Basin" },
        { value: "13", label: "Section" },
        { value: "14", label: "Township" },
        { value: "15", label: "Range" },
        { value: "16", label: "Spud Date" },
        { value: "17", label: "Completion Date" },
        { value: "18", label: "Production Date" },
        // { value: "19", label: "Gas" },
        // { value: "20", label: "Oil" },
        { value: "22", label: "Cum Oil" },
        { value: "23", label: "Cum Gas" },
        // { value: "24", label: "Reservoir" },
        // { value: "21", label: "Other" },
    ],
    rigsFieldChoices: [
        { value: "1", label: "Operator" },
        { value: "2", label: "Well name" },
        { value: "3", label: "Api" },
        { value: "4", label: "Driller" },
        { value: "5", label: "Orientation" },
        { value: "6", label: "Reservoir" },
        { value: "7", label: "Quarter Section" },
        { value: "8", label: "Survey" },
        { value: "9", label: "County" },
        { value: "10", label: "State" },
        { value: "11", label: "Basin" },
        { value: "12", label: "Block" },
        { value: "13", label: "Section" },
        { value: "14", label: "Township" },
        { value: "15", label: "Range" },
        { value: "16", label: "Spud Date" },
        { value: "17", label: "Permit Date" },
        // { value: "6", label: "Interest type" },
        // { value: "7", label: "Depth" },
        // { value: "12", label: "Lease" },
        // { value: "17", label: "Completion Date" },
        // { value: "5", label: "Profile" },
        // { value: "18", label: "Production Date" },
        // { value: "19", label: "Gas" },
        // { value: "20", label: "Oil" },
        // { value: "21", label: "Other" },
    ],
    operatorChoices: [
        { value: "1", label: "is equal to" },
        { value: "2", label: "is not equal to" },
        { value: "3", label: "is greater than" },
        { value: "4", label: "is between" },
        { value: "5", label: "is less than" },
        { value: "6", label: "exist" },
        { value: "7", label: "does not exist" },
        { value: "8", label: "contain" },
        { value: "9", label: "does not contain" },
        { value: "10", label: "starts with" },
        { value: "11", label: "where at least one" },
        { value: "12", label: "before" },
        { value: "13", label: "after" },
        { value: "14", label: "between" },
    ],
    filter: "",
    filter_param: [],
    optionChoice: [
        { value: "1", label: "All (AND)" },
        { value: "2", label: "At least one (OR)" },
    ],
    segment_id: 0,
    showTableLoader: false,
    selectedRowId: "",
    downloadCol: 0,
    downloadColMsg: "",
    allCol: 0,
    showTable: true,
    showSegmentDropDown: false,
    productionCol: [
        {
            header: "Well Name",
            label: "well_name",
            status: true,
        },
        {
            header: "Api",
            label: "well_api",
            status: true,
        },
        {
            header: "Operator",
            label: "operator_name",
            status: true,
        },
        {
            header: "County",
            label: "county",
            status: true,
        },
        {
            header: "State",
            label: "state_abbr",
            status: true,
        },
        {
            header: "Cum Oil",
            label: "cum_oil",
            status: true,
        },
        {
            header: "Cum Gas",
            label: "cum_gas",
            status: true,
        },
        {
            header: "Status",
            label: "well_status",
            status: true,
        },
    ],
    analyticsData: {
        oil_data: [],
        gas_data: [],
        cum_oil_data: [],
        cum_gas_data: [],
        monthlyDataLoading: true,
        cumDataLoading: true,
        type: "monthlyTab",
        xAxisFilter: 1,
        xAxisFilterCum: 1,
        normalized: false,
        action: "none",
        action_cum: "none",
        apiList: [],
        apiListObj: [],
        apiListObjLength: 0,
        forecastingData: {
            dataLoading: true,
            dataList: null,
            forecastingCompleteDataFrame: "",
            eur: 0,
            qi: 0,
            b: 0,
            ai: 0,
            tlim: 0,
            start_date_select: "",
            peakmo: 0,
        },
        selectedForecastPoint: null,
    },
    fullScrnAnalytics: false,
    fullScrnAnalyticsType: "oil",
    checkedItemList: [],
    donutChart: {
        dataLoading: true,
        dataList: [],
    },
    operatorPieChart: {
        operatorPieChartDataLoading: true,
        operatorPieChartDataList: {},
    },
    analyticsTabIndex: 0,
    openForeCast: false,
    resizableWidth: 70,
    resizableHeight: "17rem",
    loadColumnProperties: true,
    uid: [],
};

const wellsAndRigsSlice = createSlice({
    name: "wellsAndRigs",
    initialState: initialState,
    reducers: {
        showHideComp(state, action: PayloadAction) {
            return {
                ...state,
                comp: !state.comp,
            };
        },
        showHideAdvFilter(state, action: PayloadAction) {
            return {
                ...state,
                advFilter: !state.advFilter,
            };
        },
        showHideColProperties(state, action: PayloadAction) {
            return {
                ...state,
                colProperties: !state.colProperties,
            };
        },
        showHideFullScreen(state, action: PayloadAction) {
            return {
                ...state,
                fullScreen: !state.fullScreen,
            };
        },
        showHideCsvDownOpt(state, action: PayloadAction) {
            return {
                ...state,
                csvDownOpt: !state.csvDownOpt,
            };
        },
        updateTableCol(
            state,
            action: PayloadAction<{
                data:
                    | WellsRigsModel["tableCol"]
                    | WellsRigsModel["rigsTableCol"]
                    | WellsRigsModel["productionCol"];
                tabIndex?: WellsRigsModel["tabIndex"];
            }>
        ) {
            return {
                ...state,
                ...(((state.tabIndex !== 1 && !action.payload.tabIndex) ||
                    action.payload.tabIndex !== 1) && {
                    tableCol: [...action.payload.data],
                }),
                ...(((state.tabIndex === 1 && !action.payload.tabIndex) ||
                    action.payload.tabIndex === 1) && {
                    rigsTableCol: [...action.payload.data],
                }),
                ...(((state.tabIndex === 3 && !action.payload.tabIndex) ||
                    action.payload.tabIndex === 3) && {
                    productionCol: [...action.payload.data],
                }),
                loadColumnProperties: false,
            };
        },

        toggleChooseColExportToCsvModal(state, action: PayloadAction) {
            return {
                ...state,
                chooseColExportToCsvModal: !state.chooseColExportToCsvModal,
            };
        },
        toggleExportOtherCsvModal(state, action: PayloadAction) {
            return {
                ...state,
                exportOtherCsvModal: !state.exportOtherCsvModal,
            };
        },
        resetWellsAndRigsSliceToInitial(
            state,
            action: PayloadAction<{ holdPrevVal: boolean }>
        ) {
            return {
                ...initialState,
                ...(action.payload.holdPrevVal && {
                    tabIndex: state.tabIndex,
                }),
                ...(action.payload.holdPrevVal && {
                    tableCol: state.tableCol,
                }),
                ...(action.payload.holdPrevVal && {
                    rigsTableCol: state.rigsTableCol,
                }),
                ...(action.payload.holdPrevVal && {
                    wellsData: state.wellsData,
                }),
                ...(action.payload.holdPrevVal && {
                    rigsData: state.rigsData,
                }),
                ...(action.payload.holdPrevVal && {
                    permitsData: state.permitsData,
                }),
                ...(action.payload.holdPrevVal && {
                    productionData: state.productionData,
                }),
                ...(action.payload.holdPrevVal &&
                    state.fullScreen && {
                        fullScreen: state.fullScreen,
                    }),
                ...(action.payload.holdPrevVal && {
                    wellsPage: state.wellsPage,
                }),
                ...(action.payload.holdPrevVal && {
                    rigsPage: state.rigsPage,
                }),
                ...(action.payload.holdPrevVal && {
                    permitsPage: state.permitsPage,
                }),
                ...(action.payload.holdPrevVal &&
                    state.selectedAoiData.aoi_id && {
                        selectedAoiData: state.selectedAoiData,
                    }),
                ...(action.payload.holdPrevVal && {
                    filterSearch: state.filterSearch,
                }),
            };
        },
        loadWellsData(
            state,
            action: PayloadAction<{
                data: WellsRigsModel["wellsData"]["data"];
                total_count: number;
                page_size: WellsRigsModel["wellsData"]["page_size"];
                total_permit: number;
                total_rigs: number;
                total_production: number;
                notConCatData?: boolean;
            }>
        ) {
            return {
                ...state,
                wellsData: {
                    data: action.payload.notConCatData
                        ? [
                              ...(action.payload.data || []),
                              //   .map((item) => ({
                              //       ...item,
                              //     //   checked: false,
                              //   })),
                          ]
                        : [
                              ...(state.wellsData.data || []),
                              ...(action.payload.data || []),
                              //   .map((item) => ({
                              //       ...item,
                              //     //   checked: false,
                              //   })),
                          ],
                    total_count: action.payload.total_count,
                    wellsDataLoading: false,
                    page_size: action.payload.page_size,
                },
                rigsData: {
                    ...state.rigsData,
                    total_count: action.payload.total_rigs,
                },
                permitsData: {
                    ...state.permitsData,
                    total_count: action.payload.total_permit,
                },
                productionData: {
                    ...state.productionData,
                    total_count: action.payload.total_production,
                },
            };
        },
        loadRigsData(
            state,
            action: PayloadAction<{
                data: WellsRigsModel["rigsData"]["data"];
                total_count: number;
                page_size: WellsRigsModel["rigsData"]["page_size"];
                total_permit: number;
                total_well: number;
                total_production: number;
                notConCatData?: boolean;
            }>
        ) {
            return {
                ...state,
                rigsData: {
                    data: action.payload.notConCatData
                        ? [
                              //   ...(action.payload.data || []).map((item) => ({
                              //       ...item,
                              //       checked: false,
                              //   })),
                              ...(action.payload.data || []),
                          ]
                        : [
                              ...(state.rigsData.data || []),
                              //   ...(action.payload.data || []).map((item) => ({
                              //       ...item,
                              //       checked: false,
                              //   })),
                              ...(action.payload.data || []),
                          ],
                    total_count: action.payload.total_count,
                    rigsDataLoading: false,
                    page_size: action.payload.page_size,
                },
                // tableCol: [],
                wellsData: {
                    ...state.wellsData,
                    total_count: action.payload.total_well,
                },
                permitsData: {
                    ...state.permitsData,
                    total_count: action.payload.total_permit,
                },
                productionData: {
                    ...state.productionData,
                    total_count: action.payload.total_production,
                },
            };
        },
        loadPermitsData(
            state,
            action: PayloadAction<{
                data: WellsRigsModel["permitsData"]["data"];
                total_count: number;
                page_size: WellsRigsModel["permitsData"]["page_size"];
                total_rigs: number;
                total_well: number;
                total_production: number;
                notConCatData?: boolean;
            }>
        ) {
            return {
                ...state,
                permitsData: {
                    data: action.payload.notConCatData
                        ? [
                              //   ...(action.payload.data || []).map((item) => ({
                              //       ...item,
                              //       checked: false,
                              //   })),
                              ...(action.payload.data || []),
                          ]
                        : [
                              ...(state.permitsData.data || []),
                              //   ...(action.payload.data || []).map((item) => ({
                              //       ...item,
                              //       checked: false,
                              //   })),
                              ...(action.payload.data || []),
                          ],
                    total_count: action.payload.total_count,
                    permitsDataLoading: false,
                    page_size: action.payload.page_size,
                },
                wellsData: {
                    ...state.wellsData,
                    total_count: action.payload.total_well,
                },
                rigsData: {
                    ...state.rigsData,
                    total_count: action.payload.total_rigs,
                },
                productionData: {
                    ...state.productionData,
                    total_count: action.payload.total_production,
                },
            };
        },
        handleTabIndex(
            state,
            action: PayloadAction<WellsRigsModel["tabIndex"]>
        ) {
            return {
                ...state,
                tabIndex: action.payload,
            };
        },
        handleSelectedAoiData(
            state,
            action: PayloadAction<WellsRigsModel["selectedAoiData"]>
        ) {
            return {
                ...state,
                selectedAoiData: action.payload,
            };
        },
        clearWellsData(state, action: PayloadAction) {
            return {
                ...state,
                wellsData: {
                    ...state.wellsData,
                    wellsDataLoading: true,
                },
            };
        },
        clearRigsData(state, action: PayloadAction) {
            return {
                ...state,
                rigsData: {
                    ...state.rigsData,
                    rigsDataLoading: true,
                },
            };
        },
        clearPermitData(state, action: PayloadAction) {
            return {
                ...state,
                permitsData: {
                    ...state.permitsData,
                    permitsDataLoading: true,
                },
            };
        },
        clearProductionData(state, action: PayloadAction) {
            return {
                ...state,
                productionData: {
                    ...state.productionData,
                    productionDataLoading: true,
                },
            };
        },
        handlePageChange(
            state,
            action: PayloadAction<WellsRigsModel["wellsPage"]>
        ) {
            return {
                ...state,
                ...(state.tabIndex === 0 && {
                    wellsPage: action.payload,
                }),
                ...(state.tabIndex === 1 && {
                    rigsPage: action.payload,
                }),
                ...(state.tabIndex === 2 && {
                    permitsPage: action.payload,
                }),
                ...(state.tabIndex === 3 && {
                    productionPage: action.payload,
                }),
            };
        },
        setFilterSearch(
            state,
            action: PayloadAction<WellsRigsModel["filterSearch"]>
        ) {
            return {
                ...state,
                filterSearch: action.payload,
            };
        },
        clearFilterSearch(state, action: PayloadAction) {
            return {
                ...state,
                filterSearch: "",
            };
        },
        handleSortAndOrderBy(
            state,
            action: PayloadAction<{
                sort_by?: WellsRigsModel["sort_by"];
                sort_order: WellsRigsModel["sort_order"];
            }>
        ) {
            return {
                ...initialState,
                selectedAoiData: state.selectedAoiData,
                tabIndex: state.tabIndex,
                filterSearch: state.filterSearch,
                sort_by: action.payload.sort_by || state.sort_by,
                sort_order: action.payload.sort_order,
            };
        },
        toggleViewAnalytics(state, action: PayloadAction) {
            return {
                ...state,
                viewAnalytics: !state.viewAnalytics,
            };
        },
        handleAdvFilterSearch(
            state,
            action: PayloadAction<{
                filter: WellsRigsModel["filter"];
                filter_param: WellsRigsModel["filter_param"];
                segment_id: WellsRigsModel["segment_id"];
            }>
        ) {
            return {
                ...state,
                filter: action.payload.filter,
                filter_param: action.payload.filter_param,
                segment_id: action.payload.segment_id,
            };
        },
        handleTableLoader(
            state,
            action: PayloadAction<WellsRigsModel["showTableLoader"]>
        ) {
            return {
                ...state,
                showTableLoader: action.payload,
            };
        },
        handleSelectedRowId(
            state,
            action: PayloadAction<WellsRigsModel["selectedRowId"]>
        ) {
            return {
                ...state,
                selectedRowId: action.payload,
            };
        },
        handleDownloadCol(
            state,
            action: PayloadAction<{
                downloadCol: WellsRigsModel["downloadCol"];
                allCol?: WellsRigsModel["allCol"];
            }>
        ) {
            return {
                ...state,
                downloadCol: action.payload.downloadCol,
                ...((action.payload.allCol === 0 ||
                    action.payload.allCol === 1) && {
                    allCol: action.payload.allCol,
                }),
            };
        },
        handleDownloadColMsg(
            state,
            action: PayloadAction<WellsRigsModel["downloadColMsg"]>
        ) {
            return {
                ...state,
                downloadColMsg: action.payload,
            };
        },
        handleShowAndHideTable(
            state,
            action: PayloadAction<WellsRigsModel["showTable"]>
        ) {
            return {
                ...state,
                showTable: action.payload,
                ...(!action.payload && { fullScreen: action.payload }),
            };
        },
        handleShowAndHideSegmentDropDown(
            state,
            action: PayloadAction<WellsRigsModel["showSegmentDropDown"]>
        ) {
            return {
                ...state,
                showSegmentDropDown: action.payload,
            };
        },
        loadProductionData(
            state,
            action: PayloadAction<{
                total_well: number;
                total_rigs: number;
                total_permit: number;
                total_count: number;
                page_size: WellsRigsModel["productionData"]["page_size"];
                data: WellsRigsModel["productionData"]["data"];
                notConCatData?: boolean;
            }>
        ) {
            return {
                ...state,
                productionData: {
                    data: action.payload.notConCatData
                        ? [
                              //   ...(action.payload.data || []).map((item) => ({
                              //       ...item,
                              //       checked: false,
                              //   })),
                              ...(action.payload.data || []),
                          ]
                        : [
                              ...(state.productionData.data || []),
                              //   ...(action.payload.data || []).map((item) => ({
                              //       ...item,
                              //       checked: false,
                              //   })),
                              ...(action.payload.data || []),
                          ],
                    total_count: action.payload.total_count,
                    page_size: action.payload.page_size,
                    productionDataLoading: false,
                },
                wellsData: {
                    ...state.wellsData,
                    total_count: action.payload.total_well,
                },
                rigsData: {
                    ...state.rigsData,
                    total_count: action.payload.total_rigs,
                },
                permitsData: {
                    ...state.permitsData,
                    total_count: action.payload.total_permit,
                },
            };
        },
        handleAnalyticsData(
            state,
            action: PayloadAction<{
                oilList: WellsRigsModel["analyticsData"]["oil_data"];
                gasList: WellsRigsModel["analyticsData"]["gas_data"];
                type: WellsRigsModel["analyticsData"]["type"];
                cumDataLoading?: WellsRigsModel["analyticsData"]["cumDataLoading"];
                monthlyDataLoading?: WellsRigsModel["analyticsData"]["monthlyDataLoading"];
            }>
        ) {
            return {
                ...state,
                analyticsData: {
                    ...state.analyticsData,
                    ...(action.payload.type === "monthlyTab" && {
                        oil_data: action.payload.oilList,
                        gas_data: action.payload.gasList,
                        monthlyDataLoading: false,
                    }),
                    ...(action.payload.type === "cumTab" && {
                        cum_oil_data: action.payload.oilList,
                        cum_gas_data: action.payload.gasList,
                        cumDataLoading: false,
                    }),

                    ...(action.payload.cumDataLoading && {
                        cumDataLoading: action.payload.cumDataLoading,
                    }),
                    ...(action.payload.monthlyDataLoading && {
                        monthlyDataLoading: action.payload.monthlyDataLoading,
                    }),
                },
            };
        },
        handleFullScrnAnalytics(
            state,
            action: PayloadAction<{
                fullScrnAnalytics: WellsRigsModel["fullScrnAnalytics"];
                fullScrnAnalyticsType?: WellsRigsModel["fullScrnAnalyticsType"];
            }>
        ) {
            return {
                ...state,
                fullScrnAnalytics: action.payload.fullScrnAnalytics,
                ...(action.payload.fullScrnAnalyticsType && {
                    fullScrnAnalyticsType: action.payload.fullScrnAnalyticsType,
                }),
            };
        },
        handleCheckedItemList(
            state,
            action: PayloadAction<WellsRigsModel["checkedItemList"]>
        ) {
            return {
                ...state,
                checkedItemList: action.payload,
            };
        },
        handleDonutChart(
            state,
            action: PayloadAction<{
                dataLoading?: WellsRigsModel["donutChart"]["dataLoading"];
                data: WellsRigsModel["donutChart"]["dataList"];
            }>
        ) {
            return {
                ...state,
                donutChart: {
                    dataList: action.payload.data,
                    dataLoading: false,
                    ...(action.payload.dataLoading && {
                        dataLoading: action.payload.dataLoading,
                    }),
                },
            };
        },
        handleOperatorPieChart(
            state,
            action: PayloadAction<{
                operatorPieChartDataLoading?: WellsRigsModel["operatorPieChart"]["operatorPieChartDataLoading"];
                data: WellsRigsModel["operatorPieChart"]["operatorPieChartDataList"];
            }>
        ) {
            return {
                ...state,
                operatorPieChart: {
                    operatorPieChartDataLoading: false,
                    operatorPieChartDataList: action.payload.data,
                    ...(action.payload.operatorPieChartDataLoading && {
                        operatorPieChartDataLoading: true,
                    }),
                },
            };
        },

        handleAnalyticsTabIndex(
            state,
            action: PayloadAction<WellsRigsModel["analyticsTabIndex"]>
        ) {
            return {
                ...state,
                analyticsTabIndex: action.payload,
            };
        },
        handleAnalyticsProdFilters(
            state,
            action: PayloadAction<{
                type?: WellsRigsModel["analyticsData"]["type"];
                action?: WellsRigsModel["analyticsData"]["action"];
                xAxisFilterVal?: WellsRigsModel["analyticsData"]["xAxisFilter"];
                apiList?: WellsRigsModel["analyticsData"]["apiList"];
                apiListObj?: WellsRigsModel["analyticsData"]["apiListObj"];
                apiListObjLength?: WellsRigsModel["analyticsData"]["apiListObjLength"];
            }>
        ) {
            return {
                ...state,
                analyticsData: {
                    ...state.analyticsData,
                    ...(action.payload.type && {
                        type: action.payload.type,
                    }),
                    ...(action.payload.xAxisFilterVal &&
                        action.payload.type === "monthlyTab" && {
                            xAxisFilter: action.payload.xAxisFilterVal,
                        }),
                    ...(action.payload.xAxisFilterVal &&
                        action.payload.type === "cumTab" && {
                            xAxisFilterCum: action.payload.xAxisFilterVal,
                        }),
                    ...(action.payload.action &&
                        action.payload.type === "monthlyTab" && {
                            action: action.payload.action,
                        }),
                    ...(action.payload.action &&
                        action.payload.type === "cumTab" && {
                            action_cum: action.payload.action,
                        }),
                    ...(action.payload.apiList && {
                        apiList: action.payload.apiList,
                    }),
                    ...(action.payload.apiListObj && {
                        apiListObj: action.payload.apiListObj,
                    }),
                    ...(action.payload.apiListObjLength &&
                        action.payload.apiListObjLength >= 0 && {
                            apiListObjLength: action.payload.apiListObjLength,
                        }),
                },
            };
        },
        handleNormalize(
            state,
            action: PayloadAction<WellsRigsModel["analyticsData"]["normalized"]>
        ) {
            return {
                ...state,
                analyticsData: {
                    ...state.analyticsData,
                    normalized: action.payload,
                },
            };
        },
        handleForecast(
            state,
            action: PayloadAction<WellsRigsModel["openForeCast"]>
        ) {
            return {
                ...state,
                openForeCast: action.payload,
            };
        },
        handleResizableWidth(
            state,
            action: PayloadAction<WellsRigsModel["resizableWidth"]>
        ) {
            return {
                ...state,
                resizableWidth: action.payload,
            };
        },
        handleResizableHeight(
            state,
            action: PayloadAction<WellsRigsModel["resizableHeight"]>
        ) {
            return {
                ...state,
                resizableHeight: action.payload,
            };
        },
        handleForecastingData(
            state,
            action: PayloadAction<{
                data: WellsRigsModel["analyticsData"]["forecastingData"]["dataList"];
                eur?: WellsRigsModel["analyticsData"]["forecastingData"]["eur"];
                forecastingCompleteDataFrame?: WellsRigsModel["analyticsData"]["forecastingData"]["forecastingCompleteDataFrame"];
                dataLoading?: WellsRigsModel["analyticsData"]["forecastingData"]["dataLoading"];
                ai?: WellsRigsModel["analyticsData"]["forecastingData"]["ai"];
                b?: WellsRigsModel["analyticsData"]["forecastingData"]["b"];
                qi?: WellsRigsModel["analyticsData"]["forecastingData"]["qi"];
                tlim?: WellsRigsModel["analyticsData"]["forecastingData"]["tlim"];
                start_date_select?: WellsRigsModel["analyticsData"]["forecastingData"]["start_date_select"];
                peakmo?: WellsRigsModel["analyticsData"]["forecastingData"]["peakmo"];
            }>
        ) {
            return {
                ...state,
                analyticsData: {
                    ...state.analyticsData,
                    forecastingData: {
                        ...state.analyticsData.forecastingData,
                        dataList: action.payload.data,
                        ...((action.payload.forecastingCompleteDataFrame ||
                            action.payload.data === null ||
                            (Array.isArray(action.payload.data) &&
                                action.payload.data.length === 0)) && {
                            forecastingCompleteDataFrame:
                                action.payload.forecastingCompleteDataFrame ||
                                "",
                        }),
                        ...((action.payload.eur ||
                            action.payload.data === null ||
                            (Array.isArray(action.payload.data) &&
                                action.payload.data.length === 0)) && {
                            eur: action.payload.eur || 0,
                        }),
                        ...((action.payload.ai ||
                            action.payload.data === null ||
                            (Array.isArray(action.payload.data) &&
                                action.payload.data.length === 0)) && {
                            ai: action.payload.ai || 0,
                        }),
                        ...((action.payload.qi ||
                            action.payload.data === null ||
                            (Array.isArray(action.payload.data) &&
                                action.payload.data.length === 0)) && {
                            qi: action.payload.qi || 0,
                        }),
                        ...((action.payload.b ||
                            action.payload.data === null ||
                            (Array.isArray(action.payload.data) &&
                                action.payload.data.length === 0)) && {
                            b: action.payload.b || 0,
                        }),
                        ...((action.payload.tlim ||
                            action.payload.data === null ||
                            (Array.isArray(action.payload.data) &&
                                action.payload.data.length === 0)) && {
                            tlim: action.payload.tlim || 0,
                        }),
                        ...((action.payload.start_date_select ||
                            action.payload.data === null ||
                            (Array.isArray(action.payload.data) &&
                                action.payload.data.length === 0)) && {
                            start_date_select:
                                action.payload.start_date_select || "",
                        }),
                        ...((action.payload.peakmo ||
                            action.payload.data === null ||
                            (Array.isArray(action.payload.data) &&
                                action.payload.data.length === 0)) && {
                            peakmo: action.payload.peakmo || 0,
                        }),
                        dataLoading: false,
                        ...(action.payload.dataLoading && {
                            dataLoading: action.payload.dataLoading,
                        }),
                    },
                },
            };
        },
        handleSelectedForecastPoint(
            state,
            action: PayloadAction<{
                data: WellsRigsModel["analyticsData"]["selectedForecastPoint"];
                doNotConCat?: boolean;
            }>
        ) {
            return {
                ...state,
                analyticsData: {
                    ...state.analyticsData,
                    selectedForecastPoint: action.payload.doNotConCat
                        ? action.payload.data
                        : [
                              ...(state.analyticsData.selectedForecastPoint ||
                                  []),
                              ...(action.payload.data || []),
                          ],
                },
            };
        },
        handleRearrange(state, action: PayloadAction) {
            return {
                ...state,
                reArrange: action.payload,
                ...(state.tabIndex === 0 && {
                    wellsData: {
                        ...state.wellsData,
                        data: [
                            ...(state.wellsData.data || []).filter(
                                (item) => item.checked
                            ),
                            ...(state.wellsData.data || []).filter(
                                (item) => !item.checked
                            ),
                        ],
                    },
                }),
                ...(state.tabIndex === 1 && {
                    rigsData: {
                        ...state.rigsData,
                        data: [
                            ...(state.rigsData.data || []).filter(
                                (item) => item.checked
                            ),
                            ...(state.rigsData.data || []).filter(
                                (item) => !item.checked
                            ),
                        ],
                    },
                }),
                ...(state.tabIndex === 3 && {
                    productionData: {
                        ...state.productionData,
                        data: [
                            ...(state.productionData.data || []).filter(
                                (item) => item.checked
                            ),
                            ...(state.productionData.data || []).filter(
                                (item) => !item.checked
                            ),
                        ],
                    },
                }),
            };
        },
        handleUIDList(state, action: PayloadAction<WellsRigsModel["uid"]>) {
            return {
                ...state,
                uid: action.payload,
            };
        },
    },
});

export default wellsAndRigsSlice;
