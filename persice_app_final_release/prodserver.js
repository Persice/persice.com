const compression = require('compression');
const express = require('express');
const proxy = require('http-proxy-middleware');
const url = require('url');
path = require('path');

const E2E_PORT = require('./constants').E2E_PORT;
const HOST = require('./constants').HOST;
const PROD_PORT = require('./constants').PROD_PORT;

const app = express();
const ROOT = path.join(path.resolve(__dirname, '..'));

app.use(compression());
app.use(express.static('dist/client'));

app.use('/api', proxy({target: 'http://test-local.com:8000'}));
app.use('/socket.io', proxy({target: 'http://test-local.com:8000', ws:true}));
app.use('/media/', proxy({target: 'http://test-local.com:8000'}));
app.use('/static/', proxy({target: 'http://test-local.com:8000'}));

const renderIndex = (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist/client/index.html'));
}

app.get('/*', renderIndex);

let e2e;
const ENV = process.env.npm_lifecycle_event;
if (ENV === 'e2e:server') { e2e = E2E_PORT };
const PORT = e2e || PROD_PORT;

app.listen(PORT, () => {
  console.log(`Listening on: http://${HOST}:${PORT}`);
});
