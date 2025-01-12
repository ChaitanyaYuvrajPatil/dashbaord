import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import _ from "lodash";
import Papa from "papaparse";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { themes } from "../theme/theme";
import { ExportDropdown } from "./ExportDropdown";

export const DataTable = ({ data, theme }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const rowsPerPage = 10;

  const columns = [
    { key: "Make", label: "Make" },
    { key: "Model", label: "Model" },
    { key: "Model Year", label: "Year" },
    { key: "Electric Vehicle Type", label: "Type" },
    { key: "Electric Range", label: "Range (mi)" },
    { key: "Base MSRP", label: "MSRP ($)" },
    { key: "County", label: "County" },
  ];

  // Filter data based on search term
  const filteredData = data.filter((item) =>
    columns.some((column) =>
      String(item[column.key]).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort data
  const sortedData = _.orderBy(
    filteredData,
    [sortConfig.key],
    [sortConfig.direction]
  );

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const handleExport = (type) => {
    // Get current filtered and sorted data
    const currentData = paginatedData;

    if (type === "csv") {
      const csv = Papa.unparse(currentData);
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ev_data.csv";
      a.click();
    } else if (type === "pdf") {
      const doc = new jsPDF();

      // Add title and metadata
      doc.setFontSize(16);
      doc.text("Electric Vehicle Population Data", 14, 15);
      doc.setFontSize(10);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 25);
      doc.text(`Filtered results: ${currentData.length} entries`, 14, 30);

      // Create table
      autoTable(doc, {
        head: [columns.map((col) => col.label)],
        body: currentData.map((row) =>
          columns.map((col) => {
            const value = row[col.key];
            if (col.key === "Base MSRP") {
              return value ? `${Number(value).toLocaleString()}` : "";
            }
            return value;
          })
        ),
        startY: 35,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 139, 202] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: 35 },
      });

      doc.save("ev_data.pdf");
    }
  };

  return (
    <div className={`${themes[theme].cardBg} rounded-lg shadow-lg p-6`}>
      {/* Search Bar */}
      <div className="mb-6">
        <h2 className={`text-2xl font-bold ${themes[theme].text} mb-2`}>
          Electric Vehicle Population Data
        </h2>
        <p className={`${themes[theme].subtext} mb-4`}>
          Comprehensive dataset of electric vehicles including make, model,
          range, and location information. Use the search bar to filter data and
          column headers to sort.
        </p>
        <div className="flex justify-between items-center mb-4">
          <div className="relative flex-1 mr-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full p-2 pl-10 rounded-lg border ${themes[theme].border} ${themes[theme].cardBg} ${themes[theme].text}`}
            />
            <Search
              className={`absolute left-3 top-2.5 w-5 h-5 ${themes[theme].subtext}`}
            />
          </div>
          <ExportDropdown onExport={handleExport} theme={theme} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${themes[theme].border}`}>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => handleSort(column.key)}
                  className={`p-2 text-center cursor-pointer ${themes[theme].text}`}
                >
                  {column.label}
                  {sortConfig.key === column.key && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr
                key={index}
                className={`border-b ${themes[theme].border} ${themes[theme].hover}`}
              >
                {columns.map((column) => (
                  <td key={column.key} className={`p-2 ${themes[theme].text}`}>
                    {column.key === "Base MSRP"
                      ? `$${Number(item[column.key]).toLocaleString()}`
                      : item[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className={`${themes[theme].text}`}>
          Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
          {Math.min(currentPage * rowsPerPage, sortedData.length)} of{" "}
          {sortedData.length} entries
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg ${themes[theme].cardBg} ${themes[theme].text} disabled:opacity-50`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className={`${themes[theme].text}`}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg ${themes[theme].cardBg} ${themes[theme].text} disabled:opacity-50`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
