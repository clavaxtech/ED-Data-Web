import {
    ANALYTICS_CUM_TAB,
    GAS,
    ANALYTICS_MONTHLY_TAB,
    OIL,
    OPERATOR_PIE_CHART,
    PRODUCTION_DONUT_CHART,
    LINE_CHART_XAXIS_FILTERS,
} from "../../utils/helper";
import {
    InviteMembersRowDataType,
    reactSelectProps,
    // searchListObject,
} from "./page-props";
import {
    CompanyConfig,
    OptionType,
    SaveSegmentAdvFilterObj,
    SelectedSegmentReturnType,
} from "./submit-form";

export type User = {
    user_id: number | null;
    first_name: string;
    last_name: string;
    is_admin: boolean;
    access_token: string;
    refresh_token: string;
    signin_as: null | number;
    profile_pic: null | string;
    phone_no: string;
    trial_remaining_days?: number | null;
    counties_price_below_of_basin: number;
    company_data: {
        allowed_sub_user: null | number;
        company_logo?: string;
        company_name?: string;
        company_id?: null | number;
        billing_email: string;
    };
    device_session_id: null | number;
    subscription_status?: string;
    company_configs: CompanyConfig;
};
export interface AuthModel {
    isAuthenticated: null | boolean;
    userLoading: boolean;
    user: User;
    userTokenLoading: boolean;
    pass_change_required: boolean;
    base_user_id: string;
    deviceInfo: DeviceInfo;
}

export interface ModalModel {
    siteLoader: boolean;
    image_cropper_show: boolean;
    image_cropper_name: string;
    sessionModal: boolean;
    checkOutModal: boolean;
    uploadModal: boolean;
    showUpdateCreditCardModal: boolean;
    impNoticeModal: boolean;
    crsModal: boolean;
    createAoiModal: boolean;
    uploadingCsvApiListModal: boolean;
    apiUpgradeSubModal: boolean;
    saveSegmentModal: boolean;
    editSubscriptionModal: boolean;
    downloadColMsgModal: boolean;
    sideContentLoader: boolean;
    freeTrialDownAlertMsgModal: boolean;
    freeTrialEndModal: boolean;
}

export interface LoadUserTokenAction {
    access_token: string;
    refresh_token: string | null;
}

export interface ShowSiteLoaderAction {
    siteLoader: boolean;
}

export interface HideSiteLoaderAction {
    siteLoader: boolean;
}

export interface HighlightSelectedWellAction {
    well_id: string;
}

export interface ShowImageCropperModalAction {
    name: string;
}

export interface CompanySettingInitialValue {
    address: {
        city: string;
        first_address: string;
        address_id: null | number;
        phone_no: string;
        second_address: string;
        state: string;
        zip_code: string;
    };
    company: {
        billing_email: string;
        company_email: string;
        company_logo: string;
        company_name: string;
        company_id: null | number;
    };
}

export type InviteMembersData = InviteMembersRowDataType[];
export interface MembersSettingsInitialValueType {
    inviteMembersData: null | InviteMembersData;
    inviteMembersCount: number;
    inviteMemberDataLoading: boolean;
    active_user_count: number;
}

export interface LoadInviteMembersAction {
    data: InviteMembersData;
    result_count: number;
    active_user_count: number;
}

export type NotificationOptionObj = {
    id: number;
    name: string;
    description: string;
};

export type NotificationDetailsObj = {
    id: number;
    is_in_app: boolean;
    is_email: boolean;
    date_added: string;
    last_updated: string;
    user: number;
    event: number;
};
export interface NotificationSettingsInitialValue {
    notificationOptions: NotificationOptionObj[] | null;
    notificationDetails: NotificationDetailsObj[] | null;
    notificationDetailsLoading: boolean;
}

