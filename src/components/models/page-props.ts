import React, { ReactNode, RefObject } from "react";
import { AppDispatch } from "../../components/store/index";
import { Control, FieldValues, UseFormRegister } from "react-hook-form";
import { PropTypes } from "react-places-autocomplete";
import { SliderProps } from "rc-slider";
import {
    ActionMeta,
    GroupBase,
    MultiValue,
    OptionProps,
    OptionsOrGroups,
    SingleValue,
} from "react-select";
import { BasinDetailsObject, CountyDetailsObject } from "./redux-models";
import ReCAPTCHA from "react-google-recaptcha";
import { ParseStepResult } from "papaparse";
import shpjs from "shpjs";
import { LoadOptions } from "react-select-async-paginate";
import {
    BasinObjApiList,
    CountyObjApiList,
    csvApiDataObj,
} from "./submit-form";

export interface RouteProps {
    component?: React.ComponentType | null;
    render?: (props: React.ComponentType<any>) => React.ReactNode;
    children?: React.ReactNode;
    path?: string | string[];
    exact?: boolean;
    sensitive?: boolean;
    strict?: boolean;
    staticContext?: any;
}

export interface SignUpViewProps {}

export interface ForgotPassowrdViewProps {}

export interface UpdatePassowrdViewProps {
    usedForInviteMember?: boolean;
    forcePassReset?: boolean;
}

export interface ForgotPassowrdProps {}

export interface HomeProps {}
export interface HomeProps {}

export interface SignInProps {}

export interface SignUpProps {}

export interface HomeViewProps {}

export interface SignInViewProps {}

export interface ScrollToTopProps {
    children: RouteProps["children"];
}

export interface Spinner2Props {
    white?: boolean;
}

export interface SiteLoaderProps {}

export interface CartSelectBasinViewProps {
    activate: () => void;
}

export interface CartSelectBasinProps {}

export interface CartBasinToCountyViewProps {}

export interface CartBasinToCountyProps {}

// Settings
export interface CompanySettingsProps {}
export interface CompanySettingsViewProps {}
export interface MemberSettingsProps {}
export interface MemberSettingsViewProps {}
export interface PlanSettingsProps {}
export interface PlanSettingsViewProps {}
export interface BillingSettingsProps {}
export interface BillingSettingsViewProps {}
export interface MySettingsProps {}
export interface MySettingsViewProps {}
export interface NotificationSettingsProps {}
export interface NotificationSettingsViewProps {}
export interface ImportExportSettingsProps {}
export interface ImportExportSettingsViewProps {}

export interface MysettingbasicInfo {
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    confirmPassword?: string;
}

export interface AvatarProps {
    isOpen: boolean;
    dispatch: AppDispatch;
    toggleSettingDropDown: () => void;
    hideLogo?: boolean;
}

export interface SideBarProps {
    toggleSettingDropDown?: () => void;
    isOpen?: boolean;
}

export interface cardProps {
    item: CountyDetailsObject | BasinDetailsObject;
    removeItem: (item: number, item_type: number) => void;
    free_trial_period_enabled: boolean;
}

export interface cardBottomProps {
    cancelClick: () => void;
    total: number;
}

export interface sideNavProps {
    hideSideBar?: boolean;
}

export interface LocationSearchInputProps {
    valueLoc: string;
    onChangeLoc: (address: string) => void;
    onSelect?: (address: string) => void;
    placeholder?: string;
    name: string;
    errorMsg?: string;
    control: Control<any, any>;
    onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
    debounce?: number;
    searchOptions?: PropTypes["searchOptions"];
    onFocus?: () => void;
    shouldFetchSuggestions?: boolean;
    disabled?: boolean;
    [x: string]: any;
}

export interface MobileInputProps {
    control: Control<any, any>;
    name: string;
    [x: string]: any;
}

export interface ImageCropperModalProps {
    image_cropper_show: boolean;
    image_cropper_name: string;
    hideImageCropperModal: () => void;
    [x: string]: any;
}

export interface searchListObject {
    id?: string;
    api: number;
    operator: string;
    county: string;
    state: string;
    depth: string;
    drill_type: string;
    status: string;
    checked?: boolean;
    well_name: string;
}
interface commonprops<T> {
    min: number;
    max: number;
    name: string;
    type: string;
    className: string;
    placeholder: string;
    showerror: boolean;
    date: Date | null;
    defaultValue: T;
    children: React.ReactNode;
    control: Control<FieldValues>;
}

