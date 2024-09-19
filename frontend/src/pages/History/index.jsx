import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_API_URL } from "../../utils/constant";
import LoadingSpinner from "../../components/LoadingSpinner";
import Table from "../../components/Table"; // Import the reusable Table component

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
    try {
      const response = await axios.get(`${BASE_API_URL}history`, {
        params: { page, limit, LastEvaluatedKey: lastEvaluatedKey },
      });
      setHistory(response.data.history);
      setLastEvaluatedKey(response.data.lastEvaluatedKey);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0) setPage(newPage);
  };

  // Define the table columns
  const columns = ["File Name", "File Type", "File Size", "Action Type", "Status", "Date"];

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
    <div>
      {loading && <LoadingSpinner />}

      <div className="w-full rounded-xl z-10">
        <h2 className="mt-5 text-3xl font-bold text-gray-900">Upload History</h2>

        {/* Use reusable Table component */}
        <Table columns={columns} data={tableData} />

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => handlePageChange(page - 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            disabled={page === 1}
          >
            Prev
          </button>

          <span className="text-sm text-gray-500">Page {page}</span>

          <button
            onClick={() => handlePageChange(page + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
            disabled={!lastEvaluatedKey}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default History;
