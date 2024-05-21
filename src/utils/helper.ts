import { UseFormSetValue } from "react-hook-form";
import utils from ".";
import setAuthToken from "./setAuthToken";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import Papa from "papaparse";
import shp from "shpjs";
import { fileTypeResponse } from "../components/models/page-props";
import * as JSZip from "jszip";

export const ADMIN = 1;
export const MEMBERS = 2;
export const ADMIN_CONSTANT = "Admin";
export const MEMBER_CONSTANT = "Member";
const { isTokenExpired, getNewAuthToken } = utils;

// Format the price above to USD using the locale, style, and currency.
export const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

export const numberFormat = new Intl.NumberFormat("en-US");

export const navBarMenu = [
    {
        label: "Search",
        pathname: "/search",
        fontAwesomeClass: "icon search",
        title: "Search",
    },
    {
        label: "AOI",
        pathname: "/aoi",
        fontAwesomeClass: "icon location",
        title: "AOI",
    },
    {
        label: "Segments",
        pathname: "/segments",
        fontAwesomeClass: "icon segment",
        title: "Segments",
    },
    {
        label: "Alerts",
        title: "Notifications",
        pathname: "/alerts",
        fontAwesomeClass: "icon notification",
    },
    {
        label: "Files",
        title: "Files",
        pathname: "/files",
        fontAwesomeClass: "icon files",
    },
];

export const companySettingAdminMembersOption = [
    { label: "Settings", pathname: "/company-settings", signin_as: ADMIN },
    { label: "Settings", pathname: "/company-settings", signin_as: MEMBERS },
    { label: "Members", pathname: "/members-settings", signin_as: ADMIN },
    { label: "Members", pathname: "/members-settings", signin_as: MEMBERS },
    { label: "Subscription", pathname: "/subscription", signin_as: ADMIN },
    { label: "Billing", pathname: "/billing", signin_as: ADMIN },
    {
        // label: "Import/Export",
        label: "Export",
        pathname: "/import-export-settings",
        signin_as: ADMIN,
    },
    {
        // label: "Import/Export",
        label: "Export",
        pathname: "/import-export-settings",
        signin_as: MEMBERS,
    },
];

export const removeNullOrEmptyValue = (dataObject: { [x: string]: any }) => {
    Object.keys(dataObject)?.forEach((key) => {
        if (dataObject[key] === "" || dataObject[key] == null) {
            delete dataObject[key];
        }
    });
};

export const setFormData = (
    dataObject: { [x: string]: any },
    setValue: UseFormSetValue<any>
) => {
    Object.keys(dataObject)?.forEach((key) => {
        setValue(key, dataObject[key]);
    });
};

export const TIMEOUT = 1000 * 60 * 20;

export const PROMPTBEFOREIDLE = 1000 * 60 * 5;

export function FormatLongNumber(value: number) {
    let remainder = 0;
    if (value === 0) {
        return 0;
    } else {
        // hundreds
        if (value <= 999) {
            return value;
        }
        // thousands
        else if (value >= 1000 && value <= 999999) {
            remainder = value % 1000;
            return (
                Math.floor(value / 1000) +
                "K" +
                (remainder > 0 ? remainder : "")
            );
        }
        // millions
        else if (value >= 1000000 && value <= 999999999) {
            remainder = value % 1000000;
            return (
                Math.floor(value / 1000000) +
                "M" +
                (remainder > 0 ? remainder : "")
            );
        }
        // billions
        else if (value >= 1000000000 && value <= 999999999999) {
            remainder = value % 1000000000;
            return (
                Math.floor(value / 1000000000) +
                "B" +
                (remainder > 0 ? remainder : "")
            );
        } else return value;
    }
}

export const CHECK_OUT_MODAL_TIMEOUT = 1000 * 60 * 5;

export const cardBrandToPfClass = {
    visa: "fa-brands fa-cc-visa",
    mastercard: "fa-brands fa-cc-mastercard",
    amex: "fa-brands fa-cc-amex",
    discover: "fa-brands fa-cc-discover",
    diners: "fa-brands fa-cc-diners-club",
    jcb: "fa-brands fa-cc-jcb",
    unknown: "fa-solid fa-credit-card",
    unionpay: "fa-solid fa-credit-card",
};

