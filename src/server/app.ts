/**
 * Server
 * start:  2019.08.21
 * update: 2019.08.21
 * version:
 *     2019.08.21 [ADD]  1st Version
 */

import express = require('express');
import logger = require('morgan');
import * as bodyParser from 'body-parser';
import * as path from 'path';
import cookieParser = require('cookie-parser'); // this module doesn't use the ES6 default export yet
import favicon = require('serve-favicon');
import session = require('express-session');
// import AuthProvider from './libs/JDSkill/AuthProvider'

// import routes
let index = require('./routes/index');
let hello = require('./routes/hello');
let mysql = require('./routes/mysql');

// create express
const app: express.Express = express();

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('trust proxy', 1); // trust first proxy
// app.use(session({
//   genid: (req) => {
//     return AuthProvider.genRandomString();
//   },
//   secret: 'xyzsecret',
//   resave: false,
//   saveUninitialized: true,
//   cookie: {secure: false},
// }));

// setup routes (Provider Server)
app.get('/', index.handler);

app.get('/hello', hello.handler);
app.post('/hello', hello.handler);

app.get('/mysql', mysql.handler);

/**
 * Enables prelight (OPTIONS) requests made cross-domain.
 */
app.options('/hello', function (request, response) {
  response.status(200).set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  }).send('null');
});


// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err:any = new Error('Not Found');
  err['status'] = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((error: any, req: any, res: any, next: any) => {
    res.status(500).set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }).json({error: error.message});
  
  });
}

// production error handler
// no stacktraces leaked to user
app.use((error: any, req: any, res: any, next: any) => {
  res.status(500).set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }).json({error: error.message});

  return null;
});

export default app;
