const express = require('express');
const router = express.Router();

const fs = require('fs');
const path = require('path');

const getStats = async (req, res, next) => {
  console.log('AM I GETTING HERE')
  try {
    const data = fs.readFileSync(path.join(__dirname, './stats.json'));
    const stats = JSON.parse(data);
    const playerStats = stats.find(player => player.id === Number(req.params.id));
    if (!playerStats) {
      const err = new Error('Player stats not found');
      err.status = 404;
      throw err;
    }
    res.json(playerStats);
  } catch (e) {
    next(e);
  }
};

router
  .route('/:id')
  .get(getStats);

module.exports = router;