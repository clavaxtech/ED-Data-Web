import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller } from "react-hook-form";
import { datePickerFieldProps } from "../models/page-props";
import { Fragment } from "react";

export const DatePickerComponent = (props: datePickerFieldProps<null>) => {
    let { onChangeHandle, control, name, defaultValue, showerror, ...rest } =
        props;
    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            render={({ field, formState: { errors } }) => (
                <Fragment>
                    <DatePicker
                        {...rest}
                        // withPortal
                        selected={field.value}
                        dateFormat={"MM-dd-yyyy"}
                        onChangeRaw={(e) => e.preventDefault()}
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        maxDate={new Date()}
                        isClearable
                        onChange={(e) => {
                            field.onChange(e);
                            if (e && onChangeHandle) onChangeHandle(e);
                        }}
                    />
                    {showerror && (
                        <span className={`error`}>
                            <>{errors[name]?.message}</>
                        </span>
                    )}
                </Fragment>
            )}
        />
    );
};
