import React from "react";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle = ({ theme, toggleTheme }) => (
  <button
    onClick={toggleTheme}
    className={`fixed top-6 right-6 p-3 rounded-full transition-all duration-300 ${
      theme === "dark"
        ? "bg-gray-800 text-yellow-400"
        : "bg-blue-100 text-gray-800"
    } hover:scale-110`}
  >
    {theme === "dark" ? (
      <Sun className="w-6 h-6" />
    ) : (
      <Moon className="w-6 h-6" />
    )}
  </button>
);
