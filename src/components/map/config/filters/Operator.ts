import FilterTypes from "./FilterTypes";
import LayerIds from "../layers/LayerIds";
import FieldNames from "../layers/FieldNames";

const filter = {
    field: FieldNames.wellPointsOperatorName,
    headerText: "Operator",
    layerId: LayerIds.offsetWells,
    type: FilterTypes.LAYER
};

export default filter;
