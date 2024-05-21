import React from "react";
import { CardExpiryElement } from "@stripe/react-stripe-js";
import { StripeCardExpiryElementChangeEvent } from "@stripe/stripe-js";
import { Control, Controller } from "react-hook-form";

function CardExpiryInput({
    control,
    name,
    className,
    onChangeCardExpiry,
    errorMsg,
    rest,
}: {
    control: Control<any>;
    name: string;
    className?: string;
    onChangeCardExpiry?: (e: StripeCardExpiryElementChangeEvent) => void;
    errorMsg?: string;
    [x: string]: any;
}) {
    return (
        <>
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                    <CardExpiryElement
                        className={`form-control cardElement ${className}`}
                        onChange={(e) => {
                            onChange(e);
                            onChangeCardExpiry && onChangeCardExpiry(e);
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

export default CardExpiryInput;
