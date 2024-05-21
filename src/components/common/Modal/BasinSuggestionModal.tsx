import React from 'react'
import { Button } from "react-bootstrap";
import GlobalModal from "../GlobalModal";


const BasinSuggestionModal = (props: { show: boolean, handleClose: () => void, handleProceedToBtnClick: () => void, priceNearToBasin: boolean }) => {
    const { handleClose, handleProceedToBtnClick, show, priceNearToBasin } = props;

    return (
        <GlobalModal
            show={show}
            enableFooter={true}
            center={true}
            // modalSize={"lg"}
            onHide={handleClose}
            contentClass={"subscribeModal"}
            footerClass={"action-footer"}
            footRender={
                <>
                    <Button variant="btn btn-outline-white" onClick={handleClose}>
                        {priceNearToBasin ? "No, Thanks" : "Edit Subscription"}
                    </Button>
                    <Button variant="btn btn-green" onClick={handleProceedToBtnClick}>
                        {priceNearToBasin ? "Yes, Upgrade Me" : "Proceed to Checkout"}
                    </Button>
                </>
            }
        >
            <div className="seggestionModalContent">
                {/* <figure className='subsImage'><img src="images/subs-img.svg" alt="" /></figure> */}
                {/* <h3 className='text-center'>Maximize Your Insights with a Basin Subscription!</h3> */}
                {
                    !priceNearToBasin ?
                        <>
                            <h3>Maximize Your Insights with a Basin Subscription!</h3>
                            <p>You've selected multiple counties that add up to the cost of a Basin subscription. We've automatically upgraded you to Basin-level access to ensure you get the most value and data for your investment.</p>
                            <br />
                            <p>Enjoy the expanded insights and savings!</p>
                            <ul>
                                <li><strong>Full Basin Access:</strong> Explore comprehensive data across multiple counties.</li>
                                <li><strong>Greater Savings:</strong> Get more data for the same price.</li>
                                <li><strong>Hassle-Free:</strong> No extra steps needed – we've taken care of the upgrade for you.</li>
                            </ul>
                        </> :
                        <>
                            <h3>Unlock More Data - Upgrade to Basin Subscription!</h3>
                            <p>You're on the verge of unlocking even greater value! The counties you've selected are priced just below our Basin subscription rate.</p>
                            <br />
                            <p>Take advantage of this opportunity to:</p>
                            <ul>
                                <li><strong>Access More Data:</strong> Get insights from the entire Basin instead of just selected counties.</li>
                                <li><strong>pend:</strong> Enjoy more extensive data coverage for a marginally higher investment.</li>
                                <li><strong>Expand Your Analysis:</strong>Utilize a broader dataset to inform your decision-making.</li>
                            </ul>
                        </>
                }
            </div>
        </GlobalModal >
    );
};

export default BasinSuggestionModal;
