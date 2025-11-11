/* eslint-disable no-console */
// Diagnostic Jest globalTeardown used during debugging of open handles.
// This file is intentionally CJS so Jest can require it in both ESM and CJS runs.
try {
    const whyIsNodeRunning = require('why-is-node-running');
    module.exports = async function globalTeardown() {
        // Run immediately (avoid creating timers here which would appear in the dump).
        console.log('\n--- Jest globalTeardown: why-is-node-running output ---');
        // print pid and worker id to correlate which worker emitted this dump
        try {
            console.log('teardown pid=%d JEST_WORKER_ID=%s title=%s', process.pid, process.env.JEST_WORKER_ID || '<none>', process.title);
        } catch (e) {
            // ignore
        }
        try {
            // whyIsNodeRunning prints info to stdout; call it to dump active handles.
            whyIsNodeRunning();
        } catch (err) {
            console.error('Failed to run why-is-node-running:', err);
        }
        try {
            // Also dump active handles/requests for extra context (best-effort).
            const util = require('util');
            const handles = process._getActiveHandles ? process._getActiveHandles() : [];
            const requests = process._getActiveRequests ? process._getActiveRequests() : [];
            console.log('\n--- process._getActiveHandles() ---');
            handles.forEach((h, i) => {
                try {
                    const repr = {
                        index: i,
                        type: h && h.constructor ? h.constructor.name : typeof h,
                    };
                    // Some timer objects expose _onTimeout; capture if available.
                    if (h && h._onTimeout) repr._onTimeout = String(h._onTimeout).slice(0, 200);
                    // ChildProcess handles can expose pid/spawned file
                    if (h && typeof h.pid === 'number') repr.pid = h.pid;
                    if (h && (h.spawnfile || h.spawnpath)) repr.spawn = h.spawnfile || h.spawnpath;
                    // Socket-like objects may expose remote/local info
                    if (h && h.remoteAddress) repr.remoteAddress = h.remoteAddress;
                    if (h && h.remotePort) repr.remotePort = h.remotePort;
                    if (h && h.localAddress) repr.localAddress = h.localAddress;
                    if (h && h.localPort) repr.localPort = h.localPort;
                    // Writable streams (stdout/stderr) expose isTTY
                    if (h && typeof h.isTTY === 'boolean') repr.isTTY = h.isTTY;
                    console.log(util.inspect(repr, { colors: false, depth: 2 }));
                } catch (e) {
                    try {
                        console.log('handle', i, util.inspect(h, { colors: false, depth: 1 }));
                    } catch (ee) {
                        console.log('handle', i, String(h));
                    }
                }
            });
            console.log('\n--- process._getActiveRequests() ---');
            requests.forEach((r, i) => {
                try {
                    console.log(util.inspect({ index: i, type: r && r.constructor ? r.constructor.name : typeof r }, { depth: 2 }));
                } catch (e) {
                    console.log('request', i, String(r));
                }
            });
            console.log('--- end of handle/request dump ---\n');
        } catch (err) {
            console.error('Failed to dump active handles/requests:', err);
        }
        console.log('--- end of why-is-node-running ---\n');
    };
} catch (err) {
    // If the package isn't installed, export a no-op teardown so tests still run.
    // In normal use we will have installed why-is-node-running as a devDependency.
    module.exports = async function globalTeardown() {
        // no-op
    };
}
