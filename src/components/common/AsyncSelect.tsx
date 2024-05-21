import React from "react";
import { Controller } from "react-hook-form";
import { AsyncSelectProps } from "../models/page-props";
import { AsyncPaginate } from "react-select-async-paginate";

function AsyncSelect({
    control,
    name,
    errorMsg,
    loadOptions,
    labelClassName,
    label,
    className,
    ...rest
}: AsyncSelectProps) {
    return (
        <>
            {label && <label className={labelClassName}>{label}</label>}
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, value, ref, ...field } }) => (
                    <AsyncPaginate
                        value={value}
                        loadOptions={loadOptions}
                        menuShouldScrollIntoView={false}
                        onChange={onChange}
                        className={className}
                        selectRef={ref}
                        {...rest}
                    />
                )}
            />
            {errorMsg && <span className={`error`}>{errorMsg}</span>}
        </>
    );
}

export default AsyncSelect;
