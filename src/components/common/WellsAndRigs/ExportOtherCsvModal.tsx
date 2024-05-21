import React from "react";
import GlobalModal from "../GlobalModal";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import { toggleExportOtherCsvModal } from "../../store/actions/wells-rigs-action";

function ExportOtherCsvModal() {
    const {
        wellsAndRigs: { exportOtherCsvModal },
    } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();
    return (
        <GlobalModal
            contentClass="commonModal exportModal"
            center={true}
            modalSize="lg"
            show={exportOtherCsvModal}
            onHide={() => dispatch(toggleExportOtherCsvModal())}
            title={<h3>What do you want to export?</h3>}
        >
            <div className="formBlock">
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <div className="label">
                                <div className="custom-radio">
                                    <input className="form-check-input" type="radio" id="other" />
                                    <label className="checkmark" htmlFor="other"></label>
                                    Well list using saved segments:
                                </div>

                            </div>
                            <div className="selectInput">
                                <select name="" id="">
                                    <option value="">Select segment</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="custom-radio">
                        <input className="form-check-input" type="radio" id="other" />
                        <label className="checkmark" htmlFor="other"></label>
                        All well details
                    </div>
                    <div className="line">&nbsp;</div>
                    <div className="custom-radio">
                        <input className="form-check-input" type="radio" id="other" />
                        <label className="checkmark" htmlFor="other"></label>
                        All columns
                    </div>
                    <div className="custom-radio">
                        <input className="form-check-input" type="radio" id="other" />
                        <label className="checkmark" htmlFor="other"></label>
                        Choose columns
                    </div>
                </div>
                <div className="action-btn">
                    <button type="button" className="btn btn-outline-gray">Cancel</button>
                    <button type="button" className="btn btn-primary">Export to CSV</button>
                </div>

            </div>
        </GlobalModal>
    );
}

export default ExportOtherCsvModal;
