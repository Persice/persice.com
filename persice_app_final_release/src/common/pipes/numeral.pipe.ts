import { Pipe, Injectable, PipeTransform } from '@angular/core';

@Injectable()
@Pipe({
  name: 'numeral'
})
export class NumeralPipe implements PipeTransform {
  transform(value: any, ...args: any[]): string {
    let retValue: string = '';

    if (isNaN(value) || value == null) {
      return '';
    }

    value = value.toFixed(~~'.');

    let parts = value.split('.'),
      fnums = parts[ 0 ],
      decimals = parts[ 1 ] ? '.' + parts[ 1 ] : '';

    retValue = fnums.replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + ',') + decimals;

    return retValue;

  }
}