export interface cartBasinState {
    // well_status_list: { well_status: string }[];
    // operator_list: { operator_name: string }[];
    state_list: reactSelectProps[];
    // county_list: { county: string }[];
    // basin_list: { basin_name: string }[];
    basinSearchList: CartSelectBasinOption[];
    countySearchList: CartSelectCountyOption[];
    wellApiListAfterCsvUpload: OptionType[];
    sliderMinMaxValue: {
        measured_depth?: number;
        true_vertical_depth?: number;
        lateral_length?: number;
        minMeasuredDepth?: number;
        minTrueVerticalDepth?: number;
        minLateralLength?: number;
        maxMeasuredDepth?: number;
        maxTrueVerticalDepth?: number;
        maxLateralLength?: number;
        dataLoading?: boolean;
    };
    hideSearchFilter: boolean;
    clearAllFilter: boolean;
}

export interface CartSelectBasinOption {
    basin_name: string;
}

export interface CartSelectCountyOption {
    state_name: string;
    county_name: string[];
    iso_code: string;
}
export interface CartSelectBasinCountyInitialValue {
    basinSearchList: CartSelectBasinOption[];
    countySearchList: CartSelectCountyOption[];
    cartListItems: CartListItemsType;
    cartItemsTotal: number;
    stateOptions: { label: string; value: string }[];
    cartItemsTotalTax: number;
    saved_card: {
        id: number;
        cc_no: string;
        cc_brand: string;
    }[];
    tax_percentage: number;
    cartModified: boolean;
    lastCountyBasinName: string;
}

export interface BasinDetailsObject {
    id: number;
    county_count: number;
    basin_name: string;
    // geo_cordinate: string;
    horizontal_wells: number;
    active_wells: number;
    permits: number;
    rigs: number;
    oil_production: number;
    gas_production: number;
    price: number;
    png: string;
    is_deleted: boolean;
    subscription_det_id: number | null;
    end_period: string | null;
}

export type CountyDetailsObject = Omit<
    {
        state_abbr: string;
        county_name: string;
        basin_price: number;
        county_basin: string;
    } & BasinDetailsObject,
    "basin_name" | "county_count"
>;

export type CartListItemsType = (CountyDetailsObject | BasinDetailsObject)[];

export interface RemoveCartItemAction {
    item_id: number;
}

export interface RemoveCartItemFromList {
    item_id: number;
    item_type: number;
}

export type RemoveCartItemFromOrderSummary = RemoveCartItemFromList & {
    sub_total: number;
    // tax:number
};

export type RemoveCartItemFormData =
    | RemoveCartItemFromList
    | RemoveCartItemFromOrderSummary;
export interface CreateSubscriptionFormData {
    billing_email: string;
    company_name: string;
    payment_id: string | number;
    company: number;
    phone_no: string;
    last4: string;
    exp_month: string;
    exp_year: string;
    brand: string;
    name_on_card: string;
}

export interface CreateSubscriptionAlreadySubscribedFormData {
    billing_email: string;
    saved_card_id: string | number;
    company: number;
    phone_no: string;
    last4: string;
}

export interface FinalSubscriptionFormData {
    [x: string]: any;
}

export type CalculateTaxCheckOutAndRemoveItem = {
    sub_total: number;
};

export type CalculateTaxOnAddressChange = {
    sub_total: number;
    first_address: string;
    state: string;
    country: string;
    zip_code: string;
    city: string;
};

export type CalculateTaxFormData =
    | CalculateTaxCheckOutAndRemoveItem
    | CalculateTaxOnAddressChange;

export type subscriptionDataDetails = {
    id: number;
    image_data: string;
    line_item_name: string;
    line_item_type: number;
    state_code: string;
    subscription_id: number;
    total_cost: string;
    total_counties: number;
    end_period: string;
    unsubscribe_status: boolean;
    total_hz_wells: number;
    total_active_wells: number;
    total_rigs: number;
    total_permits: number;
    total_oil_production: number;
    total_gas_production: number;
};

