import React from "react";
import { Helmet } from "react-helmet";
import { NotificationSettingsProps } from "../../../components/models/page-props";
import NotificationSettingsView from "../../../components/settings/notificationSettings/notificationSettingsView";


const NotificationSettings = (props: NotificationSettingsProps) => {
    return (
        <>
            <Helmet>
                <title>Energy Domain Data</title>
            </Helmet>
            <NotificationSettingsView />
        </>
    );
};

export default NotificationSettings;
