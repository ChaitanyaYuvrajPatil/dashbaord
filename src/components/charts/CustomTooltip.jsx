import React from "react";
import { themes } from "../../theme/theme";


export const CustomTooltip = ({ active, payload, label, theme }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={`${themes[theme].cardBg} p-2 border ${themes[theme].border} rounded shadow`}
      >
        <p className={`${themes[theme].text}`}>
          {`${label}: ${payload[0].value}`}
        </p>
      </div>
    );
  }
  return null;
};
