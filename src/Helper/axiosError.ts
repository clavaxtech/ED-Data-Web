import { AxiosError } from "axios";
export const errorHandler = (error: AxiosError) => {
    const { request, response } = error;
    if (response) {
        const { message } = (response.data) as AxiosError;
        const status = response.status;
        return { message, status };
    } else if (request) {
        return { message: "server time out", status: 503 };
    } else {
        return { message: "opps! something went wrong while setting up request" };
    }
};
