import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { ForgotPasswordValidationSchema } from "../../Helper/validation";
import { ForgotPassowrdViewProps } from "../models/page-props";
import { ForgotPasswordSubmitForm } from "../models/submit-form";
import { useAppDispatch } from "../hooks/redux-hooks";
import { forgotPassword } from "../store/actions/auth-actions";
import { toast } from "react-toastify";
import InputComponent from "../common/InputComponent";
// import SignInRight from '../svg/sign-in-right';

const ForgotPasswordView = (props: ForgotPassowrdViewProps) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ForgotPasswordSubmitForm>({
        resolver: yupResolver(ForgotPasswordValidationSchema),
    });
    const onSubmit = async (data: ForgotPasswordSubmitForm) => {
        const result = await dispatch(forgotPassword(data));
        const { status, msg } = result || {};
        if (status === 200) {
            reset();
            toast.success(
                `If an account was found with this email then password reset Instructions will be sent. Check your email for instruction on how to reset your account password`
            );
        } else {
            toast.error(msg);
        }
        navigate("/");
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
                                <h1>Password Recovery</h1>

                                <form
                                    className="form-block"
                                    onSubmit={handleSubmit(onSubmit)}
                                    autoComplete="off"
                                    autoCapitalize="off"
                                >
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
                                    <button
                                        type="submit"
                                        className="btn btn-primary width100"
                                    >
                                        Reset my password
                                    </button>
                                    <p className="mt-2">
                                        I remember it now, take me{" "}
                                        <Link to="/login">back to login</Link>
                                    </p>
                                </form>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-7">
                            <div className="signin-right">
                                <figure>
                                    <img
                                        src="images/sign-in-right.svg"
                                        alt="Sign In"
                                    />
                                    {/* <SignInRight/> */}
                                </figure>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordView;
