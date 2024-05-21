import React from "react";

function CountyTabContent() {
    return (
        <div className="basin-block">
            <div className="basin-circle">
                <img src="images/basin-icon.svg" alt="" />
            </div>
            <div className="block-text-title">Select a County</div>
            <p>Select county on the map to unlock your oil and gas data.</p>
            <a
                href="void:(0)"
                onClick={(e) => e.preventDefault()}
                className="learn-more"
            >
                Learn more about selecting your selection options{" "}
                <i className="fa-solid fa-angle-right"></i>
            </a>
        </div>
    );
}

export default CountyTabContent;
