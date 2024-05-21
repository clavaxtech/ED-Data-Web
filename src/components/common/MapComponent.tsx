import React from 'react';
import Map from '../map/Map';
import AoIMap from '../map/AoIMap';

interface IMapComponentProps {
    mapType: MapType
    allowCreateAoI?: boolean;
    allowSelection?: boolean;
}

export enum MapType {
    AOI,
    Cart
}

export const MapComponent = (props:IMapComponentProps) => {
    const getMapType = () => {
        if (props?.mapType === MapType.AOI) {
           return(<AoIMap allowCreateAoI={props?.allowCreateAoI ? props.allowCreateAoI : false} />)
        }
        if (props?.mapType === MapType.Cart) {
            return(<Map allowSelection={props?.allowSelection ? props.allowSelection : false} />)
        }
        return (<div/>)
    }
    return (
        <React.Fragment>
            <figure>
                {getMapType()}
            </figure>
        </React.Fragment>
    )
}
