/* eslint-disable no-console */
// Diagnostic Jest globalTeardown used during debugging of open handles.
// This file is intentionally CJS so Jest can require it in both ESM and CJS runs.
try {
    const whyIsNodeRunning = require('why-is-node-running');
    module.exports = async function globalTeardown() {
        // Short delay to allow in-flight closes to settle.
        await new Promise((r) => setTimeout(r, 100));
        console.log('\n--- Jest globalTeardown: why-is-node-running output ---');
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
                    console.log(util.inspect(repr, { colors: false, depth: 2 }));
                } catch (e) {
                    console.log('handle', i, String(h));
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
