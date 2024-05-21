import React from "react";
import { Helmet } from "react-helmet";
import { SignInProps } from "../../components/models/page-props";
import SignInView from "../../components/signIn/SignInView";

const SignIn = (props:SignInProps) => {
  return (
    <>
      <Helmet>
        <title>Energy Domain Data</title>
      </Helmet>
      <SignInView />
    </>
  );
};

export default SignIn;
