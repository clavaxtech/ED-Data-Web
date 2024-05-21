import { ThunkAction } from "redux-thunk";
import { RootState } from "..";
import { AnyAction } from "redux";
import axios from "../../../utils/axios";
import cartSelectBasinCountySlice from "../reducers/cart-select-basin-county-slice";

import { toast } from "react-toastify";
import {
    CalculateTaxFormData,
    CartListItemsType,
    CartSelectBasinCountyInitialValue,
    CreateSubscriptionAlreadySubscribedFormData,
    CreateSubscriptionFormData,
    FinalSubscriptionFormData,
    RemoveCartItemFormData,
} from "../../models/redux-models";
import { CountyDataResponse } from "../../models/page-props";
import {
    BasinCountySearchListFormData,
    CreateSubscriptionReturnType,
    FetchWellNameSugReturnType,
    GetDetailsCountyBasinFormData,
    RemoveItemFromCartReturnType,
    ReturnMsgAndStatus,
    getApiListAfterSubReturnType,
} from "../../models/submit-form";
import { hideSiteLoader, showSiteLoader } from "./modal-actions";
import { config, errToast, tokenIsValid } from "../../../utils/helper";
import { AxiosError } from "axios";
export const cartSelectBasinCountyActions = cartSelectBasinCountySlice.actions;

//load search List
export const loadSearchList = (
    token: string,
    formData: BasinCountySearchListFormData
): ThunkAction<void, RootState, unknown, AnyAction> => {
    const { search, category } = formData;
    return async (dispatch, getState) => {
        await tokenIsValid(token);
        try {
            const res = await axios.get(
                `/api-subscriptions/get-suggetion?cat=${category}&search=${search}`,
                config
            );
            const { status, msg, data } = res.data;

            if (status === 200) {
                if (data) {
                    if (category === "basin") {
                        dispatch(
                            cartSelectBasinCountyActions.loadBasinSearchList(
                                data
                            )
                        );
                    } else {
                        let tempData: CartSelectBasinCountyInitialValue["countySearchList"] =
                            [];
                        let stateArray: string[] = [];
                        let stateISOCodeArray: string[] = [];
                        data?.forEach((item: CountyDataResponse) => {
                            if (!stateArray.includes(item.state_name)) {
                                stateArray.push(item.state_name);
                                stateISOCodeArray.push(item.iso_code);
                            }
                        });
                        stateArray?.forEach((item, index) => {
                            let temp: string[] = data
                                .filter(
                                    (_item: CountyDataResponse) =>
                                        _item.state_name === item
                                )
                                .map(
                                    (item: CountyDataResponse) =>
                                        item.county_name
                                );
                            tempData.push({
                                state_name: item,
                                county_name: temp,
                                iso_code: stateISOCodeArray[index],
                            });
                        });
                        dispatch(
                            cartSelectBasinCountyActions.loadCountySearchList(
                                tempData
                            )
                        );
                    }
                }
            } else {
                toast.error(msg);
            }
        } catch (err) {
            errToast(err as AxiosError);
        }
    };
};

//clearSearchList
export const clearSearchList = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(cartSelectBasinCountyActions.clearSearchList());
    };
};

//getBasinCountyDetails
export const getBasinCountyDetails = (
    token: string,
    formData: GetDetailsCountyBasinFormData
): ThunkAction<Promise<ReturnMsgAndStatus>, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token);
        // const {
        //     cartSelectBasinCounty: { cartListItems },
        // } = getState();

        try {
            const res = await axios.get(
                `/api-subscriptions/get-cart-item?cat=${
                    formData.category
                }&search=${formData.search}${
                    formData.category === "county"
                        ? `&state=${formData?.state}`
                        : ""
                }`,
                config
            );
            const { status, msg, data } = res.data;

            if (status === 200) {
                if (data && Array.isArray(data)) {
                    if (formData.category === "county") {
                        dispatch(
                            handleLastCountyBasinName(data[0]["county_basin"])
                        );
                    }
                    // if (
                    //     cartListItems.filter((item) => item.id === data[0].id)
                    //         .length !== 1
                    // ) {
                    // data.map((item) => {
                    //     delete item["geo_cordinate"];
                    //     return Object.assign(item, {
                    //         is_deleted: false,
                    //         subscription_det_id: null,
                    //     });
                    // });
                    // dispatch(loadCartItems(data));
                    dispatch(getCartDetails(token));
                    // }
                }
            } else {
                toast.error(msg);
            }
            dispatch(hideSiteLoader());
            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };
};

//add item in cartList
export const loadCartItems = (
    data: CartListItemsType
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(cartSelectBasinCountyActions.loadCartItems(data));
    };
};

//removeCartItem
export const removeCartItems = (
    token: string,
    formData: RemoveCartItemFormData
): ThunkAction<
    Promise<RemoveItemFromCartReturnType>,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token);
        try {
            const config = {
                data: {
                    ...formData,
                    ...("sub_total" in formData && {
                        sub_total: Number(formData.sub_total.toFixed(2)),
                    }),
                },
                headers: { "Content-Type": "application/json" },
            };
            const res = await axios.delete(
                `/api-subscriptions/temp-cart-item`,
                config
            );
            const { status, msg, data } = res.data;
            if (status === 200) {
                if ("sub_total" in formData) {
                    dispatch(clearCartItemsList());
                    dispatch(clearCartItemsTotalTax());
                    if (data?.data) {
                        dispatch(
                            cartSelectBasinCountyActions.loadCartItemTotalTax({
                                totalTax: data?.data.tax_amount_exclusive / 100,
                                tax_percentage: Number(
                                    data?.data?.tax_breakdown[0]
                                        .tax_rate_details?.percentage_decimal
                                ),
                            })
                        );
                    }
                }
                // dispatch(clearCartItemsList());
                toast.success(msg);
            } else {
                toast.error(msg);
            }
            dispatch(hideSiteLoader());
            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };
};

