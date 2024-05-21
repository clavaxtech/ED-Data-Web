import { useState, useLayoutEffect } from "react";
import { DeviceInfo } from "../models/redux-models";
import { errToast } from "../../utils/helper";
import { AxiosError } from "axios";

const useDeviceInfo = (getDeviceInfo = true): DeviceInfo => {
    const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
        ipAddress: null,
        deviceType: null,
        userAgent: null,
        operatingSystem: null,
    });

    // Function to get IP address
    const getIPAddressAndOtherDetails = async () => {
        try {
            const userAgent = getBrowserName();
            const operatingSystem = OSName();
            // Determine device type
            const isMobile = /iPhone|iPad|iPod|Android/i.test(
                navigator.userAgent
            );
            const deviceType = isMobile ? "Mobile" : "Desktop";
            const response = await fetch("https://api.ipify.org?format=json");
            const data = await response.json();
            setDeviceInfo((prev) => ({
                ...prev,
                ipAddress: data.ip,
                userAgent,
                operatingSystem,
                deviceType,
            }));
        } catch (error) {
            errToast(error as AxiosError);
        }
    };

    // Get user agent
    // const userAgent = navigator.userAgent;
    // setDeviceInfo((prev) => ({ ...prev, userAgent }));
    const getBrowserName = () => {
        let N = navigator.appName,
            ua = navigator.userAgent,
            temp;
        let M = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
        if (M && (temp = ua.match(/version\/([\.\d]+)/i)) != null)
            M[2] = temp[1];
        M = M ? [M[1], M[2]] : [N, navigator.appVersion, "-?"];
        // setDeviceInfo((prev) => ({ ...prev, userAgent: M }));
        return M.join();
    };

    // Determine operating system
    const OSName = () => {
        const userAgent = window.navigator.userAgent;
        const platform = window.navigator.platform;
        const macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"];
        const windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"];
        const iosPlatforms = ["iPhone", "iPad", "iPod"];
        if (macosPlatforms.indexOf(platform) !== -1) {
            return "Mac OS";
        } else if (iosPlatforms.indexOf(platform) !== -1) {
            return "iOS";
        } else if (windowsPlatforms.indexOf(platform) !== -1) {
            return "Windows";
        } else if (/Android/.test(userAgent)) {
            return "Android";
        } else if (/Linux/.test(platform)) {
            return "Linux";
        } else if (/Unix/.test(platform)) {
            return "Unix";
        } else if (/Ubuntu/.test(platform)) {
            return "Ubuntu";
        } else if (userAgent.toLocaleLowerCase().match(/blackberry/i)) {
            return "Blackberry";
        } else if (userAgent.toLocaleLowerCase().match(/bada/i)) {
            return "Bada";
        }
        return "Unknown";
    };

    useLayoutEffect(() => {
        // Call the function to get all the details
        getDeviceInfo && getIPAddressAndOtherDetails();
        // eslint-disable-next-line
    }, []);

    return { ...deviceInfo };
};

export default useDeviceInfo;
