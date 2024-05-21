import React from "react";
import { Helmet } from "react-helmet";
import { SignUpProps } from "../../components/models/page-props";
// import { Link } from "react-router-dom";
import SignUpView from "../../components/signUp/SignUpView"
const SignUp = (props:SignUpProps) => {
  return (
    <>
      <Helmet>
        <title>Energy Domain Data</title>
      </Helmet>
      <SignUpView />
    </>
  );
};

export default SignUp;
