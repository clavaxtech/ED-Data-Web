import { SearchCompCartSelectBasinCounty } from "../models/page-props";

const CartBasinSearchComponent = ({
    placeholder,
    onChange,
    searchRef,
    onKeyDown,
    onSearchIconClick,
    onBlur,
    onFocus,
}: SearchCompCartSelectBasinCounty) => {
    return (
        <>
            {/* <input
                type="text"
                className="form-control"
                ref={searchRef}
                onChange={onChange}
                placeholder={placeholder}
                onKeyDown={onKeyDown}
                onBlur={onBlur}
                onFocus={onFocus}
            /> */}
            <button
                className="btn"
                onClick={() => {
                    // onSearchIconClick && onSearchIconClick();
                }}
            >
                <i className="fa-solid fa-magnifying-glass"></i>
            </button>
        </>
    );
};

export default CartBasinSearchComponent;
