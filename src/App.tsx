import { BrowserRouter } from "react-router-dom";
import { useEffect, useLayoutEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./components/hooks/redux-hooks";
import { fetchToken, handleSystemRelatedDetails } from "./components/store/actions/auth-actions";
import ScrollToTop from "./Routes/ScrollToTop";
import RoutesCom from "./Routes/Routes";
import SiteLoader from "./components/common/SiteLoader";
import Spinner2 from "./components/common/Spinner2";
import FreeTrialEndModal from "./components/common/Modal/FreeTrialEndModal";
import useDeviceInfo from "./components/hooks/useSystemRelateInfo";
// import { requestForToken } from './firebase';
// import Notification from "./components/common/notification/Notification";

function App() {
    const dispatch = useAppDispatch();
    const [tokenVerified, setTokenVerified] = useState<null | boolean>(null);
    const { auth: { deviceInfo: { ipAddress } } } = useAppSelector(state => state)
    //if we already called the api for ip address then ignore use of hook.
    const deviceInfo = useDeviceInfo(ipAddress === null ? true : false)
    useLayoutEffect(() => {
        Promise.all([dispatch(fetchToken())]).then((res) => {
            setTokenVerified(true);
        });

        // eslint-disable-next-line
    }, []);
    // Commenting the firebase token comment for now
    // useEffect(() => {
    //     requestForToken();
    // }, [])

    useEffect(() => {
        if (deviceInfo.ipAddress && !ipAddress) {
            console.log({ deviceInfo })
            dispatch(handleSystemRelatedDetails(deviceInfo))
        }
        // eslint-disable-next-line
    }, [deviceInfo])

    if (tokenVerified === null) {
        return <Spinner2 />;
    }



    return (
        <>
            <BrowserRouter>
                <ScrollToTop>
                    <RoutesCom />
                    <SiteLoader />
                    {/* <Notification /> */}
                    <FreeTrialEndModal />
                </ScrollToTop>
            </BrowserRouter>
        </>
    );
}

export default App;
