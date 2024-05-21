import React, { useState } from "react";
import { CardNumberElement } from "@stripe/react-stripe-js";
import { StripeCardNumberElementChangeEvent } from "@stripe/stripe-js";
import { Control, Controller } from "react-hook-form";
import { cardBrandToPfClass } from "../../utils/helper";

function CardNumberInput({
    control,
    name,
    className,
    onChangeCardNumber,
    errorMsg,
    rest,
}: {
    control: Control<any>;
    name: string;
    className?: string;
    onChangeCardNumber?: (e: StripeCardNumberElementChangeEvent) => void;
    errorMsg?: string;
    [x: string]: any;
}) {
    const [state, setState] = useState<{
        cardBrand:
            | "unknown"
            | "visa"
            | "mastercard"
            | "amex"
            | "discover"
            | "diners"
            | "jcb"
            | "unionpay";
    }>({
        cardBrand: "unknown",
    });
    const { cardBrand } = state;
    return (
        <>
            <i className={`${cardBrandToPfClass[`${cardBrand}`]}`}></i>
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                    <CardNumberElement
                        className={`form-control cardElement ${className}`}
                        onChange={(e) => {
                            onChange(e);
                            if (e.brand) {
                                setState((prev) => ({
                                    ...prev,
                                    cardBrand: Object.keys(
                                        cardBrandToPfClass
                                    ).includes(e.brand)
                                        ? e.brand
                                        : "unknown",
                                }));
                            }
                            onChangeCardNumber && onChangeCardNumber(e);
                        }}
                        options={{
                            style: {
                                base: {
                                    color: "#ffffff",
                                },
                            },
                        }}
                        {...rest}
                    />
                )}
            />
            {errorMsg && <span className={`error`}>{errorMsg}</span>}
        </>
    );
}

export default CardNumberInput;
