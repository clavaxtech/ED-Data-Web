import React from "react";
import { MobileInputProps } from "../models/page-props";
import { Controller } from "react-hook-form";
import "react-phone-number-input/style.css";
// import PhoneInput from "react-phone-number-input";
import Input from 'react-phone-number-input/input'
const MobileInput = ({
    control,
    name,
    ...rest
}: MobileInputProps) => {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value, ...field } }) => (
                <Input
                    value={value}
                    onChange={(e) => {
                        onChange(e);
                    }}
                    {...rest}
                />
            )}
        />
    );
};

export default MobileInput;