// export const handleDownload = (url: string, filename = "") => {
//     axios
//         .get(url, {
//             responseType: "blob",
//         })
//         .then((res) => {
//             fileDownload(res.data, filename);
//         });
// };

export const tokenIsValid = async (token: string) => {
    let newToken = token;
    const valid = await isTokenExpired(newToken);
    if (!valid) newToken = (await getNewAuthToken()) as string;
    setAuthToken(newToken);
};

export const config = { headers: { "Content-Type": "application/json" } };

export const errToast = (err: AxiosError) => {
    if (!err) return;
    toast.error(
        "Error processing request. Please try again or contact our technical support team."
    );
    console.error(err);
};

export const handleCsvFile = (acceptedFiles: Blob) => {
    return new Promise<fileTypeResponse>((resolve, reject) => {
        Papa.parse(acceptedFiles as File, {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                resolve({ status: 200, data: results });
            },
            error: function (error) {
                toast.error("Something went wrong " + error);
                reject({ status: 404, data: [] });
            },
        });
    });
};

export const handleShapeFile = (acceptedFiles: Blob) => {
    let fileType = acceptedFiles.name.split(".").pop();
    return new Promise<fileTypeResponse>((resolve, reject) => {
        const reader = new FileReader();
        reader.onabort = () => console.log("aborted");
        reader.onerror = () => console.log("failed");
        reader.onload = async (e) => {
            const binaryStr = reader.result;
            if (fileType === "zip") {
                JSZip.loadAsync(acceptedFiles).then((zip) => {
                    let files: { [x: string]: any }[] = [];
                    zip.forEach(async (relativePath, zipEntry) => {
                        files.push(zipEntry);
                    });
                    files = files.filter((item) => item.name.includes(".prj"));
                    if (files.length > 0) {
                        files[0].async("string").then((content: string) => {
                            if (
                                !(
                                    (content.includes("WGS_1984") &&
                                        content.includes(
                                            "North_American_1983"
                                        )) ||
                                    content.includes("Degree")
                                )
                            ) {
                                toast.error(
                                    "Shapefile uploads must be in WGS84 or NAD83 datum, lat/long degree projection."
                                );
                                reject({ status: 404, data: {} });
                            }
                        });
                    }
                });
                try {
                    if (!binaryStr) return;
                    const geojson = await shp(binaryStr);
                    resolve({ status: 200, data: geojson });
                } catch (error) {
                    toast.error(
                        "Shapefile uploads must be in WGS84 or NAD83 datum, lat/long degree projection.",
                        { autoClose: 2000 }
                    );
                    reject({ status: 404, data: {} });
                }
            }
        };
        if (fileType === "zip") {
            reader.readAsArrayBuffer(acceptedFiles);
        }
    });
};

export const handleGeoJsonFile = (acceptFile: Blob) => {
    let file = new Blob([acceptFile], {
        type: "application/json",
    });
    return new Promise<{ data: { [x: string]: any } }>((resolve, reject) => {
        file.text()
            .then((value) => {
                if (!value.includes("Polygon")) {
                    toast.error(
                        "Geojson files must consist of Polygons and/or MultiPolygons.",
                        { autoClose: 2000 }
                    );
                    reject();
                }
                resolve({ data: JSON.parse(value) });
            })
            .catch((error) => {
                toast.error("Something went wrong " + error);
                console.log({ error });
                reject();
            });
    });
};

//used in ED other project
export function convertToDisplayFormatShortCurrency(num: number) {
    let numRound = 0;
    let formattedNumber;
    num = parseInt(num.toString().replace(/\$|,/g, ""));

    let isNegative = false;

    if (num < 0) {
        isNegative = true;
    }

    num = Math.abs(num);

    if (num >= 1000000000) {
        numRound = Math.round(num / 1000000000);

        formattedNumber = numRound + "G";
    } else if (num >= 100000000 && num < 999999999.99) {
        numRound = Math.round(num / 1000000);

        formattedNumber = numRound + "M";
    } else if (num >= 10000000 && num < 99999999.99) {
        numRound = Math.round(num / 1000000);

        formattedNumber = numRound + "M";
    } else if (num >= 1000000 && num < 9999999.99) {
        numRound = Math.round(num / 1000000);

        formattedNumber = numRound + "M";
    } else if (num >= 100000 && num < 999999.99) {
        numRound = Math.round(num / 1000);

        formattedNumber = numRound + "K";
    } else if (num >= 10000 && num < 99999.99) {
        numRound = Math.round(num / 1000);

        formattedNumber = numRound + "K";
    } else {
        formattedNumber = num;
    }

    if (isNegative) {
        formattedNumber = "-" + formattedNumber;
    }

    return formattedNumber;

    //return num;
}

