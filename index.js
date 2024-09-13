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
  const url = req.query.url;  // URL should be passed as a query parameter
  if (!url) return res.status(400).send('No URL provided');

  // Check if the URL is valid
  if (!/^https?:\/\//i.test(url)) {
    return res.status(400).send('Invalid URL');
  }

  // Fetch the content from the URL
  request
    .get(url)
    .on('response', (response) => {
      // Set the appropriate content-type header
      res.setHeader('Content-Type', response.headers['content-type']);
    })
    .on('error', (err) => {
      res.status(500).send('Error fetching the URL');
    })
    .pipe(res);
});

app.listen(3000, () => {
  console.log('Proxy server running on port 3000');
});
