"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const app_1 = tslib_1.__importDefault(require("./server/app"));
const http = tslib_1.__importStar(require("http"));
const port = normalizePort(process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || '8080');
app_1.default.set('port', port);
const server = http.createServer(app_1.default);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
function normalizePort(val) {
    let port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;
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
function onListening() {
    let addr = server.address();
    if (!addr) {
        console.log('Fatal Error: server address is null');
    }
    else {
        let bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : (addr.address == '::' ? 'localhost' : addr.address) + ' port ' + addr.port;
        console.log('[Server] Listening on ' + bind);
        console.log("\nRegistered routes:");
        app_1.default._router.stack.forEach(function (r) {
            if (r.route && r.route.path) {
                console.log('%s %s', r.route.stack[0].method.toUpperCase(), r.route.path);
            }
        });
    }
}
//# sourceMappingURL=main.js.map