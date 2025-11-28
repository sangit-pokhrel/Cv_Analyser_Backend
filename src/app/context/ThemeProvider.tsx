"use client";
import { createContext,useEffect,useState } from "react";
import React from "react";

type ThemeContextType = {
  theme: string;
  toggleTheme: () => void;
};
export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

 const ThemeProvider=({children}:{children:React.ReactNode})=>{
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setTheme(savedTheme);
        }
        else{
          setTheme("light");
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    return(
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
 }

 export default ThemeProvider; 