export interface inputProps<T> {
    className: commonprops<T>["className"];
    placeholder: commonprops<T>["placeholder"];
    maxLength?: commonprops<T>["max"];
    type: commonprops<T>["type"];
    control: Control<FieldValues>;
    name: commonprops<T>["name"];
    defaultValue: commonprops<T>["defaultValue"];
    showerror: commonprops<T>["showerror"];
    children?: commonprops<T>["children"];
    concatErrorMsg?: commonprops<T>["className"];
    onChangeHandler?: (val: string) => void;
    extraInputValue?: commonprops<T>["className"];
    twoDigitDecimal?: boolean;
}

export interface selectOptionProps {
    options: { label: string; value: string | number }[];
    register: UseFormRegister<any>;
    name: string;
    errorMsg?: string;
    className?: string;
    placeholder?: string;
    defaultValue?: string;
    // onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    // onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
    [x: string]: any;
}

export interface datePickerFieldProps<T> {
    placeholderText: commonprops<T>["placeholder"];
    className: commonprops<T>["className"];
    minDate?: commonprops<T>["date"];
    control: commonprops<T>["control"];
    name: commonprops<T>["name"];
    defaultValue: commonprops<T>["defaultValue"];
    showerror: commonprops<T>["showerror"];
    onChangeHandle?: (value: Date) => void;
    withPortal?: boolean;
}

export interface rangeSliderFieldProps<T> {
    step: number;
    min: commonprops<T>["min"];
    max: commonprops<T>["max"];
    isToolTip: boolean;
    control: commonprops<T>["control"];
    name: commonprops<T>["name"];
    defaultValue: commonprops<T>["defaultValue"];
    value: commonprops<T>["defaultValue"];
    showerror: commonprops<T>["showerror"];
    renderToolTip?: SliderProps["handleRender"];
    onAfterChange?: (e: number | number[]) => void;
}

export interface AsyncResult<OptionType, Additional = any> {
    options: OptionType[];
    hasMore: boolean;
    additional?: Additional;
}

export interface multiSelectProps<T> {
    refHandle: HTMLDivElement;
    name: string;
    showerror: boolean;
    cacheUniqs?: any[];
    control: commonprops<T>["control"];
    children?: commonprops<T>["children"];
    defaultValue: commonprops<T>["defaultValue"];
    placeholderText: commonprops<T>["placeholder"];
    searchPlaceholderText: commonprops<T>["placeholder"];
    handleLoadOption: (
        search: string,
        prevOptions: OptionsOrGroups<
            reactSelectProps,
            GroupBase<reactSelectProps>
        >,
        { page }: any
    ) => Promise<AsyncResult<reactSelectProps, any>>;
    isMulti: boolean;
    onChangeHandle?: (
        val: reactSelectProps | reactSelectProps[],
        action: ActionMeta<reactSelectProps>
    ) => void;
    async?: boolean;
    menuPosition?: "absolute" | "fixed";
    removedOption?: (value: { [x: string]: any }) => void;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface dropDownmenuProps {
    isOpen: boolean;
    target: React.ReactNode;
    children: React.ReactNode;
    // onClose: (e: any) => void
}

export interface InviteMemberComProps {
    inviteMemberCancelBtnClick: () => void;
    allowed_sub_user: number | null;
}

export type ColsType = {
    renderHeadTitle?: () => React.ReactNode;
    title?: string;
    thClassName?: string;
    tdClassName?: string;
    thId?: string;
    render?: (rowData?: object, index?: number) => React.ReactNode;
    renderTdForAction?: (
        rowData?: object,
        key?: number,
        index?: number
    ) => React.ReactNode;
    thStyle?: { [x: string]: string | number };
    onClick?: () => void;
    extraContent?: React.ReactNode;
    draggable?: boolean;
    onDragStart?: (e: React.DragEvent<HTMLSpanElement>, index: number) => void;
    onDragOver?: (e: React.DragEvent<HTMLSpanElement>, index: number) => void;
    onDrop?: (e: React.DragEvent<HTMLSpanElement>, index: number) => void;
    onDragEnd?: (e: React.DragEvent<HTMLSpanElement>, index: number) => void;
    unit?: string;
    // colClassName?: string;
};

export interface GlobalTableProps {
    cols: ColsType[];
    data: { [x: string]: any }[];
    tableClassName?: string;
    trClassName?: string;
    headStyle?: object;
    emptyPlaceholder?: string;
    tableRef?: RefObject<HTMLTableElement>;
    tableStyle?: { [x: string]: string | number };
    loadingMsg?: string;
    rowId?: number | string;
    graySelected?: boolean;
    showColGroup?: boolean;
}

export interface InviteMembersRowDataType {
    id: number;
    name: string;
    date_joined: string;
    last_login: string;
    email: string;
    signin_role: string;
    profile_pic: null | string;
    is_active: boolean;
}

export interface DivWithNormalScreen extends HTMLDivElement {
    msRequestFullscreen?: () => void;
    mozRequestFullScreen?: () => void;
    webkitRequestFullscreen?: () => void;
}

export interface DivWithFullScreen extends Document {
    msExitFullscreen?: () => void;
    mozCancelFullScreen?: () => void;
    webkitExitFullscreen?: () => void;
    profile_pic: null | string;
    is_active: boolean;
}

export interface ProfileSettingProps {
    ProfileSettingUser: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
    };
    profileFetchDetailsLoading: boolean;
}

