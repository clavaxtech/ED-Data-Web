import { InputField } from "../common/InputField";
// import CartBasinBubble from "./CartBasinBubble";
import CartBasinDate from "./CartBasinDate";
import CartBasinMultiSelectFields from "./CartBasinMultiSelectFields";
import UploadFileModal from "../common/Modal/UploadFileModal";
import {
    cartBasinDates as dateList,
    // drillTypeList,
    productType,
    inputFieldProps,
    multiSelectProps,
    menuOption,
    drillTypeOption,
    wellTypeOption,
    wellStatusOption,
} from "./CartBasinConstant";
import {
    showUploadModal,
    hideUploadModal,
    showSiteLoader,
    hideSiteLoader,
    toggleUploadingCsvApiListModal,
    toggleApiUpgradeSubModal,
    hideCheckOutModal,
} from "../store/actions/modal-actions";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { useEffect, useRef, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CartBasinSchema } from "../../Helper/validation";
import Moment from "moment";
import { splitValues } from "../../Helper/common";
import {
    DO_NOT_SHOW_UPGRADE_MODAL,
    actionType,
    extractOption,
    handleCsvFile,
    handleShapeFile,
} from "../../utils/helper";
import ExportToCsvModal from "./ExportToCsvModal";
import {
    CartBasinFilterState,
    OptionType,
    reactSelectProps,
    searchListObject,
} from "../models/page-props";
import CartBasinModal from "./CartBasinModal";
import {
    clearProductionData,
    clearRigsData,
    clearWellsData,
    getWellsAndPermitList,
    // handleDownloadCol,
    handlePageChange,
    handleShowAndHideSegmentDropDown,
    showHideColProperties,
    showHideCsvDownOpt,
    showHideFullScreen,
    toggleViewAnalytics,
} from "../store/actions/wells-rigs-action";
import { toast } from "react-toastify";
import moment from "moment";
import UploadingCsvApiListModal from "./UploadingCsvApiListModal";
import {
    fetchOptionsList,
    handleClearAllFilter,
    // fetchSliderMaxValue,
    // handleSliderValue,
    handleWellApiListAfterCsvUpload,
    uploadShapeFileOrCsv,
} from "../store/actions/cart-basin-to-county-actions";
import { csvApiDataObj } from "../models/submit-form";
import ApiUpgradeSubModal from "./ApiUpgradeSubModal";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentModal from "../common/Modal/PaymentModal";
import {
    getApiListAfterCompletingThePayment,
    getCartDetails,
    removeCartItems,
} from "../store/actions/cart-select-basin-county-actions";
import DeleteConfirmationModal from "../common/Modal/DeleteConfirmationModal";
import Scrollbars from "react-custom-scrollbars";
import SliderMinMax from "./SliderMinMax";
import { handlePreviousSearchFilter, toggleAoiSideCon } from "../store/actions/aoi-actions";
import { downloadFileLogs } from "../store/actions/files-actions";
import { logUserAction } from "../store/actions/auth-actions";
import { tableColObje } from "../models/redux-models";

const stripePromise = loadStripe(
    `${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`
);

