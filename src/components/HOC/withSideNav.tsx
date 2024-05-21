import React, { useRef, useEffect } from 'react';
import SideNav from "../settings/SideNav";

function withSideNav<T extends {}>(
    Component: React.ComponentType<T>,
    hideSideBar?: boolean,
    CartSearchTabContent?: boolean,
) {
    return (props: T) => {
        const blockRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            // Perform DOM manipulation to add ref to the div with id filterToggleMove
            if (blockRef.current) {
                // Here we can access and manipulate the DOM element directly
                sessionStorage.setItem("blockRefOffSet", blockRef.current.offsetWidth.toString())
            }
        }, []); // Run once on component mount

        return (
            <div className="wrapper">
                <div className="main-container">
                    <div className={`CartSearchCon CartSearchTabContent`} id={"filterToggleMove"} ref={blockRef}>
                        <SideNav hideSideBar={hideSideBar} />
                        <Component {...props} />
                    </div>
                </div>
            </div>
        );
    };
}

export default withSideNav;