export interface DeactivateRemoveModalProps {
    show: boolean;
    handleClose: () => void;
    label: string;
    activeMemberRequired: boolean;
    userType: string;
    selectedUserId: number;
}

export interface importSetting {
    id?: number;
    date: Date | null;
    description: string;
    uploaded_By: string;
    status: string;
    file_name: string;
}

// export interface PaginationProps {
//     shape?: 'circular' | 'rounded'
//     variant?: 'text' | 'outlined'
//     size?: 'small' | 'medium' | 'large'
//     color?: 'primary' | 'secondary' | 'standard'
// }

export interface PaginateProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (val: number) => void;
}

export interface modalProps {
    show: boolean;
    center?: boolean;
    title?: React.ReactNode;
    children: React.ReactNode;
    enableFooter?: boolean;
    contentClass?: string;
    headerClass?: string;
    titleClass?: string;
    bodyClass?: string;
    footerClass?: string;
    footRender?: React.ReactNode;
    modalSize?: "lg" | "sm" | "xl";
    onHide?: () => void;
}

export interface cartBasinProps {
    csvApiFileData: csvApiDataObj[];
    // csvApiUnmatchedFileData: csvApiDataObj[];
    // csvApiMatchedFileData: csvApiDataObj[];
    whichFileToOpen: number;
    openModalAFterUploadModal: boolean;
    handleCloseHandler: (
        props: { [x: string]: any },
        geometry?: string
    ) => void;
    apiCheckBoxes: (e: React.ChangeEvent<HTMLInputElement>) => void;
    file: Blob | null;
    csvApiFileName: string;
}

export interface cartFilterprops {
    // searchBlockRef: React.Ref<HTMLDivElement>;
}

export interface productProps {
    id: number;
    title: string;
    active: boolean;
}
export interface cartBasinToCountyState {
    wellstatusList: { well_status: string }[];
    countrylist: Array<any>;
    statelist: Array<any>;
    citylist: Array<any>;
    operatorid: string;
    countyid: string;
    stateid: string;
}
export interface UseIdleHookProps {
    timeout?: number;
    onIdle?: () => void;
    onActive?: () => void;
    onPrompt?: () => void;
    promptBeforeIdle?: number;
    debounce?: number;
    throttle?: number;
}

export interface reactSelectProps {
    value: string;
    label: string;
}
export interface SearchCompCartSelectBasinCounty {
    onSearchChange: (value: string) => void;
    onSearchBtnClick: (value: string) => void;
    [x: string]: any;
}

export interface CountyDataResponse {
    state_name: string;
    county_name: string;
    iso_code: string;
}

