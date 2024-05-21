import React, { ReactNode } from "react";
import { Button } from "react-bootstrap";
import GlobalModal from "../GlobalModal";

function DeleteConfirmationModal({
    show,
    handleClose,
    confirmBtnClick,
    content,
    closeBtn,
}: {
    show: boolean;
    handleClose: () => void;
    confirmBtnClick: () => void;
    content: ReactNode;
    closeBtn?: boolean
}) {
    return (
        <GlobalModal
            show={show}
            enableFooter={true}
            onHide={handleClose}
            contentClass={"confirmModal"}
            footerClass={"action-footer"}
            footRender={
                <>
                    {!closeBtn ? <>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={confirmBtnClick}>
                            Yes
                        </Button>
                    </> : <Button variant="primary" onClick={confirmBtnClick}>
                        Close
                    </Button>
                    }
                </>
            }
        >
            {content}
        </GlobalModal >
    );
}

export default DeleteConfirmationModal;
