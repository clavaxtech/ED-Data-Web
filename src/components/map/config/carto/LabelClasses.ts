import Symbols from "./Symbols";

export default class LabelClasses {
    static countyLabelClass = {
        symbol: Symbols.text("black", 10),
        labelPlacement: "always-horizontal",
        labelExpressionInfo: {
            expression: "$feature.NAME + ', ' + $feature.COUNTYFP"
        }
    };
}
