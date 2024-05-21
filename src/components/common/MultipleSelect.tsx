import React, { Fragment, ReactNode, useEffect, useState } from "react";
import { OptionProps, components, defaultTheme } from "react-select";
// import { AsyncPaginate } from "react-select-async-paginate";
import type { GroupBase, InputActionMeta, MultiValue, SelectInstance } from "react-select";
import { Controller } from "react-hook-form";
import {
    dropDownmenuProps,
    multiSelectProps,
    reactSelectProps,
} from "../models/page-props";
import type { ReactElement } from "react";

import Creatable from "react-select/creatable";
import type { CreatableProps } from "react-select/creatable";
import { AsyncPaginate, withAsyncPaginate } from "react-select-async-paginate";
import type {
    UseAsyncPaginateParams,
    ComponentProps
} from "react-select-async-paginate";

const { colors } = defaultTheme;

type AsyncPaginateCreatableProps<
    OptionType,
    Group extends GroupBase<OptionType>,
    Additional,
    IsMulti extends boolean
> = CreatableProps<OptionType, IsMulti, Group> &
    UseAsyncPaginateParams<OptionType, Group, Additional> &
    ComponentProps<OptionType, Group, IsMulti>;

type AsyncPaginateCreatableType = <
    OptionType,
    Group extends GroupBase<OptionType>,
    Additional,
    IsMulti extends boolean = false
>(
    props: AsyncPaginateCreatableProps<OptionType, Group, Additional, IsMulti>
) => ReactElement;

const CreatableAsyncPaginate = withAsyncPaginate(
    Creatable
) as AsyncPaginateCreatableType;

export const Multiselect = (props: multiSelectProps<[]>) => {
    const selectRef = React.useRef<SelectInstance<
        reactSelectProps,
        boolean,
        GroupBase<reactSelectProps>
    > | null>();
    let {
        name,
        control,
        showerror,
        defaultValue,
        handleLoadOption,
        placeholderText,
        children,
        searchPlaceholderText,
        refHandle,
        cacheUniqs,
        isMulti,
        onChangeHandle,
        async,
        menuPosition,
        removedOption,
        isOpen,
        setIsOpen
    } = props;
    // const [isOpen, setIsOpen] = useState(false);
    const toggleOpen = () => setIsOpen((prev) => !prev);

    const removeSelectedValue = (
        e: React.MouseEvent<HTMLElement>,
        removed: reactSelectProps,
        handleChange: (ev: reactSelectProps[]) => void,
        selectedOption: reactSelectProps[]
    ) => {
        e.stopPropagation();
        removedOption && removedOption(removed)
        handleChange(selectedOption.filter((v) => (v.value !== removed.value && v.value !== "select_all")));
    };

    const onDomClick = (e: any) => {
        if (refHandle && !refHandle.contains(e.target)) {
            if (isOpen) setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", onDomClick);
        if (isOpen && selectRef.current) { selectRef.current.focus(); }
        return () => {
            document.removeEventListener("mousedown", onDomClick);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);


    const [inputValue, setInputValue] = useState('')
    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            render={({
                field: { onChange, ref, ...rest },
                formState: { errors },
            }) => (
                <Fragment>
                    <DropDownMenu
                        isOpen={isOpen}
                        target={
                            <button
                                className="select-btn"
                                type="button"
                                title={rest?.value?.length ? rest.value.map((_i: reactSelectProps) => _i.label).join() : ""}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    toggleOpen();
                                }}
                            >
                                {rest.value.length ? (
                                    <>
                                        {rest.value.map(
                                            (
                                                selectedProps: reactSelectProps,
                                                index: number
                                            ) => (
                                                <div
                                                    className="tag"
                                                    key={index}
                                                >
                                                    {selectedProps.label}
                                                    <small
                                                        onMouseDown={(e) =>
                                                            removeSelectedValue(
                                                                e,
                                                                selectedProps,
                                                                onChange,
                                                                rest.value
                                                            )
                                                        }
                                                    >
                                                        X
                                                    </small>
                                                </div>
                                            )
                                        )}
                                    </>
                                ) : (
                                    placeholderText
                                )}
                            </button>
                        }
                    >
                        {async ? <AsyncPaginate
                            isMulti={isMulti}
                            {...rest}
                            autoFocus
                            selectRef={(e) => {
                                ref(e);
                                selectRef.current = e;
                            }}
                            menuPosition={menuPosition}
                            menuIsOpen={isOpen}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    setIsOpen(false);
                                    sessionStorage.setItem("menuIsOpen", JSON.stringify(isOpen))
                                }
                            }}
                            debounceTimeout={700}
                            isClearable={false}
                            closeMenuOnSelect={false}
                            additional={{ page: 1 }}
                            hideSelectedOptions={false}
                            backspaceRemovesValue={false}
                            loadOptions={handleLoadOption}
                            controlShouldRenderValue={false}
                            inputValue={inputValue}
                            onInputChange={(inputVal: string, actionMeta: InputActionMeta) => {
                                const { action, prevInputValue } = actionMeta;
                                if (action === "menu-close") {
                                    isOpen ? setInputValue(prevInputValue) : setInputValue("");
                                    return
                                }
                                if (action === "input-blur") {
                                    isOpen ? setInputValue(prevInputValue) : setInputValue('');
                                    return
                                }
                                if (action === "input-change") {
                                    setInputValue(inputVal);
                                    return
                                }
                                if (action === "set-value") {
                                    setInputValue(inputVal || prevInputValue);
                                    return
                                }
                            }}
                            placeholder={searchPlaceholderText}
                            onChange={(ev, actionMeta) => {
                                !isMulti
                                    ? onChange([ev])
                                    : onChange([
                                        ...(ev as MultiValue<reactSelectProps>),
                                    ]);
                                onChangeHandle && onChangeHandle((ev as reactSelectProps | reactSelectProps[]), actionMeta)
                                // setIsOpen(false);
                            }}
                            // onFocus={() => {
                            //     sessionStorage.setItem("menuIsOpen", JSON.stringify(isOpen))
                            // }}
                            classNamePrefix={"react-select-dropdown"}
                            className={isOpen ? "selectdropdown" : "d-none"}
                            isOptionDisabled={() => rest.value.length >= 50}
                            components={{
                                Option: HtmlCheckBox,
                                IndicatorSeparator: null,
                                DropdownIndicator: DropdownIndicator,
                                MenuList
                            }}
                            {...(cacheUniqs && { cacheUniqs: cacheUniqs })}
                        /> :
                            <CreatableAsyncPaginate
                                allowCreateWhileLoading
                                formatCreateLabel={userInput => `Search for ${userInput}`}
                                createOptionPosition="first"
                                isMulti={isMulti}
                                {...rest}
                                autoFocus
                                selectRef={(e) => {
                                    ref(e);
                                    selectRef.current = e;
                                }}
                                menuIsOpen={isOpen}
                                // onFocus={() => {
                                //     sessionStorage.setItem("menuIsOpen", JSON.stringify(isOpen))
                                // }}
                                inputValue={inputValue}
                                onInputChange={(inputVal: string, actionMeta: InputActionMeta) => {
                                    const { action, prevInputValue } = actionMeta;
                                    if (action === "menu-close") {
                                        isOpen ? setInputValue(prevInputValue) : setInputValue("");
                                        return
                                    }
                                    if (action === "input-blur") {
                                        isOpen ? setInputValue(prevInputValue) : setInputValue('');
                                        return
                                    }
                                    if (action === "input-change") {
                                        setInputValue(inputVal);
                                        return
                                    }
                                    if (action === "set-value") {
                                        setInputValue(inputVal || prevInputValue);
                                        return
                                    }
                                    // setInputValue(inputValue)
                                }}
                                debounceTimeout={700}
                                isClearable={false}
                                closeMenuOnSelect={false}
                                additional={{ page: 1 }}
                                hideSelectedOptions={false}
                                backspaceRemovesValue={false}
                                loadOptions={handleLoadOption}
                                controlShouldRenderValue={false}
                                placeholder={searchPlaceholderText}
                                onChange={(ev, actionMeta) => {
                                    !isMulti
                                        ? onChange([ev])
                                        : onChange([
                                            ...(ev as MultiValue<reactSelectProps>),
                                        ]);
                                    onChangeHandle && onChangeHandle((ev as reactSelectProps | reactSelectProps[]), actionMeta)
                                    // setIsOpen(false);
                                }}
                                classNamePrefix={"react-select-dropdown"}
                                className={isOpen ? "selectdropdown" : "d-none"}
                                isOptionDisabled={() => rest.value.length >= 50}
                                components={{
                                    Option: HtmlCheckBox,
                                    IndicatorSeparator: null,
                                    DropdownIndicator: DropdownIndicator,
                                    LoadingIndicator: DotsIndicator,
                                    MenuList
                                }}
                                {...(cacheUniqs && { cacheUniqs: cacheUniqs })}
                            />}
                    </DropDownMenu>
                    {children}
                    {showerror && (
                        <span className={`error`}>
                            <>{errors[name]?.message}</>
                        </span>
                    )}
                </Fragment>
            )}
        />
    );
};

