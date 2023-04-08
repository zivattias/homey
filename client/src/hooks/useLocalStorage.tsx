import { useState, useEffect } from "react";

const useLocalStorage = (key: string, defaultValue: string) => {
    const [value, setValue] = useState(() => {
        let currentValue = localStorage.getItem(key);
        if (!currentValue) {
            currentValue = defaultValue;
        }
        return currentValue;
    });

    useEffect(() => {
        localStorage.setItem(key, value);
    }, [value, key]);

    return [value, setValue];
};

export default useLocalStorage;
