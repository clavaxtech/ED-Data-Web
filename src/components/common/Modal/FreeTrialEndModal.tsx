import React from 'react'
import GlobalModal from '../GlobalModal'
import { Button } from 'react-bootstrap'
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks'
import { handleFreeTrialEndModal, showCheckOutModal } from '../../store/actions/modal-actions';
import { useNavigate } from 'react-router-dom';

function FreeTrialEndModal() {
    const { modal: { freeTrialEndModal }, auth: { user: { company_configs: { no_of_free_days_allowed } } }, cartSelectBasinCounty: { cartListItems } } = useAppSelector(state => state);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleClose = () => {
        dispatch(handleFreeTrialEndModal(false));
        navigate("/cart-select-basin");

    }

    const handleSubscribeNowBtnClick = () => {
        dispatch(handleFreeTrialEndModal(false));
        dispatch(showCheckOutModal());
    }

    if (!freeTrialEndModal) {
        return <></>
    }



    return (
        <GlobalModal
            show={freeTrialEndModal}
            enableFooter={true}
            center={true}
            // onHide={handleClose}
            contentClass={"subscribeModal"}
            footerClass={"action-footer"}
            footRender={
                <>

                    <Button variant="btn btn-outline-white" onClick={handleClose}>
                        Edit Subscription
                    </Button>
                    <Button disabled={cartListItems.length ? false : true} variant="btn btn-green" onClick={handleSubscribeNowBtnClick}>
                        Proceed to Checkout
                    </Button>
                </>
            }
        >
            <div className="seggestionModalContent">
                <figure className='subsImage'><img src="images/subs-img.svg" alt="" /></figure>
                <h3 className='text-center'>Your {no_of_free_days_allowed}-days trial has ended</h3>

                <p>Your free trial has expired, but your journey toward data-driven decisions is just beginning.</p>
                <br />
                <p>Stay Ahead with Full Access:</p>
                <ul>
                    <li><strong>Advanced Analytics:</strong> Delve deeper into well, production, and operator data.</li>
                    <li><strong>Custom Alerts:</strong>Stay informed with personalized notifications.</li>
                    <li><strong>Save & Export:</strong>Seamlessly manage your data for external analysis.</li>
                </ul>

            </div>
        </GlobalModal>
    )
}

export default FreeTrialEndModal