import React, { useState } from "react";
import { useForm } from "react-hook-form";
import InputComponent from "../../common/InputComponent";
import { CreditCardUpdateModalSubmitForm } from "../../models/submit-form";
import { CreditCardUpdateModalValidationSchema } from "../../../Helper/validation";
import CardNumberInput from "../../common/CardNumberInput";
import CardExpiryInput from "../../common/CardExpiryInput";
import CardCvcInput from "../../common/CardCvcInput";
import LocationSearchInput from "../../common/LocationSearchInput";
import { geocodeByAddress } from "react-places-autocomplete";
import { yupResolver } from "@hookform/resolvers/yup";

const CreditCardUpdateModal = () => {
    const [stateData, setStateData] = useState({
        address: "",
    });
    const { address } = stateData;

    const {
        register,
        handleSubmit,
        // reset,
        control,
        setValue,
        formState: { errors },
    } = useForm<CreditCardUpdateModalSubmitForm>({
        resolver: yupResolver(CreditCardUpdateModalValidationSchema),
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
    const onSubmit = async (data: CreditCardUpdateModalSubmitForm) => {};
    return (
        <React.Fragment>
            <div
                className="modal fade commonModal creditcardModal"
                id="creditcardModal"
                tabIndex={-1}
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                                <i className="fa-regular fa-credit-card"></i>{" "}
                                Update your payment information
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <form
                            className="form-block"
                            onSubmit={handleSubmit(onSubmit)}
                            autoComplete="off"
                            autoCapitalize="off"
                        >
                            <div className="modal-body">
                                <h3>Credit Card</h3>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-4">
                                            <InputComponent
                                                label="Full Name"
                                                name="full_name"
                                                placeholder="Enter your full name"
                                                register={register}
                                                errorMsg={
                                                    errors?.full_name?.message
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
                                                        ? errors?.cardExpiry
                                                              ?.message
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
                                                        ? errors?.cardCvc
                                                              ?.message
                                                        : ""
                                                }`}
                                                control={control}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <br />
                                <h3>Billing Address</h3>
                                <div className="row mb-4">
                                    <div className="col-md-12">
                                        <div className="form-group mb-4">
                                            <label>Address Line 1</label>
                                            <LocationSearchInput
                                                name={`first_address`}
                                                valueLoc={address}
                                                errorMsg={
                                                    errors?.first_address
                                                        ?.message
                                                }
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
                                                shouldFetchSuggestions={
                                                    address?.length >= 3
                                                }
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
                                                errorMsg={
                                                    errors.second_address
                                                        ?.message
                                                }
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
                                                errorMsg={
                                                    errors?.state?.message
                                                }
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
                                                errorMsg={
                                                    errors?.zip_code?.message
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-green">
                                    Update payment information
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default CreditCardUpdateModal;
