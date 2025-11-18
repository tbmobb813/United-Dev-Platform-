/* Trace child_process invocations for test debugging.
   This module is intended to be preloaded via NODE_OPTIONS: --require <thisfile>
   It patches child_process spawn/fork/exec/execFile and logs stack traces to /tmp/udp-spawn-trace.log
*/
const fs = require('fs');
const cp = require('child_process');
const logFile = '/tmp/udp-spawn-trace.log';
function writeLine(line) {
    try {
        fs.appendFileSync(logFile, line + '\n');
    } catch (e) {
        // ignore
    }
}
function traceWrap(orig, name) {
    return function (...args) {
        const err = new Error();
        const stack = err.stack ? err.stack.split('\n').slice(2).join('\n') : '<no-stack>';
        const info = {
            time: new Date().toISOString(),
            pid: process.pid,
            cwd: process.cwd(),
            method: name,
            args: args && args.length ? (Array.isArray(args[0]) ? args[0] : args.map(a => String(a)).slice(0, 5)) : [],
        };
        writeLine('--- SPAWN TRACE START ---');
        writeLine(JSON.stringify(info));
        writeLine(stack);
        writeLine('--- SPAWN TRACE END ---');
        return orig.apply(this, args);
    };
}
try {
    cp.spawn = traceWrap(cp.spawn, 'spawn');
    cp.exec = traceWrap(cp.exec, 'exec');
    cp.execFile = traceWrap(cp.execFile, 'execFile');
    cp.fork = traceWrap(cp.fork, 'fork');
    cp.spawnSync = traceWrap(cp.spawnSync, 'spawnSync');
    cp.execSync = traceWrap(cp.execSync, 'execSync');
    cp.execFileSync = traceWrap(cp.execFileSync, 'execFileSync');
} catch (e) {
    // best-effort
}
