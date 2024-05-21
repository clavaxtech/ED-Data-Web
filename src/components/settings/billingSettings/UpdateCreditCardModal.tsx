import React, { useEffect, useState } from "react";
import GlobalModal from "../../common/GlobalModal";
import InputComponent from "../../common/InputComponent";
import CardNumberInput from "../../common/CardNumberInput";
import CardExpiryInput from "../../common/CardExpiryInput";
import CardCvcInput from "../../common/CardCvcInput";
import LocationSearchInput from "../../common/LocationSearchInput";
import { setFormData } from "../../../utils/helper";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import {
    CreditCardUpdateModalSubmitForm,
    UpdateBillingAddressModalSubmitForm,
} from "../../models/submit-form";
import {
    CreditCardUpdateModalValidationSchema,
    UpdateBillingAddressModalValidationSchema,
} from "../../../Helper/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { geocodeByAddress } from "react-places-autocomplete";
import {
    CardNumberElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import {
    hideSiteLoader,
    showSiteLoader,
} from "../../store/actions/modal-actions";
import { toast } from "react-toastify";
import {
    clearPaymentMethodsData,
    updateBillingDetail,
    updateCardDetails,
} from "../../store/actions/billing-settings-actions";

function UpdateCreditCardModal({
    show,
    handleClose,
    updateBillingAddress,
}: {
    show: boolean;
    handleClose: () => void;
    updateBillingAddress: boolean;
}) {
    const [stateData, setStateData] = useState({
        address: "",
    });
    const { address } = stateData;

    const dispatch = useAppDispatch();

    const {
        billingSettings: { paymentMethodsData },
        auth: {
            user: { access_token },
        },
    } = useAppSelector((state) => state);

    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        formState: { errors },
    } = useForm<
        CreditCardUpdateModalSubmitForm | UpdateBillingAddressModalSubmitForm
    >({
        ...(!updateBillingAddress && {
            resolver: yupResolver(CreditCardUpdateModalValidationSchema),
        }),
        ...(updateBillingAddress && {
            resolver: yupResolver(UpdateBillingAddressModalValidationSchema),
        }),
        mode: "all",
    });

    const addressOnChange = (address: string) => {
        setStateData((prev) => ({ ...prev, address }));
    };

    const addressOnSelect = (address: string) => {
        let tempValue = address.split(",");
        let tempFirstAddress = [];
        for (let i = 1; i <= tempValue.length; i++) {
            switch (i) {
                case 1:
                    break;
                case 2:
                    setValue("state", tempValue[tempValue.length - i]?.trim());
                    break;
                case 3:
                    setValue("city", tempValue[tempValue.length - i]?.trim());
                    break;
                default:
                    tempFirstAddress.push(
                        tempValue[tempValue.length - i].trim()
                    );
            }
        }
        let formatedAddress = tempFirstAddress.reverse().join(",");
        setValue("first_address", formatedAddress);
        setStateData((prev) => ({
            ...prev,
            address: formatedAddress,
        }));
        geocodeByAddress(address)
            .then((results) => {
                const { address_components } = results[0];
                address_components.forEach((item) => {
                    if (item.types.includes("postal_code")) {
                        setValue("zip_code", item.long_name?.trim());
                    }
                });
            })
            .catch((error) => console.error("Error", error));
    };

    const stripe = useStripe();
    const elements = useElements();

    const onSubmit = async (
        data:
            | CreditCardUpdateModalSubmitForm
            | UpdateBillingAddressModalSubmitForm
    ) => {
        dispatch(showSiteLoader());
        if (!updateBillingAddress && "full_name" in data) {
            const res = await stripe?.createPaymentMethod({
                type: "card",
                card: elements?.getElement(CardNumberElement)!,
                billing_details: {
                    name: data.full_name,
                    email: paymentMethodsData?.billing_email,
                    address: {
                        line1: data.first_address,
                        line2: data.second_address,
                        city: data.city,
                        state: data.state,
                        postal_code: data.zip_code,
                        country: "US",
                    },
                },
            });

            if (res) {
                const { paymentMethod, error } = res;

                if (error) {
                    const { message } = error;
                    toast.error(message);
                    dispatch(hideSiteLoader());
                    return;
                }

                if (paymentMethod) {
                    if (access_token) {
                        dispatch(
                            updateCardDetails(access_token, {
                                last4: `${paymentMethod?.card?.last4}`,
                                payment_id: `${paymentMethod?.id}`,
                                exp_month: `${paymentMethod?.card?.exp_month}`,
                                exp_year: `${paymentMethod?.card?.exp_year}`,
                                first_address: data.first_address,
                                city: data.city,
                                state: data.state,
                                zip_code: data.zip_code,
                                country: "US",
                                name_on_card: data.full_name,
                                brand: `${paymentMethod?.card?.brand}`,
                            })
                        ).then((result) => {
                            if (result) {
                                const { status, msg } = result;
                                if (status === 200) {
                                    toast.success(msg);
                                    dispatch(hideSiteLoader());
                                    dispatch(clearPaymentMethodsData());
                                    handleClose();
                                } else {
                                    toast.error(msg);
                                    dispatch(hideSiteLoader());
                                }
                            }
                        });
                    }
                }
            }
        } else {
            if (access_token) {
                dispatch(
                    updateBillingDetail(access_token, {
                        ...data,
                        country: "US",
                    } as UpdateBillingAddressModalSubmitForm)
                ).then((result) => {
                    if (result) {
                        const { status, msg } = result;
                        if (status === 200) {
                            toast.success(msg);
                            dispatch(hideSiteLoader());
                            dispatch(clearPaymentMethodsData());
                            handleClose();
                        } else {
                            dispatch(hideSiteLoader());
                            toast.error(msg);
                        }
                    }
                });
            }
        }
    };

    useEffect(() => {
        reset();
        if (paymentMethodsData) {
            setFormData(
                {
                    first_address: paymentMethodsData.first_address,
                    second_address: paymentMethodsData.second_address,
                    city: paymentMethodsData.city,
                    state: paymentMethodsData.state,
                    zip_code: paymentMethodsData.zip_code,
                    country: paymentMethodsData.country,
                    ...(updateBillingAddress && {
                        billing_email: paymentMethodsData.billing_email,
                    }),
                },
                setValue
            );
            setStateData((prev) => ({
                ...prev,
                address: paymentMethodsData.first_address,
            }));
        }
        // eslint-disable-next-line
    }, [paymentMethodsData]);

    return (
        <GlobalModal
            show={show}
            onHide={handleClose}
            titleClass="modal-title"
            headerClass="modal-header"
            contentClass="commonModal creditcardModal"
            title={
                <>
                    <i className="fa-regular fa-credit-card"></i> Update your
                    payment information
                </>
            }
        >
            <form
                className="form-block"
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="off"
                autoCapitalize="off"
            >
                <div className="formScroll scrollSection">
                {!updateBillingAddress && (
                    <>
                        <h3>Credit Card</h3>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group mb-4">
                                    <InputComponent
                                        label="Full Name"
                                        name="full_name"
                                        placeholder="Enter name on card"
                                        register={register}
                                        errorMsg={
                                            "full_name" in errors
                                                ? errors?.full_name?.message
                                                : ""
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group mb-4">
                                    <label>Card Number</label>
                                    <div className="cardnumber">
                                        <CardNumberInput
                                            control={control}
                                            name={"cardNumber"}
                                            errorMsg={`${
                                                "cardNumber" in errors
                                                    ? errors?.cardNumber
                                                          ?.message
                                                    : ""
                                            }`}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group mb-4">
                                    <label>Expiration</label>
                                    <CardExpiryInput
                                        control={control}
                                        name="cardExpiry"
                                        errorMsg={`${
                                            "cardExpiry" in errors
                                                ? errors?.cardExpiry?.message
                                                : ""
                                        }`}
                                    />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group mb-4">
                                    <label>CVC</label>
                                    <CardCvcInput
                                        name="cardCvc"
                                        errorMsg={`${
                                            "cardCvc" in errors
                                                ? errors?.cardCvc?.message
                                                : ""
                                        }`}
                                        control={control}
                                    />
                                </div>
                            </div>
                        </div>
                        <br />
                    </>
                )}
                <h3>Billing Address</h3>
                <div className="row mb-4">
                    {updateBillingAddress && (
                        <div className="col-md-12">
                            <div className="form-group mb-4">
                                <InputComponent
                                    label="Billing Email"
                                    placeholder="Enter billing email"
                                    name="billing_email"
                                    register={register}
                                    errorMsg={
                                        "billing_email" in errors
                                            ? errors?.billing_email?.message
                                            : ""
                                    }
                                />
                            </div>
                        </div>
                    )}
                    <div className="col-md-12">
                        <div className="form-group mb-4">
                            <label>Address Line 1</label>
                            <LocationSearchInput
                                name={`first_address`}
                                valueLoc={address}
                                errorMsg={errors?.first_address?.message}
                                onChangeLoc={addressOnChange}
                                onSelect={addressOnSelect}
                                control={control}
                                debounce={500}
                                searchOptions={{
                                    componentRestrictions: {
                                        country: ["usa", "us"],
                                    },
                                    types: [],
                                }}
                                placeholder="Enter address line 1"
                                shouldFetchSuggestions={address?.length >= 3}
                                title={address}
                            />
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="form-group mb-4">
                            <InputComponent
                                label="Address Line 2"
                                placeholder="Enter address line 2"
                                name="second_address"
                                register={register}
                                errorMsg={errors.second_address?.message}
                            />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-group mb-4">
                            <InputComponent
                                label="City"
                                placeholder="City"
                                name="city"
                                register={register}
                                errorMsg={errors?.city?.message}
                            />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-group mb-4">
                            <InputComponent
                                label="State"
                                placeholder="State"
                                name="state"
                                register={register}
                                errorMsg={errors?.state?.message}
                            />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-group mb-4">
                            <InputComponent
                                label="Zip"
                                placeholder="Zip Code"
                                name="zip_code"
                                register={register}
                                errorMsg={errors?.zip_code?.message}
                            />
                        </div>
                    </div>
                </div>
                </div>
                <button type="submit" className="btn btn-green">
                    {!updateBillingAddress
                        ? "Update payment information"
                        : "Update billing information"}
                </button>
            </form>
        </GlobalModal>
    );
}

export default UpdateCreditCardModal;
