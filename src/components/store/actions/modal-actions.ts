import { ThunkAction } from "redux-thunk";
import { RootState } from "..";
import { AnyAction } from "redux";
import modalSlice from "../reducers/modal-slice";
import { ModalModel } from "../../models/redux-models";

export const modalActions = modalSlice.actions;

export const showSiteLoader = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(modalActions.showSiteLoader({ siteLoader: true }));
    };
};

export const hideSiteLoader = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(modalActions.hideSiteLoader({ siteLoader: false }));
    };
};

export const showImageCropperModal = (
    name: string
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(modalActions.showImageCropperModal({ name }));
    };
};

export const hideImageCropperModal = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(modalActions.hideImageCropperModal());
    };
};

export const hideSessionLogoutModal = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(modalActions.hideSessionLogoutModal());
    };
};

export const showSessionLogoutModal = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(modalActions.showSessionLogoutModal());
    };
};

export const showCheckOutModal = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(modalActions.showCheckOutModal());
    };
};

export const hideCheckOutModal = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(modalActions.hideCheckOutModal());
    };
};

export const showUpdateCreditCardModal = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(modalActions.showUpdateCreditCardModal());
    };
};

export const hideUpdateCreditCardModal = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(modalActions.hideUpdateCreditCardModal());
    };
};

export const showUploadModal = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(modalActions.showUploadModal());
    };
};

export const hideUploadModal = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(modalActions.hideUploadModal());
    };
};

//toggle Important notice modal
export const toggleImpNoticeModal = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(modalActions.toggleImpNoticeModal());
    };
};

//crsModal
export const toggleCrsModal = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(modalActions.toggleCrsModal());
    };
};

//crsModal
export const toggleCreateAoiModal = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch, getState) => {
        dispatch(modalActions.toggleCreateAoiModal());
    };
};

export const toggleUploadingCsvApiListModal = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch) => {
        dispatch(modalActions.toggleUploadingCsvApiListModal());
    };
};

export const toggleApiUpgradeSubModal = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch) => {
        dispatch(modalActions.toggleApiUpgradeSubModal());
    };
};

export const toggleSaveSegmentModal = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch) => {
        dispatch(modalActions.toggleSaveSegmentModal());
    };
};

export const toggleEditSubscriptionModal = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch) => {
        dispatch(modalActions.toggleEditSubscriptionModal());
    };
};

export const toggleDownloadColMsgModal = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> => {
    return async (dispatch) => {
        dispatch(modalActions.toggleDownloadColMsgModal());
    };
};

export const handleSideContentTabLoading = (
    val: ModalModel["sideContentLoader"]
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(modalActions.handleSideContentTabLoading(val));
    };
};

//Download free trial down alert msg modal
export const handleFreeTrialDownAlertMsgModal = (
    val: ModalModel["freeTrialDownAlertMsgModal"]
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(modalActions.handleFreeTrialDownAlertMsgModal(val));
    };
};

//freeTrialEndModal
export const handleFreeTrialEndModal = (
    val: ModalModel["freeTrialEndModal"]
): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(modalActions.handleFreeTrialEndModal(val));
    };
};
