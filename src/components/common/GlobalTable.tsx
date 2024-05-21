import React from "react";
import { ColsType, GlobalTableProps } from "../models/page-props";
import { LINE_CHART_MAX_ITEM_ALLOWED } from "../../utils/helper";

/**
const cols = [
    renderHeadTitle: () => {  // if wanted to render some component on table header
        return (<></>);
    },
    title: '', // if just wanted to render simple title on table header
    thClassName: '', // for th class
    tdClassName: '', // for td class
    render: (rowData) => {
        return ( <> </>);
    },
    renderTdForAction: (rowData, key) => { // if want to render some action dropdown with its own td
                return (<></>);
            },
},
]

 */

const GlobalTable = ({
    tableClassName,
    trClassName,
    headStyle,
    cols,
    data,
    emptyPlaceholder,
    tableRef,
    tableStyle,
    loadingMsg,
    rowId,
    graySelected,
    // showColGroup
}: GlobalTableProps) => {
    return (
        <>
            <table
                ref={tableRef}
                className={tableClassName ? tableClassName : ""}
                style={tableStyle ? tableStyle : {}}
            >
                {/* {showColGroup ? <colgroup>
                    {cols.map((headerItem: ColsType, index: number) => (
                        <col key={index} className={headerItem.colClassName}></col>
                    ))}
                </colgroup> : <></>} */}
                <thead>
                    <tr style={headStyle ? headStyle : {}}>
                        {cols.map((headerItem: ColsType, index: number) => (
                            <th
                                style={
                                    headerItem.thStyle ? headerItem.thStyle : {}
                                }
                                className={
                                    headerItem.thClassName
                                        ? headerItem.thClassName
                                        : `${headerItem.unit ? "unit" : ''}`
                                }
                                key={index}
                                onClick={() => {
                                    headerItem.onClick && headerItem.onClick();
                                }}
                                id={headerItem.thId ? headerItem.thId : ""}
                                onDragStart={(e) => {
                                    headerItem.onDragStart &&
                                        headerItem.onDragStart(e, index - 1);
                                }}
                                onDragOver={(e) => {
                                    headerItem.onDragOver &&
                                        headerItem.onDragOver(e, index - 1);
                                }}
                                onDrop={(e) => {
                                    headerItem.onDrop &&
                                        headerItem.onDrop(e, index - 1);
                                }}
                                onDragEnd={(e) => {
                                    headerItem.onDragEnd &&
                                        headerItem.onDragEnd(e, index - 1);
                                }}
                                draggable={headerItem.draggable}
                            >
                                {headerItem.renderHeadTitle
                                    ? headerItem.renderHeadTitle()
                                    : <>{headerItem.title}
                                        {headerItem.unit ? <span>({headerItem.unit})</span> : <></>}
                                    </>}{headerItem?.extraContent ? headerItem?.extraContent : ""}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data && data.length > 0 ? (
                        data.map((item, index) => (
                            <tr
                                className={`${trClassName ? trClassName : ""}${rowId && rowId === item.id ? "active" : ""
                                    } ${item?.checked ? "selected" : ""
                                    } ${index >= LINE_CHART_MAX_ITEM_ALLOWED && item.checked && graySelected ? "graySelected" : ""
                                    }`}
                                key={index}
                            >
                                {cols.map((col, key) =>
                                    col.renderTdForAction ? (
                                        col.renderTdForAction(item, key, index)
                                    ) : (
                                        <td
                                            className={
                                                col.tdClassName
                                                    ? col.tdClassName
                                                    : ""
                                            }
                                            key={key}
                                        >
                                            {col.render &&
                                                col.render(item, index)}
                                        </td>
                                    )
                                )}
                            </tr>
                        ))
                    ) : (
                        <>
                            {loadingMsg && !Array.isArray(data) ? (
                                <tr>
                                    <td colSpan={11} align="center">
                                        <b>{loadingMsg}</b>
                                    </td>
                                </tr>
                            ) : (
                                <tr>
                                    <td colSpan={11} align="center">
                                        <b>
                                            {emptyPlaceholder
                                                ? emptyPlaceholder
                                                : "No Record"}
                                        </b>
                                    </td>
                                </tr>
                            )}
                        </>
                    )}
                </tbody>
            </table>
        </>
    );
};

export default GlobalTable;
