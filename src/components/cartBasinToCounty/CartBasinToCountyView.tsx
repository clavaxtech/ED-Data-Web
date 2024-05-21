import React from "react";
import { CartBasinToCountyViewProps } from "../models/page-props";
import "react-datepicker/dist/react-datepicker.css";

import CartBasinFilterSection from "./CartBasinFilterSection";
import CartBasinTableSection from "./CartBasinTableSection";

const CartBasinToCountyView = (props: CartBasinToCountyViewProps) => {
    // const searchBlockRef = React.useRef<HTMLDivElement>(null);

    return (
        <>
            <CartBasinFilterSection />
            {/* <CartBasinTableSection searchBlockRef={searchBlockRef} /> */}
            <CartBasinTableSection />
        </>
    );
};

export default CartBasinToCountyView;
