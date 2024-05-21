import React from "react";
import { cardBottomProps } from "../models/page-props";
import { USDollar } from "../../utils/helper";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { hideCheckOutModal, showCheckOutModal } from "../store/actions/modal-actions";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { clearSubscriptionData, freeTrialSubscription } from "../store/actions/subscription-settings-actions";
import { clearCartItemsList } from "../store/actions/cart-select-basin-county-actions";

function CardBottom(props: cardBottomProps) {
    const { cancelClick, total } = props;
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {
        auth: {
            user: {
                company_data: { company_id },
                company_configs: { free_trial_period_enabled }
            },
        },
        cartSelectBasinCounty: { cartModified },
        cartSelectBasinCounty: {
            cartItemsTotal,
        },
    } = useAppSelector((state) => state);
    return (
        <div className="bottom-part">
            {
                free_trial_period_enabled ? <>
                    <div className="promocode"><Link to="">Add promo code</Link></div>
                    <div className="totalb">
                        <p className="totalaftertrial">Total after trial<span>{USDollar.format(total)}</span></p>
                        <p className="totaldue">Total due today<span>$0.00</span></p>
                    </div>
                    <button type="button" onClick={() => {
                        dispatch(freeTrialSubscription({ amount: cartItemsTotal })).then(res => {
                            const { status, msg } = res
                            if (status === 200) {
                                dispatch(hideCheckOutModal());
                                dispatch(clearCartItemsList());
                                dispatch(clearSubscriptionData())
                                toast.success(msg);
                            } else {
                                toast.error(msg)
                            }
                        })
                    }} className="btn btn-green width100">Start Your Free Trial</button>
                </> : <>
                    <div className="total">
                        Subtotal <span>{USDollar.format(total)}</span>
                    </div>
                    <div className="button">
                        <button
                            type="button"
                            className="btn btn-cancel"
                            onClick={cancelClick}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-green"
                            disabled={!cartModified ? true : false}
                            onClick={() => {
                                if (company_id) {
                                    dispatch(showCheckOutModal());
                                } else {
                                    toast.info("Please add your company details.");
                                    navigate("/company-settings", {
                                        state: { checkout: true },
                                    });
                                }
                            }}
                        >
                            Checkout
                        </button>
                    </div>
                </>
            }
        </div>
    );
}

export default CardBottom;
