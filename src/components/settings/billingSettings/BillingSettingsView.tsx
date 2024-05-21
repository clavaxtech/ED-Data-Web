import withSideNav from "../../HOC/withSideNav";
import { BillingSettingsViewProps } from "../../models/page-props";
import BillingHistory from "./BillingHistory";
import PaymentMethods from "./PaymentMethods";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useLayoutEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import {
    clearPaymentHistoryData,
    clearPaymentMethodsData,
    fetchPaymentHistoryData,
    fetchPaymentMethodsData,
} from "../../store/actions/billing-settings-actions";
import UpdateCreditCardModal from "./UpdateCreditCardModal";
import { hideUpdateCreditCardModal } from "../../store/actions/modal-actions";
import Scrollbars from "react-custom-scrollbars";
const stripePromise = loadStripe(
    `${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`
);
const BillingSettingsView = (props: BillingSettingsViewProps) => {
    const [state, setState] = useState({
        tabIndex: 1,
        updateBillingAddress: false,
        page: 1,
        initialMount: true,
    });
    const { tabIndex, updateBillingAddress, page, initialMount } = state;
    const dispatch = useAppDispatch();
    const {
        auth: {
            user: { access_token },
        },
        billingSettings: {
            paymentMethodsDataLoading,
            paymentHistoryDataLoading,
        },
        modal: { showUpdateCreditCardModal },
    } = useAppSelector((state) => state);

    const onPageChange = (page: number) => {
        setState((prev) => ({ ...prev, page }));
        dispatch(clearPaymentHistoryData(false));
    };

    // Note:- this useLayoutEffect is used to reload the data again if we navigate to other component and come back to billing setting (we can also use useEffect with empty dependency call the below action  in return method of useEffect which is used for unmounting)
    useLayoutEffect(() => {
        !paymentMethodsDataLoading && dispatch(clearPaymentMethodsData());
        !paymentHistoryDataLoading && dispatch(clearPaymentHistoryData(true));
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        if (paymentHistoryDataLoading && access_token && tabIndex === 1) {
            dispatch(
                fetchPaymentHistoryData(access_token, {
                    page: page,
                    ...(initialMount && { recent: 1 }),
                })
            );
        }

        if (paymentMethodsDataLoading && access_token && tabIndex === 2) {
            dispatch(fetchPaymentMethodsData(access_token));
        }
        initialMount && setState((prev) => ({ ...prev, initialMount: false }));
        // eslint-disable-next-line
    }, [
        paymentMethodsDataLoading,
        paymentHistoryDataLoading,
        access_token,
        tabIndex,
    ]);
    return (
        <div className="settingsWrapper billingWrapper">
            <Scrollbars
                className='settingsWrapper-scroll'
                autoHeightMin={0}
                renderThumbVertical={props => < div {...props} className="thumb-vertical" />}
                renderTrackVertical={props => < div {...props} className="track-vertical" />}
            >
                <div className="settingWrapperInner">
                    <ul className="nav nav-pills" id="pills-tab" role="tablist">
                        <li>
                            <a
                                href="void:(0)"
                                id="pills-billing-history-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-billing-history"
                                type="button"
                                role="tab"
                                aria-controls="pills-home"
                                aria-selected="true"
                                className="active"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setState((prev) => ({ ...prev, tabIndex: 1 }));
                                }}
                            >
                                Billing History
                            </a>
                        </li>
                        <li>
                            <a
                                href="void:(0)"
                                id="pills-payment-methods-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-payment-methods"
                                type="button"
                                role="tab"
                                aria-controls="pills-profile"
                                aria-selected="false"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setState((prev) => ({ ...prev, tabIndex: 2 }));
                                }}
                            >
                                Payment Methods
                            </a>
                        </li>
                    </ul>
                    <div className="tab-content" id="pills-tabContent">
                        <BillingHistory page={page} onPageChange={onPageChange} />
                        <PaymentMethods
                            updateBillingAddress={() => {
                                setState((prev) => ({
                                    ...prev,
                                    updateBillingAddress: true,
                                }));
                            }}
                        />
                    </div>
                    {showUpdateCreditCardModal && (
                        <Elements stripe={stripePromise}>
                            <UpdateCreditCardModal
                                show={showUpdateCreditCardModal}
                                handleClose={() => {
                                    dispatch(hideUpdateCreditCardModal());
                                    setState((prev) => ({
                                        ...prev,
                                        updateBillingAddress: false,
                                    }));
                                }}
                                updateBillingAddress={updateBillingAddress}
                            />
                        </Elements>
                    )}
                </div>
            </Scrollbars>
        </div>
    );
};

export default withSideNav(BillingSettingsView);