//clearCartItemsList
export const clearCartItemsList = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(cartSelectBasinCountyActions.clearCartItemsList());
    };
};

//getCartDetails
export const getCartDetails = (
    token: string,
    sub_id?: number
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token);
        try {
            const res = await axios.get(
                `/api-subscriptions/temp-cart-item${
                    sub_id ? `?sub_id=${sub_id}` : ""
                }`,
                config
            );
            const { status, msg, data } = res.data;

            if (status === 200) {
                dispatch(loadCartItems(data));
            } else {
                toast.error(msg);
            }
            dispatch(hideSiteLoader());
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };
};

//deleteAllCartItems
export const deleteAllCartItems = (
    token: string
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token);
        try {
            const res = await axios.delete(
                `/api-subscriptions/empty-cart`,
                config
            );
            const { status, msg } = res.data;

            if (status === 200) {
                toast.success(msg);
                dispatch(clearSearchList());
                dispatch(clearCartItemsList());
            } else {
                toast.error(msg);
            }
            dispatch(hideSiteLoader());
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };
};

//createSubscription
export const createSubscription = (
    token: string,
    formData:
        | CreateSubscriptionFormData
        | CreateSubscriptionAlreadySubscribedFormData
): ThunkAction<
    Promise<CreateSubscriptionReturnType>,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        // dispatch(showSiteLoader());
        await tokenIsValid(token);
        try {
            const res = await axios.post(
                "/api-subscriptions/subscription",
                formData,
                config
            );
            // dispatch(hideSiteLoader());
            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
            // dispatch(hideSiteLoader());
        }
    };
};

//finalSubscription
export const finalSubscription = (
    token: string,
    formData: FinalSubscriptionFormData
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        await tokenIsValid(token);
        try {
            await axios.post(
                "/api-subscriptions/finish-subscription",
                formData,
                config
            );
        } catch (err) {
            errToast(err as AxiosError);
        }
    };
};

//getStateList
export const getStateList = (
    token: string
): ThunkAction<Promise<ReturnMsgAndStatus>, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        await tokenIsValid(token);
        try {
            const res = await axios.get(`/api-user/get-state`, config);
            const { status, msg, data } = res.data;

            if (status === 200) {
                if (Array.isArray(data)) {
                    dispatch(
                        cartSelectBasinCountyActions.loadStateOptions(
                            data.map((item) => ({
                                label: item.state_name,
                                value: item.iso_code,
                            }))
                        )
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

//calculateTax
export const calculateTax = (
    token: string,
    formData: CalculateTaxFormData
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token);
        try {
            const res = await axios.post(
                "/api-subscriptions/calculate-tax",
                {
                    ...formData,
                    sub_total: Number(formData.sub_total.toFixed(2)),
                },
                config
            );
            const { status, msg, data, saved_card } = res.data;
            if (status === 200) {
                if (Array.isArray(saved_card)) {
                    dispatch(
                        cartSelectBasinCountyActions.loadSavedCardDetails(
                            saved_card
                        )
                    );
                }
                if (Object.keys(data).length > 0) {
                    dispatch(
                        cartSelectBasinCountyActions.loadCartItemTotalTax({
                            totalTax: data.tax_amount_exclusive / 100,
                            tax_percentage: Number(
                                data?.tax_breakdown[0].tax_rate_details
                                    ?.percentage_decimal
                            ),
                        })
                    );
                }
            } else {
                toast.error(msg);
            }
            dispatch(hideSiteLoader());
            return { status, msg };
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };
};

//clearCartItemsTotalTax
export const clearCartItemsTotalTax = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(cartSelectBasinCountyActions.clearCartItemsTotalTax());
    };
};

//clearSavedCardDetails
export const clearSavedCardDetails = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(cartSelectBasinCountyActions.clearSavedCardDetails());
    };
};

//fetchSuggestionWellName
export const fetchSuggestionWellName = (
    token: string,
    formData: { wellName: string }
): ThunkAction<
    Promise<FetchWellNameSugReturnType>,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        const { wellName } = formData;
        await tokenIsValid(token);
        try {
            const res = await axios.get(
                `/api-search/search-well-api?param=${wellName}`,
                config
            );

            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
        }
    };
};

//get the csv api list after the completing the payment
export const getApiListAfterCompletingThePayment = (
    token: string,
    fileName: string
): ThunkAction<
    Promise<getApiListAfterSubReturnType>,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(showSiteLoader());
        await tokenIsValid(token);
        try {
            const res = await axios.get(
                `api-search/refresh-csv-api?file_name=${fileName}`,
                config
            );
            dispatch(hideSiteLoader());
            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };
};

//handleLastCountyBasinName
export const handleLastCountyBasinName = (
    val: string
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(cartSelectBasinCountyActions.handleLastCountyBasinName(val));
    };
};

//proceed to checkout when price is equal to or greater than basin price
export const removeMultiCountyAndBasin = (
    token: string,
    formData: {
        item_id: number[];
        item_type: 1 | 2;
        basin_name: string;
    }
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
                "/api-subscriptions/auto-update-basin",
                config
            );
            const { status, msg } = res.data;
            if (status === 200) {
                dispatch(getCartDetails(token));
            } else {
                toast.error(msg);
                dispatch(hideSiteLoader());
            }
            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(hideSiteLoader());
        }
    };
};
