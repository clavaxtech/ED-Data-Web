import React, { useEffect, useLayoutEffect } from "react";
import withSideNav from "../HOC/withSideNav";
import SideContainer from "./SideContainer";
import CommonMainContent from "./CommonMainContent";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { clearProductionData, clearRigsData, clearWellsData, fetchColumnProperties, handlePageChange, handleResizableHeight, handleSelectedAoiData, toggleViewAnalytics } from "../store/actions/wells-rigs-action";
import { handleHideSearchFilter } from "../store/actions/cart-basin-to-county-actions";
import { useLocation } from "react-router-dom";
import { aoiPathname, searchPathname } from "../../utils/helper";
import { resetApiList, resetShapeFileList } from "../store/actions/files-actions";
import { clearAoiList } from "../store/actions/aoi-actions";

const CommonView = () => {

    const {
        //  For search page
        wellsAndRigs: { viewAnalytics, loadColumnProperties, selectedAoiData: { aoi_id } },
        cartBasinToCounty: { hideSearchFilter },
        files: { shapeFileListLoading, apiListLoading },
        aoi: { aoiDataLoading }
    } = useAppSelector(state => state);
    const dispatch = useAppDispatch();
    const location = useLocation()
    useLayoutEffect(() => {
        //  For search page
        viewAnalytics && location.pathname === searchPathname && dispatch(toggleViewAnalytics());
        loadColumnProperties && (location.pathname === searchPathname || location.pathname === aoiPathname) && dispatch(fetchColumnProperties())
        if (aoi_id) {
            dispatch(handleSelectedAoiData({ aoi_id: 0 }));
            dispatch(handlePageChange(1));
            dispatch(clearProductionData());
            dispatch(clearWellsData());
            dispatch(clearRigsData());
        }
        return () => {
            //  For search page
            if (location.pathname === searchPathname) {
                viewAnalytics && dispatch(toggleViewAnalytics());
                dispatch(handleHideSearchFilter(true))
            }
            // if (location.pathname === aoiPathname) {
            !shapeFileListLoading && dispatch(resetShapeFileList())
            !apiListLoading && dispatch(resetApiList())
            !aoiDataLoading && dispatch(clearAoiList())
            dispatch(handleResizableHeight(`17rem`));

            // }
        }
        // eslint-disable-next-line 
    }, [location.pathname])

    useEffect(() => {
        let myElement = document.getElementById("filterToggleMove");
        if (myElement) { // Ensure myElement is not null
            if (!hideSearchFilter && location.pathname === searchPathname) {
                myElement.classList.add("filterToggle");
                myElement.classList.remove("resetcart-map");
            } else {
                myElement.classList.remove("filterToggle");
                location.pathname === searchPathname ? myElement.classList.add("resetcart-map") : myElement.classList.remove("resetcart-map");;
            }
        }
    }, [hideSearchFilter, location.pathname])
    return (
        <>
            <SideContainer />
            <CommonMainContent />

        </>
    );
};

export default withSideNav(CommonView, true, true);
