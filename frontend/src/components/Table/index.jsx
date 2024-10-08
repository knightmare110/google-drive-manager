import React from "react";

// Reusable Table Component
const Table = ({ columns = {}, data = [], renderRowActions }) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr role="row">
            {Object.values(columns).map((column, index) => (
              <th key={index} scope="col" className="px-6 py-3">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              role="row"
            >
              {Object.entries(row).map(([key, value], colIndex) => {
                if (key in columns) {
                  return (
                    <td key={`${rowIndex}-${colIndex}`} className="px-6 py-4">
                      {value}
                    </td>
                  );
                }
                return null; // Prevent returning undefined
              })}
              {/* Render row actions if provided */}
              {renderRowActions && (
                <td className="px-6 py-4">
                  {renderRowActions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
