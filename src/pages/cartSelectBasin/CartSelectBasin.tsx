import { Helmet } from "react-helmet";
import CartSelectBasinView from "../../components/cartSelectBasin/CartSelectBasinView";
import { CartSelectBasinProps } from "../../components/models/page-props";
import {
    useAppDispatch,
    useAppSelector,
} from "../../components/hooks/redux-hooks";
import { showCheckOutModal } from "../../components/store/actions/modal-actions";
import useIdle from "../../components/hooks/useIdleTimer";
import { CHECK_OUT_MODAL_TIMEOUT } from "../../utils/helper";
import withSideNav from "../../components/HOC/withSideNav";

const CartSelectBasin = (props: CartSelectBasinProps) => {
    const {
        auth: {
            user: {
                access_token,
                company_data: { company_id },
                company_configs: { free_trial_period_enabled, is_trial_never_end }
            },
        },
        cartSelectBasinCounty: { cartListItems },
    } = useAppSelector((state) => state);
    const dispatch = useAppDispatch();
    const { activate } = useIdle({
        timeout: CHECK_OUT_MODAL_TIMEOUT,
        throttle: 500,
        onIdle: () => {
            if ((free_trial_period_enabled && company_id) || (is_trial_never_end)) {
                return
            }
            if (access_token && cartListItems.length > 0 && company_id) {
                dispatch(showCheckOutModal());
            }
        },
    });
    return (
        <>
            <Helmet>
                <title>Energy Domain Data</title>
            </Helmet>
            <CartSelectBasinView activate={activate} />
        </>
    );
};

export default withSideNav(CartSelectBasin, true);
