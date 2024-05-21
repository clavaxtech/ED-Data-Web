import React from "react";
import { Route, Routes } from "react-router-dom";
// import CartBasinToCounty from "../pages/cartBasinToCounty/CartBasinToCounty";
import CartSelectBasin from "../pages/cartSelectBasin/CartSelectBasin";
import Home from "../pages/home/Home";
import SignIn from "../pages/signIn/SignIn";
import SignUp from "../pages/signUp/SignUp";
import PublicRoute from "./PublicRoute";
import ForgotPassword from "../pages/forgotPassword/ForgotPassword";
import AuthRoute from "./AuthRoute";
import CompanySettings from "../pages/settings/companySettings/CompanySettings";
import MemberSettings from "../pages/settings/memberSettings/MemberSettings";
import PlanSettings from "../pages/settings/planSettings/PlanSettings";

import { PageNotFound } from "../pages/PageNotFound/PageNotFound";
import BillingSettings from "../pages/settings/billingSettings/BillingSettings";
import UpdatePasswordView from "../components/forgotPassword/updatePasswordView";
import AdminRoute from "./AdminRoutes";
import MySettings from "../pages/settings/mySettings/MySettings";
import NotificationSettings from "../pages/settings/notificationSettings/NotificationSettings";
import ImportExportSettings from "../pages/settings/importExportSettings/ImportExportSettings";
// import Aoi from "../pages/aoi/Aoi";
import CommonLayout from "../pages/CommonLayout/CommonLayout";
const RoutesCom = () => {
    return (
        <Routes>
            <Route element={<PublicRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path={"/sign-in"} element={<SignIn />} />
                <Route path={"/login"} element={<SignIn />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                    path="/invite-user"
                    element={<UpdatePasswordView usedForInviteMember={true} />}
                />
                <Route
                    path="/update-password"
                    element={<UpdatePasswordView forcePassReset={true} />}
                />

            </Route>
            <Route element={<AuthRoute />}>
                <Route
                    path={"/cart-select-basin"}
                    element={<CartSelectBasin />}
                />
                {/* <Route path={"/search"} element={<CartBasinToCounty />} /> */}
                <Route path={"/search"} element={<CommonLayout />} />
                <Route
                    path={"/company-settings"}
                    element={<CompanySettings />}
                />
                <Route
                    path={"/members-settings"}
                    element={<MemberSettings />}
                />
                <Route path={"/my-settings"} element={<MySettings />} />
                <Route
                    path={"/notification-settings"}
                    element={<NotificationSettings />}
                />
                <Route
                    path={"/import-export-settings"}
                    element={<ImportExportSettings />}
                />
                <Route path={"/aoi"} element={<CommonLayout />} />
                {/* <Route path={"/aoi"} element={<Aoi />} /> */}
                {/* <Route path={"/segments"} element={<Segments />} /> */}
                <Route path={"/segments"} element={<CommonLayout />} />
                <Route path={"/alerts"} element={<CommonLayout />} />
                {/* <Route path={"/files"} element={<FilesFolder />} /> */}
                <Route path={"/files"} element={<CommonLayout />} />
            </Route>
            <Route element={<AdminRoute />}>
                <Route path={"/subscription"} element={<PlanSettings />} />
                <Route path={"/billing"} element={<BillingSettings />} />
            </Route>
            <Route path={"*"} element={<PageNotFound />} />
        </Routes>
    );
};

export default RoutesCom;
