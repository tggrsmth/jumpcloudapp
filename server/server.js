const express = require('express');
const proxy = require('http-proxy-middleware');
const dotenv = require('dotenv');
const app = express();
const PORT = 8005;

dotenv.config();

const API_KEY = process.env.API_KEY;

app.use(function(req, res, next) {
  const origin = req.headers.origin;

  if (String(origin).includes('http://localhost')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
  }

  if (req.method === 'OPTIONS') {
    res.send();
    return;
  }

  return next();
});

app.use('/api', proxy({
  target: 'https://console.jumpcloud.com',
  changeOrigin: true,
  headers: {
    'x-api-key': API_KEY,
  },
}));

app.listen(PORT, function() {
  console.log('Server started on port ' + PORT);
});
