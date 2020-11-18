const { chain } = require('lodash')
const { google } = require('googleapis');

const groupImages = (payload) => {
  const parentFolders = payload.find(folder => !folder.parents) // for future features
  const subFolders = payload.filter(folder => folder.mimeType === 'application/vnd.google-apps.folder' && folder.parents)
  return chain(payload)
    // Group the elements of Array based on `parents` property array of ids
    .groupBy("parents")
    // `key` is group's name (parents folder id), `value` is the array of objects
    .map((values, key) => {
      let folderName;
      let result;
      result = subFolders.find(({ id }) => id === key);

      if (key && result) {
        folderName = result.name
      }

      if (folderName) {
        return { folder: folderName, images: values }
      }
    })
    .value()
    .filter(Boolean)
}

const getGoogleJwt = (scopes) => {
  return new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n'),
    scopes
  );
}

module.exports = {
  groupImages,
  getGoogleJwt
}