import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { UpdatePasswordValidationSchema } from "../../Helper/validation";
import { UpdatePassowrdViewProps } from "../models/page-props";
import {
    UpdatePasswordSubmitForm,
    UpdatePasswordSubmitFormData,
} from "../models/submit-form";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import {
    handlePassChangeReq,
    updatePassword,
    verifyResetPasswordToken,
} from "../store/actions/auth-actions";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import {
    setPasswordInviteUser,
    verifyInviteMemberToken,
} from "../store/actions/members-setting-actions";
import InputComponent from "../common/InputComponent";
import RecaptchaCom from "../common/RecaptchaCom";
import Cookies from "js-cookie";
// import SignInRight from '../svg/sign-in-right';

const UpdatePasswordView = (props: UpdatePassowrdViewProps) => {
    const { usedForInviteMember, forcePassReset } = props;
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const { auth: { base_user_id } } = useAppSelector((state) => state);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [searchParams] = useSearchParams();
    const [state, setState] = useState({
        tkn: searchParams.get("tkn"),
        user_id: "",
        ref_id: "",
    });
    const { tkn, user_id, ref_id } = state;

    const verifyPasswordToken = async (tkn: string) => {
        const result = await dispatch(verifyResetPasswordToken(tkn));
        const { msg, status, user_id } = result || {};
        if (status === 200) {
            setState((prev) => ({ ...prev, ...(user_id && { user_id }) }));
        } else {
            toast.error(msg);
            navigate("/forgot-password");
        }
    };

    useLayoutEffect(() => {
        if (tkn) {
            if (usedForInviteMember) {
                dispatch(verifyInviteMemberToken(tkn)).then((result) => {
                    const { msg, status, ref_id } = result || {};
                    if (status === 200) {
                        setState((prev) => ({
                            ...prev,
                            ...(ref_id && { ref_id }),
                        }));
                    } else {
                        toast.error(msg);
                        navigate("/");
                    }
                });
                return;
            }
            verifyPasswordToken(tkn);
        }
        // eslint-disable-next-line
    }, []);

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<UpdatePasswordSubmitForm>({
        resolver: yupResolver(UpdatePasswordValidationSchema),
    });
    const onSubmit = async (data: UpdatePasswordSubmitFormData) => {
        let tempData = data;
        if (usedForInviteMember) {
            if (!ref_id) {
                toast.error(
                    `Error processing request. Please try again or contact our technical support team.`
                );
                navigate("/");
            }
            delete tempData["confirmPassword"];
            dispatch(
                setPasswordInviteUser({
                    password: tempData.password,
                    ref_id,
                    "g-recaptcha-response":
                        tempData["g-recaptcha-response"] ?? "",
                })
            ).then((result) => {
                const { msg, status } = result || {};
                if (status === 200) {
                    reset();
                    toast.success(msg);
                    navigate("/login");
                } else {
                    toast.error(msg);
                    navigate("/");
                }
            });
            return;
        } else {
            if (!user_id) {
                toast.error(
                    `Error processing request. Please try again or contact our technical support team.`
                );
                navigate("/forgot-password");
            }
            delete tempData["confirmPassword"];
            delete tempData["g-recaptcha-response"];
            tempData = { ...tempData, ...(!base_user_id && { user_id }), ...(base_user_id && { base_user_id }) };
            const result = await dispatch(updatePassword(tempData));
            const { status, msg } = result || {};
            if (status === 200) {
                if (base_user_id) {
                    dispatch(handlePassChangeReq({ pass_change_required: false, base_user_id: "" }))
                }
                reset();
                toast.success(msg);
                Cookies.get("email") && Cookies.remove("email");
                Cookies.get("password") && Cookies.remove("password");
                navigate("/login");
            } else {
                toast.error(msg);
                navigate("/");
            }
            return;
        }
    };

    useEffect(() => {
        if (base_user_id) {
            setState((prev) => ({ ...prev, user_id: base_user_id }))
        }
    }, [base_user_id]);

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
                                    {(usedForInviteMember || forcePassReset)
                                        ? "Set Your Password"
                                        : "Password Recovery"}
                                </h1>

                                <form
                                    className="form-block"
                                    onSubmit={handleSubmit(onSubmit)}
                                    autoComplete="off"
                                    autoCapitalize="off"
                                >
                                    <div className="form-group">
                                        <InputComponent
                                            label="Password"
                                            labelClassName="custom-label"
                                            type="password"
                                            name="password"
                                            placeholder="Create a password"
                                            register={register}
                                            errorMsg={errors.password?.message}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <InputComponent
                                            label="Confirm Password"
                                            labelClassName="custom-label"
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="Re-Enter your password"
                                            register={register}
                                            errorMsg={
                                                errors.confirmPassword?.message
                                            }
                                        />
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
                                        {(usedForInviteMember || forcePassReset)
                                            ? "Set Password"
                                            : " Reset my password"}
                                    </button>
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

export default UpdatePasswordView;
