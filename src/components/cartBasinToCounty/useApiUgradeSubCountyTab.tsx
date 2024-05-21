import React from "react";
import { CountyObjApiList } from "../models/submit-form";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { getBasinCountyDetails } from "../store/actions/cart-select-basin-county-actions";
import { toast } from "react-toastify";
import { removeItemFromCartInApiListUpgradeModal } from "../store/actions/cart-basin-to-county-actions";

function useApiUpgradeSubCountyTab() {
    const {
        cartSelectBasinCounty: { cartListItems },
        auth: {
            user: { access_token },
        },
    } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();

    return [
        {
            title: "County",
            render: ({ county }: CountyObjApiList) => {
                return <span>{county}</span>;
            },
        },
        {
            title: "# Of Wells",
            render: ({ well_total }: CountyObjApiList) => {
                return <span>{well_total}</span>;
            },
        },
        {
            title: "Basin",
            render: ({ basin_name }: CountyObjApiList) => {
                return <span>{basin_name}</span>;
            },
        },
        {
            title: "Action",
            render: ({ county, state, price }: CountyObjApiList) => {
                let alreadyInCart = cartListItems.filter(
                    (item) =>
                        "county_name" in item &&
                        item.county_name === county &&
                        "state_abbr" in item &&
                        item.state_abbr === state
                ).length;
                return (
                    // <button className="btn btn-cart">Add to cart</button>
                    // <button className="btn btn-added"><i className="fa-solid fa-circle-exclamation"></i> Added</button>
                    <button
                        className={
                            alreadyInCart ? "btn btn-added" : "btn btn-cart"
                        }
                        onClick={() => {
                            if (!alreadyInCart) {
                                dispatch(
                                    getBasinCountyDetails(access_token, {
                                        search: county,
                                        category: "county",
                                        state: state,
                                    })
                                ).then((res) => {
                                    const { status, msg } = res;
                                    if (status === 200) {
                                        toast.success(msg);
                                        // dispatch(showCheckOutModal());
                                    } else {
                                        // toast.error(msg);
                                    }
                                });
                            } else {
                                dispatch(
                                    removeItemFromCartInApiListUpgradeModal(
                                        access_token,
                                        {
                                            cat: "by_county",
                                            search: [
                                                {
                                                    county: county,
                                                    state_abbr: state,
                                                },
                                            ],
                                        }
                                    )
                                );
                            }
                        }}
                    >
                        {alreadyInCart ? (
                            <>
                                <span>
                                    <i className="fa-solid fa-circle-exclamation"></i>
                                </span>
                                &nbsp; Added
                            </>
                        ) : (
                            `Add to cart- $ ${price}`
                        )}
                    </button>
                );
            },
        },
    ];
}

export default useApiUpgradeSubCountyTab;
