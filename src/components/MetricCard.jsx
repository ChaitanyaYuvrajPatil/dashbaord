import React from "react";
import { themes } from "../theme/theme";

export const MetricCard = ({ icon: Icon, title, value, theme }) => (
  <div
    className={`${themes[theme].cardBg} p-6 rounded-lg shadow-lg transition-colors duration-300`}
  >
    <div className="flex items-center gap-4">
      <div className={`p-3 ${themes[theme].secondary} rounded-full`}>
        <Icon
          className={`w-6 h-6 ${
            theme === "dark" ? "text-blue-400" : "text-blue-600"
          }`}
        />
      </div>
      <div>
        <h3 className={`text-sm ${themes[theme].subtext}`}>{title}</h3>
        <p className={`text-2xl font-semibold text-left ${themes[theme].text}`}>
          {value}
        </p>
      </div>
    </div>
  </div>
);
