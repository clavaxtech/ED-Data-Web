import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { SignUpViewProps } from "../models/page-props";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SignUpFormData, SignUpSubmitForm } from "../models/submit-form";
import { SignUpValidationSchema } from "../../Helper/validation";
import { useAppDispatch } from "../hooks/redux-hooks";
import { registerUser } from "../store/actions/auth-actions";
import { toast } from "react-toastify";
import InputComponent from "../common/InputComponent";
import RecaptchaCom from "../common/RecaptchaCom";

const SignUpView = (props: SignUpViewProps) => {
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        formState: { errors },
    } = useForm<SignUpSubmitForm>({
        resolver: yupResolver(SignUpValidationSchema),
    });

    const onSubmit = async (data: SignUpSubmitForm) => {
        let tempData: SignUpFormData = {
            ...data,
            terms_accepted: data?.terms_accepted ? 1 : 0,
        };

        delete tempData["confirmPassword"];
        data.account_type === "individual" && delete tempData["company_name"];
        const result = await dispatch(registerUser(tempData));
        const { status } = result || {};
        if (status === 200) {
            reset();
            navigate("/login");
        }
    };
    return (
        <div className="wapper">
            <div className="main-container">
                <div className="container">
                    <div className="row signInCon fx-aic">
                        <div className="col-sm-12 col-md-5">
                            <div className="signin-left">
                                <div className="logo">
                                    <Link to="/">
                                        <img src="images/logo.svg" alt="logo" />
                                    </Link>
                                </div>
                                <h1>
                                    Unlock the Power<br></br> of Your Oil &amp;
                                    Gas <span>Data</span>
                                </h1>
                                <p>
                                    Discover the power of well data with our
                                    advanced analytics platform. Energy Domain
                                    Data allows you to access and analyze well
                                    data from all stages of the well lifecycle,
                                    giving you insights that are not available
                                    anywhere else.
                                </p>
                                <form
                                    className="form-block"
                                    onSubmit={handleSubmit(onSubmit)}
                                    autoComplete="off"
                                    autoCapitalize="off"
                                >
                                    <div className="form-group">
                                        <InputComponent
                                            label="First Name"
                                            labelClassName="custom-label"
                                            name="first_name"
                                            placeholder="Enter your first name"
                                            register={register}
                                            errorMsg={
                                                errors.first_name?.message
                                            }
                                        />
                                    </div>
                                    <div className="form-group">
                                        <InputComponent
                                            label="Last Name"
                                            labelClassName="custom-label"
                                            name="last_name"
                                            placeholder="Enter your last name"
                                            register={register}
                                            errorMsg={errors.last_name?.message}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Account Type</label>
                                        <div className="radioBlock">
                                            <div className="radio">
                                                <input id="radio-1"  {...register("account_type")} type="radio" value={"individual"} />
                                                <label htmlFor="radio-1" className="radio-label">Individual</label>
                                            </div>

                                            <div className="radio">
                                                <input id="radio-2" {...register("account_type")} type="radio" value={"company"} />
                                                <label htmlFor="radio-2" className="radio-label">Company</label>
                                            </div>
                                        </div>
                                        <span className={`error`}>{errors.account_type?.message}</span>
                                    </div>
                                    <div className={`form-group ${watch('account_type') === "company" ? "" : "d-none"}`}>
                                        <InputComponent
                                            label="Company Name"
                                            labelClassName="custom-label"
                                            name="company_name"
                                            type={"text"}
                                            placeholder="Enter company name"
                                            register={register}
                                            errorMsg={errors.company_name?.message}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <InputComponent
                                            label="Email"
                                            labelClassName="custom-label"
                                            name="email"
                                            placeholder="Enter your email"
                                            register={register}
                                            errorMsg={errors.email?.message}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <InputComponent
                                            label="Password"
                                            type="password"
                                            labelClassName="custom-label"
                                            name="password"
                                            placeholder="Create a password"
                                            register={register}
                                            errorMsg={errors.password?.message}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <InputComponent
                                            label="Confirm Password"
                                            type="password"
                                            labelClassName="custom-label"
                                            name="confirmPassword"
                                            placeholder="Re-Enter your password"
                                            register={register}
                                            errorMsg={
                                                errors.confirmPassword?.message
                                            }
                                        />
                                    </div>
                                    <div className="form-group custom-checkbox privacy position-relative">
                                        <InputComponent
                                            type="checkbox"
                                            id="terms_accepted"
                                            name="terms_accepted"
                                            register={register}
                                        />

                                        <label
                                            htmlFor="terms_accepted"
                                            className="custom-label"
                                        >
                                            I agree to the{" "}
                                            <a
                                                href="void:(0)"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                }}
                                            >
                                                Terms &amp; Privacy
                                            </a>
                                        </label>
                                        <span className="error">
                                            {errors.terms_accepted?.message}
                                        </span>
                                    </div>
                                    <div className="form-group">
                                        <RecaptchaCom
                                            name="g-recaptcha-response"
                                            control={control}
                                            myRef={recaptchaRef}
                                            onExpired={() => {
                                                if (
                                                    recaptchaRef.current?.getValue()
                                                ) {
                                                    toast.error(
                                                        "your ReCaptcha token is expired."
                                                    );
                                                }
                                                recaptchaRef.current?.reset();
                                            }}
                                            theme="dark"
                                            errorMsg={
                                                errors["g-recaptcha-response"]
                                                    ?.message
                                            }
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary width100"
                                    >
                                        Create Account
                                    </button>
                                    <div className="have-account">
                                        Have an account?{" "}
                                        <Link to="/sign-in">Sign in</Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-7">
                            <div className="signin-right">
                                <figure>
                                    <img
                                        src="images/sign-up-img.svg"
                                        alt="Sign Up"
                                    />
                                </figure>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpView;
