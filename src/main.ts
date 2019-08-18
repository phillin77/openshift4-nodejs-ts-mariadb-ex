/**
 * main
 * start:  2019.08.18
 * update: 2019.08.18
 * version:
 *     2019.08.18 [ADD]  1st Version
 */

import app from './server/app';
import * as http from 'http';

// const debug = debugModule('node-express-typescript:server');

// Get port from environment and store in Express.
const port = normalizePort(process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || '8080');  // Provider Server Port
app.set('port', port);

// [Provider Server] create server and listen on provided port (on all network interfaces).
const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: any): number|string|boolean {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  let addr = server.address();
  // console.log("addr:", addr)
  if (!addr) {
    console.log('Fatal Error: server address is null');
  } else {
    let bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : (addr.address == '::'?'localhost':addr.address) + ' port ' + addr.port;

    console.log('[Server] Listening on ' + bind);    

    console.log("\nRegistered routes:");
    app._router.stack.forEach(function(r:any){
      if (r.route && r.route.path){
        console.log('%s %s', r.route.stack[0].method.toUpperCase(), r.route.path);
      }
    })
  }
} // onListening
