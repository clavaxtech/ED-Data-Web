import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";
import ViewPoint from "@arcgis/core/Viewpoint";
//import { INIT_MAP, SET_HOME } from "./types";
import { createSlice } from "@reduxjs/toolkit";

export const enum AddedAOIType {
    AOI,
    PROJECT
}

// Reducer
const initialState = {
    featuresForStatistics: [],
    map: new Map(),
    mapView: new MapView(),
    homeViewpoint: new ViewPoint(),
    lastAddedGeom: '',
    lastAddedGeomCRS: '',
    lastAddedGeomType: 0
};

export function esriReducerBackup(state = initialState, action: { type: any; payload: { homeViewpoint: ViewPoint; }; }) {
    switch (action.type) {
        case INIT_MAP: {
            const newState = { ...state, ...action.payload };
            newState.homeViewpoint = state.mapView.viewpoint;
            return newState;
        }
        case SET_HOME: {
            const newState = { ...state };
            if (action.payload.homeViewpoint) {
                newState.homeViewpoint = action.payload.homeViewpoint;
            } else {
                return state;
            }
            return newState;
        }
        default:
            return state;
    }
};

const esriReducer = createSlice({
    name:"esri",
    initialState,
    reducers: {
        INIT_MAP: (state, action) => {
            const {map, mapview} = action.payload;
            state.map = map;
            state.mapView = mapview;
            state.homeViewpoint = state.mapView.viewpoint;
        },
        NEW_AOI: (state, action) => {
            const {geojson, crs} = action.payload;
            state.lastAddedGeom = geojson;
            state.lastAddedGeomCRS = crs;
            state.lastAddedGeomType = AddedAOIType.AOI
        },
        NEW_PROJECT: (state, action) => {
            const {geojson, crs} = action.payload;
            state.lastAddedGeom = geojson;
            state.lastAddedGeomCRS = crs;
            state.lastAddedGeomType = AddedAOIType.PROJECT
        },
        SET_HOME: (state, action) => {
            if (action.payload.homeViewpoint) {
                state.homeViewpoint = action.payload.homeViewpoint;
            }
        },
        setFeaturesForStatistics: (state, action) => {
            const {features} = action.payload
            state.featuresForStatistics = features
        }
    }
});

export const { INIT_MAP, SET_HOME, NEW_AOI, NEW_PROJECT, setFeaturesForStatistics } = esriReducer.actions;

export default esriReducer.reducer;

// Action Creators
export function initMap(map: any, mapView: any) {
    return { type: INIT_MAP, payload: { map, mapView } };
}

export function setHomeViewpoint(homeViewpoint: any) {
    return { type: SET_HOME, payload: { homeViewpoint } };
}
