import { AnyAction } from "redux";
import { RootState } from "../index";
import { ThunkAction } from "redux-thunk";
import axios from "../../../utils/axios";
import { errorHandler } from "../../../Helper/axiosError";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import {
    BasinCountySearchListFormData,
    FetchOptionQueryData,
    FetchOptionReturnType,
    OptionType,
    ReturnMsgAndStatus,
    UploadShapFileReturnType,
} from "../../models/submit-form";
import cartBasinToCountySlice from "../reducers/cart-basin-to-county-slice";
import {
    LATERAL_LENGTH_MAX,
    MEASURED_DEPTH_MAX,
    TRUE_VERTICAL_DEPTH_MAX,
    actionType,
    config,
    errToast,
    tokenIsValid,
} from "../../../utils/helper";
import { hideSiteLoader, showSiteLoader } from "./modal-actions";
import {
    AddAllBasinOrCountyToCartFormData,
    SaveApiListFormData,
    cartBasinState,
} from "../../models/redux-models";
import { getCartDetails } from "./cart-select-basin-county-actions";
import { logUserAction } from "./auth-actions";

let { clearSearchList, fetchBasinSearchList } = cartBasinToCountySlice.actions;

export const cartBasinSearchList = (
    token: string,
    formData: BasinCountySearchListFormData
): ThunkAction<void, RootState, unknown, AnyAction> => {
    const { search, category } = formData;
    return async (dispatch) => {
        await tokenIsValid(token);
        try {
            let response = await axios({
                method: "get",
                url: `/api-subscriptions/get-suggetion?cat=${category}&search=${search}`,
                headers: config.headers,
            });
            const { status, msg, data } = response.data;
            if (status === 200) {
                if (data) {
                    if (category === "basin") {
                        dispatch(fetchBasinSearchList(data));
                    }
                }
            } else {
                toast.error(msg);
            }
        } catch (err) {
            let { message } = errorHandler(err as AxiosError);
            toast.error(message);
        }
    };
};

export const clearCartBasinSearchList = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch) => {
        dispatch(clearSearchList());
    };
};

//to fetchOptions of DropDown
export const fetchOptionsList =
    (
        data: FetchOptionQueryData,
        loader = false
    ): ThunkAction<
        Promise<FetchOptionReturnType>,
        RootState,
        unknown,
        AnyAction
    > =>
    async (dispatch, getState) => {
        loader && dispatch(showSiteLoader());
        const {
            auth: {
                user: { access_token },
            },
        } = getState();
        await tokenIsValid(access_token);
        try {
            const response = await axios.post(
                `api-search/search-params`,
                data,
                config
            );
            const { status, msg } = response.data;
            if (status !== 200) toast.error(msg);
            loader && dispatch(hideSiteLoader());

            return response.data;
        } catch (err) {
            loader && dispatch(hideSiteLoader());
            errToast(err as AxiosError);
        }
    };

// upload shape file or  csv file
export const uploadShapeFileOrCsv = (
    token: string,
    formData: { file: Blob; aoi_name?: string; buffer_distance?: string },
    fileType: "upload_shapefile" | "upload_api_list"
): ThunkAction<
    Promise<UploadShapFileReturnType>,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        const { aoi_name, buffer_distance } = formData;
        buffer_distance && dispatch(showSiteLoader());
        await tokenIsValid(token);
        const { file } = formData;
        const filename = file.name;
        const payloadData = new FormData();
        payloadData.append("file", file, filename);
        buffer_distance &&
            payloadData.append("buffer_distance", buffer_distance);

        try {
            axios.defaults.headers.common[
                "Content-Disposition"
            ] = `attachment; filename=${filename}`;
            const res = await axios.put(
                `/api-search/upload-file${
                    aoi_name ? `?aoi_name=${aoi_name}&save_as_aoi=${true}` : ""
                }`,
                payloadData
            );
            const { status, msg, data, file_name } = res.data || {};

            buffer_distance && dispatch(hideSiteLoader());
            return aoi_name
                ? {
                      status,
                      msg,
                      data: {
                          filter_data:
                              status === 200 ? data?.data?.multi_polygon : "",
                      },
                      ...(file_name && { file_name }),
                      ...(data?.epsg && status === 200 && { epsg: data?.epsg }),
                  }
                : {
                      ...res.data,
                      ...(data?.epsg && status === 200 && { epsg: data?.epsg }),
                  };
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };
};

//Add all basin or county to cart
export const addAllBasinOrCountyToCart = (
    token: string,
    formData: AddAllBasinOrCountyToCartFormData
): ThunkAction<Promise<ReturnMsgAndStatus>, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token);
        try {
            const res = await axios.post(
                "/api-subscriptions/get-cart-item",
                formData,
                config
            );
            const { status, msg } = res.data;

            if (status === 200) {
                dispatch(getCartDetails(token));
                toast.success(msg);
            } else {
                toast.error(msg);
                dispatch(hideSiteLoader());
            }

            return res.data;
        } catch (err) {
            dispatch(hideSiteLoader());
            errToast(err as AxiosError);
        }
    };
};

