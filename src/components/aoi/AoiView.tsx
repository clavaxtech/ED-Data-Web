import React from "react";
import withSideNav from "../HOC/withSideNav";
import AoiSideCon from "./AoiSideCon";
import AoiMainContent from "./AoiMainContent";

const AoiView = () => {
    return (
        <>
            <AoiSideCon />
            <AoiMainContent />
          
        </>
    );
};

export default withSideNav(AoiView, true);
