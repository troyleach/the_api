const express = require('express');
const router = express.Router();

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

// TODO: maybe I should just make this return both
const getGallery = async (req, res, next) => {
  try {
    const images = { gallery: ['Return Gallery images'] }
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