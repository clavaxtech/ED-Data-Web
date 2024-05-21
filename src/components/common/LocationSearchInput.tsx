import React from "react";
import PlacesAutocomplete from "react-places-autocomplete";
import { LocationSearchInputProps } from "../models/page-props";
import { Controller } from "react-hook-form";
const LocationSearchInput = ({
    valueLoc,
    onChangeLoc,
    onSelect,
    placeholder,
    name,
    errorMsg,
    control,
    debounce,
    searchOptions,
    onBlur,
    onFocus,
    shouldFetchSuggestions,
    disabled,
    ...rest
}: LocationSearchInputProps) => {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value, ...field } }) => (
                <>
                    <PlacesAutocomplete
                        value={valueLoc}
                        onChange={(e) => {
                            onChange(e);
                            onChangeLoc(e);
                        }}
                        onSelect={onSelect}
                        debounce={debounce}
                        searchOptions={searchOptions}
                        shouldFetchSuggestions={shouldFetchSuggestions}
                        onError={(err) => console.log({ err })}
                    >
                        {({
                            getInputProps,
                            suggestions,
                            getSuggestionItemProps,
                            loading,
                        }) => (
                            <div>
                                <input
                                    {...getInputProps({
                                        placeholder: placeholder,
                                        className: "form-control",
                                        onBlur: (e) => {
                                            onBlur && onBlur(e);
                                        },
                                        onFocus: () => {
                                            onFocus && onFocus();
                                        },
                                        disabled: disabled,
                                        ...rest,
                                    })}
                                />
                                <div className="autocomplete-dropdown-container">
                                    {loading && (
                                        <div className="loaderText">
                                            Loading...
                                        </div>
                                    )}
                                    {suggestions.map((suggestion, key) => {
                                        // const className = suggestion.active
                                        //     ? "suggestion-item--active"
                                        //     : "suggestion-item";
                                        // inline style for demonstration purpose
                                        // const style = suggestion.active
                                        //     ? {
                                        //           backgroundColor: "#fafafa",
                                        //           cursor: "pointer",
                                        //       }
                                        //     : {
                                        //           backgroundColor: "#ffffff",
                                        //           cursor: "pointer",
                                        //       };
                                        return (
                                            <div
                                                className="suggestionLi"
                                                {...getSuggestionItemProps(
                                                    suggestion
                                                    // {
                                                    //     className,
                                                    //     style,
                                                    // }
                                                )}
                                                key={key}
                                            >
                                                <span>
                                                    {suggestion.description}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </PlacesAutocomplete>
                    {errorMsg && <span className={`error`}>{errorMsg}</span>}
                </>
            )}
        />
    );
};

export default LocationSearchInput;
