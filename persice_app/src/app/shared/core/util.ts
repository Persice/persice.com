import {take, slice, keysIn, forEach, merge, filter, orderBy, find, findIndex} from 'lodash';

const moment = require('moment');
require('moment-timezone/builds/moment-timezone-with-data.min');

export class ListUtil {
  static take(arr: any[], n: number): any[] {
    return take(arr, n);
  }

  static skip(arr: any[], x: number, y: number): any[] {
    return take(slice(arr, x), y);
  }

  static orderBy(arr: any[], iteratees, order): any[] {
    return orderBy(arr, iteratees, order);
  }

  static filter(arr: any[], property, value): any[] {
    return filter(arr, property, value);
  }

  static findIndex(arr: any[], props): number {
    return findIndex(arr, props);
  }

  static find(arr: any[], props): any {
    return find(arr, props);
  }

  static filterAndCount(arr: any[], property, value): number {
    return filter(arr, property, value).length;
  }

}

export class FriendUtil {
  static pickFourFriendsforPreview(
    friendsPersice: any[],
    friendsFacebook: any[],
    friendsLinkedin: any[],
    friendsTwitterFriends: any[],
    friendsTwitterFollowers: any[]
  ): any[] {
    const PREVIEW_LIMIT = 4;
    let list = [];
    let count = 0;

    if (count < PREVIEW_LIMIT) {
      for (let i = friendsPersice.length - 1; i >= 0; i--) {
        if (count === PREVIEW_LIMIT) { break; }
        count++;
        let item = friendsPersice[i];
        item.type = 'persice';
        list = [...list, item];
      }
    }

    if (count < PREVIEW_LIMIT) {
      for (let i = friendsFacebook.length - 1; i >= 0; i--) {
        if (count === PREVIEW_LIMIT) { break; }
        count++;
        let item = friendsFacebook[i];
        item.type = 'facebook';
        list = [...list, item];
      }
    }

    if (count < PREVIEW_LIMIT) {
      for (let i = friendsLinkedin.length - 1; i >= 0; i--) {
        if (count === PREVIEW_LIMIT) { break; }
        count++;
        let item = friendsLinkedin[i];
        item.type = 'linkedin';
        list = [...list, item];
      }
    }

    if (count < PREVIEW_LIMIT) {
      for (let i = friendsTwitterFriends.length - 1; i >= 0; i--) {
        if (count === PREVIEW_LIMIT) { break; }
        count++;
        let item = friendsTwitterFriends[i];
        item.type = 'twitter';
        list = [...list, item];
      }
    }

    if (count < PREVIEW_LIMIT) {
      for (let i = friendsTwitterFollowers.length - 1; i >= 0; i--) {
        if (count === PREVIEW_LIMIT) { break; }
        count++;
        let item = friendsTwitterFollowers[i];
        item.type = 'twitter';
        list = [...list, item];
      }
    }

    return list;
  }
}

export class ObjectUtil {

  static clone<T extends Object>(data: T): T {
    return JSON.parse(JSON.stringify(data));
  }

  static join<T extends Object>(objA: T, objB: T): any {
    return merge(objA, objB);
  }

  static assign<T extends Object>(objA: T, objB: T): any {
    return merge(objA, objB);
  }

