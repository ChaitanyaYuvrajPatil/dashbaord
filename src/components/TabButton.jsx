import React from "react";
import { themes } from "../theme/theme";

export const TabButton = ({ active, onClick, children, theme }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
      active
        ? `${themes[theme].selected} ${themes[theme].text}`
        : `${themes[theme].cardBg} ${themes[theme].subtext} ${themes[theme].hover}`
    }`}
  >
    {children}
  </button>
);
