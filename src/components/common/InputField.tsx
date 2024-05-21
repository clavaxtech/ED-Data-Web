import { inputProps } from "../models/page-props";
import { Controller } from "react-hook-form";

import { Fragment } from 'react';

export const InputField = (props: inputProps<string>) => {
    let { control, name, defaultValue, showerror, onChangeHandler, children, type, concatErrorMsg, extraInputValue, twoDigitDecimal, ...rest } = props;
    const handleNumberChange = (value: string) => {
        // Allow numbers and a dot for decimal point, remove any character that is not a digit or dot.
        let validValue = value.replace(/[^0-9.]+/, '');
        // If there's more than one dot, keep only the first part and discard the rest.
        const parts = validValue.split('.');
        if (parts.length > 2) {
            validValue = parts[0] + '.' + parts.slice(1).join('');
        } else if (parts.length === 2) {
            // If there are decimal places, limit them to two digits
            parts[1] = parts[1].substring(0, 2);
            validValue = parts.join('.');
        }
        return validValue;
    };

    const finalizeNumberValue = (value: string) => {
        // Check if the value contains a decimal point
        if (!value.includes('.')) {
            // If not, add '.00' to simulate two decimal places
            return `${value}.00`;
        }
        const parts = value.split('.');
        if (parts[1].length === 0) { // If there's a dot but no decimals
            return `${value}00`;
        } else if (parts[1].length === 1) { // If there's only one decimal
            return `${value}0`;
        }
        return value;
    };
    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            render={({ field: { onChange, ...fieldprops }, formState: { errors } }) => (
                <Fragment>
                    <div className="api">
                        <input
                            {...rest}
                            {...fieldprops}
                            onKeyPress={(event) => {
                                if (!(event.target as HTMLInputElement).hasAttribute("maxLength")) return;
                                let { value, maxLength } = (event.target) as HTMLInputElement
                                if (value.length > maxLength - 1) {
                                    value = value.slice(0, maxLength)
                                    event.preventDefault()
                                }
                            }}
                            onChange={event => {
                                if (["number"].includes(props.type)) {
                                    if (!twoDigitDecimal) {
                                        // eslint-disable-next-line
                                        onChange(event.target.value.replace(/[^0-9 \,]/, ''))
                                    } else {
                                        const validValue = handleNumberChange(event.target.value);
                                        onChange(validValue);
                                    }

                                } else if (["text", "password"].includes(props.type)) {
                                    onChange(event)
                                    if (onChangeHandler) onChangeHandler(event.target.value)
                                }
                            }}
                            onBlur={(event) => {
                                if (twoDigitDecimal) {
                                    const finalValue = finalizeNumberValue(event.target.value);
                                    onChange(finalValue);
                                }
                                if (extraInputValue) {
                                    let temp = event.target.value.includes(extraInputValue) ? event.target.value : event.target.value.trim() ? event.target.value.trim() + extraInputValue : ''
                                    onChange(temp);
                                }
                            }}
                        />
                        {children}
                    </div>
                    {
                        showerror && <span className={`error`}>
                            <>{errors[name]?.message ? `${errors[name]?.message}${concatErrorMsg ? concatErrorMsg : ''}` : <></>}</>
                        </span>
                    }
                </Fragment>
            )
            }
        />
    )
}
