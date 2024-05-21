import React from "react";
import { Helmet } from "react-helmet";
import CommonView from "../../components/common/CommonView";

const CommonLayout = () => {
    return (
        <>
            <Helmet>
                <title>Energy Domain Data</title>
            </Helmet>
            <CommonView />
        </>
    );
};

export default CommonLayout;
