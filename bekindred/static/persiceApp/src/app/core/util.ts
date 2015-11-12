/// <reference path="../../typings/_custom.d.ts" />
import {take, slice} from 'lodash';

export class ObjectUtil {

  static clone<T extends Object>(data: T): T {
    return JSON.parse(JSON.stringify(data));
  }

  static merge<T extends Object>(dest: T, src: T): T {
    if (ObjectUtil.isBlank(src)) {
      return dest;
    }
    if (ObjectUtil.isBlank(dest)) {
      return src;
    }

    for (let prop in src) {
      if (src.hasOwnProperty(prop)) {
        dest[prop] = src[prop];
      }
    }
    return dest;
  }

  static isPresent(data: any): boolean {
    return !ObjectUtil.isBlank(data);
  }

  static isBlank(data: any): boolean {
    return data === undefined || data === null;
  }

  static count(data: any): number {
    return Object.keys(data).length;
  }

  //transform and take first n items from {key: value} to [{value: VALUE, match: 1|0}]
  static first(data, n): Array<Object> {
    let keys = [];
    for (var key in data) {
      if (data[key] === 1) {
        keys.push({
          value: key,
          match: true
        });
      } else {
        keys.push({
          value: key,
          match: false
        });
      }
    }
    return take(keys, n);
  }

  //transform and take first n items from {key: value} to [{value: VALUE, match: 1|0}]
  static skip(data, n): Array<Object> {
    let keys = [];
    for (var key in data) {
      if (data[key] === 1) {
        keys.push({
          value: key,
          match: true
        });
      } else {
        keys.push({
          value: key,
          match: false
        });
      }
    }
    let sliced = slice(keys, n);
    return sliced;
  }

  //transform and items from '{key: value, key: value}' to [{value: VALUE, match: 1|0}]
  static transform(data): Array<Object> {
    let keys = [];
    for (var key in data) {
      if (data[key] === 1) {
        keys.push({
          value: key,
          match: true
        });
      } else {
        keys.push({
          value: key,
          match: false
        });
      }
    }
    return keys;
  }

}


export class CookieUtil {
  static getValue(name: any): string {
    let value = '; ' + document.cookie;
    let parts = value.split('; ' + name + '=');
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
}

