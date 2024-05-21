import React from "react";
import { Controller } from "react-hook-form";
import { RecaptchaProps } from "../models/page-props";
import ReCAPTCHA from "react-google-recaptcha";

const RecaptchaCom = ({ control, name, myRef,errorMsg, ...rest }: RecaptchaProps) => {
    return (
        <>
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, value, ...field } }) => (
                    <ReCAPTCHA
                        sitekey={`${process.env.REACT_APP_GOOGLE_RECAPTCHA_KEY}`}
                        ref={myRef}
                        onChange={onChange}
                        {...rest}
                    />
                )}
            />
            {errorMsg && <span className={`error`}>{errorMsg}</span>}
        </>
    );
};

export default RecaptchaCom;
