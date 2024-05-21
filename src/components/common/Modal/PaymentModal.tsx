import React, { useEffect, useLayoutEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import { Modal } from "react-bootstrap";
import {
    CardNumberElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import { useForm } from "react-hook-form";
import {
    CheckOutFormData,
    CheckOutSavedCardFormData,
} from "../../models/submit-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    CheckOutFormSavedCardValidationSchema,
    CheckOutFormValidationSchema,
} from "../../../Helper/validation";
import { USDollar, actionType, setFormData } from "../../../utils/helper";
import {
    calculateTax,
    clearCartItemsList,
    clearCartItemsTotalTax,
    clearSavedCardDetails,
    createSubscription,
    finalSubscription,
    getStateList,
} from "../../store/actions/cart-select-basin-county-actions";
import {
    hideCheckOutModal,
    hideSiteLoader,
    showSiteLoader,
} from "../../store/actions/modal-actions";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LocationSearchInput from "../LocationSearchInput";
import { geocodeByAddress } from "react-places-autocomplete";
import {
    clearCompanySettingsDetails,
    fetchCompanySettingDetail,
} from "../../store/actions/company-settings-actions";
import { SelectInput } from "../SelectInput";
import RadioInputComponent from "../RadioInputComponent";
import CardNumberInput from "../CardNumberInput";
import CardExpiryInput from "../CardExpiryInput";
import CardCvcInput from "../CardCvcInput";
import moment from "moment";
import InputComponent from "../InputComponent";
import { cancelSubscription } from "../../store/actions/subscription-settings-actions";
import { logUserAction } from "../../store/actions/auth-actions";

function PaymentModal({
    onCancelBtnClick,
    isEdit,
    removeBasinOrCounty,
    updateFilterAndUnmatchedDataAfterSub,
}: {
    onCancelBtnClick: () => void;
    isEdit?: boolean;
    removeBasinOrCounty: (
        id: number,
        item_type: number,
        sub_total: number
    ) => void;
    updateFilterAndUnmatchedDataAfterSub?: () => void;
}) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [stateData, setStateData] = useState({
        address: "",
        calcTax: false,
        initialMount: true,
        newItemTotalInEditCase: 0,
        newItemTotalTaxInEditCase: 0,
    });

    const {
        address,
        calcTax,
        initialMount,
        newItemTotalInEditCase,
        newItemTotalTaxInEditCase,
    } = stateData;

    const {
        modal: { checkOutModal },
        auth: {
            user: { first_name, last_name, access_token, company_configs: {
                free_trial_period_enabled,
                no_of_free_days_allowed,
            }, },
        },
        companySettings: {
            address: { first_address, city, state, zip_code, phone_no },
            company: { billing_email, company_name, company_id },
        },
        cartSelectBasinCounty: {
            cartItemsTotal,
            stateOptions,
            cartListItems,
            cartItemsTotalTax,
            saved_card,
            tax_percentage,
            cartModified,
        },
    } = useAppSelector((state) => state);
    const stripe = useStripe();
    const elements = useElements();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
        control,
        watch,
    } = useForm<CheckOutFormData | CheckOutSavedCardFormData>({
        ...(saved_card.length === 0 && {
            resolver: yupResolver(CheckOutFormValidationSchema),
        }),
        ...(saved_card.length > 0 && {
            resolver: yupResolver(CheckOutFormSavedCardValidationSchema),
        }),
        mode: "all",
    });
    const submitForm = async (
        data: CheckOutFormData | CheckOutSavedCardFormData
    ) => {
        dispatch(showSiteLoader());
        try {
            let res;
            // create a payment method
            if (saved_card.length === 0 || watch("saved_card") === "0") {
                res = await stripe?.createPaymentMethod({
                    type: "card",
                    card: elements?.getElement(CardNumberElement)!,
                    billing_details: {
                        name: data.name,
                        email: data.billing_email,
                        address: {
                            line1: data.address,
                            city: data.city,
                            state: data.state,
                            postal_code: data.zip_code,
                            country: "US",
                        },
                    },
                });
            }
            const { paymentMethod, error } = res || {};
            if (error) {
                const { message } = error;
                toast.error(message);
                dispatch(hideSiteLoader());
                return;
            }
            // call the backend to create subscription
            if (
                (access_token && paymentMethod) ||
                (access_token && watch("saved_card"))
            ) {
                dispatch(
                    createSubscription(
                        access_token,
                        paymentMethod || watch("saved_card") === "0"
                            ? {
                                billing_email: data.billing_email,
                                company_name: `${company_name}`,
                                payment_id: `${paymentMethod?.id}`,
                                company: company_id as number,
                                phone_no: phone_no,
                                last4: `${paymentMethod?.card?.last4}`,

                                exp_month: `${paymentMethod?.card?.exp_month}`,
                                exp_year: `${paymentMethod?.card?.exp_year}`,
                                brand: `${paymentMethod?.card?.brand}`,
                                name_on_card: data.name,
                            }
                            : {
                                billing_email: data.billing_email,
                                saved_card_id: saved_card.filter(
                                    (item) =>
                                        Number(watch("saved_card")) ===
                                        item.id
                                )[0].id,
                                company: company_id as number,
                                phone_no: phone_no,
                                last4: saved_card.filter(
                                    (item) =>
                                        Number(watch("saved_card")) ===
                                        item.id
                                )[0].cc_no,
                            }
                    )
                ).then(async (result) => {
                    if (result) {
                        const { status, data, msg } = result || {};
                        if (status === 200) {
                            if (data) {
                                const { client_secret } = data;
                                if (client_secret !== "na") {
                                    const confirmPayment =
                                        await stripe?.confirmCardPayment(
                                            client_secret
                                        );
                                    if (confirmPayment?.error) {
                                        toast.error(
                                            confirmPayment.error.message
                                        );
                                        dispatch(hideSiteLoader());
                                    } else {
                                        await dispatch(
                                            finalSubscription(access_token, {
                                                ...confirmPayment?.paymentIntent,
                                                ...(free_trial_period_enabled && { no_of_free_days_allowed })
                                            })
                                        );

                                        dispatch(hideCheckOutModal());
                                        //log user action
                                        let action_log_detail = "";
                                        cartListItems.map((_i, _indx) => "county_name" in _i ? (action_log_detail += `${_i.county_name} - ${_i.state_abbr} ${_indx === cartListItems.length - 1 ? "" : "|"}`) : (action_log_detail += `${_i.basin_name} ${_indx === cartListItems.length - 1 ? "" : "|"}`))
                                        dispatch(
                                            logUserAction({
                                                action_type: actionType['new_subscription'],
                                                action_log_detail
                                            })
                                        );

                                        toast.success(
                                            "Success! Check your email for the invoice."
                                        );
                                        // this function will call from api list upload in search page
                                        updateFilterAndUnmatchedDataAfterSub &&
                                            updateFilterAndUnmatchedDataAfterSub();
                                        dispatch(hideSiteLoader());

                                        navigate("/search");
                                    }
                                } else {
                                    dispatch(hideSiteLoader());

                                    navigate("/search");
                                }
                            }
                        } else {
                            toast.error(msg);
                            dispatch(hideSiteLoader());
                        }
                    }
                });
            } else {
                dispatch(hideSiteLoader());
            }
        } catch (error) {
            dispatch(hideSiteLoader());
            console.log(error);
        }
    };

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
        setValue("address", formatedAddress);
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

    //closing the payment modal when no item is in list
    useLayoutEffect(() => {
        // cartListItems.length === 0 &&
        //     checkOutModal &&
        //     dispatch(hideCheckOutModal());
        if (!cartModified && checkOutModal) {
            dispatch(hideCheckOutModal());
        }

        if (isEdit && cartListItems.length > 0) {
            let tempValue = cartListItems
                .filter(
                    (item) =>
                        item.is_deleted === false &&
                        item.subscription_det_id === null
                )
                .map((_item) => _item.price)
                .reduce(
                    (accumulator, currentValue) => accumulator + currentValue,
                    0
                );
            setStateData((prev) => ({
                ...prev,
                newItemTotalInEditCase: Number(tempValue.toFixed(2)),
                newItemTotalTaxInEditCase: Number(
                    ((tempValue * tax_percentage) / 100).toFixed(2)
                ),
            }));
        }

        // eslint-disable-next-line
    }, [cartListItems, tax_percentage]);

    useLayoutEffect(() => {
        (initialMount || calcTax) &&
            dispatch(
                calculateTax(access_token, {
                    sub_total: cartItemsTotal,
                    ...(calcTax && {
                        first_address: watch("address"),
                    }),
                    ...(calcTax && {
                        city: watch("city"),
                    }),
                    ...(calcTax && {
                        state: watch("state"),
                    }),
                    ...(calcTax && {
                        zip_code: watch("zip_code"),
                    }),
                    ...(calcTax && {
                        country: watch("country"),
                    }),
                })
            );
        setStateData((prev) => ({
            ...prev,
            ...(calcTax && { calcTax: !calcTax }),
            ...(initialMount && { initialMount: !initialMount }),
        }));
        // eslint-disable-next-line
    }, [calcTax]);

    useEffect(() => {
        stateOptions.length === 0 && dispatch(getStateList(access_token));
        dispatch(fetchCompanySettingDetail(access_token));
        return () => {
            dispatch(clearCartItemsTotalTax());
            dispatch(clearSavedCardDetails());
            dispatch(clearCompanySettingsDetails());
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (company_id) {
            setStateData((prev) => ({
                ...prev,
                address: `${first_address}`,
            }));
            setFormData(
                {
                    name: `${first_name} ${last_name}`,
                    billing_email: billing_email,
                    address: `${first_address}`,
                    city,
                    zip_code,
                    country: "US",
                    state,
                },
                setValue
            );
        }
        // eslint-disable-next-line
    }, [company_id]);

    useEffect(() => {
        if (stateOptions.length > 0) setValue("state", state);
        // eslint-disable-next-line
    }, [stateOptions]);

    return (
        <Modal
            className="commonModal paymentModal"
            enforceFocus={false}
            show={checkOutModal}
        >
            <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                    reset();
                    onCancelBtnClick();
                }}
            >
                <i className="fa-solid fa-xmark"></i>
            </button>
            <form
                className="form-block"
                onSubmit={handleSubmit(submitForm)}
                autoComplete="off"
                autoCapitalize="off"
            >
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-6">
                            <h3>Billing information</h3>
                            <div className="box">
                                <div className="form-group">
                                    <InputComponent
                                        label="Billing email"
                                        name="billing_email"
                                        placeholder="Enter your billing email"
                                        register={register}
                                        errorMsg={
                                            errors?.billing_email?.message
                                        }
                                    />
                                </div>
                                {Array.isArray(saved_card) &&
                                    saved_card.length > 0 && (
                                        <div className="form-group">
                                            <label>Select payment method</label>
                                            <div className="paymentOption">
                                                {saved_card.map(
                                                    (item, index) => {
                                                        return (
                                                            <div
                                                                className="form-check"
                                                                key={index}
                                                            >
                                                                <RadioInputComponent
                                                                    value={
                                                                        item.id
                                                                    }
                                                                    name={
                                                                        "saved_card"
                                                                    }
                                                                    register={
                                                                        register
                                                                    }
                                                                    id={`${item.id}`}
                                                                    label={`XXXX XXXX XXXX ${item.cc_no}`}
                                                                    labelClassName="form-check-label"
                                                                />
                                                            </div>
                                                        );
                                                    }
                                                )}
                                                <div className="form-check">
                                                    <RadioInputComponent
                                                        value={0}
                                                        name={"saved_card"}
                                                        register={register}
                                                        id={`0`}
                                                        label={`New Card`}
                                                        labelClassName="form-check-label"
                                                    />
                                                </div>
                                            </div>
                                            <span className={`error`}>
                                                {`${"saved_card" in errors
                                                    ? errors?.saved_card
                                                        ?.message
                                                    : ""
                                                    }`}
                                            </span>
                                        </div>
                                    )}
                                {(watch("saved_card") === "0" ||
                                    (Array.isArray(saved_card) &&
                                        saved_card.length === 0)) && (
                                        <>
                                            <div className="form-group">
                                                <label>Card details</label>
                                                <div className="cardBrand">
                                                    <CardNumberInput
                                                        control={control}
                                                        name={"cardNumber"}
                                                    />
                                                </div>
                                                <span className="error">{`${"cardNumber" in errors
                                                    ? errors?.cardNumber
                                                        ?.message
                                                    : ""
                                                    }`}</span>
                                                <div className="cardNum">
                                                    <div className="cardInput">
                                                        <CardExpiryInput
                                                            control={control}
                                                            name="cardExpiry"
                                                            errorMsg={`${"cardExpiry" in
                                                                errors
                                                                ? errors
                                                                    ?.cardExpiry
                                                                    ?.message
                                                                : ""
                                                                }`}
                                                        />
                                                    </div>
                                                    <div className="cardInput">
                                                        <CardCvcInput
                                                            name="cardCvc"
                                                            errorMsg={`${"cardCvc" in errors
                                                                ? errors
                                                                    ?.cardCvc
                                                                    ?.message
                                                                : ""
                                                                }`}
                                                            control={control}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <InputComponent
                                                    label="Name on card"
                                                    name="name"
                                                    placeholder="Enter your name on card"
                                                    register={register}
                                                    errorMsg={errors?.name?.message}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Billing address </label>
                                                <div className="selectInput mb-1">
                                                    {/* <i className="fa-solid fa-angle-down"></i> */}
                                                    <SelectInput
                                                        placeholder="Country"
                                                        name="country"
                                                        register={register}
                                                        options={[
                                                            {
                                                                label: "United States",
                                                                value: "US",
                                                            },
                                                        ]}
                                                        onBlur={(
                                                            e: React.FocusEvent<
                                                                HTMLInputElement,
                                                                Element
                                                            >
                                                        ) => {
                                                            let value =
                                                                e.target.value.trim();
                                                            if (
                                                                value &&
                                                                value !== "US"
                                                            ) {
                                                                setStateData(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        calcTax:
                                                                            true,
                                                                    })
                                                                );
                                                            }
                                                        }}
                                                        errorMsg={
                                                            errors?.country?.message
                                                        }
                                                    />
                                                </div>
                                                <LocationSearchInput
                                                    name={`address`}
                                                    valueLoc={address}
                                                    errorMsg={
                                                        errors?.address?.message ||
                                                        ""
                                                    }
                                                    onChangeLoc={addressOnChange}
                                                    onSelect={addressOnSelect}
                                                    onBlur={(e) => {
                                                        let value =
                                                            e.target.value.trim();
                                                        if (
                                                            value &&
                                                            value !== first_address
                                                        ) {
                                                            setStateData(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    calcTax: true,
                                                                })
                                                            );
                                                        }
                                                    }}
                                                    control={control}
                                                    debounce={500}
                                                    searchOptions={{
                                                        componentRestrictions: {
                                                            country: ["usa", "us"],
                                                        },
                                                        types: [],
                                                    }}
                                                    placeholder="Address"
                                                    shouldFetchSuggestions={
                                                        address?.length >= 3
                                                    }
                                                    title={address}
                                                />
                                                <div className="cardNum">
                                                    <div className="cardInput">
                                                        <InputComponent
                                                            name="city"
                                                            placeholder="City"
                                                            register={register}
                                                            errorMsg={
                                                                errors.city?.message
                                                            }
                                                            onBlur={(
                                                                e: React.FocusEvent<HTMLInputElement>
                                                            ) => {
                                                                let value =
                                                                    e.target.value.trim();
                                                                if (
                                                                    value &&
                                                                    value !== city
                                                                ) {
                                                                    setStateData(
                                                                        (prev) => ({
                                                                            ...prev,
                                                                            calcTax:
                                                                                true,
                                                                        })
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="cardInput">
                                                        <InputComponent
                                                            name="zip_code"
                                                            placeholder="Zip code"
                                                            register={register}
                                                            errorMsg={
                                                                errors.zip_code
                                                                    ?.message
                                                            }
                                                            onBlur={(
                                                                e: React.FocusEvent<HTMLInputElement>
                                                            ) => {
                                                                let value =
                                                                    e.target.value.trim();
                                                                if (
                                                                    value &&
                                                                    value !==
                                                                    zip_code
                                                                ) {
                                                                    setStateData(
                                                                        (prev) => ({
                                                                            ...prev,
                                                                            calcTax:
                                                                                true,
                                                                        })
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="selectInput mt-1">
                                                    {/* <i className="fa-solid fa-angle-down"></i> */}
                                                    <SelectInput
                                                        placeholder="State"
                                                        name="state"
                                                        register={register}
                                                        options={stateOptions}
                                                        errorMsg={
                                                            errors.state?.message
                                                        }
                                                        onBlur={(
                                                            e: React.FocusEvent<
                                                                HTMLInputElement,
                                                                Element
                                                            >
                                                        ) => {
                                                            let value =
                                                                e.target.value.trim();
                                                            if (
                                                                value &&
                                                                value !== state
                                                            ) {
                                                                setStateData(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        calcTax:
                                                                            true,
                                                                    })
                                                                );
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <h3>Order Summary</h3>
                            <div className="box p-0">
                                <div className="price-list scrollSection">
                                    <ul>
                                        {isEdit && (
                                            <li className="header">
                                                <div className="content">
                                                    <div className="small-map">
                                                        &nbsp;
                                                    </div>
                                                    <div className="description">
                                                        Geographic Area
                                                    </div>
                                                </div>
                                                <div className="price">
                                                    Recurring Totals
                                                </div>
                                                <div className="price">
                                                    Subtotal
                                                </div>
                                            </li>
                                        )}
                                        {cartListItems.map((item, index) => (
                                            <li key={index}>
                                                <div className="content">
                                                    {item.subscription_det_id ===
                                                        null && (
                                                            <a
                                                                className="cross-btn"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    let sub_total =
                                                                        cartItemsTotal -
                                                                        item.price;
                                                                    removeBasinOrCounty(
                                                                        item.id,
                                                                        "basin_name" in
                                                                            item
                                                                            ? 1
                                                                            : 2,
                                                                        sub_total
                                                                    );
                                                                }}
                                                                href="void(0)"
                                                            >
                                                                <i className="fa-regular fa-circle-xmark"></i>
                                                            </a>
                                                        )}
                                                    <div className="small-map">
                                                        <img
                                                            src={item.png}
                                                            alt=""
                                                        />
                                                    </div>
                                                    <div className="description">
                                                        <h4>
                                                            {"basin_name" in
                                                                item
                                                                ? `${item.basin_name}`
                                                                : `${item.county_name}`}
                                                        </h4>
                                                        <p
                                                            className={
                                                                isEdit
                                                                    ? item.is_deleted
                                                                        ? "red"
                                                                        : item.subscription_det_id
                                                                            ? ""
                                                                            : "green"
                                                                    : ""
                                                            }
                                                        >
                                                            {isEdit === false
                                                                ? `Monthly subscription`
                                                                : item.is_deleted
                                                                    ? `Cancelled Active Untill: ${moment(
                                                                        item.end_period
                                                                    ).format(
                                                                        "MMM-DD-YYYY"
                                                                    )}`
                                                                    : item.subscription_det_id ===
                                                                        null
                                                                        ? `New monthly subscription`
                                                                        : `Current monthly subscription`}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="price">
                                                    {item.is_deleted === true
                                                        ? USDollar.format(0)
                                                        : USDollar.format(
                                                            item.price
                                                        )}
                                                </div>
                                                {isEdit && (
                                                    <div className="price">
                                                        {item.subscription_det_id !==
                                                            null
                                                            ? USDollar.format(0)
                                                            : USDollar.format(
                                                                item.price
                                                            )}
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="total-block">
                                    <ul className="subtotal">
                                        <li>
                                            <label>Subtotal </label>
                                            <span>
                                                {USDollar.format(
                                                    cartItemsTotal
                                                )}
                                            </span>
                                            {isEdit && (
                                                <span>
                                                    {USDollar.format(
                                                        newItemTotalInEditCase
                                                    )}
                                                </span>
                                            )}
                                        </li>
                                        <li>
                                            <label>Taxes </label>
                                            <span>
                                                {USDollar.format(
                                                    cartItemsTotalTax
                                                )}
                                            </span>
                                            {isEdit && (
                                                <span>
                                                    {newItemTotalTaxInEditCase
                                                        ? USDollar.format(
                                                            newItemTotalTaxInEditCase
                                                        )
                                                        : USDollar.format(0)}
                                                </span>
                                            )}
                                        </li>
                                        {isEdit && (
                                            <li className="monthly">
                                                <label>
                                                    Monthly Recurring Total{" "}
                                                </label>
                                                <span>
                                                    {USDollar.format(
                                                        cartItemsTotalTax +
                                                        cartItemsTotal
                                                    )}
                                                </span>
                                                <span>&nbsp;</span>
                                            </li>
                                        )}
                                    </ul>
                                    <div className="total">
                                        <label>
                                            {isEdit
                                                ? "Total Due Today"
                                                : "Total"}
                                        </label>
                                        <span>
                                            {isEdit
                                                ? USDollar.format(
                                                    newItemTotalTaxInEditCase +
                                                    newItemTotalInEditCase
                                                )
                                                : USDollar.format(
                                                    cartItemsTotal +
                                                    cartItemsTotalTax
                                                )}
                                        </span>
                                    </div>
                                    {!isEdit ? (
                                        <button
                                            type="submit"
                                            className={`btn btn-primary width100`}
                                        >
                                            Subscribe
                                        </button>
                                    ) : (
                                        <div className="action-btn">
                                            <button
                                                type="button"
                                                className="btn btn-outline"
                                                onClick={() =>
                                                    dispatch(
                                                        hideCheckOutModal()
                                                    )
                                                }
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type={
                                                    cartListItems.filter(
                                                        (item) =>
                                                            item.is_deleted ===
                                                            true
                                                    ).length ===
                                                        cartListItems.length
                                                        ? "button"
                                                        : "submit"
                                                }
                                                onClick={() => {
                                                    cartListItems.filter(
                                                        (item) =>
                                                            item.is_deleted ===
                                                            true
                                                    ).length ===
                                                        cartListItems.length &&
                                                        dispatch(
                                                            cancelSubscription(
                                                                access_token
                                                            )
                                                        ).then((result) => {
                                                            if (result) {
                                                                const {
                                                                    status,
                                                                    msg,
                                                                } = result;
                                                                if (
                                                                    status ===
                                                                    200
                                                                ) {
                                                                    toast.success(
                                                                        msg
                                                                    );
                                                                    dispatch(
                                                                        clearCartItemsList()
                                                                    );
                                                                    dispatch(
                                                                        hideCheckOutModal()
                                                                    );
                                                                } else {
                                                                    toast.error(
                                                                        msg
                                                                    );
                                                                }
                                                            }
                                                        });
                                                }}
                                                className={`btn btn-primary`}
                                            >
                                                {cartListItems.filter(
                                                    (item) =>
                                                        item.is_deleted === true
                                                ).length ===
                                                    cartListItems.length
                                                    ? "Cancel Subscription"
                                                    : "Update Subscription"}{" "}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </form>
        </Modal>
    );
}

export default PaymentModal;
