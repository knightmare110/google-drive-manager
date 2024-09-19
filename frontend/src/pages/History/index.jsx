import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_API_URL } from '../../utils/constant';
import LoadingSpinner from '../../components/LoadingSpinner'; // Import the spinner

const History = () => {
  const [history, setHistory] = useState([]);
  const [lastKey, setLastKey] = useState(null); // Pagination key
  const [isFetching, setIsFetching] = useState(false); // Loading state

  const fetchHistory = async (paginationKey = null) => {
    setIsFetching(true); // Start loading
    try {
      const { data } = await axios.get(`${BASE_API_URL}history`, {
        params: { lastKey: paginationKey }, // Pass pagination key (if any)
        withCredentials: true,
      });

      setHistory((prevHistory) => [...prevHistory, ...data.items]);
      setLastKey(data.lastKey); // Update lastKey for pagination
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setIsFetching(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchHistory(); // Initial load of history data
  }, []);

  return (
    <div>
      {isFetching && <LoadingSpinner />} {/* Show full-screen spinner during data fetch */}

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
              <td className="py-2 px-4">{new Date(item.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center">
        {lastKey && (
          <button 
            onClick={() => fetchHistory(lastKey)} 
            disabled={isFetching} 
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            {isFetching ? 'Loading...' : 'Load More'}
          </button>
        )}
      </div>
    </div>
  );
};

export default History;
