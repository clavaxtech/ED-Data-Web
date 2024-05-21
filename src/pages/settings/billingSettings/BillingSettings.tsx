import React from "react";
import { Helmet } from "react-helmet";
import { PlanSettingsProps } from "../../../components/models/page-props";
import BillingSettingsView from "../../../components/settings/billingSettings/BillingSettingsView";

const BillingSettings = (props: PlanSettingsProps) => {
    return (
        <>
            <Helmet>
                <title>Energy Domain Data</title>
            </Helmet>
            <BillingSettingsView />
        </>
    );
};

export default BillingSettings;
