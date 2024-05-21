import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import Scrollbars from "react-custom-scrollbars";
import SaveSegmentModal from "./SaveSegmentModal";
import { toggleSaveSegmentModal } from "../../store/actions/modal-actions";
import { useForm } from "react-hook-form";
import {
    AdvFilterSubmitForm,
    OptionType,
    SaveSegmentAdvFilterObj,
} from "../../models/submit-form";
import { advancedFilterValidation } from "../../../Helper/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import Moment from "moment";

import { DatePickerComponent } from "../DatePicker";
import {
    clearPermitData,
    clearProductionData,
    clearRigsData,
    clearWellsData,
    fetchStateInAdvFilter,
    handleAdvFilterSearch,
    handlePageChange,
    saveSegmentAdvFilter,
    showHideAdvFilter,
    updateSegmentAdvFilter,
} from "../../store/actions/wells-rigs-action";
import moment from "moment";
import { WellsRigsModel } from "../../models/redux-models";
import AsyncSelect from "../AsyncSelect";
import { GroupBase, OptionsOrGroups } from "react-select";
import { clearActiveOrArchiveSegmentList, handleSelectedRowId, handleSelectedSegmentData } from "../../store/actions/segments-actions";
import { FilterDataType } from "../../segments/Content";
import { inputNumber } from "../../../utils/helper";
// import { advancedFilterValidation } from "../../../Helper/validation";
// import { advFilterSubmitForm } from "../../models/submit-form";
// import { yupResolver } from "@hookform/resolvers/yup";

