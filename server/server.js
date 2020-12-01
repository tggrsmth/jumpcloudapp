const URL = require('url').URL;
const dotenv = require('dotenv');
const express = require('express');
const { createProxyMiddleware }  = require('http-proxy-middleware');

const app = express();
const PORT = 8005;

dotenv.config();

const { API_KEY, HOST } = process.env;

try {
  new URL(HOST);
} catch (exp) {
  throw Error('Please enter a valid URL for the HOST field in .env!');
}

if (!API_KEY) {
  throw Error('Please enter a value for the API_KEY field in .env!');
}

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

const proxy = createProxyMiddleware({
  target: HOST,
  changeOrigin: true,
  headers: {
    'x-api-key': API_KEY,
  },
});

app.use('/api', proxy);

app.listen(PORT, function() {
  console.log('Server started on port ' + PORT);
});
