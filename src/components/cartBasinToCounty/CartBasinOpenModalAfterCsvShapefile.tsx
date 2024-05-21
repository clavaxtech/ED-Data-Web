import React, { useEffect, useState } from "react";
import CartBasinApiCols from "./CartBasinApiCols";
import GlobalTable from "../common/GlobalTable";
import { GlobalTableProps } from "../models/page-props";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import {
    contWithoutSavingApiList,
    handleWellApiListAfterCsvUpload,
    saveApiList,
    uploadShapeFileOrCsv,
} from "../store/actions/cart-basin-to-county-actions";
import { toast } from "react-toastify";
import InputComponent from "../common/InputComponent";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    ApiListTableFormData,
    OptionType,
    SaveAsAoiFormData,
    csvApiDataObj,
} from "../models/submit-form";
import {
    apiListTableNotRequiredValidation,
    apiListTableValidation,
    saveAsAoiValidation,
} from "../../Helper/validation";
import { hideSiteLoader, toggleCrsModal } from "../store/actions/modal-actions";
import { GlobalPagination } from "../common/Pagination";
import Scrollbars from "react-custom-scrollbars";
import { SaveApiListFormData } from "../models/redux-models";
import { logUserAction } from "../store/actions/auth-actions";
import { actionType } from "../../utils/helper";

interface cartBasinModalAFterProps {
    csvApiFileData: csvApiDataObj[];
    // csvApiUnmatchedFileData: csvApiDataObj[];
    // csvApiMatchedFileData: csvApiDataObj[];
    apiCheckBoxes: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCloseHandler: (
        props: { [x: string]: any },
        geometry?: string
    ) => void;
    csvApiFileName: string;
}

