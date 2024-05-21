import { importSetting } from "../../models/page-props";
import Moment from "moment";

const importCol = () => {
    return [
        {
            title: "Date",
            render: (rows: importSetting) => {
                return Moment(rows.date).format("MMM-DD-YYYY")
            }
        },
        {
            title: "File name",
            render: (rows: importSetting) => {
                return rows.file_name
            }
        },
        {
            title: "Description",
            render: (rows: importSetting) => {
                return rows.description
            }
        },
        {
            title: "Uploaded By",
            render: (rows: importSetting) => {
                return rows.uploaded_By
            }
        },
        {
            title: "Status",
            render: (rows: importSetting) => {
                return rows.status
            }
        }
    ]
};

export default importCol;
