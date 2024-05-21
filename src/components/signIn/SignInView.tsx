import React, { useEffect, useLayoutEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { SignInValidationSchema } from "../../Helper/validation";
import { SignInViewProps } from "../models/page-props";
import { SignInSubmitForm } from "../models/submit-form";
import { useAppDispatch } from "../hooks/redux-hooks";
import { activateNewUser, login } from "../store/actions/auth-actions";
import { toast } from "react-toastify";
import parse from "html-react-parser";
import InputComponent from "../common/InputComponent";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import { handleFreeTrialEndModal } from "../store/actions/modal-actions";

const SignInView = (props: SignInViewProps) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [rememberMeValue, setRememberMeValue] = useState(true);

    const [state] = useState({
        user_id: Number(searchParams.get("u")),
        tkn: searchParams.get("tkn"),
    });
    const { user_id, tkn } = state;

    const activateUser = async () => {
        const result = await dispatch(
            activateNewUser({
                user_id,
                token: tkn,
            })
        );
        const { msg, status } = result || {};
        if (status === 200) {
            msg === `Account already activated.`
                ? toast.info(msg)
                : toast.success(`Your email is verified`);
        } else {
            toast.error(msg);
            navigate("/");
        }
    };

    useLayoutEffect(() => {
        if (user_id && tkn) {
            dispatch(activateUser);
        }
        // eslint-disable-next-line
    }, []);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<SignInSubmitForm>({
        resolver: yupResolver(SignInValidationSchema),
    });

    const onSubmit = async (data: SignInSubmitForm) => {
        const result = await dispatch(login({ ...data, rememberMe: rememberMeValue }));
        const { status, msg, data: resData } = result || {};
        if (status === 200) {
            // toast.success(`${msg}`);
            reset();
            // to show free trial end date reaching pop up
            // if ("trial_remaining_days" in resData && resData.trial_remaining_days === 0 && resData.company_configs.free_trial_period_enabled && !resData.company_configs.is_trial_never_end) {
            //     dispatch(handleFreeTrialEndModal(true))
            // }
            if (resData.company_configs.trial_expired) {
                dispatch(handleFreeTrialEndModal(true))
            }

            if (sessionStorage.getItem('highlightWellId')) {
                navigate(`/search?id=${sessionStorage.getItem('highlightWellId')}`);
                return
            }
            if (
                "pass_change_required" in resData &&
                resData.pass_change_required
            ) {
                navigate("/update-password");
                return
            }
            "subscription_status" in resData &&
                resData.subscription_status === "active"
                ? navigate("/search")
                : navigate("/cart-select-basin");
        } else {
            toast.error(status === 422 ? <div>{parse(msg)}</div> : msg, {
                autoClose: 10000,
            });
        }
    };
    useEffect(() => {
        reset();
        setValue("rememberMe", rememberMeValue);
        if (Cookies.get("email")) {
            const bytes = CryptoJS.AES.decrypt(Cookies.get("email") as string, `${process.env.REACT_APP_ENCRYPT_DECRYPT_KEY}`);
            const originalText = bytes.toString(CryptoJS.enc.Utf8);
            setValue("email", originalText);
        }
        if (Cookies.get("password")) {
            const bytes = CryptoJS.AES.decrypt(Cookies.get("password") as string, `${process.env.REACT_APP_ENCRYPT_DECRYPT_KEY}`);
            const originalText = bytes.toString(CryptoJS.enc.Utf8);
            setValue("password", originalText);
        }
        // eslint-disable-next-line
    }, []);
    return (
        <div className="wapper">
            <div className="main-container">
                <div className="container">
                    <div className="row signInCon fx-aic fx-jcc" style={{ "minHeight": "100vh" }}>
                        <div className="col-sm-12 col-md-5">
                            <div className="signin-left">
                                <div className="logo">
                                    <Link to="/">
                                        <img src="images/logo.svg" alt="logo" />
                                    </Link>
                                </div>
                                <h1>
                                    <span>Welcome</span> Back
                                </h1>
                                {/* <p>
                                    Discover the power of well data with our
                                    advanced analytics platform. Energy Domain
                                    Data allows you to access and analyze well
                                    data from all stages of the well lifecycle,
                                    giving you insights that are not available
                                    anywhere else.
                                </p> */}
                                <form
                                    className="form-block width100"
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
                                    <div className="form-group">
                                        <InputComponent
                                            label="Password"
                                            type="password"
                                            name="password"
                                            placeholder="Enter your password"
                                            register={register}
                                            errorMsg={errors.password?.message}
                                        />
                                    </div>
                                    <div className="form-group remember">
                                        <div className="custom-checkbox">
                                            <InputComponent
                                                type="checkbox"
                                                name="rememberMe"
                                                className="checkmark"
                                                id="rem"
                                                checked={rememberMeValue}
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>
                                                ) =>
                                                    setRememberMeValue(
                                                        e.target.checked
                                                    )
                                                }
                                                register={register}
                                            />
                                            <label
                                                htmlFor="rem"
                                                className="custom-label"
                                            >
                                                {" "}
                                                Remember me
                                            </label>
                                        </div>
                                        <Link to="/forgot-password">
                                            Forgot Password
                                        </Link>
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary width100"
                                    >
                                        Sign In
                                    </button>
                                    <div className="have-account">
                                        Don't have an account?{" "}
                                        <Link to="/sign-up">Sign Up</Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                        {/* <div className="col-sm-12 col-md-7">
                            <div className="signin-right">
                                <figure>
                                    <img
                                        src="images/sign-in-right.svg"
                                        alt="Sign In"
                                    />
                                </figure>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInView;
