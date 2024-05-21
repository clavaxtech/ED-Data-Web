import React from "react";
import { Helmet } from "react-helmet";
import { MySettingsProps } from "../../../components/models/page-props";
import MySettingsView from "../../../components/settings/mySettings/MySettingsView";

const MySettings = (props: MySettingsProps) => {
    return (
        <>
            <Helmet>
                <title>Energy Domain Data</title>
            </Helmet>
            <MySettingsView />
        </>
    );
};

export default MySettings;
