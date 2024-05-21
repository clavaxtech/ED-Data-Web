import jwt from "jsonwebtoken";
import store from "../components/store";
import authSlice from "../components/store/reducers/auth-slice";
import axios from "./axios";
export const authActions = authSlice.actions;

class Utils {
    constructor() {
        this.flatDeep = this.flatDeep.bind(this);
    }

    isTokenExpired(token: string | null) {
        if (!token) return new Promise((resolve) => resolve(false));
        const now = new Date();
        if (token && jwt.decode(token)) {
            const { exp } = jwt.decode(token) as {
                exp: number;
            };
            return new Promise((resolve) =>
                resolve(now.getTime() < (exp - 10) * 1000)
            );
        }
        return new Promise((resolve) => resolve(false));
    }

    async getNewAuthToken() {
        const dispatch = store.dispatch;
        try {
            localStorage.removeItem("access_token");
            sessionStorage.removeItem("access_token");
            let refreshToken =
                localStorage.getItem("refresh_token") ||
                sessionStorage.getItem("refresh_token");
            const res = await axios.post("/api/token/refresh/", {
                refresh: refreshToken,
            });
            const { access } = res.data;
            dispatch(
                authActions.loadUserToken({
                    access_token: access,
                    refresh_token: refreshToken,
                })
            );

            return new Promise((resolve) => resolve(access));
        } catch (err) {
            console.log({ err });
        }
    }

    flatDeep(arr: any, d = 1) {
        return d > 0
            ? arr.reduce(
                  (acc: any, val: any) =>
                      acc.concat(
                          Array.isArray(val) ? this.flatDeep(val, d - 1) : val
                      ),
                  []
              )
            : arr.slice();
    }
}
/* eslint import/no-anonymous-default-export: [2, {"allowNew": true}] */
export default new Utils();
