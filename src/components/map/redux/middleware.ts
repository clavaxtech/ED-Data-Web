
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter.js";
import LayerIds from "../config/layers/LayerIds";
//import { SET_BASINS, SET_COUNTIES } from "./locations";
import { SET_FILTER, SetPanelFilter, TOGGLE_FILTER_VALUE, UpdateCountyTotals } from "./filters";
//import { SET_DEFAULT_FILTER, SET_RADIUS } from "./types";
import { createListenerMiddleware } from "@reduxjs/toolkit";
import FieldNames from "../config/layers/FieldNames";
import { getWellsAndPermitList } from "../../store/actions/wells-rigs-action";

export const filterMiddleware = createListenerMiddleware();

const updateLayers = (action: any, state: any, updateFilters: boolean = true) => {
    const layers = state.filters.layers;
    const layerId = action.payload.find((f:any) =>  f.layerId === LayerIds.WellData)?.layerId;
    const layer = state.esri.map.layers.find((l: { title: string; }) => l.title === LayerIds.WellData);
    let showRigs = true;
    let defaultFilter: FeatureFilter;
    let rigFilter: FeatureFilter;
    if (layer && layerId) {
        console.log('filtering wells');
        const rigFilters:[string] = [''];
        const layerFilters = Object.keys(layers[layerId])
            .map(field => {
                const ids = layers[layerId][field];
                if (Array.isArray(ids) && ids.length > 0) {
                    if (ids[0] == -1) {
                        return `${field} IN (NULL)`;
                    } else if (
                        typeof ids[0] == "string" &&
                        ids[0].startsWith("DATERANGE")
                    ) {
                        const fields: string[] = field.split("|");
                        const dateTokens: string[] = ids[0].split(" ");
                        const orClauses: string[] = [];
                        fields.forEach(f => {
                            orClauses.push(
                                `(${f} >= DATE '${dateTokens[1]}' AND ${f} <= DATE '${dateTokens[2]}')`
                            );
                        });
                        const formattedDateClause = `(${orClauses.join(" OR ")})`;
                        return formattedDateClause;
                    } else if (typeof ids[0] == "number") {
                        if (field === FieldNames.wellDataPointsTypeId) {
                            if(ids.indexOf(-100) === -1) {
                                showRigs = false;
                            }
                        }
                        return `${field} IN ('${ids.join("','")}')`;
                    } else {
                        if (FieldNames.rigFields.includes(field)) {
                            rigFilters.push(`${field} IN ('${ids.join("','")}')`);
                            //return ids.map((value) => `${field} LIKE '%${value}%'`).join(' OR ');
                        }
                        return `${field} IN ('${ids.join("','")}')`;
                    }
                } else if (Array.isArray(ids) && ids.length == 0) {
                    return undefined; // array length of 0 represents no filter - it's not an error condition
                }
                console.log(`Error adding filter for field ${field}, value: ${ids}`);
                return undefined;
            })
            .filter(f => !!f); // Remove undefined values (errored out filters)

        const defaultFilterDef = state.defaultFilters.filterDefs[layerId];
        if (defaultFilterDef) {
            defaultFilter = new FeatureFilter({
                distance: defaultFilterDef.distance,
                geometry: defaultFilterDef.geometry,
                spatialRelationship: defaultFilterDef.spatialRelationship,
                units: defaultFilterDef.units,
                where: defaultFilterDef.hasOwnProperty("where")
                    ? `${defaultFilterDef.where} AND ${layerFilters.join(" AND ")}`
                    : layerFilters.join(" AND ")
            });
        } else {
            defaultFilter = new FeatureFilter({
                where: layerFilters.length > 1 ? layerFilters.join(" AND ") : layerFilters[0]
            });
            rigFilters.length > 1
                ? rigFilter = new FeatureFilter({ 
                    where: rigFilters.length > 2 ? rigFilters.join(" AND ") : rigFilters.join("")
                })
                : rigFilter = new FeatureFilter()

        }

        const mapView = state.esri.mapView;

        mapView.whenLayerView(layer).then((layerView: __esri.FeatureLayerView) => {
            layerView.filter = defaultFilter;
            if (layerId === LayerIds.WellData) {
                const query = layer.createQuery();
                query.where = defaultFilter.where;
                if (defaultFilter.geometry) {
                    query.geometry = defaultFilter.geometry;
                    query.distance = defaultFilter.distance;
                    query.units = defaultFilter.units;
                    query.spatialRelationship = defaultFilter.spatialRelationship;
                }
                layerView.queryFeatures(query).then(featureSet => {
                    const offsetWellsFired = new CustomEvent("offset-wells-updated", {
                        detail: featureSet.features
                    });
                    document.dispatchEvent(offsetWellsFired);
                });
            }
        });
        const linesLayer = state.esri.map.layers.find((l: { title: string; }) => l.title === LayerIds.LateralLines);
        if (linesLayer) {
            const mapView = state.esri.mapView;
            mapView.whenLayerView(linesLayer).then((layerView: __esri.FeatureLayerView) => {
                layerView.filter = defaultFilter
            });
        }
    }

    const rigLayer = state.esri.map.layers.find((l: { title: string; }) => l.title === LayerIds.RigsData);
    if (rigLayer) {
        const mapView = state.esri.mapView;
        mapView.whenLayerView(rigLayer).then((layerView: __esri.FeatureLayerView) => {
            layerView.filter = showRigs && rigFilter
                ? rigFilter
                : new FeatureFilter({where: "1=0"})
        
        });
    }
}


filterMiddleware.startListening({
    actionCreator: SET_FILTER,
    effect: async (action, listenerApi) => {
        const state:any = listenerApi.getState();
        updateLayers(action, state);
    }
})

filterMiddleware.startListening({
    actionCreator: TOGGLE_FILTER_VALUE,
    effect: async (action, listenerApi) => {
        const state:any = listenerApi.getState();
        updateLayers(action, state);
    }
})

// filterMiddleware.startListening({
//     type: 'wells-rigs-action/getWellsAndPermitList',
//     effect: async (action, listenerApi) => {
//         const state:any = listenerApi.getState();
//         UpdateMapLegendFromFilter(action, state);
//     }
// })