export interface SubscriptionSettingsInitialValue {
    subscriptionData: {
        subscription: {
            id: number;
            total_user: number;
            allowed_user: number;
            total_county: number;
            subscription_amount: string;
            renewal_date: string;
            is_canceled: boolean;
        };
        details: subscriptionDataDetails[];
    } | null;
    loadSubscriptionData: boolean;
    paymentModalDuringTrialPeriod: boolean;
}

export interface BillingSettingsInitialValue {
    paymentMethodsData: {
        company_name: string;
        billing_email: string;
        cc_no: string;
        name_on_card: string;
        cc_exp_month: string;
        cc_exp_year: string;
        first_address: string;
        second_address: string;
        city: string;
        state: string;
        zip_code: string;
        country: string;
    } | null;
    paymentMethodsDataLoading: boolean;
    paymentHistoryData: {
        latest: BillingHistoryObject;
        total_record: number;
        history_data: BillingHistoryObject[] | null;
        page_size: number;
    };
    paymentHistoryDataLoading: boolean;
}

export interface BillingHistoryObject {
    id: number;
    company_name: string;
    company_subscription_id: number;
    invoice_date: string;
    invoice_amount: string;
    payment_status: boolean;
    basin_count: number;
    county_count: number;
    stripe_invoice_pdf: string;
}

export interface AoiListObject {
    id: number;
    aoi_name: string;
    last_updated: string;
    geom: string;
    image_png: string;
    well_count: number;
    permit_count: number;
    operator_count: number;
    completion_count: number;
}

export interface NotiObject {
    id: number;
    notification_type: number;
    notification_type_label: string;
    is_in_app: boolean;
    is_email: boolean;
}

export type AoiNotiDataType = NotiObject & { aoi: number };
export interface AoiModel {
    savedAoiData: AoiListObject[];
    toggleSettingDrawer: boolean;
    aoiDataLoading: boolean;
    showAoiSideCon: boolean;
    aoiNameSelForEdit: {
        aoi_name: string;
        aoi_id: number;
    };
    max_allowed_aoi: number;
    aoi_tab_index: 0 | 1 | 2;
    aoiNotiData: AoiNotiDataType[];
    aoiGenTabNotiData: NotiObject[];
    aoiGenTabNotiDataLoading: boolean;
    aoiNotiDataLoading: boolean;
    usingMapCreateAoi: boolean;
    previousSearchFilter: string;
    // hideLoaderWhileCallingApi: boolean;
}

export interface CountyStatObject {
    county: string;
    state_abbr: string;
    total_wells: number;
}

export interface WellsAndPermitsObject {
    id: string;
    uid: number;
    well_api: string;
    lateral_id: string;
    parsed_status_id: string;
    bh_latitude: string;
    bh_longitude: string;
    measured_depth: number;
    county: string;
    state_abbr: string;
    well_status: string;
    well_name: string;
    // well_type: string;
    well_type_name: string;
    operator_name: string;
    completion_date: string;
    basin_name: string;
    state_link: string;
    drill_type: string;
    township: string | null;
    range: string | null;
    section: string | null;
    abstract: string;
    block: string | null;
    legaldesc_lot: string | null;
    survey: string;
    legaldesc_text: string | null;
    legaldesc_abbr: string | null;
    quartersection: string | null;
    production_date: string | null;
    spud_date: string;
    permit_date: string;
    permit_count: number | null;
    field: string | null;
    elevation: number;
    latitude: string;
    longitude: string;
    alternate_link: string | null;
    permit_exp_date: string | null;
    stacked_lateral: string | null;
    production_type: string;
    state_name: string;
    added_on: string;
    updated_on: string;
    lateral_length: number;
    lateral_length_source: string;
    line_geometry: string;
    point_geometry: string;
    true_vertical_depth: number;
    reservoir: string;
    checked: boolean;

    // point_type: null | number;
    // geom: string;
    // depth: null | number;
    // vertical: boolean;
    // altid_name: string;
    // altid_value: string;

