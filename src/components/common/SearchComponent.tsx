import React, { useEffect } from "react";
import { SearchCompCartSelectBasinCounty } from "../models/page-props";
import { useForm } from "react-hook-form";
import InputComponent from "./InputComponent";
import useDebounceTerm from "../hooks/useDebounceTerms";
import { toast } from "react-toastify";

function SearchComponent({
    onSearchChange,
    onSearchBtnClick,
    clickOutside,
    clickOutSideFn,
    ...rest
}: SearchCompCartSelectBasinCounty) {
    const {
        register,
        watch,
        setValue,
        formState: { errors },
    } = useForm<{ search: string }>({});
    const search = watch("search");
    const elementValue = (document.getElementById("search") as HTMLInputElement)
        ?.value;
    const debouncedSearchTerm = useDebounceTerm(search, 500);
    useEffect(() => {
        onSearchChange(search);
         // eslint-disable-next-line
    }, [debouncedSearchTerm]);

    useEffect(() => {
        if (elementValue === "" && search !== "") {
            setValue("search", "");
        }
         // eslint-disable-next-line
    }, [elementValue]);
    return (
        <>
            <InputComponent
                name="search"
                id="search"
                register={register}
                errorMsg={errors?.search?.message}
                {...rest}
            />
            <button
                type={"button"}
                className="btn"
                onClick={() => {
                    if (search) {
                        onSearchBtnClick(search);
                    } else {
                        toast.info(`Please enter a value.`, {
                            autoClose: 2000,
                        });
                    }
                }}
            >
                <i className="fa-solid fa-magnifying-glass"></i>
            </button>
        </>
    );
}

export default SearchComponent;
