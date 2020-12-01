const { createProxyMiddleware }  = require('http-proxy-middleware');
const URL = require('url').URL;
const chalk = require('chalk');
const dotenv = require('dotenv');
const express = require('express');

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

const handleError = (err, req, resp) => {
  const host = req.headers && req.headers.host;
  const code = err.code;

  if (code === 'SELF_SIGNED_CERT_IN_CHAIN') {
    console.error(`${chalk.red('WARNING:')} You will need to specify the NODE_EXTRA_CA_CERTS env var when running the proxy against a host with a self signed certificate!`);
    console.error(`${chalk.yellow('USAGE:')} NODE_EXTRA_CA_CERTS=/path/to/jumpcloud-workstation/pki/certs/ca.crt npm run start`);
  }

  resp.writeHead(500);
  resp.end(`Error occured while trying to proxy to: ${host} ${req.url}. Error: ${code}\n`);
};

const proxy = createProxyMiddleware({
  target: HOST,
  changeOrigin: true,
  headers: {
    'x-api-key': API_KEY,
  },
  onError: handleError,
});

app.use('/api', proxy);

app.listen(PORT, function() {
  console.log('Server started on port ' + PORT);
});
