import React from "react";

function BasinTabContent() {
    return (
        <>
        <div className="basin-block">
            <div className="basin-circle">
                <img src="images/basin-icon.svg" alt="" />
            </div>
            {/* <h3>10 Day Free Trial</h3> */}
            <div className="block-text-title">Select a Basin</div>
            <p>
                Select a basin to add all included counties and unlock your oil
                and gas data.
            </p>
            <a
                href="void:(0)"
                onClick={(e) => e.preventDefault()}
                className="learn-more"
            >
                Learn more about selecting your selection options{" "}
                <i className="fa-solid fa-angle-right"></i>
            </a>
        </div>
        <div className="gonatinalAccess">
            <div className="doller">
                <div className="graph">
                    <img src="images/s-graph.svg" alt="" />
                </div>
                <span>$999</span>
            </div>
            <div className="dollerInfo">
                <h3>Go National!<span>Get Nationwide Data Access</span></h3>
                <p>Enhance your analytics and save with Nationwide Data Access. Broaden your perspective, compare regions, and secure confident decision-making across all states.</p>
                <button className="btn btn-green width100">Get Nationwide Acccess</button>
            </div>
        </div>
        </>
    );
}

export default BasinTabContent;
