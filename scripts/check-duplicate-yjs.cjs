#!/usr/bin/env node
(() => {
	(async () => {
		try {
			// Build a file:// URL pointing at the ESM detector and dynamic-import it.
			const path = require('path');
			const url = require('url');
			const detectorPath = path.join(__dirname, 'check-duplicate-yjs.js');
			const fileUrl = url.pathToFileURL(detectorPath).href;
			await import(fileUrl);
		} catch (err) {
			// eslint-disable-next-line no-console
			console.error('Failed to load ESM detector:', err && err.stack ? err.stack : String(err));
			process.exit(1);
		}
	})();
})();
