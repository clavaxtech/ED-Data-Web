import { useState } from "react";
import { Multiselect } from "../common/MultipleSelect";
import { cartBasinMultiSelectProps } from "../models/page-props";

const CartBasinMultiSelectFields = (props: cartBasinMultiSelectProps) => {
    let {
        itemsRef,
        control,
        extraField,
        name,
        showerror,
        fetchOptionHandler,
        index,
        searchPlaceholderText,
        placeholderText,
        defaultValue,
        children,
        cacheUniqs,
        isMulti,
        onChangeHandle,
        async,
        menuPosition,
        removedOption
    } = props;
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className={`selectInputdropDown ${isOpen ? "is-open" : ''}`}
            ref={(el: HTMLDivElement) => {
                itemsRef.current[index] = el;
                return el;
            }}
        >
            <Multiselect
                name={name}
                async={async}
                isMulti={isMulti}
                control={control}
                showerror={showerror}
                defaultValue={defaultValue}
                cacheUniqs={cacheUniqs || []}
                placeholderText={placeholderText}
                refHandle={itemsRef.current[index]}
                searchPlaceholderText={searchPlaceholderText}
                handleLoadOption={(search, prevOption, additional) =>
                    fetchOptionHandler(
                        search,
                        prevOption,
                        { ...additional, name },
                        extraField
                    )
                }
                menuPosition={menuPosition}
                removedOption={removedOption}
                onChangeHandle={onChangeHandle}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            >
                {children}
            </Multiselect>
        </div >
    );
};

export default CartBasinMultiSelectFields;
