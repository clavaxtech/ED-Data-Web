import React, {  useLayoutEffect } from "react";
import { Helmet } from "react-helmet";
import CartBasinToCountyView from "../../components/cartBasinToCounty/CartBasinToCountyView";
import { CartBasinToCountyProps } from "../../components/models/page-props";
import withSideNav from "../../components/HOC/withSideNav";
import { useAppDispatch, useAppSelector } from "../../components/hooks/redux-hooks";
import { toggleViewAnalytics } from "../../components/store/actions/wells-rigs-action";
import { handleHideSearchFilter } from "../../components/store/actions/cart-basin-to-county-actions";

const CartBasinToCountry = (props: CartBasinToCountyProps) => {
    const {
        wellsAndRigs: { viewAnalytics },
    } = useAppSelector(state => state);
    const dispatch = useAppDispatch();
    useLayoutEffect(() => {
        viewAnalytics && dispatch(toggleViewAnalytics());
        return () => {
            viewAnalytics && dispatch(toggleViewAnalytics());
            dispatch(handleHideSearchFilter(true))
        }
    }, [])
    return (
        <>
            <Helmet>
                <title>Energy Domain Data</title>
            </Helmet>
            <CartBasinToCountyView />
        </>
    );
};

export default withSideNav(CartBasinToCountry, true);
