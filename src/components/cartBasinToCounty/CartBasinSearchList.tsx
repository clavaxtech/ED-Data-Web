import React from "react";
import { useAppSelector } from "../hooks/redux-hooks";

const CartBasinSearchList = () => {
    const {
        cartBasinToCounty: {
            basinSearchList,
            countySearchList
        },
    } = useAppSelector((state) => state);
    return (
        <>
            {(basinSearchList.length > 0 || countySearchList.length > 0) && (
                <div className="searchList scrollSection" style={{display:"none"}}>
                    {basinSearchList.length > 0 && (
                        <>
                            <h3>BASIN</h3>
                            <ul>
                                {basinSearchList.map((item, index) => {
                                    return (
                                        <li key={index}>
                                            {item.basin_name}
                                            <a
                                                className={`add-cart`}
                                                href="void(0)"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                }}
                                            >
                                                <i className="fa-solid fa-circle-plus"></i>{" "}
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </>
                    )}

                    {countySearchList.length > 0 && (
                        <ul>
                            {countySearchList.map((item, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <h3>{item.state_name}</h3>
                                        {item.county_name.map(
                                            (_item, _index) => {
                                                return (
                                                    <li key={_index}>
                                                        {_item}
                                                        <a
                                                            className={`add-cart`}
                                                            href="void(0)"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                            }}
                                                        >
                                                            <i className="fa-solid fa-circle-plus"></i>{" "}
                                                        </a>
                                                    </li>
                                                );
                                            }
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </ul>
                    )}
                </div>
            )}
        </>
    );
}

export default CartBasinSearchList;
