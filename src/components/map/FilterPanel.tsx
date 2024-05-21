import React, { DOMElement } from "react";
import WellTypeFilterPanel from "./WellTypeFilterPanel";
import AttributeFilterPanel from "./AttributeFilterPanel";

import "./css/filterPanel.scss";

interface IFilterPanelState {
    keyPanelExpanded: boolean,
    filterPanelExpanded: boolean
}

interface IFilterPanelProps {
    useFilter: boolean,
    useLegend: boolean
}

class FilterPanel extends React.Component<IFilterPanelProps> {
    state: IFilterPanelState = {
        keyPanelExpanded: false,
        filterPanelExpanded: true
    };

    toggleKeyPanel = () => {
        this.setState((prevState: IFilterPanelState, _) => ({ keyPanelExpanded: !prevState.keyPanelExpanded }));
    };

    toggleFilterPanel = () => {
        this.setState((prevState: IFilterPanelState, _) => ({ filterPanelExpanded: !prevState.filterPanelExpanded }));
    };

    render() {
        const { useFilter, useLegend } = this.props;
        return (
            <div className="filterPanel">
                {useLegend && (
                    <>
                        <FilterPanelTitleBar onClick={this.toggleKeyPanel} title={"Map Legend"} expanded={this.state.keyPanelExpanded} />
                        <FilterPanelBody isExpanded={this.state.keyPanelExpanded}>
                            <WellTypeFilterPanel setFilter={undefined} />
                        </FilterPanelBody>
                    </>
                )}
                {useLegend && useFilter && <div className="filterPanelSeparator"></div>}
                {useFilter && (
                    <>
                        <FilterPanelTitleBar onClick={this.toggleFilterPanel} title={"Filter"} expanded={this.state.keyPanelExpanded} />
                        <FilterPanelBody isExpanded={this.state.filterPanelExpanded}>
                            <AttributeFilterPanel  />
                        </FilterPanelBody>
                    </>
                )}
            </div>
        );
    }
}

const FilterPanelTitleBar = ({ onClick, title, expanded }:{ onClick:any, title:string, expanded:boolean }) => (
    <div className="filterPanelTitleBar" onClick={onClick}>
        {title}
        <img className='filterButton' src={ expanded ? "/images/down-angle.png" : "/images/up-angle.png" } />
    </div>
);

const filterPanelBodyStyle = {
    display: "block",
    paddingTop: "10px",
    paddingBottom: "10px",
    userSelect: "none",
    animation: "fadein 0.35s ease-in"
};

const filterPanelBodyStyleCollapsed = {
    display: "none",
    paddingTop: "10px",
    paddingBottom: "10px",
    userSelect: "none",
    animation: "fadein 0.35s ease-in"
};

const FilterPanelBody = ({isExpanded, children}:{isExpanded:boolean, children:any}) => 
    //@ts-ignore
    (<div style={isExpanded ? filterPanelBodyStyle : filterPanelBodyStyleCollapsed}>{children}</div>);

export default FilterPanel;
