import React, { useEffect } from "react";
import GlobalModal from "../GlobalModal";
import InputComponent from "../InputComponent";
import { useForm } from "react-hook-form";


function CreateAoiModal({ show, handleClose }: { show: boolean, handleClose: () => void }) {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
    });
    if (!show) {
        return <></>
    }
    return (
        <>
            <GlobalModal
                contentClass="request-additional-modal"
                center={true}
                show={show}
                onHide={handleClose}
            >
                <form
                    className="form-block"
                    autoComplete="off"
                    autoCapitalize="off"
                >
                    <div className="content-block">
                        <h2 className="heading-block">Request Additional Seats</h2>
                        <div className="text-block">
                            <p className="aoilist">
                                We're excited to help you expand your team's access! Please enter the number of additinal seaths you need below.
                            </p>
                        </div>
                        <div className="row">
                            <div className="col-md-8">
                                <div className="form-group">
                                    <label>Number of Additional Seats</label>
                                    <InputComponent
                                        name="aoi_name"
                                        placeholder="Enter number"
                                        register={register}
                                    />
                                </div>
                            </div>
                        </div>
                        <p className="italicText">After you send your request, our team will contact you to finalize the details.</p>
                        <br />
                        <div className="actions">
                            <button
                                type="submit"
                                className="btn btn-outline"
                                onClick={handleClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary green-bg"
                            >
                                Send Request
                            </button>
                        </div>
                    </div>
                </form>
            </GlobalModal>
        </>
    );
}

export default CreateAoiModal;
