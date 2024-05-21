import Point from "@arcgis/core/geometry/Point";
import BaseLayers from "./layers/BaseLayers";
import LayerIds from "./layers/LayerIds";
import LayerURLs from "./layers/LayerURLs";
import Renderers from "./carto/Renderers";
import { boolean, number } from "yup";

export interface IMapConfig {
    limitToInitialExtent: boolean,
    center: [],
    zoom: number,
    highlightZoom: number | null,
    defaultLayers: [],
    layers: [],
    webMapId: String
}

export interface IBaseMapConfig {
    mapConfig: IMapConfig,
    useFilter: boolean,
    useLegend: boolean
}

class MapConfig {
    limitToInitialExtent = false;
    center = [-99.280050, 38.750645];
    zoom = 4;
    defaultLayers = [
        BaseLayers.plss,
        BaseLayers.texasTracts,
        BaseLayers.townshipsByState,
        BaseLayers.allWellPoints
    ];
    layers = [BaseLayers.allWellPoints];
    webMapId = "392f270bd07a4dfdb16e12ca30ad746d"; // EDOM AGOL Webmap item ID

    centerAsPoint() {
        return new Point({ longitude: this.center[0], latitude: this.center[1] });
    }
}

class AoIMapConfig {
    limitToInitialExtent = false;
    center = [-99.280050, 38.750645];
    zoom = 4;
    highlightZoom = 13;
    defaultLayers = [
    ];
    layers = [];
    webMapId = "55b4f10b300b4b0184aafefc924f9402"; // EDOM AGOL Webmap item ID

    centerAsPoint() {
        return new Point({ longitude: this.center[0], latitude: this.center[1] });
    }
}

export class BaseMapConfig {
    mapConfig = new MapConfig();
    useLegend = false;
    useFilter = false;
    static bufferThreshold = 10;
}

export class AoIBaseMapConfig {
    mapConfig = new AoIMapConfig();
    useLegend = false;
    useFilter = false;
    static bufferThreshold = 10;
}
