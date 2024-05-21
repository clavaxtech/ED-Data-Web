import Symbols from "./Symbols";
import WellIcons from "./WellIcons";
import FieldNames from "../layers/FieldNames";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import MapView from "@arcgis/core/views/MapView";


export default class Renderers {
    static activeListingTractsRenderer = Symbols.simpleFillRenderer(
        "rgba(21, 31, 239, 0.05)",
        "rgba(21, 31, 239, 1.0)",
        "solid",
        4.0
    );

    static activeListingWellLinesRenderer = Symbols.simpleLineRenderer("rgba(15,15,15,0.0)", "solid", 0);
    static activeListingWellPointRenderer = Symbols.simpleMarkerRenderer(
        "rgba(230,184,0,1.0)",
        "circle",
        0,
        "rgba(26,26,0,0.6)",
        "solid",
        0
    );
    static activeListingUnitsRenderer = Symbols.simpleFillRenderer(
        "rgba(118, 197, 37, 0.05)",
        "rgba(118, 197, 37, 1.0)",
        "solid",
        4.0
    );

    static countyRenderer = Symbols.simpleFillRenderer(
        "rgba(255,255,255,0)",
        "rgba(75,75,75,0.8)",
        "solid",
        1
    );
    static townshipRenderer = Symbols.simpleFillRenderer(
        "rgba(255,255,255,0)",
        "rgba(100,100,100,0.8)",
        "short-dash",
        1
    );
    static texasBlockRenderer = Symbols.simpleFillRenderer(
        "rgba(255,255,255,0)",
        "rgba(100,100,100,0.8)",
        "solid",
        1
    );
    static texasTractRenderer = Symbols.simpleFillRenderer(
        "rgba(255,255,255,0)",
        "rgba(100,100,100,0.8)",
        "solid",
        0.5
    );
    static plssRenderer = Symbols.simpleFillRenderer(
        "rgba(255,255,255,0)",
        "rgba(100,100,100,0.8)",
        "solid",
        0.5
    );

    static backgroundWellPointsRenderer = Symbols.simpleMarkerRenderer("gray");
    static backgroundWellLinesRenderer = Symbols.simpleLineRenderer("rgba(15,15,15,0.75)", "solid", 1.0);

    static rigPointsRenderer = {type: 'simple', symbol: Symbols.rigMarker(WellIcons.rig) };

    static wellsByTypeRenderer2 = {type: 'simple', symbol: Symbols.pictureMarker(WellIcons.wellOil) };

    static wellsTypeValueExpression = `When(
            ($feature.${FieldNames.wellDataPointsTypeId} == 8 && $feature.${FieldNames.wellPointsIsSurfacePoint} == 0 && $feature.${FieldNames.wellPointsCount} > 1), 100,
            ($feature.${FieldNames.wellDataPointsTypeId} == 9 && $feature.${FieldNames.wellPointsIsSurfacePoint} == 0 && $feature.${FieldNames.wellPointsCount} > 1), 100,
             $feature.${FieldNames.wellDataPointsTypeId})`;

    // tslint:disable-next-line:member-ordering
    static wellsByTypeRenderer = {
        type: "unique-value",
        valueExpression: Renderers.wellsTypeValueExpression,
        uniqueValueInfos: [
            { value: 1, label: "Oil", symbol: Symbols.pictureMarker(WellIcons.wellOil) },
            { value: 2, label: "Gas", symbol: Symbols.pictureMarker(WellIcons.wellGas) },
            { value: 3, label: "Oil/Gas", symbol: Symbols.pictureMarker(WellIcons.wellOilAndGas) },
            { value: 4, label: "Dry Hole", symbol: Symbols.pictureMarker(WellIcons.wellDry) },
            { value: 5, label: "Active Permit", symbol: Symbols.pictureMarker(WellIcons.permit) },
            { value: 6, label: "Injection", symbol: Symbols.pictureMarker(WellIcons.wellInjection) },
            { value: 8, label: "Horizontal", symbol: Symbols.pictureMarker(WellIcons.wellPadHorizontal) },
            { value: 9, label: "Directional", symbol: Symbols.pictureMarker(WellIcons.wellPadDirectional) },
            { value: 10, label: "Other", symbol: Symbols.pictureMarker(WellIcons.other) },
            { value: 11, label: "Plugged Oil", symbol: Symbols.pictureMarker(WellIcons.wellOilPlugged) },
            { value: 12, label: "Plugged Gas", symbol: Symbols.pictureMarker(WellIcons.wellGasPlugged) },
            { value: 13, label: "Plugged Oil/Gas", symbol: Symbols.pictureMarker(WellIcons.wellOilAndGasPlugged) },
            { value: 14, label: "Shut-in Oil", symbol: Symbols.pictureMarker(WellIcons.wellOilShutIn) },
            { value: 15, label: "Shut-in Gas", symbol: Symbols.pictureMarker(WellIcons.wellGasShutIn) },
            { value: 16, label: "Cancelled Location", symbol: Symbols.pictureMarker(WellIcons.other) },
            { value: 17, label: "Plugged", symbol: Symbols.pictureMarker(WellIcons.wellOilPlugged) },
            { value: 18, label: "Salt Water Disposal", symbol: Symbols.pictureMarker(WellIcons.wellInjection) },
            { value: 19, label: "Terminated", symbol: Symbols.pictureMarker(WellIcons.other) },
            { value: 20, label: "Shut-in Oil/Gas", symbol: Symbols.pictureMarker(WellIcons.wellOilAndGasShutin) },
            { value: 21, label: "Water Supply", symbol: Symbols.pictureMarker(WellIcons.other) },
            { value: 22, label: "Gas Storage", symbol: Symbols.pictureMarker(WellIcons.other) },
            { value: 23, label: "Inactive Oil", symbol: Symbols.pictureMarker(WellIcons.wellOilPlugged) },
            { value: 24, label: "Inactive Gas", symbol: Symbols.pictureMarker(WellIcons.wellGasPlugged) },
            { value: 25, label: "Expired Permit", symbol: Symbols.pictureMarker(WellIcons.other) },
            { value: 26, label: "Abandoned", symbol: Symbols.pictureMarker(WellIcons.other) },
            { value: 100, label: "Bottom", symbol: Symbols.pictureMarker(WellIcons.wellPad) },
            { value: -100, label: "Rigs", symbol: Symbols.pictureMarker(WellIcons.rig) }
        ]
    };

    // tslint:disable-next-line:member-ordering
    static wellListingRenderer = Symbols.simplePictureMarkerRenderer(
        WellIcons.wellListing,
        16,
        10,
        0,
        0,
        12
    );
}
