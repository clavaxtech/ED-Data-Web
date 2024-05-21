import React from "react";
import { UseFormRegister } from "react-hook-form";

function RadioInputComponent({
    className,
    name,
    id,
    label,
    register,
    value,
    labelClassName,
    errorMsg,
    rest,
}: {
    className?: string;
    name: string;
    id?: string;
    label?: string;
    register: UseFormRegister<any>;
    value: string | number;
    labelClassName?: string;
    errorMsg?: string;
    [x: string]: any;
}) {
    return (
        <>
            {" "}
            <input
                className={`form-check-input cursor ${className}`}
                type="radio"
                id={id}
                value={value}
                {...register(name)}
                {...rest}
            />
            {label && (
                <label className={labelClassName} htmlFor={id}>
                    {label}
                </label>
            )}
            {errorMsg && <span className={`error`}>{errorMsg}</span>}
        </>
    );
}

export default RadioInputComponent;
