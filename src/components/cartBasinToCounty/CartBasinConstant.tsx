import { handleOption } from "./CartBasinHelper";

export const cartBasinDates = [
    {
        name: "Permit Date",
        unique_name: "permDate",
        fields: [{ f_fieldname: "permStartDate", l_fieldname: "permEndDate" }],
    },
    {
        name: "Spud Date",
        unique_name: "spudDate",
        fields: [{ f_fieldname: "spudStartDate", l_fieldname: "spudEndDate" }],
    },
    {
        name: "Completion Date",
        unique_name: "compDate",
        fields: [{ f_fieldname: "compStartDate", l_fieldname: "compEndDate" }],
    },
    {
        name: "First Production Date",
        unique_name: "prodDate",
        fields: [{ f_fieldname: "prodStartDate", l_fieldname: "prodEndDate" }],
    },
];

export const drillTypeList = [
    {
        id: 1,
        title: "Vertical",
        active: true,
    },
    {
        id: 2,
        title: "Horizontal",
        active: true,
    },
    {
        id: 3,
        title: "Directional",
        active: true,
    },
    {
        id: 4,
        title: "Unknown",
        active: true,
    },
];

export const drillTypeOption = [
    {
        label: "Vertical",
        value: "vertical",
    },
    {
        label: "Horizontal",
        value: "horizontal",
    },
    {
        label: "Directional",
        value: "directional",
    },
    {
        label: "Unknown",
        value: "unknown",
    }
    // {
    //     label: "Unknown",
    //     value: "unknown",
    // },
    // {
    //     label: "Select All",
    //     value: "Select All",
    // },
];

// export const productType = [
//     {
//         id: 1,
//         title: "Oil",
//         label: "Oil",
//         active: false,
//         value: "oil",
//     },
//     {
//         id: 2,
//         title: "Gas",
//         label: "Gas",
//         active: false,
//         value: "gas",
//     },
//     {
//         id: 3,
//         title: "Oil & Gas",
//         label: "Oil & Gas",
//         active: false,
//         value: "oil/gas",
//     },
//     // {
//     //     id: 4,
//     //     title: "Select All",
//     //     label: "Select All",
//     //     active: false,
//     //     value: "select_all",
//     // },
//     // {
//     //     id: 4,
//     //     title: "Water",
//     //     active: false,
//     //     value: "water",
//     // },
// ];

export const productType = [
    {
        label: "Oil",
        value: "oil",
    },
    {
        label: "Gas",
        value: "gas",
    },
    {
        label: "Oil & Gas",
        value: "oil/gas",
    },
    {
        label: "Water",
        value: "water",
    },
    {
        label: "None",
        value: "none",
    },
    {
        label: "Unknown",
        value: "unknown",
    },

];

export const filteredTableData = [
    {
        id: "1",
        well_name: "BROOK Y-6C 3H1",
        api: 4246140209,
        operator: "PIONEER NATURAL RESOURCES",
        county: "UPTON",
        state: "TX",
        depth: "8140",
        drill_type: "VERTICAL",
        status: "Active",
        checked: false,
    },
    {
        id: "2",
        well_name: "BROOK Y-6C 3H2",
        api: 4246140209,
        operator: "PIONEER NATURAL RESOURCES",
        county: "UPTON",
        state: "TX",
        depth: "8140",
        drill_type: "VERTICAL",
        status: "Active",
        checked: false,
    },
    {
        id: "3",
        well_name: "BROOK Y-6C 3H3",
        api: 4246140209,
        operator: "PIONEER NATURAL RESOURCES",
        county: "UPTON",
        state: "TX",
        depth: "8140",
        drill_type: "VERTICAL",
        status: "Active",
        checked: false,
    },
];

export const apiTableData = [
    {
        id: "4",
        label: "BROOK Y-6C 3H12",
        api: 4246140209,
        county: "UPTON",
        state: "TX",
        status: "Active",
        wellmatching: "",
        checked: false,
    },
    {
        id: "5",
        label: "BROOK Y-6C 3H13",
        api: 4246140209,
        county: "UPTON",
        state: "TX",
        status: "Active",
        wellmatching: "",
        checked: false,
    },
    {
        id: "6",
        label: "BROOK Y-6C 3H14",
        api: 4246140209,
        county: "UPTON",
        state: "TX",
        status: "Active",
        wellmatching: "",
        checked: false,
    },
];

// Terminated


export const wellStatusOption = [
    { label: "Active", value: "active" },
    { label: "Active Permit", value: "active permit" },
    { label: "Abandoned", value: "abandoned" },
    { label: "Cancelled Location", value: "cancelled location" },
    { label: "Drilling", value: "drilling" },
    { label: "Drilled-Uncompleted", value: "drilled-uncompleted" },
    { label: "Dry Hole", value: "dry hole" },
    { label: "Expired Permit", value: "expired permit" },
    { label: "Inactive", value: "inactive" },
    { label: "Pre-Permit", value: "pre-permit" },
    { label: "Plugged", value: "plugged" },
    { label: "Terminated", value: "terminated" },
    // { label: "Canceled", value: "canceled" },
    // { label: "Dry Hole", value: "dry hole" },
    // { label: "Disposal", value: "disposal" },
    // { label: "Gas Storage", value: "gas storage" },
    // { label: "Producing", value: "producing" },
    // { label: "Permit", value: "permit" },
    // { label: "Shut-In", value: "shut-in" },
    // { label: "Water Supply", value: "water supply" },
    // { label: "Other", value: "other" },
];


