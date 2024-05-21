import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import { setDefaultColumnProperties, updateTableCol } from "../../store/actions/wells-rigs-action";
import { toast } from "react-toastify";
import Scrollbars from "react-custom-scrollbars";

const ColFilterOption = () => {
    const {
        wellsAndRigs: { tableCol: wellsAndPermitsCol, rigsTableCol, productionCol, tabIndex },
    } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();
    const draggingItem = React.useRef<any>(null);
    const dragOverItem = React.useRef<any>(null);
    const onDragStart = (e: React.DragEvent<HTMLSpanElement>, index: number) =>
        (draggingItem.current = index);

    const tableCol = (tabIndex === 0 || tabIndex === 2) ? wellsAndPermitsCol : tabIndex === 1 ? rigsTableCol : productionCol;

    const onDrop = (e: React.DragEvent<HTMLSpanElement>, index: number) => {
        dragOverItem.current = index;
        const copyTablecell = [...tableCol];
        const draggingItemContent = copyTablecell[draggingItem.current];
        copyTablecell.splice(draggingItem.current, 1);
        copyTablecell.splice(dragOverItem.current, 0, draggingItemContent);
        draggingItem.current = dragOverItem.current;
        dragOverItem.current = null;
        dispatch(updateTableCol(copyTablecell));
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked, name } = e.target;
        if (!checked && tableCol.filter((item) => item.status).length === 1) {
            toast.info("Turning off last visible column is not allowed.");
            return;
        }
        dispatch(
            updateTableCol(
                tableCol.map((item) => ({
                    ...item,
                    ...(item.label === name && {
                        status: checked,
                    }),
                }))
            )
        );
    };
    return (
        <>
            <Scrollbars
                className="customTable lead-scroll"
                style={{ width: "100%" }}
                autoHeight
                autoHeightMin={0}
                autoHeightMax="32rem"
                renderThumbVertical={(props) => (
                    <div
                        {...props}
                        className="thumb-vertical"
                    />
                )}
                renderTrackVertical={(props) => (
                    <div
                        {...props}
                        className="track-vertical"
                    />
                )}
            >
                <p className="dragtext">Drag to reorder</p>
                <div className="columnList" onClick={(e) => e.stopPropagation()}>
                    {tableCol.map(({ header, label, status }, index) => (
                        <React.Fragment key={index}>
                            {/* checking the the first false status and adding the lable
                            {tableCol.findIndex(item => !item.status) === index  ? <p className="dragtext">Turn on to add</p> : <></>} */}
                            <div
                                className="item"
                                onDragStart={(e) => onDragStart(e, index)}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => onDrop(e, index)}
                                draggable
                            >


                                <div className="columnName">
                                    <span>
                                        <i className="fa-solid fa-ellipsis-vertical"></i>
                                        <i className="fa-solid fa-ellipsis-vertical"></i>
                                    </span>
                                    <div title={header}>
                                        {header.length > 12
                                            ? header.slice(0, 12) + "..."
                                            : header}
                                    </div>
                                </div>
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        checked={status}
                                        type="checkbox"
                                        id="flexSwitchCheckDefault"
                                        name={label}
                                        onChange={onChange}
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="flexSwitchCheckDefault"
                                    ></label>
                                </div>
                            </div>
                        </React.Fragment>

                    ))}
                </div>
            </Scrollbars>
            <div className="defaultset">
                <button type="button" className="btn btn-outline" onClick={() => { dispatch(setDefaultColumnProperties()) }}>Set as default</button>
                <button type="button" className="btn btn-primary">Apply</button>
            </div>
        </>
    );
};
export default ColFilterOption;
