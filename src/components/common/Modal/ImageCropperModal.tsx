import React, { useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
function ImageCropperModal({
    handleClose,
    show,
    src,
    saveCropImage,
}: {
    handleClose?: () => void;
    show?: boolean;
    src?: string;
    saveCropImage: (file: string) => void;
}) {
    const cropperRef = useRef<ReactCropperElement>(null);

    const getCropData = () => {
        if (typeof cropperRef.current?.cropper !== "undefined") {
            saveCropImage(
                cropperRef.current?.cropper.getCroppedCanvas().toDataURL()
            );
        }
    };
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Body>
                <Cropper
                    style={{ height: 400, width: "100%" }}
                    initialAspectRatio={1/1}
                    src={src}
                    ref={cropperRef}
                    viewMode={1}
                    guides={true}
                    minCropBoxHeight={10}
                    minCropBoxWidth={10}
                    background={false}
                    responsive={true}
                    checkOrientation={false}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={getCropData}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ImageCropperModal;
