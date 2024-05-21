import LabelClasses from "../carto/LabelClasses";
import PopupTemplates from "../carto/PopupTemplates";
import Renderers from "../carto/Renderers";
import LayerIds from "./LayerIds";
import FieldNames from "./FieldNames";
import LayerScaleLevels from "./LayerScaleLevels";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

const ALL_WELLS_POINTS_URL =
    "https://services6.arcgis.com/r86ESmAW0Co7d5WC/arcgis/rest/services/well_points_prod/FeatureServer/0";
const ALL_WELLS_LINES_URL =
    "https://services6.arcgis.com/r86ESmAW0Co7d5WC/arcgis/rest/services/well_lines_prod/FeatureServer/0";
const TEXAS_TRACTS_URL =
    "https://services6.arcgis.com/r86ESmAW0Co7d5WC/arcgis/rest/services/abstract_surveys/FeatureServer/0";
const TOWNSHIPS_BY_STATE_URL =
    "https://services6.arcgis.com/r86ESmAW0Co7d5WC/arcgis/rest/services/township_ny_pa_wv_oh/FeatureServer/0";
const PLSS_URL =
    "https://services6.arcgis.com/r86ESmAW0Co7d5WC/arcgis/rest/services/plss_sections_usa_meridian_explicit_attributes_20191021gdb/FeatureServer/0";

export default class BaseLayers {
    static getCountyGraphicsLayer = () => {
        const layer = new FeatureLayer({
            source: [],
            fields: [{
              name: "ObjectID",
              alias: "ObjectID",
              type: "oid"
            }, {
                name: FieldNames.countyStatsBasinName,
                alias: FieldNames.countyStatsBasinName,
                type: "string"
            },
            {
                name: FieldNames.countyStatsStateAbbr,
                alias: FieldNames.countyStatsStateAbbr,
                type: "string"
            },
            {
                name: FieldNames.countyStatsCountyName,
                alias: FieldNames.countyStatsCountyName,
                type: "string"
            },
            {
                name: FieldNames.countyWellTotals,
                alias: FieldNames.countyWellTotals,
                type: "integer"
            }],
            title: LayerIds.CountyStatsGraphic,
            objectIdField: "ObjectID",
            geometryType: "polygon",
            maxScale: 150000
        });
        const renderer = {
            
        }
        return layer;
    }
    static townshipsByState = {
        id: LayerIds.townshipsByState,
        url: TOWNSHIPS_BY_STATE_URL,
        minScale: 200000,
        renderer: Renderers.townshipRenderer
    };

    static texasTracts = {
        id: LayerIds.texasTracts,
        url: TEXAS_TRACTS_URL,
        minScale: 150000,
        renderer: Renderers.texasTractRenderer
    };

    static plss = {
        id: LayerIds.PLSS,
        url: PLSS_URL,
        minScale: 150000,
        renderer: Renderers.plssRenderer
    };

    static allWellPoints = {
        id: LayerIds.allWellPoints,
        url: ALL_WELLS_POINTS_URL,
        renderer: Renderers.backgroundWellPointsRenderer,
        opacity: 0.6,
        minScale: LayerScaleLevels.listingDetailsWellPointsMinScale,
        visible: true
    };

    static allWellLines = {
        id: LayerIds.allWellLines,
        url: ALL_WELLS_LINES_URL,
        opacity: 0.6,
        renderer: Renderers.backgroundWellLinesRenderer,
        minScale: LayerScaleLevels.listingDetailsWellLinesMinScale,
        visible: true
    };

    static offsetWells = {
        id: LayerIds.offsetWells,
        url: ALL_WELLS_POINTS_URL,
        renderer: Renderers.wellsByTypeRenderer,
        minScale: LayerScaleLevels.listingDetailsOffsetWellPointsMinScale,
        outFields: [
            FieldNames.wellPointsOperatorName,
            FieldNames.wellPointsWellName,
            FieldNames.wellPointsApi,
            FieldNames.wellPointsWellTypeName,
            FieldNames.wellPointsCounty,
            FieldNames.wellPointsStateAbbr,
            FieldNames.wellPointsLegalTownship,
            FieldNames.wellPointsLegalRange,
            FieldNames.wellPointsLegalSection,
            FieldNames.wellPointsLegalAbstract,
            FieldNames.wellPointsLegalBlock,
            FieldNames.wellPointsLegalText,
            FieldNames.wellPointsLegalAbbr,
            FieldNames.wellPointsLegalQuarterSection,
            FieldNames.wellPointsLegalLot,
            FieldNames.wellPointsLegalSurvey,
            FieldNames.wellPointsField,
            FieldNames.wellPointsBasin,
            FieldNames.wellPointsDepth,
            FieldNames.wellPointsIsVertical,
            FieldNames.wellPointsSpudDate,
            FieldNames.wellPointsCompletionDate,
            FieldNames.wellPointsProductionDate,
            FieldNames.wellPointsStateLink,
            FieldNames.wellPointsPermitDate,
            FieldNames.wellPointsTypeId,
            FieldNames.wellPointsTypeName,
            FieldNames.wellPointsIsSurfacePoint,
            FieldNames.wellPointsCount,
            FieldNames.wellPointsLatitude,
            FieldNames.wellPointsLongitude
        ],
        popupTemplate: PopupTemplates.offsetWellsPopupAgol,
        visible: false
    };
}
