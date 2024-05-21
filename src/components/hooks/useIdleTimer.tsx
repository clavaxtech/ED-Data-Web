import { useIdleTimer } from "react-idle-timer";
import { UseIdleHookProps } from "../models/page-props";

export default function useIdle({
    onIdle,
    timeout = 1000 * 60 * 5,
    onActive,
    onPrompt,
    promptBeforeIdle,
    throttle,
    debounce,
}: UseIdleHookProps) {
    const handleOnIdle = (event?: Event) => {
        onIdle && onIdle();
    };

    const handleOnActive = () => {
        onActive && onActive();
    };

    const handleOnPrompt = () => {
        onPrompt && onPrompt();
    };

    const { getRemainingTime, getLastActiveTime, reset, activate } =
        useIdleTimer({
            timeout: timeout,
            onIdle: handleOnIdle,
            ...(debounce && { debounce: debounce }),
            onActive: handleOnActive,
            onPrompt: handleOnPrompt,
            ...(promptBeforeIdle && { promptBeforeIdle: promptBeforeIdle }),
            ...(throttle && { throttle: throttle }),
        });

    return {
        getRemainingTime,
        getLastActiveTime,
        reset,
        activate,
    };
}
