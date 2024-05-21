import React from "react";
import {
    ApiListTableFormData,
    OptionType,
    csvApiDataObj,
} from "../models/submit-form";
import AsyncSelect from "../common/AsyncSelect";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { GroupBase, OptionsOrGroups } from "react-select";
import { Control, FieldErrors, UseFormSetValue } from "react-hook-form";
import { fetchSuggestionWellName } from "../store/actions/cart-select-basin-county-actions";
import { showCheckOutModal } from "../store/actions/modal-actions";
import { addAllBasinOrCountyToCart } from "../store/actions/cart-basin-to-county-actions";

const CartBasinApiCols = (
    onClickHandler: (e: React.ChangeEvent<HTMLInputElement>) => void,
    control: Control<ApiListTableFormData, any>,
    errors: FieldErrors<ApiListTableFormData>,
    handleCloseHandler: (
        props: { [x: string]: any },
        geometry?: string | undefined
    ) => void,
    setValue: UseFormSetValue<ApiListTableFormData>,
    csvApiFileData: csvApiDataObj[]
) => {
    const dispatch = useAppDispatch();

    const {
        auth: {
            user: { access_token },
        },
        cartSelectBasinCounty: { cartListItems },
    } = useAppSelector((state) => state);
    const loadOptions = async (
        search: string,
        prevOptions: OptionsOrGroups<OptionType, GroupBase<OptionType>>,
        { page }: any
    ) => {
        let hasMore = false,
            dataList: OptionType[] = [];
        if (search.length >= 2) {
            const res = await dispatch(
                fetchSuggestionWellName(access_token, { wellName: search })
            );
            if (res && res.status === 200) {
                const { data } = res;
                dataList = data.map((_item) => ({
                    label: `API: ${_item.api} - ${_item.well_name}`,
                    value: _item.api,
                }));
            }
        }
        return {
            options: dataList,
            hasMore: hasMore,
            additional: {
                page: page + 1,
            },
        };
    };
    return [
        {
            title: "#",
            thId: "api_col_head",
            tdClassName: "api_col",
            render: (props: csvApiDataObj, index: number) => {
                return <span>{index + 1}</span>;
            },
        },
        {
            title: "API",
            thId: "api_col_head",
            tdClassName: "api_col",
            render: (props: csvApiDataObj) => {
                return <span>{props.api === "na" ? "-" : props.api}</span>;
            },
        },
        {
            title: "Well Name",
            thId: "api_col_head",
            tdClassName: "api_col",
            render: (props: csvApiDataObj) => {
                return <span>{props.well_name?props.well_name:"-"}</span>;
            },
        },
        {
            title: "COUNTY",
            thId: "county_col_head",
            tdClassName: "county_col",
            render: (props: csvApiDataObj) => {
                return <span>{props.county}</span>;
            },
        },
        {
            title: "STATE",
            thId: "state_col_head",
            tdClassName: "state_col",
            render: (props: csvApiDataObj) => {
                return <span>{props.state}</span>;
            },
        },
        {
            title: "STATUS",
            thId: "status_col_head",
            tdClassName: "status_col",
            render: (props: csvApiDataObj) => {
                return (
                    <span
                        className={
                            props.status === "no match"
                                ? "unmatched"
                                : props.status === "matched"
                                    ? "matched"
                                    : props.status === "not in plan"
                                        ? "unsubscribed"
                                        : ""
                        }
                    >
                        <i className="fa-solid fa-circle-exclamation"></i>{" "}
                        {props.status === "no match"
                            ? "Unmatched"
                            : props.status}
                    </span>
                );
            },
        },
        {
            title: "WELL MATCHING",
            thId: "well_matching_col_head",
            tdClassName: "well_matching_col",
            render: (props: csvApiDataObj, index: number) => {
                return (
                    <div className="wellmatching">
                        {props.status !== "not in plan" ? (
                            <>
                                <AsyncSelect
                                    name={`wellMatching[${index}].name`}
                                    debounceTimeout={500}
                                    placeholder="Enter the well name"
                                    control={control}
                                    isMulti={true}
                                    className={
                                        props.status === "matched"
                                            ? "active"
                                            : ""
                                    }
                                    errorMsg={
                                        Array.isArray(errors.wellMatching)
                                            ? errors.wellMatching[index]?.[
                                            "name"
                                            ]?.["message"]
                                            : ""
                                    }
                                    value={props.wellMatching}
                                    additional={{
                                        page: 1,
                                    }}
                                    onChange={(val: OptionType[]) => {
                                        setValue(
                                            `wellMatching.${index}.name`,
                                            val.length === 0 ? null : val
                                        );
                                        handleCloseHandler({
                                            csvApiFileData: csvApiFileData.map(
                                                (item) =>
                                                    props.id === item.id
                                                        ? {
                                                            ...item,
                                                            wellMatching:
                                                                val.length ===
                                                                    0
                                                                    ? null
                                                                    : val,
                                                            ...(val.length ===
                                                                0 &&
                                                                item.status ===
                                                                "matched" && {
                                                                status: "no match",
                                                            }),
                                                            ...(item.status ===
                                                                "no match" &&
                                                                val.length >
                                                                0 && {
                                                                status: "matched",
                                                            }),
                                                        }
                                                        : item
                                            ),
                                        });
                                    }}
                                    components={{ DropdownIndicator: null }}
                                    closeMenuOnSelect={false}
                                    isClearable={false}
                                    backspaceRemovesValue={false}
                                    loadOptions={loadOptions}
                                />
                                {Array.isArray(props.wellMatching) &&
                                    props.wellMatching.length > 0 && (
                                        <div>
                                            {" "}
                                            <button
                                                type="button"
                                                className="btn btn-del"
                                            >
                                                <i
                                                    className="fa-solid fa-trash"
                                                    onClick={() => {
                                                        setValue(
                                                            `wellMatching.${index}.name`,
                                                            null
                                                        );
                                                        handleCloseHandler({
                                                            csvApiFileData:
                                                                csvApiFileData.map(
                                                                    (item) =>
                                                                        props.id ===
                                                                            item.id
                                                                            ? {
                                                                                ...item,
                                                                                wellMatching:
                                                                                    null,
                                                                                status: "no match",
                                                                            }
                                                                            : item
                                                                ),
                                                        });
                                                    }}
                                                ></i>
                                            </button>
                                        </div>
                                    )}
                            </>
                        ) : (
                            <button
                                type="button"
                                className={
                                    !JSON.stringify(cartListItems).includes(
                                        JSON.stringify(props.county)
                                    )
                                        ? "btn btn-addplan"
                                        : "btn btn-addedplan"
                                }
                                onClick={() => {
                                    if (
                                        !JSON.stringify(cartListItems).includes(
                                            JSON.stringify(props.county)
                                        )
                                    ) {
                                        dispatch(
                                            addAllBasinOrCountyToCart(
                                                access_token,
                                                {
                                                    cat: "county",
                                                    search: [
                                                        {
                                                            state_abbr:
                                                                props.state,
                                                            county: props.county,
                                                        },
                                                    ],
                                                }
                                            )
                                        ).then((res) => {
                                            const { status } = res;
                                            if (status === 200) {
                                                dispatch(showCheckOutModal());
                                            }
                                        });
                                    } else {
                                        dispatch(showCheckOutModal());
                                        // dispatch(
                                        //     removeItemFromCartInApiListUpgradeModal(
                                        //         access_token,
                                        //         {
                                        //             cat: "county",
                                        //             search: [
                                        //                 {
                                        //                     state_abbr:
                                        //                         props.state,
                                        //                     county: props.county,
                                        //                 },
                                        //             ],
                                        //         }
                                        //     )
                                        // );
                                    }
                                }}
                            >
                                {!JSON.stringify(cartListItems).includes(
                                    JSON.stringify(props.county)
                                ) ? (
                                    "Add to my plan"
                                ) : (
                                    <>
                                        {" "}
                                        <span>
                                            <i className="fa-solid fa-circle-exclamation"></i>
                                        </span>
                                        &nbsp;Added
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                );
            },
        },
    ];
};

export default CartBasinApiCols;
