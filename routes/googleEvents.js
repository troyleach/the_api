const express = require('express');
const router = express.Router();


const { google } = require('googleapis');
const {
  getGoogleJwt
} = require('../src/lib/helpers');

const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

const getEvents = async (req, res) => {
  // ** this is what I used to finely get something working **
  // https://dev.to/megazear7/google-calendar-api-integration-made-easy-2a68

  const jwtClient = getGoogleJwt(SCOPES);

  const calendar = google.calendar({
    version: 'v3',
    project: process.env.GOOGLE_PROJECT_NUMBER,
    auth: jwtClient
  })

  await calendar.events.list({
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime'
  },
    (err, googleRes) => {
      if (err) return console.log('The API returned and error: ' + err);
      const events = googleRes.data.items;
      if (events.length) {
        eventsArray = events.map((event, i) => {
          const { start, end, summary, htmlLink } = event;
          return {
            start,
            end,
            summary,
            htmlLink
          }
        });
        res.status(200).send(eventsArray)
      } else {
        // FIXME: don't do this, this way
        console.log('No upcoming events found.');
        res.status(200).send([])
      }
    })
}

// TODO: error handling

router
  .route('/')
  .get(getEvents);

module.exports = router;
