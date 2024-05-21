import GlobalModal from "../common/GlobalModal";
import { tableFilterModalProps } from "../models/page-props";

const ExportToCsvModal = (props: tableFilterModalProps) => {
    let { openExportOtherPopup, openChooseColumnPopup, handleCloseHandler } = props
    return (
        <>
            {/* !-- Choose Column Popup --! */}
            <GlobalModal
                contentClass="commonModal exportModal"
                center={true}
                modalSize="lg"
                show={openChooseColumnPopup}
                onHide={() => handleCloseHandler({ isChooseColumn: false })}
            >
                <div className="modalHeader">
                    <h3>Export to CSV </h3>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => handleCloseHandler({ isChooseColumn: false })}><i className="fa-solid fa-xmark"></i></button>
                </div>
                <div className="formBlock">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Find Columns" />
                            </div>
                        </div>
                    </div>
                    <div className="columnExport">
                        <h4>Columns to export:</h4>
                        <ul>
                            <li>API</li>
                            <li>Well Name <span><i className="fa-solid fa-xmark"></i></span></li>
                            <li>Operator <span><i className="fa-solid fa-xmark"></i></span></li>
                            <li>County <span><i className="fa-solid fa-xmark"></i></span></li>
                            <li>State <span><i className="fa-solid fa-xmark"></i></span></li>
                            <li>Depth <span><i className="fa-solid fa-xmark"></i></span></li>
                            <li>Drill Type <span><i className="fa-solid fa-xmark"></i></span></li>
                            <li>Status <span><i className="fa-solid fa-xmark"></i></span></li>
                            <li>Column <span><i className="fa-solid fa-xmark"></i></span></li>
                            <li>Column <span><i className="fa-solid fa-xmark"></i></span></li>
                            <li>Column <span><i className="fa-solid fa-xmark"></i></span></li>
                            <li>Column <span><i className="fa-solid fa-xmark"></i></span></li>
                        </ul>
                    </div>
                    <div className="columnExport">
                        <h4>Columns not being exported:</h4>
                        <ul>
                            <li>API</li>
                            <li>Well Name <span><i className="fa-solid fa-xmark"></i></span></li>
                            <li>Operator <span><i className="fa-solid fa-xmark"></i></span></li>
                        </ul>
                    </div>
                    <div className="action-btn">
                        <button type="button" className="btn btn-outline-gray">Cancel</button>
                        <button type="button" className="btn btn-primary">Export to CSV</button>
                    </div>
                </div>
            </GlobalModal>


            {/* !-- Export Other Popup --! */}
            <GlobalModal
                center={true}
                modalSize="lg"
                show={openExportOtherPopup}
                onHide={() => handleCloseHandler({ isExportOther: false })}
            >
                <h3>What do you want to export?</h3>
                {/* @Praveen sir Please Add Html Here for export other popup*/}

            </GlobalModal>
        </>
    )
};

export default ExportToCsvModal;
