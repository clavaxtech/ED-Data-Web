import { OptionType, searchListObject } from "../components/models/page-props";

export const waitTill = (ms: number) =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve(undefined);
        }, ms);
    });

export const splitValues = (item: OptionType) => {
    if (!item) return ""
    return item.length ? item.map(val => val.value).toString() : ""
}

export const newTableCellCollection = (tableColumn: searchListObject[], properties: string[]) => {
    if (!tableColumn.length) return []
    return tableColumn.map(function (item: searchListObject) {
        var newItem = {} as any
        //eslint-disable-next-line 
        for (var i = 0, prop; prop = properties[i]; i++)
            if (typeof item[prop as unknown as keyof searchListObject] !== 'undefined')
                newItem[prop as unknown as keyof searchListObject] = item[prop as unknown as keyof searchListObject]
        return newItem;
    })
}