export interface cartBasinDateProps {
    getValues: () => FieldValues;
    control: Control<FieldValues>;
    watch: (val: string[]) => Date;
    onChangeEndDate: (value: Date, name: string) => void;
    onChangeStartDate: (value: Date, name: string) => void;
}
export interface cartBasinPopUp {
    name: string;
    label: string;
    accept: string[];
    openModal: boolean;
    control: Control<FieldValues>;
    modalCloseHandler: () => void;
    handleFileChange: (acceptedFiles: Blob | Blob[]) => void;
    extraContent?: React.ReactNode;
}
export interface cartBasinMultiSelectProps {
    control: Control<FieldValues>;
    name: string;
    itemsRef: React.MutableRefObject<HTMLDivElement[]>;
    index: number;
    extraField?: unknown;
    showerror: boolean;
    defaultValue: [];
    cacheUniqs?: string[];
    children?: React.ReactNode;
    placeholderText: string;
    searchPlaceholderText: string;
    fetchOptionHandler: (
        search: string,
        prevOptions: OptionsOrGroups<
            reactSelectProps,
            GroupBase<reactSelectProps>
        >,
        { page }: any,
        extra: any
    ) => Promise<AsyncResult<reactSelectProps, any>>;
    isMulti: boolean;
    onChangeHandle?: (
        val: reactSelectProps[] | reactSelectProps,
        action: ActionMeta<reactSelectProps>
    ) => void;
    async?: boolean;
    menuPosition?: "absolute" | "fixed";
    removedOption?: (value: { [x: string]: any }) => void;
}

export interface cartBasinBubbleProps {
    label: string;
    bubbleType: productProps[];
    handleBubbleType: (id: number) => void;
}

export interface CartBasinFilterTableColumnProps {
    onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
    filterTableColumn: { label: string; status: boolean; header: string }[];
    handleDragStartHandler: (
        e: React.DragEvent<HTMLSpanElement>,
        index: number
    ) => void;
    handleDragEnterHandler: (
        e: React.DragEvent<HTMLSpanElement>,
        index: number
    ) => void;
}

export interface tableFilterModalProps {
    openExportOtherPopup: boolean;
    openChooseColumnPopup: boolean;
    handleCloseHandler: (props: { [x: string]: boolean }) => void;
}

export interface RecaptchaProps {
    control: Control<any, any>;
    name: string;
    errorMsg?: string;
    myRef?: React.RefObject<ReCAPTCHA>;
    [x: string]: any;
}

export interface fileTypeResponse {
    status: number;
    data:
        | ParseStepResult<any>["data"]
        | shpjs.FeatureCollectionWithFilename
        | shpjs.FeatureCollectionWithFilename[];
}

export interface AsyncSelectProps {
    control: Control<any, any>;
    name: string;
    errorMsg?: string;
    label?: string;
    loadOptions: LoadOptions<any, GroupBase<any>, unknown>;
    labelClassName?: string;
    className?: string;
    [x: string]: any;
}

export interface CartBasinFilterState {
    shapeFileModal: boolean;
    // drillType: {
    //     id: number;
    //     title: string;
    //     active: boolean;
    // }[];
    // productTypeList: {
    //     id: number;
    //     title: string;
    //     active: boolean;
    //     value: string;
    // }[];
    fileToOpen: number;
    openModalAFterUploadModal: boolean;
    isChooseColumn: boolean;
    isExportOther: boolean;
    formData: {
        search_param?: string;
        well_name?: string[];
        operator?: string[];
        well_status?: string[];
        state_abbr?: string[];
        county?: string[];
        basin?: string[];
        reservoir?: string[];
        township?: number;
        range?: string;
        section?: number;
        abstract?: number;
        block?: number;
        survey?: string[];
        depth?: { min: number; max: number };
        vertical_depth?: { min: number; max: number };
        lateral_length?: { min: number; max: number };
        production_date?: { start: string; end: string };
        permit_date?: { start: string; end: string };
        production_type?: string[];
        well_type?: string[];
        drill_type?: string[];
        category?: string[];
        sub_category?: string[];
    } | null;
    file: Blob | null;
    geometry: string;
    epsg: string;
    csvApiFileName: string;
    csvApiFileSize: number;
    csvApiFileData: csvApiDataObj[];
    csvApiUnmatchedFileData: csvApiDataObj[];
    csvApiMatchedFileData: csvApiDataObj[];
    csvApiFileLoading: boolean;
    deleteCartItemModal: boolean;
    deleteItemId: null | number;
    deleteItemType: null | number;
    sub_total: number;
    notInPlan: boolean;
    byBasinTabData: BasinObjApiList[];
    byCountyTabData: CountyObjApiList[];
    apiFileWellApiList: string[];
}

export type OptionType = {
    label: string;
    value: string;
}[];

export interface DonutChartProps {
    data: OptionType[];
}
