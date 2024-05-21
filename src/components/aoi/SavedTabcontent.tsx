import React, { useEffect, useRef, useState } from "react";
import SavedAoiCard from "./SavedAoiCard";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import UploadFileModal from "../common/Modal/UploadFileModal";
import { useForm } from "react-hook-form";
import {
    hideSiteLoader,
    hideUploadModal,
    showSiteLoader,
    showUploadModal,
    toggleCreateAoiModal,
    toggleCrsModal,
    toggleImpNoticeModal,
} from "../store/actions/modal-actions";
import {
    DO_NOT_SHOW_SHAPEFILE_INFO_MODAL,
    handleCsvFile,
    handleGeoJsonFile,
    handleShapeFile,
} from "../../utils/helper";
import { clearAoiList, fetchAoiList, removeAoi } from "../store/actions/aoi-actions";
import ImpNoticeModal from "./ImpNoticeModal";
import CreateAoiModal from "./CreateAoiModal";
import CrsModal from "./CrsModal";
import { toast } from "react-toastify";
import { AoiModel } from "../models/redux-models";
import LottieAnimationforTable from "../common/LottieAnimationforTable";
import DeleteConfirmationModal from "../common/Modal/DeleteConfirmationModal";

function SavedTabContent() {
    const {
        aoi: { savedAoiData, aoiDataLoading, max_allowed_aoi, aoi_tab_index },
        modal: { uploadModal, impNoticeModal, createAoiModal, crsModal },
        auth: {
            user: { access_token },
        },
    } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();
    const { control } = useForm();

    const intialRef = useRef(true);

    // Note:-  if warning value is 0 it will show default warning used when click on upload Aoi file. for value 1 is when hit the api and api result in error for csv or geo json file and value 2 for sahpefile when api result in error while uploading Aoi file.

    const [state, setState] = useState<{
        file: Blob | null;
        warning: number;
        file_name: string;
        aoi_name: string;
        searchData: AoiModel["savedAoiData"];
        keyword: string;
        doNotShowPopAgain: boolean,
        aoi_id: number;
        showDeleteAoiModal: boolean
    }>({
        file: null,
        warning: 0,
        file_name: "",
        aoi_name: "",
        searchData: [],
        keyword: "",
        doNotShowPopAgain: false,
        aoi_id: 0,
        showDeleteAoiModal: false
    });
    const { file, warning, file_name, aoi_name, searchData, keyword, doNotShowPopAgain, aoi_id, showDeleteAoiModal } = state;

    const handleState = (value: number, resetFile = false, file_name = "") => {
        setState((prev) => ({
            ...prev,
            warning: value,
            ...(resetFile && { file: null }),
            file_name:
                file_name || file_name === "" ? file_name : prev.file_name,
        }));
    };

    const handleAoiName = (value: string) => {
        setState((prev) => ({ ...prev, aoi_name: value }));
    };

    const handleFileChange = async (acceptedFile: Blob | Blob[]) => {
        dispatch(showSiteLoader());
        if (!Array.isArray(acceptedFile)) {
            const fileType = acceptedFile.name.split(".").pop();
            if (fileType === "zip") {
                handleShapeFile(acceptedFile)
                    .then((res) => {
                        if (res?.status && res.status === 200) {
                            setState((prev) => ({
                                ...prev,
                                file: acceptedFile,
                            }));
                            dispatch(hideUploadModal());
                            dispatch(toggleCreateAoiModal());
                            dispatch(hideSiteLoader());
                        }
                    })
                    .catch((error) => {
                        dispatch(hideSiteLoader());
                    });
            } else if (fileType === "geojson") {
                handleGeoJsonFile(acceptedFile)
                    .then((res) => {
                        const {
                            data: {
                                crs: {
                                    properties: { name },
                                },
                            },
                        } = res;
                        setState((prev) => ({
                            ...prev,
                            file: acceptedFile,
                            ...(name &&
                                !name.includes("CRS84") && { warning: 1 }),
                        }));
                        dispatch(hideUploadModal());
                        name && !name.includes("CRS84")
                            ? dispatch(toggleImpNoticeModal())
                            : dispatch(toggleCreateAoiModal());
                        dispatch(hideSiteLoader());
                    })
                    .catch(() => {
                        dispatch(hideSiteLoader());
                    });
            } else if (fileType === "csv") {
                handleCsvFile(acceptedFile)
                    .then((res) => {
                        const {
                            meta: { fields },
                        } = res.data;
                        if (
                            !(
                                fields?.includes("id") &&
                                (fields.includes("WKT") ||
                                    fields.includes("geometry"))
                            )
                        ) {
                            toast.error(
                                ".csv files must have an `id` column for each feature, and a `WKT` or `geometry` column describing the feature.",
                                { autoClose: 2000 }
                            );
                            dispatch(hideSiteLoader());
                            return;
                        }
                        setState((prev) => ({
                            ...prev,
                            file: acceptedFile,
                            warning: 1,
                        }));
                        dispatch(hideUploadModal());
                        dispatch(toggleImpNoticeModal());
                        dispatch(hideSiteLoader());
                    })
                    .catch(() => {
                        dispatch(hideSiteLoader());
                    });
            }
        }
    };

    const renderWarningContent = () => {
        switch (warning) {
            case 1:
                return (
                    <p>
                        Please upload a <strong>.geojson</strong> or{" "}
                        <strong>.csv</strong> file in either{" "}
                        <strong>NAD83</strong> or <strong>WGS84</strong> datum,{" "}
                        <strong>with coordinates in lat/long degrees</strong>.
                        Files that do not meet these specifications may not
                        display properly.
                    </p>
                );
            case 2:
                return (
                    <p>
                        Your shapefile did not include a .prj file, please
                        re-uploading your file or enter the{" "}
                        <strong>Coordinate Reference System (CRS)</strong>{" "}
                        manually
                    </p>
                );

            default:
                return (
                    <>
                        <p>
                            For optimal display and accuracy, please ensure that
                            any <strong>.geojson</strong> or .csv files uploaded
                            are in either <strong>NAD83</strong> or{" "}
                            <strong>WGS84</strong> datum,{" "}
                            <strong>
                                with coordinates in lat/long degrees
                            </strong>
                            . Files that do not meet these specifications may
                            not display properly.
                        </p>

                        <p>
                            For shapefiles without a <strong>.prj</strong> file,
                            you will be prompted to specify its{" "}
                            <strong>Coordinate Reference System</strong> (CRS).
                        </p>

                        <p>
                            Shapefiles accompanied by a <strong>CRS</strong>{" "}
                            will automatically be converted to{" "}
                            <strong>WGS84</strong> upon upload. This process
                            helps ensure the accuracy and integrity of your
                            mapping experience.
                        </p>
                        <div className="donot">
                            <div className="custom-checkbox">
                                <input
                                    name="rememberMe"
                                    className="form-control checkmark"
                                    type="checkbox"
                                    checked={doNotShowPopAgain}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setState((prev) => ({
                                                ...prev,
                                                doNotShowPopAgain: e.target.checked,
                                            }));
                                            sessionStorage.setItem(
                                                DO_NOT_SHOW_SHAPEFILE_INFO_MODAL,
                                                JSON.stringify(true)
                                            );
                                        } else {
                                            setState((prev) => ({
                                                ...prev,
                                                doNotShowPopAgain: e.target.checked,
                                            }));
                                            sessionStorage.removeItem(
                                                DO_NOT_SHOW_SHAPEFILE_INFO_MODAL
                                            );
                                        }
                                    }}
                                    id="rem"
                                />
                                <label htmlFor="rem" className="custom-label"></label>
                            </div>{" "}
                            {!doNotShowPopAgain ? (
                                <span
                                    className="cursor"
                                    onClick={() =>
                                        setState((prev) => ({
                                            ...prev,
                                            doNotShowPopAgain: true,
                                        }))
                                    }
                                >
                                    Do not show me this popup again.
                                </span>
                            ) : (
                                <span
                                    className="cursor"
                                    onClick={() =>
                                        setState((prev) => ({
                                            ...prev,
                                            doNotShowPopAgain: false,
                                        }))
                                    }
                                >
                                    This popup will not appear again for the current
                                    session.
                                </span>
                            )}
                        </div>
                    </>
                );
        }
    };

    const maxAoiErrorToast = () => {
        toast.info(
            <>
                {/* {`If you require more than ${Number(
                    max_allowed_aoi
                )} AOI, please contact Energy Domain sales at: `}
                <a
                    href={`mailto:sales@energydomain.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    sales@energydomain.com
                </a> */}
                {`Each company is limited to ${Number(
                    max_allowed_aoi
                )} AOI’s per user. If you would like to continue to add more shapes, please alter your existing shapefiles and re-import them as an AOI.`}
            </>
        );
    };

    const handleAoiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        if (value === "") {
            setState((prev) => ({ ...prev, searchData: [], keyword: "" }));
            return;
        }
        setState((prev) => ({
            ...prev,
            searchData: savedAoiData.filter((item) =>
                item.aoi_name.includes(value)
            ),
            keyword: value,
        }));
    };


    useEffect(() => {
        intialRef.current = false;
        // return () => {
        //     dispatch(clearAoiList());
        // };
    }, []);

    return (
        <div
            className={
                aoi_tab_index === 0 ? "tab-pane fade show active" : "d-none"
            }
            id="saved"
            role="tabpanel"
            aria-labelledby="saved-tab"
        >
            {(aoiDataLoading) ? <LottieAnimationforTable /> : <>
                {/* Default screen goes here */}
                <div
                    className={savedAoiData.length === 0 ? "basin-block" : "d-none"}
                >
                    <div className="basin-circle">
                        <img src="images/saved-icon.svg" alt="" />
                    </div>
                    <div className="block-text-title">No AOIs saved</div>
                    <p>
                        Import a shapefile or API list to create an area of interest
                        (AOI) or create an AOI by utilizing our map tools and
                        filters.
                    </p>
                    <a href="void:(0)" className="learn-more">
                        Learn more about AOIs{" "}
                        <i className="fa-solid fa-angle-right"></i>
                    </a>
                    <div className="button-file">
                        {/* <button type="button" className="btn btn-primary">
                            Create an AOI
                        </button> */}
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                                sessionStorage.getItem(DO_NOT_SHOW_SHAPEFILE_INFO_MODAL) ? dispatch(showUploadModal()) : dispatch(toggleImpNoticeModal())
                            }}
                        >
                            Import shapefile
                        </button>
                    </div>
                </div>
                {/* Default screen End */}

                {/* Saved tab goes here */}
                <div
                    className={
                        savedAoiData.length > 0 ? "tabBlockContent" : "d-none"
                    }
                >
                    <div className="search-frm">
                        <div className="api">
                            <input
                                className="form-control"
                                placeholder="Search for AOIs"
                                name="aoi"
                                onChange={handleAoiChange}
                            // value=""
                            />
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                savedAoiData.length < max_allowed_aoi
                                    ? sessionStorage.getItem(DO_NOT_SHOW_SHAPEFILE_INFO_MODAL) ? dispatch(showUploadModal()) : dispatch(toggleImpNoticeModal())
                                    : maxAoiErrorToast();
                            }}
                        >
                            <i className="fa-solid fa-arrow-up"></i> Import file
                        </button>
                    </div>
                    <div className="boxesList">
                        {keyword !== "" && searchData.length === 0 ? (
                            <div className="basin-block">
                                <div className="block-text-title">No AOI Found</div>
                            </div>
                        ) : (
                            (searchData.length > 0 ? searchData : savedAoiData).map(
                                (item, index) => {
                                    return (
                                        <React.Fragment key={index}>
                                            <SavedAoiCard item={item} onDeleteBtnClick={(id: number) => (setState((prev) => ({ ...prev, aoi_id: id, showDeleteAoiModal: true })))} />
                                        </React.Fragment>
                                    );
                                }
                            )
                        )}
                    </div>
                </div>
                {showDeleteAoiModal && (
                    <DeleteConfirmationModal
                        show={showDeleteAoiModal}
                        handleClose={() => {
                            setState((prev) => ({ ...prev, showDeleteAoiModal: false, aoi_id: 0 }))
                        }}
                        confirmBtnClick={() => {
                            dispatch(removeAoi(access_token, aoi_id)).then((res) => {
                                const { status } = res;
                                if (status === 200) {
                                    dispatch(clearAoiList());
                                    setState((prev) => ({ ...prev, showDeleteAoiModal: false, aoi_id: 0 }))
                                }
                            })
                        }}
                        content={
                            <p>
                                Are you sure you want to delete this AOI.?
                            </p>
                        }
                    />
                )}


                {/* Saved tab end here */}
                {
                    uploadModal && (
                        <UploadFileModal
                            accept={["zip", "csv", "geojson"]}
                            control={control}
                            name={"shapeFiles"}
                            openModal={uploadModal}
                            label={"Upload your shapefiles"}
                            handleFileChange={handleFileChange}
                            modalCloseHandler={() => dispatch(hideUploadModal())}
                        />
                    )
                }
                {/* Important Notice modal */}
                {
                    impNoticeModal && (
                        <ImpNoticeModal
                            contentClass={
                                warning === 0
                                    ? "notice-continue-modal"
                                    : "reupload-important-notice-modal"
                            }
                            heading="Important Notice"
                            content={renderWarningContent()}
                            handleClose={() => {
                                dispatch(toggleImpNoticeModal());
                                setState((prev) => ({
                                    ...prev,
                                    file: null,
                                    warning: 0,
                                }));
                            }}
                            footerContent={
                                <>
                                    <button
                                        type="button"
                                        className="btn btn-outline-white"
                                        onClick={() => {
                                            if (warning === 0) {
                                                dispatch(toggleImpNoticeModal());
                                            } else if (warning === 1) {
                                                //continue code goes here
                                                dispatch(showSiteLoader());
                                                dispatch(toggleImpNoticeModal());
                                                setState((prev) => ({
                                                    ...prev,
                                                    warning: 0,
                                                }));
                                                dispatch(toggleCreateAoiModal());
                                                dispatch(hideSiteLoader());
                                            } else {
                                                //EnterManually
                                                dispatch(showSiteLoader());
                                                dispatch(toggleImpNoticeModal());
                                                setState((prev) => ({
                                                    ...prev,
                                                    warning: 0,
                                                }));
                                                dispatch(toggleCrsModal());
                                                dispatch(hideSiteLoader());
                                            }
                                        }}
                                    >
                                        {warning === 0
                                            ? "Cancel"
                                            : warning === 1
                                                ? "Continue"
                                                : "Enter CRS manually"}
                                    </button>
                                    <button
                                        type="button"
                                        className={`btn ${warning === 0
                                            ? "btn-primary green-bg"
                                            : "btn-white"
                                            }`}
                                        onClick={() => {
                                            if (warning === 0) {
                                                dispatch(showSiteLoader());
                                                dispatch(toggleImpNoticeModal());
                                                dispatch(showUploadModal());
                                                dispatch(hideSiteLoader());
                                            } else {
                                                dispatch(showSiteLoader());
                                                dispatch(toggleImpNoticeModal());
                                                dispatch(showUploadModal());
                                                setState((prev) => ({
                                                    ...prev,
                                                    file: null,
                                                    warning: 0,
                                                }));
                                                dispatch(hideSiteLoader());
                                            }
                                        }}
                                    >
                                        {warning === 0 ? "Continue" : "Re-upload file"}
                                    </button>
                                </>
                            }
                        />
                    )
                }
                {/* create aoi modal */}
                {
                    createAoiModal && (
                        <CreateAoiModal
                            file={file as Blob}
                            handleState={handleState}
                            file_name={file_name}
                            handleAoiName={handleAoiName}
                        />
                    )
                }
                {/* crs modal */}
                {
                    crsModal && (
                        <CrsModal
                            handleState={handleState}
                            file_name={file_name}
                            aoi_name={aoi_name}
                        />
                    )
                }
            </>}

        </div >
    );
}

export default SavedTabContent;
