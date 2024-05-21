import { UseFormRegisterReturn } from "react-hook-form";
import { User, WellsAndPermitsObject } from "./redux-models";
import { actionType } from "../../utils/helper";

export interface SignUpSubmitForm {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirmPassword: string;
    terms_accepted: boolean | number;
    account_type: "individual" | "company";
    company_name?: string;
    "g-recaptcha-response": string;
}

export interface SignUpFormData {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirmPassword?: string;
    terms_accepted: boolean | number;
    "g-recaptcha-response": string;
    account_type: "individual" | "company";
    company_name?: string;
}

export interface SignInSubmitForm {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface ForgotPasswordSubmitForm {
    email: string;
}

export interface ForgotPasswordSubmitFormData {
    email?: string;
}

export interface UpdatePasswordSubmitForm {
    password: string;
    confirmPassword: string;
    "g-recaptcha-response": string;
}

export interface UpdatePasswordSubmitFormData {
    password: string;
    confirmPassword?: string;
    user_id?: string;
    "g-recaptcha-response"?: string;
    base_user_id?: string;
}

export interface SetPasswordSubmitFormData {
    password: string;
    ref_id: string;
    "g-recaptcha-response": string;
}

export type ReturnMsgAndStatus = {
    status: number;
    msg: string;
};

export type RegisterUserReturnType = ReturnMsgAndStatus;
export type FetchCompanySettingReturnType = ReturnMsgAndStatus;
export type RemoveCompanyPicReturnType = ReturnMsgAndStatus;
export type UploadCompanyPicReturnType = ReturnMsgAndStatus & {
    file_name: string;
};
export type UploadProfilePicReturnType = ReturnMsgAndStatus & {
    file_name: string;
};
export type RemoveProfilePicReturnType = ReturnMsgAndStatus;

export type ActivateUserReturnType = ReturnMsgAndStatus;
export type ForgotPasswordReturnType = ReturnMsgAndStatus;
export type UpdatePasswordReturnType = ReturnMsgAndStatus;
export type SetPasswordReturnType = ReturnMsgAndStatus;
export type InvitMembersReturnType = ReturnMsgAndStatus;
export interface verifyResetPasswordTokenReturnType {
    msg: string;
    status: number;
    user_id?: string;
}

export interface verifyInviteMembersTokenReturnType {
    msg: string;
    status: number;
    ref_id?: string;
}
export interface ActivateNewUserFormData {
    user_id: number;
    token: string | null;
}

type companyLogoAddAndRemove = {
    upload_type: string;
    user_id: number;
    company_id?: number;
};

type ImageFileType = string;

export type CompanyPicFormData = companyLogoAddAndRemove & {
    image_file: ImageFileType;
};
export type ProfilePicFormData = {
    image_file: ImageFileType;
};

export type CompanyPicRemoveFormData = companyLogoAddAndRemove & {
    image_name: string;
};

export type CompanyConfig = {
    download_enabled: boolean;
    free_trial_period_enabled: boolean;
    is_trial_never_end: boolean;
    no_of_free_days_allowed: number;
    paid_expired: boolean;
    trial_expired: boolean;
};

export interface CompanySettingSubmitReturnType {
    data?: {
        address_id: number;
        company_id: number;
        allowed_sub_user: number;
        company_configs: CompanyConfig;
        trial_remaining_days: number;
    };
    msg: string;
    status: number;
}

export interface LoginUserReturnType {
    msg: string;
    data: User;
    status: number;
}
export type submitBasicCompanyInfo =
    | saveBasicCompanyInfo
    | updateBasicCompanyInfo;
export type updateBasicCompanyInfo = saveBasicCompanyInfo & {
    company_id: number;
    address_id: number;
};
export interface saveBasicCompanyInfo {
    company_name: string;
    company_email: string;
    billing_email: string;
    company_logo?: string;
    first_address: string;
    second_address?: string;
    city: string;
    state: string;
    zip_code: string;
    phone_no: string;
}

export interface InviteMemberFormData {
    first_name: string;
    last_name: string;
    email: string;
    invite_as: string;
}

export type InviteMemberSubmitData = InviteMemberFormData & {
    company: number;
};
export interface autoComplete {
    name: string;
    register: (name: string) => UseFormRegisterReturn;
    placeholder: string;
    className: string;
}

export type UpdateProfilePicReturnType = ReturnMsgAndStatus;
export type FetchProfilePicReturnType = ReturnMsgAndStatus;

type NotificationObjArr = {
    none: boolean;
    is_in_app: boolean;
    is_email: boolean;
}[];

export interface NotificationSubmitFormData {
    notification: NotificationObjArr;
}

export interface saveNotificationOptionsFormData {
    data: {
        event_id: number;
        is_in_app: number;
        is_email: number;
    }[];
}

export type NotificationSubmitFormDataReturnType = ReturnMsgAndStatus;

export interface DeactivateRemoveSubmitForm {
    activeMember: number;
}

export interface DeactivateRemoveUsersSubmitFormData {
    user_id: number;
    delete_type: string;
    assigned_user?: number;
}

export type DeactivateRemoveUsersReturnType = ReturnMsgAndStatus;

export type ActivateUser = {
    user_id: number;
    type: "status";
};

export type RoleChangeUser = {
    user_id: number;
    role_id: number;
    type: "role";
};

export type ActivateOrRoleChangedUsersSubmitFormData =
    | ActivateUser
    | RoleChangeUser;

export type ActivateOrRemoveUsersReturnType = ReturnMsgAndStatus;

export interface axiosResponse {
    msg: string;
    status: number;
    data: any[];
}

export interface BasinCountySearchListFormData {
    search: string;
    category: "basin" | "county";
}

export interface GetDetailsCountyBasinFormData {
    search: string;
    category: "basin" | "county";
    state?: string;
}

export interface CheckOutFormData {
    name: string;
    billing_email: string;
    address: string;
    city: string;
    zip_code: string;
    state: string;
    country: string;
    cardNumber: { [x: string]: any };
    cardExpiry: { [x: string]: any };
    cardCvc: { [x: string]: any };
}

export type CheckOutSavedCardFormData = CheckOutFormData & {
    saved_card: string;
};

export type RemoveItemFromCartReturnType = ReturnMsgAndStatus;

export type CreateSubscriptionReturnType = ReturnMsgAndStatus & {
    data: {
        subscription_id: string;
        client_secret: string;
    };
};

export type CancelSubscriptionReturnType = ReturnMsgAndStatus;

export interface UpdateBillingAddressModalSubmitForm {
    billing_email: string;
    first_address: string;
    second_address: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
}
export type CreditCardUpdateModalSubmitForm = Omit<
    UpdateBillingAddressModalSubmitForm,
    "billing_email" | "country"
> & {
    full_name: string;
    cardNumber: { [x: string]: any };
    cardExpiry: { [x: string]: any };
    cardCvc: { [x: string]: any };
};

export type UpdateCardDetailsFormData = {
    last4: string;
    payment_id: string;
    exp_month: string;
    exp_year: string;
    first_address: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    name_on_card: string;
    brand: string;
};

export type UpdateCardDetailsReturnType = ReturnMsgAndStatus;
export type UpdateBillingAddressReturnType = ReturnMsgAndStatus;

export interface FetchPaymentHistoryDataSubmitForm {
    page: number;
    recent?: number;
}

export interface AoiGenTabNotiFormData {
    notification: NotificationObjArr;
}

export type AoiNotiFormData = {
    notification_settings: NotificationObjArr;
};
export interface CreateAoiSubmitForm {
    aoi_name: string;
    bufferDistance: string;
}

export type UploadAoiFileReturnType = ReturnMsgAndStatus & {
    file_name: string;
};

export interface CrsModalSubmitForm {
    crs: { label: string; value: string };
}

export interface SendCrsReturnType {
    msg: string;
    data: {
        data: {
            img_name: string;
            multi_polygon: string;
        };
        aoi_name: string;
    };
    status: number;
}
export type fetchCrsListReturnType = {
    msg: string;
    data: {
        crs_no: number;
        crs_name: string;
    }[];
    extra: {
        total_record: number;
        page_size: number;
    };
    status: number;
};

export type OptionType = {
    value: number | string;
    label: string | number;
};

export type WellsOrRigsReturnType = ReturnMsgAndStatus & {
    data: {
        total_count: number;
        page_size: number;
        data: WellsAndPermitsObject[];
    };
};

export interface FetchOptionQueryData {
    // page: number;
    search_field:
        | "name"
        | "well_status"
        | "well_api"
        | "operator_name"
        | "state_abbr"
        | "county"
        | "basin_name"
        | "legaldesc_survey"
        | "csv_file_id";
    like?: string;
    id?: number;
    state_abbr?: string[];
}

export type FetchOptionReturnType = ReturnMsgAndStatus & {
    data: {
        [x: string]: any;
    }[];
    total_count: number;
    page_size: number;
};

export type csvApiDataObj = {
    id: number;
    well_name: string;
    api: string;
    state: string;
    county: string;
    status: string;
    wellMatching: OptionType[] | null;
};

export type BasinObjApiList = {
    basin_name: string;
    well_count: number;
    county_count: number;
    price: number;
};

export type CountyObjApiList = {
    county: string;
    basin_name: string;
    state: string;
    well_total: number;
    price: number;
};

export type UploadShapFileReturnType = ReturnMsgAndStatus & {
    data: {
        not_in_plan?: boolean;
        by_basin?: BasinObjApiList[];
        by_county?: CountyObjApiList[];
        filter_data: string | csvApiDataObj[];
        unmatched_data?: csvApiDataObj[];
    };
    file_name?: string;
    epsg?: string;
};

export interface SaveAsAoiFormData {
    aoi_name: string;
    bufferDistance: string;
}

export interface ApiListTableFormData {
    wellMatching: { name: OptionType[] | null }[];
}

export interface FetchWellNameSugReturnType {
    msg: string;
    data: {
        api: string;
        well_name: string;
    }[];
    status: number;
}

export interface getApiListAfterSubReturnType {
    msg: string;

