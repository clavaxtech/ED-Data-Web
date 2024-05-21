import { AxiosProgressEvent } from "axios";
export const onUploadProgress = (progressEvent: AxiosProgressEvent) => {
    const { loaded, total } = progressEvent;
    if (total) {
        const percentCompleted = Math.round((loaded / total) * 100);
        if (percentCompleted < 100) {
            let progressBarElement = document.getElementById("progress-bar");
            if (progressBarElement) progressBarElement.innerHTML = percentCompleted + "%";
            if (progressBarElement) progressBarElement.style.width = percentCompleted + "%";
        } else if (percentCompleted === 100) {
            let progressBarElement = document.getElementById("progress-bar");
            if (progressBarElement) progressBarElement.innerHTML = ""
            if (progressBarElement) progressBarElement.style.width = 0 + "%";
        }
    }
};