export const extractOption = (data: { [x: string]: any }[], name: string) => {
    return data.map((item) => ({ label: item[name], value: item[name] }));
};

export const DO_NOT_SHOW_UPGRADE_MODAL = "doNotShowUpgradeModal";

export function inputNumber(e: React.KeyboardEvent<HTMLInputElement>) {
    if (
        e.keyCode === 8 ||
        e.keyCode === 46 ||
        e.keyCode === 37 ||
        e.keyCode === 39
    ) {
        return true;
    } else if (e.keyCode < 48 || e.keyCode > 57) {
        e.preventDefault();
    }
}

export const modifyString = (val: string) => {
    let modifiedString = val.replace(/['"]/g, function (match) {
        return match === '"' ? "'" : '"';
    });
    return modifiedString;
};

export const aoiPathname = "/aoi";
export const searchPathname = "/search";
export const alertsPathname = "/alerts";
export const segmentsPathname = "/segments";
export const filesPathname = "/files";
export const cartSelectBasin = "/cart-select-basin";

export const alertType = [
    { value: 1, label: "New Wells" },
    { value: 2, label: "New Permits" },
    { value: 3, label: "New Completions" },
    { value: 4, label: "New Rigs" },
    { value: 5, label: "New Productions" },
    { value: 6, label: "New Operators" },
];

export const numberRegex = /^\d+$/;
export const OIL = "oil";
export const GAS = "gas";
export const OPERATOR = "operator";
export const PRODUCTION_DONUT_CHART = "productionDonutChart";
export const OPERATOR_PIE_CHART = "operatorPieChart";
export const LINE_CHART_MAX_ITEM_ALLOWED = 50;
export const ANALYTICS_MONTHLY_TAB = "monthlyTab";
export const ANALYTICS_CUM_TAB = "cumTab";

export const capitalize = (s: string) => {
    return s[0].toUpperCase() + s.slice(1);
};

export const LINE_CHART_XAXIS_FILTERS = {
    "Date Time": 1,
    "Producing Time": 2,
};

export const VERTICAL = "vertical";

export const MEASURED_DEPTH_MAX = 40000;
export const TRUE_VERTICAL_DEPTH_MAX = 30000;
export const LATERAL_LENGTH_MAX = 30000;

export const DO_NOT_SHOW_SHAPEFILE_INFO_MODAL = "doNotShowShapeFileInfoModal";

export const DropDownOption = [
    { label: "None (default)", value: "none" },
    { label: "Sum", value: "sum" },
    { label: "Average", value: "average" },
    { label: "P10", value: "p10" },
    { label: "P50", value: "p50" },
    { label: "P90", value: "p90" },
];

export const ANALYTICS_DEFAULT_WIDTH = 70;