export const wellTypeOption = [
    { label: "Gas Storage", value: "gas storage" },
    { label: "Injection", value: "injection" },
    { label: "Production", value: "production" },
    { label: "Salt Water Disposal", value: "salt water disposal" },
    { label: "Water", value: "water" },
    { label: "Unknown", value: "unknown" },
    // { label: "Producing", value: "producing" },
    // { label: "Dry Hole", value: "Dry Hole" },
    // { label: "Other", value: "Other" },
    // { label: "Water Supply", value: "Water Supply" },
];

export const multiSelectProps = [
    {
        name: "well",
        gridSize: 4,
        label: "Well #",
        showerror: false,
        defaultValue: [],
        placeholderText: "1868",
        searchPlaceholderText: "",
        fetchOptionHandler: handleOption,
    },
    {
        name: "name",
        gridSize: 12,
        label: "Well Name",
        showerror: false,
        defaultValue: [],
        placeholderText: "Search well name",
        searchPlaceholderText: "",
        fetchOptionHandler: handleOption,
    },
    {
        name: "well_status",
        gridSize: 12,
        label: "Well Status",
        showerror: false,
        defaultValue: [],
        placeholderText: "Select a status",
        searchPlaceholderText: "",
        fetchOptionHandler: handleOption,
    },
    {
        name: "well_api",
        label: "API",
        showerror: false,
        defaultValue: [],
        placeholderText: "Enter one or multiple APIs",
        searchPlaceholderText: "",
        fetchOptionHandler: handleOption,
    },
    {
        name: "operator_name",
        gridSize: 12,
        label: "Operators",
        showerror: false,
        defaultValue: [],
        placeholderText: "Select Operators",
        searchPlaceholderText: "",
        fetchOptionHandler: handleOption,
    },
    {
        name: "state_abbr",
        gridSize: 12,
        label: "State",
        showerror: false,
        defaultValue: [],
        placeholderText: "Select State",
        searchPlaceholderText: "",
        fetchOptionHandler: handleOption,
    },
    {
        name: "county",
        gridSize: 12,
        label: "County",
        showerror: false,
        defaultValue: [],
        placeholderText: "Select County",
        searchPlaceholderText: "",
        fetchOptionHandler: handleOption,
    },
    {
        name: "basin_name",
        gridSize: 12,
        label: "Basin",
        showerror: false,
        defaultValue: [],
        placeholderText: "Select Basin",
        searchPlaceholderText: "",
        fetchOptionHandler: handleOption,
    },
    {
        name: "reservoir",
        gridSize: 12,
        label: "Reservoir",
        showerror: false,
        defaultValue: [],
        placeholderText: "Select a Reservoir",
        searchPlaceholderText: "",
        fetchOptionHandler: handleOption,
    },
    {
        name: "legaldesc_survey",
        gridSize: 12,
        label: "Survey",
        showerror: false,
        defaultValue: [],
        placeholderText: "H&GN RR CO",
        searchPlaceholderText: "",
        fetchOptionHandler: handleOption,
    },
    {
        name: "api_file",
        gridSize: 12,
        label: "",
        showerror: false,
        defaultValue: [],
        placeholderText: "Select a previous uploaded list",
        searchPlaceholderText: "",
        fetchOptionHandler: handleOption,
    },
    {
        name: "well_type",
        gridSize: 12,
        label: "Well Type",
        showerror: false,
        defaultValue: [],
        placeholderText: "Search well type",
        searchPlaceholderText: "",
        fetchOptionHandler: handleOption,
    },
    {
        name: "quarter_section",
        gridSize: 12,
        label: "Quarter Section",
        showerror: false,
        defaultValue: [],
        placeholderText: "Search quarter section",
        searchPlaceholderText: "",
        fetchOptionHandler: handleOption,
    },
    {
        name: "category",
        gridSize: 12,
        label: "Well Category",
        showerror: false,
        defaultValue: [],
        placeholderText: "Search category",
        searchPlaceholderText: "",
        fetchOptionHandler: handleOption,
    },
    {
        name: "sub_category",
        gridSize: 12,
        label: "Well Subcategory",
        showerror: false,
        defaultValue: [],
        placeholderText: "Search Subcategory",
        searchPlaceholderText: "",
        fetchOptionHandler: handleOption,
    },
    {
        name: "drill_type",
        gridSize: 12,
        label: "Well Orientation",
        showerror: false,
        defaultValue: [],
        placeholderText: "Search well orientation",
        searchPlaceholderText: "",
        fetchOptionHandler: handleOption,
    },
    {
        name: "production_type",
        gridSize: 12,
        label: "Product Type",
        showerror: false,
        defaultValue: [],
        placeholderText: "Search product type",
        searchPlaceholderText: "",
        fetchOptionHandler: handleOption,
    },
    {
        name: "legaldesc_township",
        gridSize: 12,
        label: "Township",
        showerror: false,
        defaultValue: [],
        placeholderText: "225",
        searchPlaceholderText: "",
        fetchOptionHandler: handleOption,
        hide: ["texas", "west virginia", "pennsylvania"],
    },
    {
        name: "legaldesc_range",
        gridSize: 12,
        label: "Range",
        showerror: false,
        defaultValue: [],
        placeholderText: "8W",
        searchPlaceholderText: "",
        fetchOptionHandler: handleOption,
        hide: ["texas", "west virginia", "pennsylvania"],
    },
    {
        name: "legaldesc_section",
        gridSize: 12,
        label: "Section",
        showerror: false,
        defaultValue: [],
        placeholderText: "9",
        searchPlaceholderText: "",
        fetchOptionHandler: handleOption,
        hide: ["west virginia", "pennsylvania"],
    },
    {
        name: "legaldesc_abstract",
        gridSize: 12,
        label: "Abstract",
        showerror: false,
        defaultValue: [],
        placeholderText: "218",
        searchPlaceholderText: "",
        fetchOptionHandler: handleOption,
    },
    {
        name: "legaldesc_block",
        gridSize: 12,
        label: "Block",
        showerror: false,
        defaultValue: [],
        placeholderText: "218",
        searchPlaceholderText: "",
        fetchOptionHandler: handleOption,
    },
];

