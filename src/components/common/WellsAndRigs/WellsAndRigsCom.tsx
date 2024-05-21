import React, { useEffect } from "react";
import AdvancedFilter from "./AdvancedFilter";
import TabSection from "./TabSection";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import { handleDownloadColMsg, handleResizableHeight, handleShowAndHideSegmentDropDown, showHideAdvFilter } from "../../store/actions/wells-rigs-action";
import LottieAnimationforTable from "../LottieAnimationforTable";
import DeleteConfirmationModal from "../Modal/DeleteConfirmationModal";
import { toggleDownloadColMsgModal } from "../../store/actions/modal-actions";
import useWindowDimensions from "../../hooks/useWindowDimension";
// import { resetWellsAndRigsSliceToInitial } from "../../store/actions/wells-rigs-action";

function WellsAndRigsCom() {
    const {
        wellsAndRigs: { comp, fullScreen, advFilter, showTableLoader, downloadColMsg, downloadCol, resizableHeight },
        modal: { downloadColMsgModal }
    } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();
    useEffect(() => {
        return () => {
            // dispatch(resetWellsAndRigsSliceToInitial());
            advFilter && dispatch(showHideAdvFilter());
            dispatch(handleShowAndHideSegmentDropDown(false))
        };
        // eslint-disable-next-line
    }, []);
    const handleClose = () => {
        dispatch(toggleDownloadColMsgModal())
        dispatch(handleDownloadColMsg(""))
    }

    const { height } = useWindowDimensions()


    const handleDrag = (event: React.DragEvent<HTMLDivElement>) => {
        //prevent drag of table column
        sessionStorage.setItem("HeightDragging", JSON.parse(`true`))

    };

    const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
        console.log({ event })
        if (event.clientY) {
            const newHeight = (height - event.clientY - 106) / 10;
            // Here you can perform any actions you need to do when dragging ends
            dispatch(handleResizableHeight(`${newHeight < 17 ? 17 : newHeight > (height - 110) / 10 ? (height - 110) / 10 : newHeight}rem`));
            sessionStorage.getItem('HeightDragging') && sessionStorage.removeItem('HeightDragging')
            // console.log({ "test": height, "client": event.clientY, "1": parseFloat(getComputedStyle(document.documentElement).fontSize), newHeight, test1: newHeight > (height - 110) / 10 ? (height - 110) / 10 : newHeight })
        }

    };



    return (
        <div
            className={
                comp
                    ? `search-result-con ${fullScreen ? "search-result-con fullscreen" : ""
                    }`
                    : "d-none"
            }
        >
            <div
                // className="draggableTable"
                className="draggableTable"
                // style={{ border: '1px solid red' }}
                draggable
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
            ></div>
            <AdvancedFilter />
            <TabSection />
            {showTableLoader && downloadCol && <LottieAnimationforTable />}
            {downloadColMsgModal && (
                <DeleteConfirmationModal
                    show={downloadColMsgModal}
                    handleClose={handleClose}
                    confirmBtnClick={handleClose}
                    closeBtn={true}
                    content={<p>{downloadColMsg}</p>}
                />
            )}
        </div>
    );
}

export default WellsAndRigsCom;
