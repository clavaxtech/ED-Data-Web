import React from "react";
import { Helmet } from "react-helmet";
import { MemberSettingsProps } from "../../../components/models/page-props";
import MemberSettingsView from "../../../components/settings/memberSettings/MemberSettingsView";

const MemberSettings = (props: MemberSettingsProps) => {
    return (
        <>
            <Helmet>
                <title>Energy Domain Data</title>
            </Helmet>
            <MemberSettingsView />
        </>
    );
};

export default MemberSettings;