  static defaults<T extends Object>(objA: T, objB: T): any {
    return merge(objA, objB);
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

  static take(arr: any[], n: number): any[] {
    return take(arr, n);
  }

  //transform and take sorted n items from {key: value} to [{value: VALUE, match: 1|0}]
  static firstSorted(data, n): Array<Object> {
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
    return orderBy(take(keys, n), ['match'], ['desc']);
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

  static transformSorted(data): Array<Object> {
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
    return orderBy(keys, ['match'], ['desc']);
  }



  static transformToArray(data) {

    return keysIn(data);
  }

}


export class FileUtil {
  static isImage(filename: string) {
    let regex = new RegExp('(.*?)\.(gif|jpg|jpeg|tiff|png)$');
    if (!(regex.test(filename))) {
      return false;
    } else {
      return true;
    }
  }
}


export class CookieUtil {
  static getValue(name: any): string {
    let value = '; ' + document.cookie;
    let parts = value.split('; ' + name + '=');
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
}


export class GoogleUtil {
  static extractFromAddress(components, type, type2) {
    for (var i = 0; i < components.length; i++) {
      for (var j = 0; j < components[i].types.length; j++) {
        if (components[i].types[j] === type) {
          return components[i][type2];
        }
      }
    }
    return '';

  }

  static parseLocation(loc) {
    let model = {
      street: '',
      zipcode: '',
      state: '',
      address: '',
      full_address: '',
      city: '',
      country: '',
      location: '',
      location_name: ''
    };

    if (loc !== null && typeof loc === 'object' && loc.hasOwnProperty('address_components') && loc.hasOwnProperty('geometry')) {
      let location = loc.address_components;



      model.street = GoogleUtil.extractFromAddress(location, 'route', 'long_name') + ' ' + GoogleUtil.extractFromAddress(location, 'street_number', 'long_name');
      model.zipcode = GoogleUtil.extractFromAddress(location, 'postal_code', 'long_name');
      if (model.zipcode === '') {
        model.zipcode = null;
      }
      model.location_name = loc.name;
      model.full_address = loc.formatted_address;
      model.state = GoogleUtil.extractFromAddress(location, 'administrative_area_level_1', 'short_name');
      model.country = GoogleUtil.extractFromAddress(location, 'country', 'short_name');
      model.city = GoogleUtil.extractFromAddress(location, 'locality', 'long_name');
      if (model.state.length > 3) {
        model.state = model.country;
      }
      model.location = loc.geometry.location.lat() + ',' + loc.geometry.location.lng();
    } else {
      model.address = loc;
      model.full_address = '';
      model.location_name = loc;
      model.location = '0,0';
    }

    return model;

  }

}

export class FormUtil {
  static formData(data: any): FormData {
    let formData = new FormData();

    forEach(data, (value, key) => {
      if (value instanceof FileList) {
        if (value.length === 1) {
          formData.append(key, value[0]);
        } else {
          forEach(value, (file, index) => {
            formData.append(key + '_' + index, file);
          });
        }
      } else {
        formData.append(key, value);
      }
    });
    return formData;
  }
}


export class StringUtil {
  static contains<T extends string>(data: T, substring): boolean {
    if (data === null || substring === null) {
      return false;
    }

    if (data.indexOf(substring) !== -1) {
      return true;
    } else {
      return false;
    }
  }

  static words(text: string, maxLength: number, options?: any): string {
    if (text.length <= maxLength) {
      return text;
    }
    if (!options) options = {};
    let defaultOptions = {
      suffix: true,
      suffixString: ' ...',
      preserveWordBoundaries: true,
      wordSeparator: ' '
    };
    options = defaultOptions;
    // Compute suffix to use (eventually add an ellipsis)
    let suffix = '';
    if (text.length > maxLength && options.suffix) {
      suffix = options.suffixString;
    }

    // Compute the index at which we have to cut the text
    let maxTextLength = maxLength - suffix.length;
    let cutIndex;
    if (options.preserveWordBoundaries) {
      // We use +1 because the extra char is either a space or will be cut anyway
      // This permits to avoid removing an extra word when there's a space at the maxTextLength index
      let lastWordSeparatorIndex = text.lastIndexOf(options.wordSeparator, maxTextLength + 1);
      // We include 0 because if have a 'very long first word' (size > maxLength), we still don't want to cut it
      // But just display '...'. But in this case the user should probably use preserveWordBoundaries:false...
      cutIndex = lastWordSeparatorIndex > 0 ? lastWordSeparatorIndex : maxTextLength;
    } else {
      cutIndex = maxTextLength;
    }

    let newText = text.substr(0, cutIndex);
    return newText + suffix;
  }
}


export class DateUtil {

  static moment<S extends string>(timestamp: S): any {
    return moment.utc(timestamp);
  }

  static convertFromUnixToDate<S extends string, N extends number>(timestamp: N): S {
    return moment.unix(timestamp).format('MM/DD/YYYY');
  }


  static convertToHours(mins: number): string {
    let hours = Math.trunc(mins / 60);
    let minutes = mins % 60;
    let combined = `${hours}:${minutes}`;
    return combined;
  }

  static getTodayDate(): any {
    let year = parseInt(moment.utc().format('YYYY'), 10);
    let month = parseInt(moment.utc().format('MM'), 10);
    let day = parseInt(moment.utc().format('DD'), 10);
    return [year, month, day];
  }

  static isBeforeToday(date): boolean {
    let dayDiff = moment.utc().diff(date, 'days');
    if (dayDiff > 0) {
      return true;
    } else {
      return false;
    }
  }


  static convertTo24Hour(time: any): any {
    let hours = parseInt(time.substr(0, 2), 10);
    if (time.indexOf('AM') !== -1 && hours === 12) {
      time = time.replace('12', '0');
    }
    if (time.indexOf('PM') !== -1 && hours < 12) {
      time = time.replace(hours, (hours + 12));
    }
    return time.replace(/(AM|PM)/, '');
  }

  static format<T extends Date, S extends string>(data: T, format: S): S {
    let tz = jstz.determine();
    let tzName = tz.name();
    let formatedDate = moment.utc(data).tz(tzName).format(format);

    return formatedDate;
  }


  static formatUTC<A extends any[], S extends string>(data: A, format: S): S {
    let formatedDate = moment(data).utc().format(format);

    return formatedDate;
  }

  static convertToLocal(data): any {
    let tz = jstz.determine();
    let tzName = tz.name();
    let localDate = moment.utc(data).tz(tzName);

    return localDate;
  }


  static localTimezone<S extends string>(): S {
    let tz = jstz.determine();
    let tzName = tz.name();
    return moment.tz(tzName).format('z');
  }

  //round up nearest hour
  static todayRoundUp(): any {
    let tz = jstz.determine();
    let tzName = tz.name();

    let datetime = new Date();
    return moment(datetime).tz(tzName).add(1, 'hours').startOf('hour');
  }

  //round up nearest hour
  static todayAddHourRoundUp(): any {
    let tz = jstz.determine();
    let tzName = tz.name();

    let datetime = new Date();
    return moment(datetime).tz(tzName).add(2, 'hours').startOf('hour');
  }


  //time ago
  static fromNow(date): any {
    let tz = jstz.determine();
    let tzName = tz.name();
    return moment(date).tz(tzName).fromNow();
  }



}


export class EventUtil {
  static accessLevel(data: string): string {
    let returnValue = '';
    switch (data) {
      case 'public':
        returnValue = 'Public (all Persice users)';
        break;
      case 'private':
        returnValue = 'Private (only select users)';
        break;
      case 'connections':
        returnValue = 'Only my connections (default)';
        break;
      default:
        break;
    }
    return returnValue;

  }

}

export class UserUtil {
  static gender(data: string): string {
    let returnValue = '';
    switch (data) {
      case 'm':
        returnValue = 'Male';
        break;
      case 'f':
        returnValue = 'Female';
        break;
      default:
        break;
    }
    return returnValue;

  }

}
