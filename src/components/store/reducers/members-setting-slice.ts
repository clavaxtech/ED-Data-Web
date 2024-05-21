import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
    LoadInviteMembersAction,
    MembersSettingsInitialValueType,
} from "../../models/redux-models";

const initialState: MembersSettingsInitialValueType = {
    inviteMembersData: null,
    inviteMembersCount: 0,
    inviteMemberDataLoading: true,
    active_user_count: 0,
};

const membersSettings = createSlice({
    name: "membersSettings",
    initialState: initialState,
    reducers: {
        loadInviteMembers(
            state,
            action: PayloadAction<LoadInviteMembersAction>
        ) {
            return {
                ...state,
                inviteMemberDataLoading: false,
                inviteMembersData: action.payload.data,
                inviteMembersCount: action.payload.result_count,
                active_user_count: action.payload.active_user_count,
            };
        },
        clearInviteMembers(state, action: PayloadAction) {
            return {
                ...state,
                inviteMemberDataLoading: true,
                inviteMembersData: null,
                inviteMembersCount: 0,
                active_user_count: 0,
            };
        },
    },
});

export default membersSettings;
