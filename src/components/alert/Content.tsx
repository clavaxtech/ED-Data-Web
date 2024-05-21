import React, { useEffect, useState } from "react";
// import Scrollbars from "react-custom-scrollbars";
import { SegmentListObj } from "../models/redux-models";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import {
    clearActiveOrArchiveSegmentList,
    fetchSegmentsList,
    fetchSelectedSegmentDetails,
    handleCheckbox,
    handleSelectedRowId,
    handleSelectedSegmentData,
    segmentBtnAction,
    selectOrDeselectAllCheckbox,
} from "../store/actions/segments-actions";
import DeleteConfirmationModal from "../common/Modal/DeleteConfirmationModal";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "../common/Spinner";
import { useNavigate } from "react-router-dom";
import { FilterObj, OptionType } from "../models/submit-form";
import { modifyString } from "../../utils/helper";

export interface FilterDataType {
    condition: string;
    groupCondition: string;
    filter: FilterObj[];
}

function Content({
    heading,
    headingHelperText,
    tabIndex,
    data,
    selectedRowId,
    page,
    totalRecord,
    pageSize,
    id,
}: {
    heading: string;
    headingHelperText: string;
    tabIndex: 1 | 2;
    data: SegmentListObj["data"];
    selectedRowId: number;
    page: number;
    totalRecord: number;
    pageSize: number;
    id: string;
}) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {
        auth: {
            user: { access_token },
        },
        segments: { selectedSegmentData },
        wellsAndRigs: {
            groupChoices,
            operatorChoices,
            // optionChoice,
            wellsAndPermitFieldChoices,
            rigsFieldChoices,
        },
    } = useAppSelector((state) => state);
    const [state, setState] = useState<{
        deleteAndArchiveConfModal: boolean;
        selectAll: boolean;
        hasMore: boolean;
        pages: number;
        transformData: FilterDataType[];
    }>({
        deleteAndArchiveConfModal: false,
        selectAll: false,
        hasMore: false,
        pages: 1,
        transformData: [],
    });

    const { deleteAndArchiveConfModal, selectAll, hasMore, transformData } =
        state;

    useEffect(() => {
        let pages =
            Math.floor(totalRecord / pageSize) +
            (totalRecord % pageSize > 0 ? 1 : 0);
        setState((prev) => ({
            ...prev,
            pages,
            hasMore: page < pages ? true : false,
        }));
        // eslint-disable-next-line
    }, [totalRecord, page]);

    useEffect(() => {
        setState((prev) => ({
            ...prev,
            selectAll:
                data.length > 0 &&
                    data.filter((item) => !item.checked).length === 0
                    ? true
                    : false,
        }));
    }, [data]);

    const fetchData = () => {
        dispatch(
            fetchSegmentsList(access_token, {
                type: tabIndex === 1 ? "active" : "archive",
                page: page + 1,
            })
        );
    };

    useEffect(() => {
        if (selectedSegmentData.length > 0) {
            let tempData = [...selectedSegmentData];
            tempData[0] = { ...tempData[0], group_cond: "4" };
            let tempTransformData: FilterDataType[] = [];
            tempData.forEach((item) => {
                if (item.group_cond) {
                    tempTransformData.push({
                        condition: item.option_choice,
                        groupCondition: item.group_cond,
                        filter: [
                            {
                                id: item.id,
                                segment_id: item.segment_id,
                                dataPoint: item.data_point,
                                fields: item.data_point_field,
                                operator: item.operator_choice,
                                //this value key will be over written by the below condition this is just done to overcome the typescript error
                                value: item.filter_value as any,
                                ...((item.data_point_field === "16" ||
                                    item.data_point_field === "17" ||
                                    item.data_point_field === "18") &&
                                    item.operator_choice === "14"
                                    ? {
                                        value: new Date(
                                            JSON.parse(
                                                modifyString(
                                                    item.filter_value as string
                                                )
                                            ).start
                                        ),
                                        endDate: new Date(
                                            JSON.parse(
                                                modifyString(
                                                    item.filter_value as string
                                                )
                                            ).end
                                        ),
                                    }
                                    : item.data_point_field === "7"
                                        ? {
                                            ...(item.operator_choice === "4" && {
                                                value: (
                                                    item.filter_value as string
                                                ).split("_")[0],
                                                upperValue: (
                                                    item.filter_value as string
                                                ).split("_")[1],
                                            }),
                                            ...(item.operator_choice !== "4" && {
                                                value: item.filter_value,
                                            }),
                                        }
                                        : item.data_point_field === "9"
                                            ? {
                                                value: (
                                                    item.filter_value as string
                                                ).split("_")[0],
                                                //   upperValue: `${
                                                //       (
                                                //           item.filter_value as string
                                                //       ).split("_")[1]
                                                //   } ( ${
                                                //       (
                                                //           item.filter_value as string
                                                //       ).split("_")[2]
                                                //   } )`,
                                                upperValue: {
                                                    label: (
                                                        item.filter_value as string
                                                    ).split("_")[1],
                                                    value: (
                                                        item.filter_value as string
                                                    ).split("_")[2],
                                                },
                                            }
                                            : { value: item.filter_value }),
                            },
                        ],
                    });
                } else {
                    let index = tempTransformData.length - 1;
                    tempTransformData[index] = {
                        ...tempTransformData[index],
                        filter: [
                            ...tempTransformData[index]?.filter,
                            {
                                id: item.id,
                                segment_id: item.segment_id,
                                dataPoint: item.data_point,
                                fields: item.data_point_field,
                                operator: item.operator_choice,
                                //this value key will be over written by the below condition this is just done to overcome the typescript error
                                value: item.filter_value as any,
                                ...((item.data_point_field === "16" ||
                                    item.data_point_field === "17" ||
                                    item.data_point_field === "18") &&
                                    item.operator_choice === "14"
                                    ? {
                                        value: new Date(
                                            JSON.parse(
                                                modifyString(
                                                    item.filter_value as string
                                                )
                                            ).start
                                        ),
                                        endDate: new Date(
                                            JSON.parse(
                                                modifyString(
                                                    item.filter_value as string
                                                )
                                            ).end
                                        ),
                                    }
                                    : item.data_point_field === "7"
                                        ? {
                                            ...(item.operator_choice === "4" && {
                                                value: (
                                                    item.filter_value as string
                                                ).split("_")[0],
                                                upperValue: (
                                                    item.filter_value as string
                                                ).split("_")[1],
                                            }),
                                            ...(item.operator_choice !== "4" && {
                                                value: item.filter_value,
                                            }),
                                        }
                                        : item.data_point_field === "9"
                                            ? {
                                                value: (
                                                    item.filter_value as string
                                                ).split("_")[0],
                                                //   upperValue: (
                                                //       item.filter_value as string
                                                //   ).split("_")[1],
                                                upperValue: {
                                                    label: (
                                                        item.filter_value as string
                                                    ).split("_")[2],
                                                    value: (
                                                        item.filter_value as string
                                                    ).split("_")[1],
                                                },
                                            }
                                            : { value: item.filter_value }),
                            },
                        ],
                    };
                }
            });
            setState((prev) => ({ ...prev, transformData: tempTransformData }));
        } else {
            setState((prev) => ({ ...prev, transformData: [] }));
        }
    }, [selectedSegmentData]);
    return (
        <div
            className="tab-pane fade show active"
            id="active"
            role="tabpanel"
            aria-labelledby="active-tab"
        >
            <div className="saveSegments">
                <div className="text-block">
                    <h3>{heading}</h3>
                    <p>{headingHelperText}</p>
                </div>
                <div className="tableData">
                    <div className="tableHeader">
                        <div className="tableRow">
                            <div className="tableCell">
                                <div className="custom-checkbox">
                                    <input
                                        name={`selectAll${id}`}
                                        className="form-control checkmark"
                                        type="checkbox"
                                        disabled={!data.length ? true : false}
                                        checked={selectAll}
                                        onChange={(e) => {
                                            setState((prev) => ({
                                                ...prev,
                                                selectAll: e.target.checked,
                                            }));
                                            dispatch(
                                                selectOrDeselectAllCheckbox(
                                                    e.target.checked
                                                )
                                            );
                                        }}
                                        id={`selectAll${id}`}
                                    />
                                    <label
                                        htmlFor={`selectAll${id}`}
                                        className="custom-label"
                                    ></label>
                                </div>
                                Name
                            </div>
                            <div className="tableCell">Created</div>
                            <div className="tableCell">Last Modified</div>
                            <div className="tableCell">Usage</div>
                        </div>
                    </div>
                    {/* <Scrollbars
                        className="segmentsSection-scroll"
                        autoHeight
                        autoHeightMin={0}
                        autoHeightMax="calc(100vh - 28rem)"
                        renderThumbVertical={(props) => (
                            <div {...props} className="thumb-vertical" />
                        )}
                        renderTrackVertical={(props) => (
                            <div {...props} className="track-vertical" />
                        )}
                    > */}
                    <div
                        className="tableBody segmentsSection-scroll scrollSection"
                        id={id}
                        style={{
                            minHeight: 0,
                            maxHeight: "calc(100vh - 28rem)",
                        }}
                    >
                        <InfiniteScroll
                            dataLength={data.length}
                            next={fetchData}
                            hasMore={hasMore}
                            scrollThreshold={0.8}
                            loader={<Spinner />}
                            style={{ overflow: "hidden" }}
                            scrollableTarget={id}
                        >
                            {data.length > 0 ? (
                                data.map((item, index) => {
                                    return (
                                        <React.Fragment key={index}>
                                            <div className="tableRow">
                                                <div className="tableCell">
                                                    <div className="custom-checkbox">
                                                        <input
                                                            name={`select${item.id}`}
                                                            className="form-control checkmark"
                                                            type="checkbox"
                                                            id={`rem${item.id}`}
                                                            checked={
                                                                item.checked
                                                            }
                                                            onChange={(e) => {
                                                                dispatch(
                                                                    handleCheckbox(
                                                                        item.id
                                                                    )
                                                                );
                                                            }}
                                                        />
                                                        <label
                                                            htmlFor={`rem${item.id}`}
                                                            className="custom-label"
                                                        ></label>
                                                    </div>
                                                    {item.segment_name}
                                                </div>
                                                <div className="tableCell">
                                                    {moment(
                                                        item.date_created
                                                    ).format("MMM-DD-YYYY")}
                                                </div>
                                                <div className="tableCell">
                                                    {moment(
                                                        item.last_updated
                                                    ).format("MMM-DD-YYYY")}
                                                </div>
                                                <div className="tableCell">
                                                    <span>
                                                        <img
                                                            src="images/location-icon.svg"
                                                            alt=""
                                                        />
                                                    </span>
                                                    <span className="number">
                                                        {item.uses_count}
                                                    </span>
                                                    <span
                                                        onClick={() => {
                                                            if (
                                                                item.id !==
                                                                selectedRowId
                                                            ) {
                                                                dispatch(
                                                                    handleSelectedRowId(
                                                                        item.id
                                                                    )
                                                                );
                                                                dispatch(
                                                                    fetchSelectedSegmentDetails(
                                                                        access_token,
                                                                        item.id
                                                                    )
                                                                );
                                                            } else {
                                                                dispatch(
                                                                    handleSelectedRowId(
                                                                        0
                                                                    )
                                                                );
                                                                dispatch(
                                                                    handleSelectedSegmentData(
                                                                        []
                                                                    )
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        {selectedRowId ===
                                                            item.id ? (
                                                            <img
                                                                src="images/up-arrow2.svg"
                                                                alt=""
                                                            />
                                                        ) : (
                                                            <img
                                                                src="images/down-arrow2.svg"
                                                                alt=""
                                                            />
                                                        )}{" "}
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                className={
                                                    selectedRowId === item.id
                                                        ? "segmentsDetails show"
                                                        : "segmentsDetails"
                                                }
                                            >
                                                <div className="top-block">
                                                    <div className="text">
                                                        <h3>
                                                            Segment for wells
                                                            where:
                                                        </h3>
                                                        <p>
                                                            All of the following
                                                            conditions match
                                                        </p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="btn"
                                                        onClick={() => {
                                                            localStorage.setItem(
                                                                "advFilData",
                                                                JSON.stringify({
                                                                    data: transformData,
                                                                    segmentName:
                                                                        item.segment_name,
                                                                    segmentId: item.id
                                                                })
                                                            );
                                                            navigate("/search");
                                                        }}
                                                    >
                                                        Edit Segment
                                                    </button>
                                                </div>
                                                {transformData.map(
                                                    (item, index) => {
                                                        return (
                                                            <React.Fragment
                                                                key={index}
                                                            >
                                                                {index === 0 ? (
                                                                    <div className="conditions-block">
                                                                        {item.filter.map(
                                                                            (
                                                                                _item,
                                                                                _index
                                                                            ) => {
                                                                                return (
                                                                                    <div className="block-outer">
                                                                                        {_index >
                                                                                            0 ? (
                                                                                            <div
                                                                                                className={
                                                                                                    item.condition ===
                                                                                                        "1"
                                                                                                        ? "and"
                                                                                                        : "or"
                                                                                                }
                                                                                            >
                                                                                                {item.condition ===
                                                                                                    "1"
                                                                                                    ? "AND"
                                                                                                    : "OR"}
                                                                                            </div>
                                                                                        ) : (
                                                                                            <div className="empty">
                                                                                                &nbsp;
                                                                                            </div>
                                                                                        )}

                                                                                        <div className="rowblock">
                                                                                            <span>
                                                                                                {
                                                                                                    groupChoices.filter(
                                                                                                        (
                                                                                                            obj
                                                                                                        ) =>
                                                                                                            obj.value ===
                                                                                                            _item.dataPoint
                                                                                                    )[0]
                                                                                                        .label
                                                                                                }
                                                                                            </span>{" "}
                                                                                            for&nbsp;
                                                                                            <span>
                                                                                                {
                                                                                                    (_item.dataPoint ===
                                                                                                        "3"
                                                                                                        ? rigsFieldChoices
                                                                                                        : wellsAndPermitFieldChoices
                                                                                                    ).filter(
                                                                                                        (
                                                                                                            obj
                                                                                                        ) =>
                                                                                                            obj.value ===
                                                                                                            _item.fields
                                                                                                    )[0]
                                                                                                        .label
                                                                                                }
                                                                                            </span>
                                                                                            {
                                                                                                operatorChoices.filter(
                                                                                                    (
                                                                                                        obj
                                                                                                    ) =>
                                                                                                        obj.value ===
                                                                                                        _item.operator
                                                                                                )[0]
                                                                                                    .label
                                                                                            }{" "}
                                                                                            &nbsp;{" "}
                                                                                            {_item?.endDate
                                                                                                ? moment(
                                                                                                    `${_item.value}`
                                                                                                ).format(
                                                                                                    "MMM-DD-YYYY"
                                                                                                )
                                                                                                : `${_item.value}`}
                                                                                            {_item?.upperValue &&
                                                                                                typeof _item?.upperValue ===
                                                                                                "object"
                                                                                                ? ` and ${(
                                                                                                    _item.upperValue as OptionType
                                                                                                )
                                                                                                    .value
                                                                                                } ( ${(
                                                                                                    _item.upperValue as OptionType
                                                                                                )
                                                                                                    .label
                                                                                                } )`
                                                                                                : _item.upperValue ? ` and ${_item.upperValue}` : ""}
                                                                                            {_item?.endDate
                                                                                                ? ` and ${moment(
                                                                                                    _item.endDate
                                                                                                ).format(
                                                                                                    "MMM-DD-YYYY"
                                                                                                )}`
                                                                                                : ""}
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <div className="dynamic-conditionblock">
                                                                        <span
                                                                            className={
                                                                                item.groupCondition ===
                                                                                    "4"
                                                                                    ? "and"
                                                                                    : "or"
                                                                            }
                                                                        >
                                                                            {item.groupCondition ===
                                                                                "4"
                                                                                ? "And"
                                                                                : "OR"}
                                                                        </span>
                                                                        <div className="condition-box">
                                                                            {item.filter.map(
                                                                                (
                                                                                    _obj,
                                                                                    _i
                                                                                ) => {
                                                                                    return (
                                                                                        <div className="block-outer">
                                                                                            {_i >
                                                                                                0 ? (
                                                                                                <div
                                                                                                    className={
                                                                                                        item.condition ===
                                                                                                            "1"
                                                                                                            ? "and"
                                                                                                            : "or"
                                                                                                    }
                                                                                                >
                                                                                                    {item.condition ===
                                                                                                        "1"
                                                                                                        ? "AND"
                                                                                                        : "OR"}
                                                                                                </div>
                                                                                            ) : (
                                                                                                <div className="empty">
                                                                                                    &nbsp;
                                                                                                </div>
                                                                                            )}

                                                                                            <div className="rowblock">
                                                                                                <span>
                                                                                                    {
                                                                                                        groupChoices.filter(
                                                                                                            (
                                                                                                                obj
                                                                                                            ) =>
                                                                                                                obj.value ===
                                                                                                                _obj.dataPoint
                                                                                                        )[0]
                                                                                                            .label
                                                                                                    }
                                                                                                </span>{" "}
                                                                                                for&nbsp;
                                                                                                <span>
                                                                                                    {
                                                                                                        (_obj.dataPoint ===
                                                                                                            "3"
                                                                                                            ? rigsFieldChoices
                                                                                                            : wellsAndPermitFieldChoices
                                                                                                        ).filter(
                                                                                                            (
                                                                                                                obj
                                                                                                            ) =>
                                                                                                                obj.value ===
                                                                                                                _obj.fields
                                                                                                        )[0]
                                                                                                            .label
                                                                                                    }
                                                                                                </span>
                                                                                                {
                                                                                                    operatorChoices.filter(
                                                                                                        (
                                                                                                            obj
                                                                                                        ) =>
                                                                                                            obj.value ===
                                                                                                            _obj.operator
                                                                                                    )[0]
                                                                                                        .label
                                                                                                }{" "}
                                                                                                &nbsp;{" "}
                                                                                                {_obj?.endDate
                                                                                                    ? moment(
                                                                                                        `${_obj.value}`
                                                                                                    ).format(
                                                                                                        "MMM-DD-YYYY"
                                                                                                    )
                                                                                                    : `${_obj.value}`}
                                                                                                {_obj?.upperValue &&
                                                                                                    typeof _obj?.upperValue ===
                                                                                                    "object"
                                                                                                    ? ` and ${(
                                                                                                        _obj.upperValue as OptionType
                                                                                                    )
                                                                                                        .value
                                                                                                    } ( ${(
                                                                                                        _obj.upperValue as OptionType
                                                                                                    )
                                                                                                        .label
                                                                                                    } )`
                                                                                                    : _obj.upperValue ? ` and ${_obj.upperValue}` : ""}
                                                                                                {_obj?.endDate
                                                                                                    ? ` and ${moment(
                                                                                                        _obj.endDate
                                                                                                    ).format(
                                                                                                        "MMM-DD-YYYY"
                                                                                                    )}`
                                                                                                    : ""}
                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                }
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </React.Fragment>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </React.Fragment>
                                    );
                                })
                            ) : (
                                <div className="norecord">No Record Found</div>
                            )}
                        </InfiniteScroll>
                    </div>
                    {/* </Scrollbars> */}
                </div>
            </div>
            <div className="action-block">
                <button
                    type="button"
                    className={`btn ${data.filter((item) => item.checked).length > 0
                        ? "btn-primary"
                        : "btn-disabled"
                        }`}
                    onClick={() => {
                        if (tabIndex === 1) {
                            setState((prev) => ({
                                ...prev,
                                deleteAndArchiveConfModal: true,
                            }));
                        } else {
                            dispatch(
                                segmentBtnAction(access_token, {
                                    id: data
                                        .filter((item) => item.checked)
                                        .map((_item) => _item.id),
                                    action: "activate",
                                })
                            ).then((res) => {
                                const { status, msg } = res;
                                if (status === 200) {
                                    toast.success(msg);
                                    dispatch(clearActiveOrArchiveSegmentList());
                                } else {
                                    toast.error(msg);
                                }
                            });
                        }
                    }}
                >
                    {tabIndex === 1 ? "Archive" : "Activate"}
                </button>
                &nbsp;&nbsp;
                {tabIndex === 2 ? (
                    <button
                        type="button"
                        className={`btn ${data.filter((item) => item.checked).length > 0
                            ? "btn-tertiary"
                            : "btn-disabled"
                            }`}
                        onClick={() => {
                            setState((prev) => ({
                                ...prev,
                                deleteAndArchiveConfModal: true,
                            }));
                        }}
                    >
                        Delete
                    </button>
                ) : (
                    <></>
                )}
            </div>
            {deleteAndArchiveConfModal && (
                <DeleteConfirmationModal
                    show={deleteAndArchiveConfModal}
                    handleClose={() =>
                        setState((prev) => ({
                            ...prev,
                            deleteAndArchiveConfModal: false,
                        }))
                    }
                    confirmBtnClick={() => {
                        dispatch(
                            segmentBtnAction(access_token, {
                                id: data
                                    .filter((item) => item.checked)
                                    .map((_item) => _item.id),
                                action: tabIndex === 1 ? "archive" : "delete",
                            })
                        ).then((res) => {
                            const { status, msg } = res;
                            if (status === 200) {
                                toast.success(msg);
                                setState((prev) => ({
                                    ...prev,
                                    deleteAndArchiveConfModal: false,
                                }));
                                dispatch(clearActiveOrArchiveSegmentList());
                            } else {
                                toast.error(msg);
                            }
                        });
                    }}
                    content={
                        tabIndex === 1 ? (
                            <p>Do you want to archive the segment ?</p>
                        ) : (
                            <p>Do you want to Delete the segment ?</p>
                        )
                    }
                />
            )}
        </div>
    );
}

export default Content;