//remove an item from apiList upgrade from cart
export const removeItemFromCartInApiListUpgradeModal = (
    token: string,
    formData: AddAllBasinOrCountyToCartFormData,
    doNotCallFetchCartListApi?: boolean
): ThunkAction<Promise<ReturnMsgAndStatus>, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token);
        const config = {
            data: {
                ...formData,
            },
            headers: { "Content-Type": "application/json" },
        };
        try {
            const res = await axios.delete(
                "/api-subscriptions/deselect-all",
                config
            );
            const { status, msg } = res.data;

            if (status === 200) {
                !doNotCallFetchCartListApi && dispatch(getCartDetails(token));
                toast.success(msg);
            } else {
                toast.error(msg);
                dispatch(hideSiteLoader());
            }

            return res.data;
        } catch (err) {
            dispatch(hideSiteLoader());
            errToast(err as AxiosError);
        }
    };
};

//continue without saving api list
export const contWithoutSavingApiList = (
    tkn: string
): ThunkAction<Promise<ReturnMsgAndStatus>, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        await tokenIsValid(tkn);
        dispatch(showSiteLoader());
        try {
            const res = await axios.delete(`/api-search/csv-api`, config);
            const { status } = res.data;
            if (status === 200) {
                //log user actions
                dispatch(
                    logUserAction({
                        action_type: actionType["upload_api_list"],
                        action_log_detail: JSON.stringify({
                            message: `The user adopted the continue without saving method.`,
                        }),
                    })
                );
            }
            dispatch(hideSiteLoader());
            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };
};

//save api list
export const saveApiList = (
    token: string,
    formData: SaveApiListFormData
): ThunkAction<Promise<ReturnMsgAndStatus>, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token);
        try {
            const res = await axios.post(
                "/api-search/csv-api",
                formData,
                config
            );
            const { status, file_uploaded } = res.data;
            if (status === 200) {
                //log user actions
                dispatch(
                    logUserAction({
                        action_type: actionType["upload_api_list"],
                        action_log_detail: JSON.stringify({
                            file_name: file_uploaded,
                        }),
                    })
                );
            }
            dispatch(hideSiteLoader());
            return res.data;
        } catch (err) {
            dispatch(hideSiteLoader());
            errToast(err as AxiosError);
        }
    };
};

export const handleWellApiListAfterCsvUpload = (
    data: OptionType[]
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch) => {
        dispatch(
            cartBasinToCountySlice.actions.handleWellApiListAfterCsvUpload(data)
        );
    };
};
//handle slider value
export const handleSliderValue = (
    data: cartBasinState["sliderMinMaxValue"]
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(cartBasinToCountySlice.actions.handleSliderValue(data));
    };
};

//get slider Max Value
export const fetchSliderMaxValue = (
    token: string
): ThunkAction<
    Promise<
        ReturnMsgAndStatus & {
            lateral_length: number;
            true_vertical_depth: number;
            measured_depth: number;
        }
    >,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        // dispatch(showSiteLoader());
        await tokenIsValid(token);
        try {
            const res = await axios.get(`/api-search/get-slider-value`, config);
            const { status, data } = res.data;
            if (status === 200 && data) {
                dispatch(
                    handleSliderValue({
                        maxLateralLength:
                            data[0].lateral_length < LATERAL_LENGTH_MAX
                                ? data[0].lateral_length
                                : LATERAL_LENGTH_MAX,
                        maxTrueVerticalDepth:
                            data[0].true_vertical_depth <
                            TRUE_VERTICAL_DEPTH_MAX
                                ? data[0].true_vertical_depth
                                : TRUE_VERTICAL_DEPTH_MAX,
                        maxMeasuredDepth:
                            data[0].measured_depth < MEASURED_DEPTH_MAX
                                ? data[0].measured_depth
                                : MEASURED_DEPTH_MAX,
                        dataLoading: false,
                        ...data[0],
                    })
                );
            }
            // dispatch(hideSiteLoader());
            return {
                ...res.data,
                lateral_length: data
                    ? data[0].lateral_length < LATERAL_LENGTH_MAX
                        ? data[0].lateral_length
                        : LATERAL_LENGTH_MAX
                    : 0,
                true_vertical_depth: data
                    ? data[0].true_vertical_depth < TRUE_VERTICAL_DEPTH_MAX
                        ? data[0].true_vertical_depth
                        : TRUE_VERTICAL_DEPTH_MAX
                    : 0,
                measured_depth: data
                    ? data[0].measured_depth < MEASURED_DEPTH_MAX
                        ? data[0].measured_depth
                        : MEASURED_DEPTH_MAX
                    : 0,
            };
        } catch (err) {
            // dispatch(hideSiteLoader());
            errToast(err as AxiosError);
        }
    };
};

export const handleHideSearchFilter = (
    val: boolean
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch) => {
        dispatch(cartBasinToCountySlice.actions.handleHideSearchFilter(val));
    };
};

export const handleStateList = (
    data: cartBasinState["state_list"]
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch) => {
        dispatch(cartBasinToCountySlice.actions.handleStateList(data));
    };
};

export const handleClearAllFilter = (
    val: cartBasinState["clearAllFilter"]
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch) => {
        dispatch(cartBasinToCountySlice.actions.handleClearAllFilter(val));
    };
};
