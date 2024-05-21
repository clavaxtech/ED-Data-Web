import React from "react";
import { SiteLoaderProps } from "../models/page-props";
import Spinner2 from "./Spinner2";
import { useAppSelector } from "../hooks/redux-hooks";

const SiteLoader = (props: SiteLoaderProps) => {
    const siteLoader = useAppSelector((state) => state.modal.siteLoader);
    if (!siteLoader) return null;
    return <Spinner2 />;
};

export default SiteLoader;
