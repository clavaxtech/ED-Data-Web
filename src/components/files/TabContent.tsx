import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import { deleteApiOrShapeFile, downloadFileLogs, handleApiList, handleShapeFileList, resetApiList, resetShapeFileList } from '../store/actions/files-actions';
import { ApiFilesListObj, FilesInitialValue, ShapeFilesListObj } from '../models/redux-models';
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from '../common/Spinner';
import moment from 'moment';
import DeleteConfirmationModal from '../common/Modal/DeleteConfirmationModal';
import { toast } from 'react-toastify';
import { logUserAction } from '../store/actions/auth-actions';
import { actionType } from '../../utils/helper';

function TabContent({ data, id, hasMore, fetchData, type, tkn, filesTabIndex }: { data: FilesInitialValue['apiList'] | FilesInitialValue['shapeFileList'], id: string, hasMore: boolean, fetchData: () => void, type: "aoi" | "csv", tkn: string, filesTabIndex: FilesInitialValue['filesTabIndex'] }) {
    const [state, setState] = useState({
        showDeleteModal: false,
        selectedId: 0,
        btnDisabled: true
    })
    const dispatch = useAppDispatch()
    const { auth: { user: { access_token } } } = useAppSelector(state => state)
    const { showDeleteModal, selectedId, btnDisabled } = state
    return (
        <>
            <div className="saveSegments">
                <div className="text-block">
                    <h3>Save Files</h3>
                    <p>
                        View and manage your uploaded files and easily delete
                        any you no longer need.
                    </p>
                </div>
                <div className="tableData filesData">
                    <div className="tableHeader">
                        <div className="tableRow">
                            <div className="tableCell">
                                <div className="custom-checkbox">
                                    <input
                                        name={`selectAll${id}`}
                                        className="form-control checkmark"
                                        type="checkbox"
                                        disabled={data === null || data.length === 0 ? true : false}
                                        id={`selectAll${id}`}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setState((prev) => ({ ...prev, btnDisabled: false }))
                                            } else {
                                                setState((prev) => ({ ...prev, btnDisabled: true }))
                                            }
                                            if (type === "aoi") {
                                                data && dispatch(handleShapeFileList({ data: data.map((item) => ({ ...item, checked: e.target.checked })) as ShapeFilesListObj[], notConcat: true }))
                                            } else {
                                                data && dispatch(handleApiList({ data: data.map((item) => ({ ...item, checked: e.target.checked })) as ApiFilesListObj[], notConcat: true }))
                                            }
                                        }}
                                    />
                                    <label
                                        htmlFor={`selectAll${id}`}
                                        className="custom-label"
                                    ></label>
                                </div>
                                Name
                            </div>
                            <div className="tableCell">File Size</div>
                            <div className="tableCell">Created</div>
                            <div className="tableCell">Action</div>
                        </div>
                    </div>
                    <div className="tableBody segmentsSection-scroll scrollSection"
                        id={id}
                        style={{
                            minHeight: 0,
                            maxHeight: "calc(100vh - 28rem)",
                        }}
                    >
                        <InfiniteScroll
                            dataLength={data === null ? 0 : data.length}
                            next={fetchData}
                            hasMore={hasMore}
                            scrollThreshold={0.8}
                            loader={<Spinner />}
                            style={{ overflow: "hidden" }}
                            scrollableTarget={id}
                        >
                            {
                                data === null ?
                                    <div className="tableRow norecord">Loading...</div> : Array.isArray(data) && data.length === 0 ? <div className="tableRow norecord">No Records</div> : data.map((item, index) => {
                                        let fileType = 'upload_file_name' in item ? item['upload_file_name'].split(".").pop() : item['file_name'].split(".").pop();
                                        let file_name = 'upload_file_name' in item ? item['upload_file_name'] : item['file_name'];
                                        return <div className="tableRow" key={index}>
                                            <div className="tableCell">
                                                <div className="custom-checkbox">
                                                    <input
                                                        name={`select${index}${id}`}
                                                        className="form-control checkmark"
                                                        type="checkbox"
                                                        checked={item.checked}
                                                        id={`select${index}${id}`}
                                                        onChange={(e) => {
                                                            let tempData: (ApiFilesListObj | ShapeFilesListObj)[] = []
                                                            if (data) {
                                                                if (type === "aoi") {
                                                                    tempData = data.map((_item) => _item.id === item.id ? ({ ..._item, checked: e.target.checked }) : _item)
                                                                    dispatch(handleShapeFileList({ data: tempData as ShapeFilesListObj[], notConcat: true }))
                                                                } else {
                                                                    tempData = data.map((_item) => _item.id === item.id ? ({ ..._item, checked: e.target.checked }) : _item)
                                                                    dispatch(handleApiList({ data: tempData as ApiFilesListObj[], notConcat: true }))
                                                                }

                                                                if (!tempData.filter(item => !item.checked).length) {
                                                                    setState((prev => ({ ...prev, btnDisabled: false })));
                                                                    (document.getElementById(`selectAll${id}`) as HTMLInputElement).checked =
                                                                        true;
                                                                } else {
                                                                    setState((prev => ({ ...prev, btnDisabled: true })));
                                                                    (document.getElementById(`selectAll${id}`) as HTMLInputElement).checked =
                                                                        false;
                                                                }
                                                                if (tempData.filter((item) => item.checked).length) {
                                                                    setState((prev => ({ ...prev, btnDisabled: false })));
                                                                }
                                                            }
                                                        }}
                                                    />
                                                    <label
                                                        htmlFor={`select${index}${id}`}
                                                        className="custom-label"
                                                    ></label>
                                                </div>
                                                <img src="images/union.svg" alt="" /> {file_name}
                                            </div>
                                            <div className="tableCell">{item.file_size / Math.pow(10, 3)}KB</div>
                                            <div className="tableCell">{"date_added" in item ? moment(item['date_added']).format('MMM-DD-YYYY') : moment(item['added_on']).format('MMM-DD-YYYY')}</div>
                                            <div className="tableCell">
                                                {/* path is s3+folder_name+file_name */}
                                                <Link to={`${process.env.REACT_APP_ED_DATA_CDN_API}/${filesTabIndex === 0 ? fileType === "zip" ? "shape_file" : fileType === "csv" ? "aoi_csv" : "aoi_geojson" : 'api_csv'}/${file_name}`} target='_blank'
                                                    onClick={((e) => {

                                                       
                                                        dispatch(
                                                            logUserAction({
                                                                action_type: actionType['download_docs'],
                                                                action_log_detail: `${process.env.REACT_APP_ED_DATA_CDN_API}/${filesTabIndex === 0 ? fileType === "zip" ? "shape_file" : fileType === "csv" ? "aoi_csv" : "aoi_geojson" : 'api_csv'}/${file_name}`
                                                            })
                                                        );
                                                         //log download log
                                                        dispatch(downloadFileLogs(access_token, { download_loc: filesTabIndex === 0 ? "1" : "4", file_name: file_name, details: filesTabIndex === 0 && fileType === "zip" ? `AOI_shapefile_download_${file_name}` : filesTabIndex === 0 && filesTabIndex === 0 && fileType === "csv" ? `AOI_csv_download_${file_name}` : fileType === "geojson" ? `AOI_geojson_download_${file_name}` : `API_csv_download_${file_name}` }))
                                                    })}
                                                >
                                                    <img src="./images/down-arrow.svg" alt="" />
                                                </Link>
                                                <Link to="void:(0)" onClick={(e) => {
                                                    e.preventDefault()
                                                    setState((prev) => ({ ...prev, showDeleteModal: true, selectedId: item.id }))
                                                }}>
                                                    <img src="images/trash.svg" alt="" />
                                                </Link>
                                            </div>
                                        </div>
                                    })
                            }
                        </InfiniteScroll>
                    </div>
                </div>
                <div className="action-block padding"><button type="button" disabled={btnDisabled} className={`btn ${btnDisabled ? "btn-disabled" : "btn-primary"}`}
                    onClick={() => {
                        setState((prev) => ({ ...prev, showDeleteModal: true }))
                    }}
                >Delete</button></div>
            </div>
            {showDeleteModal && (
                <DeleteConfirmationModal
                    show={showDeleteModal}
                    handleClose={() => setState((prev) => ({ ...prev, showDeleteModal: false, selectedId: 0 }))
                    }
                    confirmBtnClick={() => {
                        let temp: number[] = []
                        if (data) {
                            temp = [...data].filter((item) => item.checked).map(_item => _item.id)
                        }
                        dispatch(deleteApiOrShapeFile(tkn, {
                            id: selectedId ? [selectedId] : temp,
                            type: type
                        })).then((res) => {
                            const { status, msg } = res;
                            if (status === 200) {
                                toast.success(msg)
                                if (type === "aoi") {
                                    dispatch(resetShapeFileList())
                                } else {
                                    dispatch(resetApiList())
                                }
                                setState((prev) => ({ ...prev, showDeleteModal: false, selectedId: 0 }))
                            } else {
                                toast.error(msg)
                            }
                        })
                    }}
                    content={<p> Do you want to delete the file ?</p>}
                />
            )}
        </>
    )
}

export default TabContent