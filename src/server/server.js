const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();

// Allow all CORS requests
app.use(cors());

// Serve files in the current directory
app.use(express.static(__dirname));

// Custom middleware to serve directory listing in JSON format
app.use(async (req, res, next) => {
  const dirPath = path.join(__dirname, req.url);
  
  try {
    const entries = await fs.readdir(dirPath);
    const files = [];
    const folders = [];

    for (const entry of entries) {
      const entryPath = path.join(dirPath, entry);
      const stats = await fs.stat(entryPath);

      if (stats.isDirectory()) {
        folders.push({ name: entry, type: 'folder' });
      } else if (stats.isFile()) {
        files.push({ name: entry, type: 'file' });
      }
    }

    const directoryListing = {
      files: files,
      folders: folders
    };

    res.json(directoryListing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