export const downloadGraphImage = (id: typeof OIL | typeof GAS): void => {
    const mainChart = document.querySelector(`#${id}`) as HTMLElement | null;
    const svg = mainChart?.querySelector("svg") as SVGSVGElement | null;
    if (!svg) return;

    // Clone the SVG element
    const svgClone = svg.cloneNode(true) as SVGSVGElement;

    // Apply changes to the cloned SVG
    const yAxisTexts = svgClone.querySelectorAll(".y.axis text");
    yAxisTexts.forEach((text) => {
        text.setAttribute("fill", "currentColor");
    });

    // Adjust the margins if necessary
    const margin = { top: 0, right: 0, bottom: 0, left: 50 };
    const width =
        parseInt(svgClone.getAttribute("width") || "0") +
        margin.left +
        margin.right;
    const height =
        parseInt(svgClone.getAttribute("height") || "0") +
        margin.top +
        margin.bottom;
    svgClone.setAttribute("width", `${width}`);
    svgClone.setAttribute("height", `${height}`);

    // Create a background rectangle
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", "100%");
    rect.setAttribute("height", "100%");
    rect.setAttribute("fill", "rgb(147 154 159)");
    svgClone.insertBefore(rect, svgClone.firstChild);

    // Apply transformation to the grid, y-axis, and line groups
    const grid = svgClone.querySelector(".grid") as SVGElement | null;
    if (grid) grid.setAttribute("transform", "translate(45,0)");

    const yAxis = svgClone.querySelector(".y.axis") as SVGElement | null;
    if (yAxis) yAxis.setAttribute("transform", "translate(45,0)");

    const xAxis = svgClone.querySelector(".x.axis") as SVGElement | null;
    if (xAxis) xAxis.setAttribute("transform", `translate(45,${height - 20})`);

    const lineGroups = svgClone.querySelectorAll(".line-group");
    lineGroups.forEach((group) => {
        group.setAttribute("transform", "translate(45,0)");
    });

    // Serialize SVG to a string
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgClone);

    svgClone.removeChild(rect); // Remove background rectangle to revert to original SVG

    // Encode SVG string in base64
    const base64Data = window.btoa(unescape(encodeURIComponent(svgString)));

    // Create an Image element
    const img = new Image();
    img.src = "data:image/svg+xml;base64," + base64Data;

    img.onload = () => {
        // Create a canvas element
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        // Draw the image onto the canvas
        if (ctx) ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to a PNG data URL
        if (canvas) {
            canvas.toBlob((blob) => {
                if (!blob) return;
                const url = URL.createObjectURL(blob);

                // Create a temporary anchor element for downloading
                const downloadLink = document.createElement("a");
                downloadLink.href = url;
                downloadLink.download = "graph.png"; // Specify the filename

                // Simulate a click to trigger the download
                document.body.appendChild(downloadLink);
                downloadLink.click();

                // Clean up
                document.body.removeChild(downloadLink);
                URL.revokeObjectURL(url);
            }, "image/png");
        }
    };
};

export const sixtyColors = [
    "#1f77b4",
    "#aec7e8",
    "#ff7f0e",
    "#ffbb78",
    "#2ca02c",
    "#98df8a",
    "#d62728",
    "#ff9896",
    "#9467bd",
    "#c5b0d5",
    "#8c564b",
    "#c49c94",
    "#e377c2",
    "#f7b6d2",
    "#7f7f7f",
    "#c7c7c7",
    "#bcbd22",
    "#dbdb8d",
    "#17becf",
    "#9edae5",
    "#393b79",
    "#5254a3",
    "#6b6ecf",
    "#9c9ede",
    "#637939",
    "#8ca252",
    "#b5cf6b",
    "#cedb9c",
    "#8c6d31",
    "#bd9e39",
    "#e7ba52",
    "#e7cb94",
    "#843c39",
    "#ad494a",
    "#d6616b",
    "#e7969c",
    "#7b4173",
    "#a55194",
    "#ce6dbd",
    "#de9ed6",
    "#3182bd",
    "#6baed6",
    "#9ecae1",
    "#c6dbef",
    "#e6550d",
    "#fd8d3c",
    "#fdae6b",
    "#fdd0a2",
    "#31a354",
    "#74c476",
    "#a1d99b",
    "#c7e9c0",
    "#756bb1",
    "#9e9ac8",
    "#bcbddc",
    "#dadaeb",
    "#636363",
    "#969696",
    "#bdbdbd",
    "#d9d9d9",
];

export const actionType = {
    view_settings: 21,
    remove_user: 20,
    invite_member: 19,
    view_analytics: 18,
    export_data: 17,
    upload_api_list: 16,
    delete_aoi: 15,
    save_aoi: 14,
    click_rig: 13,
    click_well: 12,
    run_forecast: 11,
    execute_advanced_filter: 10,
    execute_filter: 9,
    new_subscription: 8,
    cancelled_subscription: 7,
    upload_shapefile: 3,
    download_docs: 1,
};

export const rigs = "Rigs";
export const wells = "Wells";

export const jsonToString = (obj: { [x: string]: any }) => {
    return Object.entries(obj)
        .map((x) => x.join(":"))
        .join(",\r\n");
};
