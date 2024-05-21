import React, { useEffect } from "react";
import GlobalModal from "../common/GlobalModal";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import {
    hideSiteLoader,
    showSiteLoader,
    showUploadModal,
    toggleCrsModal,
} from "../store/actions/modal-actions";
import { CrsModalSubmitForm, OptionType } from "../models/submit-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { crsModalInputValidation } from "../../Helper/validation";
import {
    clearAoiList,
    fetchCrsList,
    sendCrs,
} from "../store/actions/aoi-actions";
import { toast } from "react-toastify";
import AsyncSelect from "../common/AsyncSelect";
import { GroupBase, OptionsOrGroups } from "react-select";

function CrsModal({
    handleState,
    file_name,
    aoi_name,
    handleStateKey,
}: {
    handleState?: (
        value: number,
        resetFile?: boolean,
        file_name?: string
    ) => void;
    file_name: string;
    aoi_name: string;
    handleStateKey?: (obj: { [x: string]: string }) => void;
}) {
    const dispatch = useAppDispatch();
    const {
        modal: { crsModal },
        auth: {
            user: { access_token },
        },
    } = useAppSelector((state) => state);
    const {
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<CrsModalSubmitForm>({
        resolver: yupResolver(crsModalInputValidation),
    });
    const onSubmit = (data: CrsModalSubmitForm) => {
        dispatch(
            sendCrs(access_token, {
                file_name,
                crs: data?.crs?.value,
                aoi_name,
            })
        ).then((res) => {
            const { status, msg, data } = res || {};
            if (status === 200) {
                toast.success(msg);
                handleState && dispatch(clearAoiList());
                dispatch(toggleCrsModal());
                handleState && handleState(0, true, "");
                handleStateKey &&
                    handleStateKey({
                        filter_data: data?.data?.multi_polygon,
                    });
            } else {
                toast.error(msg);
            }
        });
    };
    const loadOptions = async (
        search: string,
        prevOptions: OptionsOrGroups<OptionType, GroupBase<OptionType>>,
        { page }: any
    ) => {
        let totalPage = 1,
            hasMore = false,
            dataList: OptionType[] = [];
        if (search.length >= 2) {
            const res = await dispatch(
                fetchCrsList(access_token, { search, page })
            );
            if (res && res.status === 200) {
                const {
                    extra: { total_record, page_size },
                    data,
                } = res;
                totalPage =
                    Math.floor(total_record / page_size) +
                    (total_record % 10 > 0 ? 1 : 0);
                hasMore = page + 1 <= totalPage ? true : false;
                dataList = data.map((_item) => ({
                    label: `${_item.crs_no} (${_item.crs_name})`,
                    value: _item.crs_no,
                }));
            }
        }
        return {
            options: dataList,
            hasMore: hasMore,
            additional: {
                page: page + 1,
            },
        };
    };
    useEffect(() => {
        reset();
        // eslint-disable-next-line
    }, []);
    return (
        <GlobalModal
            contentClass="crs-modal"
            show={crsModal}
            center={true}
            onHide={() => dispatch(toggleCrsModal())}
        >
            <form
                className="form-block"
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="off"
                autoCapitalize="off"
            >
                <div className="crs-block">
                    <div className="formInputblock">
                        <div className="row">
                            <div className="col-md-6">
                                <AsyncSelect
                                    name="crs"
                                    debounceTimeout={500}
                                    placeholder="Enter the CRS of the file"
                                    control={control}
                                    errorMsg={errors.crs?.message}
                                    additional={{
                                        page: 1,
                                    }}
                                    loadOptions={loadOptions}
                                />
                            </div>
                        </div>
                    </div>
                    <p>
                        WARNING - Specifying an incorrect crs may result in
                        incorrect feature placement
                    </p>
                    <div className="action-btn">
                        <button
                            type="button"
                            className={`btn btn-primary`}
                            onClick={() => {
                                dispatch(showSiteLoader());
                                dispatch(toggleCrsModal());
                                handleState && handleState(0, true);
                                dispatch(showUploadModal());
                                dispatch(hideSiteLoader());
                            }}
                        >
                            Re-upload file
                        </button>
                        <button type="submit" className="btn btn-outline-white">
                            Continue
                        </button>
                    </div>
                </div>
            </form>
        </GlobalModal>
    );
}

export default CrsModal;
