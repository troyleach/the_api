const express = require('express');
const router = express.Router();


const { google } = require('googleapis');
const credentials = require('./googleDriveCredentials.json');

const { chain, take } = require('lodash')

// const fs = require('fs');
// const path = require('path');

const getGoogleDrive = async () => {
  const scopes = [
    'https://www.googleapis.com/auth/drive'
  ];
  const auth = new google.auth.JWT(
    credentials.client_email, null,
    credentials.private_key, scopes
  );
  const drive = google.drive({ version: "v3", auth });
  return await drive.files.list({
    // pageSize: 20,
    fields: 'files(id, name, mimeType, webViewLink, webContentLink, parents)',
    // fields: '*',
    orderBy: 'createdTime desc'
  });
}

// TODO: error handling
const getImages = async (req, res, next) => {
  const googleRes = await getGoogleDrive();
  console.log('res', googleRes.data)
  try {
    const parentFolders = googleRes.data.files.find(folder => !folder.parents)
    const subFolders = googleRes.data.files.filter(folder => folder.mimeType === 'application/vnd.google-apps.folder' && folder.parents)

    const groupImages = chain(googleRes.data.files)
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

    let filtered;
    filtered = groupImages.filter(Boolean);
    if (req.query && req.query.type) {
      filtered = filtered.filter(type => type.folder === req.query.type);
    }

    res.json(filtered)
  } catch (e) {
    next(e);
  }
};

router
  .route('/')
  .get(getImages);
// router
//   .route('/carousel')
//   .get(getCarousel);
// router
//   .route('/gallery')
//   .get(getGallery);

module.exports = router;



