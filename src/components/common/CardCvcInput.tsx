import React from "react";
import { CardCvcElement } from "@stripe/react-stripe-js";
import { StripeCardCvcElementChangeEvent } from "@stripe/stripe-js";
import { Control, Controller } from "react-hook-form";

function CardCvcInput({
    control,
    name,
    className,
    onChangeCardCvc,
    errorMsg,
    rest,
}: {
    control: Control<any>;
    name: string;
    className?: string;
    onChangeCardCvc?: (e: StripeCardCvcElementChangeEvent) => void;
    errorMsg?: string;
    [x: string]: any;
}) {
    return (
        <>
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                    <CardCvcElement
                        className={`form-control cardElement ${className}`}
                        onChange={(e) => {
                            onChange(e);
                            onChangeCardCvc && onChangeCardCvc(e);
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

export default CardCvcInput;