const CartBasinFilterSection = () => {
    const itemsRef = useRef<HTMLDivElement[]>([]);

    const {
        control,
        handleSubmit,
        setValue,
        getValues,
        watch,
        clearErrors,
        reset,
        register,
    } = useForm({
        resolver: yupResolver(CartBasinSchema),
    });
    const hookObject: { [x: string]: OptionType } = { statekey: [] };
    hookObject["statekey"] = watch("state_abbr");
    hookObject["api_file"] = watch("api_file");
    hookObject["well_api"] = watch("well_api");
    // hookObject["category"] = watch("category");
    const { statekey, api_file, well_api,
        // category 
    } = hookObject;

    const onChangeStartDate = (date: Date, name: string) => {
        if (date) {
            dateList?.forEach(({ unique_name, fields }) => {
                if (unique_name === name) {
                    clearErrors(fields[0].f_fieldname);
                    setValue(fields[0].f_fieldname, date);
                    setValue(
                        fields[0].l_fieldname,
                        Moment(
                            Moment(getValues()[fields[0].l_fieldname]).format(
                                "MMM-DD-YYYY"
                            )
                        ).isAfter(Moment(date).format("MMM-DD-YYYY"))
                            ? getValues()[fields[0].l_fieldname]
                            : null
                    );
                }
            });
        }
    };

    const onChangeEndDate = (date: Date, name: string) => {
        if (date) {
            dateList?.forEach(({ unique_name, fields }) => {
                if (unique_name === name) {
                    setValue(fields[0].l_fieldname, date);
                }
            });
        }
    };

    // Send extra param to fetchOptionHandler Attribute
    const multiStepOptionExtraField = [
        // Follow Order As Per Field
        { extrafield: null },
        { extrafield: null },
        { extrafield: null },
        { extrafield: null },
        { extrafield: null },
        { extrafield: null },
        {
            extrafield: {
                state: splitValues(statekey),
            },
        },
        {
            extrafield: null,
        },
        {
            extrafield: null,
        },
        {
            extrafield: null,
        },
        {
            extrafield: null,
        },
        {
            extrafield: null,
        },
        {
            extrafield: null,
        },
        {
            extrafield: null,
        },
        // {
        //     extrafield: {
        //         category: splitValues(category),
        //     },
        // },
        {
            extrafield: null,
        },
    ];
    // keys to create multiselect as dependent dropdown
    const multiSelectUniqCache = [
        // Follow Order As Per Field
        { uniqCache: [] },
        { uniqCache: [] },
        { uniqCache: [] },
        { uniqCache: [] },
        { uniqCache: [] },
        { uniqCache: [] },
        { uniqCache: [splitValues(statekey)] },
        { uniqCache: [] },
        { uniqCache: [] },
        { uniqCache: [] },
        { uniqCache: [] },
        { uniqCache: [] },
        { uniqCache: [] },
        { uniqCache: [] },
        // { uniqCache: [splitValues(category)] },
        { uniqCache: [] },

    ];

    const dispatch = useAppDispatch();
    const {
        modal: {
            uploadModal,
            uploadingCsvApiListModal,
            apiUpgradeSubModal,
            checkOutModal,
        },
        auth: {
            user: { access_token },
        },
        wellsAndRigs: {
            wellsData: { wellsDataLoading, data: wellsDataList, },
            rigsData: { rigsDataLoading, data: rigsDataList, },
            permitsData: { permitsDataLoading, data: permitDataList },
            productionData: { productionDataLoading, data: productionDataList, },
            tabIndex,
            wellsPage,
            rigsPage,
            permitsPage,
            productionPage,
            filterSearch,
            sort_order,
            sort_by,
            colProperties,
            csvDownOpt,
            viewAnalytics,
            fullScreen,
            filter,
            filter_param,
            segment_id,
            showTableLoader,
            downloadCol,
            tableCol,
            rigsTableCol,
            allCol,
            showSegmentDropDown,
            productionCol,
            fullScrnAnalytics,
            uid
        },
        cartSelectBasinCounty: { cartListItems },
        cartBasinToCounty: { clearAllFilter, wellApiListAfterCsvUpload, sliderMinMaxValue, hideSearchFilter },
        aoi: { showAoiSideCon },
        esri: { featuresForStatistics }
    } = useAppSelector((state) => state);

    let data =
        tabIndex === 0
            ? wellsDataList
            : tabIndex === 1
                ? rigsDataList
                : tabIndex === 2 ? permitDataList : productionDataList;

    const col = tabIndex === 0 || tabIndex === 2 ? tableCol : tabIndex === 1 ? rigsTableCol : productionCol;
    const initialStateObj = {
        shapeFileModal: false,
        // drillType: drillTypeList,
        // productTypeList: productType,
        fileToOpen: 0,
        openModalAFterUploadModal: false,
        // apiList: apiTableData,
        isChooseColumn: false,
        isExportOther: false,
        formData: {
            // drill_type: drillTypeList
            //     .filter((item) => item.active)
            //     .map((_item) => _item.title.toLowerCase()),
            well_type: wellTypeOption.filter((_item) => _item.value === "production").map((item) => item.value),

            production_type: productType.filter((item) => (item.value === "oil" || item.value === "gas" || item.value === "oil/gas" || item.value === "unknown")).map((item) => item.value),

            well_status: wellStatusOption.filter((_item) => (_item.value === "pre-permit" || _item.value === "active permit" || _item.value === "drilled-uncompleted" || _item.value === "active")).map((item) => item.value),

            drill_type: [...drillTypeOption.map((item) => item.value), "Select All"],

            // category: menuOption.filter((item, index) => index === 0 || index === 2).map((_item) => _item.value),

            // sub_category: [menuOption.filter((item, index) => index === 0)[0]['subMenu'][0]['value'], ...menuOption.filter((item, index) => index === 2)[0]['subMenu'].map((item) => item.value)]
        },
        file: null,
        geometry: "",
        epsg: "",
        csvApiFileName: "",
        csvApiFileSize: 0,
        csvApiFileData: [],
        csvApiUnmatchedFileData: [],
        csvApiMatchedFileData: [],
        csvApiFileLoading: true,
        deleteCartItemModal: false,
        deleteItemId: null,
        deleteItemType: null,
        sub_total: 0,
        notInPlan: false,
        byBasinTabData: [],
        byCountyTabData: [],
        apiFileWellApiList: [],
    }
    const [state, setState] = useState<CartBasinFilterState>(initialStateObj);
    const {
        shapeFileModal,
        // drillType,
        // productTypeList,
        fileToOpen,
        openModalAFterUploadModal,
        // apiList,
        isChooseColumn,
        isExportOther,
        formData,
        file,
        geometry,
        epsg,
        csvApiFileName,
        csvApiFileSize,
        csvApiFileData,
        csvApiFileLoading,
        deleteCartItemModal,
        deleteItemId,
        deleteItemType,
        sub_total,
        notInPlan,
        byBasinTabData,
        byCountyTabData,
        apiFileWellApiList,
    } = state;

    // const handleDrillType = (id: number) => {
    //     setState((prev) => ({
    //         ...prev,
    //         drillType: drillType.map((value) =>
    //             value.id === id
    //                 ? Object.assign(value, { active: !value.active })
    //                 : value
    //         ),
    //     }));
    // };
    // const resetDrillType = () => {
    //     setState((prev) => ({
    //         ...prev,
    //         drillType: drillType.map((value) => ({ ...value, active: true })),
    //     }));
    // };

    // const handleProductType = (id: number) => {
    //     setState((prev) => ({
    //         ...prev,
    //         productTypeList: productTypeList.map((value) =>
    //             value.id === id ? { ...value, active: !value.active } : value
    //         ),
    //     }));
    // };

    // const resetProductType = () => {
    //     setState((prev) => ({
    //         ...prev,
    //         productTypeList: productTypeList.map((value) => ({
    //             ...value,
    //             active: true,
    //         })),
    //     }));
    // };

    const handleFileChange = async (acceptedFile: Blob | Blob[]) => {
        dispatch(showSiteLoader());
        try {
            if (Array.isArray(acceptedFile)) return;
            let fileType = acceptedFile.name.split(".").pop();
            if (fileType && ["csv"].includes(fileType)) {
                const csvResponse = await handleCsvFile(acceptedFile);
                if (csvResponse?.status && csvResponse.status === 200) {
                    const {
                        meta: { fields },
                    } = csvResponse.data;
                    if (
                        fields.includes("api") ||
                        (fields.includes("well_name") &&
                            fields.includes("state") &&
                            fields.includes("county"))
                    ) {
                        dispatch(hideUploadModal());
                        setState((prev) => ({
                            ...prev,
                            csvApiFileLoading: true,
                        }));
                        // dispatch(toggleUploadingCsvApiListModal());
                        dispatch(
                            uploadShapeFileOrCsv(access_token, {
                                file: acceptedFile,
                            }, "upload_api_list")
                        ).then((res) => {
                            const { data, status, msg } = res || {};
                            if (status === 200 && data) {
                                const {
                                    filter_data,
                                    not_in_plan,
                                    by_basin,
                                    by_county,
                                } = data;
                                setState((prev) => ({
                                    ...prev,
                                    ...(Array.isArray(filter_data) && {
                                        csvApiFileData: filter_data.map(
                                            (item, index) => ({
                                                ...item,
                                                wellMatching:
                                                    item.status ===
                                                        "no match" ||
                                                        item.status ===
                                                        "not in plan"
                                                        ? null
                                                        : [
                                                            {
                                                                label: `API: ${item.api} - ${item.well_name}`,
                                                                value: item.api,
                                                            },
                                                        ],
                                                id: index + 1,
                                            })
                                        ),
                                    }),
                                    // ...(Array.isArray(filter_data) && {
                                    //     csvApiMatchedFileData: filter_data
                                    //         .filter(
                                    //             (item) =>
                                    //                 item.status === "matched"
                                    //         )
                                    //         .map((item) => ({
                                    //             ...item,
                                    //             wellMatching: [
                                    //                 {
                                    //                     label: `API: ${item.api} - ${item.well_name}`,
                                    //                     value: item.api,
                                    //                 },
                                    //             ],
                                    //         })),
                                    // }),
                                    // ...(Array.isArray(unmatched_data) &&
                                    //     unmatched_data.length > 0 && {
                                    //         csvApiUnmatchedFileData:
                                    //             unmatched_data.map((item) => ({
                                    //                 ...item,
                                    //                 wellMatching: null,
                                    //             })),
                                    //     }),
                                    ...(not_in_plan && {
                                        notInPlan: not_in_plan,
                                    }),
                                    ...(by_basin &&
                                        by_basin.length > 0 && {
                                        byBasinTabData: by_basin.filter(
                                            (item) =>
                                                item.basin_name !== "na"
                                        ),
                                    }),
                                    ...(by_county &&
                                        by_county.length > 0 && {
                                        byCountyTabData: by_county.filter(
                                            (item) => item.county !== "na"
                                        ),
                                    }),
                                    csvApiFileName: acceptedFile.name,
                                    csvApiFileSize:
                                        acceptedFile.size / Math.pow(10, 6),
                                    csvApiFileLoading: false,
                                }));
                                handleOnClick()
                            } else {
                                toast.error(msg);
                                setState((prev) => ({
                                    ...prev,
                                    csvApiFileLoading: true,
                                }));
                                // dispatch(toggleUploadingCsvApiListModal());
                                dispatch(showUploadModal());
                                dispatch(hideSiteLoader())
                            }
                        });
                    } else {
                        toast.error(
                            "Please check your file. Your file may not contain the api or well_name, state, and county column. Please refer sample csv file for reference."
                        );
                        dispatch(hideSiteLoader())
                    }
                }
                // dispatch(hideSiteLoader());
            } else {
                handleShapeFile(acceptedFile)
                    .then((res) => {
                        if (res?.status && res.status === 200) {
                            dispatch(hideUploadModal());
                            setState((prev) => ({
                                ...prev,
                                file: acceptedFile,
                                fileToOpen: 2,
                                openModalAFterUploadModal: true,
                            }));
                            dispatch(hideSiteLoader());
                        }
                    })
                    .catch((error) => {
                        dispatch(hideSiteLoader());
                    });
            }
        } catch (error) { }
    };

    const commonCheckBoxes = (
        e: React.ChangeEvent<HTMLInputElement>,
        selectAllName: string,
        setStateFn: React.Dispatch<React.SetStateAction<CartBasinFilterState>>,
        tableList: string,
        uniquekey: string
    ) => {
        let { name, checked } = e.target;
        const key = tableList as string;
        const checkKey = uniquekey as string;
        if (name === selectAllName) {
            setStateFn((prev) => ({
                ...prev,
                ...prev,
                [tableList]: (
                    state[key as keyof CartBasinFilterState] as Array<
                        searchListObject & csvApiDataObj
                    >
                ).map((val) => ({ ...val, checked })),
            }));
        } else {
            setStateFn((prev) => ({
                ...prev,
                [tableList]: (
                    state[key as keyof CartBasinFilterState] as Array<
                        searchListObject & csvApiDataObj
                    >
                ).map((val) =>
                    val[
                        checkKey as keyof (searchListObject & csvApiDataObj)
                    ] === name
                        ? { ...val, checked }
                        : val
                ),
            }));
        }
    };

    const handleCloseHandler = (
        modalProps: { [x: string]: any },
        geometry?: string,
        epsg?: string
    ) =>
        setState((prev) => ({
            ...prev,
            ...modalProps,
            ...(geometry && { geometry }),
            ...(epsg && { epsg }),
        }));

    useEffect(() => {
        const keyDownHandler = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                event.preventDefault();
                if (!sessionStorage.getItem("menuIsOpen")) {
                    // 👇️ your logic here   
                    !fullScrnAnalytics && onSubmit(getValues());
                } else {
                    sessionStorage.removeItem("menuIsOpen");
                }
            }
        };
        document.addEventListener("keydown", keyDownHandler);

        return () => {
            document.removeEventListener("keydown", keyDownHandler);
        }
        // eslint-disable-next-line 
    }, [tabIndex, fullScrnAnalytics])

    const setDefaultValue = () => {
        let tempCategory = menuOption.filter((item, index) => index === 0 || index === 2)
        let tempSubCategory: reactSelectProps[] = [];
        tempCategory.forEach((item, index) => {
            tempSubCategory = [...tempSubCategory, ...(index === 0 ? [item.subMenu[0]] : item.subMenu)]
        })
        // tempSubCategory.push({
        //     label: "Select All",
        //     value: "select_all"
        // })
        const { production_type, well_type, well_status } = initialStateObj.formData;
        //for selecting default value for the below drop down
        setValue('drill_type', drillTypeOption)

        setValue('production_type', productType.filter((item) => JSON.stringify(production_type).includes(item.value)))

        // setValue('category', tempCategory)
        // setValue('sub_category', tempSubCategory)

        well_type.length && setValue('well_type', wellTypeOption.filter((item) => JSON.stringify(well_type).includes(item.value)));

        well_status.length && setValue('well_status', wellStatusOption.filter((item) => JSON.stringify(well_status).includes(item.value)));
    }

    useEffect(() => {
        setDefaultValue()



        return () => {
            checkOutModal && dispatch(hideCheckOutModal());
            apiUpgradeSubModal && dispatch(toggleApiUpgradeSubModal());
            viewAnalytics && dispatch(toggleViewAnalytics());
            fullScreen && dispatch(showHideFullScreen());
            !showAoiSideCon && dispatch(toggleAoiSideCon())
        };
        // eslint-disable-next-line
    }, []);

    // useEffect(() => {
    //     let option: {
    //         label: string;
    //         value: string;
    //     }[] = []
    //     let subCategory: {
    //         label: string;
    //         value: string;
    //     }[] = getValues("sub_category");
    //     if (Array.isArray(category) && subCategory && subCategory.length > 0) {
    //         let value = splitValues(category)
    //         menuOption.filter(_item => value.includes(_item.value)).forEach(item => {
    //             option = [...option, ...item.subMenu]
    //         });
    //         setValue('sub_category', subCategory.filter((item) =>
    //             JSON.stringify(option).includes(item.value)
    //         ))
    //     }
    //     // eslint-disable-next-line 
    // }, [category])

    useEffect(() => {
        // if (statekey !== "") getCounty();
        if (statekey && statekey.length > 0) {
            !JSON.stringify(statekey).toLowerCase().includes("texas") &&
                setValue("abstract", "");
            !JSON.stringify(statekey).toLowerCase().includes("texas") &&
                setValue("block", "");
            !JSON.stringify(statekey).toLowerCase().includes("texas") &&
                setValue("legaldesc_survey", []);
            (!JSON.stringify(statekey)
                .toLowerCase()
                .includes("west virginia") ||
                !JSON.stringify(statekey)
                    .toLowerCase()
                    .includes("pennsylvania") ||
                !JSON.stringify(statekey).toLowerCase().includes("Ohio")) &&
                setValue("parcel", "");
            (!JSON.stringify(statekey)
                .toLowerCase()
                .includes("west virginia") ||
                !JSON.stringify(statekey)
                    .toLowerCase()
                    .includes("pennsylvania")) &&
                setValue("quarter_section", "");
        } else {
            setValue("abstract", "");
            setValue("block", "");
            setValue("legaldesc_survey", []);
            setValue("parcel", "")
            setValue("quarter_section", "")
        }
        setValue("county", []);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statekey]);

    useEffect(() => {
        if (wellApiListAfterCsvUpload.length > 0) {
            setValue("well_api", [
                ...(well_api || []),
                ...wellApiListAfterCsvUpload,
            ]);
            dispatch(handleWellApiListAfterCsvUpload([]));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wellApiListAfterCsvUpload]);

    useEffect(() => {
        const {
            // measured_depth,
            // true_vertical_depth,
            // lateral_length,
            minMeasuredDepth,
            minTrueVerticalDepth,
            minLateralLength,
            maxMeasuredDepth,
            maxTrueVerticalDepth,
            maxLateralLength, } = sliderMinMaxValue;

        let formObj = uid.length ? {
            uid: uid.filter((_id) => (!JSON.stringify(data).includes(_id) && `${_id}`))
        } : {
            page: tabIndex === 0 ? wellsPage : tabIndex === 1 ? rigsPage : tabIndex === 2 ? permitsPage : productionPage,
            ...(tabIndex !== 0 && { search_type: tabIndex === 1 ? "rigs" : tabIndex === 2 ? "permit" : "production" }),
            ...(filterSearch && {
                search_param: filterSearch,
            }),
            ...(sort_order && { sort_order }),
            ...(sort_by && { sort_by }),
            ...(formData !== null && {
                ...formData,
                // ...(measured_depth && {
                ...(minMeasuredDepth === 0 && maxMeasuredDepth === 0 ? {} : {
                    depth: {
                        min: minMeasuredDepth,
                        max: maxMeasuredDepth,
                    }
                }),
                // })
                // ,
                // ...(true_vertical_depth && {
                ...(minTrueVerticalDepth === 0 && maxTrueVerticalDepth === 0 ? {} : {
                    vertical_depth: {
                        min: minTrueVerticalDepth,
                        max: maxTrueVerticalDepth,
                    }
                }),
                // }),
                // ...(lateral_length && {
                ...(minLateralLength === 0 && maxLateralLength === 0 ? {} : {
                    lateral_length: {
                        min: minLateralLength,
                        max: maxLateralLength,
                    }
                }),
                // }),
            }),
            ...(geometry && { geometry }),
            ...(epsg && { epsg }),
            ...(filter && { filter }),
            ...(filter_param.length && { filter_param }),
            ...(segment_id && { segment_id }),
            ...(downloadCol && { download: downloadCol }),
            ...(downloadCol && { download_column: allCol ? [...col.map((_item) => "dbKeyName" in _item ? _item.dbKeyName : _item.label), Number(tabIndex) === 1 ? "rig_id" : Number(tabIndex) === 0 ? "uid" : "id"] : [...(sessionStorage.getItem('exportCol') ? JSON.parse(sessionStorage.getItem('exportCol') as string) : col).filter((item: tableColObje) => item.status).map((_item: tableColObje) => "dbKeyName" in _item ? _item.dbKeyName : _item.label), Number(tabIndex) === 1 ? "rig_id" : Number(tabIndex) === 0 ? "uid" : "id"] }),
            // ...(featuresForStatistics.length && ({
            //     uid: featuresForStatistics.slice(0, 1000).filter((_id) => (!JSON.stringify(data).includes(_id)&&`${_id}`))
            // }))
        }
        dispatch(handlePreviousSearchFilter(JSON.stringify(formObj)))

        if (downloadCol) {
            dispatch(downloadFileLogs(access_token, { download_loc: "2", search_param: JSON.stringify(formObj) }));
        }

        if ((wellsDataLoading || downloadCol) && tabIndex === 0) {
            // if (sliderMinMaxValue.dataLoading) {
            //     // the below block of code is to caching the min and max value
            //     const temp = sessionStorage.getItem('maxValue') ? JSON.parse(sessionStorage.getItem('maxValue') as string) : '';
            //     if (typeof temp === "object") {
            //         const { measured_depth, true_vertical_depth, lateral_length } = temp;
            //         dispatch(handleSliderValue({
            //             maxLateralLength: lateral_length,
            //             maxTrueVerticalDepth: true_vertical_depth,
            //             maxMeasuredDepth: measured_depth,
            //             measured_depth: measured_depth,
            //             true_vertical_depth: true_vertical_depth,
            //             lateral_length: lateral_length,
            //             minMeasuredDepth: 0,
            //             minTrueVerticalDepth: 0,
            //             minLateralLength: 0,
            //             dataLoading: false,
            //         }))
            //         dispatch(
            //             getWellsAndPermitList(
            //                 access_token,
            //                 {
            //                     page: wellsPage,
            //                     ...(filterSearch && {
            //                         search_param: filterSearch,
            //                     }),
            //                     ...(sort_order && { sort_order }),
            //                     ...(sort_by && { sort_by }),
            //                     ...(formData !== null && {
            //                         ...formData,
            //                         ...(measured_depth && {
            //                             depth: {
            //                                 min: 0,
            //                                 max: measured_depth,
            //                             }
            //                         }),

            //                         ...(true_vertical_depth && {
            //                             vertical_depth: {
            //                                 min: 0,
            //                                 max: true_vertical_depth,
            //                             }
            //                         }),


            //                         ...(lateral_length && {
            //                             lateral_length: {
            //                                 min: 0,
            //                                 max: lateral_length,
            //                             },
            //                         }),

            //                     }),
            //                     ...(geometry && { geometry }),
            //                     ...(epsg && { epsg }),
            //                     ...(filter && { filter }),
            //                     // ...(filter_param && { filter_param }),
            //                 },
            //                 (wellsPage === 1 || downloadCol) ? true : false
            //             )
            //         );
            //         return
            //     }
            //     dispatch(fetchSliderMaxValue(access_token)).then((res) => {
            //         const {
            //             measured_depth,
            //             true_vertical_depth,
            //             lateral_length,
            //         } = res || {};

            //         sessionStorage.setItem("maxValue", JSON.stringify({ measured_depth, true_vertical_depth, lateral_length }))

            //         dispatch(
            //             getWellsAndPermitList(
            //                 access_token,
            //                 {
            //                     page: wellsPage,
            //                     ...(filterSearch && {
            //                         search_param: filterSearch,
            //                     }),
            //                     ...(sort_order && { sort_order }),
            //                     ...(sort_by && { sort_by }),
            //                     ...(formData !== null && {
            //                         ...formData,
            //                         ...(measured_depth && {
            //                             depth: {
            //                                 min: 0,
            //                                 max: measured_depth,
            //                             },
            //                         }),
            //                         ...(true_vertical_depth && {
            //                             vertical_depth: {
            //                                 min: 0,
            //                                 max: true_vertical_depth,
            //                             },
            //                         }),
            //                         ...(lateral_length && {
            //                             lateral_length: {
            //                                 min: 0,
            //                                 max: lateral_length,
            //                             },
            //                         }),
            //                     }),
            //                     ...(geometry && { geometry }),
            //                     ...(epsg && { epsg }),
            //                     ...(filter && { filter }),
            //                     // ...(filter_param && { filter_param }),
            //                 },
            //                 (wellsPage === 1 || downloadCol) ? true : false
            //             )
            //         );
            //     });
            // } else {
            // const {
            //     measured_depth,
            //     true_vertical_depth,
            //     lateral_length,
            //     minMeasuredDepth,
            //     minTrueVerticalDepth,
            //     minLateralLength,
            //     maxMeasuredDepth,
            //     maxTrueVerticalDepth,
            //     maxLateralLength, } = sliderMinMaxValue;
            dispatch(
                getWellsAndPermitList(
                    access_token,
                    {
                        // ...(!downloadCol && { page: wellsPage }),
                        ...formObj,
                        // ...(filterSearch && {
                        //     search_param: filterSearch,
                        // }),
                        // ...(sort_order && { sort_order }),
                        // ...(sort_by && { sort_by }),
                        // ...(formData !== null && {
                        //     ...formData,
                        //     ...(measured_depth && {
                        //         depth: {
                        //             min: minMeasuredDepth,
                        //             max: maxMeasuredDepth,
                        //         },
                        //     }),
                        //     ...(true_vertical_depth && {
                        //         vertical_depth: {
                        //             min: minTrueVerticalDepth,
                        //             max: maxTrueVerticalDepth,
                        //         },
                        //     }),
                        //     ...(lateral_length && {
                        //         lateral_length: {
                        //             min: minLateralLength,
                        //             max: maxLateralLength,
                        //         },
                        //     }),
                        // }),
                        // ...(geometry && { geometry }),
                        // ...(epsg && { epsg }),
                        // ...(filter && { filter }),
                        // ...(filter_param && { filter_param }),
                        // ...(segment_id && { segment_id }),
                        // ...(downloadCol && { download: downloadCol }),
                        // ...(downloadCol && { download_column: allCol ? [...col.map((_item) => "dbKeyName" in _item ? _item.dbKeyName : _item.label), Number(tabIndex) === 1 ? "rig_id" : "id"] : [...col.filter(item => item.status).map((_item) => "dbKeyName" in _item ? _item.dbKeyName : _item.label), Number(tabIndex) === 1 ? "rig_id" : "id"] }),
                    },
                    (wellsPage === 1 || downloadCol) ? true : false
                )
            );
            !downloadCol && !featuresForStatistics.length && dispatch(
                getWellsAndPermitList(
                    access_token,
                    {
                        ...formObj,
                        search_type: 'well_count_by_county'
                    },
                    false
                )
            );
            // }
            // downloadCol && dispatch(handleDownloadCol({ downloadCol: 0, allCol: 0 }));
            return;
        }
        if ((permitsDataLoading || downloadCol) && tabIndex === 2) {
            // const {
            //     measured_depth,
            //     true_vertical_depth,
            //     lateral_length,
            //     minMeasuredDepth,
            //     minTrueVerticalDepth,
            //     minLateralLength,
            //     maxMeasuredDepth,
            //     maxTrueVerticalDepth,
            //     maxLateralLength, } = sliderMinMaxValue;
            dispatch(
                getWellsAndPermitList(
                    access_token,
                    {
                        // page: permitsPage,
                        // search_type: "permit",
                        ...formObj,
                        // ...(filterSearch && { search_param: filterSearch }),
                        // ...(sort_order && { sort_order }),
                        // ...(sort_by && { sort_by }),
                        // ...(formData !== null && {
                        //     ...formData,
                        //     ...(measured_depth && {
                        //         depth: {
                        //             min: minMeasuredDepth,
                        //             max: maxMeasuredDepth,
                        //         },
                        //     }),
                        //     ...(true_vertical_depth && {
                        //         vertical_depth: {
                        //             min: minTrueVerticalDepth,
                        //             max: maxTrueVerticalDepth,
                        //         },
                        //     }),
                        //     ...(lateral_length && {
                        //         lateral_length: {
                        //             min: minLateralLength,
                        //             max: maxLateralLength,
                        //         },
                        //     }),
                        // }),
                        // ...(geometry && { geometry }),
                        // ...(epsg && { epsg }),
                        // ...(filter && { filter }),
                        // ...(filter_param && { filter_param }),
                        // ...(segment_id && { segment_id }),
                        // ...(downloadCol && { download: downloadCol }),
                        // ...(downloadCol && { download_column: allCol ? [...col.map((_item) => "dbKeyName" in _item ? _item.dbKeyName : _item.label), Number(tabIndex) === 1 ? "rig_id" : "id"] : [...col.filter(item => item.status).map((_item) => "dbKeyName" in _item ? _item.dbKeyName : _item.label), Number(tabIndex) === 1 ? "rig_id" : "id"] }),
                    },
                    (permitsPage === 1 || downloadCol) ? true : false
                )
            );
            !downloadCol && !featuresForStatistics.length && dispatch(
                getWellsAndPermitList(
                    access_token,
                    {
                        ...formObj,
                        search_type: 'well_count_by_county'
                    },
                    false
                )
            );
            // downloadCol && dispatch(handleDownloadCol({ downloadCol: 0, allCol: 0 }));
            return;
        }
        if ((rigsDataLoading || downloadCol) && tabIndex === 1) {
            // const {
            //     measured_depth,
            //     true_vertical_depth,
            //     lateral_length,
            //     minMeasuredDepth,
            //     minTrueVerticalDepth,
            //     minLateralLength,
            //     maxMeasuredDepth,
            //     maxTrueVerticalDepth,
            //     maxLateralLength, } = sliderMinMaxValue;
            dispatch(
                getWellsAndPermitList(
                    access_token,
                    {
                        // page: rigsPage,
                        // search_type: "rigs",
                        ...formObj,
                        // ...(filterSearch && { search_param: filterSearch }),
                        // ...(sort_order && { sort_order }),
                        // ...(sort_by && { sort_by }),
                        // ...(formData !== null && {
                        //     ...formData,
                        //     ...(measured_depth && {
                        //         depth: {
                        //             min: minMeasuredDepth,
                        //             max: maxMeasuredDepth,
                        //         },
                        //     }),
                        //     ...(true_vertical_depth && {
                        //         vertical_depth: {
                        //             min: minTrueVerticalDepth,
                        //             max: maxTrueVerticalDepth,
                        //         },
                        //     }),
                        //     ...(lateral_length && {
                        //         lateral_length: {
                        //             min: minLateralLength,
                        //             max: maxLateralLength,
                        //         },
                        //     }),
                        // }),
                        // ...(geometry && { geometry }),
                        // ...(epsg && { epsg }),
                        // ...(filter && { filter }),
                        // ...(filter_param && { filter_param }),
                        // ...(segment_id && { segment_id }),
                        // ...(downloadCol && { download: downloadCol }),
                        // ...(downloadCol && { download_column: allCol ? [...col.map((_item) => "dbKeyName" in _item ? _item.dbKeyName : _item.label), tabIndex === 1 ? "rig_id" : "id"] : [...col.filter(item => item.status).map((_item) => "dbKeyName" in _item ? _item.dbKeyName : _item.label), tabIndex === 1 ? "rig_id" : "id"] }),
                    },
                    (rigsPage === 1 || downloadCol) ? true : false
                )
            );
            !downloadCol && !featuresForStatistics.length && dispatch(
                getWellsAndPermitList(
                    access_token,
                    {
                        ...formObj,
                        search_type: 'well_count_by_county'
                    },
                    false
                )
            );
            // downloadCol && dispatch(handleDownloadCol({ downloadCol: 0, allCol: 0 }));
            return;
        }
        if ((productionDataLoading || downloadCol) && tabIndex === 3) {
            // const {
            //     measured_depth,
            //     true_vertical_depth,
            //     lateral_length,
            //     minMeasuredDepth,
            //     minTrueVerticalDepth,
            //     minLateralLength,
            //     maxMeasuredDepth,
            //     maxTrueVerticalDepth,
            //     maxLateralLength, } = sliderMinMaxValue;

            dispatch(
                getWellsAndPermitList(
                    access_token,
                    {
                        // page: productionPage,
                        // search_type: "production",
                        ...formObj,
                        // ...(filterSearch && { search_param: filterSearch }),
                        // ...(sort_order && { sort_order }),
                        // ...(sort_by && { sort_by }),
                        // ...(formData !== null && {
                        //     ...formData,
                        //     ...(measured_depth && {
                        //         depth: {
                        //             min: minMeasuredDepth,
                        //             max: maxMeasuredDepth,
                        //         },
                        //     }),
                        //     ...(true_vertical_depth && {
                        //         vertical_depth: {
                        //             min: minTrueVerticalDepth,
                        //             max: maxTrueVerticalDepth,
                        //         },
                        //     }),
                        //     ...(lateral_length && {
                        //         lateral_length: {
                        //             min: minLateralLength,
                        //             max: maxLateralLength,
                        //         },
                        //     }),
                        // }),
                        // ...(geometry && { geometry }),
                        // ...(epsg && { epsg }),
                        // ...(filter && { filter }),
                        // ...(filter_param && { filter_param }),
                        // ...(segment_id && { segment_id }),
                        // ...(downloadCol && { download: downloadCol }),
                        // ...(downloadCol && { download_column: allCol ? [...col.map((_item) => "dbKeyName" in _item ? _item.dbKeyName : _item.label), Number(tabIndex) === 1 ? "rig_id" : "id"] : [...col.filter(item => item.status).map((_item) => "dbKeyName" in _item ? _item.dbKeyName : _item.label), Number(tabIndex) === 1 ? "rig_id" : "id"] }),
                    },
                    (productionPage === 1 || downloadCol) ? true : false
                )
            );
            !downloadCol && !featuresForStatistics.length && dispatch(
                getWellsAndPermitList(
                    access_token,
                    {
                        ...formObj,
                        search_type: 'well_count_by_county'
                    },
                    false
                )
            );
            // downloadCol && dispatch(handleDownloadCol({ downloadCol: 0, allCol: 0 }));
            return;
        }

        // eslint-disable-next-line
    }, [wellsDataLoading, permitsDataLoading, tabIndex, rigsDataLoading, downloadCol, productionDataLoading]);
    const onSubmit = (data: FieldValues) => {
        // const drill_type_temp = drillType.filter((item) => item.active);
        // const production_type_temp = productTypeList.filter(
        //     (item) => item.active
        // );

        let formData = {
            // ...(drill_type_temp?.length > 0 && {
            //     drill_type: drill_type_temp.map((_item) =>
            //         _item.title.toLowerCase()
            //     ),
            // }),
            ...(data.drill_type?.length > 0 && {
                drill_type: [...data.drill_type.map((item: obj) =>
                    item.value
                ), ...(data.drill_type.length === drillTypeOption.length ? ["Select All"] : [])],
            }),
            // ...(production_type_temp?.length > 0 && {
            //     production_type: production_type_temp.map(
            //         (_item) => _item.value
            //     ),
            // }),
            ...(data.production_type?.length > 0 && {
                production_type: data.production_type.map((item: obj) =>
                    item.value
                ),
            }),
            ...(data.name?.length > 0 && {
                well_name: data.name.map((item: obj) => item.value),
            }),
            ...(data.well_status?.length > 0 && {
                well_status: data.well_status.map(
                    (item: obj) => item.value
                ),
            }),
            ...(data.well_type?.length > 0 && {
                well_type: data.well_type.map((item: obj) => item.value),
            }),
            ...(data.well_api?.length > 0 && {
                well_no: data.well_api.map((item: obj) => item.value),
            }),
            ...(data.operator_name?.length > 0 && {
                operator: data.operator_name.map((item: obj) => item.value),
            }),
            ...(data.state_abbr?.length > 0 && {
                state_abbr: data.state_abbr.map((item: obj) => item.value),
            }),
            ...(data.county?.length > 0 && {
                county: data.county.map((item: obj) => item.value),
            }),
            ...(data.basin_name?.length > 0 && {
                basin: data.basin_name.map((item: obj) => item.value),
            }),
            // ...(data.category?.length > 0 && {
            //     category: data.category.map((item: obj) => item.value),
            // }),
            // ...(data.sub_category?.length > 0 && {
            //     sub_category: JSON.stringify(data.sub_category).includes('select_all') ? data.sub_category.filter((_item: obj) => _item.value !== "select_all").map((item: obj) => item.value) : data.sub_category.map((item: obj) => item.value),
            // }),
            ...(data.reservoir?.length > 0 && {
                reservoir: data.reservoir.map((item: obj) => item.value),
            }),
            ...(data.legaldesc_township?.length > 0 && {
                township: data.legaldesc_township.map((item: obj) => item.value),
            }),
            ...(data.legaldesc_range?.length > 0 && {
                range: data.legaldesc_range.map((item: obj) => item.value),
            }),
            ...(data.legaldesc_section?.length > 0 && {
                section: data.legaldesc_section.map((item: obj) => item.value),
            }),
            ...(data.legaldesc_abstract?.length > 0 && {
                abstract: data.legaldesc_abstract.map((item: obj) => item.value),
            }),
            ...(data.legaldesc_block?.length > 0 && {
                block: data.legaldesc_block.map((item: obj) => item.value),
            }),
            ...(data?.legaldesc_survey?.length > 0 && {
                survey: data.legaldesc_survey.map(
                    (item: obj) => item.value
                ),
            }),
            ...(data.depth &&
                (data.depth[0] !== 0 || data.depth[1] !== 0) && {
                depth: {
                    min: data.depth[0],
                    max: data.depth[1],
                },
            }),
            ...(data.vertical_depth &&
                (data.vertical_depth[0] !== 0 ||
                    data.vertical_depth[1] !== 0) && {
                vertical_depth: {
                    min: data.vertical_depth[0],
                    max: data.vertical_depth[1],
                },
            }),
            ...(data?.lateral_length &&
                (data?.lateral_length[0] !== 0 ||
                    data.lateral_length[1] !== 0) && {
                lateral_length: {
                    min: data.lateral_length[0],
                    max: data.lateral_length[1],
                },
            }),
            ...((data.prodEndDate || data.prodStartDate) && {
                production_date: {
                    ...(data.prodStartDate && {
                        start: moment(data.prodStartDate)
                            .format("MMM-DD-YYYY")
                            .split("/")
                            .join("-"),
                    }),
                    ...(data.prodEndDate && {
                        end: moment(data.prodEndDate)
                            .format("MMM-DD-YYYY")
                            .split("/")
                            .join("-"),
                    }),
                },
            }),
            ...((data.permStartDate || data.permEndDate) && {
                permit_date: {
                    ...(data.permStartDate && {
                        start: moment(data.permStartDate)
                            .format("MMM-DD-YYYY")
                            .split("/")
                            .join("-"),
                    }),
                    ...(data.permEndDate && {
                        end: moment(data.permEndDate)
                            .format("MMM-DD-YYYY")
                            .split("/")
                            .join("-"),
                    }),
                },
            }),
            ...((data.spudEndDate || data.spudStartDate) && {
                spud_date: {
                    ...(data.spudStartDate && {
                        start: moment(data.spudStartDate)
                            .format("MMM-DD-YYYY")
                            .split("/")
                            .join("-"),
                    }),
                    ...(data.spudEndDate && {
                        end: moment(data.spudEndDate)
                            .format("MMM-DD-YYYY")
                            .split("/")
                            .join("-"),
                    }),
                },
            }),
            ...((data.compStartDate || data.compEndDate) && {
                completion_date: {
                    ...(data.compStartDate && {
                        start: moment(data.compStartDate)
                            .format("MMM-DD-YYYY")
                            .split("/")
                            .join("-"),
                    }),
                    ...(data.compEndDate && {
                        end: moment(data.compEndDate)
                            .format("MMM-DD-YYYY")
                            .split("/")
                            .join("-"),
                    }),
                },
            }),
        }

        //log user execute filters
        dispatch(
            logUserAction({
                action_type: actionType['execute_filter'],
                action_log_detail: JSON.stringify(formData)
            })
        );

        type obj = { label: string; value: string };
        setState((prev) => ({
            ...prev,
            formData,
        }));
        dispatch(handlePageChange(1));
        dispatch(clearProductionData());
        dispatch(clearWellsData());
        dispatch(clearRigsData());

        // if (tabIndex === 0) {
        //     dispatch(handlePageChange(1));
        //     dispatch(clearWellsData());
        // } else if (tabIndex === 1) {
        //     dispatch(handlePageChange(1));
        //     dispatch(clearRigsData());
        // } else if (tabIndex === 2) {
        //     dispatch(handlePageChange(1));
        //     dispatch(clearPermitData());
        // }
        // else {
        //     dispatch(handlePageChange(1));
        //     dispatch(clearProductionData());
        // }
    };

    const handleOnClick = () => {
        if (notInPlan && !sessionStorage.getItem(DO_NOT_SHOW_UPGRADE_MODAL)) {
            dispatch(getCartDetails(access_token));
            // dispatch(toggleUploadingCsvApiListModal());
            dispatch(toggleApiUpgradeSubModal());
            return;
        }
        // dispatch(toggleUploadingCsvApiListModal());
        setState((prev) => ({
            ...prev,
            fileToOpen: 1,
            openModalAFterUploadModal: true,
        }));
        // Note :- instead of closing site loader here closing it when api list match modal open (CartBasinOpenModalAfterAPiModal in this component)
    };

    const handleConWithoutUpgrade = () => {
        dispatch(toggleApiUpgradeSubModal());
        setState((prev) => ({
            ...prev,
            fileToOpen: 1,
            openModalAFterUploadModal: true,
        }));
    };

    const removeBasinOrCounty = (id: number, item_type: number) => {
        setState((prev) => ({
            ...prev,
            deleteItemId: id,
            deleteCartItemModal: true,
            deleteItemType: item_type,
        }));
    };

    const updateFilterAndUnmatchedDataAfterSub = () => {
        dispatch(
            getApiListAfterCompletingThePayment(access_token, csvApiFileName)
        ).then((res) => {
            const { status, msg, data } = res;
            if (status === 200 && data) {
                const { filter_data } = data;
                setState((prev) => ({
                    ...prev,
                    // csvApiFileData: filter_data,
                    csvApiFileData: filter_data.map(
                        (item, index) => ({
                            ...item,
                            wellMatching:
                                item.status ===
                                    "no match" ||
                                    item.status ===
                                    "not in plan"
                                    ? null
                                    : [
                                        {
                                            label: `API: ${item.api} - ${item.well_name}`,
                                            value: item.api,
                                        },
                                    ],
                            id: index + 1,
                        })
                    ),
                    fileToOpen: 1,
                    openModalAFterUploadModal: true,
                }));
            } else {
                toast.error(msg);
            }
        });
    };

    useEffect(() => {
        if (Array.isArray(api_file)) {
            let tempWellApi = well_api.filter(
                (item) =>
                    !JSON.stringify(apiFileWellApiList).includes(
                        JSON.stringify(item.value)
                    )
            );
            if (api_file.length) {
                dispatch(
                    fetchOptionsList(
                        {
                            search_field: "csv_file_id",
                            id: Number(api_file[0].value),
                        },
                        true
                    )
                ).then((res) => {
                    const { status, data } = res;
                    if (status === 200) {
                        let tempData = extractOption(data, "matched_api_id");
                        setValue("well_api", [...tempWellApi, ...tempData]);
                        setState((prev) => ({
                            ...prev,
                            apiFileWellApiList: tempData.map(
                                (item) => item.value as string
                            ),
                        }));
                    }
                });
            } else {
                setState((prev) => ({ ...prev, apiFileWellApiList: [] }));
                setValue("well_api", [...tempWellApi]);
            }
        }
        // eslint-disable-next-line
    }, [api_file]);

    useEffect(() => {
        if (clearAllFilter) {
            setState((prev) => ({ ...prev, formData: null }))
            reset()

            dispatch(handleClearAllFilter(false))
        }
        // eslint-disable-next-line
    }, [clearAllFilter])

    return (
        <div
            className={`filterCon ${!hideSearchFilter ? "isHide" : ''}`}
            onClick={() => {
                //this is close the menu when use click on filter section
                colProperties && dispatch(showHideColProperties());
                csvDownOpt && dispatch(showHideCsvDownOpt());
                showSegmentDropDown && dispatch(handleShowAndHideSegmentDropDown(false))
            }}
        >
            <div className="filter-header">
                <span>
                    {" "}
                    <img src="images/filter.svg" alt="Filter" /> Filters
                </span>{" "}
                {/* <a href="void:(0)" onClick={(e) => {
                    e.preventDefault()
                    dispatch(handleHideSearchFilter(false));
                }}>
                    <i className="fa-solid fa-xmark"></i>
                </a> */}
            </div>
            <div className="filter-form">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Scrollbars
                        className="filtersidebar-scroll"
                        autoHeightMin={0}
                        renderThumbVertical={(props) => (
                            <div {...props} className="thumb-vertical" />
                        )}
                        renderTrackVertical={(props) => (
                            <div {...props} className="track-vertical" />
                        )}
                    >
                        <div className="filtersidebar">
                            <div className="form-group">
                                <div className="row">
                                    {multiSelectProps.map(
                                        (val, index) =>
                                            index === 11 && (
                                                <div key={index}>
                                                    <label htmlFor="">
                                                        {val.label}
                                                    </label>
                                                    <div className="upload-wrapper">
                                                        <div>
                                                            <CartBasinMultiSelectFields
                                                                index={index}
                                                                async={true}
                                                                isMulti={true}
                                                                name={val.name}
                                                                control={
                                                                    control
                                                                }
                                                                defaultValue={[]}
                                                                itemsRef={
                                                                    itemsRef
                                                                }
                                                                showerror={
                                                                    val.showerror
                                                                }
                                                                placeholderText={
                                                                    val.placeholderText
                                                                }
                                                                fetchOptionHandler={
                                                                    val.fetchOptionHandler
                                                                }
                                                                onChangeHandle={(val, actionMeta) => {
                                                                    if (Array.isArray(val) && val.length > 0) {
                                                                        if (actionMeta.action === "select-option" && actionMeta.option?.value === "select_all") {
                                                                            setValue("well_type", wellTypeOption);
                                                                            return
                                                                        }
                                                                        if (actionMeta.action === "deselect-option" && actionMeta.option?.value !== "select_all") {
                                                                            setValue("well_type", val.filter((item) => item.value !== "select_all"));
                                                                            return
                                                                        }
                                                                        if (actionMeta.action === "deselect-option" && actionMeta.option?.value === "select_all") {
                                                                            setValue("well_type", []);
                                                                            return
                                                                        }

                                                                        if (val.length === wellTypeOption.length - 1) {
                                                                            setValue("well_type", [...val, {
                                                                                label: 'Select All',
                                                                                value: 'select_all'
                                                                            }]);
                                                                            return
                                                                        }


                                                                    } else {
                                                                        setValue('well_type', [])
                                                                    }
                                                                }
                                                                }
                                                                searchPlaceholderText={
                                                                    val.searchPlaceholderText
                                                                }
                                                                cacheUniqs={
                                                                    multiSelectUniqCache[
                                                                        index
                                                                    ]?.uniqCache
                                                                }
                                                                extraField={
                                                                    multiStepOptionExtraField[
                                                                        index
                                                                    ]
                                                                        ?.extrafield
                                                                }
                                                            ></CartBasinMultiSelectFields>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="row">
                                    {multiSelectProps.map(
                                        (val, index) =>
                                            index === 2 && (
                                                <div
                                                    className={`col-md-${val.gridSize}`}
                                                    key={index}
                                                >
                                                    <label htmlFor="">
                                                        {val.label}
                                                    </label>
                                                    <CartBasinMultiSelectFields
                                                        index={index}
                                                        isMulti={true}
                                                        async={true}
                                                        name={val.name}
                                                        control={control}
                                                        defaultValue={[]}
                                                        itemsRef={itemsRef}
                                                        onChangeHandle={(val, actionMeta) => {
                                                            if (Array.isArray(val) && val.length > 0) {
                                                                if (actionMeta.action === "select-option" && actionMeta.option?.value === "select_all") {
                                                                    setValue("well_status", wellStatusOption);
                                                                    return
                                                                }
                                                                if (actionMeta.action === "deselect-option" && actionMeta.option?.value !== "select_all") {
                                                                    setValue("well_status", val.filter((item) => item.value !== "select_all"));
                                                                    return
                                                                }
                                                                if (actionMeta.action === "deselect-option" && actionMeta.option?.value === "select_all") {
                                                                    setValue("well_status", []);
                                                                    return
                                                                }

                                                                if (val.length === wellStatusOption.length - 1) {
                                                                    setValue("well_status", [...val, {
                                                                        label: 'Select All',
                                                                        value: 'select_all'
                                                                    }]);
                                                                    return
                                                                }


                                                            } else {
                                                                setValue('well_status', [])
                                                            }
                                                        }
                                                        }
                                                        showerror={
                                                            val.showerror
                                                        }
                                                        placeholderText={
                                                            val.placeholderText
                                                        }
                                                        fetchOptionHandler={
                                                            val.fetchOptionHandler
                                                        }
                                                        searchPlaceholderText={
                                                            val.searchPlaceholderText
                                                        }
                                                        cacheUniqs={
                                                            multiSelectUniqCache[
                                                                index
                                                            ]?.uniqCache
                                                        }
                                                        extraField={
                                                            multiStepOptionExtraField[
                                                                index
                                                            ]?.extrafield
                                                        }
                                                    />
                                                </div>
                                            )
                                    )}
                                </div>
                            </div>


                            <div className="form-group">
                                <div className="row">
                                    {multiSelectProps.map(
                                        (val, index) =>
                                            index === 15 && (
                                                <div key={index}>
                                                    <label htmlFor="">
                                                        {val.label}
                                                    </label>
                                                    <div className="upload-wrapper">
                                                        <div>
                                                            <CartBasinMultiSelectFields
                                                                index={index}
                                                                isMulti={true}
                                                                async={true}
                                                                name={val.name}
                                                                control={
                                                                    control
                                                                }
                                                                defaultValue={[]}
                                                                onChangeHandle={(val, actionMeta) => {

                                                                    if (Array.isArray(val) && val.length > 0) {
                                                                        if (actionMeta.action === "select-option" && actionMeta.option?.value === "Select All") {
                                                                            setValue("drill_type", drillTypeOption);
                                                                            return
                                                                        }
                                                                        if (actionMeta.action === "deselect-option" && actionMeta.option?.value !== "Select All") {
                                                                            setValue("drill_type", val.filter((item) => item.value !== "Select All"));
                                                                            return
                                                                        }
                                                                        if (actionMeta.action === "deselect-option" && actionMeta.option?.value === "Select All") {
                                                                            setValue("drill_type", []);
                                                                            return
                                                                        }

                                                                        if (val.length === drillTypeOption.length - 1) {
                                                                            setValue("drill_type", [...val, {
                                                                                label: 'Select All',
                                                                                value: 'Select All'
                                                                            }]);
                                                                            return
                                                                        }


                                                                    } else {
                                                                        setValue('drill_type', [])
                                                                    }
                                                                }
                                                                }
                                                                itemsRef={
                                                                    itemsRef
                                                                }
                                                                showerror={
                                                                    val.showerror
                                                                }
                                                                placeholderText={
                                                                    val.placeholderText
                                                                }
                                                                fetchOptionHandler={
                                                                    val.fetchOptionHandler
                                                                }
                                                                searchPlaceholderText={
                                                                    val.searchPlaceholderText
                                                                }
                                                                cacheUniqs={
                                                                    multiSelectUniqCache[
                                                                        index
                                                                    ]?.uniqCache
                                                                }
                                                                extraField={
                                                                    multiStepOptionExtraField[
                                                                        index
                                                                    ]
                                                                        ?.extrafield
                                                                }
                                                            ></CartBasinMultiSelectFields>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="row">
                                    {multiSelectProps.map(
                                        (val, index) =>
                                            index === 16 && (
                                                <div key={index}>
                                                    <label htmlFor="">
                                                        {val.label}
                                                    </label>
                                                    <div className="upload-wrapper">
                                                        <div>
                                                            <CartBasinMultiSelectFields
                                                                index={index}
                                                                async={true}
                                                                isMulti={true}
                                                                name={val.name}
                                                                control={
                                                                    control
                                                                }
                                                                defaultValue={[]}
                                                                onChangeHandle={(val, actionMeta) => {

                                                                    if (Array.isArray(val) && val.length > 0) {
                                                                        if (actionMeta.action === "select-option" && actionMeta.option?.value === "select_all") {
                                                                            setValue("production_type", productType);
                                                                            return
                                                                        }
                                                                        if (actionMeta.action === "deselect-option" && actionMeta.option?.value !== "select_all") {
                                                                            setValue("production_type", val.filter((item) => item.value !== "select_all"));
                                                                            return
                                                                        }
                                                                        if (actionMeta.action === "deselect-option" && actionMeta.option?.value === "select_all") {
                                                                            setValue("production_type", []);
                                                                            return
                                                                        }

                                                                        if (val.length === productType.length - 1) {
                                                                            setValue("production_type", [...val, {
                                                                                label: 'Select All',
                                                                                value: 'select_all'
                                                                            }]);
                                                                            return
                                                                        }


                                                                    } else {
                                                                        setValue('production_type', [])
                                                                    }
                                                                }
                                                                }
                                                                itemsRef={
                                                                    itemsRef
                                                                }
                                                                showerror={
                                                                    val.showerror
                                                                }
                                                                placeholderText={
                                                                    val.placeholderText
                                                                }
                                                                fetchOptionHandler={
                                                                    val.fetchOptionHandler
                                                                }
                                                                searchPlaceholderText={
                                                                    val.searchPlaceholderText
                                                                }
                                                                cacheUniqs={
                                                                    multiSelectUniqCache[
                                                                        index
                                                                    ]?.uniqCache
                                                                }
                                                                extraField={
                                                                    multiStepOptionExtraField[
                                                                        index
                                                                    ]
                                                                        ?.extrafield
                                                                }
                                                            ></CartBasinMultiSelectFields>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                    )}
                                </div>
                            </div>


                            {/* <CartBasinBubble
                                label="Well Orientation"
                                bubbleType={drillType}
                                handleBubbleType={handleDrillType}
                            /> */}
                            {/* <CartBasinBubble
                                label="Production Type"
                                bubbleType={productTypeList}
                                handleBubbleType={handleProductType}
                            /> */}
                            {/* Note :- commenting category and sub category DP-335 */}
                            {/* <div className="form-group">
                                <div className="row">
                                    {multiSelectProps.map(
                                        (val, index) =>
                                            index === 13 && (
                                                <div
                                                    className={`col-md-${val.gridSize}`}
                                                    key={index}
                                                >
                                                    <label htmlFor="">
                                                        {val.label}
                                                    </label>
                                                    <CartBasinMultiSelectFields
                                                        index={index}
                                                        async={true}
                                                        isMulti={true}
                                                        name={val.name}
                                                        control={control}
                                                        defaultValue={[]}
                                                        itemsRef={itemsRef}
                                                        showerror={
                                                            val.showerror
                                                        }
                                                        placeholderText={
                                                            val.placeholderText
                                                        }
                                                        fetchOptionHandler={
                                                            val.fetchOptionHandler
                                                        }
                                                        searchPlaceholderText={
                                                            val.searchPlaceholderText
                                                        }
                                                        cacheUniqs={
                                                            multiSelectUniqCache[
                                                                index
                                                            ]?.uniqCache
                                                        }
                                                        extraField={
                                                            multiStepOptionExtraField[
                                                                index
                                                            ]?.extrafield
                                                        }
                                                    />
                                                </div>
                                            )
                                    )}
                                </div>
                            </div> */}

                            {/* <div

                                // className={
                                //     `${!category || category.length === 0 || (category.length === 1 && JSON.stringify(category).includes('inactive')) ? "d-none" : "form-group"}`
                                // }
                                className="form-group"
                            >
                                <div className="row">
                                    {multiSelectProps.map(
                                        (val, index) =>
                                            index === 14 && (
                                                <div
                                                    className={`col-md-${val.gridSize}`}
                                                    key={index}
                                                >
                                                    <label htmlFor="">
                                                        {val.label}
                                                    </label>
                                                    <CartBasinMultiSelectFields
                                                        index={index}
                                                        isMulti={true}
                                                        name={val.name}
                                                        control={control}
                                                        defaultValue={[]}
                                                        itemsRef={itemsRef}
                                                        onChangeHandle={(val, actionMeta) => {
                                                            let option: {
                                                                label: string;
                                                                value: string;
                                                            }[] = []
                                                            let value = splitValues(category);


                                                            if (Array.isArray(val) && val.length > 0) {
                                                                menuOption.filter(_item => value.includes(_item.value)).forEach(item => {
                                                                    option = [...option, ...item.subMenu]
                                                                });
                                                                if (actionMeta.action === "select-option" && actionMeta.option?.value === "select_all") {
                                                                    setValue("sub_category", [...option, {
                                                                        label: 'Select All',
                                                                        value: 'select_all'
                                                                    }]);
                                                                    return
                                                                }
                                                                if (actionMeta.action === "deselect-option" && actionMeta.option?.value !== "select_all") {
                                                                    setValue("sub_category", val.filter((item) => item.value !== "select_all"));
                                                                    return
                                                                }
                                                                if (actionMeta.action === "deselect-option" && actionMeta.option?.value === "select_all") {
                                                                    setValue("sub_category", []);
                                                                    return
                                                                }

                                                                if (val.map((item) => item.value !== "select_all").length === option.length) {
                                                                    setValue("sub_category", [...val, {
                                                                        label: 'Select All',
                                                                        value: 'select_all'
                                                                    }]);
                                                                    return
                                                                }


                                                            } else {
                                                                setValue('sub_category', [])
                                                            }
                                                        }
                                                        }
                                                        showerror={
                                                            val.showerror
                                                        }
                                                        placeholderText={
                                                            val.placeholderText
                                                        }
                                                        fetchOptionHandler={
                                                            val.fetchOptionHandler
                                                        }
                                                        searchPlaceholderText={
                                                            val.searchPlaceholderText
                                                        }
                                                        cacheUniqs={
                                                            multiSelectUniqCache[
                                                                index
                                                            ]?.uniqCache
                                                        }
                                                        extraField={
                                                            multiStepOptionExtraField[
                                                                index
                                                            ]?.extrafield
                                                        }
                                                    />
                                                </div>
                                            )
                                    )}
                                </div>
                            </div> */}
                            <div className="form-group">
                                <label htmlFor="">Shapefiles</label>
                                <div className="upload-btn-wrapper">
                                    <button
                                        type="button"
                                        className="btn"
                                        onClick={() => {
                                            setState((prev) => ({
                                                ...prev,
                                                shapeFileModal: true,
                                            }));
                                            dispatch(showUploadModal());
                                        }}
                                    >
                                        <img src="images/upload.svg" alt="" />{" "}
                                        Upload Shapefiles
                                    </button>
                                </div>
                                <p className="text">
                                    Upload your shapefile to use as a filter
                                </p>
                            </div>


                            <div className="form-group">
                                <div className="row">
                                    {multiSelectProps.map(
                                        (val, index) =>
                                            index > 0 &&
                                            index < 2 && (
                                                <div
                                                    className={`col-md-${val.gridSize}`}
                                                    key={index}
                                                >
                                                    <label htmlFor="">
                                                        {val.label}
                                                    </label>
                                                    <CartBasinMultiSelectFields
                                                        index={index}
                                                        async={true}
                                                        isMulti={true}
                                                        name={val.name}
                                                        control={control}
                                                        defaultValue={[]}
                                                        itemsRef={itemsRef}
                                                        showerror={
                                                            val.showerror
                                                        }
                                                        placeholderText={
                                                            val.placeholderText
                                                        }
                                                        fetchOptionHandler={
                                                            val.fetchOptionHandler
                                                        }
                                                        searchPlaceholderText={
                                                            val.searchPlaceholderText
                                                        }
                                                        cacheUniqs={
                                                            multiSelectUniqCache[
                                                                index
                                                            ]?.uniqCache
                                                        }
                                                        extraField={
                                                            multiStepOptionExtraField[
                                                                index
                                                            ]?.extrafield
                                                        }
                                                    />
                                                </div>
                                            )
                                    )}
                                </div>
                            </div>

                            {multiSelectProps.map(
                                (val, index) =>
                                    index === 3 && (
                                        <div
                                            className="form-group mb-0"
                                            key={index}
                                        >
                                            <label htmlFor="">API</label>
                                            <div className="upload-wrapper">
                                                <div className="api">
                                                    <CartBasinMultiSelectFields
                                                        index={index}
                                                        async={true}
                                                        name={val.name}
                                                        isMulti={true}
                                                        control={control}
                                                        defaultValue={[]}
                                                        itemsRef={itemsRef}
                                                        showerror={
                                                            val.showerror
                                                        }
                                                        placeholderText={
                                                            val.placeholderText
                                                        }
                                                        fetchOptionHandler={
                                                            val.fetchOptionHandler
                                                        }
                                                        searchPlaceholderText={
                                                            val.searchPlaceholderText
                                                        }
                                                        cacheUniqs={
                                                            multiSelectUniqCache[
                                                                index
                                                            ]?.uniqCache
                                                        }
                                                        extraField={
                                                            multiStepOptionExtraField[
                                                                index
                                                            ]?.extrafield
                                                        }
                                                    ></CartBasinMultiSelectFields>
                                                    <button
                                                        type="button"
                                                        className="btn"
                                                        onClick={() => {
                                                            setState(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    shapeFileModal:
                                                                        false,
                                                                })
                                                            );
                                                            dispatch(
                                                                showUploadModal()
                                                            );
                                                        }}
                                                    >
                                                        <img
                                                            src="images/upload.svg"
                                                            alt=""
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                            )}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    color: "white",
                                }}
                            >
                                or
                            </div>
                            <div className="form-group">
                                <div className="row">
                                    {multiSelectProps.map(
                                        (val, index) =>
                                            index === 10 && (
                                                <div key={index}>
                                                    <label htmlFor=""></label>
                                                    <div className="upload-wrapper">
                                                        <div>
                                                            <CartBasinMultiSelectFields
                                                                index={index}
                                                                async={true}
                                                                isMulti={false}
                                                                name={val.name}
                                                                control={
                                                                    control
                                                                }
                                                                defaultValue={[]}
                                                                itemsRef={
                                                                    itemsRef
                                                                }
                                                                showerror={
                                                                    val.showerror
                                                                }
                                                                placeholderText={
                                                                    val.placeholderText
                                                                }
                                                                fetchOptionHandler={
                                                                    val.fetchOptionHandler
                                                                }
                                                                searchPlaceholderText={
                                                                    val.searchPlaceholderText
                                                                }
                                                                cacheUniqs={
                                                                    multiSelectUniqCache[
                                                                        index
                                                                    ]?.uniqCache
                                                                }
                                                                extraField={
                                                                    multiStepOptionExtraField[
                                                                        index
                                                                    ]
                                                                        ?.extrafield
                                                                }
                                                            ></CartBasinMultiSelectFields>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                    )}
                                </div>
                                <p className="text mt-0">
                                    Separate your APIs with a comma or upload
                                    CSV
                                </p>
                            </div>
                            {multiSelectProps.map(
                                (val, index) =>
                                    index > 3 &&
                                    index < 9 && (
                                        <div className="form-group" key={index}>
                                            <div className="row">
                                                <div
                                                    className={`col-md-${val.gridSize}`}
                                                >
                                                    <label htmlFor="">
                                                        {val.label}
                                                    </label>
                                                    <CartBasinMultiSelectFields
                                                        index={index}
                                                        async={true}
                                                        name={val.name}
                                                        isMulti={true}
                                                        control={control}
                                                        defaultValue={[]}
                                                        itemsRef={itemsRef}
                                                        showerror={
                                                            val.showerror
                                                        }
                                                        placeholderText={
                                                            val.placeholderText
                                                        }
                                                        fetchOptionHandler={
                                                            val.fetchOptionHandler
                                                        }
                                                        searchPlaceholderText={
                                                            val.searchPlaceholderText
                                                        }
                                                        cacheUniqs={
                                                            multiSelectUniqCache[
                                                                index
                                                            ]?.uniqCache
                                                        }
                                                        extraField={
                                                            multiStepOptionExtraField[
                                                                index
                                                            ]?.extrafield
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )
                            )}


                            {multiSelectProps.map(
                                (val, index) =>
                                    index >= 20 &&
                                    index <= 21 && (
                                        <div className="form-group">
                                            <div className="row">
                                                <div
                                                    className={`col-md-${val.gridSize}`}
                                                    key={index}
                                                >
                                                    <label htmlFor="">
                                                        {val.label}
                                                    </label>
                                                    <CartBasinMultiSelectFields
                                                        index={index}
                                                        async={true}
                                                        isMulti={true}
                                                        name={val.name}
                                                        control={control}
                                                        defaultValue={[]}
                                                        itemsRef={itemsRef}
                                                        showerror={
                                                            val.showerror
                                                        }
                                                        placeholderText={
                                                            val.placeholderText
                                                        }
                                                        fetchOptionHandler={
                                                            val.fetchOptionHandler
                                                        }
                                                        searchPlaceholderText={
                                                            val.searchPlaceholderText
                                                        }
                                                        cacheUniqs={
                                                            multiSelectUniqCache[
                                                                index
                                                            ]?.uniqCache
                                                        }
                                                        extraField={
                                                            multiStepOptionExtraField[
                                                                index
                                                            ]?.extrafield
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )
                            )}

                            {multiSelectProps.map(
                                (val, index) =>
                                    index >= 17 &&
                                    index <= 19 && (
                                        <div className="form-group">
                                            <div className="row">
                                                <div
                                                    className={`col-md-${val.gridSize}`}
                                                    key={index}
                                                >
                                                    <label htmlFor="">
                                                        {val.label}
                                                    </label>
                                                    <CartBasinMultiSelectFields
                                                        index={index}
                                                        async={true}
                                                        isMulti={true}
                                                        name={val.name}
                                                        control={control}
                                                        defaultValue={[]}
                                                        itemsRef={itemsRef}
                                                        showerror={
                                                            val.showerror
                                                        }
                                                        placeholderText={
                                                            val.placeholderText
                                                        }
                                                        fetchOptionHandler={
                                                            val.fetchOptionHandler
                                                        }
                                                        searchPlaceholderText={
                                                            val.searchPlaceholderText
                                                        }
                                                        cacheUniqs={
                                                            multiSelectUniqCache[
                                                                index
                                                            ]?.uniqCache
                                                        }
                                                        extraField={
                                                            multiStepOptionExtraField[
                                                                index
                                                            ]?.extrafield
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )
                            )}





                            {/* <div
                                className={`form-group`}
                            // className={`form-group 
                            // ${(
                            //     (Array.isArray(statekey) && statekey) ||
                            //     []
                            // )
                            //     .map((item) => item.label)
                            //     .filter(
                            //         (_item) =>
                            //             _item.toLowerCase() === "texas"
                            //     )?.length > 0
                            //     ? ""
                            //     : "d-none"
                            //     }
                            //     `}
                            >
                                <div className="row">
                                    {inputFieldProps.map(
                                        (val, index) =>
                                            index >= 3 &&
                                            index < 5 && (
                                                <div
                                                    className="col-md-6"
                                                    key={index}
                                                >
                                                    <label htmlFor="">
                                                        {val.label}
                                                    </label>
                                                    <InputField
                                                        name={val.name}
                                                        type={val.type}
                                                        control={control}
                                                        maxLength={
                                                            val.maxLength
                                                        }
                                                        showerror={
                                                            val.showerror
                                                        }
                                                        className={
                                                            val.className
                                                        }
                                                        placeholder={
                                                            val.placeholder
                                                        }
                                                        defaultValue={
                                                            val.defaultValue
                                                        }
                                                    />
                                                </div>
                                            )
                                    )}
                                </div>
                            </div> */}
                            {/* <div className="form-group">
                                <div className="row">
                                    {inputFieldProps.map((val, index) => {
                                        const { hide } = val;

                                        return (
                                            index >= 0 &&
                                            index < 3 && (
                                                <div
                                                    className={`${Array.isArray(
                                                        statekey
                                                    ) &&
                                                        statekey?.length > 0 &&
                                                        statekey
                                                            .map((item) =>
                                                                hide?.includes(
                                                                    item.label.toLowerCase()
                                                                )
                                                            )
                                                            .filter(
                                                                (_item) =>
                                                                    _item ===
                                                                    true
                                                            ).length ===
                                                        statekey.length
                                                        ? "d-none"
                                                        : "col-md-4"
                                                        }`}
                                                    key={index}
                                                >
                                                    <label htmlFor="">
                                                        {val.label}
                                                    </label>
                                                    <InputField
                                                        name={val.name}
                                                        type={val.type}
                                                        control={control}
                                                        maxLength={
                                                            val.maxLength
                                                        }
                                                        showerror={
                                                            val.showerror
                                                        }
                                                        className={
                                                            val.className
                                                        }
                                                        placeholder={
                                                            val.placeholder
                                                        }
                                                        defaultValue={
                                                            val.defaultValue
                                                        }
                                                    />
                                                </div>
                                            )
                                        );
                                    })}
                                </div>
                            </div> */}

                            <div
                                className={`form-group ${(
                                    (Array.isArray(statekey) && statekey) ||
                                    []
                                )
                                    .map((item) => item.label)
                                    .filter(
                                        (_item) =>
                                            _item.toLowerCase() ===
                                            "west virginia" ||
                                            _item.toLowerCase() ===
                                            "ohio" ||
                                            _item.toLowerCase() ===
                                            "pennsylvania"
                                    ).length > 0
                                    ? ""
                                    : "d-none"
                                    }`}
                            >
                                <div className="row">
                                    {inputFieldProps.map(
                                        (val, index) =>
                                            index === 5 && (
                                                <div
                                                    className="col-md-12"
                                                    key={index}
                                                >
                                                    <label htmlFor="">
                                                        {val.label}
                                                    </label>
                                                    <InputField
                                                        name={val.name}
                                                        type={val.type}
                                                        control={control}
                                                        maxLength={
                                                            val.maxLength
                                                        }
                                                        showerror={
                                                            val.showerror
                                                        }
                                                        className={
                                                            val.className
                                                        }
                                                        placeholder={
                                                            val.placeholder
                                                        }
                                                        defaultValue={
                                                            val.defaultValue
                                                        }
                                                    />
                                                </div>
                                            )
                                    )}
                                </div>
                            </div>

                            <div
                                className={`form-group ${(
                                    (Array.isArray(statekey) && statekey) ||
                                    []
                                )
                                    .map((item) => item.label)
                                    .filter(
                                        (_item) =>
                                            _item.toLowerCase() ===
                                            "west virginia" ||
                                            _item.toLowerCase() ===
                                            "pennsylvania"
                                    ).length > 0
                                    ? "d-none"
                                    : ""
                                    }`}
                            >
                                <div className="row">
                                    {multiSelectProps.map(
                                        (val, index) =>
                                            index === 12 && (
                                                <div
                                                    className={`col-md-${val.gridSize}`}
                                                    key={index}
                                                >
                                                    <label htmlFor="">
                                                        {val.label}
                                                    </label>
                                                    <CartBasinMultiSelectFields
                                                        isMulti={true}
                                                        async={true}
                                                        index={index}
                                                        name={val.name}
                                                        control={control}
                                                        defaultValue={[]}
                                                        itemsRef={itemsRef}
                                                        showerror={
                                                            val.showerror
                                                        }
                                                        placeholderText={
                                                            val.placeholderText
                                                        }
                                                        fetchOptionHandler={
                                                            val.fetchOptionHandler
                                                        }
                                                        searchPlaceholderText={
                                                            val.searchPlaceholderText
                                                        }
                                                        cacheUniqs={
                                                            multiSelectUniqCache[
                                                                index
                                                            ]?.uniqCache
                                                        }
                                                        extraField={
                                                            multiStepOptionExtraField[
                                                                index
                                                            ]?.extrafield
                                                        }
                                                    />
                                                </div>
                                            )
                                    )}
                                </div>
                            </div>

                            <div
                                className={`form-group`}
                            // className={`form-group ${(
                            //     (Array.isArray(statekey) && statekey) ||
                            //     []
                            // )
                            //     .map((item) => item.label)
                            //     .filter(
                            //         (_item) =>
                            //             _item.toLowerCase() === "texas"
                            //     ).length > 0
                            //     ? ""
                            //     : "d-none"
                            //     }`}
                            >
                                <div className="row">
                                    {multiSelectProps.map(
                                        (val, index) =>
                                            index === 9 && (
                                                <div
                                                    className={`col-md-${val.gridSize}`}
                                                    key={index}
                                                >
                                                    <label htmlFor="">
                                                        {val.label}
                                                    </label>
                                                    <CartBasinMultiSelectFields
                                                        isMulti={true}
                                                        async={true}
                                                        index={index}
                                                        name={val.name}
                                                        control={control}
                                                        defaultValue={[]}
                                                        itemsRef={itemsRef}
                                                        showerror={
                                                            val.showerror
                                                        }
                                                        placeholderText={
                                                            val.placeholderText
                                                        }
                                                        fetchOptionHandler={
                                                            val.fetchOptionHandler
                                                        }
                                                        searchPlaceholderText={
                                                            val.searchPlaceholderText
                                                        }
                                                        cacheUniqs={
                                                            multiSelectUniqCache[
                                                                index
                                                            ]?.uniqCache
                                                        }
                                                        extraField={
                                                            multiStepOptionExtraField[
                                                                index
                                                            ]?.extrafield
                                                        }
                                                    />
                                                </div>
                                            )
                                    )}
                                </div>
                            </div>

                            {sliderMinMaxValue.measured_depth ? (
                                <SliderMinMax
                                    label="Measured Depth"
                                    name="depth"
                                    control={control}
                                    register={register}
                                    minInputName="minMeasuredDepth"
                                    maxInputName="maxMeasuredDepth"
                                    dataMinKey="minMeasuredDepth"
                                    dataMaxKey="maxMeasuredDepth"
                                    dataMaxValue="measured_depth"
                                    setValue={setValue}
                                    getValues={getValues}
                                />
                            ) : (
                                <></>
                            )}
                            {sliderMinMaxValue.true_vertical_depth ? (
                                <SliderMinMax
                                    label="True Vertical Depth"
                                    name="vertical_depth"
                                    control={control}
                                    register={register}
                                    minInputName="minTrueVerDepth"
                                    maxInputName="maxTrueVerDepth"
                                    dataMinKey="minTrueVerticalDepth"
                                    dataMaxKey="maxTrueVerticalDepth"
                                    dataMaxValue="true_vertical_depth"
                                    setValue={setValue}
                                    getValues={getValues}
                                />
                            ) : (
                                <></>
                            )}

                            {sliderMinMaxValue.lateral_length ? (
                                <SliderMinMax
                                    label="Lateral Length"
                                    name="lateral_length"
                                    control={control}
                                    register={register}
                                    minInputName="minLateralDepth"
                                    maxInputName="maxLateralDepth"
                                    dataMinKey="minLateralLength"
                                    dataMaxKey="maxLateralLength"
                                    dataMaxValue="lateral_length"
                                    setValue={setValue}
                                    getValues={getValues}
                                />
                            ) : (
                                <></>
                            )}
                            <CartBasinDate
                                watch={watch}
                                control={control}
                                getValues={getValues}
                                onChangeEndDate={onChangeEndDate}
                                onChangeStartDate={onChangeStartDate}
                            />
                        </div>
                    </Scrollbars>
                    <div className="button-action">
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => {
                                reset();
                                // resetDrillType();
                                setState(initialStateObj)
                                setDefaultValue()
                                // resetProductType();
                                setValue("minMeasuredDepth", 0);
                                setValue("minTrueVerDepth", 0);
                                setValue("minLateralDepth", 0);
                                setValue(
                                    "maxLateralDepth",
                                    sliderMinMaxValue.lateral_length
                                );
                                setValue(
                                    "maxTrueVerDepth",
                                    sliderMinMaxValue.true_vertical_depth
                                );
                                setValue(
                                    "maxMeasuredDepth",
                                    sliderMinMaxValue.measured_depth
                                );

                            }}
                        >
                            <img src="images/filter-white.svg" alt="" />&nbsp;Reset
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={showTableLoader}
                        >
                            Search
                        </button>
                    </div>
                </form>
            </div>

            {uploadModal && (
                <UploadFileModal
                    accept={shapeFileModal ? ["zip"] : ["csv"]}
                    control={control}
                    name={shapeFileModal ? "shapefiles" : "csvfiles"}
                    openModal={uploadModal}
                    label={
                        shapeFileModal
                            ? "Upload your shapefiles"
                            : "Upload your API list"
                    }
                    handleFileChange={handleFileChange}
                    modalCloseHandler={() => {
                        dispatch(hideUploadModal());
                    }}
                    extraContent={
                        !shapeFileModal ? (
                            <a
                                // className=""
                                href={`${process.env.REACT_APP_ED_DATA_CDN_API}/sample-csv/api_upload_sample.csv`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Sample API csv file
                            </a>
                        ) : (
                            <></>
                        )
                    }
                />
            )}
            <CartBasinModal
                csvApiFileData={csvApiFileData}
                // csvApiUnmatchedFileData={csvApiUnmatchedFileData}
                // csvApiMatchedFileData={csvApiMatchedFileData}
                apiCheckBoxes={(e) =>
                    commonCheckBoxes(
                        e,
                        "selectApiAll",
                        setState,
                        "apiList",
                        "id"
                    )
                }
                handleCloseHandler={handleCloseHandler}
                whichFileToOpen={fileToOpen}
                file={file}
                openModalAFterUploadModal={openModalAFterUploadModal}
                csvApiFileName={csvApiFileName}
            />
            <ExportToCsvModal
                openExportOtherPopup={isExportOther}
                openChooseColumnPopup={isChooseColumn}
                handleCloseHandler={handleCloseHandler}
            />
            {uploadingCsvApiListModal && (
                <UploadingCsvApiListModal
                    fileName={csvApiFileName}
                    fileSize={csvApiFileSize}
                    handleOnClick={handleOnClick}
                    title="Upload your API list"
                    csvApiFileLoading={csvApiFileLoading}
                    handleCloseUploadApiListModal={() => {
                        setState((prev) => ({
                            ...prev,
                            csvApiFileData: [],
                            csvApiUnmatchedFileData: [],
                            csvApiMatchedFileData: [],
                            csvApiFileSize: 0,
                            csvApiFileName: "",
                            csvApiFileLoading: true,
                        }));
                        dispatch(toggleUploadingCsvApiListModal());
                    }}
                />
            )}
            {apiUpgradeSubModal && (
                <ApiUpgradeSubModal
                    handleConWithoutUpgrade={handleConWithoutUpgrade}
                    byBasinTabData={byBasinTabData}
                    byCountyTabData={byCountyTabData}
                />
            )}
            {checkOutModal && (
                <Elements stripe={stripePromise}>
                    <PaymentModal
                        onCancelBtnClick={() => {
                            dispatch(hideCheckOutModal());
                        }}
                        isEdit={
                            cartListItems.filter(
                                (item) => item.subscription_det_id !== null
                            ).length > 0
                                ? true
                                : false
                        }
                        removeBasinOrCounty={removeBasinOrCounty}
                        updateFilterAndUnmatchedDataAfterSub={
                            updateFilterAndUnmatchedDataAfterSub
                        }
                    />
                </Elements>
            )}
            {deleteCartItemModal && (
                <DeleteConfirmationModal
                    show={deleteCartItemModal}
                    handleClose={() => {
                        setState((prev) => ({
                            ...prev,
                            deleteItemId: null,
                            deleteCartItemModal: false,
                            deleteItemType: null,
                        }));
                    }}
                    confirmBtnClick={() => {
                        deleteItemId &&
                            dispatch(
                                removeCartItems(access_token, {
                                    item_id: deleteItemId,
                                    item_type: deleteItemType as number,
                                    sub_total,
                                })
                            ).then((result) => {
                                dispatch(getCartDetails(access_token));
                                setState((prev) => ({
                                    ...prev,
                                    deleteItemId: null,
                                    deleteCartItemModal: false,
                                    deleteItemType: null,
                                }));
                            });
                    }}
                    content={
                        <p>
                            Are you sure you want to remove this item from the
                            cart?
                        </p>
                    }
                />
            )}
        </div>
    );
};

export default CartBasinFilterSection;
