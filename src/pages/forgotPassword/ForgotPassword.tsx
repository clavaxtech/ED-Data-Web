import React from "react";
import { Helmet } from "react-helmet";
import { ForgotPassowrdProps } from "../../components/models/page-props";
import ForgotPasswordView from "../../components/forgotPassword/ForgotPasswordView";
import { useSearchParams } from "react-router-dom";
import UpdatePasswordView from "../../components/forgotPassword/updatePasswordView";

const ForgotPassword = (props: ForgotPassowrdProps) => {
    const [searchParams] = useSearchParams();

    return (
        <>
            <Helmet>
                <title>Energy Domain Data</title>
            </Helmet>
            {searchParams.get("tkn") ? (
                <UpdatePasswordView />
            ) : (
                <ForgotPasswordView />
            )}
        </>
    );
};

export default ForgotPassword;
