/**
 * @author: @Persice
 */

var path = require('path');
var crypto = require('crypto');
// Helper functions
var ROOT = path.resolve(__dirname, '..');

function hasProcessFlag(flag) {
  return process.argv.join('').indexOf(flag) > -1;
}

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [ROOT].concat(args));
}

function checkNodeImport(context, request, cb) {
  if (!path.isAbsolute(request) && request.charAt(0) !== '.') {
    cb(null, 'commonjs ' + request); return;
  }
  cb();
}

function generateHash() {
  var hash = crypto.randomBytes(20).toString('hex');
  return hash;
}

function isWebpackDevServer() {
  return process.argv[1] && !! (/webpack-dev-server$/.exec(process.argv[1]));
}

exports.hasProcessFlag = hasProcessFlag;
exports.generateHash = generateHash;
exports.isWebpackDevServer = isWebpackDevServer;
exports.checkNodeImport = checkNodeImport;
exports.root = root;
