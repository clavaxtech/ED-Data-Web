import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import { showUpdateCreditCardModal } from "../../store/actions/modal-actions";
import NoDataFound from "../../common/NoDataFound";
import { useNavigate } from "react-router-dom";

function PaymentMethods({
    updateBillingAddress,
}: {
    updateBillingAddress: () => void;
}) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {
        billingSettings: { paymentMethodsData },
    } = useAppSelector((state) => state);
    const {
        company_name,
        billing_email,
        cc_no,
        name_on_card,
        cc_exp_month,
        cc_exp_year,
        first_address,
        second_address,
        city,
        state,
        zip_code,
        country,
    } = paymentMethodsData || {};
    return (
        <div
            className="tab-pane fade"
            id="pills-payment-methods"
            role="tabpanel"
            aria-labelledby="pills-payment-methods-tab"
        >
            <div className="item">
                <h3>Payment Methods</h3>
                <p>
                    Easily manage and update your credit card information,
                    billing email, and billing address.
                </p>
            </div>
            {!cc_no && (
                <NoDataFound
                    ImageSrc="images/no-payment.svg"
                    headingLabel="You Have No Saved Payment Methods"
                    description="You're currently not subscribed to a State or Basin.
                Subscribe to geographical area to get started and unlock
                valuable insights."
                    onBtnClick={() => navigate("/cart-select-basin")}
                    btnLabel="Subscribe Now"
                />
            )}
            <div className={cc_no ? "item" : "d-none"}>
                <div className="paymentBlock">
                    <div className="planBox">
                        <h3 className="mb-4">Monthly Plan</h3>
                        <p className="mb-2">
                            Your monthly plan is charged to this credit card.
                        </p>
                        <div className="card">
                            <h3>{company_name}</h3>
                            <div className="cardNumber">
                                **** **** **** {cc_no}
                            </div>
                            <div className="card-info">
                                <div className="name">
                                    {`${name_on_card} - ${company_name}`}
                                </div>
                                <div className="date">{`${cc_exp_month}/${cc_exp_year}`}</div>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="btn btn-primary"
                            // data-bs-toggle="modal"
                            // data-bs-target="#creditcardModal"
                            onClick={() =>
                                dispatch(showUpdateCreditCardModal())
                            }
                        >
                            Update credit card
                        </button>
                    </div>
                    <div className="billingInfo">
                        <h3>Billing Contact</h3>
                        <p>{billing_email}</p>
                        <div className="address">
                            <h3>{company_name}</h3>
                            <p>
                                {first_address}
                                <br />
                                {second_address}
                                {second_address && <br />}
                                {`${city}, ${state}, ${zip_code}`}
                                <br />
                                {country === "US" ? "United States" : country}
                            </p>
                        </div>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                                updateBillingAddress();
                                dispatch(showUpdateCreditCardModal());
                            }}
                        >
                            Update billing information
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentMethods;
