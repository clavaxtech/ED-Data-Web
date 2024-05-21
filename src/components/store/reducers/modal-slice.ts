import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    HideSiteLoaderAction,
    ModalModel,
    ShowImageCropperModalAction,
    ShowSiteLoaderAction,
} from "../../models/redux-models";

const initialState: ModalModel = {
    siteLoader: false,
    image_cropper_show: false,
    image_cropper_name: "",
    sessionModal: false,
    checkOutModal: false,
    showUpdateCreditCardModal: false,
    uploadModal: false,
    impNoticeModal: false,
    crsModal: false,
    createAoiModal: false,
    uploadingCsvApiListModal: false,
    apiUpgradeSubModal: false,
    saveSegmentModal: false,
    editSubscriptionModal: false,
    downloadColMsgModal: false,
    sideContentLoader: false,
    freeTrialDownAlertMsgModal: false,
    freeTrialEndModal: false,
};

const modalSlice = createSlice({
    name: "modal",
    initialState: initialState,
    reducers: {
        showSiteLoader(state, action: PayloadAction<ShowSiteLoaderAction>) {
            const { siteLoader } = action.payload;
            return {
                ...state,
                siteLoader,
            };
        },

        hideSiteLoader(state, action: PayloadAction<HideSiteLoaderAction>) {
            const { siteLoader } = action.payload;
            return {
                ...state,
                siteLoader,
            };
        },

        showImageCropperModal(
            state,
            action: PayloadAction<ShowImageCropperModalAction>
        ) {
            const { name } = action.payload;
            return {
                ...state,
                image_cropper_show: true,
                image_cropper_name: name,
            };
        },

        hideImageCropperModal(state, action: PayloadAction) {
            return {
                ...state,
                image_cropper_show: false,
                image_cropper_name: "",
            };
        },

        hideSessionLogoutModal(state, action: PayloadAction) {
            return {
                ...state,
                sessionModal: false,
            };
        },
        showSessionLogoutModal(state, action: PayloadAction) {
            return {
                ...state,
                sessionModal: true,
            };
        },
        showCheckOutModal(state, action: PayloadAction) {
            return {
                ...state,
                checkOutModal: true,
            };
        },
        hideCheckOutModal(state, action: PayloadAction) {
            return {
                ...state,
                checkOutModal: false,
            };
        },
        showUpdateCreditCardModal: (state, action: PayloadAction) => {
            return {
                ...state,
                showUpdateCreditCardModal: true,
            };
        },
        hideUpdateCreditCardModal: (state, action: PayloadAction) => {
            return {
                ...state,
                showUpdateCreditCardModal: false,
            };
        },
        showUploadModal: (state) => {
            return {
                ...state,
                uploadModal: true,
            };
        },
        hideUploadModal: (state) => {
            return {
                ...state,
                uploadModal: false,
            };
        },
        toggleImpNoticeModal(state, action: PayloadAction) {
            return {
                ...state,
                impNoticeModal: !state.impNoticeModal,
            };
        },
        toggleCrsModal(state, action: PayloadAction) {
            return {
                ...state,
                crsModal: !state.crsModal,
            };
        },
        toggleCreateAoiModal(state, action: PayloadAction) {
            return {
                ...state,
                createAoiModal: !state.createAoiModal,
            };
        },
        toggleUploadingCsvApiListModal(state, action: PayloadAction) {
            return {
                ...state,
                uploadingCsvApiListModal: !state.uploadingCsvApiListModal,
            };
        },
        toggleApiUpgradeSubModal(state, action: PayloadAction) {
            return {
                ...state,
                apiUpgradeSubModal: !state.apiUpgradeSubModal,
            };
        },
        toggleSaveSegmentModal(state, action: PayloadAction) {
            return {
                ...state,
                saveSegmentModal: !state.saveSegmentModal,
            };
        },
        toggleEditSubscriptionModal(state, action: PayloadAction) {
            return {
                ...state,
                editSubscriptionModal: !state.editSubscriptionModal,
            };
        },
        toggleDownloadColMsgModal(state, action: PayloadAction) {
            return {
                ...state,
                downloadColMsgModal: !state.downloadColMsgModal,
            };
        },
        handleSideContentTabLoading(
            state,
            action: PayloadAction<ModalModel["sideContentLoader"]>
        ) {
            return {
                ...state,
                sideContentLoader: action.payload,
            };
        },
        handleFreeTrialDownAlertMsgModal(
            state,
            action: PayloadAction<ModalModel["freeTrialDownAlertMsgModal"]>
        ) {
            return {
                ...state,
                freeTrialDownAlertMsgModal: action.payload,
            };
        },
        handleFreeTrialEndModal(
            state,
            action: PayloadAction<ModalModel["freeTrialEndModal"]>
        ) {
            return {
                ...state,
                freeTrialEndModal: action.payload,
            };
        },
    },
});

export default modalSlice;
