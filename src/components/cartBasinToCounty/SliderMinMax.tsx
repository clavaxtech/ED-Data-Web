import React from "react";
import { RangeSlider } from "../common/RangeSlider";
import {
    Control,
    FieldValues,
    UseFormGetValues,
    UseFormRegister,
    UseFormSetValue,
} from "react-hook-form";
import { SliderToolTip } from "../common/ToolTip";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { handleSliderValue } from "../store/actions/cart-basin-to-county-actions";
import { cartBasinState } from "../models/redux-models";
import { inputNumber } from "../../utils/helper";

function SliderMinMax({
    label,
    name,
    control,
    register,
    minInputName,
    dataMinKey,
    dataMaxKey,
    dataMaxValue,
    setValue,
    getValues,
    maxInputName,
}: {
    label: string;
    name: string;
    control: Control<FieldValues, any>;
    register: UseFormRegister<FieldValues>;
    minInputName: string;
    dataMinKey: string;
    dataMaxKey: string;
    dataMaxValue: string;
    setValue: UseFormSetValue<FieldValues>;
    getValues: UseFormGetValues<FieldValues>;
    maxInputName: string;
}) {
    const dispatch = useAppDispatch();
    const {
        cartBasinToCounty: { sliderMinMaxValue },
    } = useAppSelector((state) => state);

    return (
        <div className="form-group">
            <div className="row">
                <div className="col-md-12">
                    <label htmlFor="">{label}</label>
                    <RangeSlider
                        name={name}
                        control={control}
                        defaultValue={[
                            sliderMinMaxValue[
                                dataMinKey as keyof cartBasinState["sliderMinMaxValue"]
                            ] as number,
                            sliderMinMaxValue[
                                dataMaxKey as keyof cartBasinState["sliderMinMaxValue"]
                            ] as number,
                        ]}
                        value={[
                            sliderMinMaxValue[
                                dataMinKey as keyof cartBasinState["sliderMinMaxValue"]
                            ] as number,
                            sliderMinMaxValue[
                                dataMaxKey as keyof cartBasinState["sliderMinMaxValue"]
                            ] as number,
                        ]}
                        onAfterChange={(e) => {
                            if (Array.isArray(e)) {
                                setValue(minInputName, e[0]);
                                setValue(maxInputName, e[1]);
                                dispatch(
                                    handleSliderValue({
                                        [dataMinKey]: e[0],
                                        [dataMaxKey]: e[1],
                                    })
                                );
                            }
                        }}
                        min={0}
                        max={
                            sliderMinMaxValue[
                                dataMaxValue as keyof cartBasinState["sliderMinMaxValue"]
                            ] as number
                        }
                        step={1}
                        isToolTip={true}
                        showerror={false}
                        renderToolTip={SliderToolTip}
                    />
                    <div className="minmax">
                        <div className="input-fld">
                            <label>Min</label>
                            <input
                                type="number"
                                {...register(minInputName)}
                                defaultValue={
                                    sliderMinMaxValue[
                                        dataMinKey as keyof cartBasinState["sliderMinMaxValue"]
                                    ] as number
                                }
                                onBlur={(e) => {
                                    const { value } = e.target;
                                    if (value === "") {
                                        dispatch(
                                            handleSliderValue({
                                                [dataMinKey]:
                                                    sliderMinMaxValue[
                                                        dataMinKey as keyof cartBasinState["sliderMinMaxValue"]
                                                    ],
                                            })
                                        );
                                        setValue(name, [
                                            sliderMinMaxValue[
                                                dataMinKey as keyof cartBasinState["sliderMinMaxValue"]
                                            ],
                                            sliderMinMaxValue[
                                                dataMaxKey as keyof cartBasinState["sliderMinMaxValue"]
                                            ],
                                        ]);
                                        setValue(
                                            minInputName,
                                            sliderMinMaxValue[
                                                dataMinKey as keyof cartBasinState["sliderMinMaxValue"]
                                            ]
                                        );
                                        return;
                                    }

                                    if (
                                        Number(value) >= 0 &&
                                        Number(value) <=
                                            (sliderMinMaxValue[
                                                dataMaxValue as keyof cartBasinState["sliderMinMaxValue"]
                                            ] as number) &&
                                        Number(value) <=
                                            Number(getValues(maxInputName))
                                    ) {
                                        dispatch(
                                            handleSliderValue({
                                                [dataMinKey]: Number(value),
                                            })
                                        );
                                        setValue(name, [
                                            Number(value),
                                            sliderMinMaxValue[
                                                dataMaxKey as keyof cartBasinState["sliderMinMaxValue"]
                                            ] as number,
                                        ]);
                                    } else {
                                        if (
                                            Number(value) >
                                            Number(getValues(maxInputName))
                                        ) {
                                            dispatch(
                                                handleSliderValue({
                                                    [dataMinKey]: Number(
                                                        getValues(maxInputName)
                                                    ),
                                                })
                                            );
                                            setValue(name, [
                                                Number(getValues(maxInputName)),
                                                sliderMinMaxValue[
                                                    dataMaxKey as keyof cartBasinState["sliderMinMaxValue"]
                                                ] as number,
                                            ]);
                                            setValue(
                                                minInputName,
                                                Number(getValues(maxInputName))
                                            );
                                            return;
                                        }
                                        if (Number(value) < 0) {
                                            dispatch(
                                                handleSliderValue({
                                                    [dataMinKey]: 0,
                                                })
                                            );
                                            setValue(name, [
                                                0,
                                                sliderMinMaxValue[
                                                    dataMaxKey as keyof cartBasinState["sliderMinMaxValue"]
                                                ] as number,
                                            ]);
                                            setValue(minInputName, 0);
                                        }
                                        if (
                                            Number(value) >
                                            (sliderMinMaxValue[
                                                dataMaxValue as keyof cartBasinState["sliderMinMaxValue"]
                                            ] as number)
                                        ) {
                                            dispatch(
                                                handleSliderValue({
                                                    [dataMinKey]:
                                                        sliderMinMaxValue[
                                                            dataMaxValue as keyof cartBasinState["sliderMinMaxValue"]
                                                        ] as number,
                                                })
                                            );
                                            setValue(name, [
                                                sliderMinMaxValue[
                                                    dataMaxValue as keyof cartBasinState["sliderMinMaxValue"]
                                                ] as number,
                                                sliderMinMaxValue[
                                                    dataMaxKey as keyof cartBasinState["sliderMinMaxValue"]
                                                ] as number,
                                            ]);
                                            setValue(
                                                minInputName,
                                                sliderMinMaxValue[
                                                    dataMaxValue as keyof cartBasinState["sliderMinMaxValue"]
                                                ] as number
                                            );
                                        }
                                    }
                                }}
                                className="form-control"
                                placeholder="Min"
                                onKeyDown={(e) => {
                                    inputNumber(e);
                                }}
                            />
                        </div>
                        <div className="input-fld">
                            <label>Max</label>
                            <input
                                type="number"
                                {...register(maxInputName)}
                                onKeyDown={(e) => {
                                    inputNumber(e);
                                }}
                                className="form-control"
                                defaultValue={
                                    sliderMinMaxValue[
                                        dataMaxKey as keyof cartBasinState["sliderMinMaxValue"]
                                    ] as number
                                }
                                onBlur={(e) => {
                                    const { value } = e.target;

                                    if (value === "") {
                                        dispatch(
                                            handleSliderValue({
                                                [dataMaxKey]: sliderMinMaxValue[
                                                    dataMaxKey as keyof cartBasinState["sliderMinMaxValue"]
                                                ] as number,
                                            })
                                        );
                                        setValue(name, [
                                            sliderMinMaxValue[
                                                dataMinKey as keyof cartBasinState["sliderMinMaxValue"]
                                            ] as number,
                                            sliderMinMaxValue[
                                                dataMaxKey as keyof cartBasinState["sliderMinMaxValue"]
                                            ] as number,
                                        ]);
                                        setValue(
                                            maxInputName,
                                            sliderMinMaxValue[
                                                dataMaxKey as keyof cartBasinState["sliderMinMaxValue"]
                                            ] as number
                                        );
                                        return;
                                    }
                                    if (
                                        Number(value) <=
                                            (sliderMinMaxValue[
                                                dataMaxValue as keyof cartBasinState["sliderMinMaxValue"]
                                            ] as number) &&
                                        Number(value) >= 0 &&
                                        Number(value) >=
                                            Number(getValues(minInputName))
                                    ) {
                                        dispatch(
                                            handleSliderValue({
                                                [dataMaxKey]: Number(value),
                                            })
                                        );
                                        setValue(name, [
                                            sliderMinMaxValue[
                                                dataMinKey as keyof cartBasinState["sliderMinMaxValue"]
                                            ] as number,
                                            Number(value),
                                        ]);
                                    } else {
                                        if (
                                            Number(value) <
                                            Number(getValues(minInputName))
                                        ) {
                                            dispatch(
                                                handleSliderValue({
                                                    [dataMaxKey]: Number(
                                                        getValues(minInputName)
                                                    ),
                                                })
                                            );
                                            setValue(name, [
                                                sliderMinMaxValue[
                                                    dataMinKey as keyof cartBasinState["sliderMinMaxValue"]
                                                ] as number,
                                                Number(getValues(minInputName)),
                                            ]);
                                            setValue(
                                                maxInputName,
                                                Number(getValues(minInputName))
                                            );
                                            return;
                                        }
                                        if (Number(value) < 0) {
                                            dispatch(
                                                handleSliderValue({
                                                    [dataMaxKey]: 0,
                                                })
                                            );
                                            setValue(name, [
                                                sliderMinMaxValue[
                                                    dataMinKey as keyof cartBasinState["sliderMinMaxValue"]
                                                ] as number,
                                                0,
                                            ]);
                                            setValue(maxInputName, 0);
                                        }
                                        if (
                                            Number(value) >
                                            (sliderMinMaxValue[
                                                dataMaxValue as keyof cartBasinState["sliderMinMaxValue"]
                                            ] as number)
                                        ) {
                                            dispatch(
                                                handleSliderValue({
                                                    [dataMaxKey]:
                                                        sliderMinMaxValue[
                                                            dataMaxValue as keyof cartBasinState["sliderMinMaxValue"]
                                                        ] as number,
                                                })
                                            );
                                            setValue(name, [
                                                sliderMinMaxValue[
                                                    dataMinKey as keyof cartBasinState["sliderMinMaxValue"]
                                                ] as number,
                                                sliderMinMaxValue[
                                                    dataMaxValue as keyof cartBasinState["sliderMinMaxValue"]
                                                ] as number,
                                            ]);
                                            setValue(
                                                maxInputName,
                                                sliderMinMaxValue[
                                                    dataMaxValue as keyof cartBasinState["sliderMinMaxValue"]
                                                ] as number
                                            );
                                        }
                                    }
                                }}
                                placeholder="Max"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SliderMinMax;
