import React from 'react'
import { Button } from "react-bootstrap";
import GlobalModal from "../GlobalModal";
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import { handleFreeTrialDownAlertMsgModal } from '../../store/actions/modal-actions';



const FreeTrialDownAlertMsgModal = (props: {}) => {

    const { modal: { freeTrialDownAlertMsgModal } } = useAppSelector(state => state);
    const dispatch = useAppDispatch();

    const handleClose = () => {
        dispatch(handleFreeTrialDownAlertMsgModal(false));
    }

    const endSubsBtnClick = () => {
        dispatch(handleFreeTrialDownAlertMsgModal(false));
    }

    return (
        <GlobalModal
            show={freeTrialDownAlertMsgModal}
            enableFooter={true}
            center={true}
            onHide={handleClose}
            contentClass={"confirmModal"}
            footerClass={"action-footer"}
            footRender={
                <>
                    <Button variant="primary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={endSubsBtnClick}>
                        End Trial Period
                    </Button>
                </>
            }
        >
            <p>
                Sorry, you can't initiate download during trial period. If you still want to download kindly exit from trial period by clicking the end trial period button.
            </p>

        </GlobalModal >
    );
};

export default FreeTrialDownAlertMsgModal;
