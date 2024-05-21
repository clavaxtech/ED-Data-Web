import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../components/hooks/redux-hooks";
import { ADMIN } from "../utils/helper";
import { useLayoutEffect, useState } from "react";
import Spinner2 from "../components/common/Spinner2";

const AdminRoute = () => {
    const { auth } = useAppSelector((state) => state);

    const [state, setState] = useState<{
        isAuthenticated: null | boolean;
        signin_as: null | number;
    }>({
        isAuthenticated: null,
        signin_as: null,
    });
    const { isAuthenticated, signin_as } = state;

    useLayoutEffect(() => {
        setState((prev) => ({
            ...prev,
            isAuthenticated: auth.isAuthenticated,
            signin_as: auth.user.signin_as,
        }));
    }, [auth]);

    if (isAuthenticated === null) {
        return <Spinner2 />;
    }

    return isAuthenticated !== null &&
        isAuthenticated !== false &&
        signin_as === ADMIN ? (
        <>
            <Outlet />
        </>
    ) : (
        <Navigate to="/cart-select-basin" />
    );
};

export default AdminRoute;
