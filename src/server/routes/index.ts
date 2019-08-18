import { Request, Response, NextFunction } from 'express';

/* GET */
exports.handler = function(req:Request, res:Response, next:NextFunction) {
  res.sendStatus(200);
}; // exports.handler
