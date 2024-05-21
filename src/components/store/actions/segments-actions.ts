import { ThunkAction } from "redux-thunk";
import { RootState } from "..";
import { AnyAction } from "redux";
import {
    handleSideContentTabLoading,
} from "./modal-actions";
import axios from "../../../utils/axios";
import { config, errToast, tokenIsValid } from "../../../utils/helper";
import { AxiosError } from "axios";
import segmentsSlice from "../reducers/segments-slice";
import { toast } from "react-toastify";
import {
    SegmentListPayloadAction,
    SegmentObj,
    SegmentsModel,
} from "../../models/redux-models";
import {
    ReturnMsgAndStatus,
    SegmentBtnActionFormData,
    SelectedSegmentReturnType,
} from "../../models/submit-form";

export const segmentsActions = segmentsSlice.actions;

export const loadActiveSegmentList = (data: {
    data: SegmentListPayloadAction;
    active_total: number;
    archive_total: number;
    page: number;
}): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch) => {
        dispatch(segmentsActions.loadActiveSegmentList(data));
    };
};

export const loadArchivedSegmentList = (data: {
    data: SegmentListPayloadAction;
    active_total: number;
    archive_total: number;
    page: number;
}): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch) => {
        dispatch(segmentsActions.loadArchivedSegmentList(data));
    };
};

// fetchSegmentsList
export const fetchSegmentsList =
    (
        token: string,
        formData: { type: string; page: number },
        hideLoader?: boolean
    ): ThunkAction<Promise<void>, RootState, unknown, AnyAction> =>
    async (dispatch) => {
        const { type, page: pageNo } = formData;
        pageNo === 1 &&
            !hideLoader &&
            dispatch(handleSideContentTabLoading(true));

        await tokenIsValid(token);
        try {
            let response = await axios.get(
                `/api-segment/saved-segment?status=${type}&page=${pageNo}`,
                config
            );
            let {
                data,
                status,
                msg,
                total_record,
                page_size,
                active_total,
                archive_total,
                page,
            } = response.data;
            if (status === 200 && data) {
                if (type === "active") {
                    dispatch(
                        loadActiveSegmentList({
                            data: {
                                data: data
                                    ? data.map((item: SegmentObj) => ({
                                          ...item,
                                          checked: false,
                                      }))
                                    : [],
                                total_record: total_record,
                                page_size: page_size,
                            },
                            active_total: active_total,
                            archive_total: archive_total,
                            page: page,
                        })
                    );
                } else {
                    dispatch(
                        loadArchivedSegmentList({
                            data: {
                                data: data
                                    ? data.map((item: SegmentObj) => ({
                                          ...item,
                                          checked: false,
                                      }))
                                    : [],
                                total_record: total_record,
                                page_size: page_size,
                            },
                            active_total: active_total,
                            archive_total: archive_total,
                            page: page,
                        })
                    );
                }
            } else {
                if (status !== 200) {
                    toast.error(msg);
                } else {
                    if (type === "active") {
                        dispatch(
                            loadActiveSegmentList({
                                data: {
                                    data: [],
                                    total_record: 0,
                                    page_size: 10,
                                },
                                active_total: active_total,
                                archive_total: archive_total,
                                page: 1,
                            })
                        );
                    } else {
                        dispatch(
                            loadArchivedSegmentList({
                                data: {
                                    data: [],
                                    total_record: 0,
                                    page_size: 10,
                                },
                                active_total: active_total,
                                archive_total: archive_total,
                                page: 1,
                            })
                        );
                    }
                }
            }
            pageNo === 1 &&
                !hideLoader &&
                dispatch(handleSideContentTabLoading(false));

            return response.data;
        } catch (err) {
            errToast(err as AxiosError);
            pageNo === 1 &&
                !hideLoader &&
                dispatch(handleSideContentTabLoading(false));
        }
    };

export const handleSegmentTabIndx = (
    indx: 1 | 2
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch) => {
        dispatch(segmentsActions.handleSegmentTabIndx(indx));
    };
};

export const handleSelectedRowId = (
    id: number
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch) => {
        dispatch(segmentsActions.handleSelectedRowId(id));
    };
};

export const handleCheckbox = (
    id: number
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch) => {
        dispatch(segmentsActions.handleCheckbox(id));
    };
};

export const selectOrDeselectAllCheckbox = (
    value: boolean
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch) => {
        dispatch(segmentsActions.selectOrDeselectAllCheckbox(value));
    };
};

//segment activate, archive, and delete btn action
export const segmentBtnAction = (
    token: string,
    formData: SegmentBtnActionFormData
): ThunkAction<Promise<ReturnMsgAndStatus>, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(handleSideContentTabLoading(true));

        await tokenIsValid(token);

        try {
            const res = await axios.put(
                "/api-segment/segment-action",
                formData,
                config
            );
            dispatch(handleSideContentTabLoading(false));

            return res.data;
        } catch (err) {
            errToast(err as AxiosError);
            dispatch(handleSideContentTabLoading(false));
        }
    };
};

export const clearActiveOrArchiveSegmentList = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch) => {
        dispatch(segmentsActions.clearActiveOrArchiveSegmentList());
    };
};

// fetchSelectedSegmentDetails
export const fetchSelectedSegmentDetails =
    (
        token: string,
        id: number,
        hideLoader = false
    ): ThunkAction<
        Promise<SelectedSegmentReturnType>,
        RootState,
        unknown,
        AnyAction
    > =>
    async (dispatch) => {
        !hideLoader && dispatch(handleSideContentTabLoading(true));

        await tokenIsValid(token);
        try {
            let response = await axios.get(
                `/api-segment/segment?seg_id=${id}`,
                config
            );
            const { status, data, msg } = response.data;
            if (status === 200) {
                dispatch(handleSelectedSegmentData(data));
            } else {
                toast.error(msg);
            }
            !hideLoader && dispatch(handleSideContentTabLoading(false));

            return response.data;
        } catch (err) {
            errToast(err as AxiosError);
            !hideLoader && dispatch(handleSideContentTabLoading(false));
        }
    };

export const handleSegmentPageChange = (
    page: number
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch) => {
        dispatch(segmentsActions.handleSegmentPageChange(page));
    };
};

export const handleSelectedSegmentData = (
    data: SegmentsModel["selectedSegmentData"]
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch) => {
        dispatch(segmentsActions.handleSelectedSegmentData(data));
    };
};
