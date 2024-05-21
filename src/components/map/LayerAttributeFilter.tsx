import React, { useRef, useEffect, useState } from "react";
import { connect } from "react-redux";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { SET_FILTER, TOGGLE_FILTER_VALUE } from "./redux/filters";
import { getAttributeFilterValues } from "./redux/attributeFilterValues";

import AttributeFilter from "./AttributeFilter";

interface ILayerAttributeFilterState {
    allValues: any,
    esri: any,
    filters: any,
    attributeFilterValues: any,
    options: any
}

interface ILayerAttributeFilterProps {
    map: any | undefined,
    mapView: any | undefined,
    allValues: any | undefined,
    layerId: string,
    field: string,
    headerText: any
}

// In the case of Attribute filters, if all items are deselected we want no filtering
// to occur - ie, all items in layer pass through.
const filterAllIfEmpty = false;

function LayerAttributeFilter(props: ILayerAttributeFilterProps) {
    const [options, setOptions] = useState({});
    const [allValues, setAllValues] = useState(true);

    const {
        layers
    } = useAppSelector((state) => state.filters);

    //TODO: Figure out attribute filters

    useEffect(() => {
        // if (allValues != props.allValues) {
        //     setOptions(props.allValues
        //         .filter((value:any) => !!value)
        //         .map((value:any) => ({
        //             text: value,
        //             selected: false, // Not selected by default
        //             visible: true // Visible in the list by default
        //         }))
        //     );
        // } else {
        //     const visibleValues = layers[props.layerId] && layers[props.layerId][props.field] 
        //         ? layers[props.layerId][props.field]
        //         : []
        //     const tmpOptions = options && options.map((option: { visible: any; text: string; }) => {
        //         option.selected = visibleValues.indexOf(option.text) !== -1;
        //         return option;
        //     })
        //     setOptions();
        // }
    }, [layers]);
    
    const onAttributeClick = (value: any) => {
        //@ts-ignore
        dispatch(TOGGLE_FILTER_VALUE({
            layerId: props.layerId, 
            filterAllIfEmpty, 
            value, 
            field: props.field}
        ))
    };

    const onSearch = (value: string) => {
        // const tmpOptions = options.map((option: { visible: any; text: string; }) => {
        //     option.visible = option.text.toLowerCase().includes(value.toLowerCase());
        //     return option;
        // });
        // setOptions(tmpOptions);
    };

    
    const { headerText } = props;
    return (
        <AttributeFilter
            headerText={headerText}
            onSearch={onSearch}
            onAttributeClick={onAttributeClick}
            options={options}
        />
    );
    
}

export default LayerAttributeFilter;
