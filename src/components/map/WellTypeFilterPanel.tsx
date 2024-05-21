import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { renderPreviewHTML } from "@arcgis/core/symbols/support/symbolUtils";
import Renderers from "./config/carto/Renderers";
import { IFilter, SET_FILTER, TOGGLE_FILTER_VALUE } from "./redux/filters";
import LayerIds from "./config/layers/LayerIds";
import FieldNames from "./config/layers/FieldNames";

import "./css/wellTypeFilterPanel.scss";


// I set these so we can change them quickly in the code below. They are for the layer and field we're working with here.
const offsetWellsLayerId = LayerIds.WellData;
const filteredField = FieldNames.wellDataPointsTypeId;

// In the case of the Well type filter, if all items are deselected we want all
// items filtered from the layer.
const filterAllIfEmpty:boolean = false;

interface IWellTypeFilterPanelProps {
    setFilter: any
}


function WellTypeFilterPanel(props:IWellTypeFilterPanelProps) {

    const dispatch = useAppDispatch();

    const [currentFilterLayers, setCurrentFilterLayers] = useState<[Number]>();

    const {
        layers
    } = useAppSelector((state) => state.filters);

    useEffect(() => {
        //TODO: Add in reseting all filters when sync between wells, panel and legend is coupled.
        //const renderers = Renderers.wellsByTypeRenderer.uniqueValueInfos.map(v => v.value)
        //dispatch(SET_FILTER({layerId: offsetWellsLayerId, filterAllIfEmpty, value:renderers, field: filteredField}))
    }, [])

    useEffect(() => {
        if (offsetWellsLayerId in layers) {
            //@ts-ignore
            const layerFilters = layers[offsetWellsLayerId];
            setCurrentFilterLayers(layerFilters[filteredField]);
        }
    }, [layers])

    const selectAll = () => {
        const allIds = Renderers.wellsByTypeRenderer.uniqueValueInfos.map(v => v.value);
        dispatch(SET_FILTER([{layerId: offsetWellsLayerId, filterAllIfEmpty, value:allIds, field: filteredField}]));
    }

    const delselectAll = () => {
        dispatch(SET_FILTER([{layerId: offsetWellsLayerId, filterAllIfEmpty, value:[], field: filteredField}]));
    }

    const wellItemClicked = (id: any) => {
        return;
        //Disable map ability to toggle legends, filters will be toggled based on left panel searches until complete
        //sync is available.
        //TODO: Re-enable once legend, well list and panel are all in sync.
        //dispatch(TOGGLE_FILTER_VALUE({layerId: offsetWellsLayerId, filterAllIfEmpty, value:id, field: filteredField}));
    }

    const renderedSymbols = Renderers.wellsByTypeRenderer.uniqueValueInfos.map(valueInfo => {
        const { value, label, symbol } = valueInfo;
        const node = document.createElement("div");
        const nodeClasses =
            currentFilterLayers && currentFilterLayers.indexOf(value) !== -1
                ? "wellTypeFilterListItem"
                : "wellTypeFilterListItem itemDisabled";
        node.setAttribute("class", nodeClasses);
        const imgSpan = document.createElement("span");
        imgSpan.setAttribute("class", "wellTypeIcon");
        renderPreviewHTML(symbol, {
            node: imgSpan,
            size: 8
        });
        node.append(imgSpan);

        const labelSpan = document.createElement("span");
        labelSpan.setAttribute("class", "wellTypeLabel");
        labelSpan.append(label);
        node.append(labelSpan);

        return {
            value,
            label,
            node
        };
    });
    return (
        <div>
            <ul className="wellTypeFilterList">
                {renderedSymbols.map(renderedSymbol => {
                    return (
                        <li
                            key={renderedSymbol.value}
                            className="wellTypeFilterListItem"
                            onClick={e => wellItemClicked(renderedSymbol.value)}
                            ref={ele => {
                                if (ele) {
                                    ele.innerHTML = "";
                                    ele.appendChild(renderedSymbol.node);
                                }
                            }}
                        />
                    );
                })}
            </ul>
        </div>
    );
}

export default WellTypeFilterPanel;
