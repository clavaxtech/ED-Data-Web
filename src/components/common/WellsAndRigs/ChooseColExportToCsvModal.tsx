import React, { useEffect, useState } from "react";
import GlobalModal from "../GlobalModal";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import { handleDownloadCol, toggleChooseColExportToCsvModal } from "../../store/actions/wells-rigs-action";
import { tableColObje } from "../../models/redux-models";
import { GroupBase, OptionsOrGroups } from "react-select";
import { OptionType } from "../../models/submit-form";
import { useForm, useWatch } from "react-hook-form";
import { ChooseColExportToCsvModalValidation } from "../../../Helper/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import AsyncSelect from "../AsyncSelect";
import { CSVLink } from "react-csv";
import Scrollbars from "react-custom-scrollbars";
import { handleFreeTrialDownAlertMsgModal } from "../../store/actions/modal-actions";
// import { logUserAction } from "../../store/actions/auth-actions";
import { actionType } from "../../../utils/helper";

export interface FormData {
    col: OptionType[] | null
}


function ChooseColExportToCsvModal() {
    const {
        wellsAndRigs: {
            tableCol,
            chooseColExportToCsvModal,
            wellsData: { data: wellsDataList, total_count: wellsTotalCount, page_size: wellPageSize },
            rigsData: { data: rigsDataList, total_count: rigsTotalCount, page_size: rigsPageSize },
            permitsData: { data: permitDataList, total_count: permitTotalCount, page_size: permitPageSize },
            productionData: { data: productionDataList, total_count: productionTotalCount, page_size: productionPageSize },
            tabIndex,
            rigsTableCol,
            productionCol
        },
        auth: { user: { company_configs: { download_enabled, free_trial_period_enabled } } },
        aoi: { previousSearchFilter }
    } = useAppSelector((state) => state);
    let count = tabIndex === 0 ? wellsTotalCount : tabIndex === 1 ? rigsTotalCount : tabIndex
        === 2 ? permitTotalCount : productionTotalCount

    const dispatch = useAppDispatch();
    const [state, setState] = useState<{
        col: tableColObje[]
    }>({
        col: []
    })
    const { col } = state;

    const {
        control,
        handleSubmit,
        reset,
        // resetField,
        setValue
    } = useForm<FormData>({
        resolver: yupResolver(ChooseColExportToCsvModalValidation),
    });

    useEffect(() => {
        reset()
        let col = tabIndex === 0 || tabIndex === 2 ? tableCol : tabIndex === 1 ? rigsTableCol : productionCol
        setState((prev) => ({
            ...prev,
            col
        }))
        // let selectedCol: FormData['col'] = [];
        // col.forEach((item) => {
        //     !item.status && selectedCol.push({
        //         label: item.header as string, value: item.header as string
        //     })
        // })
        // setValue("col", selectedCol)
        // eslint-disable-next-line 
    }, [])
    const handleClose = () => {
        reset()
        dispatch(toggleChooseColExportToCsvModal())
    }

    const loadOption = ((search: string,
        prevOptions: OptionsOrGroups<OptionType, GroupBase<OptionType>>) => {
        let temp: OptionType[] = []
        col.map((item) => {
            return !item.status && temp.push({
                label: item.header,
                value: item.header
            })
        })
        return {
            options: search ? [
                ...temp.filter((item) =>
                    (item.value as string).toLowerCase().includes(search)
                ),
            ] : temp,
            hasMore: false
        }
    })

    const onSubmit = (data: FormData) => {
        // dispatch(handleDownloadCol(1))
    }
    const colValue = useWatch({ control, name: 'col' })

    let data =
        tabIndex === 0
            ? (wellsDataList || []).map((item, index) => ({
                ...item,
                // id: index + 1,
            }))
            : tabIndex === 1
                ? (rigsDataList || []).map((item, index) => ({
                    ...item,
                    // id: index + 1,
                }))
                : tabIndex === 2 ? (permitDataList || []).map((item, index) => ({
                    ...item,
                    // id: index + 1,
                })) : (productionDataList || []).map((item, index) => ({
                    ...item,
                    // id: index + 1,
                }));
    let pageSize = tabIndex === 0 ? wellPageSize : tabIndex === 2 ? permitPageSize : tabIndex === 1 ? rigsPageSize : productionPageSize;

    useEffect(() => {
        if (colValue) {
            setState((prev) => ({
                ...prev, col: prev.col.map((item) => {
                    return JSON.stringify(colValue).includes(item.header) ? { ...item, status: true } : item
                })
            }))
        }
        setValue('col', null)
        // eslint-disable-next-line
    }, [colValue])

    return (
        <GlobalModal
            contentClass="commonModal exportModal"
            center={true}
            modalSize="lg"
            show={chooseColExportToCsvModal}
            onHide={handleClose}
            title={<h3>Export to CSV </h3>}
        >
            {/* <div className="modalHeader">
                <h3>Export to CSV </h3>
                <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() =>
                        handleCloseHandler({ isChooseColumn: false })
                    }
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div> */}
            <form
                className="form-block"
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="off"
                autoCapitalize="off"
            >
                <div className="formBlock">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                {/* <input
                                type="text"
                                className="form-control"
                                placeholder="Find Columns"
                            /> */}
                                <AsyncSelect
                                    classNamePrefix="react-select-drop"
                                    isClearable={false}
                                    closeMenuOnSelect={true}
                                    backspaceRemovesValue={false}
                                    name="col"
                                    key={new Date().getTime()}
                                    debounceTimeout={500}
                                    placeholder="Find Columns"
                                    control={control}
                                    controlShouldRenderValue={false}
                                    additional={{
                                        page: 1,
                                    }}
                                    defaultOptions={col.filter((item) => !item.status).map((_item) => ({ label: _item.header, value: _item.header }))}
                                    cacheOptions
                                    loadOptions={loadOption}
                                    components={{
                                        DropdownIndicator: () => null,
                                        // IndicatorSeparator: () => null,
                                        // LoadingIndicator: null,
                                    }}
                                    styles={customStyles}
                                />
                            </div>
                        </div>
                    </div>
                    <Scrollbars
                        autoHeight
                        className='columnexport-scroll'
                        autoHeightMin={0}
                        autoHeightMax={"calc(100vh - 28rem)"}
                        renderThumbVertical={props => < div {...props} className="thumb-vertical" />}
                        renderTrackVertical={props => < div {...props} className="track-vertical" />}
                    >
                        <div className="columnexport-inside">
                            <div className="columnExport">
                                <h4>Columns to export:</h4>
                                <ul>
                                    {col.map((item, index) => {
                                        return item.status ? <li key={index}>
                                            {item.header}
                                            <span
                                                onClick={() => {
                                                    setState((prev) => ({
                                                        ...prev,
                                                        col: col.map((_item) => _item.header === item.header ? { ..._item, status: false } : _item)
                                                    }))
                                                }}
                                            >
                                                <i className="fa-solid fa-xmark"></i>
                                            </span>
                                        </li> : <React.Fragment key={index}></React.Fragment>
                                    })}
                                </ul>
                            </div>
                            <div className="columnExport">
                                <h4>Columns not being exported:</h4>
                                <ul>
                                    {col.map((item, index) => {
                                        return !item.status ? <li key={index}>
                                            {item.header}
                                            <span
                                                onClick={() => {
                                                    setState((prev) => ({
                                                        ...prev,
                                                        col: col.map((_item) => _item.header === item.header ? { ..._item, status: true } : _item)
                                                    }))
                                                }}
                                            >
                                                <i className="fa-solid fa-xmark"></i>
                                            </span>
                                        </li> : <React.Fragment key={index}></React.Fragment>
                                    })}
                                </ul>
                            </div>
                        </div>
                    </Scrollbars>
                    <div className="action-btn">
                        <button type="button" className="btn btn-outline-gray" onClick={handleClose}>
                            Cancel
                        </button>
                        <CSVLink
                            className="btn btn-primary"
                            data={data}
                            headers={[
                                { label: "ID", key: "id" },
                                ...col
                                    .filter((item) => item.status)
                                    .map((_item) => ({
                                        label: _item.header.toUpperCase(),
                                        key: _item.label,
                                    })),
                            ]}
                            filename={"File.csv"}
                            asyncOnClick={Number(count) > pageSize || (!download_enabled && free_trial_period_enabled) ? true : false}
                            onClick={(event, done) => {
                                if (!download_enabled && free_trial_period_enabled) {
                                    dispatch(handleFreeTrialDownAlertMsgModal(true));
                                    done(false)
                                    return
                                }
                                // if (Number(count) < pageSize) {
                                //     //log download docs
                                //     dispatch(
                                //         logUserAction({
                                //             action_type: actionType['download_docs'],
                                //             action_log_detail: JSON.stringify({
                                //                 ...JSON.parse(previousSearchFilter),
                                //                 download: 1,
                                //                 download_column: [...(col).filter((item: tableColObje) => item.status).map((_item: tableColObje) => "dbKeyName" in _item ? _item.dbKeyName : _item.label), Number(tabIndex) === 1 ? "rig_id" : Number(tabIndex) === 0 ? "uid" : "id"]

                                //             })
                                //         })
                                //     );
                                // }
                                Number(count) > pageSize && sessionStorage.setItem('exportCol', JSON.stringify(col))
                                Number(count) > pageSize && dispatch(handleDownloadCol({ downloadCol: 1, allCol: 0 }))
                                Number(count) > pageSize && done(false)
                                handleClose()

                            }}
                        >
                            {" "}
                            Export to CSV
                        </CSVLink>
                        {/* <button type="submit" className="btn btn-primary">
                            Export to CSV
                        </button> */}
                    </div>
                </div>
            </form>
        </GlobalModal >
    );
}

export default ChooseColExportToCsvModal;


const customStyles = {
    option: (defaultStyles: any, state: any) => ({
        ...defaultStyles,
        color: state.isSelected ? "#293842" : "#fff",
        backgroundColor: state.isSelected ? "#a0a0a0" : "#293842",
        cursor: "pointer"
    }),

    control: (defaultStyles: any) => ({
        ...defaultStyles,
        backgroundColor: "#e6e6f2cc",
        padding: "2px 10px",
        border: "none",
        boxShadow: "none",
        color: "white"
    }),
    singleValue: (defaultStyles: any) => ({ ...defaultStyles, color: "#fff" }),
};