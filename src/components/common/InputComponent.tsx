import React from "react";
import { UseFormRegister } from "react-hook-form";

function InputComponent({
    errorMsg,
    register,
    name,
    // type,
    label,
    className,
    labelClassName,
    htmlFor,
    ...rest
}: {
    errorMsg?: string;
    register: UseFormRegister<any>;
    name: string;
    // type: string;
    label?: string;
    className?: string;
    labelClassName?: string;
    htmlFor?: string;
    [x: string]: any;
}) {
    return (
        <>
            {label && <label htmlFor={htmlFor||''} className={labelClassName}>{label}</label>}
            <input
                // type={type}
                {...register(`${name}`)}
                className={`form-control ${className ? className : ""}`}
                autoComplete="new-password"
                type="text"
                {...rest}
            />
            {errorMsg && <span className={`error`}>{errorMsg}</span>}
        </>
    );
}

export default InputComponent;
