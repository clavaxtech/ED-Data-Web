import FieldNames from "../layers/FieldNames";

export default class PopupTemplates {
    static offsetWellsPopupAgol = {
        title: "<strong>Well Information</strong>",
        expressionInfos: [
            {
                name: "is-vertical-to-text",
                title: "Is Vertical?",
                expression: `When($feature.${FieldNames.wellPointsIsVertical} ==1, 'true', 'false')`
            }
        ],
        content: [
            {
                type: "fields",
                fieldInfos: [
                    {
                        fieldName: FieldNames.wellPointsApi,
                        label: "API"
                    },
                    {
                        fieldName: FieldNames.wellPointsTypeName,
                        label: "Well Type"
                    },
                    {
                        fieldName: FieldNames.wellPointsOperatorName,
                        label: "Operator"
                    },
                    {
                        fieldName: "expression/is-vertical-to-text"
                    }
                ]
            }
        ],
        fieldInfos: [
            {
                fieldName: FieldNames.wellPointsApi,
                format: { digitSeparator: false }
            }
        ]
    };

    static offsetWellsPopupPostgres = {
        title: "<strong>Well Information</strong>",
        expressionInfos: [
            {
                name: "is-vertical-to-text",
                title: "Is Vertical?",
                expression: `When($feature.${FieldNames.wellPointsIsVertical} ==1, 'true', 'false')`
            }
        ],
        content: [
            {
                type: "text",
                text: `{AltId}`
            },
            {
                type: "fields",
                fieldInfos: [
                    {
                        fieldName: FieldNames.wellPointsApi,
                        label: "API"
                    },
                    {
                        fieldName: FieldNames.wellPointsTypeName,
                        label: "Well Type"
                    },
                    {
                        fieldName: FieldNames.wellPointsOperatorName,
                        label: "Operator"
                    },
                    {
                        fieldName: "county",
                        label: "County"
                    },
                    {
                        fieldName: "legaldesc_text",
                        label: "Legal Description"
                    },
                    {
                        fieldName: "legaldesc_abbr",
                        label: "Legal Abbreviation"
                    },
                    {
                        fieldName: "legaldesc_township",
                        label: "Township"
                    },
                    {
                        fieldName: "legaldesc_range",
                        label: "Range"
                    },
                    {
                        fieldName: "legaldesc_section",
                        label: "Section"
                    },
                    {
                        fieldName: "legaldesc_quartersection",
                        label: "Quarter Section"
                    },
                    {
                        fieldName: "legaldesc_abstract",
                        label: "Abstract"
                    },
                    {
                        fieldName: "legaldesc_block",
                        label: "Block"
                    },
                    {
                        fieldName: "legaldesc_lot",
                        label: "Lot"
                    },
                    {
                        fieldName: "legaldesc_survey",
                        label: "Survey"
                    },
                    {
                        fieldName: "field",
                        label: "Field"
                    },
                    {
                        fieldName: "basin_name",
                        label: "Basin"
                    },
                    {
                        fieldName: "elevation",
                        label: "Elevation"
                    },
                    {
                        fieldName: "depth",
                        label: "Depth"
                    },
                    {
                        fieldName: "expression/is-vertical-to-text"
                    }
                ]
            }
        ],
        fieldInfos: [
            {
                fieldName: FieldNames.wellPointsApi,
                format: { digitSeparator: false }
            }
        ]
    };

    static activeListingWellsPopup = {
        title: "<strong>Listing Well Information</strong>",
        content: [
            {
                type: "fields",
                fieldInfos: [
                    {
                        fieldName: FieldNames.listingWellPointsListingId,
                        label: "Listing ID"
                    },
                    {
                        fieldName: FieldNames.wellDataPointsTypeId,
                        label: "Well Type"
                    },
                    {
                        fieldName: FieldNames.listingWellPointsApi,
                        label: "API"
                    }
                ]
            }
        ],
        fieldInfos: [
            {
                fieldName: FieldNames.listingWellPointsApi,
                format: { digitSeparator: false }
            },
            {
                fieldName: FieldNames.listingWellPointsListingId,
                format: { digitSeparator: false }
            }
        ]
    };

    static dateFormatter = (ms: string | number | Date) => {
        if (ms) {
            const UTCDateString = new Date(ms).toUTCString()
            const localMS = Date.parse(UTCDateString.replace("GMT", ""))
            return new Date(localMS).toLocaleDateString()
        }
        return undefined
    }

    static titleCaseFormatter = (str: string) => {
        if (str) {
            return str.toLowerCase().split(' ').map(function (word: string) {
                return word.replace(word[0], word[0].toUpperCase())
            }).join(' ')
        }
        return undefined
    }

