import FilterTypes from "./FilterTypes";
import LayerIds from "../layers/LayerIds";
import FieldNames from "../layers/FieldNames";

const filter = {
    field: FieldNames.wellPointsPermitDate,
    headerText: "Permit Date",
    layerId: LayerIds.offsetWells,
    type: FilterTypes.DATE
};

export default filter;
