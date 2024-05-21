import React, { useRef, useEffect, useState } from "react";
import { BASINS, COUNTIES, UIPosition } from "./redux/types";
import { connect } from "react-redux";

import Expand from '@arcgis/core/widgets/Expand';
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import esriConfig from "@arcgis/core/config";
import Color from "@arcgis/core/Color.js";

import {IBaseMapConfig, BaseMapConfig} from "./config/BaseMapConfig";
import LayerIds from "./config/layers/LayerIds";
import FilterPanel from "./FilterPanel";

import { SET_BASINS, SET_COUNTIES } from "./redux/locations";
import { INIT_MAP } from "./redux/esri";
import {
    fetchSubscriptionData,
} from "../store/actions/subscription-settings-actions";

import "../../App.css";

import { colors } from "react-select/dist/declarations/src/theme";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { getBasinCountyDetails } from "../store/actions/cart-select-basin-county-actions";
import { BasinDetailsObject, CountyDetailsObject, subscriptionDataDetails } from "../models/redux-models";
import { remove } from "jszip";
import Viewpoint from "@arcgis/core/Viewpoint";
import subscriptionSettings from "../store/reducers/subscription-settings-slice";
import { current } from "@reduxjs/toolkit";
import { access } from "fs";
import { showSiteLoader, hideSiteLoader } from "../store/actions/modal-actions";



esriConfig.apiKey = "AAPKad271667aba042c885255b4c97abdac99pBQjXeF5J2KCvXu8cWW5nzqH_KNCSVAffm69AJVtKgly9rCVRwVY_VtVe3v1pGF";
esriConfig.assetsPath = "/static/home/js/map/assets";
let webmap: WebMap;
let mapview: MapView;
let countyLayerView: __esri.FeatureLayerView;
let basinLayerView: __esri.FeatureLayerView;

interface IHighlight {
    attributes: any,
    remove: any
}

interface ISubscriptionMapData {
    type: number,
    name: string,
    state: string
}

interface IMapProps {
    allowSelection: boolean;
}

