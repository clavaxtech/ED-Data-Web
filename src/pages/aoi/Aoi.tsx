import React from "react";
import { Helmet } from "react-helmet";
import AoiView from "../../components/aoi/AoiView";

const Aoi = () => {
    return (
        <>
            <Helmet>
                <title>Energy Domain Data</title>
            </Helmet>
            <AoiView />
        </>
    );
};

export default Aoi;
