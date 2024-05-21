import React from "react";
import { Helmet } from "react-helmet";
import CompanySettingsView from "../../../components/settings/companySettings/CompanySettingsView";
import { CompanySettingsProps } from "../../../components/models/page-props";

const CompanySettings = (props: CompanySettingsProps) => {
    return (
        <>
            <Helmet>
                <title>Energy Domain Data</title>
            </Helmet>
            <CompanySettingsView />
        </>
    );
};

export default CompanySettings;
