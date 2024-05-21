import axios from "./axios";

const setAuthToken = (token: string | null) => {
    if (token) {
        let device_session_id = localStorage.getItem("device_session_id");
        // Adding header type for HTTP Request
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        if (device_session_id)
            axios.defaults.headers.common["X-DEVICE-SESSION-ID"] =
                Number(device_session_id);
    } else {
        delete axios.defaults.headers.common["Authorization"];
    }
};

export default setAuthToken;
