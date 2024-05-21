import React from "react";
import { Spinner2Props } from "../models/page-props";

const Spinner = ({ white }: Spinner2Props) => (

    <div className="spinner">
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
    </div>
);
export default Spinner;
