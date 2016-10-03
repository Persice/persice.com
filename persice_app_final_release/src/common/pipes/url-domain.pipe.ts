import { Pipe, PipeTransform } from '@angular/core';

// Parsing a URI Reference with a Regular Expression
// https://tools.ietf.org/html/rfc3986#appendix-B
// For example, matching the above expression to
//
// http://www.ics.uci.edu/pub/ietf/uri/#Related
//
// results in the following subexpression matches:
//
//   $1 = http:
//   $2 = http
//   $3 = //www.ics.uci.edu
//   $4 = www.ics.uci.edu
//   $5 = /pub/ietf/uri/
//   $6 = <undefined>
//   $7 = <undefined>
//   $8 = #Related
//   $9 = Related
const URI_REGEX: RegExp = /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/ig;

@Pipe({
  name: 'urlDomain',
  pure: false
})
export class UrlDomainPipe implements PipeTransform {

  transform(value: any, ...args: any[]): string {
    if (value === '' || value === null || value === undefined) {
      return value;
    }

    let matchResults: RegExpExecArray;
    let regex: RegExp = URI_REGEX;
    let domain: string = '';

    while ((matchResults = regex.exec(value)) !== null) {
      if (matchResults.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      domain = matchResults[ 4 ] ? matchResults[ 4 ] : value;
    }

    return domain;

  }

}
