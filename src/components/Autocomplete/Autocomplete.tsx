import { useRef, useEffect } from "react";
import { autoComplete } from "../models/submit-form";
export const GoogleAutocomplete = ({ name, register, placeholder, className }: autoComplete) => {
    const autoCompleteRef = useRef()
    const inputRef = useRef<HTMLInputElement | null>(null);

    const { ref, ...rest } = register(name)

    const options = {
        componentRestrictions: { country: "ng" },
        fields: ["address_components", "geometry", "icon", "name"],
        types: ["establishment"]
    };

    useEffect(() => {
        autoCompleteRef.current = new (window as any).google.maps.places.Autocomplete(
            inputRef.current,
            options
        );
        (autoCompleteRef.current as any).addListener("place_changed", () => {
            fetchAddress()
        })
    }, []);

    const fetchAddress = () => {
        const place = (autoCompleteRef.current as any).getPlace()


    }


    return (
        <input type="text" className={className} {...rest} name={name} placeholder={placeholder} ref={(e) => {
            ref(e)
            inputRef.current = e
        }} />
    )

}