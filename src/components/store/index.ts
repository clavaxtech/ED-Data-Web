import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth-slice";
import modalSlice from "./reducers/modal-slice";
import companySettings from "./reducers/company-setting-slice";
import membersSettings from "./reducers/members-setting-slice";
import mySettings from "./reducers/my-setting-slice";
import notificationSettings from "./reducers/notification-settings-slice";
import cartBasinToCountySlice from "./reducers/cart-basin-to-county-slice";
import cartSelectBasinCounty from "./reducers/cart-select-basin-county-slice";
import subscriptionSettings from "./reducers/subscription-settings-slice";
import billingSettings from "./reducers/billing-settings-slice";
import aoiSlice from "./reducers/aoi-slice";
import wellsAndRigsSlice from "./reducers/wells-rigs-slice";
import defaultFilter from "../map/redux/defaultFilters";
import esriReducer from "../map/redux/esri";
import filtersReducer from "../map/redux//filters";
import attributeFilterReducer from "../map/redux/attributeFilterValues";
import locationsReducer from "../map/redux/locations";
import { filterMiddleware } from "../map/redux/middleware";
import segmentsSlice from "./reducers/segments-slice";
import files from "./reducers/files-slice";
import alerts from "./reducers/alert-slice";
import exportsSettings from "./reducers/exports-slice";

const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        modal: modalSlice.reducer,
        companySettings: companySettings.reducer,
        membersSettings: membersSettings.reducer,
        mySettings: mySettings.reducer,
        cartBasinToCounty: cartBasinToCountySlice.reducer,
        notificationSettings: notificationSettings.reducer,
        cartSelectBasinCounty: cartSelectBasinCounty.reducer,
        subscriptionSettings: subscriptionSettings.reducer,
        billingSettings: billingSettings.reducer,
        aoi: aoiSlice.reducer,
        wellsAndRigs: wellsAndRigsSlice.reducer,
        locations: locationsReducer,
        esri: esriReducer,
        filters: filtersReducer,
        defaultFilters: defaultFilter,
        attributeFilterValues: attributeFilterReducer,
        segments: segmentsSlice.reducer,
        files: files.reducer,
        alerts: alerts.reducer,
        exportsSettings: exportsSettings.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat([
            filterMiddleware.middleware
        ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
