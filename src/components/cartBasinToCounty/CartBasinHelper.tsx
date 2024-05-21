import { GroupBase, OptionsOrGroups } from "react-select";
import { reactSelectProps } from "../models/page-props";
import { fetchOptionsList, handleStateList } from "../store/actions/cart-basin-to-county-actions";
import store from "../store";
import { toast } from "react-toastify";
import { extractOption } from "../../utils/helper";
import { wellStatusOption, wellTypeOption, menuOption, drillTypeOption, productType } from "./CartBasinConstant";

const { dispatch, getState } = store;

export const handleOption = async (
    search: string,
    prevOptions: OptionsOrGroups<reactSelectProps, GroupBase<reactSelectProps>>,
    { page, name }: any,
    extraParam?: any
) => {
    let optionList: reactSelectProps[] = [];
    const { cartBasinToCounty: { state_list } } = getState();

    if (name === "drill_type") {
        return {
            options: search
                ? [
                    ...drillTypeOption.filter((item) =>
                        item.label.toLowerCase().includes(search.trim().toLowerCase())
                    ),
                ]
                : [...drillTypeOption, {
                    label: 'Select All',
                    value: 'Select All'
                }],
            hasMore: false,
            additional: {
                page: page + 1,
            },
        };
    }

    if (name === "state_abbr" && state_list.length) {
        return {
            options: search
                ? [
                    ...state_list.filter((item) =>
                        (item.label || "").toLowerCase().includes(search.trim().toLowerCase())
                    ),
                ]
                : state_list,
            hasMore: false,
            additional: {
                page: page + 1,
            },
        };
    }

    if (name === "production_type") {
        return {
            options: search
                ? [
                    ...productType.filter((item) =>
                        item.label.toLowerCase().includes(search.trim().toLowerCase())
                    ),
                ]
                : [...productType, {
                    label: 'Select All',
                    value: 'select_all'
                }],
            hasMore: false,
            additional: {
                page: page + 1,
            },
        };
    }

    if (name === "category") {
        let option = menuOption.map((item) => ({ label: item.label, value: item.value }))
        return {
            options: search
                ? [
                    ...option.filter((item) =>
                        item.label.toLowerCase().includes(search.trim().toLowerCase())
                    ),
                ]
                : option,
            hasMore: false,
            additional: {
                page: page + 1,
            },
        };
    }

    if (name === "sub_category") {
        const { category } = extraParam;
        let option: {
            label: string;
            value: string;
        }[] = []
        menuOption.filter(_item => category.includes(_item.value)).forEach(item => {
            option = [...option, ...item.subMenu]
        });
        return {
            options: search
                ? [
                    ...(option).filter((item) =>
                        item.label.toLowerCase().includes(search.trim().toLowerCase())
                    ),
                ]
                : [...option, {
                    label: 'Select All',
                    value: 'select_all'
                }],
            hasMore: false,
            additional: {
                page: page + 1,
            },
        };
    }

    if (name === "well_status") {
        return {
            options: search
                ? [
                    ...wellStatusOption.filter((item) =>
                        item.label.toLowerCase().includes(search.trim().toLowerCase())
                    ),
                ]
                : [...wellStatusOption, {
                    label: 'Select All',
                    value: 'select_all'
                }],
            hasMore: false,
            additional: {
                page: page + 1,
            },
        };
    }

    if (name === "well_type") {
        return {
            options: search
                ? [
                    ...wellTypeOption.filter((item) =>
                        item.label.toLowerCase().includes(search.trim().toLowerCase())
                    ),
                ]
                : [...wellTypeOption, {
                    label: 'Select All',
                    value: 'select_all'
                }],
            hasMore: false,
            additional: {
                page: page + 1,
            },
        };
    }

    const res = await dispatch(
        fetchOptionsList({
            search_field: name,
            // page,
            ...(search && { like: search.trim() }),
            ...(name === "county" && {
                state_abbr: extraParam["state"].split(","),
            }),
        })
    );
    const { status, data, msg } = res;

    if (status === 200 && "data" in res) {
        switch (name) {
            case "name":
                optionList = extractOption(data, name);
                break;
            case "well_status":
                optionList = extractOption(data, name);
                break;
            case "well_api":
                optionList = extractOption(data, name);
                break;
            case "operator_name":
                optionList = extractOption(data, name);
                break;
            case "state_abbr":
                optionList = data.map((item) => ({
                    label: item.state_name,
                    value: item.state_abbr,
                }));
                //this dispatch will store the data and next time we will not call the api for state list
                dispatch(handleStateList(optionList));
                break;
            case "county":
                optionList = extractOption(data, name);
                break;
            case "basin_name":
                optionList = extractOption(data, name);
                break;
            case "legaldesc_survey":
                optionList = extractOption(data, name);
                break;
            case "api_file":
                optionList = data.map((item) => ({
                    label: item.file_name,
                    value: item.id,
                }));
                break;
            case "legaldesc_abstract":
                optionList = data.map((item) => ({
                    label: item.legaldesc_abstract,
                    value: item.legaldesc_abstract,
                }));
                break;
            case "quarter_section":
                optionList = data.map((item) => ({
                    label: item.quarter_section,
                    value: item.quarter_section,
                }));
                break;
            case "legaldesc_block":
                optionList = data.map((item) => ({
                    label: item.legaldesc_block,
                    value: item.legaldesc_block,
                }));
                break;
            case "legaldesc_section":
                optionList = data.map((item) => ({
                    label: item.legaldesc_section,
                    value: item.legaldesc_section,
                }));
                break;
            case "legaldesc_township":
                optionList = data.map((item) => ({
                    label: item.legaldesc_township,
                    value: item.legaldesc_township,
                }));
                break;
            case "legaldesc_range":
                optionList = data.map((item) => ({
                    label: item.legaldesc_range,
                    value: item.legaldesc_range,
                }));
                break;
            default:
                break;
        }
    } else {
        status !== 200 && toast.error(msg);
    }

    return {
        options: optionList,
        hasMore: false,
        additional: {
            page: page + 1,
        },
    };
};
