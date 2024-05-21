import React, { useEffect } from "react";
import AoiTabHeading from "./AoiTabHeading";
import AoiTabContent from "./AoiTabContent";
import SettingsSidebar from "./SettingsSidebar";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import {
    clearAoiGenTabNotiData,
    handleAoiTabIndex,
} from "../store/actions/aoi-actions";

function AoiSideCon() {
    const {
        aoi: { showAoiSideCon },
    } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();
    useEffect(() => {
        return () => {
            dispatch(handleAoiTabIndex(0));
            dispatch(clearAoiGenTabNotiData());
        };
        // eslint-disable-next-line
    }, []);
    return (
        <div className={showAoiSideCon ? "aoiCon" : "d-none"}>
            <AoiTabHeading />
            <AoiTabContent />
            <SettingsSidebar />
        </div>
    );
}

export default AoiSideCon;
