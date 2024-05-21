import React from "react";
import LayerAttributeFilter from "./LayerAttributeFilter";
import LayerAttributeDateFilter from "./LayerAttributeDateFilter";
import FilterTypes from "./config/filters/FilterTypes"
import Filters from "./config/filters";

import "./css/attributeFilter.scss";

const getFilterComponent = (filter: { type: any; field: any; layerId: any; headerText: React.Key | null | undefined; }) => {
    switch (filter.type) {
        case FilterTypes.LAYER: {
            return (
                <LayerAttributeFilter
                    field={filter.field}
                    layerId={filter.layerId}
                    headerText={filter.headerText}
                    key={filter.headerText} map={undefined} mapView={undefined} allValues={undefined}                />
            );
        }
        case FilterTypes.DATE: {
            return (
                <LayerAttributeDateFilter
                    field={filter.field}
                    layerId={filter.layerId}
                    headerText={filter.headerText}
                    key={filter.headerText}              
                />
            );
        }
        default: {
            return
        }
    }
};
const AttributeFilterPanel = () => (
    <div className="attributeFilterPanelContainer">{Filters.map(getFilterComponent)}</div>
);

export default AttributeFilterPanel;
