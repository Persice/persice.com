import { Pipe, Injectable, PipeTransform } from '@angular/core';
import { DomSanitizationService } from '@angular/platform-browser';

@Injectable()
@Pipe({
  name: 'ignoreMarkup'
})
export class IgnoreMarkupPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizationService) {}

  private eventInfoRegex = /\[eventStart\].+?\[eventEnd\]/g; // anything inside [eventStart][eventEnd] tags

  public transform(value: string): string {
    if (!value) {
      return value;
    }

    let message: string = value.replace(this.eventInfoRegex, '');

    message = message.replace(/\*/g, '');
    message = message.replace(/_/g, '');
    message = message.replace(/\[title\]/g, '');
    message = message.replace(/\[http.+?\]/g, '');
    message = message.replace(/\[www.+?\]/g, '');

    return message;
  }
}
