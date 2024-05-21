import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
export const PageNotFound = () => {
    return (
        <>
            <Helmet>
                <title>404</title>
            </Helmet>
            <section className="page_404">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12 ">
                            <div className="text-center">
                                <div className="four_zero_four_bg">
                                    <h1 className="text-center ">404</h1>
                                </div>
                                <div className="contantText">
                                    <h3>We can't find that page</h3>
                                    <p>
                                        We're fairly sure that page used to be
                                        here, but seems to have gone missing.{" "}
                                        <span>
                                            We do apologise on it's behalf.
                                        </span>
                                    </p>

                                    <Link to="/" className="btn btn-primary">
                                        Go to Home
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
        </>
    );
};
