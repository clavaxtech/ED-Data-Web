export const resetValue = (id: string) => {
    let element = document.getElementById(id)
    if (element) (element as HTMLSelectElement | HTMLInputElement).value = ""
}