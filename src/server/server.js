const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();

// Allow all CORS requests
app.use(cors());

// Custom middleware to sanitize req.url
app.use((req, res, next) => {
  // Define a whitelist regex for allowed characters
  const whitelistRegex = /^[a-zA-Z0-9\/._-]+$/;

  // Normalize the URL and decode URL-encoded characters
  const sanitizedUrl = decodeURIComponent(req.url);

  // Validate against the whitelist regex
  if (!whitelistRegex.test(sanitizedUrl)) {
    // Reject requests with disallowed characters
    return res.status(400).send('Bad Request');
  }

  // If URL passes validation, continue to the next middleware
  next();
});

// Custom middleware to serve directory listing in JSON format
app.use(async (req, res, next) => {
  const dirPath = path.join(__dirname, req.url);

  try {
    const stats = await fs.stat(dirPath);

    if (stats.isDirectory()) {
      const entries = await fs.readdir(dirPath);
      const files = [];
      const folders = [];

      for (const entry of entries) {
        const entryPath = path.join(dirPath, entry);
        const entryStats = await fs.stat(entryPath);

        if (entryStats.isDirectory()) {
          folders.push({ name: entry, type: 'folder' });
        } else if (entryStats.isFile()) {
          files.push({ name: entry, type: 'file' });
        }
      }

      const directoryListing = {
        files: files,
        folders: folders
      };

      res.json(directoryListing);
    } else {
      // Return 404 if the requested path is not a directory
      res.status(404).send('Not Found');
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