// This is the incoming payload
/*
{
    "files": [
        {
            "id": "1XIrGEf6qUadMdbebjxkPQsOQFY2OkWJC",
            "name": "carousel",
            "mimeType": "application/vnd.google-apps.folder",
            "parents": [
                "1jNExVIifVofhi-w_9s2ejTEaaVDl7csE"
            ],
            "webViewLink": "https://drive.google.com/drive/folders/1XIrGEf6qUadMdbebjxkPQsOQFY2OkWJC"
        },
        {
            "id": "1p5XpxxbBQr49Hmcc5MXhwKXK-BH9i7UE",
            "name": "cool-keybd.jpg",
            "mimeType": "image/jpeg",
            "parents": [
                "1fwtqwmPR81wI6hHlHPqRpcW-o6daAPlo"
            ],
            "webContentLink": "https://drive.google.com/uc?id=1p5XpxxbBQr49Hmcc5MXhwKXK-BH9i7UE&export=download",
            "webViewLink": "https://drive.google.com/file/d/1p5XpxxbBQr49Hmcc5MXhwKXK-BH9i7UE/view?usp=drivesdk"
        },
        {
            "id": "185Mf78Eh-BhUSBMG1iCEcgzF7kpXJFbA",
            "name": "milo.jpg",
            "mimeType": "image/jpeg",
            "parents": [
                "1XIrGEf6qUadMdbebjxkPQsOQFY2OkWJC"
            ],
            "webContentLink": "https://drive.google.com/uc?id=185Mf78Eh-BhUSBMG1iCEcgzF7kpXJFbA&export=download",
            "webViewLink": "https://drive.google.com/file/d/185Mf78Eh-BhUSBMG1iCEcgzF7kpXJFbA/view?usp=drivesdk"
        },
        {
            "id": "1S6uQZ_CxWKJP8cJIP1A2IoxPHexEgFCd",
            "name": "wine.jpeg",
            "mimeType": "image/jpeg",
            "parents": [
                "1XIrGEf6qUadMdbebjxkPQsOQFY2OkWJC"
            ],
            "webContentLink": "https://drive.google.com/uc?id=1S6uQZ_CxWKJP8cJIP1A2IoxPHexEgFCd&export=download",
            "webViewLink": "https://drive.google.com/file/d/1S6uQZ_CxWKJP8cJIP1A2IoxPHexEgFCd/view?usp=drivesdk"
        },
        {
            "id": "1wCVR2jhPT-ZbfLSuCLanLfbOR6HplMC9",
            "name": "troy-diving.jpg",
            "mimeType": "image/jpeg",
            "parents": [
                "1XIrGEf6qUadMdbebjxkPQsOQFY2OkWJC"
            ],
            "webContentLink": "https://drive.google.com/uc?id=1wCVR2jhPT-ZbfLSuCLanLfbOR6HplMC9&export=download",
            "webViewLink": "https://drive.google.com/file/d/1wCVR2jhPT-ZbfLSuCLanLfbOR6HplMC9/view?usp=drivesdk"
        },
        {
            "id": "1fwtqwmPR81wI6hHlHPqRpcW-o6daAPlo",
            "name": "gallery",
            "mimeType": "application/vnd.google-apps.folder",
            "parents": [
                "1jNExVIifVofhi-w_9s2ejTEaaVDl7csE"
            ],
            "webViewLink": "https://drive.google.com/drive/folders/1fwtqwmPR81wI6hHlHPqRpcW-o6daAPlo"
        },
        {
            "id": "1WqD_xQG4cHuqYM5bgrmLJaC8i_0R-Mc-",
            "name": "img_6.JPG",
            "mimeType": "image/jpeg",
            "parents": [
                "1fwtqwmPR81wI6hHlHPqRpcW-o6daAPlo"
            ],
            "webContentLink": "https://drive.google.com/uc?id=1WqD_xQG4cHuqYM5bgrmLJaC8i_0R-Mc-&export=download",
            "webViewLink": "https://drive.google.com/file/d/1WqD_xQG4cHuqYM5bgrmLJaC8i_0R-Mc-/view?usp=drivesdk"
        },
        {
            "id": "1GpComCIosgGS5hvm3bbH_4emjJ2Dzt6J",
            "name": "img_3.jpg",
            "mimeType": "image/jpeg",
            "parents": [
                "1fwtqwmPR81wI6hHlHPqRpcW-o6daAPlo"
            ],
            "webContentLink": "https://drive.google.com/uc?id=1GpComCIosgGS5hvm3bbH_4emjJ2Dzt6J&export=download",
            "webViewLink": "https://drive.google.com/file/d/1GpComCIosgGS5hvm3bbH_4emjJ2Dzt6J/view?usp=drivesdk"
        },
        {
            "id": "1PpC6sQl-vqEF0IhSiaByu4kRvFI9whZL",
            "name": "img_4.JPG",
            "mimeType": "image/jpeg",
            "parents": [
                "1fwtqwmPR81wI6hHlHPqRpcW-o6daAPlo"
            ],
            "webContentLink": "https://drive.google.com/uc?id=1PpC6sQl-vqEF0IhSiaByu4kRvFI9whZL&export=download",
            "webViewLink": "https://drive.google.com/file/d/1PpC6sQl-vqEF0IhSiaByu4kRvFI9whZL/view?usp=drivesdk"
        },
        {
            "id": "11XBCEl7Fg-3HZE1lyJ5U82RSBgQOrZn5",
            "name": "img_2.jpg",
            "mimeType": "image/jpeg",
            "parents": [
                "1fwtqwmPR81wI6hHlHPqRpcW-o6daAPlo"
            ],
            "webContentLink": "https://drive.google.com/uc?id=11XBCEl7Fg-3HZE1lyJ5U82RSBgQOrZn5&export=download",
            "webViewLink": "https://drive.google.com/file/d/11XBCEl7Fg-3HZE1lyJ5U82RSBgQOrZn5/view?usp=drivesdk"
        },
        {
            "id": "1jNExVIifVofhi-w_9s2ejTEaaVDl7csE",
            "name": "app_pictures",
            "mimeType": "application/vnd.google-apps.folder",
            "webViewLink": "https://drive.google.com/drive/folders/1jNExVIifVofhi-w_9s2ejTEaaVDl7csE"
        }
    ]
}
*/

