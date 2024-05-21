import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import { CSVLink } from "react-csv";
import {
    handleDownloadCol,
    toggleChooseColExportToCsvModal,
    // toggleExportOtherCsvModal,
} from "../../store/actions/wells-rigs-action";
import ChooseColExportToCsvModal from "./ChooseColExportToCsvModal";
import ExportOtherCsvModal from "./ExportOtherCsvModal";
import { ProductionDataObj, RigsDataObj, WellsAndPermitsObject } from "../../models/redux-models";
import { toast } from "react-toastify";
import FreeTrialDownAlertMsgModal from "../Modal/FreeTrialDownAlertMsgModal";
import { handleFreeTrialDownAlertMsgModal } from "../../store/actions/modal-actions";
import moment from "moment";
import { actionType } from "../../../utils/helper";
// import { logUserAction } from "../../store/actions/auth-actions";

function ExportToCsvOpt({ selectedRowData }: { selectedRowData: WellsAndPermitsObject[] | RigsDataObj[] | ProductionDataObj[] }) {
    const {
        wellsAndRigs: {
            csvDownOpt,
            tableCol,
            chooseColExportToCsvModal,
            exportOtherCsvModal,
            wellsData: { data: wellsDataList, total_count: wellsTotalCount, page_size: wellPageSize },
            rigsData: { data: rigsDataList, total_count: rigsTotalCount, page_size: rigsPageSize },
            permitsData: { data: permitDataList, total_count: permitTotalCount, page_size: permitPageSize },
            productionData: { data: productionDataList, total_count: productionTotalCount, page_size: productionPageSize },
            tabIndex,
            rigsTableCol,
            productionCol,
            analyticsData: { apiList },

        },
        aoi: { previousSearchFilter },
        modal: { freeTrialDownAlertMsgModal },
        auth: { user: { company_configs: { download_enabled, free_trial_period_enabled } } }
    } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();
    // const [tempData, setTempData] = useState<WellsAndPermitsObject[] | RigsDataObj[]>([])
    // useEffect(() => {
    //     setTempData(selectedRowData)
    // }, [selectedRowData])
    let col = tabIndex === 0 || tabIndex === 2 ? tableCol : tabIndex === 1 ? rigsTableCol : productionCol;
    let data =
        tabIndex === 0
            ? (wellsDataList || []).map((item, index) => ({
                ...item,
                // id: index + 1,
            }))
            : tabIndex === 1
                ? (rigsDataList || []).map((item, index) => ({
                    ...item,
                    // id: index + 1,
                }))
                : tabIndex === 2
                    ? (permitDataList || []).map((item, index) => ({
                        ...item,
                        // id: index + 1,
                    })) : (productionDataList || []).map((item, index) => ({
                        ...item,
                        // id: index + 1,
                    }));
    let pageSize = tabIndex === 0 ? wellPageSize : tabIndex === 2 ? permitPageSize : tabIndex === 1 ? rigsPageSize : productionPageSize;
    let count = tabIndex === 0 ? wellsTotalCount : tabIndex === 1 ? rigsTotalCount : tabIndex === 2 ? permitTotalCount : productionTotalCount
    // const [pageSize, setPageSize] = useState(1000)
    // useEffect(() => {
    //     setPageSize(pageSize)
    // }, [wellPageSize, rigsPageSize, permitPageSize])

    return (
        <div className={csvDownOpt ? "dropdownMenu open" : "d-none"}>
            <h2>Export to CSV</h2>
            <ol>
                <li>
                    <CSVLink
                        // className=""
                        data={data}
                        headers={[
                            { label: "ID", key: "id" },
                            ...col.map((_item) => ({
                                label: _item.header.toUpperCase(),
                                key: _item.label,
                            })),
                        ]}
                        filename={`ED_Data_Export_${moment(new Date()).format(
                            "MMM-DD-YYYY, h:mm:ss a"
                        )}`}
                        asyncOnClick={(Number(count) > pageSize || (!download_enabled && free_trial_period_enabled)) ? true : false}
                        onClick={(event, done) => {
                            if (!download_enabled && free_trial_period_enabled) {
                                dispatch(handleFreeTrialDownAlertMsgModal(true));
                                done(false);
                                return
                            }
                            // if (Number(count) < pageSize) {
                            //     //log download docs
                            //     dispatch(
                            //         logUserAction({
                            //             action_type: actionType['download_docs'],
                            //             // action_log_detail: "Table Data, when data is less than the download limit."
                            //             action_log_detail: previousSearchFilter
                            //         })
                            //     );
                            // }
                            Number(count) > pageSize && dispatch(handleDownloadCol({ downloadCol: 1, allCol: 1 }))
                            Number(count) > pageSize && done(false)
                        }}
                    >
                        {" "}
                        All Columns
                    </CSVLink>
                </li>
                <li>
                    <CSVLink
                        // className=""
                        data={data}
                        headers={[
                            { label: "ID", key: "id" },
                            ...col
                                .filter((item) => item.status)
                                .map((_item) => ({
                                    label: _item.header.toUpperCase(),
                                    key: _item.label,
                                })),
                        ]}
                        filename={`ED_Data_Export_${moment(new Date()).format(
                            "MMM-DD-YYYY, h:mm:ss a"
                        )}`}
                        asyncOnClick={Number(count) > pageSize || (!download_enabled && free_trial_period_enabled) ? true : false}
                        onClick={(event, done) => {
                            if (!download_enabled && free_trial_period_enabled) {
                                dispatch(handleFreeTrialDownAlertMsgModal(true));
                                done(false);
                                return
                            }
                            // if (Number(count) < pageSize) {
                            //     //log download docs
                            //     dispatch(
                            //         logUserAction({
                            //             action_type: actionType['download_docs'],
                            //             // action_log_detail: "Table Data, when data is less than the download limit."
                            //             action_log_detail: previousSearchFilter
                            //         })
                            //     );
                            // }
                            Number(count) > pageSize && dispatch(handleDownloadCol({ downloadCol: 1, allCol: 0 }))
                            Number(count) > pageSize && done(false)

                        }}
                    >
                        Displayed Columns
                    </CSVLink>
                </li>
                <li>
                    <a
                        href="void:(0)"
                        onClick={(e) => {
                            e.preventDefault();
                            !chooseColExportToCsvModal &&
                                dispatch(toggleChooseColExportToCsvModal());
                        }}
                    >
                        Choose Columns{" "}
                        <i className="fa-solid fa-angle-right"></i>
                    </a>
                </li>
                <li>
                    <CSVLink
                        // className=""
                        // data={tempData}
                        data={selectedRowData}
                        headers={[
                            { label: "ID", key: "id" },
                            ...col
                                .filter((item) => item.status)
                                .map((_item) => ({
                                    label: _item.header.toUpperCase(),
                                    key: _item.label,
                                })),
                        ]}
                        filename={`ED_Data_Export_${moment(new Date()).format(
                            "MMM-DD-YYYY, h:mm:ss a"
                        )}`}
                        // asyncOnClick={(tempData).length == 0 ? true : false}
                        asyncOnClick={selectedRowData.length === 0 || (!download_enabled && free_trial_period_enabled) ? true : false}
                        onClick={(event, done) => {
                            if (!download_enabled && free_trial_period_enabled) {
                                dispatch(handleFreeTrialDownAlertMsgModal(true));
                                done(false);
                                return
                            }
                            // tempData.length == 0 && toast.error("Please select at least one row for downloading.");
                            selectedRowData.length === 0 && toast.error("Please select at least one row for downloading.");
                            // selectedRowData.length && dispatch(
                            //     logUserAction({
                            //         action_type: actionType['download_docs'],
                            //         action_log_detail: `api_id: ${apiList.join(",")}`
                            //     })
                            // );
                            // if (tempData.length) {
                            //     let temp_data = (
                            //         data as
                            //         | WellsAndPermitsObject[]
                            //         | RigsDataObj[]
                            //     ).map((item) => ({
                            //         ...item,
                            //         checked: false,
                            //     }));
                            //     if (tabIndex === 0) {
                            //         dispatch(
                            //             loadWellsData({
                            //                 data: temp_data as WellsAndPermitsObject[],
                            //                 total_count: wellsTotalCount,
                            //                 page_size: wellPageSize,
                            //                 total_rigs: rigsTotalCount,
                            //                 total_permit: permitTotalCount,
                            //                 notConCatData: true,
                            //             })
                            //         );
                            //         return;
                            //     }

                            //     if (tabIndex === 1) {
                            //         dispatch(
                            //             loadRigsData({
                            //                 data: temp_data as RigsDataObj[],
                            //                 total_count: rigsTotalCount,
                            //                 page_size: rigsPageSize,
                            //                 total_well: wellsTotalCount,
                            //                 total_permit: permitTotalCount,
                            //                 notConCatData: true,
                            //             })
                            //         );
                            //         return;
                            //     }
                            //     if (tabIndex === 2) {
                            //         dispatch(
                            //             loadPermitsData({
                            //                 data: temp_data as WellsAndPermitsObject[],
                            //                 total_count: permitTotalCount,
                            //                 page_size: permitPageSize,
                            //                 total_well: wellsTotalCount,
                            //                 total_rigs: rigsTotalCount,
                            //                 notConCatData: true,
                            //             })
                            //         );
                            //         return;
                            //     }
                            // }
                            selectedRowData.length === 0 && done(false);

                        }}
                    >
                        Selected Rows {selectedRowData.length ? <span className="badge">{selectedRowData.length}</span> : <></>}
                    </CSVLink>
                    {/* <a
                        href="void:(0)"
                        onClick={(e) => {
                            e.preventDefault()
                            if (selectedRowData.length) {

                            } else {
                                toast.error("Please select at least one row for downloading.")
                            }
                        }}
                    >
                        Selected Columns {selectedRowData.length ? <span className="badge">{selectedRowData.length}</span> : <></>}
                    </a> */}
                </li>
                {/* <li>
                    <a
                        href="void:(0)"
                        onClick={(e) => {
                            e.preventDefault();
                            !exportOtherCsvModal &&
                                dispatch(toggleExportOtherCsvModal());
                        }}
                    >
                        Export Other <i className="fa-solid fa-angle-right"></i>
                    </a>
                </li> */}
            </ol>
            {chooseColExportToCsvModal && <ChooseColExportToCsvModal />}
            {exportOtherCsvModal && <ExportOtherCsvModal />}
            {freeTrialDownAlertMsgModal && <FreeTrialDownAlertMsgModal />}
        </div >
    );
}

export default ExportToCsvOpt;
