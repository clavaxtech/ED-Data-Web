import { Fragment } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { rangeSliderFieldProps } from "../models/page-props";
import { Controller } from "react-hook-form";

export const RangeSlider = (props: rangeSliderFieldProps<number[]>) => {
    let { control, name, defaultValue, showerror, onAfterChange, ...rest } =
        props;
    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            render={({ field, formState: { errors } }) => (
                <Fragment>
                    <Slider
                        range
                        {...rest}
                        {...field}
                        onAfterChange={onAfterChange}
                        allowCross={false}
                        handleStyle={{
                            borderColor: "#FFFFFF",
                            backgroundColor: "#FFFFFF",
                            boxShadow: "none",
                        }}
                        trackStyle={{ backgroundColor: "#2585C6" }}
                        handleRender={
                            props.renderToolTip
                                ? props.renderToolTip
                                : undefined
                        }
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
