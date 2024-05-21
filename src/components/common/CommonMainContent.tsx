import React, { useEffect, useRef, useState } from "react";
// import SearchComponent from "./SearchComponent";
import { useLocation, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import {
    clearAoiNameSelForEdit,
    handleUsingMapCreateAoi,
    // clearAoiNameSelForEdit,
    toggleAoiSideCon,
} from "../store/actions/aoi-actions";
import { MapComponent, MapType } from "./MapComponent";
import WellsAndRigsCom from "./WellsAndRigs/WellsAndRigsCom";
import AnalyticsRightSidebar from "../aoi/AnalyticsRightSidebar";
import { aoiPathname, searchPathname } from "../../utils/helper";
import { getWellsAndPermitList, handleResizableWidth, handleShowAndHideSegmentDropDown, handleShowAndHideTable, showHideAdvFilter, showHideColProperties, showHideCsvDownOpt, toggleViewAnalytics } from "../store/actions/wells-rigs-action";
import {
    // cartBasinSearchList,
    // clearCartBasinSearchList, 
    handleHideSearchFilter
} from "../store/actions/cart-basin-to-county-actions";
// import CartBasinSearchList from "../cartBasinToCounty/CartBasinSearchList";
import { highlightSelectedWell } from "../map/redux/locations";
import AnalyticsFullScreen from "./AnalyticsFullScreen";
import { Link } from "react-router-dom";
import { toggleCreateAoiModal } from "../store/actions/modal-actions";
import { toast } from "react-toastify";
import CreateAoiModal from "../aoi/CreateAoiModal";

function CommonMainContent() {
    const location = useLocation();
    const {
        auth: {
            user: { access_token },
            isAuthenticated
        },
        aoi: {
            showAoiSideCon,
            max_allowed_aoi,
            usingMapCreateAoi,
            savedAoiData,
            aoiNameSelForEdit: { aoi_name },
            previousSearchFilter
        },
        modal: { createAoiModal },
        wellsAndRigs: {
            tabIndex,
            wellsData: { wellsDataLoading, data: wellsDataList, },
            permitsData: { permitsDataLoading, data: rigsDataList, },
            rigsData: { rigsDataLoading, data: permitDataList, },
            productionData: { productionDataLoading, data: productionDataList, },
            selectedAoiData: { aoi_id: id },
            // filterSearch,
            wellsPage,
            permitsPage,
            rigsPage,
            productionPage,
            // sort_by,
            // sort_order,
            advFilter,
            viewAnalytics,
            colProperties, csvDownOpt,
            showSegmentDropDown,
            showTable,
            resizableWidth,
            downloadCol,
            allCol,
            tableCol,
            rigsTableCol,
            productionCol,
            uid
        },
        cartBasinToCounty: { hideSearchFilter },
        esri: { lastAddedGeom, lastAddedGeomCRS, featuresForStatistics
        }
    } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();
    const [searchParams] = useSearchParams();
    const highlightId = searchParams.get('id');
    const col = tabIndex === 0 || tabIndex === 2 ? tableCol : tabIndex === 1 ? rigsTableCol : productionCol;

    let data =
        tabIndex === 0
            ? wellsDataList
            : tabIndex === 1
                ? rigsDataList
                : tabIndex === 2 ? permitDataList : productionDataList;
    useEffect(() => {
        if (location.pathname === aoiPathname) {
            advFilter && dispatch(showHideAdvFilter());
            viewAnalytics && dispatch(toggleViewAnalytics())
        }
        //for search page, we are reading the id and removing it from session storage
        if (location.pathname === searchPathname && highlightId && isAuthenticated) {
            dispatch(highlightSelectedWell({ well_id: highlightId }));
            sessionStorage.removeItem('highlightWellId');
        }
        //  For aoi page
        if (location.pathname !== aoiPathname) {
            !showAoiSideCon && dispatch(toggleAoiSideCon());
        }
        // eslint-disable-next-line 
    }, [location.pathname])

    useEffect(() => {
        if (location.pathname === aoiPathname) {
            const formData = uid.length ? {
                uid: uid.filter((_id) => (!JSON.stringify(data).includes(_id) && `${_id}`))
            } : {
                ...(previousSearchFilter ? JSON.parse(previousSearchFilter) : {}),
                page: tabIndex === 0 ? wellsPage : tabIndex === 1 ? rigsPage : tabIndex === 2 ? permitsPage : productionPage,
                ...(tabIndex !== 0 && { search_type: tabIndex === 1 ? "rigs" : tabIndex === 2 ? "permit" : "production" }),
                ...(id && { aoi_id: id }),
                // ...(filterSearch && { search_param: filterSearch }),
                // ...(sort_order && { sort_order }),
                // ...(sort_by && { sort_by }),
                ...(downloadCol && { download: downloadCol }),
                ...(downloadCol && { download_column: allCol ? [...col.map((_item) => "dbKeyName" in _item ? _item.dbKeyName : _item.label), Number(tabIndex) === 1 ? "rig_id" : Number(tabIndex) === 0 ? "uid" : "id"] : [...col.filter(item => item.status).map((_item) => "dbKeyName" in _item ? _item.dbKeyName : _item.label), Number(tabIndex) === 1 ? "rig_id" : Number(tabIndex) === 0 ? "uid" : "id"] }),
                // ...(featuresForStatistics.length && ({
                //     uid: featuresForStatistics.slice(0, 1000).filter((_id) => (!JSON.stringify(data).includes(_id) && `${_id}`))
                // }))
            };
            if ((wellsDataLoading || downloadCol) && tabIndex === 0) {
                dispatch(
                    getWellsAndPermitList(
                        access_token,
                        {
                            ...formData
                        },
                        (wellsPage === 1 || downloadCol) ? true : false
                    )
                );
                !downloadCol && dispatch(
                    getWellsAndPermitList(
                        access_token,
                        {
                            ...formData,
                            search_type: 'well_count_by_county'
                        },
                        false
                    )
                );
                // downloadCol && dispatch(handleDownloadCol({ downloadCol: 0, allCol: 0 }));
                return;
            }
            if ((permitsDataLoading || downloadCol) && tabIndex === 2) {
                dispatch(
                    getWellsAndPermitList(
                        access_token,
                        {
                            ...formData
                        },
                        (permitsPage === 1 || downloadCol) ? true : false
                    )
                );
                !downloadCol && dispatch(
                    getWellsAndPermitList(
                        access_token,
                        {
                            ...formData,
                            search_type: 'well_count_by_county'
                        },
                        false
                    )
                );
                // downloadCol && dispatch(handleDownloadCol({ downloadCol: 0, allCol: 0 }));
                return;
            }
            if (rigsDataLoading && tabIndex === 1) {
                dispatch(
                    getWellsAndPermitList(
                        access_token,
                        {
                            ...formData
                        },
                        (rigsPage === 1 || downloadCol) ? true : false
                    )
                );
                !downloadCol && dispatch(
                    getWellsAndPermitList(
                        access_token,
                        {
                            ...formData,
                            search_type: 'well_count_by_county'
                        },
                        false
                    )
                );
                // downloadCol && dispatch(handleDownloadCol({ downloadCol: 0, allCol: 0 }));
                return;
            }
            if (productionDataLoading && tabIndex === 3) {
                dispatch(
                    getWellsAndPermitList(
                        access_token,
                        {
                            ...formData
                        },
                        (productionPage === 1 || downloadCol) ? true : false
                    )
                );
                !downloadCol && dispatch(
                    getWellsAndPermitList(
                        access_token,
                        {
                            ...formData,
                            search_type: 'well_count_by_county'
                        },
                        false
                    )
                );
                // downloadCol && dispatch(handleDownloadCol({ downloadCol: 0, allCol: 0 }));
                return;
            }
        }
        // eslint-disable-next-line
    }, [wellsDataLoading, permitsDataLoading, tabIndex, id, rigsDataLoading, productionDataLoading, location.pathname, downloadCol]);

    // const getSearchList = (value: string) => {
    //     dispatch(
    //         cartBasinSearchList(access_token, {
    //             category: "basin", // or county
    //             search: value,
    //         })
    //     );
    // };

    // const onSearchChange = (value: string) => {
    //     if (value?.length === 0) {
    //         dispatch(clearCartBasinSearchList());
    //         return;
    //     }

    //     if (value && value.length >= 2) {
    //         dispatch(clearCartBasinSearchList());
    //         getSearchList(value);
    //     }
    // };

    // const onSearchFocus = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    //     const { value } = e.target;
    //     if (
    //         // basinSearchList.length === 0 &&
    //         // countySearchList.length === 0 &&
    //         value &&
    //         value?.length >= 2
    //     ) {
    //         dispatch(clearCartBasinSearchList());
    //         getSearchList(value);
    //     }
    // };

    // const blockRef = useRef<HTMLDivElement>(null);
    const draggableRef = useRef<HTMLDivElement>(null);
    const [draggable, setDraggable] = useState<boolean>(false);
    const [offsetX, setOffsetX] = useState<number>(0);
    // const [resizable1Width, setResizable1Width] = useState<number>(70);

    useEffect(() => {
        if (draggable) {
            document.addEventListener("mousemove", handleDrag);
            document.addEventListener("mouseup", stopDrag);
        }
        return () => {
            document.removeEventListener("mousemove", handleDrag);
            document.removeEventListener("mouseup", stopDrag);
        };
        // eslint-disable-next-line
    }, [draggable]);
    const startDrag = (event: React.MouseEvent<HTMLDivElement>) => {
        const draggableElement = draggableRef.current;
        if (draggableElement) {
            setDraggable(true);
            const offsetX = event.clientX - draggableElement.getBoundingClientRect().left;
            setOffsetX(offsetX);
            // Disable text selection and user-select while dragging
            document.body.style.userSelect = 'none';
            // // Attach mousemove event listener
            // document.addEventListener("mousemove", handleDrag);
        }
    };

    const widthRef = useRef(0)
    const handleDrag = (event: MouseEvent) => {
        let temp = sessionStorage.getItem('blockRefOffSet');
        if (draggable && temp) {
            const blockWidth = Number(temp);
            const newResizable1Width = ((event.clientX - offsetX) / blockWidth) * 100;
            showTable && dispatch(handleShowAndHideTable(!showTable))
            // setResizable1Width(Math.max(0, Math.min(newResizable1Width, 100)));
            // dispatch(handleResizableWidth(Math.max(0, Math.min(newResizable1Width, 100))));
            widthRef.current = Math.max(0, Math.min(newResizable1Width, 100));
        }
    };


    const stopDrag = () => {
        // Enable text selection and user-select after dragging
        document.body.style.userSelect = 'auto';
        setDraggable(false);
        dispatch(handleResizableWidth(widthRef.current));


        // // Remove mousemove event listener
        // document.removeEventListener("mousemove", handleDrag);
    };

    // useEffect(() => {
    //     if (viewAnalytics) {
    //         setResizable1Width(70)
    //     } else {
    //         setResizable1Width(100)
    //     }

    // }, [viewAnalytics])

    useEffect(() => {
        if (lastAddedGeom && lastAddedGeomCRS) {
            if (!(savedAoiData.length < max_allowed_aoi) && location.pathname === aoiPathname) {
                toast.info(`Each company is limited to ${Number(
                    max_allowed_aoi
                )} AOI’s per user. If you would like to continue to add more shapes, please alter your existing shapefiles and re-import them as an AOI.`)
                return
            }
            dispatch(handleUsingMapCreateAoi(true));
            dispatch(toggleCreateAoiModal());
        }
        // eslint-disable-next-line
    }, [JSON.stringify(lastAddedGeom),
    // eslint-disable-next-line
    JSON.stringify(lastAddedGeomCRS)])

    useEffect(() => {
        !createAoiModal && usingMapCreateAoi && dispatch(handleUsingMapCreateAoi(false));
        // eslint-disable-next-line
    }, [createAoiModal])


    return (
        <>

            <div className="cart-map"
                id="Resizable1"
                style={{
                    ...(viewAnalytics && { width: `${resizableWidth}%` }),
                }}
                onClick={() => {
                    if (location.pathname === searchPathname) {
                        //this is to close the menu when use click outside
                        colProperties && dispatch(showHideColProperties());
                        csvDownOpt && dispatch(showHideCsvDownOpt());
                        showSegmentDropDown && dispatch(handleShowAndHideSegmentDropDown(false))
                    }
                }}
            >
                <AnalyticsFullScreen />
                <figure>
                    {location.pathname === searchPathname ? <div className="expandcollapsefilterbtn" onClick={((e) => {
                        e.preventDefault();
                        if (!hideSearchFilter) {
                            viewAnalytics && dispatch(toggleViewAnalytics());
                            dispatch(handleHideSearchFilter(true))
                        } else {
                            dispatch(handleHideSearchFilter(false));
                        }
                    })}>
                        {!hideSearchFilter ? <img src="images/angle-left.png" alt="" /> : <img src="images/angle-right.png" alt="" />}
                    </div> : <></>}
                    <MapComponent mapType={MapType.AOI} allowCreateAoI={location.pathname === aoiPathname ? true : false} />
                </figure>
                <div className={!showAoiSideCon ? "expand-btn" : "d-none"}>
                    <div onClick={(e) => {
                        e.preventDefault()
                        viewAnalytics && dispatch(toggleViewAnalytics())
                        dispatch(toggleAoiSideCon());
                    }}>
                        <a href="void:(0)">
                            <i className="fa-solid fa-arrow-right"></i>{" "}
                            <span>Expand</span>
                        </a>
                    </div>
                </div>
                {(!showAoiSideCon && aoi_name) ? (
                    <div className="aoi-sidebar-btn">
                        <ul>
                            <li>
                                <div className="saveCart">
                                    <h3>
                                        <span>Editing</span>
                                        {aoi_name}
                                    </h3>
                                    <div className="action-btn">
                                        <Link to="">
                                            <img
                                                src="images/aoi-icons7.svg"
                                                alt=""
                                            />
                                        </Link>
                                        <Link to="">
                                            <img
                                                src="images/aoi-icons8.svg"
                                                alt=""
                                            />
                                        </Link>
                                        <Link to="">
                                            <img
                                                src="images/aoi-icons9.svg"
                                                alt=""
                                            />
                                        </Link>
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() => {
                                                dispatch(clearAoiNameSelForEdit());
                                                dispatch(toggleAoiSideCon());
                                            }}
                                        >
                                            <i className="fa-regular fa-floppy-disk"></i>{" "}
                                            Save
                                        </button>
                                    </div>
                                    <div className="formGroup">
                                        <label>Buffer Distance (miles)</label>
                                        <input type="text" className="form-control" placeholder="Enter miles" />
                                    </div>
                                    <p className="small">Add a buffer around your AOI</p>
                                </div>
                            </li>
                            {/* <li>
                                <Link to="">
                                    <img src="images/aoi-icons3.svg" alt="" />
                                </Link>
                            </li> */}
                        </ul>
                    </div>
                ) : <></>}
                {/* hiding the search box as discussed in meeting */}
                {/* {(showAoiSideCon || location.pathname === searchPathname || !aoi_name) ? (
                    <div className="search-header-form">
                        <div className="search-form">
                            <SearchComponent
                                placeholder={`Permian Basin`}
                                onSearchChange={onSearchChange}
                                onSearchBtnClick={getSearchList}
                                onFocus={onSearchFocus}
                            />
                            {location.pathname === searchPathname ? <CartBasinSearchList /> : <></>}
                        </div>
                    </div>
                ) : <></>} */}
                {location.pathname === searchPathname || location.pathname === aoiPathname ? <WellsAndRigsCom /> : <></>}
            </div>


            {/* {viewAnalytics ? <> */}
            {/* <div
                    ref={draggableRef}
                    onMouseDown={startDrag}
                    className="Draggable"
                ></div> */}
            {/* {(viewAnalytics && (location.pathname === searchPathname || location.pathname === aoiPathname)) ? <AnalyticsRightSidebar resizableWidth={resizableWidth} startDrag={startDrag} draggableRef={draggableRef} /> : <></>} */}
            {((location.pathname === searchPathname || location.pathname === aoiPathname)) ? <AnalyticsRightSidebar resizableWidth={resizableWidth} startDrag={startDrag} draggableRef={draggableRef} /> : <></>}
            {/* </> : <></>} */}


            {/* create aoi modal */}
            {
                createAoiModal && location.pathname !== aoiPathname && (
                    <CreateAoiModal />
                )
            }
        </>
    );
}

export default CommonMainContent;
