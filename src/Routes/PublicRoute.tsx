import React, { useLayoutEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../components/hooks/redux-hooks";
import Spinner2 from "../components/common/Spinner2";

const PublicRoute = () => {
    // const location = useLocation();
    // const auth = useAppSelector((state) => state.auth);
    const { auth } = useAppSelector((state) => state);
    const { isAuthenticated, user: { subscription_status } } = auth;
    const [state, setState] = useState<boolean | null>();

    useLayoutEffect(() => {
        setState(isAuthenticated);
    }, [isAuthenticated]);

    // if (isAuthenticated) {
    //     const query = location.search;
    //     const queryKeys = Object.keys(query).find((key) => key === "redirect");
    //     if (queryKeys) {
    //         const path = query[queryKeys as keyof typeof query];
    //         return path ? (
    //             <Navigate to={`${path}`} replace={true} />
    //         ) : (
    //             <Navigate to="/" replace={true} />
    //         );
    //     }
    // }
    if (state == null) {
        return <Spinner2 />;
    }

    return state ? subscription_status && subscription_status === "active" ? <Navigate to="/search" /> : <Navigate to="/cart-select-basin" /> : <Outlet />;
};

export default PublicRoute;
