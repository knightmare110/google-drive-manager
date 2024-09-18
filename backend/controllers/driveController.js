const { google } = require('googleapis');
const { getOAuth2Client } = require('../utils/googleDrive');
const { Readable } = require('stream');

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
      fields: 'id',
    });
    res.status(201).send(file.data.id);
  } catch (error) {
    res.status(500).send('Error uploading file');
  }
};

// Download File
const downloadFile = async (req, res) => {
  const token = req.cookies.authToken; // Get token from cookie
  if (!token) {
    return res.status(401).send('Unauthorized: No token found');
  }

  const oAuth2Client = getOAuth2Client();
  oAuth2Client.setCredentials({ access_token: token });

  const drive = google.drive({ version: 'v3', auth: oAuth2Client });

  try {
    const fileId = req.params.fileId;
    const file = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });

    file.data
      .on('end', () => res.status(200).end())
      .on('error', (err) => res.status(500).send('Error downloading file'))
      .pipe(res);
  } catch (error) {
    res.status(500).send('Error downloading file');
  }
};

// Delete File
const deleteFile = async (req, res) => {
  const token = req.cookies.authToken; // Get token from cookie
  if (!token) {
    return res.status(401).send('Unauthorized: No token found');
  }

  const oAuth2Client = getOAuth2Client();
  oAuth2Client.setCredentials({ access_token: token });

  const drive = google.drive({ version: 'v3', auth: oAuth2Client });

  try {
    await drive.files.delete({ fileId: req.params.fileId });
    res.status(204).end();
  } catch (error) {
    res.status(500).send('Error deleting file');
  }
};

module.exports = {
  listFiles,
  uploadFile,
  downloadFile,
  deleteFile,
};
