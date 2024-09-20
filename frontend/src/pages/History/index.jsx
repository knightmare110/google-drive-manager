import React, { useEffect, useState } from "react";
import { HISTORY_TABLE_COLUMNS } from "../../utils/constant";
import LoadingSpinner from "../../components/LoadingSpinner";
import Table from "../../components/Table"; // Import the reusable Table component
import { listHistory } from "../../apis/history";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState(null);

  const limit = 10;

  useEffect(() => {
    fetchHistory(page);
  }, [page]);

  // Fetch history logs with pagination
  const fetchHistory = async (page) => {
    setLoading(true);
    console.log('ttt', page, limit, lastEvaluatedKey);
    const { response, error, success } = await listHistory({
      page,
      limit,
      LastEvaluatedKey: lastEvaluatedKey,
    });
    if (success) {
      setHistory(response.data.history);
      setLastEvaluatedKey(response.data.lastEvaluatedKey);
    } else {
      console.error("Error fetching history:", error);
    }
    setLoading(false);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0) setPage(newPage);
  };

  // Prepare the data for the table rows
  const tableData = history.map((log) => ({
    name: log.name,
    mimeType: log.mimeType,
    size: `${(log.size / 1000).toFixed(2)} KB`,
    type: log.type === 0 ? "Upload" : log.type === 1 ? "Download" : "Delete",
    isSucceed: log.isSucceed ? (
      <span className="text-green-500 font-semibold">Success</span>
    ) : (
      <span className="text-red-500 font-semibold">Failed</span>
    ),
    createdAt: new Date(log.createdAt).toLocaleString(),
  }));

  return (
    <div data-testid="history-page">
      {loading && <LoadingSpinner data-testid="loading-spinner" />}

      <div className="w-full rounded-xl z-10">
        <h2
          className="mt-5 text-3xl font-bold text-gray-900"
          data-testid="history-heading"
        >
          View History
        </h2>

        {/* Use reusable Table component */}
        <Table columns={HISTORY_TABLE_COLUMNS} data={tableData} />

        {/* Pagination Controls */}
        <div
          className="flex justify-between items-center mt-4"
          data-testid="pagination-controls"
        >
          <button
            onClick={() => handlePageChange(page - 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            disabled={page === 1}
            data-testid="prev-page-button"
          >
            Prev
          </button>

          <span className="text-sm text-gray-500" data-testid="page-indicator">
            Page {page}
          </span>

          <button
            onClick={() => handlePageChange(page + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
            disabled={!lastEvaluatedKey}
            data-testid="next-page-button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default History;
