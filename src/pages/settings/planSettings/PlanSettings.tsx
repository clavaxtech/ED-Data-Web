import React from "react";
import { Helmet } from "react-helmet";
import { PlanSettingsProps } from "../../../components/models/page-props";
import PlanSettingsView from "../../../components/settings/planSettings/PlanSettingsView";

const PlanSettings = (props: PlanSettingsProps) => {
    return (
        <>
            <Helmet>
                <title>Energy Domain Data</title>
            </Helmet>
            <PlanSettingsView />
        </>
    );
};

export default PlanSettings;
