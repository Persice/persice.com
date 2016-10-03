const path = require('path');
var crypto = require('crypto');
var dotenv = require('dotenv');

// Helper functions
const _root = path.resolve(__dirname);

function checkNodeImport(context, request, cb) {
  if (!path.isAbsolute(request) && request.charAt(0) !== '.') {
    cb(null, 'commonjs ' + request);
    return;
  }
  cb();
}

function includeClientPackages(packages) {
  return function (context, request, cb) {
    if (packages && packages.indexOf(request) !== -1) {
      return cb();
    }
    return checkNodeImport(context, request, cb);
  };
}

function hasProcessFlag(flag) {
  return process.argv.join('').indexOf(flag) > -1;
}

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [_root].concat(args));
}

function generateHash() {
  var hash = crypto.randomBytes(20).toString('hex');
  return hash;
}

exports.checkNodeImport;
exports.includeClientPackages = includeClientPackages;
exports.hasProcessFlag = hasProcessFlag;
exports.root = root;
exports.generateHash = generateHash;
exports.dotenv = dotenv;
