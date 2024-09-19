const { google } = require('googleapis');
const { getOAuth2Client } = require('../utils/googleDrive');
const { Readable } = require('stream');
const { saveHistory } = require('../utils/aws');

// Convert buffer to stream
function bufferToStream(buffer) {
  const readable = new Readable();
  readable._read = () => {};
  readable.push(buffer);
  readable.push(null);
  return readable;
}

// List Files
const listFiles = async (req, res) => {
  const token = req.cookies.authToken; // Get token from cookie
  if (!token) {
    return res.status(401).send('Unauthorized: No token found');
  }

  const oAuth2Client = getOAuth2Client();
  oAuth2Client.setCredentials({ access_token: token });

  const drive = google.drive({ version: 'v3', auth: oAuth2Client });
  
  try {
    const response = await drive.files.list({
      pageSize: 10,
      fields: 'files(id, name, mimeType, modifiedTime)',
    });
    res.json(response.data.files);
  } catch (error) {
    res.status(500).send('Error fetching files');
  }
};

// Upload File
const uploadFile = async (req, res) => {
  const token = req.cookies.authToken; // Get token from cookie
  const userEmail = req.cookies.userEmail;
  if (!token) {
    return res.status(401).send('Unauthorized: No token found');
  }

  const oAuth2Client = getOAuth2Client();
  oAuth2Client.setCredentials({ access_token: token });

  const drive = google.drive({ version: 'v3', auth: oAuth2Client });

  const fileMetadata = {
    name: req.file.originalname,
  };
  const media = {
    mimeType: req.file.mimetype,
    body: bufferToStream(req.file.buffer),
  };

  try {
    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, webViewLink, webContentLink',
    });

    const fileDetails = {
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      createdAt: new Date().toISOString(),
      isSucceed: true,
      googleDriveLink: file.data.webViewLink,
      userEmail: userEmail,
      type: 0
    };

    await saveHistory(fileDetails);

    res.status(201).send(file.data.id);
  } catch (error) {
    const fileDetails = {
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      createdAt: new Date().toISOString(),
      isSucceed: false,
      failedReason: error.message,
      userEmail: userEmail,
      type: 0
    };

    await saveHistory(fileDetails);
    res.status(500).send('Error uploading file');
  }
};

// Download File
const downloadFile = async (req, res) => {
  const token = req.cookies.authToken; // Get token from cookie
  const userEmail = req.cookies.userEmail;

  if (!token) {
    return res.status(401).send('Unauthorized: No token found');
  }

  const oAuth2Client = getOAuth2Client();
  oAuth2Client.setCredentials({ access_token: token });

  const drive = google.drive({ version: 'v3', auth: oAuth2Client });

  try {
    const fileId = req.params.fileId;
    const fileMetadata = await drive.files.get({
      fileId: fileId,
      fields: 'id, name, mimeType, size, webViewLink, webContentLink',
    });

    const file = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });

    file.data
      .on('end', async () => {
        const fileDetails = {
          fileName: fileMetadata.data.name,
          fileType: fileMetadata.data.mimeType,
          fileSize: fileMetadata.data.size,
          createdAt: new Date().toISOString(),
          isSucceed: true,
          googleDriveLink: fileMetadata.data.webViewLink,
          userEmail: userEmail,
          type: 1
        };
        
        await saveHistory(fileDetails);
        res.status(200).end()
      })
      .on('error', async(err) => {
        const fileDetails = {
          fileName: fileMetadata.data.name,
          fileType: fileMetadata.data.mimeType,
          fileSize: fileMetadata.data.size,
          createdAt: new Date().toISOString(),
          isSucceed: false,
          googleDriveLink: fileMetadata.data.webViewLink,
          userEmail: userEmail,
          type: 1,
          failedReason: err.message
        };
        
        await saveHistory(fileDetails);
        res.status(500).send('Error downloading file: ' + err.message)
      })
      .pipe(res);
  } catch (error) {
    res.status(500).send('Error downloading file: ' + error.message);
  }
};

// Delete File
const deleteFile = async (req, res) => {
  const token = req.cookies.authToken; // Get token from cookie
  const userEmail = req.cookies.userEmail;

  if (!token) {
    return res.status(401).send('Unauthorized: No token found');
  }

  const oAuth2Client = getOAuth2Client();
  oAuth2Client.setCredentials({ access_token: token });

  const drive = google.drive({ version: 'v3', auth: oAuth2Client });

  const fileMetadata = await drive.files.get({
    fileId: req.params.fileId,
    fields: 'id, name, mimeType, size, webViewLink, webContentLink',
  });

  try {
    await drive.files.delete({ fileId: req.params.fileId });
    const fileDetails = {
      fileName: fileMetadata.data.name,
      fileType: fileMetadata.data.mimeType,
      fileSize: fileMetadata.data.size,
      createdAt: new Date().toISOString(),
      isSucceed: true,
      userEmail: userEmail,
      type: 2
    };
    
    await saveHistory(fileDetails);
    res.status(204).end();
  } catch (error) {
    const fileDetails = {
      fileName: fileMetadata.data.name,
      fileType: fileMetadata.data.mimeType,
      fileSize: fileMetadata.data.size,
      createdAt: new Date().toISOString(),
      isSucceed: false,
      userEmail: userEmail,
      type: 1,
      failedReason: error.message
    };
    
    await saveHistory(fileDetails);
    res.status(500).send('Error deleting file');
  }
};

module.exports = {
  listFiles,
  uploadFile,
  downloadFile,
  deleteFile,
};
