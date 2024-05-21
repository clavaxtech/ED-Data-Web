import { Fragment } from "react";
import { cartBasinBubbleProps } from "../models/page-props";

const CartBasinBubble = (props: cartBasinBubbleProps) => {
    const { label, bubbleType, handleBubbleType } = props
    return (
        <div className="form-group">
            <label htmlFor="">{label}</label>
            <ul className="types">
                {
                    bubbleType.length > 0 && bubbleType.map(({ id, title, active }, index) =>
                        <Fragment key={index}>
                            <li onClick={() => handleBubbleType(id)} className={active ? 'active' : ""}>{title}</li>
                        </Fragment>
                    )
                }
            </ul>
        </div>
    )
};

export default CartBasinBubble;