    // parcel_id: string | null;
    // bh_lat: string | null;
    // bh_lng: string | null;
}

export type RigsDataObj = {
    id: number;
    uid: number;
    driller: string;
    well_name: string;
    api: string;
    operator_name: string;
    county: string;
    state_abbr: string;
    basin_name: string;
    permit_date: string;
    spud_date: string;
    profile: string;
    reservoir: string;
    legaldesc_township: string | null;
    range: string | null;
    section: string;
    quartersection: string;
    block: string;
    survey: string;

    // production_type: string;

    // max_drilling_depth: number;

    // abstract: string;
    // parcel_id: string | null;
    // production_date: string | null;
    // completion_date: string | null;
    // state_name: string;
    checked: boolean;
    // well_type_name: string;
    // well_status: string;
};

export type ProductionDataObj = {
    id: number;
    uid: number;
    well_api: string;
    county: string;
    state_abbr: string;
    well_name: string;
    operator_name: string;
    well_type_name: string;
    cum_oil: number;
    cum_gas: number;
    well_status: string;
    checked: boolean;
};

export type tableColObje = {
    header: string;
    label: string;
    status: boolean;
    dbKeyName?: string;
    // render: (rowData: searchListObject) => string | number;
};

export interface FilterParamObj {
    option_choice: string;
    data_point: string;
    data_point_field: string;
    operator_choice: string;
    filter_value: string;
}

export interface FilterParamObjGroupCon {
    group_cond: string;
}

export interface AnalyticsDataObj {
    production_date: string;
    production_quantity: number;
    drill_type?: string;
}

export type XAxisFilterType =
    | (typeof LINE_CHART_XAXIS_FILTERS)["Date Time"]
    | (typeof LINE_CHART_XAXIS_FILTERS)["Producing Time"];

export type LineChartDataObj = {
    name: string;
    values: AnalyticsDataObj[];
};
export type ActionType = "none" | "sum" | "average" | "p10" | "p50" | "p90";

