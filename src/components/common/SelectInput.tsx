import { selectOptionProps } from "../models/page-props";

export const SelectInput = ({
    options,
    register,
    name,
    errorMsg,
    className,
    placeholder,
    defaultValue,
    // onChange,
    // onBlur,
    ...rest
}: selectOptionProps) => {
    return (
        <>
            <select
                {...register(name)}
                className={`form-control ${className}`}
                defaultValue={defaultValue}
                // onChange={onChange}
                // onBlur={onBlur}
                {...rest}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((item, index) => (
                    <option value={item.value} key={index}>
                        {item.label}
                    </option>
                ))}
            </select>
            {errorMsg && <span className={`error`}>{errorMsg}</span>}
        </>
    );
};
