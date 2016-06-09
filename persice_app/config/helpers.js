/**
 * @author: @Persice
 */

var path = require('path');
var crypto = require('crypto');
// Helper functions
var ROOT = path.resolve(__dirname, '..');

console.log('root directory:', root() + '\n');

function hasProcessFlag(flag) {
  return process.argv.join('').indexOf(flag) > -1;
}

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [ROOT].concat(args));
}

function generateHash() {
  var hash = crypto.randomBytes(20).toString('hex');
  return hash;
}


exports.hasProcessFlag = hasProcessFlag;
exports.generateHash = generateHash;
exports.root = root;
