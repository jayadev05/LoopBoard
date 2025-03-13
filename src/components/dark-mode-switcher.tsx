"use client";

import { useState, useEffect } from "react";
import { MoonIcon, SunIcon } from "lucide-react";

export  function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative flex h-6 w-12 cursor-pointer items-center rounded-full 
                 bg-gray-300 dark:bg-[#2563eb] transition-colors duration-300"
    >
      {/* Switch Thumb (Moving Circle) */}
      <div
        className="absolute left-1 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-md 
                   transition-all duration-300 dark:translate-x-6 dark:bg-gray-100"
      >
        {/* Icons Inside the Thumb */}
        <MoonIcon
          size={10}
          className="absolute text-gray-700 opacity-0 transition-opacity duration-200 dark:opacity-100"
        />
        <SunIcon
          size={10}
          className="absolute text-gray-500 opacity-100 transition-opacity duration-200 dark:opacity-0"
        />
      </div>
    </div>
  );
}
