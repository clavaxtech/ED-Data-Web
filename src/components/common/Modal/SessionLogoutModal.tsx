import React from "react";
import { Button, Modal } from "react-bootstrap";
import { PROMPTBEFOREIDLE } from "../../../utils/helper";
function SessionLogoutModal({
    handleClose,
    show,
}: {
    handleClose: () => void;
    show?: boolean;
}) {
    return (
        <Modal className="sessionModal" show={show}>
            <Modal.Body>
                <p>
                Click the Continue button, or you will be logged out for
                inactivity in {Math.floor(PROMPTBEFOREIDLE / 60000)} minutes
                </p>
            </Modal.Body>
            <div className="action-footer">
                <Button variant="primary" onClick={handleClose}>
                    Continue
                </Button>
            </div>
        </Modal>
    );

}




export default SessionLogoutModal;