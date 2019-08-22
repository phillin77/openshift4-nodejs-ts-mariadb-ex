import { Request, Response, NextFunction } from 'express';
import * as util from 'util';
import mysql, { Connection } from 'mysql';

let mysqlURL = process.env.OPENSHIFT_MARIADB_DB_URL || process.env.MARIADB_URL,
    mysqlURLLabel = "";

if (mysqlURL == null) {
  var mysqlHost, mysqlPort, mysqlDatabase, mysqlPassword, mysqlUser;
  // If using multi-database modified by p.l.77 (MONGODB_DATABASE_SERVICE_NAME & MYSQL_DATABASE_SERVICE_NAME)
  if (process.env.MARIADB_DATABASE_SERVICE_NAME) {
    var mysqlServiceName = process.env.MYSQL_DATABASE_SERVICE_NAME.toUpperCase();
    mysqlHost = process.env[mysqlServiceName + '_SERVICE_HOST'];
    mysqlPort = process.env[mysqlServiceName + '_SERVICE_PORT'];
    if (mysqlServiceName==="MARIADB")  // For MariaDB, 以下3個設定維持跟 MySQL 一樣
      mysqlServiceName = "MYSQL";
    mysqlDatabase = process.env[mysqlServiceName + '_DATABASE'];
    mysqlPassword = process.env[mysqlServiceName + '_PASSWORD'];
    mysqlUser = process.env[mysqlServiceName + '_USER'];

  // If using plane old env vars via service discovery
  } else if (process.env.DATABASE_SERVICE_NAME) {
    var mysqlServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase();
    mysqlHost = process.env[mysqlServiceName + '_SERVICE_HOST'];
    mysqlPort = process.env[mysqlServiceName + '_SERVICE_PORT'];
    if (mysqlServiceName==="MARIADB")  // For MariaDB, 以下3個設定維持跟 MySQL 一樣
      mysqlServiceName = "MYSQL";
    mysqlDatabase = process.env[mysqlServiceName + '_DATABASE'];
    mysqlPassword = process.env[mysqlServiceName + '_PASSWORD'];
    mysqlUser = process.env[mysqlServiceName + '_USER'];

  // If using env vars from secret from service binding  
  } else if (process.env.database_name) {
    mysqlDatabase = process.env.database_name;
    mysqlPassword = process.env.password;
    mysqlUser = process.env.username;
    var mysqlUriParts = process.env.uri && process.env.uri.split("//");
    if (mysqlUriParts && mysqlUriParts.length == 2) {
      mysqlUriParts = mysqlUriParts[1].split(":");
      if (mysqlUriParts && mysqlUriParts.length == 2) {
        mysqlHost = mysqlUriParts[0];
        mysqlPort = mysqlUriParts[1];
      }
    }
  }

  if (mysqlHost && mysqlPort && mysqlDatabase) {
    mysqlURLLabel = mysqlURL = 'mysql://';
    if (mysqlUser && mysqlPassword) {
      mysqlURL += mysqlUser + ':' + mysqlPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mysqlURLLabel += mysqlHost + ':' + mysqlPort + '/' + mysqlDatabase;
    mysqlURL += mysqlHost + ':' +  mysqlPort + '/' + mysqlDatabase;
  }
}

// console.log(`mysqlURL: ${mysqlURL}`);

let db:any = null,
    dbDetails:any = new Object();
let mysqlClient:Connection ;

var initDb = function(callback:any) {
  if (mysqlURL == null) return;

  if (mysql == null) return;

  //connect to mysql
  mysqlClient = mysql.createConnection(mysqlURL);
  mysqlClient.connect(function(err){
    if (err) {
      callback(err);
      return;
    }

    db = mysqlClient;
    dbDetails.databaseName = db.databaseName;
    dbDetails.url = mysqlURLLabel;
    dbDetails.type = 'MariaDB';

    console.log('Connected to MariaDB at: %s', mysqlURL);
    callback(null);
  });
};


/* GET */
exports.handler = function(req:Request, res:Response, next:NextFunction) {
  console.log('GET /mysql, headers = ', util.inspect(req.headers, { showHidden: false, depth: null, colors: true }));
  const reqdata = req.body;
  console.log('GET /mysql, body = ', util.inspect(reqdata, { showHidden: false, depth: null, colors: true }));


  try {
    initDb(function(err:any){
      if (err) {
        console.log('Error connecting to MariaDB. Message:\n'+err);
        return;
      }

      mysqlClient.query('SELECT 1 + 1 AS solution, NOW() as now', function(err, rows, fields) {
        if (err) {
          res.send('NOT OK' + JSON.stringify(err));
        } else {
          res.send(`OK: ${rows[0].solution} at ${rows[0].now}`);
        }
      });    
      
    });
  } catch (error) {
      res.status(500);
      res.send(error);
  } // try-catch
}; // exports.handler
