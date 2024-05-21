//  Note:- Hide or show table column based on filter
export const filterTableCell = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value, checked } = e.target
    let tdElem = document.getElementsByClassName(value)
    let thElem = document.getElementById(value + "_head")
    if (checked) {
        for (let i = 0; i < tdElem.length; i++) {
            (tdElem[i] as HTMLElement).style.display = "none"
        }
        if (thElem) thElem.style.display = "none"
    } else {
        for (let i = 0; i < tdElem.length; i++) {
            (tdElem[i] as HTMLElement).style.display = "table-cell"
        }
        if (thElem) thElem.style.display = "table-cell"
    }
}