// this is what is supose to be returned
/*
[
  {
      "folder": "gallery",
      "images": [
          {
              "id": "1p5XpxxbBQr49Hmcc5MXhwKXK-BH9i7UE",
              "name": "cool-keybd.jpg",
              "mimeType": "image/jpeg",
              "parents": [
                  "1fwtqwmPR81wI6hHlHPqRpcW-o6daAPlo"
              ],
              "webContentLink": "https://drive.google.com/uc?id=1p5XpxxbBQr49Hmcc5MXhwKXK-BH9i7UE&export=download",
              "webViewLink": "https://drive.google.com/file/d/1p5XpxxbBQr49Hmcc5MXhwKXK-BH9i7UE/view?usp=drivesdk"
          },
          {
              "id": "1WqD_xQG4cHuqYM5bgrmLJaC8i_0R-Mc-",
              "name": "img_6.JPG",
              "mimeType": "image/jpeg",
              "parents": [
                  "1fwtqwmPR81wI6hHlHPqRpcW-o6daAPlo"
              ],
              "webContentLink": "https://drive.google.com/uc?id=1WqD_xQG4cHuqYM5bgrmLJaC8i_0R-Mc-&export=download",
              "webViewLink": "https://drive.google.com/file/d/1WqD_xQG4cHuqYM5bgrmLJaC8i_0R-Mc-/view?usp=drivesdk"
          },
          {
              "id": "1GpComCIosgGS5hvm3bbH_4emjJ2Dzt6J",
              "name": "img_3.jpg",
              "mimeType": "image/jpeg",
              "parents": [
                  "1fwtqwmPR81wI6hHlHPqRpcW-o6daAPlo"
              ],
              "webContentLink": "https://drive.google.com/uc?id=1GpComCIosgGS5hvm3bbH_4emjJ2Dzt6J&export=download",
              "webViewLink": "https://drive.google.com/file/d/1GpComCIosgGS5hvm3bbH_4emjJ2Dzt6J/view?usp=drivesdk"
          },
          {
              "id": "1PpC6sQl-vqEF0IhSiaByu4kRvFI9whZL",
              "name": "img_4.JPG",
              "mimeType": "image/jpeg",
              "parents": [
                  "1fwtqwmPR81wI6hHlHPqRpcW-o6daAPlo"
              ],
              "webContentLink": "https://drive.google.com/uc?id=1PpC6sQl-vqEF0IhSiaByu4kRvFI9whZL&export=download",
              "webViewLink": "https://drive.google.com/file/d/1PpC6sQl-vqEF0IhSiaByu4kRvFI9whZL/view?usp=drivesdk"
          },
          {
              "id": "11XBCEl7Fg-3HZE1lyJ5U82RSBgQOrZn5",
              "name": "img_2.jpg",
              "mimeType": "image/jpeg",
              "parents": [
                  "1fwtqwmPR81wI6hHlHPqRpcW-o6daAPlo"
              ],
              "webContentLink": "https://drive.google.com/uc?id=11XBCEl7Fg-3HZE1lyJ5U82RSBgQOrZn5&export=download",
              "webViewLink": "https://drive.google.com/file/d/11XBCEl7Fg-3HZE1lyJ5U82RSBgQOrZn5/view?usp=drivesdk"
          }
      ]
  },
  {
      "folder": "carousel",
      "images": [
          {
              "id": "185Mf78Eh-BhUSBMG1iCEcgzF7kpXJFbA",
              "name": "milo.jpg",
              "mimeType": "image/jpeg",
              "parents": [
                  "1XIrGEf6qUadMdbebjxkPQsOQFY2OkWJC"
              ],
              "webContentLink": "https://drive.google.com/uc?id=185Mf78Eh-BhUSBMG1iCEcgzF7kpXJFbA&export=download",
              "webViewLink": "https://drive.google.com/file/d/185Mf78Eh-BhUSBMG1iCEcgzF7kpXJFbA/view?usp=drivesdk"
          },
          {
              "id": "1S6uQZ_CxWKJP8cJIP1A2IoxPHexEgFCd",
              "name": "wine.jpeg",
              "mimeType": "image/jpeg",
              "parents": [
                  "1XIrGEf6qUadMdbebjxkPQsOQFY2OkWJC"
              ],
              "webContentLink": "https://drive.google.com/uc?id=1S6uQZ_CxWKJP8cJIP1A2IoxPHexEgFCd&export=download",
              "webViewLink": "https://drive.google.com/file/d/1S6uQZ_CxWKJP8cJIP1A2IoxPHexEgFCd/view?usp=drivesdk"
          },
          {
              "id": "1wCVR2jhPT-ZbfLSuCLanLfbOR6HplMC9",
              "name": "troy-diving.jpg",
              "mimeType": "image/jpeg",
              "parents": [
                  "1XIrGEf6qUadMdbebjxkPQsOQFY2OkWJC"
              ],
              "webContentLink": "https://drive.google.com/uc?id=1wCVR2jhPT-ZbfLSuCLanLfbOR6HplMC9&export=download",
              "webViewLink": "https://drive.google.com/file/d/1wCVR2jhPT-ZbfLSuCLanLfbOR6HplMC9/view?usp=drivesdk"
          }
      ]
  }
]
*/