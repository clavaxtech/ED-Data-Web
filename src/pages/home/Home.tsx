import { Helmet } from "react-helmet";
import HomeView from "../../components/home/HomeView";
import { HomeProps } from "../../components/models/page-props";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const Home = (props: HomeProps) => {
    const navigate = useNavigate();
    useEffect(() => {
        if (sessionStorage.getItem("highlightWellId")) {
            navigate('/sign-in');
        }
        if (sessionStorage.getItem("accountRemoveOrDeactivateMsg")) {
            toast.success(
                sessionStorage.getItem("accountRemoveOrDeactivateMsg")
            );
            sessionStorage.removeItem("accountRemoveOrDeactivateMsg");
        }
        if (sessionStorage.getItem("passwordUpdateMsg")) {
            navigate("/login");
            toast.success(sessionStorage.getItem("passwordUpdateMsg"));
            sessionStorage.removeItem("passwordUpdateMsg");
        }
        // eslint-disable-next-line
    }, []);
    return (
        <>
            {" "}
            <Helmet>
                <title>Energy Domain Data</title>
            </Helmet>
            <HomeView />
        </>
    );
};

export default Home;
