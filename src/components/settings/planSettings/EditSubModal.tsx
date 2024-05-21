import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import { toggleEditSubscriptionModal } from "../../store/actions/modal-actions";
import GlobalModal from "../../common/GlobalModal";
import Scrollbars from "react-custom-scrollbars";
import { USDollar, actionType } from "../../../utils/helper";
import DeleteConfirmationModal from "../../common/Modal/DeleteConfirmationModal";
import { subscriptionDataDetails } from "../../models/redux-models";
import moment from "moment";
import { updateSubscription } from "../../store/actions/subscription-settings-actions";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logUserAction } from "../../store/actions/auth-actions";

const EditSubModal = ({ handleSubModal }: { handleSubModal: () => void }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {
        auth: {
            user: { access_token },
        },
        modal: { editSubscriptionModal },
        subscriptionSettings: { subscriptionData },
        cartSelectBasinCounty: { tax_percentage },
    } = useAppSelector((state) => state);
    const [state, setState] = useState<{
        deleteCartItemModal: boolean;
        tempData: (subscriptionDataDetails & { isDeleted: boolean })[];
        totalCost: number;
        totalTax: number;
        deleteSelectedItem: number;
    }>({
        deleteCartItemModal: false,
        tempData: [],
        totalCost: 0,
        totalTax: 0,
        deleteSelectedItem: 0,
    });

    const {
        deleteCartItemModal,
        tempData,
        totalCost,
        totalTax,
        deleteSelectedItem,
    } = state;
    useEffect(() => {
        if (subscriptionData?.details) {
            setState((prev) => ({
                ...prev,
                tempData: subscriptionData?.details.map((item) => ({
                    ...item,
                    isDeleted: false,
                })),
            }));
        }
    }, [subscriptionData?.details]);

    useEffect(() => {
        let totalCost = Number(
            tempData
                .filter((item) => !item.unsubscribe_status && !item.isDeleted)
                .reduce(
                    (accumulator, currentValue) =>
                        accumulator + Number(currentValue.total_cost),
                    0
                )
                .toFixed(2)
        );
        setState((prev) => ({
            ...prev,
            totalCost,
            totalTax: Number(((totalCost * tax_percentage) / 100).toFixed(2)),
        }));
    }, [tempData, tax_percentage]);
    return (
        <GlobalModal
            contentClass="editSubmodal"
            show={editSubscriptionModal}
            center={true}
        // onHide={() => {
        //     // dispatch(toggleEditSubscriptionModal());
        // }}
        >
            <h3 className="filter-heading">Edit your Subscription</h3>
            <div className="editSubscriptionBlock">
                <div className="headerblock">
                    <span className="area">Geographic Area</span>
                    <span className="total">Recurring Totals</span>
                </div>
                <div className="innerBlock">
                    <Scrollbars
                        className="editscroll lead-scroll"
                        style={{ width: "100%" }}
                        autoHeight
                        autoHeightMin={0}
                        autoHeightMax="28rem"
                        renderThumbVertical={(props) => (
                            <div {...props} className="thumb-vertical" />
                        )}
                        renderTrackVertical={(props) => (
                            <div {...props} className="track-vertical" />
                        )}
                    >
                        <div className="editlist">
                            <ul>
                                {tempData
                                    .filter(
                                        (_item) => !_item.unsubscribe_status
                                    )
                                    .map((item, index) => {
                                        return (
                                            <li key={index}>
                                                <div className="description">
                                                    <button
                                                        className="del"
                                                        style={
                                                            !item.isDeleted
                                                                ? {
                                                                    cursor: "pointer",
                                                                }
                                                                : {
                                                                    cursor: "not-allowed",
                                                                    color: "gray",
                                                                }
                                                        }
                                                        onClick={() => {
                                                            if (
                                                                !item.isDeleted
                                                            ) {
                                                                setState(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        deleteSelectedItem:
                                                                            item.id,
                                                                        deleteCartItemModal:
                                                                            true,
                                                                    })
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        <i className="fa-regular fa-trash-can"></i>
                                                    </button>
                                                    <figure className="map">
                                                        <img
                                                            src={
                                                                item.image_data
                                                            }
                                                            alt=""
                                                        />
                                                    </figure>
                                                    <div className="name">
                                                        {item.line_item_name}

                                                        <span
                                                            style={{
                                                                color: item.isDeleted
                                                                    ? "#D94141"
                                                                    : "#48637B",
                                                            }}
                                                        >
                                                            {item.isDeleted
                                                                ? `Cancelled Active Untill: ${moment(
                                                                    item.end_period
                                                                ).format(
                                                                    "MMM-DD-YYYY"
                                                                )}`
                                                                : `Current monthly subscription`}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="price">
                                                    {`${!item.isDeleted
                                                        ? USDollar.format(
                                                            Number(
                                                                item.total_cost
                                                            )
                                                        )
                                                        : USDollar.format(0)
                                                        }`}
                                                </div>
                                            </li>
                                        );
                                    })}
                            </ul>
                        </div>
                    </Scrollbars>
                    <div className="details">
                        <div className="subtotal">
                            <p>
                                Subtotal{" "}
                                <span>{USDollar.format(totalCost)}</span>
                            </p>
                            <p>
                                Taxes <span>{USDollar.format(totalTax)}</span>
                            </p>
                        </div>
                        <div className="subtotal total">
                            <p>
                                Monthly Recurring Total{" "}
                                <span>
                                    {USDollar.format(totalCost + totalTax)}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="actionbtn">
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() =>
                                dispatch(toggleEditSubscriptionModal())
                            }
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className={`btn btn-primary ${tempData.filter(
                                (item) =>
                                    item.isDeleted &&
                                    !item.unsubscribe_status
                            ).length > 0
                                ? ""
                                : "btn-disabled"
                                }`}
                            onClick={() => {
                                if (
                                    tempData.filter(
                                        (item) =>
                                            item.isDeleted &&
                                            !item.unsubscribe_status
                                    ).length > 0
                                ) {
                                    if (
                                        tempData.filter(
                                            (item) =>
                                                !item.isDeleted &&
                                                !item.unsubscribe_status
                                        ).length === 0
                                    ) {
                                        handleSubModal();
                                    } else {
                                        const formData = {
                                            subscription_id: `${subscriptionData?.subscription?.id}`,
                                            item_id: tempData
                                                .filter(
                                                    (item) => item.isDeleted
                                                )
                                                .map((_item) => _item.id),
                                        }
                                        dispatch(
                                            updateSubscription(access_token, formData)
                                        ).then((res) => {
                                            const { status, msg } = res || {};
                                            if (status === 200) {
                                                toast.success(msg);
                                                //log user action
                                                if (status === 200) {
                                                    dispatch(
                                                        logUserAction({
                                                            action_type: actionType["cancelled_subscription"],
                                                            action_log_detail: JSON.stringify(formData),
                                                        })
                                                    );
                                                }
                                                dispatch(
                                                    toggleEditSubscriptionModal()
                                                );
                                                navigate("/search");
                                            } else {
                                                toast.error(msg);
                                            }
                                        });
                                    }
                                }
                            }}
                        >
                            {tempData.filter(
                                (item) =>
                                    !item.isDeleted && !item.unsubscribe_status
                            ).length === 0
                                ? "Cancel Subscription"
                                : "Update"}
                        </button>
                    </div>
                </div>
                {deleteCartItemModal && (
                    <DeleteConfirmationModal
                        show={deleteCartItemModal}
                        handleClose={() => {
                            setState((prev) => ({
                                ...prev,
                                deleteCartItemModal: false,
                                deleteSelectedItem: 0,
                            }));
                        }}
                        confirmBtnClick={() => {
                            setState((prev) => ({
                                ...prev,
                                deleteCartItemModal: false,
                                tempData: tempData.map((item) =>
                                    item.id === deleteSelectedItem
                                        ? { ...item, isDeleted: true }
                                        : item
                                ),
                                deleteSelectedItem: 0,
                            }));
                        }}
                        content={
                            <p>
                                Are you sure you want to remove this item from
                                the cart?
                            </p>
                        }
                    />
                )}
            </div>
        </GlobalModal>
    );
};

export default EditSubModal;
