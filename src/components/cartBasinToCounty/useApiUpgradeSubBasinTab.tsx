import React from "react";
import { BasinObjApiList, CountyObjApiList } from "../models/submit-form";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { getBasinCountyDetails } from "../store/actions/cart-select-basin-county-actions";
import { toast } from "react-toastify";
import { removeItemFromCartInApiListUpgradeModal } from "../store/actions/cart-basin-to-county-actions";

function useApiUpgradeSubBasinTab(byCountyTabData: CountyObjApiList[]) {
    const {
        cartSelectBasinCounty: { cartListItems },
        auth: {
            user: { access_token },
        },
    } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();
    return [
        {
            title: "Basin",
            render: ({ basin_name }: BasinObjApiList) => {
                return <span>{basin_name}</span>;
            },
        },
        {
            title: "# Of Wells",
            render: ({ well_count }: BasinObjApiList) => {
                return <span>{well_count}</span>;
            },
        },
        {
            title: "# Of county",
            render: ({ county_count }: BasinObjApiList) => {
                return <span>{county_count}</span>;
            },
        },
        {
            title: "Action",
            render: ({ basin_name, price }: BasinObjApiList) => {
                let alreadyInCart = cartListItems.filter(
                    (item) =>
                        "basin_name" in item && item.basin_name === basin_name
                ).length;
                return (
                    // <button className="btn btn-cart">Add to cart- $49</button>
                    // <button className="btn btn-primary">Added</button>
                    <button
                        className={
                            alreadyInCart ? "btn btn-added" : "btn btn-cart"
                        }
                        onClick={() => {
                            if (!alreadyInCart) {
                                let tempArray: {
                                    county: string;
                                    state_abbr: string;
                                    basin_name?: string;
                                }[] = [];
                                byCountyTabData.forEach((item) => {
                                    if (
                                        JSON.stringify(cartListItems).includes(
                                            JSON.stringify(item.county)
                                        )
                                    ) {
                                        tempArray.push({
                                            county: item.county,
                                            state_abbr: item.state,
                                            basin_name: item.basin_name,
                                        });
                                    }
                                });

                                tempArray = tempArray.filter(
                                    (_item) => _item?.basin_name === basin_name
                                );
                                tempArray.length > 0 &&
                                    dispatch(
                                        removeItemFromCartInApiListUpgradeModal(
                                            access_token,
                                            {
                                                cat: "by_county",
                                                search: tempArray,
                                            },
                                            true
                                        )
                                    );
                                dispatch(
                                    getBasinCountyDetails(access_token, {
                                        search: basin_name,
                                        category: "basin",
                                    })
                                ).then((res) => {
                                    const { status, msg } = res;
                                    if (status === 200) {
                                        toast.success(msg);
                                        // dispatch(showCheckOutModal());
                                    } else {
                                        toast.error(msg);
                                    }
                                });
                            } else {
                                dispatch(
                                    removeItemFromCartInApiListUpgradeModal(
                                        access_token,
                                        {
                                            cat: "by_basin",
                                            search: [basin_name],
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

export default useApiUpgradeSubBasinTab;
