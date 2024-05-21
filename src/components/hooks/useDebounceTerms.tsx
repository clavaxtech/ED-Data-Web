import { useEffect, useState } from "react";

export default function useDebounceTerm(value: string, delay: number) {
    // State and setters for debounced value
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(
        () => {
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);
            return () => {
                clearTimeout(handler);
            };
        },
        // eslint-disable-next-line
        [value]
    );

    return debouncedValue;
}