    static wellPointsPopupAttributes = [
        {
            label: 'Operator',
            field: (fields: { [x: string]: any; }) => PopupTemplates.titleCaseFormatter(fields[FieldNames.wellPointsOperatorName])
        },
        { label: 'Well Name', field: FieldNames.wellPointsWellName },
        { label: 'API', field: FieldNames.wellPointsApi },
        { label: 'Well Type', field: FieldNames.wellPointsWellTypeName },
        { 
            label: 'County',
            field: (fields: { [x: string]: any; }) => {
                let str = '';
                let county = fields[FieldNames.wellPointsCounty];
                let state = fields[FieldNames.wellPointsStateAbbr];
                if (county) {
                    str += county
                    if (state) {
                        str += ' County, ' + state;
                    }
                } else if (state) {
                    str = state;
                }
                return str;
            }
        },
        { label: 'Township', field: FieldNames.wellPointsLegalTownship },
        { label: 'Range', field: FieldNames.wellPointsLegalRange },
        { label: 'Section', field: FieldNames.wellPointsLegalSection },
        { label: 'Quarter Section', field: FieldNames.wellPointsLegalQuarterSection },
        { label: 'Abstract', field: FieldNames.wellPointsLegalAbstract },
        { label: 'Block', field: FieldNames.wellPointsLegalBlock },
        { label: 'Survey', field: FieldNames.wellPointsLegalSurvey },
        { label: 'Field', field: FieldNames.wellPointsField },
        { label: 'Basin', field: FieldNames.wellPointsBasin },
        { label: 'Depth', field: FieldNames.wellPointsDepth },
        {
            label: 'Vertical',
            field: (fields: { [x: string]: { toString: () => string; }; }) => {
                let str = 'No';
                if (fields[FieldNames.wellPointsIsVertical] === null) {
                    str = '';
                } else if (fields[FieldNames.wellPointsIsVertical].toString() === '1' ||
                        fields[FieldNames.wellPointsIsVertical].toString() === '1.0') {
                    str = 'Yes';
                }
                return str
            }
        },
        { 
            label: 'Permit Date',
            field: (fields: { [x: string]: any; }) => PopupTemplates.dateFormatter(fields[FieldNames.wellPointsPermitDate])
        },
        { 
            label: 'Spud Date',
            field: (fields: { [x: string]: any; }) => PopupTemplates.dateFormatter(fields[FieldNames.wellPointsSpudDate])
        },
        { 
            label: 'Completion Date', 
            field: (fields: { [x: string]: any; }) => PopupTemplates.dateFormatter(fields[FieldNames.wellPointsCompletionDate])
        },
        { 
            label: 'Production Date',
            field: (fields: { [x: string]: any; }) => PopupTemplates.dateFormatter(fields[FieldNames.wellPointsProductionDate])
        },
        { 
            label: 'State Link',
            field: (fields: { [x: string]: any; }) => {
                if (fields[FieldNames.wellPointsStateLink]) {
                    return `<a href="${fields[FieldNames.wellPointsStateLink]}" target="_blank">State Link</a>`
                }
                return ''
            }
        },
        {
            label: 'Production',
            field: (fields: { [x: string]: any; }) => {
                return `<a class="prod-link" data-api="${fields[FieldNames.wellPointsApi]}" data-well-name="${fields[FieldNames.wellPointsWellName]}" data-target="#wellProductionModal" data-backdrop="false" data-toggle="modal">Production Data</a>`
            }
        }
    ]

    static postGresAttributes = [
        {
            name: "altId_name",
            alias: "AltId Name",
            type: "string"
        },
        {
            name: "altId_value",
            alias: "AltId Value",
            type: "string"
        },
        {
            name: "name",
            alias: "Name",
            type: "string"
        },
        //{
        //    name: "well_status",
        //    alias: "Well Type",
        //    type: "string"
        //},
        //{
        //    name: "operator_name",
        //    alias: "Operator",
        //    type: "string"
        //},
        {
            name: "county",
            alias: "County",
            type: "string"
        },
        {
            name: "state_abbr",
            alias: "St Abbr",
            type: "string"
        },
        {
            name: "legaldesc_text",
            alias: "Legal Description",
            type: "string"
        },
        {
            name: "legaldesc_abbr",
            alias: "Legal Abbreviation",
            type: "string"
        },
        {
            name: "legaldesc_township",
            alias: "Township",
            type: "string"
        },
        {
            name: "legaldesc_range",
            alias: "Range",
            type: "string"
        },
        {
            name: "legaldesc_section",
            alias: "Section",
            type: "string"
        },
        {
            name: "legaldesc_quartersection",
            alias: "Quarter Section",
            type: "string"
        },
        {
            name: "legaldesc_abstract",
            alias: "Abstract",
            type: "string"
        },
        {
            name: "legaldesc_block",
            alias: "Block",
            type: "string"
        },
        {
            name: "legaldesc_lot",
            alias: "Lot",
            type: "string"
        },
        {
            name: "legaldesc_survey",
            alias: "Survey",
            type: "string"
        },
        {
            name: "field",
            alias: "Field",
            type: "string"
        },
        {
            name: "basin_name",
            alias: "Basin",
            type: "string"
        },
        {
            name: "elevation",
            alias: "Elevation",
            type: "integer"
        },
        {
            name: "depth",
            alias: "Depth",
            type: "string"
        },
        {
            name: "vertical",
            alias: "Is Vertical?",
            type: "string"
        }
    ];
}
