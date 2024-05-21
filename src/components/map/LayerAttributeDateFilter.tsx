import React from "react";
import AttributeDateFilter from "./AttributeDateFilter";
import { connect } from "react-redux";

// TODO - This is not germane here but the strongly-typed FilterAction payload requires
// me to pass it. I just ignore the value inside the reducer itself.
const filterAllIfEmpty = false;


interface ILayerAttributeDateFilter {
    headerText: any
}

class LayerAttributeDateFilter extends React.Component<ILayerAttributeDateFilter> {
    state = {
        headerText: ""
    };
    

    onFilter = (startDate: any) => {
        const endDate = getTodayAsSqlDateString();
    };

    onClearFilter = () => {
    };

    render() {
        const { headerText } = this.props;
        const startDate = ""; // No date set on initial load

        return (
            <AttributeDateFilter
                startDate={startDate}
                headerText={headerText}
                onFilter={this.onFilter}
                onClearFilter={this.onClearFilter}
            />
        );
    }
}

const getTodayAsSqlDateString = () => {
    const today = new Date();
    return dateToSqlDateString(today);
};

const getYesterdayAsSqlDateString = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return dateToSqlDateString(yesterday);
};

const dateToSqlDateString = (date: Date) => {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
};


const mapDispatchToProps = (dispatch: (arg0: { type: string; payload: { layerId: any; field: any; filterAllIfEmpty: boolean; value: any; }; }) => any, ownProps: { layerId: any; field: any; }) => {
 
};

export default connect(null, mapDispatchToProps)(LayerAttributeDateFilter);
