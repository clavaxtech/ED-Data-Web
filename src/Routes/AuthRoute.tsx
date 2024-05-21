import { Navigate, Outlet, useLocation, useSearchParams } from "react-router-dom";
import { useAppSelector } from "../components/hooks/redux-hooks";
import { useLayoutEffect, useState } from "react";
import Spinner2 from "../components/common/Spinner2";
import { cartSelectBasin, searchPathname } from "../utils/helper";

const AuthRoute = () => {
    const { auth } = useAppSelector((state) => state);
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [state, setState] = useState<{
        isAuthenticated: boolean | null;
    }>({
        isAuthenticated: null,
    });

    const { isAuthenticated } = state;

    const location = useLocation()


    useLayoutEffect(() => {
        setState((prev) => ({
            ...prev,
            isAuthenticated: auth.isAuthenticated,
        }));

        //for search page to store highlight id when user is not login. we doing this so we can navigate to same route
        if (id && location.pathname === searchPathname && !auth.isAuthenticated) {
            sessionStorage.setItem("highlightWellId", id);
        }
        // eslint-disable-next-line
    }, [auth]);

    if (isAuthenticated === null) {
        return <Spinner2 />;
    }

    return isAuthenticated !== null && isAuthenticated !== false ? (
        <>
            {auth.user.company_configs.trial_expired && location.pathname !== cartSelectBasin ? <Navigate to={cartSelectBasin} /> : <Outlet />}
        </>
    ) : (
        <Navigate to="/" />
    );
};

export default AuthRoute;
