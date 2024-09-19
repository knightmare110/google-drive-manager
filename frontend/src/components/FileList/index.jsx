import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_API_URL } from "../../utils/constant";

const FileList = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const { data } = await axios.get("http://localhost:5000/api/drive/files", {
      withCredentials: true, // Include cookies
    });
    setFiles(data);
  };

  const downloadFile = async (fileId) => {
    const response = await axios.get(
      `http://localhost:5000/api/drive/files/${fileId}`,
      {
        withCredentials: true,
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "file");
    document.body.appendChild(link);
    link.click();
  };

  const deleteFile = async (fileId) => {
    await axios.delete(`${BASE_API_URL}drive/files/${fileId}`, {
      withCredentials: true,
    });
    fetchFiles();
  };

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                File Name
              </th>
							<th scope="col" className="px-6 py-3">
                File Type
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
						{files.map((file) => (
							<tr key={file.id} className="bg-white dark:bg-gray-800">
								<th
									scope="row"
									className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
								>
									{file.name}
								</th>
								<th
									scope="row"
									className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
								>
									{file.mimeType}
								</th>
								<td className="px-6 py-4">
									<a
										href="#"
										onClick={() => downloadFile(file.id)}
										className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
									>
										Download
									</a>
								</td>
								<td className="px-6 py-4">
									<a
										href="#"
										onClick={() => deleteFile(file.id)}
										className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
									>
										Delete
									</a>
								</td>
							</tr>
						))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FileList;
