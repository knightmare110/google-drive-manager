import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_API_URL } from "../../utils/constant";

const History = () => {
  const [history, setHistory] = useState([]);
  const [pageToken, setPageToken] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);

  const fetchHistory = async (pageToken = null) => {
    const { data } = await axios.get(`${BASE_API_URL}history`, {
      params: { pageToken },
      withCredentials: true,
    });
    setHistory(data.items);
    setNextPageToken(data.nextPageToken);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">History</h2>
      <table className="w-full bg-white shadow-md rounded mb-4">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="py-2 px-4">File Name</th>
            <th className="py-2 px-4">File Type</th>
            <th className="py-2 px-4">Action</th>
            <th className="py-2 px-4">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item) => (
            <tr key={item.id}>
              <td className="py-2 px-4">{item.name}</td>
              <td className="py-2 px-4">{item.mimeType}</td>
              <td className="py-2 px-4">{item.type}</td>
              <td className="py-2 px-4">
                {new Date(item.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between">
        {pageToken && (
          <button
            onClick={() => fetchHistory(pageToken)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Previous
          </button>
        )}
        {nextPageToken && (
          <button
            onClick={() => fetchHistory(nextPageToken)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default History;
