import React from "react";
import Scrollbars from "react-custom-scrollbars";
import ShapefilesTabcontent from "./ShapefilesTabcontent";
import ApiTabcontent from "./ApiTabcontent";

function FilesTabContent() {
    return (
        <div className="tabSection segmentsSection">
            <Scrollbars
                // className='segmentsSection-scroll'
                autoHeightMin={0}
                renderThumbVertical={props => < div {...props} className="thumb-vertical" />}
                renderTrackVertical={props => < div {...props} className="track-vertical" />}
            >
                <div className="segmentsSection-scroll">
                    <div className="tab-content" id="myTabContentfiles">
                        <ShapefilesTabcontent />
                        <ApiTabcontent />
                    </div>
                </div>
            </Scrollbars>
        </div>
    );
}

export default FilesTabContent;
