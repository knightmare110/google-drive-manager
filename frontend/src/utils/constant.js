export const BASE_API_URL = "http://localhost:5000/api/";

export const HISTORY_TABLE_COLUMNS = {
  name: "File Name",
  mimeType: "File Type",
  size: "File Size",
  type: "Action Type",
  isSucceed: "Status",
  createdAt: "Date",
};

export const FILE_LIST_TABLE_COLUMNS = {
  name: "File Name",
  mimeType: "MIME Type",
  actions: "Actions",
};

export const HISTORY_MOCK_DATA = [
  {
    name: "file1.txt",
    mimeType: "text/plain",
    size: 1024,
    type: 0,
    isSucceed: true,
    createdAt: "2023-09-12T12:00:00Z",
  },
  {
    name: "file2.jpg",
    mimeType: "image/jpeg",
    size: 2048,
    type: 1,
    isSucceed: false,
    createdAt: "2023-09-13T14:00:00Z",
  },
];
