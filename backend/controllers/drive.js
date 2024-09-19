const { getDriveInstance, getFileMetadata, logFileHistory, bufferToStream } = require('../utils/driveUtils');

// List Files
const listFiles = async (req, res) => {
  const token = req.cookies.authToken;
  const { pageToken } = req.query; // Get pageToken from query params for pagination

  try {
    const drive = getDriveInstance(token);
    const response = await drive.files.list({
      pageSize: 10, // Number of files per page
      pageToken: pageToken || null, // Use the provided pageToken or null for the first page
      fields: 'nextPageToken, files(id, name, mimeType, modifiedTime)',
    });

    // Send response with files and nextPageToken
    res.json({
      files: response.data.files,
      nextPageToken: response.data.nextPageToken || null, // Pass nextPageToken for pagination
    });
  } catch (error) {
    res.status(500).send('Error fetching files: ' + error.message);
  }
};

// Upload File
const uploadFile = async (req, res) => {
  const { authToken, userEmail } = req.cookies;
  try {
    const drive = getDriveInstance(authToken);
    const fileMetadata = { name: req.file.originalname };
    const media = { mimeType: req.file.mimetype, body: bufferToStream(req.file.buffer) };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, webViewLink, webContentLink',
    });

    const fileDetails = await getFileMetadata(drive, file.data.id);

    await logFileHistory(fileDetails, userEmail, true, 0);
    res.status(201).send(file.data.id);
  } catch (error) {
    await logFileHistory(fileDetails, userEmail, false, 0, error.message);
    res.status(500).send('Error uploading file: ' + error.message);
  }
};

// Download File
const downloadFile = async (req, res) => {
  const { authToken, userEmail } = req.cookies;
  try {
    const drive = getDriveInstance(authToken);
    const fileId = req.params.fileId;
    const fileMetadata = await getFileMetadata(drive, fileId);

    const file = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });

    file.data
      .on('end', async () => {
        await logFileHistory(fileMetadata, userEmail, true, 1);
        res.status(200).end();
      })
      .on('error', async (err) => {
        await logFileHistory(fileMetadata, userEmail, false, 1, err.message);
        res.status(500).send('Error downloading file: ' + err.message);
      })
      .pipe(res);
  } catch (error) {
    res.status(500).send('Error downloading file: ' + error.message);
  }
};

// Delete File
const deleteFile = async (req, res) => {
  const { authToken, userEmail } = req.cookies;
  try {
    const drive = getDriveInstance(authToken);
    const fileId = req.params.fileId;
    const fileMetadata = await getFileMetadata(drive, fileId);

    await drive.files.delete({ fileId });
    await logFileHistory(fileMetadata, userEmail, true, 2);
    res.status(204).end();
  } catch (error) {
    await logFileHistory(fileMetadata, userEmail, false, 2, error.message);
    res.status(500).send('Error deleting file: ' + error.message);
  }
};

module.exports = {
  listFiles,
  uploadFile,
  downloadFile,
  deleteFile,
};
