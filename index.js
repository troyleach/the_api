// FIXME: I have to make a server file so that I can run jest
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');

const stats = require('./routes/stats');
const googleDriveImages = require('./routes/googleDriveImages');
const googleEvents = require('./routes/googleEvents');


const PORT = process.env.PORT || 3020;
const NODE_ENV = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
};
const app = express();

app.use(function (req, res, next) {
  // FIXME: this should not be *
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.set('port', PORT);
app.set('env', NODE_ENV);

app.use(logger('tiny'));
app.use(bodyParser.json());

app.use('/v1/stats', stats)
app.use('/v1/images', googleDriveImages)
app.use('/v1/events', googleEvents)
// this below did not work
// app.use('/', require(path.join(__dirname, 'routes')));

app.get('/ping', (req, res) => res.send(`PONG seems I am working ${new Date()}`));

app.use((req, res, next) => {
  const err = new Error(`${req.method} ${req.url} Not Found`);
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});



app.listen(PORT, () => {
  console.log(
    `Express Server started on Port ${app.get(
      'port'
    )} | Environment : ${app.get('env')}`
  );
});