export interface WellsRigsModel {
    comp: boolean;
    advFilter: boolean;
    colProperties: boolean;
    fullScreen: boolean;
    csvDownOpt: boolean;
    chooseColExportToCsvModal: boolean;
    exportOtherCsvModal: boolean;
    tableCol: tableColObje[];
    tabIndex: 0 | 1 | 2 | 3;
    wellsData: {
        data: WellsAndPermitsObject[] | null;
        total_count: number;
        wellsDataLoading: boolean;
        page_size: number;
    };
    rigsData: {
        data: RigsDataObj[] | null;
        total_count: number;
        rigsDataLoading: boolean;
        page_size: number;
    };
    permitsData: {
        data: WellsAndPermitsObject[] | null;
        total_count: number;
        permitsDataLoading: boolean;
        page_size: number;
    };
    productionData: {
        data: ProductionDataObj[] | null;
        total_count: number;
        page_size: number;
        productionDataLoading: boolean;
    };
    selectedAoiData: {
        aoi_id: number;
    };
    rigsTableCol: tableColObje[];
    filterSearch: string;
    wellsPage: number;
    rigsPage: number;
    permitsPage: number;
    productionPage: number;
    sort_by: string;
    sort_order: "ASC" | "DESC" | null;
    viewAnalytics: boolean;
    groupChoices: OptionType[];
    wellsAndPermitFieldChoices: OptionType[];
    rigsFieldChoices: OptionType[];
    operatorChoices: OptionType[];
    filter: string;
    filter_param: (
        | Omit<SaveSegmentAdvFilterObj, "group_cond">
        | FilterParamObjGroupCon
    )[];
    optionChoice: OptionType[];
    segment_id: number;
    showTableLoader: boolean;
    selectedRowId: string | number;
    downloadCol: 0 | 1;
    downloadColMsg: string;
    allCol: 1 | 0;
    showTable: boolean;
    showSegmentDropDown: boolean;
    productionCol: tableColObje[];
    analyticsData: {
        gas_data: LineChartDataObj[];
        oil_data: LineChartDataObj[];
        cum_gas_data: LineChartDataObj[];
        cum_oil_data: LineChartDataObj[];
        monthlyDataLoading: boolean;
        cumDataLoading: boolean;
        type: typeof ANALYTICS_MONTHLY_TAB | typeof ANALYTICS_CUM_TAB;
        xAxisFilter: XAxisFilterType;
        xAxisFilterCum: XAxisFilterType;
        normalized: boolean;
        action: ActionType;
        action_cum: ActionType;
        apiList: string[];
        apiListObj: (WellsAndPermitsObject | RigsDataObj | ProductionDataObj)[];
        apiListObjLength: number;
        forecastingData: {
            dataLoading: boolean;
            dataList:
                | {
                      name: string;
                      values: {
                          date: string;
                          price: number;
                          numValue: number;
                      }[];
                  }[]
                | null;
            forecastingCompleteDataFrame: string;
            eur: number;
            qi: number;
            b: number;
            ai: number;
            tlim: number;
            start_date_select: string;
            peakmo: number;
        };
        selectedForecastPoint: ForecastingFormObj[] | null;
    };
    fullScrnAnalytics: boolean;
    fullScrnAnalyticsType:
        | typeof GAS
        | typeof OIL
        | typeof PRODUCTION_DONUT_CHART
        | typeof OPERATOR_PIE_CHART;
    checkedItemList: (
        | WellsAndPermitsObject
        | RigsDataObj
        | ProductionDataObj
    )[];
    donutChart: {
        dataLoading: boolean;
        dataList: OptionType[];
    };
    operatorPieChart: {
        operatorPieChartDataLoading: boolean;
        operatorPieChartDataList: { [x: string]: number };
    };
    analyticsTabIndex: 0 | 1 | 2;
    openForeCast: boolean;
    resizableWidth: number;
    loadColumnProperties: boolean;
    resizableHeight: string;
    uid: string[];
}

export interface AddAllBasinOrCountyToCartFormData {
    cat: string;
    search: { state_abbr: string; county: string }[] | string[];
}

export type apiColObj = {
    api: string;
    matching_api: string[];
};

export type wellNameColObj = {
    well_name: string;
    state: string;
    county: string;
    matching_api: string[];
};

export interface SaveApiListFormData {
    file_name: string;
    data: apiColObj | wellNameColObj[];
}

export interface UpdateSubscriptionEditModalFormData {
    subscription_id: string;
    item_id: number[];
}

export interface SegmentObj {
    id: number;
    segment_name: string;
    date_created: string;
    last_updated: string;
    uses_count: number;
    segment_status: boolean;
    user: number;
    checked: boolean;
}

export interface SegmentListObj {
    total_record: number;
    page_size: number;
    data: SegmentObj[];
    dataLoading: boolean;
}

export interface SegmentsModel {
    activeSegmentList: SegmentListObj;
    archivedSegmentList: SegmentListObj;
    activeTabIndex: 1 | 2;
    selectedRowId: number;
    checkBoxSelectedId: number[];
    active_total: number;
    archive_total: number;
    page: number;
    selectedSegmentData: SelectedSegmentReturnType["data"];
}

export interface SegmentListPayloadAction {
    data: SegmentsModel["activeSegmentList"]["data"];
    page_size: SegmentsModel["activeSegmentList"]["page_size"];
    total_record: SegmentsModel["activeSegmentList"]["total_record"];
}

export interface ApiFilesListObj {
    id: number;
    file_name: string;
    file_size: number;
    added_on: string;
    user: number;
    added_by: number;
    checked: boolean;
}

export interface ShapeFilesListObj {
    id: number;
    upload_file_name: string;
    date_added: string;
    file_size: number;
    file_type: string;
    checked: boolean;
}

