"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express = require("express");
const logger = require("morgan");
const bodyParser = tslib_1.__importStar(require("body-parser"));
const path = tslib_1.__importStar(require("path"));
const cookieParser = require("cookie-parser");
const favicon = require("serve-favicon");
let index = require('./routes/index');
let hello = require('./routes/hello');
const app = express();
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('trust proxy', 1);
app.get('/', index.handler);
app.get('/hello', hello.handler);
app.post('/hello', hello.handler);
app.options('/hello', function (request, response) {
    response.status(200).set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }).send('null');
});
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});
if (app.get('env') === 'development') {
    app.use((error, req, res, next) => {
        res.status(500).set({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }).json({ error: error.message });
    });
}
app.use((error, req, res, next) => {
    res.status(500).set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }).json({ error: error.message });
    return null;
});
exports.default = app;
//# sourceMappingURL=app.js.map