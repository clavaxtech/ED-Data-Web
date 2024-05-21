import React, { useEffect } from "react";
import GlobalModal from "../GlobalModal";
import { useForm } from "react-hook-form";
import { saveSegmentValidation } from "../../../Helper/validation";
import { yupResolver } from "@hookform/resolvers/yup";

function SaveSegmentModal({
    show,
    handleClose,
    handleSaveSubmit,
    segmentName,
}: {
    show: boolean;
    handleClose: () => void;
    handleSaveSubmit: (segmentName: string) => void;
    segmentName: string;
}) {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<{ segmentName: string }>({
        resolver: yupResolver(saveSegmentValidation),
    });

    const onSubmit = (data: { segmentName: string }) => {
        const { segmentName } = data;
        handleSaveSubmit(segmentName);
    };
    useEffect(() => {
        segmentName && setValue("segmentName", segmentName);
        // eslint-disable-next-line
    }, []);

    return (
        <GlobalModal
            show={show}
            center={true}
            onHide={handleClose}
            contentClass={"saveSegmentModal"}
        >
            <div className="saveSegment">
                <h5 className="filter-heading">Segment</h5>
                <p>
                    Save your filters as a segment to quickly access and filter
                    your data
                </p>
                <form
                    className="form-block"
                    onSubmit={handleSubmit(onSubmit)}
                    autoComplete="off"
                    autoCapitalize="off"
                >
                    <div className="save-segment-form">
                        <div className="form-group">
                            <label>Segment Name</label>
                            <input
                                type="text"
                                {...register(`segmentName`)}
                                className="form-control"
                                placeholder="Enter name"
                            />
                            {errors?.segmentName?.message && (
                                <span className={`error`}>
                                    {errors?.segmentName?.message}
                                </span>
                            )}
                        </div>
                        <div className="form-group mb-0">
                            <button
                                type="button"
                                className="btn btn-cancel"
                                onClick={handleClose}
                            >
                                Cancel
                            </button>
                            &nbsp;&nbsp;
                            <button type="submit" className="btn btn-primary">
                                <i className="fa-solid fa-floppy-disk"></i>{" "}
                                &nbsp;{`${segmentName?"Update":"Save"} Segment`}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </GlobalModal>
    );
}

export default SaveSegmentModal;
