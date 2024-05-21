import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks'
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { forecastingFilterObjValidation, forecastingFilterTypeCurveObjValidation } from '../../../Helper/validation';
import CartBasinBubble from '../../cartBasinToCounty/CartBasinBubble';
import { InputField } from '../InputField';
import { LINE_CHART_XAXIS_FILTERS, OIL, numberFormat, setFormData } from '../../../utils/helper';
import { forecastingData, handleForecastingData, handleSelectedForecastPoint } from '../../store/actions/wells-rigs-action';
import { ForecastingFormObj, ForecastingTypeCurveFormObj } from '../../models/redux-models';
import { toast } from 'react-toastify';
import moment from 'moment';

function ForecastFilter() {
    const { wellsAndRigs: { openForeCast, fullScrnAnalyticsType, analyticsData: { oil_data, gas_data, apiList, selectedForecastPoint, forecastingData: { eur, ai, b, qi, tlim, start_date_select, peakmo }, xAxisFilter, xAxisFilterCum }, } } = useAppSelector(state => state);
    const typeCurve = (xAxisFilter === LINE_CHART_XAXIS_FILTERS["Producing Time"] || xAxisFilterCum === LINE_CHART_XAXIS_FILTERS["Producing Time"]) ? true : false;

    const {
        // register,
        handleSubmit,
        // reset,
        // setValue,
        watch,
        control,
        setValue,
        reset,
        // setError,
        clearErrors,
        trigger,
        formState: { isValid }
    } = useForm<FieldValues>({
        resolver: yupResolver(typeCurve ? forecastingFilterTypeCurveObjValidation : forecastingFilterObjValidation),
        mode: "all",
    });

    const initialObj = {
        forecastType: [
            {
                id: 1,
                title: "Hyperbolic",
                active: true,
            },
            {
                id: 2,
                title: "Exponential",
                active: false,
            },
        ],
        initialProductionSolution: [
            {
                id: 1,
                title: "Variable",
                active: true,
            },
            {
                id: 2,
                title: "Fixed",
                active: false,
            },
        ],
        initialDeclineSolution: [
            {
                id: 1,
                title: "Variable",
                active: true,
            },
            {
                id: 2,
                title: "Fixed",
                active: false,
            },
        ],
        bFactorSolution: [
            {
                id: 1,
                title: "Variable",
                active: true,
            },
            {
                id: 2,
                title: "Fixed",
                active: false,
            },
        ],
        peak_solution: [
            {
                id: 1,
                title: "Variable",
                active: true,
            },
            {
                id: 2,
                title: "Fixed",
                active: false,
            },
        ]
    }
    const [state, setState] = useState(initialObj)
    const { forecastType, initialProductionSolution, initialDeclineSolution, bFactorSolution, peak_solution } = state;

    const handleForecastType = (id: number) => {
        let temp = forecastType.map((value) => {
            if (value.id === id) {
                return Object.assign(value, { active: true })
            } else {
                return Object.assign(value, { active: false })
            }
        });
        setState((prev) => ({
            ...prev,
            forecastType: temp,
        }));

        setValue('ftype', temp.filter(_item => _item.active)[0]['id'] === 1 ? "hyp" : "exp");
        setValue('bmin', "1.00");
        setValue('bmax', "2.00");
        setValue('b_fixed', "");
        id === 2 && handleBFactorSolution(1);
        trigger()
        clearErrors(['bmin', "bmax", "b_fixed"])

    };

    const handleInitialProductionSolution = (id: number) => {
        let temp = initialProductionSolution.map((value) => {
            if (value.id === id) {
                return Object.assign(value, { active: true })
            } else {
                return Object.assign(value, { active: false })
            }
        }
        );
        setState((prev) => ({
            ...prev,
            initialProductionSolution: temp,
        }));

        setValue('qi_solution', temp.filter(_item => _item.active)[0]['id'] === 1 ? "variable" : "fixed");
        setValue('qi_fixed', "");
        trigger()
        clearErrors('qi_fixed')

    };

    const handleInitialDeclineSolution = (id: number) => {
        let temp = initialDeclineSolution.map((value) => {
            if (value.id === id) {
                return Object.assign(value, { active: true })
            } else {
                return Object.assign(value, { active: false })
            }
        }
        );
        setState((prev) => ({
            ...prev,
            initialDeclineSolution: temp,
        }));
        setValue('ai_solution', temp.filter(_item => _item.active)[0]['id'] === 1 ? "variable" : "fixed")
        setValue('ai_fixed', "");
        trigger()
        clearErrors('ai_fixed')

    };

    const handleBFactorSolution = (id: number) => {
        let temp = bFactorSolution.map((value) => {
            if (value.id === id) {
                return Object.assign(value, { active: true })
            } else {
                return Object.assign(value, { active: false })
            }
        }
        );
        setState((prev) => ({
            ...prev,
            bFactorSolution: temp,
        }));

        setValue('b_solution', temp.filter(_item => _item.active)[0]['id'] === 1 ? "variable" : "fixed")
        id !== 1 && setValue('bmin', "1.00");
        id !== 1 && setValue('bmax', "2.00");
        setValue('b_fixed', "");
        trigger()
        clearErrors(['bmin', "bmax", "b_fixed"])
    };

    const handlePeakSolution = (id: number) => {
        let temp = peak_solution.map((value) => {
            if (value.id === id) {
                return Object.assign(value, { active: true })
            } else {
                return Object.assign(value, { active: false })
            }
        }
        );
        setState((prev) => ({
            ...prev,
            peak_solution: temp,
        }));

        setValue('peak_solution', temp.filter(_item => _item.active)[0]['id'] === 1 ? "variable" : "fixed");
        setValue('peak_month', "");
        trigger()
        clearErrors('peak_month')

    };


    const dispatch = useAppDispatch();
    const { auth: { user: { access_token } }, } = useAppSelector(state => state);
    const onSubmit = (data: FieldValues) => {
        if (!selectedForecastPoint) {
            toast.info("Please select the points on the charts.")
            return
        }

        let tempData: (ForecastingFormObj | ForecastingTypeCurveFormObj)[] = [];
        !typeCurve && (fullScrnAnalyticsType === OIL ? oil_data : gas_data).forEach((item) => {
            item.values.forEach((_item) => {
                tempData.push({
                    "api": apiList[0],
                    "production_date": _item.production_date,
                    "production_quantity": _item.production_quantity,
                })
            })
        })

        typeCurve && (fullScrnAnalyticsType === OIL ? oil_data : gas_data).forEach((item) => {
            item.values.forEach((_item, index) => {
                tempData.push({
                    "producing_month": index,
                    // "production_quantity": _item.production_quantity,
                    "production_quantity_ft": _item.production_quantity
                })
            })
        })

        dispatch(forecastingData(access_token, {
            ...(!typeCurve && { "data": tempData }),
            ...(!typeCurve && { "sample_data": selectedForecastPoint ? selectedForecastPoint : [] }),
            ...(typeCurve && { "prod_well": tempData }),
            ...(typeCurve && {
                "prod_select": selectedForecastPoint ? selectedForecastPoint.map((item) => ({
                    "producing_month": item.producing_month,
                    // "production_quantity": item.production_quantity,
                    "production_quantity_ft": item.production_quantity
                })) : []
            }),
            "ftype": data.ftype,
            "qi_solution": data.qi_solution,
            "ai_solution": data.ai_solution,
            // "b_solution": data.b_solution,
            ...(data.ftype !== "exp" ? { "b_solution": data.b_solution } : {}),
            ...(((data.bmin && !(bFactorSolution[0]['active'] && forecastType[1]['active'])) || data.b_solution === "fixed") && { bmin: data.b_solution === "fixed" ? 0 : Number(data.bmin) }),
            ...(((data.bmax && !(bFactorSolution[0]['active'] && forecastType[1]['active'])) || data.b_solution === "fixed") && { bmax: data.b_solution === "fixed" ? 5 : Number(data.bmax) }),
            "wlife": Number(data.wlife),
            // ...(data.ftype !== "exp" ? { "dlim": ((Number(data.dlim) * 10) / 100) } : {}),
            ...(data.ftype !== "exp" ? { "dlim": (Number(data.dlim.slice(0, data.dlim.length - 1)) / 100) } : {}),
            ...(data.qi_fixed && { qi_fixed: Number(data.qi_fixed) }),
            // ...(data.ai_fixed && { ai_fixed: ((Number(data.ai_fixed) * 1000) / 100) }),
            ...(data.ai_fixed && { ai_fixed: (Number(data.ai_fixed.slice(0, data.ai_fixed.length - 1)) / 100) }),
            ...(data.b_fixed && { b_fixed: Number(data.b_fixed) }),
            ...(typeCurve && { peak_solution: data.peak_solution }),
            ...(data.peak_month && typeCurve && { peak_month: Number(data.peak_month) }),
        }, typeCurve))
        // dispatch(handleSelectedForecastPoint({ data: null }))
    }

    const setFormValue = () => {
        setFormData({ ftype: "hyp", qi_solution: "variable", ai_solution: "variable", b_solution: "variable", dlim: "6%", bmin: "1.00", bmax: "2.00", ...(typeCurve && { peak_solution: "variable" }) }, setValue)
    }

    useEffect(() => {
        if (openForeCast) {
            setFormValue()
        }

        // eslint-disable-next-line
    }, [openForeCast])

    useEffect(() => {
        if (openForeCast && (fullScrnAnalyticsType === OIL ? oil_data.length : gas_data.length)) {
            sessionStorage.setItem("wlifMinValue", JSON.stringify(fullScrnAnalyticsType === OIL ? oil_data[0]['values'].length : gas_data[0]['values'].length))
        }
        return () => {
            sessionStorage.removeItem("wlifMinValue")
        }
        // eslint-disable-next-line
    }, [openForeCast, oil_data, gas_data])




    if (!openForeCast) {
        return <></>
    }

    return (
        <div className={`${openForeCast ? "forcastingCon" : "d-none"}`}>
            <form
                className="form-block"
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="off"
                autoCapitalize="off"
            >
                <div className="analytics-header">
                    <span>
                        {" "}
                        <img src="images/forcasting-icon.svg" alt="" />  {typeCurve ? "Type Curve" : "Forcasting"} Inputs
                    </span>{" "}
                </div>
                <div className="forcastingInside scrollSection">
                    <div className="formGroup">
                        <label htmlFor="">Well Life (months)</label>
                        <InputField
                            name={"wlife"}
                            type={"number"}
                            control={control}
                            showerror={true}
                            concatErrorMsg={watch("wlife") ? ` ${sessionStorage.getItem("wlifMinValue")}.` : ""}
                            className={
                                "form-control"
                            }
                            placeholder={
                                "Enter number of months"
                            }
                            defaultValue={''}
                        />
                    </div>
                    <div className="formGroup">
                        <ul className="types">
                            <CartBasinBubble
                                label="Forecast Type"
                                bubbleType={forecastType}
                                handleBubbleType={handleForecastType}
                            />
                        </ul>
                    </div>
                    <div className={!typeCurve ? "d-none" : "formGroup"}>
                        <ul className="types">
                            <CartBasinBubble
                                label="Peak Month Solution"
                                bubbleType={peak_solution}
                                handleBubbleType={handlePeakSolution}
                            />
                        </ul>
                    </div>
                    <div className={`formGroup ${peak_solution[1]['active'] && typeCurve ? "" : "d-none"}`}>
                        {/* <label htmlFor="">Fixed qi</label> */}
                        <InputField
                            name={"peak_month"}
                            type={"number"}
                            control={control}
                            showerror={true}
                            // twoDigitDecimal={true}
                            className={
                                "form-control"
                            }
                            placeholder={
                                "Enter fixed Peak month"
                            }
                            defaultValue={''}
                        />
                    </div>
                    <div className="formGroup">
                        <ul className="types">
                            <CartBasinBubble
                                label="Initial Production"
                                bubbleType={initialProductionSolution}
                                handleBubbleType={handleInitialProductionSolution}
                            />
                        </ul>
                    </div>
                    <div className={`formGroup ${initialProductionSolution[1]['active'] ? "" : "d-none"}`}>
                        {/* <label htmlFor="">Fixed qi</label> */}
                        <InputField
                            name={"qi_fixed"}
                            type={"number"}
                            control={control}
                            showerror={true}
                            className={
                                "form-control"
                            }
                            placeholder={
                                "Enter"
                            }
                            defaultValue={''}
                        />
                    </div>
                    <div className="formGroup">
                        <ul className="types">
                            <CartBasinBubble
                                label="Initial Monthly Decline"
                                bubbleType={initialDeclineSolution}
                                handleBubbleType={handleInitialDeclineSolution}
                            />
                        </ul>
                    </div>
                    <div className={`formGroup ${initialDeclineSolution[1]['active'] ? "" : "d-none"}`}>
                        {/* <label htmlFor="">Fixed ai</label> */}
                        <InputField
                            name={"ai_fixed"}
                            type={"number"}
                            control={control}
                            showerror={true}
                            extraInputValue={"%"}
                            className={
                                "form-control"
                            }
                            placeholder={
                                "Enter %"
                            }
                            defaultValue={''}
                        />
                    </div>
                    <div className={`formGroup ${forecastType[1]['active'] ? "d-none" : ""}`}>
                        {/* <div className={`formGroup`}> */}
                        <ul className="types">
                            <CartBasinBubble
                                label="b Factor"
                                bubbleType={bFactorSolution}
                                handleBubbleType={handleBFactorSolution}
                            />
                        </ul>
                    </div>
                    <div className={`formGroup ${(bFactorSolution[1]['active']) ? "" : "d-none"}`}>
                        {/* <label htmlFor="">Fixed b</label> */}
                        <InputField
                            name={"b_fixed"}
                            type={"number"}
                            control={control}
                            showerror={true}
                            twoDigitDecimal={true}
                            className={
                                "form-control"
                            }
                            placeholder={
                                "Enter b Factor"
                            }
                            defaultValue={''}
                        />
                    </div>
                    <div className={`formGroup ${((bFactorSolution[0]['active'] && forecastType[1]['active']) || bFactorSolution[1]['active']) ? "d-none" : ""}`}>
                        <label htmlFor="">Variable b Factor Range</label>
                        <div className="row">
                            <div className="col-md-6">
                                <InputField
                                    name={"bmin"}
                                    type={"number"}
                                    control={control}
                                    twoDigitDecimal={true}
                                    showerror={true}
                                    className={
                                        "form-control"
                                    }
                                    placeholder={
                                        "Minimum b"
                                    }
                                    defaultValue={bFactorSolution[0]['active'] ? '1.00' : ''}
                                />
                            </div>
                            <div className="col-md-6">
                                <InputField
                                    name={"bmax"}
                                    type={"number"}
                                    control={control}
                                    twoDigitDecimal={true}
                                    showerror={true}
                                    className={
                                        "form-control"
                                    }
                                    placeholder={
                                        "Maximum b"
                                    }
                                    defaultValue={bFactorSolution[0]['active'] ? '2.00' : ''}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={`formGroup ${forecastType[1]['active'] ? "d-none" : ""}`}>
                        <label htmlFor="">Limiting Annual Decline</label>
                        <InputField
                            name={"dlim"}
                            type={"number"}
                            control={control}
                            showerror={true}
                            extraInputValue={"%"}
                            className={
                                "form-control"
                            }
                            placeholder={
                                "Enter %"
                            }
                            defaultValue={''}
                        />
                    </div>
                    <div className={`formGroup ${(eur || ai || qi || b || tlim) ? "" : "d-none"}`}>
                        <label htmlFor="">Results</label>
                        <div className="resultlist">
                            <ul>
                                {/* <li>
                                    <strong>Remaining Reserves</strong>
                                    365,389.68
                                </li>
                                <li>
                                    <strong>Cum. Production</strong>
                                    239,848.63
                                </li> */}
                                <li className={typeCurve ? '' : "d-none"}>
                                    <strong>Peak Production Month</strong>
                                    {peakmo}
                                </li>
                                <li className={eur !== 0 ? '' : "d-none"}>
                                    <strong>EUR</strong>
                                    {numberFormat.format(eur)} {fullScrnAnalyticsType === OIL ? "bbl" : "MCF"}
                                </li>
                                <li className={start_date_select ? '' : "d-none"}>
                                    <strong>Forecast Start Date</strong>
                                    {moment(
                                        start_date_select
                                    ).format("MMM-DD-YYYY")}
                                </li>
                                <li className={qi !== 0 ? '' : "d-none"} >
                                    <strong>Initial Production</strong>
                                    {numberFormat.format(qi)} {fullScrnAnalyticsType === OIL ? "bbl" : "MCF"}
                                </li>
                                <li className={b !== 0 && forecastType[0]['active'] ? '' : "d-none"}>
                                    <strong>b Factor</strong>
                                    {numberFormat.format(b)}
                                </li>
                                <li className={ai !== 0 ? '' : "d-none"}>
                                    <strong>Initial Monthly Decline</strong>
                                    {numberFormat.format(ai)} %
                                </li>
                                <li className={tlim !== 0 && forecastType[0]['active'] ? '' : "d-none"}>
                                    <strong>Exponential Transition Month</strong>
                                    {numberFormat.format(tlim)}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="footer-action">
                    <button className={`btn btn-forecast ${isValid ? "active" : ""}`} type={'submit'} disabled={!isValid}>{`${typeCurve ? "Run Type Curve" : "Run Forecast"}`}</button>
                    <button className="btn btn-outline" type={"button"} onClick={() => {
                        reset()
                        dispatch(handleForecastingData({ data: null }));
                        dispatch(
                            handleSelectedForecastPoint({
                                data: null,
                                doNotConCat: true
                            })
                        );
                        setState(() => ({ ...initialObj }))
                        setFormValue()
                    }}>Clear</button>
                </div>
            </form >
        </div >
    )
}

export default ForecastFilter