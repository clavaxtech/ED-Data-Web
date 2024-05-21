import React, { useEffect } from "react";
import GlobalModal from "../common/GlobalModal";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import {
    hideSiteLoader,
    showSiteLoader,
    toggleCreateAoiModal,
    toggleImpNoticeModal,
} from "../store/actions/modal-actions";
import InputComponent from "../common/InputComponent";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { aoiModalInputValidation } from "../../Helper/validation";
import { CreateAoiSubmitForm } from "../models/submit-form";
import { clearAoiList, uploadAoiFile, uploadAoiUsingMapFile } from "../store/actions/aoi-actions";
import { toast } from "react-toastify";

function CreateAoiModal({
    file,
    handleState,
    file_name,
    handleAoiName,
}: {
    file?: Blob;
    handleState?: (value: number, resetFile: boolean, fileName: string) => void;
    file_name?: string;
    handleAoiName?: (value: string) => void;
}) {
    const {
        modal: { createAoiModal },
        auth: {
            user: { access_token },
        },
        esri: { lastAddedGeom,
            lastAddedGeomCRS },
        aoi: { usingMapCreateAoi },
    } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<CreateAoiSubmitForm>({
        resolver: yupResolver(aoiModalInputValidation),
    });

    const onSubmit = (data: (CreateAoiSubmitForm)) => {
        const { aoi_name } = data;
        if (usingMapCreateAoi) {
            dispatch(uploadAoiUsingMapFile(access_token, {
                aoi_name: aoi_name,
                buffer_distance: Number(data.bufferDistance),
                crs: Number(lastAddedGeomCRS as string),
                geometry: lastAddedGeom ? (lastAddedGeom as any).coordinates.map((item: any, index: number) => {
                    return {
                        type: "Feature",
                        properties: { id: index + 1 },
                        geometry: {
                            type: (lastAddedGeom as any).type,
                            coordinates: [item],
                        }
                    }
                }) : []
            })).then((res) => {
                if (res.status === 200) {
                    toast.success("Aoi Create successfully.")
                    dispatch(clearAoiList());
                    dispatch(toggleCreateAoiModal());
                }
            })

        } else {
            handleAoiName && handleAoiName(aoi_name);
            dispatch(
                uploadAoiFile(access_token, {
                    file: file as Blob,
                    aoi_name,
                    buffer_distance: data.bufferDistance,
                    file_name: (file_name as string),
                })
            ).then((res) => {
                const { status, msg } = res || {};
                if (status === 200) {
                    dispatch(clearAoiList());
                    dispatch(toggleCreateAoiModal());
                }
                if (status === 422) {
                    const { file_name } = res;
                    const fileType = (file as Blob).name.split(".").pop();
                    if (
                        (msg === "Enter the CRS of the file" ||
                            msg === ".prj file not exists") &&
                        fileType === "zip"
                    ) {
                        dispatch(showSiteLoader());

                        handleState && handleState(2, false, file_name as string);
                        dispatch(toggleImpNoticeModal());
                        dispatch(toggleCreateAoiModal());
                        dispatch(hideSiteLoader());
                    } else {
                        toast.error(msg);
                    }
                }
            });
        }

    };

    useEffect(() => {
        reset();
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <GlobalModal
                contentClass="notice-continue-modal"
                center={true}
                show={createAoiModal}
                onHide={() => dispatch(toggleCreateAoiModal())}
            >
                <form
                    className="form-block"
                    onSubmit={handleSubmit(onSubmit)}
                    autoComplete="off"
                    autoCapitalize="off"
                >
                    <div className="content-block">
                        <div className="contentHeader">
                            <h2 className="text-left">Create AOI</h2>
                            <button type="button" onClick={() => dispatch(toggleCreateAoiModal())} className="btn-close" aria-label="Close"></button>
                        </div>
                        <div className="text-block">
                            <p className="aoilist">
                                Give your AOI a name you'll recognize so you can
                                spot it easily in your AOI list later.
                            </p>
                        </div>
                        <h2 className="text-left mb-4">AOI Name</h2>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <InputComponent
                                        name="aoi_name"
                                        placeholder="Enter AOI name"
                                        register={register}
                                        errorMsg={errors.aoi_name?.message}
                                    />
                                    <p className="maxtext">Max 50 characters</p>
                                </div>
                            </div>
                        </div>
                        <><h2 className="text-left mb-4">Buffer Distance (miles)</h2>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <InputComponent
                                            name="bufferDistance"
                                            type={"number"}
                                            placeholder="Enter miles"
                                            register={register}
                                            errorMsg={"bufferDistance" in errors ? errors.bufferDistance?.message : ''}
                                        />
                                        <p className="maxtext">Add a buffer around your AOI</p>
                                    </div>
                                </div>
                            </div></>
                        <br />
                        <div className="actions">
                            {!usingMapCreateAoi ? <button
                                type="submit"
                                className="btn btn-outline-white"
                                onClick={() => {
                                    const temp = (file as Blob).name
                                        .split(".")
                                        .filter((item) => item !== ".");
                                    setValue(
                                        "aoi_name",
                                        temp
                                            .filter(
                                                (_item, index) =>
                                                    index !== temp.length - 1
                                            )
                                            .join("")
                                    );
                                }}
                            >
                                Use file name
                            </button> : <></>}
                            <button
                                type="submit"
                                className="btn btn-primary green-bg"
                            >
                                Save &amp; Name AOI
                            </button>
                        </div>
                    </div>
                </form>
            </GlobalModal>
        </>
    );
}

export default CreateAoiModal;
