import GlobalModal from "../common/GlobalModal";
import { useAppSelector } from "../hooks/redux-hooks";

const UploadingCsvApiListModal = ({
    fileName,
    fileSize,
    handleOnClick,
    title,
    handleCloseUploadApiListModal,
    csvApiFileLoading,
}: {
    fileName: string;
    fileSize: number;
    handleOnClick: () => void;
    title: string;
    handleCloseUploadApiListModal: () => void;
    csvApiFileLoading: boolean;
}) => {
    const {
        modal: { uploadingCsvApiListModal },
    } = useAppSelector((state) => state);
    return (
        <GlobalModal
            contentClass="upload-file"
            show={uploadingCsvApiListModal}
            center={true}
            title={title}
            onHide={handleCloseUploadApiListModal}
        >
            <div className="upload-block">
                {!csvApiFileLoading ? (
                    <div className="uploading-files">
                        <div className="upload-block">
                            <h2>Uploading files</h2>
                            <div
                                className="filediv cursor"
                                onClick={handleOnClick}
                            >
                                <div className="filename">
                                    <i className="fa-solid fa-file-zipper"></i>
                                    {fileName}
                                </div>
                                <div className="filesize">
                                    {fileSize} MB <span> of 600 MB</span>{" "}
                                    <i className="fa-solid fa-circle-check"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="loader-block">
                        <div className="loaderSpinner"></div>
                    </div>
                )}
            </div>
        </GlobalModal>
    );
};

export default UploadingCsvApiListModal;
