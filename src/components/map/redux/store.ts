
import  defaultFilter from "./defaultFilters";
import  esriReducer from "./esri";
import  filtersReducer  from "./filters";
import  attributeFilterReducer  from "./attributeFilterValues";
import  locationsReducer from "./locations";
import { filterMiddleware } from "./middleware";

//import { filterMiddleware, mapMiddleware } from "./arcgisMiddleware";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({ 
    reducer: {
        locations: locationsReducer,
        esri: esriReducer,
        filters: filtersReducer,
        defaultFilters: defaultFilter,
        attributeFilterValues: attributeFilterReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}).concat(
        [filterMiddleware.middleware])
});

export default store;