    data: {
        filter_data: csvApiDataObj[];

        unmatched_data: csvApiDataObj[];
    };
    status: number;
}

export interface FilterObj {
    dataPoint: string;
    fields: string;
    operator: string;
    value: string | Date;
    upperValue?: Date | string | OptionType;
    endDate?: Date | null | string;
    id?: number;
    segment_id?: number;
}

export interface AdvFilterObj {
    condition: string;
    filter: FilterObj[];
}

export interface AdvFilterSubmitForm {
    obj: AdvFilterObj[];
}

export interface SaveSegmentAdvFilterObj {
    id?: number;
    segment_id?: number;
    group_cond: string;
    option_choice: string;
    data_point: string;
    data_point_field: string;
    operator_choice: string;
    filter_value:
        | {
              start: string;
              end: string;
          }
        | string;
}
export interface SaveSegmentAdvFilterFormData {
    segment_name: string;
    search_param: SaveSegmentAdvFilterObj[];
    seg_id?: number;
}

export interface FetchStateAdvFilterReturnType {
    msg: string;
    data: {
        state_abbr: string;
        state_name: string;
    }[];

    status: number;
}

export interface SegmentBtnActionFormData {
    id: number[];
    action: "activate" | "archive" | "delete";
}

export type SelectedSegmentReturnType = ReturnMsgAndStatus & {
    data: (SaveSegmentAdvFilterObj & { id: number; segment_id: number })[];
};

type NotificationObjWithPushArr = {
    none: boolean;
    is_in_platform: boolean;
    is_email: boolean;
    // is_mobile_push: boolean;
}[];

export interface AlertsTabNotiFormData {
    notification: NotificationObjWithPushArr;
}

export interface AnalyticsDataObject {
    oil_data: {
        [x: string]: {
            production_date: string;
            production_quantity: number;
        }[];
    };
    gas_data: {
        [x: string]: {
            production_date: string;
            production_quantity: number;
        }[];
    };
}

export interface SubmitFormUserActionLog {
    action_type:
        | (typeof actionType)["view_settings"]
        | (typeof actionType)["remove_user"]
        | (typeof actionType)["invite_member"]
        | (typeof actionType)["view_analytics"]
        | (typeof actionType)["export_data"]
        | (typeof actionType)["upload_api_list"]
        | (typeof actionType)["delete_aoi"]
        | (typeof actionType)["save_aoi"]
        | (typeof actionType)["click_rig"]
        | (typeof actionType)["click_well"]
        | (typeof actionType)["run_forecast"]
        | (typeof actionType)["execute_advanced_filter"]
        | (typeof actionType)["execute_filter"]
        | (typeof actionType)["new_subscription"]
        | (typeof actionType)["cancelled_subscription"]
        | (typeof actionType)["upload_shapefile"]
        | (typeof actionType)["download_docs"];
    action_log_detail?: string;
}
