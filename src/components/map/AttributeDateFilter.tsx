import React from "react";


// TODO this could be generalized with AttributeTitleBar by specifying icon(s) via props too...
//@ts-ignore
const AttributeDateTitleBar = ({ text }) => (
    <div className="titleContainer">
        <i className="fas fa-calendar"></i>
        <span>{text}</span>
        <i className="fas fa-filter"></i>
    </div>
);

interface IAttributeDatePickerBar {
    startDate: any,
    onFilter: any,
    onClearFilter: any
}


class AttributeDatePickerBar extends React.Component<IAttributeDatePickerBar> {
    state = {
        //@ts-ignore
        startDate: this.props.startDate
    };

    //@ts-ignore
    handleStartDateChange = (event) => {
        this.setState({
            startDate: event.target.value
        });
    };

    applyFilter = () => {
        if (this.enableApply()) {
            //@ts-ignore
            this.props.onFilter(this.state.startDate);
        }
    };

    clearFilter = () => {
        this.setState(
            {
                startDate: "",
            },
            () => {
                //@ts-ignore
                this.props.onClearFilter();
            }
        );
    };

    enableApply = () => {
        return this.state.startDate;
    };

    render() {
        return (
            <div>
                <div className="dateInputRow">
                    <span>
                        <input
                            className="dateSelectorInput"
                            type="date"
                            value={this.state.startDate}
                            onChange={this.handleStartDateChange}
                        />
                        <span className="dateLabel">&nbsp;to Present</span>
                    </span>
                </div>
                <div className="dateButtonRow">
                    <span
                        className={this.enableApply() ? "dateApplyClearButton" : "dateApplyClearButton itemDisabled"}
                        title="Apply"
                        onClick={this.applyFilter}
                    >
                        Apply
                    </span>
                    <span className="dateApplyClearButton" title="Clear" onClick={this.clearFilter}>
                        Clear
                    </span>
                </div>
            </div>
        );
    }
}


//@ts-ignore
const AttributeDateFilter = ({
    headerText,
    startDate,
    onFilter,
    onClearFilter
}: {headerText:any, startDate:any, onFilter:any, onClearFilter:any}) => (
    <div className="attributeFilterContainer">
        <AttributeDateTitleBar text={headerText} />
        <AttributeDatePickerBar 
            startDate={startDate}
            onFilter={onFilter}
            onClearFilter={onClearFilter}
        />
    </div>
);

export default AttributeDateFilter;
