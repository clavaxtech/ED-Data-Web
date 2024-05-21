import React from "react";
import PopularAoiCard from "./PopularAoiCard";
import { useAppSelector } from "../hooks/redux-hooks";

function PopularTabContent() {
    const {
        aoi: { aoi_tab_index },
    } = useAppSelector((state) => state);
    return (
        <div
            className={aoi_tab_index === 1 ? "tab-pane fade" : "d-none"}
            id="popular"
            role="tabpanel"
            aria-labelledby="popular-tab"
        >
            <div className="tabBlockContent">
                <div className="boxesList">
                    <PopularAoiCard />
                </div>
            </div>
        </div>
    );
}

export default PopularTabContent;