export interface FilesInitialValue {
    filesTabIndex: 0 | 1;
    apiList: null | ApiFilesListObj[];
    apiPage: number;
    apiTotalRecord: number;
    apiPageSize: number;
    shapeFileList: null | ShapeFilesListObj[];
    shapeFilePage: number;
    shapeFileTotalRecord: number;
    shapeFilePageSize: number;
    // selectedId: number;
    apiListLoading: boolean;
    shapeFileListLoading: boolean;
}
export interface AlertNotiObject {
    id: number;
    name: string;
    is_email: boolean;
    is_in_platform: boolean;
    // is_mobile_push: boolean;
}
export interface AlertModel {
    alertSetTabNotiData: AlertNotiObject[];
    alertSetTabNotiDataLoading: boolean;
    alertTabIndex: 0 | 1 | 2 | 3;
    alertMsg: {
        data: AlertMsgObj[];
        readData: AlertMsgObj[];
        favouriteData: AlertMsgObj[];
        page: number;
        totalPage: number;
        alertMsgLoading: boolean;
        unread_count: number;
        pageSize: number;
        read_count: number;
        favourite_count: number;
        alertReadMsgLoading: boolean;
        alertFavouriteMsgLoading: boolean;
        readTotalPage: number;
        favouriteTotalPage: number;
        readPage: number;
        favouritePage: number;
    };
    countyList: reactSelectProps[];
    selectedCountyList: (reactSelectProps & {
        id?: number;
        alert_status?: boolean;
        user?: number;
    })[];
    is_aoi_alert_enabled: boolean;
    is_county_alert_enabled: boolean;
}

export type AlertUpdateFormData = {
    id: number;
    is_email: boolean;
    is_in_platform: boolean;
    // is_mobile_push: boolean;
}[];

export interface AlertMsgObj {
    id: number;
    alert_message: string;
    link_url: null | string;
    read_status: boolean;
    added_on: string;
    alert_status: boolean;
    user: number;
    checked: boolean;
    county_name: string;
    state_abbr: string;
    alert_type: 1 | 2 | 3 | 4 | 5 | 6;
    is_favourite: boolean;
    aoi_name: string;
}

export interface AlertCountyObj {
    county_name: string;
    state_abbr: string;
}

export interface CommonDownloadObject {
    download_loc: "0" | "1" | "2" | "3" | "4";
    file_name?: string;
    details?: string;
    search_param?: string;
}

export interface ExportDataObj {
    date_downloaded: string;
    details: null | string;
    download_loc: string;
    id: number;
    file_url: string;
    user_name: string;
}

export interface ExportModel {
    exportData: ExportDataObj[] | null;
    exportPageSize: number;
    exportTotalRecord: number;
    exportDataLoading: boolean;
}

export interface SearchResDowLinkReturnType {
    status: number;
    downloads: {
        url: string;
        status: number;
    };
}

export interface ForecastFilterObj {
    wlife: number;
    ftype: "exp" | "hyp";
    qi_solution: "fixed" | "variable";
    qi_fixed?: number;
    ai_solution: "fixed" | "variable";
    ai_fixed?: number;
    b_solution: "fixed" | "variable";
    bmin?: number;
    bmax?: number;
    b_fixed?: number;
    dlim: number;
}

export interface ForecastingFormObj {
    api: string;
    production_date: string;
    production_quantity: number;
    producing_month?: number;
}

export interface ForecastingTypeCurveFormObj {
    producing_month: number;
    // production_quantity: number;
    production_quantity_ft: number;
}

export interface ForecastingItemObj {
    production_date: string;
    api: string;
    production_quantity: string;
    DCA: number;
    product_stream: number;
    data_type: string;
}

export interface DeviceInfo {
    ipAddress: string | null;
    deviceType: string | null;
    userAgent: string | null;
    operatingSystem: string | null;
}

export interface Col {
    tab_opt: string;
    column_key: string;
    is_visible: boolean;
    order_seq: number;
}