const Svg = (p: React.SVGProps<SVGSVGElement>) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        focusable="false"
        role="presentation"
        {...p}
    />
);

const HtmlCheckBox = (
    props: OptionProps<reactSelectProps, boolean, GroupBase<reactSelectProps>>
) => {
    return <components.Option {...props}>{props.label}</components.Option>;
};

const DropDownMenu = (props: dropDownmenuProps) => {
    // eslint-disable-next-line
    let { children, isOpen, target } = props;
    return (
        <>
            {target}
            <Menu>{children}</Menu>
            {/* {isOpen ? <Menu>{children}</Menu> : null} */}
        </>
    );
};

const Menu = (props: { children: ReactNode }) => {
    return <div {...props} />;
};
const DotsIndicator = () => {
    return <Fragment></Fragment>;
};

const DropdownIndicator = () => (
    <div style={{ color: colors.neutral20, height: 24, width: 32 }}>
        <Svg>
            <path
                d="M16.436 15.085l3.94 4.01a1 1 0 0 1-1.425 1.402l-3.938-4.006a7.5 7.5 0 1 1 1.423-1.406zM10.5 16a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11z"
                fill="currentColor"
                fillRule="evenodd"
            />
        </Svg>
    </div>
);

function MenuList(props: any) {

    if (props.isLoading) {
        return <components.MenuList {...props} />;
    }

    const selectedOptions = props.children?.filter?.((childNode: any) => childNode.props.isSelected) ?? [];
    const nonSelectedOptions = props.children?.filter?.((childNode: any) => !childNode.props.isSelected) ?? [];

    // Check if option list is empty
    if (selectedOptions.length === 0 && nonSelectedOptions.length === 0) {
        return (<components.MenuList {...props} />);
    };

    const childrenToRender = [...selectedOptions, ...nonSelectedOptions];

    // Maintain scroll position by providing a stable key for each child
    const childrenWithKeys = childrenToRender.map((child, index) => {
        return React.cloneElement(child, { key: index });
    });

    return (
        <components.MenuList {...props}>
            {childrenWithKeys}
        </components.MenuList>
    );
}