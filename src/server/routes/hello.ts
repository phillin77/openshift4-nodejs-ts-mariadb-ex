import { Request, Response, NextFunction } from 'express';
import * as util from 'util';

/* GET / POST */
exports.handler = function(req:Request, res:Response, next:NextFunction) {
  console.log('POST /hello, headers = ', util.inspect(req.headers, { showHidden: false, depth: null, colors: true }));
  const reqdata = req.body;
  console.log('POST /hello, body = ', util.inspect(reqdata, { showHidden: false, depth: null, colors: true }));

  res.status(200);
  res.send({hello: "world at " + Date()});
}; // exports.handler
