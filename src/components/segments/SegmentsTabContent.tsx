import React from "react";
import Scrollbars from "react-custom-scrollbars";
import ActiveTabContent from "./ActiveTabcontent";
import ArchivedTabContent from "./ArchivedTabcontent";

function SegmentsTabContent() {
    return (
        <div className="tabSection segmentsSection">
            <Scrollbars
                // className='segmentsSection-scroll'
                autoHeightMin={0}
                renderThumbVertical={(props) => (
                    <div {...props} className="thumb-vertical" />
                )}
                renderTrackVertical={(props) => (
                    <div {...props} className="track-vertical" />
                )}
            >
                <div className="segmentsSection-scroll">
                    <div className="tab-content" id="myTabContentaoi">
                        <ActiveTabContent />
                        <ArchivedTabContent />
                    </div>
                </div>
            </Scrollbars>
        </div>
    );
}

export default SegmentsTabContent;
