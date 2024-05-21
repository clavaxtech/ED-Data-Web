import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScrollToTopProps } from "../components/models/page-props";
import {
    useAppDispatch,
    useAppSelector,
} from "../components/hooks/redux-hooks";
import SessionLogoutModal from "../components/common/Modal/SessionLogoutModal";
import { loadUser, logout } from "../components/store/actions/auth-actions";
import {
    hideSessionLogoutModal,
    showSessionLogoutModal,
} from "../components/store/actions/modal-actions";
import useIdle from "../components/hooks/useIdleTimer";
import { PROMPTBEFOREIDLE, TIMEOUT } from "../utils/helper";
import { toast } from "react-toastify";

const ScrollToTop = ({ children }: ScrollToTopProps) => {
    const location = useLocation();
    const {
        auth: {
            user: { access_token },
        },
        modal: { sessionModal },
    } = useAppSelector((state) => state);

    const dispatch = useAppDispatch();

    const { activate } = useIdle({
        timeout: TIMEOUT,
        promptBeforeIdle: PROMPTBEFOREIDLE,
        throttle: 500,
        onIdle: () => {
            if (access_token) {
                dispatch(hideSessionLogoutModal());
                dispatch(logout(access_token));
                toast.info("Session time out.");
            }
        },
        onActive: () => {
            access_token && dispatch(hideSessionLogoutModal());
        },
        onPrompt: () => {
            access_token && dispatch(showSessionLogoutModal());
        },
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <>
            {children}
            {sessionModal && access_token && (
                <SessionLogoutModal
                    show={sessionModal}
                    handleClose={() => {
                        dispatch(loadUser());
                        dispatch(hideSessionLogoutModal());
                        activate();
                    }}
                />
            )}
        </>
    );
};

export default ScrollToTop;
