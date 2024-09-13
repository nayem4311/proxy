const express = require('express');
const request = require('request');
const app = express();

// Middleware to enable CORS for all origins
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/proxy', (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('No URL provided');

  console.log("Fetching URL:", url);  // Log the URL being fetched

  if (url.endsWith('.m3u8')) {
    request.get(url, (error, response, body) => {
      if (error) {
        console.error("Error fetching the m3u8 file:", error);
        return res.status(500).send('Error fetching the URL');
      }

      const modifiedBody = body.replace(/(https?:\/\/[^\s]+)/g, (match) => {
        return `https://proxy-eight-theta-46.vercel.app/proxy?url=${encodeURIComponent(match)}`;
      });

      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
      res.send(modifiedBody);
    });
  } else {
    request.get(url)
      .on('error', (err) => {
        console.error("Error fetching the segment:", err);
        res.status(500).send('Error fetching the URL');
      })
      .pipe(res);
  }
});


// Start the server
app.listen(3000, () => {
  console.log('Proxy server running on port 3000');
});
