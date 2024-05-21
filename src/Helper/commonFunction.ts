
import { DivWithNormalScreen, DivWithFullScreen } from "../components/models/page-props";

export const enterFullScreen = (targetdiv: DivWithNormalScreen) => {
    if (targetdiv.requestFullscreen) targetdiv.requestFullscreen();
    else if (targetdiv.mozRequestFullScreen) targetdiv.mozRequestFullScreen();
    else if (targetdiv.webkitRequestFullscreen) targetdiv.webkitRequestFullscreen();
    else if (targetdiv.msRequestFullscreen) targetdiv.msRequestFullscreen();
}

export const exitFullScreen = () => {
    const doc = document as DivWithFullScreen;
    if (doc.fullscreen) {
        if (doc.exitFullscreen) doc.exitFullscreen();
        else if (doc.mozCancelFullScreen) doc.mozCancelFullScreen();
        else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
        else if (doc.msExitFullscreen) doc.msExitFullscreen();
    }
}