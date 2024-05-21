import React from "react";
import SavedTabContent from "./SavedTabcontent";
import PopularTabContent from "./PopularTabContent";
import GenAoiSettTabContent from "./GenAoiSettTabContent";
import { useAppSelector } from "../hooks/redux-hooks";
import { Scrollbars } from 'react-custom-scrollbars';

function AoiTabContent() {
    const { aoi: { savedAoiData } } = useAppSelector((state) => state);
    return (
        <div className={savedAoiData.length > 0 ? "tabSection cardsection" : "tabSection"}>
            <Scrollbars
                // autoHeight
                className='cardsection-scroll'
                autoHeightMin={0}
                renderThumbVertical={props => < div {...props} className="thumb-vertical" />}
                renderTrackVertical={props => < div {...props} className="track-vertical" />}
            >
                <div className="tab-content" id="myTabContentaoi">
                    <SavedTabContent />
                    <PopularTabContent />
                    <GenAoiSettTabContent />
                </div>
            </Scrollbars>
        </div>
    );
}

export default AoiTabContent;
