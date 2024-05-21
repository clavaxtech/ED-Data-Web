import React from "react";
import { cardProps } from "../models/page-props";
import { FormatLongNumber, USDollar } from "../../utils/helper";
import moment from "moment";

const Card = (props: cardProps) => {
    const { item, removeItem, free_trial_period_enabled } = props;
    return (
        <>
            <div className="selected-basin-box">
                <div className="basin-left">
                    <div className="small-map">
                        {/* <img src="images/basin-small-map.svg" alt="" /> */}
                        <img src={item.png} alt="" />
                    </div>
                    <div className={`price ${free_trial_period_enabled ? "cross-price" : ""}`}>
                        <div className="itemPrice">{USDollar.format(item.price)}</div>
                        <span>Per month</span>
                    </div>
                </div>
                <div className="basin-right">
                    <a
                        href="void:(0)"
                        onClick={(e) => {
                            e.preventDefault();
                            removeItem(item.id, "basin_name" in item ? 1 : 2);
                        }}
                        className="cross"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </a>
                    <div className="title">
                        {"basin_name" in item
                            ? `${item.basin_name}`
                            : `${item.county_name}`}
                        {item.end_period && item.is_deleted ? (
                            <span>
                                Cancelled - Active Untill:{" "}
                                {moment(item.end_period).format("MMM-DD-YYYY")}
                            </span>
                        ) : (
                            <></>
                        )}
                    </div>
                    <div className="basin-list">
                        {/* <a
                        href="void:(0)"
                        onClick={(e) => e.preventDefault()}
                        className="down-arrow"
                    >
                        <i className="fa-solid fa-angle-down"></i>
                    </a> */}
                        <table border={0} cellSpacing={"0"} cellPadding="0">
                            <tbody>
                                {"basin_name" in item && (
                                    <tr>
                                        <td>County</td>
                                        <td>
                                            <span>{item.county_count}</span>
                                        </td>
                                    </tr>
                                )}
                                {"county_name" in item && (
                                    <tr>
                                        <td>State or Province</td>
                                        <td>
                                            <span>{item.state_abbr}</span>
                                        </td>
                                    </tr>
                                )}
                                <tr>
                                    <td>Horizontal Wells</td>
                                    <td>
                                        <span>
                                            {FormatLongNumber(
                                                item.horizontal_wells
                                            )}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Active Wells</td>
                                    <td>
                                        <span>
                                            {FormatLongNumber(item.active_wells)}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Rigs</td>
                                    <td>
                                        <span>{FormatLongNumber(item.rigs)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Permits</td>
                                    <td>
                                        <span>
                                            {FormatLongNumber(item.permits)}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>{`Oil Production`}</td>
                                    <td>
                                        <span>
                                            {FormatLongNumber(item.oil_production)}{" "}
                                            bbl/day
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>{`Gas Production`}</td>
                                    <td>
                                        <span>
                                            {FormatLongNumber(item.gas_production)}{" "}
                                            cf/day
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div >
        </>
    );
};

export default Card;
