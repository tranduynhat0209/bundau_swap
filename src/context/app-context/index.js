import React, { useCallback, useMemo, useState } from "react";

const AppContext = React.createContext({});

const getDefaultThemeMode = () =>{
    let theme = window.localStorage.getItem("theme");
    if(theme !== "light" && theme !== "dark"){
        theme = "light";
        window.localStorage.setItem("theme", theme);
    }
    return theme;
}

export function AppProvider({children}){
    const [theme, setTheme] = useState(getDefaultThemeMode());
    const toggleTheme = useCallback(() =>{
        setTheme(prev => {
            if(prev === "light") return "dark";
            else return "light";
        })
    });

    const contextData = useMemo(
        () =>({
            themeMode: theme,
            toggleThemeMode: toggleTheme
        }), [theme]
    )
    return <AppContext.Provider value={contextData}>{children}</AppContext.Provider>
}

export const useAppContext = () => React.useContext(AppContext);