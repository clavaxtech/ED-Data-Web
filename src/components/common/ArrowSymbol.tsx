import React from "react";
const ArrowSymbol = ({
    className,
    style,
    onClick,
}: {
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
}) => {
    return (
        <>
            {/* &nbsp; */}
            <span className="sort-asc" onClick={onClick}>
                <i
                    className={className}
                    style={{ ...style, cursor: "pointer" }}
                    aria-hidden="true"
                ></i>
            </span>
        </>
    );
};
export default ArrowSymbol;
