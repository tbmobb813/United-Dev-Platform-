/* Jest test helpers: patch global timers to unref them in Node test processes.
   This reduces the chance that a long-lived timer prevents the worker from exiting.
   It's a low-risk, test-only mitigation. */
try {
    if (typeof global !== 'undefined' && typeof global.setInterval === 'function') {
        const _setInterval = global.setInterval;
        global.setInterval = function (fn, ms, ...args) {
            const timer = _setInterval(fn, ms, ...args);
            try {
                if (timer && typeof timer.unref === 'function') timer.unref();
            } catch (e) {
                // ignore
            }
            return timer;
        };
    }
    if (typeof global !== 'undefined' && typeof global.setTimeout === 'function') {
        const _setTimeout = global.setTimeout;
        global.setTimeout = function (fn, ms, ...args) {
            const timer = _setTimeout(fn, ms, ...args);
            try {
                if (timer && typeof timer.unref === 'function') timer.unref();
            } catch (e) {
                // ignore
            }
            return timer;
        };
    }
} catch (e) {
    // best-effort; don't fail tests if we can't patch
}

// Per-worker diagnostic dump at worker shutdown to aid mapping leaks to Jest workers.
try {
    const fs = require('fs');
    const util = require('util');
    process.once('beforeExit', () => {
        try {
            const pid = process.pid;
            const workerId = process.env.JEST_WORKER_ID || '<none>';
            const outPath = `/tmp/udp-why-worker-${pid}.log`;
            const handles = process._getActiveHandles ? process._getActiveHandles() : [];
            const requests = process._getActiveRequests ? process._getActiveRequests() : [];
            const header = `workerDump pid=${pid} worker=${workerId} timestamp=${new Date().toISOString()}\n`;
            let body = '';
            body += '--- process._getActiveHandles() ---\n';
            handles.forEach((h, i) => {
                try {
                    const repr = {
                        index: i,
                        type: h && h.constructor ? h.constructor.name : typeof h,
                    };
                    if (h && h._onTimeout) repr._onTimeout = String(h._onTimeout).slice(0, 200);
                    if (h && typeof h.pid === 'number') repr.pid = h.pid;
                    if (h && (h.spawnfile || h.spawnpath)) repr.spawn = h.spawnfile || h.spawnpath;
                    if (h && h.remoteAddress) repr.remoteAddress = h.remoteAddress;
                    if (h && h.remotePort) repr.remotePort = h.remotePort;
                    if (h && h.localAddress) repr.localAddress = h.localAddress;
                    if (h && h.localPort) repr.localPort = h.localPort;
                    if (h && typeof h.isTTY === 'boolean') repr.isTTY = h.isTTY;
                    body += util.inspect(repr, { colors: false, depth: 2 }) + '\n';
                } catch (e) {
                    try {
                        body += `handle ${i} ${util.inspect(h, { colors: false, depth: 1 })}\n`;
                    } catch (ee) {
                        body += `handle ${i} ${String(h)}\n`;
                    }
                }
            });
            body += '\n--- process._getActiveRequests() ---\n';
            requests.forEach((r, i) => {
                try {
                    body += util.inspect({ index: i, type: r && r.constructor ? r.constructor.name : typeof r }, { depth: 2 }) + '\n';
                } catch (e) {
                    body += `request ${i} ${String(r)}\n`;
                }
            });
            fs.writeFileSync(outPath, header + body, { encoding: 'utf8' });
        } catch (e) {
            // ignore errors writing diagnostics
        }
    });
} catch (e) {
    // best-effort only
}