function AdvancedFilter() {
    const {
        auth: {
            user: { access_token },
        },
        wellsAndRigs: {
            advFilter,
            rigsFieldChoices,
            groupChoices,
            wellsAndPermitFieldChoices,
            operatorChoices,
            tabIndex,
            optionChoice,
            showTableLoader,
        },
        modal: { saveSegmentModal },
        segments: { selectedRowId }
    } = useAppSelector((state) => state);

    const btnRef = useRef(2);
    const inputFocusRef = useRef("");
    // x,y===>storing index x=obj index, y= filter index
    const countyIndexRef = useRef("");
    const segmentNameRef = useRef("");

    const [state, setState] = useState<{
        obj: {
            condition: string;
            filter: number[];
            filterCounter: number;
        }[];
        conditionList: { cond: string[] }[];
        groupList: string[];
    }>({
        obj: [
            {
                condition: "1",
                filter: [],
                filterCounter: 0,
            },
        ],
        conditionList: [{ cond: [] }],
        groupList: ["4"],
    });

    const { obj, conditionList, groupList } = state;


    const addAdvFilterOpt = (value: string) => {
        setState((prev) => ({
            ...prev,
            obj: [
                ...prev.obj,
                { condition: value, filter: [], filterCounter: 0 },
            ],
        }));
    };
    const addFilter = (index: number) => {
        setState((prev) => ({
            ...prev,
            obj: prev.obj.map((item, _index) =>
                index === _index
                    ? {
                        ...item,
                        filter: [...item.filter, item.filterCounter],
                        filterCounter: item.filterCounter + 1,
                    }
                    : item
            ),
        }));
    };

    const removeAdvFilterOpt = (index: number) => {
        let data = watch("obj").filter((obj, pos) => pos !== index);
        setValue("obj", data);
        setState((prev) => ({
            ...prev,
            obj: prev.obj.filter((item, _index) => _index !== index),
            conditionList: prev.conditionList.filter((item, i) => i !== index),
            groupList: prev.groupList.filter((item, pos) => pos !== index),
        }));
    };
    const removeFilter = (objIndex: number, index: number) => {
        let data = watch("obj").map((obj, pos) =>
            pos === objIndex
                ? {
                    ...obj,
                    filter: obj["filter"].filter(
                        (obj2, pos2) => pos2 !== index
                    ),
                }
                : obj
        );
        setValue("obj", data);
        setState((prev) => ({
            ...prev,
            obj: prev.obj.map((item, _index) =>
                objIndex === _index
                    ? {
                        ...item,
                        filter: item["filter"].filter(
                            (_item, _i) => _i !== index
                        ),
                        filterCounter: item.filterCounter - 1,
                    }
                    : item
            ),
            conditionList: prev.conditionList.map((item, i) =>
                i === objIndex
                    ? {
                        cond: item.cond.filter(
                            (_item, _index) => _index !== index
                        ),
                    }
                    : item
            ),
        }));
    };

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
        watch,
        control,
        getValues,
        clearErrors,
    } = useForm<AdvFilterSubmitForm>({
        resolver: yupResolver(advancedFilterValidation),
    });

    const clearFilterFn = () => {
        segmentNameRef.current && (segmentNameRef.current = "");
        segmentIdRef.current && (segmentIdRef.current = 0);
        reset();
        setValue(`obj.${0}.condition`, "1")
        setState((prev) => ({
            ...prev,
            obj: [
                {
                    condition: "1",
                    filter: [],
                    filterCounter: 0,
                },
            ],
            conditionList: [{ cond: [] }],
            groupList: ["4"],
        }));
    };

    const dispatch = useAppDispatch();
    const segmentIdRef = useRef(0);

    const onSubmit = (data: AdvFilterSubmitForm) => {
        const { obj } = data;
        let atleastOneCondition = "";
        obj.length > 0 &&
            obj.forEach((item, index) => {
                if (!("filter" in item) || item.filter.length === 0) {
                    atleastOneCondition =
                        "Atleast one conditon is required in each group.";
                    return;
                }
            });
        if (atleastOneCondition) {
            toast.error("Atleast one conditon is required in each group.");
            return;
        }

        if (btnRef.current === 1) {
            dispatch(toggleSaveSegmentModal());
        } else {
            let tempData = getValues("obj");
            let formData: WellsRigsModel["filter_param"] = [];
            tempData.forEach((item, index) => {
                item.filter.forEach((_item, _index) => {
                    index > 0 &&
                        formData.push({ group_cond: groupList[index] });
                    formData.push({
                        option_choice: item.condition,
                        data_point: _item.dataPoint,
                        data_point_field: _item.fields,
                        operator_choice: _item.operator,
                        filter_value:
                            (_item.fields === "16" ||
                                _item.fields === "17" ||
                                _item.fields === "18") &&
                                _item.operator === "14"
                                ? {
                                    start: moment(_item.value).format(
                                        "MMM-DD-YYYY"
                                    ),
                                    end: _item.endDate
                                        ? moment(_item.endDate).format(
                                            "MMM-DD-YYYY"
                                        )
                                        : "",
                                }
                                : _item.fields === "7"
                                    ? `${_item.value}${_item.operator === "4"
                                        ? `_${_item.upperValue}`
                                        : ""
                                    }`
                                    : _item.fields === "9"
                                        ? `${_item.value}_${(_item.upperValue as OptionType)?.value
                                        }`
                                        : `${_item.value}`,
                    });
                });
            });
            dispatch(
                handleAdvFilterSearch({
                    filter: "advanced",
                    filter_param: formData,
                    segment_id: segmentIdRef.current,
                })
            );


            if (tabIndex === 0) {
                dispatch(handlePageChange(1));
                dispatch(clearWellsData());
            } else if (tabIndex === 1) {
                dispatch(handlePageChange(1));
                dispatch(clearRigsData());
            } else if (tabIndex === 2) {
                dispatch(handlePageChange(1));
                dispatch(clearPermitData());
            } else {
                dispatch(handlePageChange(1));
                dispatch(clearProductionData());
            }
        }
    };
    const [advFilterRecall, setAdvFilterRecall] = useState(false)
    useEffect(() => {
        if (!advFilter) {
            clearFilterFn();
            setValue(`obj.${0}.condition`, "1");
        } else {
            localStorage.getItem("advFilData") && setAdvFilterRecall(true)
        }
        // eslint-disable-next-line
    }, [advFilter]);

    useEffect(() => {
        if (!advFilterRecall) {
            return
        }
        advFilter && dispatch(showHideAdvFilter());
        let advFilData = localStorage.getItem("advFilData")
            ? JSON.parse(localStorage.getItem("advFilData") as string)
            : null;
        localStorage.removeItem("advFilData");

        if (advFilData) {
            dispatch(showHideAdvFilter());
            let tempData: FilterDataType[] = advFilData.data;
            let groupList: string[] = [];

            let conditionListTemp: { cond: string[] }[] = [];
            let objTemp: {
                condition: string;
                filter: number[];
                filterCounter: number;
            }[] = [];
            let filterTemp: number[] = [];
            tempData = tempData.map((item) => {
                let temp: string[] = [];
                filterTemp = [];
                groupList.push(item.groupCondition);
                item.filter.forEach((_item, index) => {
                    temp.push(_item.dataPoint);
                    filterTemp.push(index);
                });
                conditionListTemp.push({ cond: temp });
                objTemp.push({
                    condition: item.condition,
                    filter: filterTemp,
                    filterCounter: item.filter.length,
                });
                return {
                    ...item,
                    filter: item.filter.map((_item) => {
                        return _item.endDate
                            ? {
                                ..._item,
                                value: new Date(_item.value),
                                endDate: new Date(_item.endDate),
                            }
                            : _item;
                    }),
                };
            });

            setValue("obj", tempData);
            setState((prev) => ({
                ...prev,
                obj: objTemp,
                conditionList: conditionListTemp,
                groupList: groupList,
            }));
            dispatch(handleSelectedSegmentData([]));
            segmentNameRef.current = advFilData.segmentName;
            segmentIdRef.current = advFilData.segmentId;
            setAdvFilterRecall(false)
        }
        // eslint-disable-next-line
    }, [advFilterRecall]);
    const saveSegment = (segmentName: string) => {
        let tempData = getValues("obj");
        let formData: SaveSegmentAdvFilterObj[] = [];
        tempData.forEach((item, index) => {
            item.filter.forEach((_item, _index) => {
                formData.push({
                    ...(_item.id && { id: _item.id }),
                    ...(_item.segment_id && { segment_id: _item.segment_id }),
                    group_cond:
                        index === 0 ? "" : _index === 0 ? groupList[index] : "",
                    option_choice: item.condition,
                    data_point: _item.dataPoint,
                    data_point_field: _item.fields,
                    operator_choice: _item.operator,
                    filter_value:
                        (_item.fields === "16" ||
                            _item.fields === "17" ||
                            _item.fields === "18") &&
                            _item.operator === "14"
                            ? {
                                start: moment(_item.value).format(
                                    "MMM-DD-YYYY"
                                ),
                                end: _item.endDate
                                    ? moment(_item.endDate).format(
                                        "MMM-DD-YYYY"
                                    )
                                    : "",
                            }
                            : _item.fields === "7"
                                ? `${_item.value}${_item.operator === "4"
                                    ? `_${_item.upperValue}`
                                    : ""
                                }`
                                : _item.fields === "9"
                                    ? `${_item.value}_${(_item.upperValue as OptionType)?.value
                                    }_${(_item.upperValue as OptionType)?.label}`
                                    : `${_item.value}`,
                });
            });
        });
        if (segmentNameRef.current) {
            dispatch(
                updateSegmentAdvFilter(access_token, {
                    segment_name: segmentName,
                    search_param: formData,
                    ...(formData[0].segment_id && {
                        seg_id: formData[0].segment_id,
                    }),
                })
            ).then((res) => {
                const { status } = res;
                if (status === 200) {
                    clearFilterFn();
                    dispatch(toggleSaveSegmentModal());
                    dispatch(showHideAdvFilter());
                }
            });
        } else {
            dispatch(
                saveSegmentAdvFilter(access_token, {
                    segment_name: segmentName,
                    search_param: formData,
                })
            ).then((res) => {
                const { status } = res;
                if (status === 200) {
                    clearFilterFn();
                    dispatch(toggleSaveSegmentModal());
                    dispatch(showHideAdvFilter());
                }
            });
        }
        dispatch(clearActiveOrArchiveSegmentList())
    };
    const loadOptions = async (
        search: string,
        prevOptions: OptionsOrGroups<OptionType, GroupBase<OptionType>>,
        { page }: any
    ) => {
        let hasMore = false,
            dataList: OptionType[] = [];
        let indexArray = countyIndexRef.current.split(",");
        if (
            getValues(
                `obj.${Number(indexArray[0])}.filter.${Number(
                    indexArray[1]
                )}.value`
            )
        ) {
            const res = await dispatch(
                fetchStateInAdvFilter(access_token, {
                    county: getValues(
                        `obj.${Number(indexArray[0])}.filter.${Number(
                            indexArray[1]
                        )}.value`
                    ) as string,
                })
            );
            if (res && res.status === 200) {
                const { data } = res;

                dataList = data.map((_item) => ({
                    label: `${_item.state_name}`,
                    value: _item.state_abbr,
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

    const FilterOptionRow = ({ indx }: { indx: number }) => {
        const { filter, condition } = obj[indx];
        return (
            <div className={indx > 0 ? "dynamicSegment-form" : ""}>
                {indx > 0 ? (
                    <span className={groupList[indx] === "4" ? "and" : "or"} style={{ top: conditionList[0]['cond'].length === 0 && groupList[indx] !== "4" ? "auto" : '' }}>
                        {groupList[indx] === "4" ? "AND" : "OR"}
                    </span>
                ) : (
                    <></>
                )}
                <div className={indx > 0 ? "dynamicform-block" : ""}>
                    {indx > 0 ? (
                        <button
                            type="button"
                            className="btn remove"
                            onClick={() => {
                                removeAdvFilterOpt(indx);
                            }}
                        >
                            <i className="fa-solid fa-trash-can"></i>
                        </button>
                    ) : (
                        <></>
                    )}
                    <div className="all">
                        <div className="selectInput">
                            <select
                                {...(register(`obj.${indx}.condition`),
                                {
                                    onChange: (e) => {
                                        setValue(
                                            `obj.${indx}.condition`,
                                            e.target.value
                                        );
                                        setState((prev) => ({
                                            ...prev,
                                            obj: prev.obj.map((obj, pos) =>
                                                indx === pos
                                                    ? {
                                                        ...obj,
                                                        condition: `${e.target.value}`,
                                                    }
                                                    : obj
                                            ),
                                        }));
                                    },
                                })}
                                className={`form-control ${errors.obj &&
                                    typeof errors.obj[indx]?.condition
                                        ?.message !== "undefined"
                                    ? "error"
                                    : ""
                                    }`}
                                placeholder="Select"
                                defaultValue={condition}
                            >
                                {[...optionChoice].map((item, index) => (
                                    <option value={item.value} key={index}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        of the following conditions match
                    </div>
                    <div className="andSegment-form">
                        <div className="form-block">
                            {filter.map((_item, index) => {
                                let fields = watch(
                                    `obj.${indx}.filter.${index}.fields`
                                );
                                let operator = watch(
                                    `obj.${indx}.filter.${index}.operator`
                                );
                                let dataPoint = watch(
                                    `obj.${indx}.filter.${index}.dataPoint`
                                );
                                return (
                                    <div
                                        className="addsegmentBlock"
                                        key={index}
                                    >
                                        {filter.length > 1 && index > 0 ? (
                                            <span
                                                className={
                                                    condition === "1"
                                                        ? "and"
                                                        : "or"
                                                }
                                            >
                                                {condition === "1"
                                                    ? "AND"
                                                    : "OR"}
                                            </span>
                                        ) : (
                                            <span className="empty">
                                                &nbsp;
                                            </span>
                                        )}
                                        <div
                                            className="form-row width100"
                                            key={index}
                                        >
                                            <div className="selectInput">
                                                <select
                                                    className={`form-control ${typeof errors?.obj?.[
                                                        indx
                                                    ]?.filter?.[index]
                                                        ?.dataPoint
                                                        ?.message !==
                                                        "undefined"
                                                        ? "error"
                                                        : ""
                                                        }`}
                                                    {...register(
                                                        `obj.${indx}.filter.${index}.dataPoint`
                                                    )}
                                                    defaultValue={
                                                        conditionList[indx]
                                                            ?.cond[index]
                                                    }
                                                >
                                                    {/* <option value="">Select your option</option> */}
                                                    <optgroup label="Data Point">
                                                        {(conditionList[indx]
                                                            .cond.length > 0
                                                            ? conditionList[
                                                                indx
                                                            ].cond.includes(
                                                                "3"
                                                            )
                                                                ? [
                                                                    ...groupChoices,
                                                                ].slice(2, 3)
                                                                : conditionList[
                                                                    indx
                                                                ].cond.includes(
                                                                    "6"
                                                                ) ? [
                                                                    ...groupChoices,
                                                                ].slice(5) : [...[
                                                                    ...groupChoices,
                                                                ].slice(0, 1)]
                                                            : [...[
                                                                ...groupChoices,
                                                            ].slice(0, 3), ...[
                                                                ...groupChoices,
                                                            ].slice(5)]
                                                        ).map((item, index) => (
                                                            <option
                                                                value={
                                                                    item.value
                                                                }
                                                                key={index}
                                                            >
                                                                {item.label}
                                                            </option>
                                                        ))}
                                                    </optgroup>
                                                </select>
                                            </div>
                                            <div className="selectInput">
                                                <select
                                                    className={`form-control ${typeof errors?.obj?.[
                                                        indx
                                                    ]?.filter?.[index]
                                                        ?.fields
                                                        ?.message !==
                                                        "undefined"
                                                        ? "error"
                                                        : ""
                                                        }`}
                                                    {...register(
                                                        `obj.${indx}.filter.${index}.fields`,
                                                        {
                                                            onChange: (e) => {
                                                                let value =
                                                                    e.target
                                                                        .value;
                                                                setValue(
                                                                    `obj.${indx}.filter.${index}.value`,
                                                                    ""
                                                                );
                                                                setValue(
                                                                    `obj.${indx}.filter.${index}.upperValue`,
                                                                    ""
                                                                );
                                                                setValue(
                                                                    `obj.${indx}.filter.${index}.endDate`,
                                                                    ""
                                                                );
                                                                if (
                                                                    value ===
                                                                    "16" ||
                                                                    value ===
                                                                    "17" ||
                                                                    value ===
                                                                    "18"
                                                                ) {
                                                                    setValue(
                                                                        `obj.${indx}.filter.${index}.operator`,
                                                                        "12"
                                                                    );
                                                                } else {
                                                                    setValue(
                                                                        `obj.${indx}.filter.${index}.operator`,
                                                                        "1"
                                                                    );
                                                                }
                                                            },
                                                        }
                                                    )}
                                                >
                                                    <optgroup label="Well Information">
                                                        {/* {(tabIndex !== 1 */}
                                                        {(conditionList[indx]
                                                            ?.cond[index] !== "3"
                                                            ? [
                                                                ...wellsAndPermitFieldChoices,
                                                            ].slice(0, 6)
                                                            : [
                                                                ...rigsFieldChoices,
                                                            ].slice(0, 7)
                                                        ).map((item, index) => (
                                                            <option
                                                                value={
                                                                    item.value
                                                                }
                                                                key={index}
                                                            >
                                                                {item.label}
                                                            </option>
                                                        ))}
                                                    </optgroup>
                                                    <optgroup label="Well Location">
                                                        {/* {(tabIndex !== 1 */}
                                                        {(conditionList[indx]
                                                            ?.cond[index] !== "3"
                                                            ? [
                                                                ...wellsAndPermitFieldChoices,
                                                            ].slice(6, 12)
                                                            : [
                                                                ...rigsFieldChoices,
                                                            ].slice(7, 14)
                                                        ).map((item, index) => (
                                                            <option
                                                                value={
                                                                    item.value
                                                                }
                                                                key={index}
                                                            >
                                                                {item.label}
                                                            </option>
                                                        ))}
                                                    </optgroup>
                                                    <optgroup label="Activity">
                                                        {/* {(tabIndex !== 1 */}
                                                        {(conditionList[indx]
                                                            ?.cond[index] !== "3"
                                                            ? [
                                                                ...wellsAndPermitFieldChoices,
                                                            ].slice(12, 15)
                                                            : [
                                                                ...rigsFieldChoices,
                                                            ].slice(0, 18)
                                                        ).map((item, index) => (
                                                            <option
                                                                value={
                                                                    item.value
                                                                }
                                                                key={index}
                                                            >
                                                                {item.label}
                                                            </option>
                                                        ))}
                                                    </optgroup>
                                                    {/* {tabIndex !== 2 && tabIndex !== 1 && <optgroup label="Production"> */}
                                                    {conditionList[indx]['cond'][index] === "6" && <optgroup label="Production">
                                                        {/* {(tabIndex !== 1 */}
                                                        {([
                                                            ...wellsAndPermitFieldChoices,
                                                        ].slice(15)
                                                        ).map((item, index) => (
                                                            <option
                                                                value={
                                                                    item.value
                                                                }
                                                                key={index}
                                                            >
                                                                {item.label}
                                                            </option>
                                                        ))}
                                                    </optgroup>}
                                                </select>
                                            </div>
                                            <div className="selectInput">
                                                <select
                                                    className={`form-control ${typeof errors?.obj?.[
                                                        indx
                                                    ]?.filter?.[index]
                                                        ?.operator
                                                        ?.message !==
                                                        "undefined"
                                                        ? "error"
                                                        : ""
                                                        }`}
                                                    {...register(
                                                        `obj.${indx}.filter.${index}.operator`,
                                                        {
                                                            onChange: (e) => {
                                                                setValue(
                                                                    `obj.${indx}.filter.${index}.value`,
                                                                    ""
                                                                );
                                                                setValue(
                                                                    `obj.${indx}.filter.${index}.upperValue`,
                                                                    ""
                                                                );
                                                                setValue(
                                                                    `obj.${indx}.filter.${index}.endDate`,
                                                                    ""
                                                                );
                                                            },
                                                        }
                                                    )}
                                                >
                                                    {fields !== "16" &&
                                                        fields !== "17" &&
                                                        fields !== "18" && (
                                                            <optgroup label="String or Number">
                                                                {(fields === "7" || fields === "22" || fields === "23"
                                                                    ? [
                                                                        ...[
                                                                            ...operatorChoices,
                                                                        ].slice(
                                                                            0,
                                                                            5
                                                                        ),
                                                                    ]
                                                                    : [
                                                                        ...[
                                                                            ...operatorChoices,
                                                                        ].slice(
                                                                            0,
                                                                            2
                                                                        ),
                                                                        ...[
                                                                            ...operatorChoices,
                                                                        ].slice(
                                                                            5,
                                                                            7
                                                                        ),
                                                                    ]
                                                                ).map(
                                                                    (
                                                                        item,
                                                                        index
                                                                    ) => (
                                                                        <option
                                                                            value={
                                                                                item.value
                                                                            }
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            {
                                                                                item.label
                                                                            }
                                                                        </option>
                                                                    )
                                                                )}
                                                            </optgroup>
                                                        )}
                                                    {/* {fields !== "7" &&
                                                        fields !== "16" &&
                                                        fields !== "17" &&
                                                        fields !== "18" && fields !== "22" && fields !== "23" && (
                                                            <optgroup label="String">
                                                                {[
                                                                    ...operatorChoices,
                                                                ]
                                                                    .slice(
                                                                        7,
                                                                        10
                                                                    )
                                                                    .map(
                                                                        (
                                                                            item,
                                                                            index
                                                                        ) => (
                                                                            <option
                                                                                value={
                                                                                    item.value
                                                                                }
                                                                                key={
                                                                                    index
                                                                                }
                                                                            >
                                                                                {
                                                                                    item.label
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )}
                                                            </optgroup>
                                                        )} */}
                                                    {fields !== "16" &&
                                                        fields !== "17" &&
                                                        fields !== "18" &&
                                                        fields !== "9" && (
                                                            <optgroup label="Array">
                                                                {[
                                                                    ...operatorChoices,
                                                                ]
                                                                    .slice(
                                                                        10,
                                                                        11
                                                                    )
                                                                    .map(
                                                                        (
                                                                            item,
                                                                            index
                                                                        ) => (
                                                                            <option
                                                                                value={
                                                                                    item.value
                                                                                }
                                                                                key={
                                                                                    index
                                                                                }
                                                                            >
                                                                                {
                                                                                    item.label
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )}
                                                            </optgroup>
                                                        )}
                                                    {(fields === "16" ||
                                                        fields === "17" ||
                                                        fields === "18") && (
                                                            <optgroup label="Time Stamp">
                                                                {[
                                                                    ...operatorChoices,
                                                                ]
                                                                    .slice(11)
                                                                    .map(
                                                                        (
                                                                            item,
                                                                            index
                                                                        ) => (
                                                                            <option
                                                                                value={
                                                                                    item.value
                                                                                }
                                                                                key={
                                                                                    index
                                                                                }
                                                                            >
                                                                                {
                                                                                    item.label
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )}
                                                            </optgroup>
                                                        )}
                                                </select>
                                            </div>
                                            {fields === "16" ||
                                                fields === "17" ||
                                                fields === "18" ? (
                                                <>
                                                    <div className="calInput">
                                                        <DatePickerComponent
                                                            control={
                                                                control as any
                                                            }
                                                            name={`obj.${indx}.filter.${index}.value`}
                                                            defaultValue={null}
                                                            minDate={null}
                                                            withPortal={true}
                                                            placeholderText={`Enter start ${dataPoint ===
                                                                "3" &&
                                                                fields
                                                                ? rigsFieldChoices.filter(
                                                                    (
                                                                        item
                                                                    ) =>
                                                                        item.value ===
                                                                        fields
                                                                )[0]
                                                                    ?.label ??
                                                                ""
                                                                : wellsAndPermitFieldChoices.filter(
                                                                    (
                                                                        item
                                                                    ) =>
                                                                        item.value ===
                                                                        fields
                                                                )[0]
                                                                    ?.label ??
                                                                ""
                                                                }`}
                                                            className={`form-control cursor ${typeof errors
                                                                ?.obj?.[
                                                                indx
                                                            ]?.filter?.[
                                                                index
                                                            ]?.value
                                                                ?.message !==
                                                                "undefined"
                                                                ? "error"
                                                                : ""
                                                                }`}
                                                            onChangeHandle={(
                                                                date
                                                            ) => {
                                                                clearErrors(
                                                                    `obj.${indx}.filter.${index}.value`
                                                                );
                                                                setValue(
                                                                    `obj.${indx}.filter.${index}.value`,
                                                                    date
                                                                );

                                                                setValue(
                                                                    `obj.${indx}.filter.${index}.endDate`,
                                                                    Moment(
                                                                        Moment(
                                                                            getValues(
                                                                                `obj.${indx}.filter.${index}.endDate`
                                                                            )
                                                                        ).format(
                                                                            "MMM-DD-YYYY"
                                                                        )
                                                                    ).isAfter(
                                                                        Moment(
                                                                            date
                                                                        ).format(
                                                                            "MMM-DD-YYYY"
                                                                        )
                                                                    )
                                                                        ? getValues(
                                                                            `obj.${indx}.filter.${index}.endDate`
                                                                        )
                                                                        : null
                                                                );
                                                            }}
                                                            showerror={false}
                                                        />
                                                    </div>
                                                    {operator === "14" && (
                                                        <div className="calInput">
                                                            <DatePickerComponent
                                                                control={
                                                                    control as any
                                                                }
                                                                name={`obj.${indx}.filter.${index}.endDate`}
                                                                defaultValue={
                                                                    null
                                                                }
                                                                withPortal={
                                                                    true
                                                                }
                                                                minDate={
                                                                    (watch(
                                                                        `obj.${indx}.filter.${index}.value`
                                                                    ) as Date) &&
                                                                    new Date(
                                                                        new Date(
                                                                            getValues(
                                                                                `obj.${indx}.filter.${index}.value`
                                                                            )
                                                                        ).setDate(
                                                                            new Date(
                                                                                getValues(
                                                                                    `obj.${indx}.filter.${index}.value`
                                                                                )
                                                                            ).getDate() +
                                                                            1
                                                                        )
                                                                    )
                                                                }
                                                                placeholderText={`Enter end ${dataPoint ===
                                                                    "3" &&
                                                                    fields
                                                                    ? rigsFieldChoices.filter(
                                                                        (
                                                                            item
                                                                        ) =>
                                                                            item.value ===
                                                                            fields
                                                                    )[0]
                                                                        ?.label ??
                                                                    ""
                                                                    : wellsAndPermitFieldChoices.filter(
                                                                        (
                                                                            item
                                                                        ) =>
                                                                            item.value ===
                                                                            fields
                                                                    )[0]
                                                                        ?.label ??
                                                                    ""
                                                                    }`}
                                                                className={`form-control cursor ${typeof errors
                                                                    ?.obj?.[
                                                                    indx
                                                                ]?.filter?.[
                                                                    index
                                                                ]?.endDate
                                                                    ?.message !==
                                                                    "undefined"
                                                                    ? "error"
                                                                    : ""
                                                                    }`}
                                                                onChangeHandle={(
                                                                    date
                                                                ) => {
                                                                    setValue(
                                                                        `obj.${indx}.filter.${index}.endDate`,
                                                                        date
                                                                    );
                                                                }}
                                                                showerror={
                                                                    false
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                watch(
                                                    `obj.${indx}.filter.${index}.operator`
                                                ) !== "6" &&
                                                watch(
                                                    `obj.${indx}.filter.${index}.operator`
                                                ) !== "7" && (
                                                    <>
                                                        <div className="textInput">
                                                            <input
                                                                type={
                                                                    watch(
                                                                        `obj.${indx}.filter.${index}.fields`
                                                                    ) === "7"
                                                                        ? "number"
                                                                        : "text"
                                                                }
                                                                {...register(
                                                                    `obj.${indx}.filter.${index}.value`
                                                                )}
                                                                autoFocus={
                                                                    inputFocusRef.current ===
                                                                        `obj.${indx}.filter.${index}.value`
                                                                        ? true
                                                                        : false
                                                                }
                                                                onFocus={() => {
                                                                    inputFocusRef.current = `obj.${indx}.filter.${index}.value`;
                                                                }}
                                                                onBlur={() => {
                                                                    inputFocusRef.current =
                                                                        "";
                                                                    getValues(
                                                                        `obj.${indx}.filter.${index}.fields`
                                                                    ) === "9" &&
                                                                        setValue(
                                                                            `obj.${indx}.filter.${index}.upperValue`,
                                                                            ""
                                                                        );
                                                                }}
                                                                className={`form-control cursor ${typeof errors
                                                                    ?.obj?.[
                                                                    indx
                                                                ]?.filter?.[
                                                                    index
                                                                ]?.value
                                                                    ?.message !==
                                                                    "undefined"
                                                                    ? "error"
                                                                    : ""
                                                                    }`}
                                                                placeholder={`Enter ${dataPoint ===
                                                                    "3" &&
                                                                    fields
                                                                    ? rigsFieldChoices.filter(
                                                                        (
                                                                            item
                                                                        ) =>
                                                                            item.value ===
                                                                            fields
                                                                    )[0]
                                                                        ?.label ??
                                                                    ""
                                                                    : wellsAndPermitFieldChoices.filter(
                                                                        (
                                                                            item
                                                                        ) =>
                                                                            item.value ===
                                                                            fields
                                                                    )[0]
                                                                        ?.label ??
                                                                    ""
                                                                    } value`}
                                                                onKeyDown={(
                                                                    e
                                                                ) => {
                                                                    watch(
                                                                        `obj.${indx}.filter.${index}.fields`
                                                                    ) === "7" &&
                                                                        inputNumber(
                                                                            e
                                                                        );
                                                                }}
                                                            />
                                                        </div>
                                                        {operator === "4" && (
                                                            <div className="textInput">
                                                                <input
                                                                    {...register(
                                                                        `obj.${indx}.filter.${index}.upperValue`
                                                                    )}
                                                                    autoFocus={
                                                                        inputFocusRef.current ===
                                                                            `obj.${indx}.filter.${index}.upperValue`
                                                                            ? true
                                                                            : false
                                                                    }
                                                                    onFocus={() => {
                                                                        inputFocusRef.current = `obj.${indx}.filter.${index}.upperValue`;
                                                                    }}
                                                                    onBlur={() => {
                                                                        inputFocusRef.current =
                                                                            "";
                                                                    }}
                                                                    type={
                                                                        watch(
                                                                            `obj.${indx}.filter.${index}.fields`
                                                                        ) ===
                                                                            "7"
                                                                            ? "number"
                                                                            : "text"
                                                                    }
                                                                    className={`form-control cursor ${typeof errors
                                                                        ?.obj?.[
                                                                        indx
                                                                    ]
                                                                        ?.filter?.[
                                                                        index
                                                                    ]
                                                                        ?.upperValue
                                                                        ?.message !==
                                                                        "undefined"
                                                                        ? "error"
                                                                        : ""
                                                                        }`}
                                                                    placeholder={`Enter ${dataPoint ===
                                                                        "3"
                                                                        ? rigsFieldChoices.filter(
                                                                            (
                                                                                item
                                                                            ) =>
                                                                                item.value ===
                                                                                fields
                                                                        )[0]
                                                                            ?.label ??
                                                                        ""
                                                                        : wellsAndPermitFieldChoices.filter(
                                                                            (
                                                                                item
                                                                            ) =>
                                                                                item.value ===
                                                                                fields
                                                                        )[0]
                                                                            ?.label ??
                                                                        ""
                                                                        } upper value`}
                                                                    onKeyDown={(
                                                                        e
                                                                    ) => {
                                                                        watch(
                                                                            `obj.${indx}.filter.${index}.fields`
                                                                        ) ===
                                                                            "7" &&
                                                                            inputNumber(
                                                                                e
                                                                            );
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                        {fields === "9" && (
                                                            <div className="textInput">
                                                                <AsyncSelect
                                                                    // just giving key value as time to load option again on county change
                                                                    key={new Date().getTime()}
                                                                    menuPosition={
                                                                        "fixed"
                                                                    }
                                                                    name={`obj.${indx}.filter.${index}.upperValue`}
                                                                    debounceTimeout={
                                                                        500
                                                                    }
                                                                    onFocus={() => {
                                                                        countyIndexRef.current = `${indx},${index}`;
                                                                    }}
                                                                    onBlur={() => {
                                                                        countyIndexRef.current = ``;
                                                                    }}
                                                                    className={`cursor customselect ${typeof errors
                                                                        ?.obj?.[
                                                                        indx
                                                                    ]
                                                                        ?.filter?.[
                                                                        index
                                                                    ]
                                                                        ?.upperValue
                                                                        ?.message !==
                                                                        "undefined"
                                                                        ? "error"
                                                                        : ""
                                                                        }`}
                                                                    placeholder={`State`}
                                                                    control={
                                                                        control
                                                                    }
                                                                    additional={{
                                                                        page: 1,
                                                                    }}
                                                                    loadOptions={
                                                                        loadOptions
                                                                    }
                                                                // loadOptionsOnMenuOpen={
                                                                //     loadOptions
                                                                // }
                                                                />
                                                            </div>
                                                        )}
                                                    </>
                                                )
                                            )}
                                            <div className="action-block">
                                                <button
                                                    type="button"
                                                    className="btn copy"
                                                    onClick={() => {
                                                        addFilter(indx);
                                                        setState((prev) => ({
                                                            ...prev,
                                                            conditionList:
                                                                prev.conditionList.map(
                                                                    (item, i) =>
                                                                        i ===
                                                                            indx
                                                                            ? {
                                                                                cond: [
                                                                                    ...item.cond,
                                                                                    item
                                                                                        .cond[
                                                                                    index
                                                                                    ],
                                                                                ],
                                                                            }
                                                                            : item
                                                                ),
                                                        }));
                                                    }}
                                                >
                                                    <i className="fa-regular fa-copy"></i>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn del"
                                                    onClick={() => {
                                                        removeFilter(
                                                            indx,
                                                            index
                                                        );
                                                    }}
                                                >
                                                    <i className="fa-solid fa-trash-can"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {indx > 0 && (
                        <div className="all addCond">
                            <div className="selectInput">
                                <select
                                    className="form-control"
                                    name={`conditionList${indx}`}
                                    value={""}
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        if (value) {
                                            // setValue(
                                            //     `obj.${indx}.condition`,
                                            //     value
                                            // );
                                            addFilter(indx);
                                            setState((prev) => ({
                                                ...prev,
                                                conditionList:
                                                    prev.conditionList.map(
                                                        (item, i) =>
                                                            i === indx
                                                                ? {
                                                                    cond: [
                                                                        ...item.cond,
                                                                        value,
                                                                    ],
                                                                }
                                                                : item
                                                    ),
                                            }));
                                        }
                                    }}
                                >
                                    <option value="">Add condition</option>
                                    <optgroup label="Table Name">
                                        {(conditionList[0].cond.length > 0 &&
                                            conditionList[0].cond.includes("3")
                                            ? [...groupChoices].slice(2, 3)
                                            : conditionList[0].cond.includes("6") ? [...groupChoices].slice(5) : [...[...groupChoices].slice(0, 2)]
                                        ).map((item, index) => (
                                            <option
                                                value={item.value}
                                                key={index}
                                            >
                                                {item.label}
                                            </option>
                                        ))}
                                    </optgroup>
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };
    return (
        <div className={advFilter ? "advanced-filter open" : "d-none"}>
            <span className="close" onClick={() => { dispatch(showHideAdvFilter()) }}><img src="images/close.svg" alt="" /></span>
            <div className="advanced-filter-left">
                <h5 className="filter-heading">Segment for wells where:</h5>
                {/* {segmentMemo} */}
                <form
                    className="form-block"
                    onSubmit={handleSubmit(onSubmit)}
                    autoComplete="off"
                    autoCapitalize="off"
                >
                    <Scrollbars
                        className="customTable lead-scroll"
                        style={{ width: "100%" }}
                        autoHeight
                        autoHeightMin={0}
                        autoHeightMax="15rem"
                        renderThumbVertical={(props) => (
                            <div {...props} className="thumb-vertical" />
                        )}
                        renderTrackVertical={(props) => (
                            <div {...props} className="track-vertical" />
                        )}
                    >
                        <div className="filter-inside">
                            {obj.map((item, index) => {
                                // const fieldName = `obj[${index}]`;
                                return (
                                    <React.Fragment key={index}>
                                        <FilterOptionRow
                                            // fieldName={fieldName}
                                            indx={index}
                                        />
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </Scrollbars>
                    <div className="all addCond">
                        <div className="selectInput">
                            <select
                                className="form-control"
                                name={"conditionORGroup0"}
                                value={""}
                                onChange={(e) => {
                                    let value = e.target.value;
                                    if (value) {
                                        if (Number(value) > 3 && Number(value) !== 6) {
                                            // addAdvFilterOpt(value);
                                            // setValue(
                                            //     `obj.${obj.length}.condition`,
                                            //     value
                                            // );
                                            // when value is "4" option choice is 1 and value "5" option choice 2
                                            addAdvFilterOpt("1");
                                            setValue(
                                                `obj.${obj.length}.condition`,
                                                "1"
                                            );
                                            setState((prev) => ({
                                                ...prev,
                                                conditionList: [
                                                    ...conditionList,
                                                    { cond: [] },
                                                ],
                                                groupList: [
                                                    ...prev.groupList,
                                                    value,
                                                ],
                                            }));
                                        } else {
                                            // setValue(
                                            //     `obj.${0}.condition`,
                                            //     value
                                            // );
                                            addFilter(0);
                                            setState((prev) => ({
                                                ...prev,
                                                conditionList:
                                                    prev.conditionList.map(
                                                        (item, i) =>
                                                            i === 0
                                                                ? {
                                                                    cond: [
                                                                        ...item.cond,
                                                                        value,
                                                                    ],
                                                                }
                                                                : item
                                                    ),
                                            }));
                                        }
                                    }
                                }}
                            >
                                <option value="">Add condition or group</option>
                                <optgroup label="Table Name">
                                    {[...[...groupChoices]
                                        .slice(0, 1), ...[...groupChoices]
                                            .slice(2, 3)]
                                        .map((item, index) => (
                                            <option
                                                value={item.value}
                                                key={index}
                                                disabled={
                                                    (conditionList[0].cond
                                                        .length > 0 &&
                                                        (conditionList[0].cond.includes(
                                                            "1"
                                                        ) ||
                                                            conditionList[0].cond.includes(
                                                                "2"
                                                            )) &&
                                                        (item.value === "3" || item.value === "6")) ||
                                                        (conditionList[0].cond.includes(
                                                            "3"
                                                        ) &&
                                                            (item.value === "1" ||
                                                                item.value === "2" || item.value === "6")) ||
                                                        (conditionList[0].cond.includes(
                                                            "6"
                                                        ) &&
                                                            (item.value === "1" ||
                                                                item.value === "2" || item.value === "3"))
                                                        ? true
                                                        : false
                                                }
                                            >
                                                {item.label}
                                            </option>
                                        ))}
                                </optgroup>
                                {conditionList[0]['cond'].length > 0 && <optgroup label="Group">
                                    {[...groupChoices]
                                        .slice(3, 5)
                                        .map((item, index) => (
                                            <option
                                                value={item.value}
                                                key={index}
                                            >
                                                {item.label}
                                            </option>
                                        ))}
                                </optgroup>}
                            </select>
                        </div>
                    </div>
                    <div className="action-right">
                        <button
                            type="button"
                            className={`btn clear-btn`}
                            onClick={() => {
                                selectedRowId && dispatch(handleSelectedRowId(0))
                                clearFilterFn();
                            }}
                        >
                            Clear filters
                        </button>
                        <button
                            type="submit"
                            className="btn btn-outline-white"
                            // onClick={() => dispatch(toggleSaveSegmentModal())}
                            onClick={() => (btnRef.current = 1)}
                            disabled={obj.length > 0 ? false : true}
                        >
                            <i className="fa-solid fa-floppy-disk"></i>&nbsp;
                            {`${!segmentNameRef.current ? "Save" : "Update"
                                } segment`}
                        </button>
                        <button
                            type="submit"
                            onClick={() => (btnRef.current = 2)}
                            className="btn btn-primary"
                            disabled={showTableLoader}
                        >
                            Apply filters
                        </button>
                    </div>
                </form>
            </div>

            {saveSegmentModal && (
                <SaveSegmentModal
                    show={saveSegmentModal}
                    handleClose={() => dispatch(toggleSaveSegmentModal())}
                    handleSaveSubmit={saveSegment}
                    segmentName={segmentNameRef.current}
                />
            )}
        </div>
    );
}

export default AdvancedFilter;