export const CartBasinOpenModalAfterAPiModal = (
    props: cartBasinModalAFterProps
) => {
    const {
        csvApiFileData,
        apiCheckBoxes,
        // csvApiUnmatchedFileData,
        handleCloseHandler,
        // csvApiMatchedFileData,
        csvApiFileName,
    } = props;

    const {
        auth: {
            user: { access_token },
        },
    } = useAppSelector((state) => state);

    const dispatch = useAppDispatch();

    const [state, setState] = useState({
        page: 1,
        totalPage: 1,
        startIndex: 0,
        lastIndex: 0,
        page_size: 100,
        activeTabIndex: 0,
        data: [] as csvApiDataObj[],
    });
    const {
        startIndex,
        lastIndex,
        page,
        totalPage,
        page_size,
        data,
        activeTabIndex,
    } = state;

    const {
        handleSubmit,
        control,
        setValue,
        clearErrors,
        formState: { errors },
    } = useForm<ApiListTableFormData>({
        resolver:
            activeTabIndex === 0
                ? yupResolver(apiListTableValidation)
                : yupResolver(apiListTableNotRequiredValidation),
    });

    useEffect(() => {
        let data =
            activeTabIndex === 2
                ? csvApiFileData
                : activeTabIndex === 0
                    ? csvApiFileData.filter((item) => item.status === "no match")
                    : activeTabIndex === 1
                        ? csvApiFileData.filter((item) => item.status === "matched")
                        : csvApiFileData.filter(
                            (item) => item.status === "not in plan"
                        );
        data.forEach((item, index) => {
            setValue(`wellMatching.${index}.name`, item.wellMatching);
        });
        setState((prev) => ({
            ...prev,
            startIndex: page_size * (page - 1),
            lastIndex: page * page_size,
            data,
            ...(page === 1 && {
                totalPage:
                    Math.floor(data.length / page_size) +
                    (data.length % page_size > 0 ? 1 : 0),
            }),
        }));
        //closing the loader 
        dispatch(hideSiteLoader())
        // eslint-disable-next-line
    }, [page, activeTabIndex, csvApiFileData]);

    const onPageChange = (page: number) => {
        setState((prev) => ({ ...prev, page: page }));
    };

    const onSubmit = (data: ApiListTableFormData) => {
        if (
            csvApiFileData.filter((item) => item.status === "no match").length >
            0
        ) {
            toast.error("Please match the all the unmatched wells");
            return;
        }
        let tempData = csvApiFileData.filter(
            (_item) => _item.status === "matched"
        );
        let tempApiList: OptionType[] = [];
        let transformData = JSON.stringify(tempData).includes("api")
            ? tempData.map((item) => {
                return {
                    api: item.api,
                    matching_api:
                        Array.isArray(item.wellMatching) &&
                        item.wellMatching.map((_item) => {
                            tempApiList.push({
                                label: _item.value,
                                value: _item.value,
                            });
                            return _item.value;
                        }),
                };
            })
            : tempData.map((item) => {
                return {
                    well_name: item.well_name,
                    state: item.state,
                    county: item.county,
                    matching_api:
                        Array.isArray(item.wellMatching) &&
                        item.wellMatching.map((_item) => {
                            tempApiList.push({
                                label: _item.value,
                                value: _item.value,
                            });
                            return _item.value;
                        }),
                };
            });
        dispatch(
            saveApiList(access_token, {
                file_name: csvApiFileName,
                data: transformData as SaveApiListFormData["data"],
            })
        ).then((res) => {
            const { status, msg } = res;
            if (status === 200) {
                toast.success(msg);
                dispatch(handleWellApiListAfterCsvUpload(tempApiList));
                handleCloseHandler({
                    openModalAFterUploadModal: false,
                });
            } else {
                toast.error(msg);
            }
        });
    };

    const status = [
        {
            label: "Unmatched",
            className: "unmatched",
            tabIndex: 0,
            count: csvApiFileData.filter((item) => item.status === "no match")
                .length,
        },
        {
            label: "Matched",
            className: "matched",
            tabIndex: 1,
            count: csvApiFileData.filter((item) => item.status === "matched")
                .length,
        },
        {
            label: "View All",
            className: "view-all",
            tabIndex: 2,
            count: csvApiFileData.length,
        },
        ...(csvApiFileData.filter((item) => item.status === "not in plan")
            .length
            ? [
                {
                    label: "Unsubscribed",
                    className: "notplan",
                    tabIndex: 3,
                    count: csvApiFileData.filter(
                        (item) => item.status === "not in plan"
                    ).length,
                },
            ]
            : []),
    ];

    return (
        <>
            <h3>
                <i className="fa-solid fa-cloud-arrow-up"></i> Uploaded API’s
            </h3>
            <form
                className="form-block"
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="off"
                autoCapitalize="off"
            >
                <div className="saveUploadedApi">
                    <p>
                        Your API's were uploaded. We matched all wells in our
                        database and provided suggestions for the partially
                        matching ones. Please confirm or delete the suggestions
                        and enter any missing wells manually.
                    </p>
                </div>
                <div className="filterLable saveUploadedApi">
                    <ul>
                        {status.map((item, index) => {
                            const { label, className, count, tabIndex } = item;
                            return (
                                <li
                                    className={
                                        activeTabIndex === tabIndex
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() => {
                                        if (activeTabIndex !== tabIndex) {
                                            clearErrors();
                                            setState((prev) => ({
                                                ...prev,
                                                page: 1,
                                                activeTabIndex: tabIndex,
                                            }));
                                        }
                                    }}
                                    key={index}
                                >
                                    {label}
                                    <span className={className}>{count}</span>
                                </li>
                            );
                        })}
                    </ul>
                    <div className="save">
                        <button
                            type="submit"
                            className="btn btn-green"
                            onClick={() => {
                                if (
                                    csvApiFileData.filter(
                                        (item) => item.status === "no match"
                                    ).length > 0 &&
                                    activeTabIndex === 0
                                ) {
                                    toast.error(
                                        "Please match all the unmatched wells"
                                    );
                                }
                            }}
                        >
                            <i className="fa-solid fa-floppy-disk"></i> Save
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                                if (
                                    csvApiFileData.filter(
                                        (item) => item.status === "no match"
                                    ).length > 0
                                ) {
                                    toast.error(
                                        "Please match all the unmatched wells"
                                    );
                                    return;
                                }
                                dispatch(
                                    contWithoutSavingApiList(access_token)
                                ).then((res) => {
                                    const { status, msg } = res;
                                    if (status === 200) {
                                        toast.success(msg);
                                        handleCloseHandler({
                                            openModalAFterUploadModal: false,
                                        });
                                    } else {
                                        toast.error(msg);
                                    }
                                });
                            }}
                            style={{ marginLeft: "1rem" }}
                        >
                            Continue without saving
                        </button>
                    </div>
                </div>
                <div className="CartSearchCon" style={{ display: "block" }}>


                    <div className="searchList popTable">
                        <Scrollbars
                            className="popTable-scroll"
                            autoHeightMin={0}
                            renderThumbVertical={(props) => (
                                <div {...props} className="thumb-vertical" />
                            )}
                            renderTrackVertical={(props) => (
                                <div {...props} className="track-vertical" />
                            )}
                        >
                            <GlobalTable
                                tableStyle={{
                                    border: 0,
                                    cellPadding: 0,
                                    cellSpacing: 0,
                                }}
                                cols={
                                    CartBasinApiCols(
                                        apiCheckBoxes,
                                        control,
                                        errors,
                                        handleCloseHandler,
                                        setValue,
                                        csvApiFileData
                                    ) as GlobalTableProps["cols"]
                                }
                                data={[...data].splice(startIndex, lastIndex)}
                            />
                        </Scrollbars>
                    </div>
                </div>
            </form>

            <div className="pagination-block">
                <GlobalPagination
                    currentPage={page}
                    totalPages={totalPage}
                    onPageChange={onPageChange}
                />
            </div>
        </>
    );
};

