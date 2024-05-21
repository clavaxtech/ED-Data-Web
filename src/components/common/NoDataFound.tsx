import React from "react";

function NoDataFound({
    ImageSrc,
    headingLabel,
    description,
    btnLabel,
    onBtnClick,
}: {
    ImageSrc: string;
    headingLabel: string;
    description: string;
    btnLabel: string;
    onBtnClick: () => void;
}) {
    return (
        <div className="noSubscriptionFoud">
            <div className="no-subscription">
                <figure>
                    <img src={ImageSrc} alt="" />
                </figure>
                <h3>{headingLabel}</h3>
                <p>{description}</p>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={onBtnClick}
                >
                    {btnLabel}
                </button>
            </div>
        </div>
    );
}

export default NoDataFound;
