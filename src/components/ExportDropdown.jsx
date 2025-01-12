import React, { useState } from "react";
import { FileDown } from "lucide-react";
import { themes } from "../theme/theme";

export const ExportDropdown = ({ onExport, theme }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${themes[theme].cardBg} ${themes[theme].text} ${themes[theme].hover}`}
      >
        <FileDown className="w-4 h-4" />
        Export
      </button>
      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg ${themes[theme].cardBg} z-10`}
        >
          <button
            onClick={() => {
              onExport("csv");
              setIsOpen(false);
            }}
            className={`w-full text-left px-4 py-2 ${themes[theme].text} ${themes[theme].hover} rounded-t-lg`}
          >
            Export as CSV
          </button>
          <button
            onClick={() => {
              onExport("pdf");
              setIsOpen(false);
            }}
            className={`w-full text-left px-4 py-2 ${themes[theme].text} ${themes[theme].hover} rounded-b-lg`}
          >
            Export as PDF
          </button>
        </div>
      )}
    </div>
  );
};
