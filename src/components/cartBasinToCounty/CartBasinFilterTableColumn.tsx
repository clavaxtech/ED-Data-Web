import React from "react";
import { CartBasinFilterTableColumnProps } from "../models/page-props";

const CartBasinFilterTableColumn = (props: CartBasinFilterTableColumnProps) => {
    let {
        onChangeHandler,
        filterTableColumn,
        handleDragStartHandler,
        handleDragEnterHandler,
    } = props;
    return (
        <div className="columnList">
            {filterTableColumn.length > 0 &&
                filterTableColumn.map(({ header, label }, index) => (
                    <div
                        className="item"
                        key={index}
                        onDragStart={(e) => handleDragStartHandler(e, index)}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnter={(e) => handleDragEnterHandler(e, index)}
                        draggable
                    >
                        <div className="columnName">
                            <span>
                                <i className="fa-solid fa-ellipsis-vertical"></i>
                                <i className="fa-solid fa-ellipsis-vertical"></i>
                            </span>
                            {header}
                        </div>
                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                checked={
                                    filterTableColumn.find(
                                        (val) => val.label === label
                                    )?.status || false
                                }
                                type="checkbox"
                                id="flexSwitchCheckDefault"
                                value={label}
                                onChange={onChangeHandler}
                            />
                            <label
                                className="form-check-label"
                                htmlFor="flexSwitchCheckDefault"
                            ></label>
                        </div>
                    </div>
                ))}
        </div>
    );
};
export default CartBasinFilterTableColumn;
