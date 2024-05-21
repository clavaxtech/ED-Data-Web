import { DatePickerComponent } from "../common/DatePicker";
import { cartBasinDates as dateList } from "./CartBasinConstant";
import { cartBasinDateProps } from "../models/page-props";

const CartBasinDate = (props: cartBasinDateProps) => {
    let { watch, control, onChangeEndDate, onChangeStartDate, getValues } =
        props;
    return (
        <>
            {dateList.map(({ name, unique_name, fields }, index) => (
                <div className="form-group" key={index}>
                    <div className="row">
                        <label htmlFor="">{name}</label>
                        <div className="col-md-6">
                            <div className="calInput">
                                <DatePickerComponent
                                    control={control}
                                    name={fields[0].f_fieldname}
                                    defaultValue={null}
                                    minDate={null}
                                    placeholderText="MM-DD-YYYY"
                                    className="form-control cursor"
                                    onChangeHandle={(date) =>
                                        onChangeStartDate(date, unique_name)
                                    }
                                    showerror={false}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="calInput">
                                <DatePickerComponent
                                    control={control}
                                    name={fields[0].l_fieldname}
                                    defaultValue={null}
                                    placeholderText="MM-DD-YYYY"
                                    className="form-control cursor"
                                    minDate={
                                        watch([fields[0].f_fieldname]) &&
                                        new Date(
                                            new Date(
                                                getValues()[
                                                    fields[0].f_fieldname
                                                ]
                                            ).setDate(
                                                new Date(
                                                    getValues()[
                                                        fields[0].f_fieldname
                                                    ]
                                                ).getDate() + 1
                                            )
                                        )
                                    }
                                    onChangeHandle={(date) => {
                                        onChangeEndDate(date, unique_name);
                                    }}
                                    showerror={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default CartBasinDate;
