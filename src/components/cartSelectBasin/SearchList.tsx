import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { getBasinCountyDetails, handleLastCountyBasinName, removeMultiCountyAndBasin } from "../store/actions/cart-select-basin-county-actions";
import { CountyDetailsObject } from "../models/redux-models";
import BasinSuggestionModal from "../common/Modal/BasinSuggestionModal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

function SearchList() {
    const {
        cartSelectBasinCounty: {
            basinSearchList,
            countySearchList,
            cartListItems,
            lastCountyBasinName
        },
        auth: {
            user: { access_token, counties_price_below_of_basin, company_data: { company_id }, },
        },
    } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const [state, setState] = useState<{
        showSuggestionModal: boolean,
        countyListOfSameBasin: CountyDetailsObject[],
        priceNearToBasin: boolean
    }>({
        showSuggestionModal: false,
        countyListOfSameBasin: [],
        priceNearToBasin: false
    });
    const { showSuggestionModal, countyListOfSameBasin, priceNearToBasin } = state;
    useEffect(() => {
        if (lastCountyBasinName) {
            let countyListOfSameBasin = (cartListItems.filter((_obj) => "county_name" in _obj && lastCountyBasinName === _obj.county_basin) as CountyDetailsObject[]);
            let totalCountyPrice = [...countyListOfSameBasin].map(_val => _val.price).reduce((accumulator, currentValue) => accumulator + currentValue,
                0)

            if (totalCountyPrice >= countyListOfSameBasin[0]['basin_price']) {
                setState((prev) => ({ ...prev, showSuggestionModal: true, countyListOfSameBasin: countyListOfSameBasin }))
                return
            }

            //price - sum of couty price <= % value that come from backend=======>for second pop
            if (countyListOfSameBasin[0]['basin_price'] - totalCountyPrice <= ((countyListOfSameBasin[0]['basin_price'] * counties_price_below_of_basin) / 100)) {
                setState((prev) => ({ ...prev, showSuggestionModal: true, countyListOfSameBasin: countyListOfSameBasin, priceNearToBasin: true }))
                return
            }

            // dispatch(handleLastCountyBasinName(""));
        }
        // eslint-disable-next-line 
    }, [JSON.stringify(cartListItems)])

    return (
        <>
            {(basinSearchList.length > 0 || countySearchList.length > 0) && (
                <div className="searchList scrollSection">
                    {/* basinSearchList */}
                    {basinSearchList.length > 0 && (
                        <>
                            <h3>BASIN</h3>
                            <ul>
                                {basinSearchList.map((item, index) => {
                                    return (
                                        <li key={index}>
                                            {item.basin_name}
                                            <a
                                                className={`add-cart ${cartListItems.filter(
                                                    (_item) =>
                                                        "basin_name" in
                                                        _item &&
                                                        _item.basin_name ===
                                                        item.basin_name
                                                ).length > 0
                                                    ? "added"
                                                    : ""
                                                    }`}
                                                href="void(0)"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (!company_id) {
                                                        toast.info("Please add your company details.");
                                                        navigate("/company-settings");
                                                        return
                                                    }
                                                    if (cartListItems.filter(
                                                        (_item) =>
                                                            "basin_name" in
                                                            _item &&
                                                            _item.basin_name ===
                                                            item.basin_name
                                                    ).length === 0) {
                                                        dispatch(
                                                            getBasinCountyDetails(
                                                                access_token,
                                                                {
                                                                    category:
                                                                        "basin",
                                                                    search: `${item.basin_name}`,
                                                                }
                                                            )
                                                        );
                                                    }

                                                }}
                                            >
                                                <i className="fa-solid fa-circle-plus"></i>{" "}
                                                {cartListItems.filter(
                                                    (_item) =>
                                                        "basin_name" in _item &&
                                                        _item.basin_name ===
                                                        item.basin_name
                                                ).length > 0
                                                    ? "Added"
                                                    : "Add to Cart"}
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </>
                    )}

                    {/* countySearchList */}
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
                                                            // className="add-cart added"
                                                            className={`add-cart ${cartListItems.filter(
                                                                (obj) =>
                                                                    "county_name" in
                                                                    obj &&
                                                                    obj.state_abbr ===
                                                                    item.iso_code &&
                                                                    _item ===
                                                                    obj.county_name
                                                            ).length > 0
                                                                ? "added"
                                                                : ""
                                                                }`}
                                                            href="void(0)"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                if (!company_id) {
                                                                    toast.info("Please add your company details.");
                                                                    navigate("/company-settings");
                                                                    return
                                                                }
                                                                if (cartListItems.filter(
                                                                    (obj) =>
                                                                        "county_name" in
                                                                        obj &&
                                                                        obj.state_abbr ===
                                                                        item.iso_code &&
                                                                        _item ===
                                                                        obj.county_name
                                                                ).length ===
                                                                    0) {
                                                                    dispatch(
                                                                        getBasinCountyDetails(
                                                                            access_token,
                                                                            {
                                                                                category:
                                                                                    "county",
                                                                                search: `${_item}`,
                                                                                state: `${item.iso_code}`,
                                                                            }
                                                                        )
                                                                    );
                                                                }

                                                            }}
                                                        >
                                                            <i className="fa-solid fa-circle-plus"></i>{" "}
                                                            {cartListItems.filter(
                                                                (obj) =>
                                                                    "county_name" in
                                                                    obj &&
                                                                    obj.state_abbr ===
                                                                    item.iso_code &&
                                                                    _item ===
                                                                    obj.county_name
                                                            ).length > 0
                                                                ? "Added"
                                                                : "Add to Cart"}
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
            {showSuggestionModal && (
                <BasinSuggestionModal
                    show={showSuggestionModal}
                    handleClose={() => {
                        dispatch(handleLastCountyBasinName(""));
                        setState((prev) => ({ ...prev, showSuggestionModal: false, countyListOfSameBasin: [], ...(priceNearToBasin && { priceNearToBasin: false }) }))
                    }}
                    priceNearToBasin={priceNearToBasin}
                    handleProceedToBtnClick={() => {
                        dispatch(removeMultiCountyAndBasin(access_token, {
                            item_id: countyListOfSameBasin.map((_item) => _item.id),
                            item_type: 2,
                            basin_name: lastCountyBasinName,
                        }))
                        dispatch(handleLastCountyBasinName(""));
                        setState((prev) => ({ ...prev, showSuggestionModal: false, countyListOfSameBasin: [], ...(priceNearToBasin && { priceNearToBasin: false }) }))
                    }} />
            )}
        </>
    );
}

export default SearchList;
