import Circle from "@arcgis/core/geometry/Circle";
import Point from "@arcgis/core/geometry/Point";
import Polygon from "@arcgis/core/geometry/Polygon";
import Graphic from "@arcgis/core/Graphic";
import Symbols from "./Symbols";
import WellIcons from "./WellIcons";
import { Geometry } from "@arcgis/core/geometry";
import PopupTemplates from "../carto/PopupTemplates";

export default class Graphics {
    static RadiusCircleGraphics = (center: any, radius: any) => {
        const pointGraphic = new Graphic({
            geometry: center,
            symbol: Symbols.simpleMarker("blue", "circle", 8, "darkblue", "solid", 0.5)
        });
        const geometry = new Circle({
            center,
            geodesic: true,
            radius,
            radiusUnit: "miles"
        });
        const circleGraphic = new Graphic({
            geometry,
            symbol: Symbols.simpleFill(
                [160, 204, 233, 0.1], // Fill color
                [160, 204, 233], // Outline color
                "solid", // Outline style
                1 // Outline width
            )
        });
        return [circleGraphic];
    };

    static TractPolygonGraphics = (tracts: any[]) => {
        return tracts.map(
            tract =>
                new Graphic({
                    geometry: tract,
                    symbol: Symbols.simpleFill(
                        [255, 255, 255, 0.0], // Fill color
                        [255, 255, 0, 1.0], // Outline color
                        "solid", // Outline style
                        3 // Outline width
                    )
                })
        );
    };

    static ListingBufferGraphic = (buffer: any) => {
        return new Graphic({
            geometry: buffer,
            symbol: Symbols.simpleFill(
                [255, 255, 255, 0.0], // Fill color
                [230, 184, 0, 0.8], // Outline color
                "solid", // Outline style
                3 // Outline width
            )
        });
    };

    static WellListingForSaleGraphic = (well: any) => {
        return new Graphic({
            geometry: well,
            symbol: Symbols.pictureMarker(WellIcons.wellListing, 20, 12, 0, 0, 16)
        });
    };

    static WellAllListingsForSaleGraphic = (well: any, id: any, graphic: string) => {
        if (!graphic) {
            graphic = "Neut.svg";
        }

        var symbol = Symbols.pictureMarker(`${WellIcons.defaultMarker}${graphic}`, 40, 24, 0, 0, 16);

        // Dimensions are odd, so match by the file name suffix to tested dimensions
        if (graphic.endsWith('.svg') && graphic.indexOf('_') != -1) {
            let suffixMap:any = {
                'c-h': Symbols.pictureMarker(`${WellIcons.defaultMarker}${graphic}`, 45, 24, 0, 0, 16),
                'c': Symbols.pictureMarker(`${WellIcons.defaultMarker}${graphic}`, 40, 44, 0, 0, 16),
                'f-h': Symbols.pictureMarker(`${WellIcons.defaultMarker}${graphic}`, 45, 24, 0, 0, 16),
                'f': Symbols.pictureMarker(`${WellIcons.defaultMarker}${graphic}`, 45, 24, 0, 0, 16),
                'fc-h': Symbols.pictureMarker(`${WellIcons.defaultMarker}${graphic}`, 45, 36, 0, 0, 16),
                'fc': Symbols.pictureMarker(`${WellIcons.defaultMarker}${graphic}`, 45, 36, 0, 0, 16),
                's-h': Symbols.pictureMarker(`${WellIcons.defaultMarker}${graphic}`, 45, 36, 0, 0, 16),
                's': Symbols.pictureMarker(`${WellIcons.defaultMarker}${graphic}`, 40, 44, 0, 0, 16),
                'sf-h': Symbols.pictureMarker(`${WellIcons.defaultMarker}${graphic}`, 45, 36, 0, 0, 16),
                'sf': Symbols.pictureMarker(`${WellIcons.defaultMarker}${graphic}`, 45, 36, 0, 0, 16),
            }
            let graphicName = graphic.split('.svg')[0].split('_')[1];
            symbol = suffixMap[graphicName];
        }

        return new Graphic({
            attributes: {
                id: id
            },
            geometry: well,
            symbol: symbol,
            popupTemplate: {
                title: `Listing ${id}`,
                content: "This listing is for sale",
            }
        });
    };

    static OffsetWellHighlightGraphic = (offsetWell: any, attributes: any) => {
        return new Graphic({
            attributes: attributes,
            geometry: offsetWell,
            symbol: Symbols.pictureMarker(`${WellIcons.defaultMarker}${WellIcons.defaultOffsetWellListingHighlightGraphic}`, 25, 15, 0, 0, 16),
            popupTemplate: PopupTemplates.offsetWellsPopupAgol
        });
    };
}
