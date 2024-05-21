import Moment from 'moment'
import { ExportDataObj } from "../../models/redux-models";


const exportCol = (downloadHandler: (evt: ExportDataObj) => void) => {
    const details = (download_loc: string) => {
        switch (download_loc) {
            case "0": return <span>None</span>;
            case "1": return <span>AOI Download</span>;
            case "2": return <span>Search Result Download</span>;
            case "3": return <span>API Shapefile Download</span>;
            case "4": return <span>API CSV Download</span>;
            default: return <span>None</span>;
        }
    }
    return [
        {
            title: "Date",
            render: (rows: ExportDataObj) => {
                return Moment(rows.date_downloaded).format("MMM-DD-YYYY")
            }
        },
        {
            title: "Details",
            render: (rows: ExportDataObj) => {
                return details(rows.download_loc)
            },
        },
        {
            title: "Exported By",
            render: (rows: ExportDataObj) => {
                return rows.user_name
            }
        },
        {
            title: "Export",
            render: (rows: ExportDataObj) => {
                return <button type="button" disabled={rows.download_loc !== "2" && rows.file_url === "" ? true : false} className={`btn ${rows.download_loc !== "2" && rows.file_url === "" ? "btn-disabled" : "btn-primary"}`} onClick={() => { downloadHandler(rows) }}><img src="./images/down-arrow.svg" alt="" /> Download</button>;
            }
        }
    ]
};

export default exportCol;
