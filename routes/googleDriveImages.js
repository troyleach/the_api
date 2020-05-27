const express = require('express');
const router = express.Router();


const { google } = require('googleapis');
const credentials = require('./googleDriveCredentials.json');
const scopes = [
  'https://www.googleapis.com/auth/drive'
];
const auth = new google.auth.JWT(
  credentials.client_email, null,
  credentials.private_key, scopes
);
const drive = google.drive({ version: "v3", auth });

// const fs = require('fs');
// const path = require('path');

// const getImages = async (req, res, next) => {
//   console.log('GET THE IMAGES', req)
//   const images = 'getting'
//   try {
//     // depending on what is being asked for,
//     // if gallery getGallery()
//     // if carousel getCarousel()

//     // need to call on the google drive api
//     if (!error) {
//       const err = new Error('something went wrong');
//       err.status = 404;
//       throw err;
//     }
//     res.json(images);
//   } catch (e) {
//     next(e);
//   }
// };

// TODO: maybe I should just make this return both - might want to use the function above
const getGallery = async (req, res, next) => {
  let googleRes;
  // todo: when I pass in these fields I did get a image url, but this is not what I want I don't think
  // I want the id, then use the url that I have commented in the UI
  try {
    let images = {};
    googleRes = await drive.files.list({
      pageSize: 20,
      fields: 'files(name,fullFileExtension,webViewLink)',
      orderBy: 'createdTime desc'
    });
    console.log('what is this yo', googleRes.data)

    // drive.files.list({}, (err, res) => {
    //   if (err) throw err;
    //   files = res.data.files;
    //   console.log('res from google', res.data)
    //   if (files.length) {
    //     files.map((file) => {
    //       console.log(file);
    //     });
    //   } else {
    //     files = { message: 'No files found' };
    //     console.log('No files found', files);
    //   }
    // });
    // console.log('Return Gallery images', files)
    // if (!images) {
    //   const err = new Error('Images not found');
    //   err.status = 404;
    //   throw err;
    // }
    res.json(googleRes.data)
  } catch (e) {
    next(e);
  }
};

const getCarousel = async (req, res, next) => {
  try {
    const images = { carousel: ['Return carousel images'] }

    // need to call on the google drive api
    if (!images) {
      const err = new Error('Images not found');
      err.status = 404;
      throw err;
    }
    res.json(images);
  } catch (e) {
    next(e);
  }
};

router
  .route('/carousel')
  .get(getCarousel);
router
  .route('/gallery')
  .get(getGallery);

module.exports = router;