/* Socket creation tracer (CJS)
   Preload this with NODE_OPTIONS='--require <thisfile>' to log stack traces when sockets are created or connected.
   Writes to /tmp/udp-socket-trace.log
*/
const fs = require('fs');
const path = require('path');
const net = require('net');
const tls = require('tls');
const origCreateConnection = net.createConnection;
const origSocket = net.Socket;
const origConnect = net.connect;
const LOGFILE = '/tmp/udp-socket-trace.log';
function append(line) {
    try {
        fs.appendFileSync(LOGFILE, line + '\n');
    } catch (e) {
        // ignore
    }
}
function stack() {
    const s = new Error().stack || '';
    return s.split('\n').slice(2).join('\n');
}
// Wrap net.createConnection
net.createConnection = function (...args) {
    try {
        append('--- SOCKET CREATE: net.createConnection ---');
        append(new Date().toISOString());
        append(JSON.stringify({ args: args.slice(0, 2).map(a => String(a)) }));
        append(stack());
    } catch (e) { }
    return origCreateConnection.apply(this, args);
};
// Wrap net.connect (alias)
net.connect = function (...args) {
    try {
        append('--- SOCKET CREATE: net.connect ---');
        append(new Date().toISOString());
        append(JSON.stringify({ args: args.slice(0, 2).map(a => String(a)) }));
        append(stack());
    } catch (e) { }
    return origConnect.apply(this, args);
};
// Wrap tls.connect
const origTlsConnect = tls.connect;
tls.connect = function (...args) {
    try {
        append('--- SOCKET CREATE: tls.connect ---');
        append(new Date().toISOString());
        append(JSON.stringify({ args: args.slice(0, 2).map(a => String(a)) }));
        append(stack());
    } catch (e) { }
    return origTlsConnect.apply(this, args);
};
// Wrap Socket constructor to catch direct instantiation
function SocketWrapper(...args) {
    if (!(this instanceof SocketWrapper)) {
        return origSocket.apply(this, args);
    }
    try {
        append('--- SOCKET CREATE: new net.Socket ---');
        append(new Date().toISOString());
        append(JSON.stringify({ args: args.slice(0, 2).map(a => String(a)) }));
        append(stack());
    } catch (e) { }
    return origSocket.apply(this, args);
}
SocketWrapper.prototype = origSocket.prototype;
net.Socket = SocketWrapper;
// Also wrap child_process.fork/spawn to log the stack when child processes are created
const cp = require('child_process');
const origSpawn = cp.spawn;
const origFork = cp.fork;
const origExec = cp.exec;
cp.spawn = function (...args) {
    try {
        append('--- CHILD SPAWN ---');
        append(new Date().toISOString());
        append(JSON.stringify({ args: args.slice(0, 2).map(a => String(a)) }));
        append(stack());
    } catch (e) { }
    return origSpawn.apply(this, args);
};
cp.fork = function (...args) {
    try {
        append('--- CHILD FORK ---');
        append(new Date().toISOString());
        append(JSON.stringify({ args: args.slice(0, 2).map(a => String(a)) }));
        append(stack());
    } catch (e) { }
    return origFork.apply(this, args);
};
cp.exec = function (...args) {
    try {
        append('--- CHILD EXEC ---');
        append(new Date().toISOString());
        append(JSON.stringify({ args: args.slice(0, 2).map(a => String(a)) }));
        append(stack());
    } catch (e) { }
    return origExec.apply(this, args);
};
append('\n--- TRACE SOCKET PRELOAD LOADED at ' + new Date().toISOString() + ' ---\n');
