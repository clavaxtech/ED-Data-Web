import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
    CartListItemsType,
    CartSelectBasinCountyInitialValue,
    RemoveCartItemAction,
} from "../../models/redux-models";

const initialState: CartSelectBasinCountyInitialValue = {
    basinSearchList: [],
    countySearchList: [],
    cartListItems: [],
    cartItemsTotal: 0,
    stateOptions: [],
    cartItemsTotalTax: 0,
    saved_card: [],
    tax_percentage: 0,
    cartModified: false,
    lastCountyBasinName: "",
};

const membersSettings = createSlice({
    name: "cartSelectBasinCounty",
    initialState: initialState,
    reducers: {
        loadBasinSearchList(
            state,
            action: PayloadAction<
                CartSelectBasinCountyInitialValue["basinSearchList"]
            >
        ) {
            return {
                ...state,
                countySearchList: [],
                basinSearchList: action.payload,
            };
        },
        loadCountySearchList(
            state,
            action: PayloadAction<
                CartSelectBasinCountyInitialValue["countySearchList"]
            >
        ) {
            return {
                ...state,
                basinSearchList: [],
                countySearchList: action.payload,
            };
        },
        clearSearchList(state, action: PayloadAction) {
            return {
                ...state,
                basinSearchList: [],
                countySearchList: [],
            };
        },
        loadCartItems(state, action: PayloadAction<CartListItemsType>) {
            let tempArray = [...action.payload];
            return {
                ...state,
                cartListItems: tempArray,
                cartItemsTotal: tempArray
                    .filter((item) => item.is_deleted === false)
                    .reduce(
                        (accumulator, currentValue) =>
                            accumulator + currentValue.price,
                        0
                    ),
                cartModified:
                    tempArray.filter(
                        (item) =>
                            item.is_deleted === true ||
                            item.subscription_det_id === null
                    ).length > 0
                        ? true
                        : false,
            };
        },
        removeCartItems(state, action: PayloadAction<RemoveCartItemAction>) {
            let selectedObject = state.cartListItems.filter(
                (item) => item.id === action.payload.item_id
            );
            return {
                ...state,
                cartItemsTotal: state.cartItemsTotal - selectedObject[0].price,
                cartListItems: state.cartListItems.filter(
                    (item) => item.id !== action.payload.item_id
                ),
            };
        },
        clearCartItemsList(state, action: PayloadAction) {
            return {
                ...state,
                cartItemsTotal: 0,
                cartListItems: [],
                cartItemsTotalTax: 0,
                tax_percentage: 0,
            };
        },
        loadStateOptions(
            state,
            action: PayloadAction<
                CartSelectBasinCountyInitialValue["stateOptions"]
            >
        ) {
            return {
                ...state,
                stateOptions: [...action.payload],
            };
        },
        loadCartItemTotalTax(
            state,
            action: PayloadAction<{
                totalTax: CartSelectBasinCountyInitialValue["cartItemsTotalTax"];
                tax_percentage: number;
            }>
        ) {
            return {
                ...state,
                cartItemsTotalTax: action.payload.totalTax,
                tax_percentage: action.payload.tax_percentage,
            };
        },
        clearCartItemsTotalTax(state, action: PayloadAction) {
            return {
                ...state,
                cartItemsTotalTax: 0,
                tax_percentage: 0,
            };
        },
        loadSavedCardDetails(
            state,
            action: PayloadAction<
                CartSelectBasinCountyInitialValue["saved_card"]
            >
        ) {
            return {
                ...state,
                saved_card: action.payload,
            };
        },
        clearSavedCardDetails(state, action: PayloadAction) {
            return {
                ...state,
                saved_card: [],
            };
        },
        handleLastCountyBasinName(
            state,
            action: PayloadAction<
                CartSelectBasinCountyInitialValue["lastCountyBasinName"]
            >
        ) {
            return {
                ...state,
                lastCountyBasinName: action.payload,
            };
        },
    },
});

export default membersSettings;
