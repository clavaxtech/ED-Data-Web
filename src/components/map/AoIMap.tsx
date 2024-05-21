import React, { useRef, useEffect, useState } from "react";
import { BASINS, COUNTIES } from "./redux/types";

import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import Sketch from "@arcgis/core/widgets/Sketch";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import * as projection from "@arcgis/core/geometry/projection.js";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import FeatureEffect from "@arcgis/core/layers/support/FeatureEffect.js";
import * as colorRendererCreator from "@arcgis/core/smartMapping/renderers/color";

import { arcgisToGeoJSON, geojsonToArcGIS } from "@terraformer/arcgis"
import { geojsonToWKT, wktToGeoJSON } from "@terraformer/wkt";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import esriConfig from "@arcgis/core/config";
import Color from "@arcgis/core/Color.js";
import Spinner2 from "../common/Spinner2";


import { IBaseMapConfig, AoIBaseMapConfig } from "./config/BaseMapConfig";
import LayerIds from "./config/layers/LayerIds";

import { INIT_MAP, NEW_AOI, NEW_PROJECT, setFeaturesForStatistics } from "./redux/esri";

import "../../App.css";


import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import geometry, { Polygon, SpatialReference } from "@arcgis/core/geometry";
import Graphic from "@arcgis/core/Graphic";
import { fetchSubscriptionData } from "../store/actions/subscription-settings-actions";
import Renderers from "./config/carto/Renderers";
import FieldNames from "./config/layers/FieldNames";

import { hideSiteLoader, showSiteLoader } from "../store/actions/modal-actions";
import { current } from "@reduxjs/toolkit";
import FilterPanel from "./FilterPanel";
import { fetchAoiList, fetchAoiStats } from "../store/actions/aoi-actions";
import { AoiListObject, CountyStatObject } from "../models/redux-models";
import { drillTypeOption, productType, wellStatusOption, wellTypeOption } from "../cartBasinToCounty/CartBasinConstant";
import { SET_FILTER, SetPanelFilter, UpdateCountyTotals } from "./redux/filters";
import { handleSelectedRowId, setFilterSearch } from "../store/actions/wells-rigs-action";
import { filter } from "jszip";
import BaseLayers from "./config/layers/BaseLayers";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";


esriConfig.apiKey = "AAPKad271667aba042c885255b4c97abdac99pBQjXeF5J2KCvXu8cWW5nzqH_KNCSVAffm69AJVtKgly9rCVRwVY_VtVe3v1pGF";
esriConfig.assetsPath = "/static/home/js/map/assets";
let webmap: WebMap;
let mapview: MapView;
let countyLayerView: __esri.FeatureLayerView;
let wellsLayerView: __esri.FeatureLayerView;

const defaultQuery = "1=1";

interface IHighlight {
    attributes: any,
    remove: any
}

interface ISubscriptionMapData {
    type: number,
    name: string,
    state: string
}

interface IAoIMapProps {
    allowCreateAoI: boolean;
}

