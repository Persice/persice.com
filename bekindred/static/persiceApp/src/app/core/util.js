"use strict";
var lodash_1 = require('lodash');
var moment = require('moment');
var momentTz = require('moment-timezone/builds/moment-timezone-with-data.min');
var ListUtil = (function () {
    function ListUtil() {
    }
    ListUtil.take = function (arr, n) {
        return lodash_1.take(arr, n);
    };
    ListUtil.skip = function (arr, x, y) {
        return lodash_1.take(lodash_1.slice(arr, x), y);
    };
    ListUtil.orderBy = function (arr, iteratees, order) {
        return lodash_1.orderBy(arr, iteratees, order);
    };
    ListUtil.filter = function (arr, property, value) {
        return lodash_1.filter(arr, property, value);
    };
    ListUtil.findIndex = function (arr, props) {
        return lodash_1.findIndex(arr, props);
    };
    ListUtil.find = function (arr, props) {
        return lodash_1.find(arr, props);
    };
    return ListUtil;
}());
exports.ListUtil = ListUtil;
var ObjectUtil = (function () {
    function ObjectUtil() {
    }
    ObjectUtil.clone = function (data) {
        return JSON.parse(JSON.stringify(data));
    };
    ObjectUtil.join = function (objA, objB) {
        return lodash_1.merge(objA, objB);
    };
    ObjectUtil.assign = function (objA, objB) {
        return lodash_1.merge(objA, objB);
    };
    ObjectUtil.defaults = function (objA, objB) {
        return lodash_1.merge(objA, objB);
    };
    ObjectUtil.merge = function (dest, src) {
        if (ObjectUtil.isBlank(src)) {
            return dest;
        }
        if (ObjectUtil.isBlank(dest)) {
            return src;
        }
        for (var prop in src) {
            if (src.hasOwnProperty(prop)) {
                dest[prop] = src[prop];
            }
        }
        return dest;
    };
    ObjectUtil.isPresent = function (data) {
        return !ObjectUtil.isBlank(data);
    };
    ObjectUtil.isBlank = function (data) {
        return data === undefined || data === null;
    };
    ObjectUtil.count = function (data) {
        return Object.keys(data).length;
    };
    //transform and take first n items from {key: value} to [{value: VALUE, match: 1|0}]
    ObjectUtil.first = function (data, n) {
        var keys = [];
        for (var key in data) {
            if (data[key] === 1) {
                keys.push({
                    value: key,
                    match: true
                });
            }
            else {
                keys.push({
                    value: key,
                    match: false
                });
            }
        }
        return lodash_1.take(keys, n);
    };
    ObjectUtil.take = function (arr, n) {
        return lodash_1.take(arr, n);
    };
    //transform and take sorted n items from {key: value} to [{value: VALUE, match: 1|0}]
    ObjectUtil.firstSorted = function (data, n) {
        var keys = [];
        for (var key in data) {
            if (data[key] === 1) {
                keys.push({
                    value: key,
                    match: true
                });
            }
            else {
                keys.push({
                    value: key,
                    match: false
                });
            }
        }
        return lodash_1.orderBy(lodash_1.take(keys, n), ['match'], ['desc']);
    };
    //transform and take first n items from {key: value} to [{value: VALUE, match: 1|0}]
    ObjectUtil.skip = function (data, n) {
        var keys = [];
        for (var key in data) {
            if (data[key] === 1) {
                keys.push({
                    value: key,
                    match: true
                });
            }
            else {
                keys.push({
                    value: key,
                    match: false
                });
            }
        }
        var sliced = lodash_1.slice(keys, n);
        return sliced;
    };
    //transform and items from '{key: value, key: value}' to [{value: VALUE, match: 1|0}]
    ObjectUtil.transform = function (data) {
        var keys = [];
        for (var key in data) {
            if (data[key] === 1) {
                keys.push({
                    value: key,
                    match: true
                });
            }
            else {
                keys.push({
                    value: key,
                    match: false
                });
            }
        }
        return keys;
    };
    ObjectUtil.transformSorted = function (data) {
        var keys = [];
        for (var key in data) {
            if (data[key] === 1) {
                keys.push({
                    value: key,
                    match: true
                });
            }
            else {
                keys.push({
                    value: key,
                    match: false
                });
            }
        }
        return lodash_1.orderBy(keys, ['match'], ['desc']);
    };
    ObjectUtil.transformToArray = function (data) {
        return lodash_1.keysIn(data);
    };
    return ObjectUtil;
}());
exports.ObjectUtil = ObjectUtil;
var FileUtil = (function () {
    function FileUtil() {
    }
    FileUtil.isImage = function (filename) {
        var regex = new RegExp('(.*?)\.(gif|jpg|jpeg|tiff|png)$');
        if (!(regex.test(filename))) {
            return false;
        }
        else {
            return true;
        }
    };
    return FileUtil;
}());
exports.FileUtil = FileUtil;
var CookieUtil = (function () {
    function CookieUtil() {
    }
    CookieUtil.getValue = function (name) {
        var value = '; ' + document.cookie;
        var parts = value.split('; ' + name + '=');
        if (parts.length === 2)
            return parts.pop().split(';').shift();
    };
    return CookieUtil;
}());
exports.CookieUtil = CookieUtil;
var GoogleUtil = (function () {
    function GoogleUtil() {
    }
    GoogleUtil.extractFromAddress = function (components, type, type2) {
        for (var i = 0; i < components.length; i++) {
            for (var j = 0; j < components[i].types.length; j++) {
                if (components[i].types[j] === type) {
                    return components[i][type2];
                }
            }
        }
        return '';
    };
    GoogleUtil.parseLocation = function (loc) {
        var model = {
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
            var location_1 = loc.address_components;
            model.street = GoogleUtil.extractFromAddress(location_1, 'route', 'long_name') + ' ' + GoogleUtil.extractFromAddress(location_1, 'street_number', 'long_name');
            model.zipcode = GoogleUtil.extractFromAddress(location_1, 'postal_code', 'long_name');
            if (model.zipcode === '') {
                model.zipcode = null;
            }
            model.location_name = loc.name;
            model.full_address = loc.formatted_address;
            model.state = GoogleUtil.extractFromAddress(location_1, 'administrative_area_level_1', 'short_name');
            model.country = GoogleUtil.extractFromAddress(location_1, 'country', 'short_name');
            model.city = GoogleUtil.extractFromAddress(location_1, 'locality', 'long_name');
            if (model.state.length > 3) {
                model.state = model.country;
            }
            model.location = loc.geometry.location.lat() + ',' + loc.geometry.location.lng();
        }
        else {
            model.address = loc;
            model.full_address = '';
            model.location_name = loc;
            model.location = '0,0';
        }
        return model;
    };
    return GoogleUtil;
}());
exports.GoogleUtil = GoogleUtil;
var FormUtil = (function () {
    function FormUtil() {
    }
    FormUtil.formData = function (data) {
        var formData = new FormData();
        lodash_1.forEach(data, function (value, key) {
            if (value instanceof FileList) {
                if (value.length === 1) {
                    formData.append(key, value[0]);
                }
                else {
                    lodash_1.forEach(value, function (file, index) {
                        formData.append(key + '_' + index, file);
                    });
                }
            }
            else {
                formData.append(key, value);
            }
        });
        return formData;
    };
    return FormUtil;
}());
exports.FormUtil = FormUtil;
var StringUtil = (function () {
    function StringUtil() {
    }
    StringUtil.contains = function (data, substring) {
        if (data.indexOf(substring) !== -1) {
            return true;
        }
        else {
            return false;
        }
    };
    StringUtil.words = function (text, maxLength, options) {
        if (text.length <= maxLength) {
            return text;
        }
        if (!options)
            options = {};
        var defaultOptions = {
            suffix: true,
            suffixString: ' ...',
            preserveWordBoundaries: true,
            wordSeparator: ' '
        };
        options = defaultOptions;
        // Compute suffix to use (eventually add an ellipsis)
        var suffix = '';
        if (text.length > maxLength && options.suffix) {
            suffix = options.suffixString;
        }
        // Compute the index at which we have to cut the text
        var maxTextLength = maxLength - suffix.length;
        var cutIndex;
        if (options.preserveWordBoundaries) {
            // We use +1 because the extra char is either a space or will be cut anyway
            // This permits to avoid removing an extra word when there's a space at the maxTextLength index
            var lastWordSeparatorIndex = text.lastIndexOf(options.wordSeparator, maxTextLength + 1);
            // We include 0 because if have a 'very long first word' (size > maxLength), we still don't want to cut it
            // But just display '...'. But in this case the user should probably use preserveWordBoundaries:false...
            cutIndex = lastWordSeparatorIndex > 0 ? lastWordSeparatorIndex : maxTextLength;
        }
        else {
            cutIndex = maxTextLength;
        }
        var newText = text.substr(0, cutIndex);
        return newText + suffix;
    };
    return StringUtil;
}());
exports.StringUtil = StringUtil;
var DateUtil = (function () {
    function DateUtil() {
    }
    DateUtil.moment = function (timestamp) {
        return moment.utc(timestamp);
    };
    DateUtil.convertFromUnixToDate = function (timestamp) {
        return moment.unix(timestamp).format('MM/DD/YYYY');
    };
    DateUtil.convertToHours = function (mins) {
        var hours = Math.trunc(mins / 60);
        var minutes = mins % 60;
        var combined = hours + ":" + minutes;
        return combined;
    };
    DateUtil.getTodayDate = function () {
        var year = parseInt(moment.utc().format('YYYY'), 10);
        var month = parseInt(moment.utc().format('MM'), 10);
        var day = parseInt(moment.utc().format('DD'), 10);
        return [year, month, day];
    };
    DateUtil.isBeforeToday = function (date) {
        var dayDiff = moment.utc().diff(date, 'days');
        if (dayDiff > 0) {
            return true;
        }
        else {
            return false;
        }
    };
    DateUtil.convertTo24Hour = function (time) {
        var hours = parseInt(time.substr(0, 2), 10);
        if (time.indexOf('AM') !== -1 && hours === 12) {
            time = time.replace('12', '0');
        }
        if (time.indexOf('PM') !== -1 && hours < 12) {
            time = time.replace(hours, (hours + 12));
        }
        return time.replace(/(AM|PM)/, '');
    };
    DateUtil.format = function (data, format) {
        var tz = jstz.determine();
        var tzName = tz.name();
        var formatedDate = moment.utc(data).tz(tzName).format(format);
        return formatedDate;
    };
    DateUtil.formatUTC = function (data, format) {
        var formatedDate = moment(data).utc().format(format);
        return formatedDate;
    };
    DateUtil.convertToLocal = function (data) {
        var tz = jstz.determine();
        var tzName = tz.name();
        var localDate = moment.utc(data).tz(tzName);
        return localDate;
    };
    DateUtil.localTimezone = function () {
        var tz = jstz.determine();
        var tzName = tz.name();
        return moment.tz(tzName).format('z');
    };
    //round up nearest hour
    DateUtil.todayRoundUp = function () {
        var tz = jstz.determine();
        var tzName = tz.name();
        var datetime = new Date();
        return moment(datetime).tz(tzName).add(1, 'hours').startOf('hour');
    };
    //round up nearest hour
    DateUtil.todayAddHourRoundUp = function () {
        var tz = jstz.determine();
        var tzName = tz.name();
        var datetime = new Date();
        return moment(datetime).tz(tzName).add(2, 'hours').startOf('hour');
    };
    //time ago
    DateUtil.fromNow = function (date) {
        var tz = jstz.determine();
        var tzName = tz.name();
        return moment(date).tz(tzName).fromNow();
    };
    return DateUtil;
}());
exports.DateUtil = DateUtil;
var EventUtil = (function () {
    function EventUtil() {
    }
    EventUtil.accessLevel = function (data) {
        var returnValue = '';
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
    };
    return EventUtil;
}());
exports.EventUtil = EventUtil;
var UserUtil = (function () {
    function UserUtil() {
    }
    UserUtil.gender = function (data) {
        var returnValue = '';
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
    };
    return UserUtil;
}());
exports.UserUtil = UserUtil;
