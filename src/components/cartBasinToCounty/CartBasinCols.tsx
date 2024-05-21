import React from "react";
import { searchListObject } from "../models/page-props";


const CartBasinCols = (
    onClickHandler: (e: React.ChangeEvent<HTMLInputElement>) => void,
    searchList: searchListObject[],
    filterTableColumn: {
        "header": string, "label": string, "status": boolean, renderFn: (props: searchListObject)
            => number | string | JSX.Element
    }[]
) => {
    const TableColumnFilterBasedOnStatus = filterTableColumn.length > 0 ? filterTableColumn.map(({ header, label, status, renderFn }) => {
        if (status) {
            return {
                title: header.toUpperCase(),
                thId: `${label}_col_head`,
                tdClassName: `${label}_col`,
                render: renderFn
            }
        } else return undefined;
    }).filter(item => item) : []

    return [
        {
            renderHeadTitle: () => {
                return (
                    <div className="custom-checkbox">
                        <input
                            name="selectAll"
                            id="selectAll"
                            type="checkbox"
                            onChange={onClickHandler}
                            className="checkmark"
                            checked={
                                searchList.filter(val => val.checked === true).length === searchList.length ? true : false
                            }
                        />
                        <label
                            htmlFor="selectAll"
                            className="custom-label"
                        ></label>
                    </div>
                )
            },
            render: (props: searchListObject) => {
                return (
                    <>
                        <div className="custom-checkbox">
                            <input
                                name={props.id}
                                id={props.id}
                                type="checkbox"
                                className="checkmark"
                                onChange={onClickHandler}
                                checked={props.checked}
                            />
                            <label
                                htmlFor={props.id}
                                className="custom-label"
                            ></label>
                        </div>
                    </>
                )
            }
        },
        ...TableColumnFilterBasedOnStatus
    ]
};

export default CartBasinCols;
