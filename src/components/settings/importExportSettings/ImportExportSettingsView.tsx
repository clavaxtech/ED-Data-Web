import { useEffect, useState } from "react";
import withSideNav from "../../HOC/withSideNav";
import GlobalTable from "../../common/GlobalTable";
import {
    GlobalTableProps,
    ImportExportSettingsViewProps,
    // importSetting,
} from "../../models/page-props";
// import importCol from "./importCol";
import exportCol from "./exportCol";
import { GlobalPagination } from "../../common/Pagination";
// import { importSettingData } from "./ImportExportConstant";
import Scrollbars from "react-custom-scrollbars";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import { fetchExportsLogs, getSearchResultDownloadLink, resetExportsData } from "../../store/actions/exports-actions";
import { ExportDataObj } from "../../models/redux-models";
import { logUserAction } from "../../store/actions/auth-actions";
import { actionType } from "../../../utils/helper";

const ImportExportSettingsView = (props: ImportExportSettingsViewProps) => {
    let [state, setState] = useState({
        page: 1,
    });
    const { page } = state;

    // let dummyImport: importSetting[] = importSettingData;
    const clickToDownloadExport = (val: ExportDataObj) => {
        const downloadFn = (path: string) => {
            // Download File As Per Need
            const link = document.createElement("a");
            // link.download = "filename" + Date.now() + ".pdf";
            link.target = "_blank";
            link.href = path;
            //log user execute filters
            dispatch(
                logUserAction({
                    action_type: actionType['export_data'],
                    action_log_detail: link.href
                })
            );
            link.click();
        }

        if (val.download_loc === "2") {
            dispatch(getSearchResultDownloadLink(access_token, val.id)).then(res => {
                const { downloads } = res

                downloadFn(downloads.url)
            })
            return
        }
        if (val.file_url) {
            downloadFn(val.file_url)
        }

    };
    const dispatch = useAppDispatch();

    const { auth: { user: { access_token } }, exportsSettings: { exportData, exportPageSize, exportTotalRecord, exportDataLoading } } = useAppSelector(state => state);

    useEffect(() => {
        if (exportDataLoading) {
            dispatch(fetchExportsLogs(access_token, page))
        }
        return () => {
            !exportDataLoading && dispatch(resetExportsData());
        }
        // eslint-disable-next-line
    }, [exportDataLoading])

    return (
        <div className="settingsWrapper billingWrapper">
            <Scrollbars
                className='settingsWrapper-scroll'
                autoHeightMin={0}
                renderThumbVertical={props => < div {...props} className="thumb-vertical" />}
                renderTrackVertical={props => < div {...props} className="track-vertical" />}
            >
                <div className="settingWrapperInner">
                    <ul className="nav nav-pills" id="pills-tab" role="tablist">
                        <li>
                            <a
                                href="void:(0)"
                                id="pills-exports-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-exports"
                                type="button"
                                role="tab"
                                aria-controls="pills-exports"
                                aria-selected="true"
                                className="active"
                            >
                                Exports
                            </a>
                        </li>
                        {/* <li>
                            <a
                                href="void:(0)"
                                id="pills-imports-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-imports"
                                type="button"
                                role="tab"
                                aria-controls="pills-imports"
                                aria-selected="false"
                            >
                                Imports
                            </a>
                        </li> */}
                    </ul>
                    <div className="tab-content" id="pills-tabContent">
                        <div
                            className="tab-pane fade show active"
                            id="pills-exports"
                            role="tabpanel"
                            aria-labelledby="pills-exports-tab"
                        >
                            <div className="item">
                                <h3>Exports</h3>
                                <p>
                                    Explore and download your previously processed
                                    exports, all conveniently organized in one place for
                                    easy access.
                                </p>
                            </div>
                            <div className="item">
                                <div className="billingHistoryTable">
                                    <GlobalTable
                                        tableStyle={{
                                            border: 0,
                                            cellPadding: 0,
                                            cellSpacing: 0,
                                        }}
                                        loadingMsg={"Loading..."}
                                        cols={
                                            exportCol(
                                                clickToDownloadExport
                                            ) as GlobalTableProps["cols"]
                                        }
                                        data={
                                            Array.isArray(exportData) ? exportData : (null as any)
                                        }
                                    />
                                </div>
                            </div>
                            {exportTotalRecord ? <GlobalPagination
                                currentPage={page}
                                totalPages={Math.floor(exportTotalRecord / exportPageSize) +
                                    (exportTotalRecord % exportPageSize > 0 ? 1 : 0)}
                                onPageChange={(page) => {
                                    setState((prev) => ({ ...prev, page: page }))
                                    dispatch(resetExportsData())
                                }
                                }
                            /> : <></>}
                        </div>

                        {/* <div
                            className="tab-pane fade"
                            id="pills-imports"
                            role="tabpanel"
                            aria-labelledby="pills-imports-tab"
                        >
                            <div className="item">
                                <h3>Imports</h3>
                                <p>
                                    Manage your imported data and upload additional
                                    files with just a few clicks.
                                </p>
                            </div>
                            <div className="item">
                                <div className="billingHistoryTable">
                                    <GlobalTable
                                        tableStyle={{
                                            border: 0,
                                            cellPadding: 0,
                                            cellSpacing: 0,
                                        }}
                                        cols={importCol() as GlobalTableProps["cols"]}
                                        data={
                                            Array.isArray(dummyImport) &&
                                                dummyImport.length > 0
                                                ? [...dummyImport]
                                                : []
                                        }
                                    />
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </Scrollbars>
        </div>
    );
};

export default withSideNav(ImportExportSettingsView);
