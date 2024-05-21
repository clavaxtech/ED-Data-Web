import { Helmet } from "react-helmet";
import { ImportExportSettingsProps} from "../../../components/models/page-props";
import ImportExportSettingsView from "../../../components/settings/importExportSettings/ImportExportSettingsView";

const ImportExportSettings = (props: ImportExportSettingsProps) => {
    return (
        <>
            <Helmet>
                <title>Energy Domain Data</title>
            </Helmet>
            <ImportExportSettingsView />
        </>
    );
};

export default ImportExportSettings;
