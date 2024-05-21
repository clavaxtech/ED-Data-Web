import React from "react";
import { JSX } from "react/jsx-runtime";



const AttributeFilter = ({ headerText, onAttributeClick, onSearch, options }: { 
    headerText: string, onAttributeClick: any, onSearch: any, options: {} }) => (
    <div className="attributeFilterContainer">
        <AttributeTitleBar text={headerText} />
        <AttributeSearchBar onSearch={onSearch} />
        <AttributesContainer options={options} onAttributeClick={onAttributeClick} />
    </div>
);


const AttributeTitleBar = ({ text }: {text: any}) => (
    <div className="titleContainer">
        <i className="fas fa-copy"></i>
        <span>{text}</span>
        <i className="fas fa-filter"></i>
    </div>
);

interface IAttributeSearchBar {
    onSearch: any
}

class AttributeSearchBar extends React.Component<IAttributeSearchBar> {
    state = {
        value: ""
    };

    handleChange = (event: any) => {
        this.setState({
            value: event.target.value
        });
        this.props.onSearch(event.target.value);
    };

    render() {
        return (
            <div className="searchContainer form-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search"
                    value={this.state.value}
                    onChange={this.handleChange}
                />
                <i className="fas fa-search"></i>
            </div>
        );
    }
}


const AttributesContainer = ({ onAttributeClick, options }: { onAttributeClick: any, options: any }) => (
    <div className="attributesContainer">
        {options
            .filter((o: { visible: any; }) => o.visible)
            .map((option: JSX.IntrinsicAttributes & Pick<{ imageSrc: any; onAttributeClick: any; selected: any; text: any; }, "onAttributeClick" | "text"> & { imageSrc?: any; selected?: any; } & { visible?: boolean | undefined; }) => (
                <AttributeOption {...option} key={option.text} onAttributeClick={onAttributeClick} />
            ))}
    </div>
);


const AttributeOption = ({ imageSrc, onAttributeClick, selected, text }:
    { imageSrc:string, onAttributeClick:any, selected: boolean, text: string }) => (
    <div className={`attributeOption ${selected ? "selected" : ""}`} onClick={() => onAttributeClick(text)}>
        {imageSrc && <img src={imageSrc} alt={text} />}
        <span className="attributeOptionText">{text}</span>
    </div>
);

AttributeOption.defaultProps = {
    imageSrc: "",
    selected: true,
    visible: true
};

export default AttributeFilter;