export const CartBasinOpenModalAfterShapeFileModal = ({
    file,
    handleCloseHandler,
    handleStateKey,
}: {
    file: Blob | null;
    handleCloseHandler: (
        props: { [x: string]: boolean },
        geometry?: string,
        epsg?: string
    ) => void;
    handleStateKey: (obj: { [x: string]: string }) => void;
}) => {
    const dispatch = useAppDispatch();
    const {
        auth: {
            user: { access_token },
        },
    } = useAppSelector((state) => state);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SaveAsAoiFormData>({
        resolver: yupResolver(saveAsAoiValidation),
    });

    const uploadFile = (aoi_name?: string, buffer_distance?: string) => {
        if (file !== null) {
            dispatch(
                uploadShapeFileOrCsv(access_token, {
                    file,
                    ...(aoi_name && { aoi_name }),
                    ...(buffer_distance && { buffer_distance }),
                }, 'upload_shapefile')
            ).then((res) => {
                const {
                    data: { filter_data },
                    status,
                    msg,
                    file_name,
                    epsg
                } = res;
                if (status === 200) {
                    //log user actions
                    dispatch(
                        logUserAction({
                            action_type: actionType['upload_shapefile'],
                            action_log_detail: JSON.stringify({
                                ...(file_name && { file_name }),
                                // ...(aoi_name && { aoi_name: aoi_name }),
                                // ...(buffer_distance && { buffer_distance: buffer_distance }),
                                ...(!file_name && { message: "User adopted continue without saving method." })
                            })
                        })
                    );
                    toast.success(msg);
                    handleCloseHandler(
                        {
                            openModalAFterUploadModal: false,
                        },
                        filter_data as string,
                        epsg as string
                    );
                } else {
                    if (status === 422 && msg === "Enter the CRS of the file") {
                        file_name &&
                            aoi_name &&
                            handleStateKey({ file_name, aoi_name });
                        handleCloseHandler({
                            openModalAFterUploadModal: false,
                        });
                        dispatch(toggleCrsModal());
                    } else {
                        toast.error(msg);
                    }
                }
            });
        }
    };

    const onSubmit = (data: SaveAsAoiFormData) => {
        const { aoi_name, bufferDistance } = data;
        uploadFile(aoi_name, bufferDistance);
    };

    return (
        <>
            <h3>
                <i className="fa-regular fa-floppy-disk"></i> Save as AOI
            </h3>
            <p>
                Save shapefiles as Areas of Interest (AOI) to receive
                notifications when changes occur to any of the wells in your
                list.
            </p>
            <form
                className="form-block"
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="off"
                autoCapitalize="off"
            >
                <div className="row">
                    <div className="col-md-8">
                        <div className="form-group">
                            <InputComponent
                                label="Name your AOI"
                                name="aoi_name"
                                placeholder="Enter AOI name"
                                register={register}
                                errorMsg={errors.aoi_name?.message}
                            />
                        </div>
                    </div>
                </div>
                <br></br>
                <div className="row">
                    <div className="col-md-8">
                        <div className="form-group">
                            <InputComponent
                                label="Buffer Distance (miles)"
                                name="bufferDistance"
                                type={"number"}
                                placeholder="Enter miles"
                                register={register}
                                errorMsg={"bufferDistance" in errors ? errors.bufferDistance?.message : ''}
                            />
                            <span className="maxtext">Add a buffer around your AOI</span>
                        </div>
                    </div>
                </div>
                <br />
                <div className="action-footer">
                    <button
                        type="button"
                        className="btn btn-outline-white"
                        onClick={() => {
                            uploadFile();
                        }}
                    >
                        Continue without Saving
                    </button>
                    <button type="submit" className="btn btn-green">
                        Save as AOI
                    </button>
                </div>
            </form >
        </>
    );
};