function AoIMap(props: IAoIMapProps) {
    const { allowCreateAoI } = props;
    const dispatch = useAppDispatch();
    const aoiMapDiv = useRef(null);
    const [config, setConfig] = useState({});
    const [mapSet, setMapSet] = useState(false);
    const [layersLoaded, setLayersLoaded] = useState(false);
    const [wellLayerLoaded, setWellLayerLoaded] = useState(false);
    const [screenPoint, setScreenPoint] = useState({});
    const prevScreenPoint = useRef({});
    const [highlights, setHighlights] = useState<IHighlight[]>([]);
    const [selectedHighlight, setSelectedHighlight] = useState<IHighlight | null>(null);
    const [currentConfirmSketch, setCurrentConfirmSketch] = useState<Graphic>();
    const [currentSubscriptions, setCurrentSubscriptions] = useState<ISubscriptionMapData[]>([]);
    const [subscriptionQuery, setSubscriptionQuery] = useState<string>('')
    const [wellDataQuery, setWellDataQuery] = useState<string>('')
    const [saveCurrentType, setSaveCurrentType] = useState('');
    const [sketchTool, setSketchTool] = useState<Sketch>()
    const [showZoomMessage, setShowZoomMessage] = useState<Boolean>(true);
    const [currentWellIds, setCurrentWellIds] = useState<[string]>();
    const [popupOpen, setPopupOpen] = useState(false);
    const [countiesLoaded, setCountiesLoaded] = useState(false);
    const [mapLoading, setMapLoading] = useState(true);
    const [popupSelectedIndex, setPopupSelectedIndex] = useState(0);
    const [featuresUpdated, setFeaturesUpdated] = useState(false);

    const {
        aoi: { aoiDataLoading, savedAoiData },
        auth: {
            user: { access_token },
        },
        esri: { featuresForStatistics },
        filters: { layers, panelFilters, countyTotals },
        locations: { selectedType, selectedFeature },
        wellsAndRigs: { selectedRowId, wellsData: { data: wellsDataList }, selectedAoiData, showTableLoader, downloadCol },
        subscriptionSettings: { loadSubscriptionData, subscriptionData },
    } = useAppSelector((state) => state);

    useEffect(() => {
        if (aoiMapDiv.current) {
            /**
             * Initialize config
             */
            setConfig(new AoIBaseMapConfig());
        }
    }, []);

    useEffect(() => {
        aoiDataLoading &&
            dispatch(
                // fetchAoiList(access_token, intialRef.current ? false : true)
                fetchAoiList(access_token, false)
            );
        // eslint-disable-next-line
    }, [aoiDataLoading]);

    useEffect(() => {
        if (layersLoaded) {
            const aoiLayer: any = webmap.layers.find((l: { id: string; }) => l.id === LayerIds.AoIData);
            if (aoiLayer) {
                const sym = { type: 'simple-fill', color: "#16A15E" };
                aoiLayer.removeAll();
                savedAoiData.forEach((item: AoiListObject) => {
                    const geoJson = wktToGeoJSON(item.geom);
                    const geom: any = geojsonToArcGIS(geoJson)
                    const g = new Graphic({
                        attributes: {
                            well_count: item.well_count,
                            permit_count: item.permit_count,
                            completion_count: item.completion_count,
                            operator_count: item.operator_count,
                            name: item.aoi_name,
                            id: item.id
                        },
                        geometry: { ...geom, type: 'polygon' },
                        symbol: sym
                    })
                    //@ts-ignore
                    g.popupTemplate = aoiDataTemplate;
                    aoiLayer.graphics.push(g);
                })
            }
        }
    }, [savedAoiData, layersLoaded]);

    useEffect(() => {
        if (layersLoaded && selectedAoiData) {
            console.log('Aoi ID: ' + selectedAoiData.aoi_id);
            if (selectedAoiData.aoi_id > 0) {
                const aoiLayer: any = webmap.layers.find((l: { id: string; }) => l.id === LayerIds.AoIData);
                if (aoiLayer) {
                    const aoi = aoiLayer.graphics.find((g: Graphic) => g.getAttribute('id') === selectedAoiData.aoi_id);
                    if (aoi) {
                        mapview.goTo(aoi);
                        setLayerEffectFilter(new FeatureEffect({
                            filter: {
                                geometry: aoi.geometry,
                                spatialRelationship: "intersects"
                            },
                            excludedEffect: "grayscale(100%) opacity(30%)"
                        }), LayerIds.WellData);
                        setLayerEffectFilter(new FeatureEffect({
                            filter: {
                                geometry: aoi.geometry,
                                spatialRelationship: "intersects"
                            },
                            excludedEffect: "grayscale(100%) opacity(30%)"
                        }), LayerIds.RigsData);
                        setLayerEffectFilter(new FeatureEffect({
                            filter: {
                                geometry: aoi.geometry,
                                spatialRelationship: "intersects"
                            },
                            excludedEffect: "grayscale(100%) opacity(30%)"
                        }), LayerIds.LateralLines);
                    }
                }
            } 
        }

    }, [selectedAoiData]);


    useEffect(() => {
        const noAoI = !selectedAoiData || selectedAoiData.aoi_id == 0;
        const noCurrentWells = !currentWellIds || currentWellIds.length < 1;

        if (noAoI && noCurrentWells && !popupOpen) {
            resetEffectedWells();
        }
        
    }, [selectedAoiData, currentWellIds, popupOpen]);

    // useEffect(() => {
    //     if (!wellsDataList || wellsDataList?.length == 0) {
    //         setMapLoading(true);
    //     }
    //     if (mapLoading) {
    //         setMapLoading(false)
    //     }
    // }, [wellsDataList])

    useEffect(() => {
        if ((!downloadCol && showTableLoader) || !countiesLoaded) {
            //console.log("loading");
            setMapLoading(true);
        }
        if (mapLoading && !downloadCol && !showTableLoader && countiesLoaded) {
            //console.log("done");
            setMapLoading(false);
        }
    }, [showTableLoader, countiesLoaded])

    useEffect(() => {
        if (popupOpen) {
            let aoi: any;
            const aoiIndex = mapview.popup.features.findIndex((f) => f.layer.id === LayerIds.AoIData || f.getAttribute('title') === 'Area of Interest Statistics')
            if (aoiIndex > -1) {
                aoi = mapview.popup.features[aoiIndex];
            }   
            const tmpFeature = mapview.popup.features && mapview.popup.features.length > 0
                ? mapview.popup.features[mapview.popup.selectedFeatureIndex].getAttribute('uid')
                : "";
            const featureSelected = selectedFeature && selectedFeature.length > 0 && (!featuresUpdated || tmpFeature === selectedFeature)
            const currentFeature =  featureSelected
                ? selectedFeature
                : tmpFeature
            //Single feature selected
            if (currentFeature && currentFeature !== "") {
                if (!featureSelected && currentFeature !== featuresForStatistics[0]) {
                    dispatch(setFeaturesForStatistics({ features: [currentFeature] }));
                }
                if (aoiIndex > -1) {
                    setLayerEffectFilter(new FeatureEffect({
                        filter: {
                            geometry: aoi.geometry,
                            spatialRelationship: "intersects"
                        },
                        excludedEffect: "grayscale(100%) opacity(30%)"
                    }), LayerIds.WellData);
                    setLayerEffectFilter(new FeatureEffect({
                        filter: {
                            geometry: aoi.geometry,
                            spatialRelationship: "intersects"
                        },
                        excludedEffect: "grayscale(100%) opacity(30%)"
                    }), LayerIds.RigsData);
                    setLayerEffectFilter(new FeatureEffect({
                        filter: {
                            geometry: aoi.geometry,
                            spatialRelationship: "intersects"
                        },
                        excludedEffect: "grayscale(100%) opacity(30%)"
                    }), LayerIds.LateralLines);
                } else {
                    setLayerEffectFilter(new FeatureEffect({
                        filter: {
                            where: "uid in ('" + currentFeature + "')"
                        },
                        excludedEffect: "grayscale(100%) opacity(30%)"
                    }), LayerIds.WellData);
                    setLayerEffectFilter(new FeatureEffect({
                        filter: {
                            where: "uid in ('" + currentFeature + "')"
                        },
                        excludedEffect: "grayscale(100%) opacity(30%)"
                    }), LayerIds.RigsData);
                    setLayerEffectFilter(new FeatureEffect({
                        filter: {
                            where: "uid in ('" + currentFeature + "')"
                        },
                        excludedEffect: "grayscale(100%) opacity(30%)"
                    }), LayerIds.LateralLines);
                }
            } else {
                if (aoi) {
                    setLayerEffectFilter(new FeatureEffect({
                        filter: {
                            geometry: aoi.geometry,
                            spatialRelationship: "intersects"
                        },
                        excludedEffect: "grayscale(100%) opacity(30%)"
                    }), LayerIds.WellData);
                    setLayerEffectFilter(new FeatureEffect({
                        filter: {
                            geometry: aoi.geometry,
                            spatialRelationship: "intersects"
                        },
                        excludedEffect: "grayscale(100%) opacity(30%)"
                    }), LayerIds.RigsData);
                    setLayerEffectFilter(new FeatureEffect({
                        filter: {
                            geometry: aoi.geometry,
                            spatialRelationship: "intersects"
                        },
                        excludedEffect: "grayscale(100%) opacity(30%)"
                    }), LayerIds.LateralLines);
                    const wLayer: any = webmap.layers.find((l: { title: string; }) => l.title === LayerIds.WellData);
                    const lLayer: any = webmap.layers.find((l: { title: string; }) => l.title === LayerIds.LateralLines);
                    //const rLayer:any = webmap.layers.find((l: { title: string; }) => l.title === LayerIds.RigsData);
                    const query = {
                        where: wellDataQuery,
                        geometry: aoi.geometry,
                        spatialRelationship: "intersects",
                        returnGeometry: false,
                        outFields: ["uid"],
                    }
                    Promise.all([wLayer.queryFeatures(query), lLayer.queryFeatures(query)])//,rLayer.queryFeatures(query)])
                        .then((results) => {
                            let wellIds: any = [];
                            // set graphic location to mouse pointer and add to mapview
                            results.forEach((featureSet: { features: [{ attributes: { uid: string } }] }) => {
                                if (featureSet.features.length > 0) {
                                    //@ts-ignore
                                    wellIds = [...new Set([...wellIds, ...featureSet.features.map((f) => f.attributes.uid)])];
                                }
                            });
                            dispatch(setFeaturesForStatistics({ features: wellIds }));
                        })
                        .finally(() => {
                            setMapLoading(false);
                        })
                }
            }
        } else {
            if (selectedRowId) {
                dispatch(handleSelectedRowId(0))
            }
            setCurrentConfirmSketch(undefined);
            if (mapview && mapview.popup && mapview.popup.features && mapview.popup.features.length > 0) {
                const aoi = mapview.popup.features.find((f) => f.getAttribute('title') === 'Area of Interest Statistics')
                if (aoi) {
                    const gLayer = aoi.layer as GraphicsLayer
                    if (gLayer) {
                        gLayer.removeAll();
                    }
                }
            }
        }
        setFeaturesUpdated(false);
    }, [popupOpen, popupSelectedIndex, featuresUpdated]);

    useEffect(() => { 
        //Check for updated filter properties...
        if (panelFilters && panelFilters.hasOwnProperty(FieldNames.queryPanelKeys[0])) {
            const renderers = getCurrentRenderers(panelFilters);
            const filterAllIfEmpty = false;
            if (layers) {
                const filters = []
                //console.log('changing legend...');
                filters.push({ layerId: LayerIds.WellData, filterAllIfEmpty, value: renderers, field: FieldNames.wellDataPointsTypeId });

                //console.log('updating filters');
                FieldNames.queryPanelKeys.forEach((panelKey, i) => {
                    if (panelKey in panelFilters) {
                        const formattedList = panelFilters[panelKey].map((filterValue: string) => {
                            const idxs = filterValue.split("");
                            return idxs.map((c: string, i) => {
                                return i == 0
                                    ? c.toUpperCase()
                                    : [' ', '-', '_', '/'].includes(idxs[i - 1])
                                        ? c.toUpperCase()
                                        : c
                            }).join("");
                            //return filterValue.charAt(0).toUpperCase() + filterValue.slice(1);

                        });
                        filters.push({ layerId: LayerIds.WellData, filterAllIfEmpty, value: formattedList, field: FieldNames.panelKeyMatch[i] })
                    } else {
                        filters.push({ layerId: LayerIds.WellData, filterAllIfEmpty, value: [], field: FieldNames.panelKeyMatch[i] });
                    }
                });
                dispatch(SET_FILTER(filters));
            }
        }
    }, [panelFilters])

    const getCurrentRenderers = (values: any) => {
        const allFilterValues = Renderers.wellsByTypeRenderer.uniqueValueInfos
        //const panelFilters:string[] = [];

        const prodType = allFilterValues.filter((opt) => values['production_type'] &&
            values['production_type'].find((v: string) => v.toLowerCase() == opt.label.toLowerCase())).map((opt) => opt.value);

        const drillType = allFilterValues.filter((opt) => values['drill_type'] &&
            values['drill_type'].find((v: string) => v.toLowerCase().indexOf(opt.label.toLowerCase()) > -1)).map((opt) => opt.value);
        //panelFilters.push("drill_type in ('" + values['drill_type'].join("','") + "')");

        const wellTypes = allFilterValues.filter((opt) => values['well_type'] &&
            values['well_type'].find((v: string) => v.toLowerCase().indexOf(opt.label.toLowerCase()) > -1)).map((opt) => opt.value);
        //panelFilters.push("well__type in ('" + values['well_type'].join("','") + "')");

        if (values['well_type'] && values['well_type'].includes('production')) {
            if (prodType.includes(1)) wellTypes.push(1)
            if (prodType.includes(2)) wellTypes.push(2)
            if (prodType.includes(3)) wellTypes.push(3)
        }

        const wellStatus = allFilterValues.filter((opt) => values['well_status'] &&
            values['well_status'].find((v: string) => {
                if (v.toLowerCase() === opt.label.toLowerCase())
                    return true;
                else {
                    if (opt.label.toLowerCase().indexOf(v.toLowerCase()) > -1) {
                        const remain = opt.label.toLowerCase().replace(v.toLowerCase(), "").trim();
                        return (values['production_type'] && values['production_type'].find((p: string) =>
                            p.toLowerCase() == remain.toLowerCase().replace("/", "_")))
                    }
                    if ((v.toLowerCase()) == 'inactive' && opt.label.toLowerCase().indexOf('shut-in') > -1) {
                        const remain = opt.label.toLowerCase().replace("shut-in", "").trim();
                        return (values['production_type'] && values['production_type'].find((p: string) =>
                            p.toLowerCase() == remain.toLowerCase().replace("/", "_")))
                    }
                    return false;
                }
            })
        ).map((opt) => opt.value);
        //panelFilters.push("well_status in ('" + values['well_status'].join("','") + "')");
        const allTypes = [...wellTypes, ...drillType, ...wellStatus];
        if (allTypes.length > 0) {
            return [...allTypes, -100];
        }
        return Renderers.wellsByTypeRenderer.uniqueValueInfos.map(v => v.value);
    }

    useEffect(() => {
        if (!layersLoaded) {
            return;
        }
        if (!layers || !layers[LayerIds.WellData] || !layers[LayerIds.WellData][FieldNames.wellDataPointsTypeId]) {
            return;
        }
        const formData: any = {}
        const renderers = getCurrentRenderers(panelFilters);
        if ([...layers[LayerIds.WellData][FieldNames.wellDataPointsTypeId]].sort().join(',') === renderers.sort().join(',')) {
            return;
        }
        const labelsSelected = Renderers.wellsByTypeRenderer.uniqueValueInfos.filter((info) => {
            return layers[LayerIds.WellData][FieldNames.wellDataPointsTypeId].indexOf(info.value) > -1
        }).map((info) => info.label);
        const wellTypes = wellTypeOption.filter((opt) => labelsSelected.includes(opt.value))
        if (wellTypes) {
            formData['well_type'] = wellTypes.map((wt) => wt.value);
        }
        const wellStatus = wellStatusOption.filter((opt) => labelsSelected.includes(opt.value))
        if (wellStatus) {
            formData['well_status'] = wellStatus.map((wt) => wt.value);
        }
        const drillType = drillTypeOption.filter((opt) => labelsSelected.includes(opt.value))
        if (drillType) {
            formData['drill_type'] = drillType.map((wt) => wt.value);
        }
        const prod_type = productType.filter((opt) => labelsSelected.includes(opt.value))
        if (prod_type) {
            formData['production_type'] = prod_type.map((wt) => wt.value);
        }
        //('changing left panel..');
        dispatch(SetPanelFilter(formData));
    }, [layers]);

    useEffect(() => {
        if (access_token && loadSubscriptionData) {
            dispatch(fetchSubscriptionData(access_token));
        }
    }, [access_token, loadSubscriptionData])

    useEffect(() => {
        if (countyLayerView) {
            switch (selectedType) {
                case BASINS:
                    //console.log("basins!");
                    mapview.layerViews.forEach((lv: { layer: { title: string; }; visible: boolean; }) => {
                        lv.layer.title === LayerIds.BasinStats ? lv.visible = true : lv.visible = false;
                    })
                    break;
                case COUNTIES:
                    //console.log("counties!");
                    mapview.layerViews.forEach((lv: { layer: { title: string; }; visible: boolean; }) => {
                        lv.layer.title === LayerIds.CountyStats ? lv.visible = true : lv.visible = false;
                    })
                    break;
            }
        }
    }, [selectedType]);

    useEffect(() => {
        //@ts-ignore
        if (config !== null && config.mapConfig && !mapSet && subscriptionQuery.length > 0) {
            setMapSet(true);
            //@ts-ignore
            const { mapConfig } = config;
            webmap = new WebMap({
                portalItem: {
                    id: mapConfig.webMapId
                }
            });

            const graphicsLayer = new GraphicsLayer();
            webmap.add(graphicsLayer);

            const aoiGraphicsLayer = new GraphicsLayer({ id: LayerIds.AoIData });
            webmap.add(aoiGraphicsLayer, webmap.layers.length - 1);

            const selectedFeaturesGraphicsLayer = new GraphicsLayer({ id: LayerIds.SelectedFeatures });
            webmap.add(selectedFeaturesGraphicsLayer);

            mapview = new MapView({
                container: aoiMapDiv.current == null ? undefined : aoiMapDiv.current,
                map: webmap,
            });

            mapview.ui.move("zoom", "top-right");

            mapview.on("layerview-create", function (event) {
                //console.log(event.layer);
                if (event.layer.title === LayerIds.WellData) {
                    wellsLayerView = event.layerView as __esri.FeatureLayerView;
                    wellsLayerView.highlightOptions = {
                        color: new Color("#0000ff"),
                        haloOpacity: 0.9,
                        fillOpacity: 0.2
                    };
                    setWellLayerLoaded(true);
                }
                if (event.layer.title === LayerIds.CountyStats) {
                    countyLayerView = event.layerView as __esri.FeatureLayerView;
                }
            });

            reactiveUtils.watch(
                () => mapview.zoom,
                () => {
                    const countyLayer: FeatureLayer = webmap.layers.find((l: { title: string; }) => l.title === LayerIds.CountyStats) as FeatureLayer;
                    const countyGraphicsLayer: FeatureLayer = webmap.layers.find((l: { title: string; }) => l.title === LayerIds.CountyStatsGraphic) as FeatureLayer;
                    if (countyLayer && countyGraphicsLayer) {
                        if (mapview.scale > countyLayer.maxScale) {
                            countyGraphicsLayer.visible = true;
                            countyGraphicsLayer.popupEnabled = true;
                            setShowZoomMessage(true)
                        } else {
                            countyGraphicsLayer.visible = false;
                            countyLayer.visible = false;
                            countyGraphicsLayer.popupEnabled = false;
                            countyLayer.popupEnabled = false;
                            setShowZoomMessage(false)
                        }
                    }
                }
            );

            reactiveUtils.watch(
                () => mapview.popup.visible,
                (visible) => {
                    if (visible) {
                        setPopupOpen(true);
                    } else {
                        setPopupOpen(false);
                    }
                }
            );
            reactiveUtils.watch(
                () => mapview.popup.selectedFeatureIndex,
                (selectedFeatureIndex) => {
                    setFeaturesUpdated(true);
                    setPopupSelectedIndex(selectedFeatureIndex);
                }
            );
            reactiveUtils.watch(
                () => mapview.popup.features,
                (features) => {
                    if (features && features.length > 0) {
                        setFeaturesUpdated(true);
                        if (features.length > 1) {
                            mapview.popup.selectedFeatureIndex = 1;
                        }
                    }
                }
            );



            const countyGraphicsLayer = BaseLayers.getCountyGraphicsLayer();
            countyGraphicsLayer.visible = false;

            mapview.map.layers.add(countyGraphicsLayer);

            mapview.on('click', (event: any) => {
                setScreenPoint(event);
            });

            webmap.when(() => {
                console.log("loaded");
                dispatch(INIT_MAP({ map: webmap, mapview }));
                //console.log('setting legend...');
                //allowCreateAoI signfies that the aoi page has been loaded first...
                if (allowCreateAoI) {
                    const allIds = Renderers.wellsByTypeRenderer.uniqueValueInfos.map(v => v.value);
                    dispatch(SET_FILTER([{ layerId: LayerIds.WellData, filterAllIfEmpty: false, value: allIds, field: FieldNames.wellDataPointsTypeId }]))
                }
        
                const layers = webmap.layers
                    .filter(layer => { return layer.type === 'feature' })
                    .map(layer => {
                        let featLayer: FeatureLayer = layer as FeatureLayer;
                        featLayer.outFields = ['*'];
                        const isPoint = featLayer.title === LayerIds.WellData
                        if (isPoint || featLayer.title === LayerIds.LateralLines) {
                            featLayer.definitionExpression = wellDataQuery
                            if (isPoint) {
                                //@ts-ignore
                                featLayer.renderer = Renderers.wellsByTypeRenderer
                            }
                        } else {
                            featLayer.definitionExpression = subscriptionQuery
                        }
                        if (featLayer.title === LayerIds.RigsData) {
                            //@ts-ignore 
                            featLayer.renderer = Renderers.rigPointsRenderer;
                        }
                        return featLayer;
                    });

                const sketch = new Sketch({
                    layer: graphicsLayer,
                    view: mapview,
                    creationMode: "single",
                    availableCreateTools: ["polygon", "circle", "rectangle"],
                    visibleElements: {
                        createTools: { point: false, polyline: false },
                        duplicateButton: false,
                        selectionTools: { "lasso-selection": false },
                        settingsMenu: false
                    }
                });
                sketch.on("create", function (event) {
                    if ((event.state === "start") || (event.state === "cancel")) {
                        graphicsLayer.removeAll();
                        setCurrentConfirmSketch(undefined);
                    }
                    if (event.state === "complete") {
                        //if (!allowCreateAoI) { 
                        //    setCurrentConfirmSketch(event.graphic);
                        //    return;
                        //}
                        //@ts-ignore

                        setCurrentConfirmSketch(event.graphic);
                        //}); 
                    }

                })
                sketch.on('delete', function (event) {
                    mapview.popup.close();
                    setCurrentConfirmSketch(undefined);
                })

                reactiveUtils.on(() =>
                    mapview.popup,
                    'trigger-action',
                    function (event) {
                        setSaveCurrentType(event.action.id);
                    }
                );
                mapview.ui.add(sketch, 'top-right');
                setSketchTool(sketch)

                setLayersLoaded(true);
            });
        }
    }, [config, subscriptionQuery]);

    useEffect(() => {
        if (currentConfirmSketch) {
            const poly = currentConfirmSketch.geometry as Polygon

            //query for features
            const wLayer: any = webmap.layers.find((l: { title: string; }) => l.title === LayerIds.WellData);
            const lLayer: any = webmap.layers.find((l: { title: string; }) => l.title === LayerIds.LateralLines);
            //const rLayer:any = webmap.layers.find((l: { title: string; }) => l.title === LayerIds.RigsData);
            //const lLayer:any = webmap.layers.find((l: { title: string; }) => l.title === LayerIds.LateralLines);
            //if (!wLayer || !wLayer.hasOwnProperty(queryFeatures)) return;
            const query = {
                //query object
                where: wellDataQuery,
                geometry: currentConfirmSketch.geometry,
                spatialRelationship: "intersects",
                returnGeometry: false,
                outFields: ["uid"],
            }
            dispatch(showSiteLoader());
            Promise.all([wLayer.queryFeatures(query), lLayer.queryFeatures(query)])//,rLayer.queryFeatures(query)])
                .then((results) => {
                    let wellIds: any = [];
                    // set graphic location to mouse pointer and add to mapview
                    results.forEach((featureSet: { features: [{ attributes: { uid: string } }] }) => {
                        if (featureSet.features.length > 0) {
                            //@ts-ignore
                            wellIds = [...new Set([...wellIds, ...featureSet.features.map((f) => f.attributes.uid)])];
                        }
                    });
                    setCurrentWellIds(wellIds);
                    //@ts-ignore
                    currentConfirmSketch.popupTemplate = confirmDataTemplate;
                    let outSpatialReference = new SpatialReference({
                        wkid: 4326 //Sphere_Sinusoidal projection
                    });
                    const tmpWGS84 = projection.project(currentConfirmSketch.geometry, outSpatialReference) as __esri.Geometry;
                    const geoJson = arcgisToGeoJSON(tmpWGS84)
                    const wkt = geojsonToWKT(geoJson)
                    dispatch(
                        fetchAoiStats(access_token, { geometry: wkt })
                    ).then((result: any) => {
                        if (result.msg == 'success') {
                            currentConfirmSketch.attributes = { ...result.data }
                            currentConfirmSketch.attributes.title = "Area of Interest Statistics"
                        } else {
                            currentConfirmSketch.attributes = {}
                            currentConfirmSketch.attributes.title = "AOI contains no data returned"
                        }
                        mapview.openPopup({ features: [currentConfirmSketch], location: poly.centroid });
                    })
                        .finally(() => {
                            dispatch(hideSiteLoader());
                        });
                })
                .catch((err) => {
                    setCurrentWellIds(undefined);
                })
        } else {
            setCurrentWellIds(undefined);
        }
    }, [currentConfirmSketch])

    useEffect(() => {
        if (!subscriptionData) return;
        let tmpSubs: ISubscriptionMapData[] = [];
        const { details } = subscriptionData;
        details.forEach((item) => {
            tmpSubs.push({ type: item.line_item_type, name: item.line_item_name, state: item.state_code });
        });
        setCurrentSubscriptions(tmpSubs);
    }, [subscriptionData])

    useEffect(() => {
        if (currentConfirmSketch) {
            let outSpatialReference = new SpatialReference({
                wkid: 4326 //Sphere_Sinusoidal projection
            });
            const tmpWGS84 = projection.project(currentConfirmSketch.geometry, outSpatialReference) as __esri.Geometry;
            if (saveCurrentType === 'aoi') {
                if (currentConfirmSketch) {
                    const geoJson = arcgisToGeoJSON(tmpWGS84.toJSON())
                    dispatch(NEW_AOI({ geojson: geoJson, crs: tmpWGS84.spatialReference.wkid }));
                    setSaveCurrentType('');
                    mapview.popup.close();
                }
            }
            if (saveCurrentType === 'projects') {
                if (currentConfirmSketch) {
                    const geoJson = arcgisToGeoJSON(tmpWGS84.toJSON())
                    dispatch(NEW_PROJECT({ geojson: geoJson, crs: tmpWGS84.spatialReference.wkid }));
                    setSaveCurrentType('');
                    mapview.popup.close();
                }
            }
        }
    }, [saveCurrentType])

    useEffect(() => {
        if (screenPoint !== prevScreenPoint.current && mapSet)
            handleMapClick(screenPoint);
        prevScreenPoint.current = screenPoint;
    }, [screenPoint]);

    useEffect(() => {
        if (!layersLoaded) {
            return;
        }
        if (currentWellIds && currentWellIds.length > 1) {
            dispatch(setFeaturesForStatistics({ features: currentWellIds }));
            setLayerEffectFilter(new FeatureEffect({
                //@ts-ignore
                filter: { where: "uid IN ('" + currentWellIds.join("','") + "')" },
                excludedEffect: "grayscale(100%) opacity(30%)"
            }), LayerIds.WellData);
            setLayerEffectFilter(new FeatureEffect({
                //@ts-ignore
                filter: { where: "uid IN ('" + currentWellIds.join("','") + "')" },
                excludedEffect: "grayscale(100%) opacity(30%)"
            }), LayerIds.LateralLines);
            setLayerEffectFilter(new FeatureEffect({
                //@ts-ignore
                filter: { where: "uid IN ('" + currentWellIds.join("','") + "')" },
                excludedEffect: "grayscale(100%) opacity(30%)"
            }), LayerIds.RigsData);
        }
    }, [currentWellIds, layersLoaded]);

    useEffect(() => {
        if (wellLayerLoaded && selectedFeature && selectedFeature.length > 0) {
            console.log('zooming to location of ' + selectedFeature);
            const query =
            {
                //query object
                where: "",
                returnGeometry: true,
                outFields: ["*"],
            }
            const wLayer: any = webmap.layers.find((l: { title: string; }) => l.title === LayerIds.WellData);
            //const rLayer:any = webmap.layers.find((l: { title: string; }) => l.title === LayerIds.RigsData);
            //Well Id is a float, query requires the .0 to work properly as well Id returns as an int from the api
            const wellClause = "uid = '" + selectedFeature + "'";
            query.where = wellClause;
            dispatch(showSiteLoader());
            Promise.all([wLayer.queryFeatures(query)])//,rLayer.queryFeatures(query)])
                .then((results: any) => {
                    results.forEach((featureSet: { features: [any] }) => {
                        if (config && config.hasOwnProperty("mapConfig")) {
                            //@ts-ignore
                            const { mapConfig } = config;
                            mapview.goTo({
                                target: featureSet.features[0].geometry,
                                zoom: mapConfig.highlightZoom
                            });
                            mapview.openPopup({
                                location: featureSet.features[0].geometry,
                                features: featureSet.features
                            })
                        }
                        if (featureSet.features.length > 0) {
                            const h = wellsLayerView.highlight(featureSet.features);
                            setSelectedHighlight({ attributes: featureSet.features[0].attributes, remove: h.remove });
                        }
                        dispatch(hideSiteLoader());
                    })
                })
                .catch(() => {
                    dispatch(hideSiteLoader());
                });
        } else {
            if (selectedHighlight !== null) {
                selectedHighlight.remove();
                mapview.closePopup();
                setSelectedHighlight(null);
            }
        }
    }, [selectedFeature, wellLayerLoaded]);

    useEffect(() => {
        if (!loadSubscriptionData) {
            let query = defaultQuery;
            if (currentSubscriptions && currentSubscriptions.length > 0) {

                const basins = currentSubscriptions.filter((cs) => cs.type === 1);
                const basinsClause = basins.length > 0 ? (basins.map((ab: ISubscriptionMapData) =>
                    FieldNames.countyStatsBasinName + " = '" + ab.name + "'")).join(" OR ") : "1=0";

                const counties = currentSubscriptions.filter((cs) => cs.type === 2);
                const countyClause = counties.length > 0
                    ? (counties.map((ab: ISubscriptionMapData) =>
                        "(" + FieldNames.countyStatsBasinName + " = '" + ab.name + "' AND " +
                        FieldNames.countyStatsStateAbbr + " = '" + ab.state + "')")).join(" OR ")
                    : "1=0";


                query = "(" + countyClause + ") OR (" + basinsClause + ")";
            }
            setSubscriptionQuery(query)
            const reg1 = new RegExp(FieldNames.countyStatsBasinName, "g")
            const reg2 = new RegExp(FieldNames.countyStatsStateAbbr, "g")
            const reg3 = new RegExp(FieldNames.countyStatsCountyName, "g")
            if (query === defaultQuery) {
                setWellDataQuery("1=0");
            } else {
                setWellDataQuery(query.replace(reg1, FieldNames.wellPointsBasin)
                    .replace(reg2, FieldNames.wellPointsStateAbbr)
                    .replace(reg3, FieldNames.wellPointsCounty))
            }
        }
    }, [currentSubscriptions, loadSubscriptionData]);

    useEffect(() => {
        if (layersLoaded) {
            webmap.layers
                .filter(layer => { return layer.type === 'feature' })
                .map(layer => {
                    let featLayer: FeatureLayer = layer as FeatureLayer;
                    const isPoint = featLayer.title === LayerIds.WellData
                    if (isPoint || featLayer.title === LayerIds.LateralLines) {
                        featLayer.definitionExpression = wellDataQuery
                        if (isPoint) {
                            //@ts-ignore
                            featLayer.renderer = Renderers.wellsByTypeRenderer
                        }
                    } else {
                        featLayer.definitionExpression = subscriptionQuery
                        if (featLayer.title == LayerIds.CountyStats) {
                            const wLayer: FeatureLayer = webmap.layers.find((l: { title: string; }) => l.title === LayerIds.CountyStatsGraphic) as FeatureLayer;
                            wLayer.renderer = featLayer.renderer;
                            wLayer.popupTemplate = featLayer.popupTemplate;
                            wLayer.popupEnabled = true;
                            featLayer.queryFeatures().then((featureSet) => {
                                updateCountyGraphics(featureSet.features);
                            })
                        }
                    }
                    if (featLayer.title === LayerIds.RigsData) {
                        //@ts-ignore
                        featLayer.renderer = Renderers.rigPointsRenderer;
                    }
                    return featLayer;
                });
            }
    }, [layersLoaded, subscriptionQuery]);

    useEffect(() => {
        if (countyTotals && layersLoaded && countiesLoaded) {
            if (countyTotals.length > 0) {
                if (countyLayerView) {
                    countyLayerView.filter = new FeatureFilter({
                        where: "1=0"
                    });
                }
                const cBaseLayer = webmap.layers.find(layer => { return layer.title === LayerIds.CountyStats }) as FeatureLayer;
                const cLayer = webmap.layers.find(layer => { return layer.title === LayerIds.CountyStatsGraphic }) as FeatureLayer;
                if (cLayer) {
                    setMapLoading(true);
                    cLayer.renderer = cBaseLayer.renderer;
                    cLayer.queryFeatures().then((featureSet) => {
                        const features = featureSet.features;
                        const updates: Graphic[] = [];
                        features.forEach((f: Graphic) => {
                            const ct = countyTotals.find((ct: CountyStatObject) => {
                                return ct.county.toLowerCase() === f.getAttribute(FieldNames.countyStatsCountyName).toLowerCase() &&
                                    ct.state_abbr.toLowerCase() === f.getAttribute(FieldNames.countyStatsStateAbbr).toLowerCase();
                            })
                            if (ct) {
                                const jsonFeature = f.toJSON();
                                const g: Graphic = new Graphic({
                                    attributes: jsonFeature.attributes,
                                    geometry: { ...jsonFeature.geometry, type: 'polygon' }
                                });
                                g.attributes[FieldNames.countyWellTotals] = ct.total_wells;
                                updates.push(g);
                            } else {
                                const jsonFeature = f.toJSON();
                                const g: Graphic = new Graphic({
                                    attributes: jsonFeature.attributes,
                                    geometry: { ...jsonFeature.geometry, type: 'polygon' }
                                });
                                g.attributes[FieldNames.countyWellTotals] = 0;
                                updates.push(g);
                            }
                        });
                        if (updates.length > 0) {
                            cLayer.applyEdits({ updateFeatures: updates }).then((results) => {
                                if (!popupOpen && (!selectedAoiData || selectedAoiData.aoi_id === 0)) {
                                    zoomToCounties();
                                }
                            });
                        } else {
                            setMapLoading(false);
                        }

                    });
                }
            }
            const countyGraphicsLayerView = mapview.allLayerViews.find((lv) => lv.layer.title === LayerIds.CountyStatsGraphic);
            if (countyGraphicsLayerView) {
                countyGraphicsLayerView.visible = true;
            }
        }
    }, [countyTotals, layersLoaded, countiesLoaded]);

    const updateCountyGraphics = (features: Graphic[]) => {
        const updates: Graphic[] = [];
        const adds: Graphic[] = [];
        const wLayer: FeatureLayer = webmap.layers.find((l: { title: string; }) => l.title === LayerIds.CountyStatsGraphic) as FeatureLayer;
        const cLayer: FeatureLayer = webmap.layers.find((l: { title: string; }) => l.title === LayerIds.CountyStats) as FeatureLayer;
        if (wLayer) {
            wLayer.maxScale = cLayer.maxScale;
            wLayer.minScale = cLayer.minScale;
            wLayer.queryObjectIds().then((currentGraphicIds: number[]) => {
                features.forEach((graphic: Graphic) => {
                    currentGraphicIds.includes(graphic.getAttribute("OBJECTID"))
                        ? updates.push(graphic)
                        : adds.push(graphic);
                });
                // Esri color ramps - Blue 3
                // #eff3ffff,#bdd7e7ff,#6baed6ff,#3182bdff,#08519cff
                const colors = ["#eff3ffff", "#bdd7e7ff", "#6baed6ff", "#3182bdff", "#08519cff"];
                wLayer.applyEdits({ addFeatures: adds, updateFeatures: updates }).then((result) => {
                    // let colorParams = {
                    //     layer: wLayer,
                    //     view: mapview,
                    //     field: FieldNames.countyWellTotals,
                    //     classificationMethod: "standard-deviation",
                    //     colorScheme: {
                    //         id: 'county_graphic_color_ramp',
                    //         theme: 'high-to-low',
                    //         colorsForClassBreaks: {
                    //             colors: colors.map((c) => new Color(c)), numClasses: 5
                    //         }
                    //     }
                    // };
                    // // when the promise resolves, apply the renderer to the layer
                    // //@ts-ignore
                    // colorRendererCreator.createClassBreaksRenderer(colorParams)
                    // .then(function(response){
                    //     wLayer.renderer = response.renderer;
                    zoomToCounties();
                    setCountiesLoaded(true);
                    //});
                }).catch((ex) => {
                    console.log(ex)
                });
            })
        }
    }

    if (config === null) {
        return <div className="aoiMapDiv" ref={aoiMapDiv}></div>;
    }

    const setLayerEffectFilter = (filter: FeatureEffect, layerTitle: string) => {
        if (webmap && webmap.layers) {
            const wLayer: any = webmap.layers.find((l: { title: string; }) => l.title === layerTitle);
            if (wLayer) {
                console.log('setting filter :' + wLayer.title);
                (wLayer as __esri.FeatureLayer).featureEffect = filter;
            }
        }
    }

    const zoomToCounties = () => {
        if (mapview) {
            const zoomLayer: FeatureLayer = mapview.map.layers.find((l) => l.title === LayerIds.CountyStatsGraphic) as FeatureLayer;
            if (zoomLayer) {
                zoomLayer.queryExtent({ where: `${FieldNames.countyWellTotals} > 0` }).then((result: any) => {
                    console.log("zooming to result");
                    setTimeout(() => {
                        if (result.extent && result.extent !== null) {
                            const noZoom = result && result.height > 9;
                            const expand = noZoom ? 1.0 : 1.2;
                            mapview.goTo(result.extent.expand(expand))
                                .catch(function (error) {
                                    if (error.name !== "AbortError") {
                                        console.error(error);
                                    }
                                })
                                .finally(() => setMapLoading(false))
                        }
                    }, 500);
                })
                .catch(() => setMapLoading(false))
            }
        } else {
            setMapLoading(false);
        }
    }

    const saveAsAOI = {
        title: 'Save as AOI',
        id: 'aoi',
        className: 'esri-icon-map-pin'
    }

    const saveAsProjects = {
        title: 'Add to Projects',
        id: 'projects',
        className: 'esri-icon-collection'
    }

    const aoiDataTemplate = {
        content: [{ type: "fields" }],
        fieldInfos: [
            {
                fieldName: "well_count",
                visible: true,
                label: "Wells",
                format: {
                    places: 0,
                    digitSeparator: true
                }
            },
            {
                fieldName: "permit_count",
                visible: true,
                label: "Permits",
                format: {
                    places: 0,
                    digitSeparator: true
                }
            },
            {
                fieldName: "operator_count",
                visible: true,
                label: "Operator",
                format: {
                    places: 0,
                    digitSeparator: true
                }
            },
            {
                fieldName: "completion_count",
                visible: true,
                label: "Completion",
                format: {
                    places: 0,
                    digitSeparator: true
                }
            },

        ],
        title: "AOI: {name}"
    }

    const confirmDataTemplate = {
        actions: [saveAsAOI],
        content: [{ type: "fields" }],
        fieldInfos: [
            {
                fieldName: "well_count",
                visible: true,
                label: "Wells",
                format: {
                    places: 0,
                    digitSeparator: true
                }
            },
            {
                fieldName: "permit_count",
                visible: true,
                label: "Permits",
                format: {
                    places: 0,
                    digitSeparator: true
                }
            },
            {
                fieldName: "operator_count",
                visible: true,
                label: "Operator",
                format: {
                    places: 0,
                    digitSeparator: true
                }
            },
            {
                fieldName: "completion_count",
                visible: true,
                label: "Completion",
                format: {
                    places: 0,
                    digitSeparator: true
                }
            },

        ],
        title: "{title}"
    }

    const handleMapClick: any = (event: { preventDefault: () => void; }) => {
        const layerToQuery = mapview.scale > 150000 ? LayerIds.CountyStatsGraphic : LayerIds.WellData;
        const layer = webmap.layers.find((l: { title: string; }) => l.title === layerToQuery);
        queryFeatures(layer, event, "", [...highlights]);
        event.preventDefault();
    }

    const resetEffectedWells = () => {
        if (layersLoaded) {
            // if (wellsDataList && wellsDataList.length > 0) {
            //     const apis = [... new Set(wellsDataList.map((well) => well.uid))];
            //     setLayerEffectFilter(new FeatureEffect({
            //         filter: { where: "uid IN ('" + apis.join("','") +"')" },
            //         excludedEffect: "grayscale(100%) opacity(30%)"
            //     }));
            //     setLinesEffectFilter(new FeatureEffect({
            //         filter: { where: "uid in ('" + apis.join("','") +"')" },
            //         excludedEffect: "grayscale(100%) opacity(30%)"
            //     }));
            // } else {
            setLayerEffectFilter(new FeatureEffect(), LayerIds.WellData);
            setLayerEffectFilter(new FeatureEffect(), LayerIds.LateralLines);
            setLayerEffectFilter(new FeatureEffect(), LayerIds.RigsData);
            //}
        }
    }

    const showPopup: any = (r: any) => {
        if (r.results.length > 0) {
            const graphicHits = r.results?.filter(
                (hitResult: any) => hitResult.type === "graphic"
            );
            if (graphicHits.length === 0) {
                mapview.popup.visible = false;
                return;
            }
            const graphic = graphicHits[0].graphic;
            //console.log(graphic.attributes.OBJECTID);
            if (!mapview.popup.features || mapview.popup.features.length === 0
                || mapview.popup.features[0].attributes.OBJECTID !== graphic.attributes.OBJECTID) {
                mapview.openPopup({
                    location: graphic.geometry.centroid ? graphic.geometry.centroid : r.results[0].mapPoint,
                    features: [graphic]
                })
            } else {
                mapview.popup.visible = true;
            }
        } else {
            mapview.popup.visible = false;
        }
    }

    const queryFeatures = (layer: any, screenPoint: any, clause: string = "", tmpHighlights: IHighlight[]) => {
        if (!layer || layer.type != 'feature') return;
        const clauseQuery = clause.length > 0;
        const point = screenPoint !== null ? mapview.toMap(screenPoint) : null;
        const query = (!clauseQuery) ?
            {
                //query object
                geometry: point,
                spatialRelationship: "intersects",
                returnGeometry: false,
                outFields: ["*"],
            } :
            {
                //query object
                where: clause,
                returnGeometry: false,
                outFields: ["*"],
            }
        layer.queryFeatures(query)
            .then((featureSet: { features: any[]; }) => {
                
                // set graphic location to mouse pointer and add to mapview
                const features = featureSet.features;
                if (features.length === 0) {
                    return;
                }
                if (layer.title === LayerIds.CountyStatsGraphic && point !== null) {

                    mapview.openPopup({features: features, location: point});
                }
                //const featureAttributes = featureSet.features[0].attributes;

            });
    }

    const getZoomMessage = () => {
        if (showZoomMessage) {
            return <div className="zoomMessage">Zoom in to see wells</div>
        }
        return <div />
    }

    const tmpConfig: IBaseMapConfig = config as IBaseMapConfig;
    return (
        <div>
            {mapLoading ? <Spinner2 /> : <div />}
            <div className="aoiMapDiv" ref={aoiMapDiv} />
            <FilterPanel useFilter={false} useLegend={true} />
        </div>);
}

export default AoIMap;

