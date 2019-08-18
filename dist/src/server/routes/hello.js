"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const util = tslib_1.__importStar(require("util"));
exports.handler = function (req, res, next) {
    console.log('POST /hello, headers = ', util.inspect(req.headers, { showHidden: false, depth: null, colors: true }));
    const reqdata = req.body;
    console.log('POST /hello, body = ', util.inspect(reqdata, { showHidden: false, depth: null, colors: true }));
    res.status(200);
    res.send({ hello: "world at " + Date() });
};
//# sourceMappingURL=hello.js.map