import 'core-js/es6/reflect';
import 'core-js/es7/reflect';
import 'core-js/client/shim';
import 'zone.js/dist/zone';
import 'zone.js/dist/long-stack-trace-zone';
import 'ts-helpers';

if ('production' === ENV) {
  // Production


} else {
  // Development

  Error.stackTraceLimit = Infinity;

  require('zone.js/dist/long-stack-trace-zone');

}