function Map(props:IMapProps) {
    const { allowSelection }  = props;
    const dispatch = useAppDispatch();
    const mapDiv = useRef(null);
    const [config, setConfig] = useState({});
    const [mapSet, setMapSet] = useState(false);
    const [basinLayerLoaded, setBasinLayerLoaded] = useState(false); 
    const [countyLayerLoaded, setCountyLayerLoaded] = useState(false);
    const [layersLoaded, setLayersLoaded] = useState(false);
    const [screenPoint, setScreenPoint] = useState<any>({});
    const [currentEvent, setCurrentEvent] = useState({});
    const prevScreenPoint = useRef({});
    const [highlights, setHighlights] = useState<IHighlight[]>([])
    const [currentSubscriptions, setCurrentSubscriptions] = useState<ISubscriptionMapData[]>([]);
    const [subscriptionHighlights, setSubscriptionHighlights] = useState<IHighlight[]>([]);

    const {
        basins, counties, selectedType
    } = useAppSelector((state) => state.locations);

    const {
        auth: {
            user: { access_token },
        },
        cartSelectBasinCounty: {
            cartListItems
        },
        subscriptionSettings: { loadSubscriptionData, subscriptionData },
    } = useAppSelector((state) => state);

    useEffect(() => {
        if (mapDiv.current) {
            /**
             * Initialize config
             */
            setConfig(new BaseMapConfig());
        }
    }, []);

    useEffect(() => {
        if (access_token && loadSubscriptionData) {
            dispatch(fetchSubscriptionData(access_token));
        }
    }, [access_token, loadSubscriptionData])

    useEffect(() => {
        if (!subscriptionData) return;
        let tmpSubs:ISubscriptionMapData[] = [];
        const { details } = subscriptionData;
        details.forEach((item) => {
            tmpSubs.push({ type: item.line_item_type, name: item.line_item_name, state: item.state_code});
        });
        setCurrentSubscriptions(tmpSubs);
    }, [subscriptionData])

    useEffect(() => {
        if (basins.length === 0 && basinLayerView) {
            highlights.forEach((h) => h.attributes.basin_name && h.remove.remove());
            setHighlights(highlights.filter((h) => h.attributes.county_name));
        }
    }, [basins]);

    useEffect(() => {
        if (counties.length === 0 && countyLayerView) {
            highlights.forEach((h) => h.attributes.county_name && h.remove.remove());
            setHighlights(highlights.filter((h) => h.attributes.basin_name));
        }
    }, [counties]);

    useEffect(() => {
        if (layersLoaded) {
            switch(selectedType) {
                case BASINS:
                    mapview.layerViews.forEach((lv: { layer: { title: string; }; visible: boolean; }) => {
                        lv.layer.title === LayerIds.BasinStats ? lv.visible = true : lv.visible = false;
                    })
                    break;
                case COUNTIES:
                    mapview.layerViews.forEach((lv: { layer: { title: string; }; visible: boolean; }) => {
                        lv.layer.title === LayerIds.CountyStats ? lv.visible = true : lv.visible = false;
                    })
                    break;
                }
        }
    }, [selectedType]);

    useEffect(() => {
        if (basinLayerLoaded && countyLayerLoaded) {
            setLayersLoaded(true);
        }
    }, [basinLayerLoaded, countyLayerLoaded]);

    useEffect(() => {
        //@ts-ignore
        if (config !== null && config.mapConfig && !mapSet && !loadSubscriptionData) {
            setMapSet(true);
            //@ts-ignore
            const { mapConfig } = config;
            webmap = new WebMap({
                portalItem: {
                    id: mapConfig.webMapId
                }
            });

            mapview = new MapView({
                container: mapDiv.current == null ? undefined : mapDiv.current,
                map: webmap,
            });

            mapview.ui.move("zoom", "top-right");

            mapview.on("layerview-create", function(event:any) {
                if (event.layer.title === LayerIds.BasinStats) {
                    basinLayerView = event.layerView as __esri.FeatureLayerView;
                    basinLayerView.highlightOptions = {
                        color: new Color("#16A15E"),
                        haloOpacity: 0.9,
                        fillOpacity: 0.6
                        };
                        //@ts-ignore
                        //event.layer.popupTemplate = cartPopupTemplate;
                        setBasinLayerLoaded(true);
                    mapview.on('pointer-move', (move_event:any) => {
                        if (mapview.layerViews.find((lv) => lv.layer.title === LayerIds.BasinStats).visible) {
                            mapview.hitTest(move_event, {include: basinLayerView.layer}).then((r) => {
                                //@ts-ignore
                                if (mapDiv.current) { mapDiv.current.style.cursor = "pointer"; }
                                showPopup(r, 'basin');
                                return;
                            });
                            //@ts-ignore
                            if (mapDiv.current) { mapDiv.current.style.cursor = "default"; }
                        }
                    })
                }
                if (event.layer.title === LayerIds.CountyStats) {
                    countyLayerView = event.layerView as __esri.FeatureLayerView;
                    countyLayerView.highlightOptions = {
                        color: new Color("#16A15E"),
                        haloOpacity: 0.9,
                        fillOpacity: 0.6
                        };
                    //@ts-ignore
                    //event.layer.popupTemplate = cartPopupTemplate;
                    setCountyLayerLoaded(true);
                        mapview.on('pointer-move', (move_event:any) => {
                        if (mapview.layerViews.find((lv) => lv.layer.title === LayerIds.CountyStats).visible) {
                            mapview.hitTest(move_event, {include: countyLayerView.layer}).then((r) => {
                                //@ts-ignore
                                if (mapDiv.current) { mapDiv.current.style.cursor = "pointer"; }
                                showPopup(r, 'county');
                                return;
                            });
                            //@ts-ignore
                            if (mapDiv.current) { mapDiv.current.style.cursor = "default"; }
                        }
                    })
                }
            });

            mapview.on('click', (event:any) => {
                setScreenPoint(event);
            });

            webmap.when(() => {
                console.log("loaded");
                dispatch(INIT_MAP({map: webmap, mapview}));
                webmap.layers
                    .filter(layer => { return layer.type === 'feature' })
                    .map(layer => {
                        let featLayer:FeatureLayer = layer as FeatureLayer; 
                        featLayer.outFields = ['*'];
                        return featLayer; 
                    });
                mapview.goTo({
                    center: mapConfig.centerAsPoint(),
                    zoom: mapConfig.zoom
                  })
                  .catch(function(error) {
                    if (error.name !== "AbortError") {
                      console.error(error);
                      }
                  });
            });
    }
    }, [config, loadSubscriptionData]);

    useEffect(() => {
        if (screenPoint !== prevScreenPoint.current && mapSet)
            handleMapClick(screenPoint);
        prevScreenPoint.current = screenPoint;
    }, [screenPoint]);

    useEffect(() => {
        const tmpHighlights: IHighlight[] = [];
        let reset = false;
        //match highlights and remove items that have been removed from the cart
        highlights.forEach((item) => {
            if (!item.attributes.county_name) {
                const highlightIdx = cartListItems.findIndex((h) => {
                    const basinItem:BasinDetailsObject = h as BasinDetailsObject;
                    return basinItem.basin_name && basinItem.basin_name === item.attributes.basin_name;
                });
                if (highlightIdx === -1) {
                    item.remove.remove();
                    reset = true;
                } else {
                    tmpHighlights.push(item);
                }
            } else {
                const highlightIdx = cartListItems.findIndex((h) => {
                    const countyItem:CountyDetailsObject = h as CountyDetailsObject;
                    return countyItem.county_name && countyItem.county_name === item.attributes.county_name &&
                           countyItem.state_abbr && countyItem.state_abbr === item.attributes.state_abbr;
                });
                if (highlightIdx === -1) {
                    item.remove.remove();
                    reset = true;
                } else {
                    tmpHighlights.push(item);
                }
            }
        });
        //query for and add items that have been added to the cart to highlight them
        const addedBasinItems = cartListItems.filter((c:any) => {
            const highlightIdx = highlights.findIndex((h) => {
                const basinItem:BasinDetailsObject = c as BasinDetailsObject;
                return basinItem.basin_name && basinItem.basin_name === h.attributes.basin_name;
            });
            return highlightIdx === -1 && !c.county_name;
        })
        if (addedBasinItems.length > 0) {
            if (layersLoaded) {
                const layer = webmap.layers.find((l: { title: string; }) => l.title === LayerIds.BasinStats);
                if (layer) {
                    const clause = (addedBasinItems.map((ab: any) => ab.basin_name)).join("','");
                    queryFeatures(layer, null, "basin_name in ('" + clause + "')", tmpHighlights);
                    return;
                }
            }
        }
        const addedCountyItems = cartListItems.filter((c:any) => {
            const highlightIdx = highlights.findIndex((h) => {
                const CountyItem:CountyDetailsObject = c as CountyDetailsObject;
                return h.attributes.county_name && CountyItem.county_name 
                    && CountyItem.county_name === h.attributes.County_name
                    && CountyItem.state_abbr === h.attributes.State_abbr;
            });
            return highlightIdx === -1 && !c.basin_name;
        })
        if (addedCountyItems.length > 0) {
            if (layersLoaded) {
                const layer = webmap.layers.find((l: { title: string; }) => l.title === LayerIds.CountyStats);
                if (layer !== null) {
                    const countyClause = (addedCountyItems.map((ab: any) => 
                        "(county_name = '" + ab.county_name + "' AND state_abbr = '"+ ab.state_abbr + "')")).join(" OR ");
                   // const states = (addedCountyItems.map((ab: any) => ab.state_abbr)).join("','");
                    queryFeatures(layer, null, countyClause, tmpHighlights);
                    return;
                }
            }
        }
        //Update highlights
        if (reset) {
            setHighlights(tmpHighlights);
        }
    }, [cartListItems, layersLoaded]);
    
    useEffect(() => {
        if (layersLoaded && currentSubscriptions && !loadSubscriptionData) {
            subscriptionHighlights.forEach((h) => h.remove());
            const cartPopupTemplate = {
                actions: [],
                content: "",
                title: (event:any) => {
                    const formatted_price = Math.trunc(event.graphic.attributes.price * 100) / 100;
                    const subscribed = currentSubscriptions.find((cs) => cs.name === event.graphic.attributes.basin_name) ?
                        "<br /><div className='subscribed'>Subscribed</div>" : "$" + formatted_price;
                    if (event.graphic.attributes.county_name) {
                        return "{county_name} - " + subscribed;
                    } else {
                        return "{basin_name} - " + subscribed;
                    }
                }
            }
            //@ts-ignore
            countyLayerView.layer.popupTemplate = cartPopupTemplate
            //@ts-ignore
            basinLayerView.layer.popupTemplate = cartPopupTemplate
            const query = 
            {
                //query object
                where: "",
                returnGeometry: false,
                outFields: ["*"],
            }
            const basins = currentSubscriptions.filter((cs) => cs.type === 1);
            const bLayer:any = webmap.layers.find((l: { title: string; }) => l.title === LayerIds.BasinStats);
            const basinsClause = basins.length > 0 ? (basins.map((ab: ISubscriptionMapData) => 
                        "basin_name = '" + ab.name +"'")).join(" OR ") : "1=0"; 
            query.where = basinsClause;
            dispatch(showSiteLoader());
            bLayer.queryFeatures(query)
            .then((featureSet: { features: any[]; }) => {
                if (featureSet.features.length > 0) {
                    const tmpSubscriptionHighlights:any[] = [];
                    tmpSubscriptionHighlights.push(basinLayerView.highlight(featureSet.features));

                    const counties = currentSubscriptions.filter((cs) => cs.type === 2);
                    const countyClause = counties.length > 0 
                            ? (counties.map((ab: ISubscriptionMapData) => 
                                "(county_name = '" + ab.name + "' AND state_abbr = '"+ ab.state + "')")).join(" OR ")
                            : "1=0";
                    const cLayer:any = webmap.layers.find((l: { title: string; }) => l.title === LayerIds.CountyStats);
                       
                    query.where = "(" + countyClause + ") OR (" + basinsClause + ")";
                    cLayer.queryFeatures(query)
                    .then((countiesFeatureSet: { features: any[]; }) => {
                        if (countiesFeatureSet.features.length > 0) {
                            tmpSubscriptionHighlights.push(countyLayerView.highlight(countiesFeatureSet.features));
                        }
                        setSubscriptionHighlights(tmpSubscriptionHighlights);
                    }).catch((e:any) => {
                        console.log("Error getting county subscription data");
                        setSubscriptionHighlights(tmpSubscriptionHighlights);
                    });
                }
            })
            .catch((e:any) => {
                console.log("Error getting subscription data");
            })
            .finally(() => {
                dispatch(hideSiteLoader());
            });;
        }
    },[currentSubscriptions, layersLoaded])

    if (config === null) {
        return <div className="mapDiv" ref={mapDiv}></div>;
    }

    const handleMapClick: any = (event: { preventDefault: () => void; }) => {
        if (allowSelection) {
            const compareType = selectedType === BASINS ? LayerIds.BasinStats : LayerIds.CountyStats;
            const layer = webmap.layers.find((l: { title: string; }) => l.title === compareType);
            queryFeatures(layer, event, "", [...highlights]);
        }
        event.preventDefault();
    }

    const showPopup: any = ( r: any, popupType: string) => {
        if (r.results.length > 0) {
            
            const graphicHits = r.results?.filter(
                (hitResult:any) => hitResult.type === "graphic"
            );
            if (graphicHits.length === 0) {
                mapview.popup.visible = false;
                return;
            }
            const graphic = graphicHits[0].graphic;
            //remove to disable popups on subscribed items
            /*if (currentSubscriptions) {
                const found = currentSubscriptions.find((cs) => {
                    if (popupType === 'basin' && graphic.attributes.basin_name === cs.name)
                        return true;
                    if (popupType === 'county' && graphic.attributes.county_name === cs.name && graphic.attributes.state_abbr === cs.state)
                        return true;
                    return false;
                });
                if (found) return;
            }*/
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
        dispatch(showSiteLoader());
        layer.queryFeatures(query)
        .then((featureSet: { features: any[]; }) => {
          // set graphic location to mouse pointer and add to mapview
          const features = featureSet.features.map((f: { attributes: any; }) => {return f.attributes});
          if (features.length === 0) {
            return;
          }
          const featureAttributes = featureSet.features[0].attributes;
          if (layer.title === LayerIds.BasinStats) {
            const basin = highlights.find((h) => h.attributes.basin_name && h.attributes.OBJECTID === featureAttributes.OBJECTID);
            if (basin) return;

            let tmpFeatures:any[] = [];

            if (currentSubscriptions) {
                features.forEach((f) => {
                    const found = currentSubscriptions.find((cs) => {
                        return (f.basin_name === cs.name);
                    });
                    if (!found) tmpFeatures.push(f);
                });
            }
            dispatch(SET_BASINS(tmpFeatures));
            const h = basinLayerView.highlight(featureSet.features.filter((f) => tmpFeatures.find((tmp) => tmp.OBJECTID === f.OBJECTID) !== null));
            let tmpH = {attributes: featureAttributes, remove: h};
            if (!clauseQuery) {
                console.log('dispatching basin clicked')
                dispatch(
                    getBasinCountyDetails(
                        access_token,
                        {
                            category:
                                "basin",
                            search: `${features[0].basin_name}`,
                        }
                    )
                );
            }
            tmpHighlights.push(tmpH);
          }
          if (layer.title === LayerIds.CountyStats) {
            const county = highlights.find((h) => h.attributes.county_name && h.attributes.OBJECTID === featureAttributes.OBJECTID);
            if (county) return;
            let tmpFeatures:any[] = [];

            if (currentSubscriptions) {
                features.forEach((f) => {
                    const found = currentSubscriptions.find((cs) => {
                        return (f.county_name === cs.name && f.state_abbr === cs.state)
                    });
                    if (!found) tmpFeatures.push(f);
                });
            }
            const h = countyLayerView.highlight(featureSet.features.filter((f) => tmpFeatures.find((tmp) => tmp.OBJECTID === f.OBJECTID) !== null));
            dispatch(SET_COUNTIES(tmpFeatures));
            let tmpH = {attributes: featureAttributes, remove: h};
            if (!clauseQuery) {
                console.log('dispatching county clicked')
                dispatch(
                    getBasinCountyDetails(
                        access_token,
                        {
                            category:
                                "county",
                            search: `${features[0].county_name}`,
                            state: `${features[0].state_abbr}`,
                        }
                    )
                );
            }
            tmpHighlights.push(tmpH);
          }
          setHighlights(tmpHighlights);
        })
        .finally(() => {
            dispatch(hideSiteLoader());
        });
      }

    const tmpConfig:IBaseMapConfig = config as IBaseMapConfig;
    return (<div className="mapDiv" ref={mapDiv}>  
    </div>);
}

export default Map;
