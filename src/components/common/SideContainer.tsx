import React, { useMemo } from "react";
import AlertsTabContent from "../alert/AlertsTabContent";
import AlertsTabHeading from "../alert/AlertsTabHeading";
import { useLocation } from "react-router-dom";
import SegmentsTabHeading from "../segments/SegmentsTabHeading";
import SegmentsTabContent from "../segments/SegmentsTabContent";
import FilesTabHeading from "../files/FilesTabHeading";
import FilesTabContent from "../files/FilesTabContent";
import { useAppSelector } from "../hooks/redux-hooks";
import LottieAnimationforTable from "./LottieAnimationforTable";
import CartBasinFilterSection from "../cartBasinToCounty/CartBasinFilterSection";
import { alertsPathname, aoiPathname, filesPathname, searchPathname, segmentsPathname } from "../../utils/helper";
import AoiSideCon from "../aoi/AoiSideCon";

function SideContainer() {
    const location = useLocation();
    const { modal: { sideContentLoader } } = useAppSelector(state => state)
    const SideComponentMemo = useMemo(() => {
        switch (location.pathname) {
            case `${alertsPathname}`: return <div className="segmentsCon">
                <AlertsTabHeading />
                <div className="tabSection segmentsSection">
                    <div className="tab-content" id="myTabContentalert">
                        <AlertsTabContent />
                    </div>
                </div>
                {sideContentLoader && <LottieAnimationforTable />}
            </div>
            case `${segmentsPathname}`: return <div className="segmentsCon">
                <SegmentsTabHeading />
                <SegmentsTabContent />
                {sideContentLoader && <LottieAnimationforTable />}
            </div>

            case `${filesPathname}`: return <div className="segmentsCon">
                <FilesTabHeading />
                <FilesTabContent />
                {sideContentLoader && <LottieAnimationforTable />}
            </div>;

            case `${searchPathname}`: return <CartBasinFilterSection />;

            case `${aoiPathname}`: return <AoiSideCon />

            default: return <></>;
        }
        // eslint-disable-next-line 
    }, [location.pathname, sideContentLoader])
    return (
        <>
            {SideComponentMemo}
        </>
    );
}

export default SideContainer;
