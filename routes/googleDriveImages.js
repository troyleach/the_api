const express = require('express');
const router = express.Router();


const { google } = require('googleapis');

const {
  groupImages,
  getGoogleJwt
} = require('../src/lib/helpers');



// this is where I got the basic concept for this
// https://medium.com/@bretcameron/how-to-use-the-google-drive-api-with-javascript-57a6cc9e5262
// this is the node package: https://github.com/googleapis/google-api-nodejs-client#installation
const getGoogleDriveData = async () => {
  const SCOPES =
    'https://www.googleapis.com/auth/drive'
    ;

  const jwtClient = getGoogleJwt(SCOPES)

  const drive = google.drive({ version: "v3", auth: jwtClient });
  return await drive.files.list({
    // pageSize: 20,
    fields: 'files(id, name, mimeType, webViewLink, webContentLink, parents)',
    // fields: '*',
    orderBy: 'createdTime desc'
  });
}


// TODO: error handling
const getImages = async (req, res, next) => {
  const googleRes = await getGoogleDriveData();
  try {
    let formattedPayload;
    formattedPayload = groupImages(googleRes.data.files)
    if (req.query && req.query.type) {
      formattedPayload = formattedPayload.filter(type => type.folder === req.query.type);
    }

    res.json(formattedPayload)
    // res.json(googleRes.data.files)
  } catch (e) {
    next(e);
  }
};

router
  .route('/')
  .get(getImages);

module.exports = router;
