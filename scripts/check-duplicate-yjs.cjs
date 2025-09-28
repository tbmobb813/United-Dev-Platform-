#!/usr/bin/env node
/* eslint-disable no-console */
(() => {
  (async () => {
    try {
      // Build a file:// URL pointing at the ESM detector and dynamic-import it.
      const path = require('path');
      const url = require('url');
      const detectorPath = path.join(__dirname, 'check-duplicate-yjs.js');
      const fileUrl = url.pathToFileURL(detectorPath).href;
      // Import the ESM module namespace
      const mod = await import(fileUrl);
      // If the module exports a `main` function, call it so the detector runs.
      if (mod && typeof mod.main === 'function') {
        try {
          // main may be async
          await mod.main();
        } catch (runErr) {
          // eslint-disable-next-line no-console
          console.error(
            'Detector execution failed:',
            runErr && runErr.stack ? runErr.stack : String(runErr)
          );
          process.exit(1);
        }
      } else {
        // eslint-disable-next-line no-console
        console.error('ESM detector did not export `main()`');
        process.exit(1);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(
        'Failed to load ESM detector:',
        err && err.stack ? err.stack : String(err)
      );
      process.exit(1);
    }
  })();
})();
