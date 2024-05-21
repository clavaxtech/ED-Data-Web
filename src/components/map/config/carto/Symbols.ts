export default class Symbols {
    static simpleFill = (
        color:any = "black",
        outlineColor:any = "white",
        outlineStyle = "solid",
        outlineWidth = 1.0
    ) => ({
        type: "simple-fill",
        color,
        outline: Symbols.simpleLine(outlineColor, outlineStyle, outlineWidth)
    });

    static simpleFillRenderer = (
        color:any = "black",
        outlineColor:any = "white",
        outlineStyle = "solid",
        outlineWidth = 1.0
    ) => ({
        type: "simple",
        symbol: Symbols.simpleFill(color, outlineColor, outlineStyle, outlineWidth)
    });

    static simpleLine = (color = "black", style = "solid", width = 1.0) => ({
        type: "simple-line",
        color,
        style,
        width
    });

    static simpleLineRenderer = (
        color = "black",
        style = "solid",
        width = 1.0
    ) => ({
        type: "simple",
        symbol: Symbols.simpleLine(color, style, width)
    });

    static simpleMarkerRenderer = (
        color = "black",
        style = "circle",
        size = 8,
        outlineColor = "white",
        outlineStyle = "solid",
        outlineWidth = 1.0
    ) => ({
        type: "simple", // autocasts as new SimpleRenderer()
        symbol: Symbols.simpleMarker(color, style, size, outlineColor, outlineStyle, outlineWidth)
    });

    static simpleMarker = (
        color = "black",
        style = "circle",
        size = 8,
        outlineColor = "white",
        outlineStyle = "solid",
        outlineWidth = 1.0
    ) => ({
        type: "simple-marker",
        color,
        size,
        style,
        outline: Symbols.simpleLine(outlineColor, outlineStyle, outlineWidth)
    });

    static text = (
        color = "black",
        fontSize = 12,
        haloColor = "white",
        haloSize = 1,
        fontFamily = "sans-serif"
    ) => ({
        type: "text",
        color,
        haloColor,
        haloSize,
        font: {
            family: fontFamily,
            size: fontSize
        }
    });

    static pictureMarker:any = (
        url: string,
        height = 8,
        width = 8,
        angle = 0,
        xoffset = 0,
        yoffset = 0
    ) => ({
        type: "picture-marker",
        url,
        height,
        width,
        angle,
        xoffset,
        yoffset
    });

    static rigMarker:any = (
        url: string,
        size = 8,
        xoffset = 0,
        yoffset = 0
    ) => ({
        "type": "cim",
        "data": {
            "type": "CIMSymbolReference",
            "symbol": {
                "type": "CIMPointSymbol",
                "symbolLayers": [{
                    "type": "CIMPictureMarker",
                    "enable": true,
                    "anchorPoint": {
                        "x": xoffset,
                        "y": yoffset
                    },
                    "primitiveName": "rigOverride",
                    "size": size,
                    "url": url,
                }]
            },
            "primitiveOverrides": [
                {
                    "type": "CIMPrimitiveOverride",
                    "primitiveName": "rigOverride", // the name of the symbol layer we want to override
                    "propertyName": "Size", // the name of the property on the symbol layer we want to override
                    "valueExpressionInfo": {
                        "type": "CIMExpressionInfo",
                        "title": "Size override",
                        // the pixel size at the largest scale
                        // 42 represents the pixel size of the
                        // circles at the view's largest scale (1:2,311,161)
                        "expression": "8 * MAX([MIN([2306826 / $view.scale, 4]), 1])",
                        "returnType": "Default"
                    }
                }
            ]
        }
     });

     static rigOverride = () => ({
        "type": "CIMPrimitiveOverride",
        "primitiveName": "rigOverride", // the name of the symbol layer we want to override
        "propertyName": "Size", // the name of the property on the symbol layer we want to override
        "valueExpressionInfo": {
            "type": "CIMExpressionInfo",
            "title": "Size override",
            // the pixel size at the largest scale
            // 42 represents the pixel size of the
            // circles at the view's largest scale (1:2,311,161)
            "expression": "42 * 2311161 / $view.scale",
            "returnType": "Default"
        }
    });
         
     

    static simplePictureMarkerRenderer = (
        url: string,
        height = 12,
        width = 12,
        angle = 0,
        xoffset = 0,
        yoffset = 0
    ) => ({
        type: "simple", // autocasts as new SimpleRenderer()
        symbol: Symbols.pictureMarker(url, height, width, angle, xoffset, yoffset)
    });
}
