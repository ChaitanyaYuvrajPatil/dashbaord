import React from "react";
import { ResponsiveContainer } from "recharts";
import { themes } from "../../theme/theme";


export const ChartContainer = ({ title, children, theme }) => (
  <div
    className={`${themes[theme].cardBg} p-6 rounded-lg shadow-lg transition-colors duration-300`}
  >
    <h3 className={`text-lg font-semibold mb-4 ${themes[theme].text}`}>
      {title}
    </h3>
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  </div>
);
