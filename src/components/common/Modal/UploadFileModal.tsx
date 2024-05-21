import GlobalModal from "../GlobalModal";
import MediaUploader from "../MediaUploader";
import { cartBasinPopUp } from "../../models/page-props";

const UploadFileModal = (props: cartBasinPopUp) => {
    let {
        name,
        label,
        accept,
        openModal,
        control,
        modalCloseHandler,
        handleFileChange,
        extraContent
    } = props;

    return (
        <GlobalModal
            contentClass="upload-file"
            show={openModal}
            center={true}
            title={label}
            onHide={() => modalCloseHandler()}
        >
            <div className="upload-block">
                <MediaUploader
                    className="drag-drop"
                    accept={accept}
                    handleChange={handleFileChange}
                    name={name}
                    control={control}
                >
                    <div>
                        <img src="images/drag-upload.svg" alt="" />
                        <p>
                            <span>Drag &amp; Drop</span>
                            Drag files or click here to upload
                        </p>
                        <button type="button" className="upload-btn">
                            Upload file
                        </button>
                    </div>
                </MediaUploader>
                {extraContent}
            </div>
        </GlobalModal>
    );
};

export default UploadFileModal;