export const inputFieldProps = [
    {
        type: "number",
        maxLength: 3,
        name: "township",
        showerror: false,
        defaultValue: "",
        label: "Township",
        placeholder: "225",
        className: "form-control",
        hide: ["texas", "west virginia", "pennsylvania"],
    },
    {
        type: "text",
        maxLength: 2,
        name: "range",
        label: "Range",
        showerror: false,
        defaultValue: "",
        placeholder: "8W",
        className: "form-control",
        hide: ["texas", "west virginia", "pennsylvania"],
    },
    {
        type: "number",
        maxLength: 1,
        name: "section",
        label: "Section",
        showerror: false,
        defaultValue: "",
        placeholder: "9",
        className: "form-control",
        hide: ["west virginia", "pennsylvania"],
    },
    {
        type: "number",
        maxLength: 3,
        name: "abstract",
        label: "Abstract",
        showerror: false,
        defaultValue: "",
        placeholder: "218",
        className: "form-control",
    },
    {
        type: "number",
        maxLength: 3,
        name: "block",
        label: "Block",
        showerror: false,
        defaultValue: "",
        placeholder: "218",
        className: "form-control",
    },
    {
        type: "text",
        maxLength: 128,
        name: "parcel",
        label: "Parcel",
        showerror: false,
        defaultValue: "",
        placeholder: "Parcel number",
        className: "form-control",
    },
];

export const menuOption = [
    {
        label: 'Permits',
        value: 'permits',
        subMenu: [

            {
                label: 'Active Permit',
                value: 'active_permit'
            },
            {
                label: 'Cancelled Location',
                value: 'canceled_location'
            },
            {
                label: 'Expired Permit',
                value: 'expired_permit'
            },
            {
                label: 'Pre-Permit',
                value: 'pre_permit'
            },
            {
                label: 'Terminated',
                value: 'terminated'
            },
        ]
    },
    {
        label: 'Wells In Progress',
        value: 'wells_in_progress',
        subMenu: [
            {
                label: 'Drilling',
                value: 'drilling'
            },
            {
                label: 'Drilled-Uncompleted',
                value: 'drilled_uncompleted'
            },
        ]
    },
    {
        label: 'Producing Wells',
        value: 'producing_wells',
        subMenu: [
            {
                label: 'Gas',
                value: 'gas'
            },
            {
                label: 'Oil',
                value: 'oil'
            },
            {
                label: 'Oil/Gas',
                value: 'oil/gas'
            },
        ]
    },
    {
        label: 'Inactive',
        value: 'inactive',
        subMenu: []
    },
    {
        label: 'Other ',
        value: 'other',
        subMenu: [
            {
                label: 'Abandoned',
                value: 'abandoned'
            },
            {
                label: 'Dry Hole',
                value: 'dry_hole'
            },
            {
                label: 'Gas Storage',
                value: 'gas_storage'
            },
            {
                label: 'Injection',
                value: 'injection'
            },
            {
                label: 'Plugged',
                value: 'plugged'
            },
            {
                label: 'Salt Water Disposal',
                value: 'salt_water_disposal'
            },
            {
                label: 'Water',
                value: 'water'
            },
            {
                label: 'Other',
                value: 'other'
            },
        ]
    }
]