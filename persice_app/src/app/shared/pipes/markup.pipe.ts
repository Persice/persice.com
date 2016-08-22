import { Pipe, Injectable, PipeTransform } from '@angular/core';
import { DomSanitizationService, SafeHtml } from '@angular/platform-browser';

@Injectable()
@Pipe({
  name: 'markup'
})
export class MarkupPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizationService) {}

  private eventInfoRegex = /\[eventStart\].+?\[eventEnd\]/g;

  public transform(value: string, args: any[]): SafeHtml {
    let message: string = value.replace(this.eventInfoRegex, '');
    let eventInfo: string[] = this.eventInfoRegex.exec(value);

    message = this.sanitizeInput(message);
    message = this.applyMarkup(message);
    message = this.formatEventInfoFromJson(message, eventInfo);

    return this.markAsSafeHtml(message);
  }

  public sanitizeInput(value: string) {
    let input: string = value;

    input = input.replace(/<+.+?>+/, '');
    input = input.replace(/<+\/.+?>+/, '');
    input = input.replace(/javascript:\/*[^\s-]*/, '');

    return input;
  }

  public applyMarkup(value: string): string {
    let message = value;
    message = this.applyBold(message);
    message = this.applyItalic(message);
    message = this.applyLineBreaks(message);
    message = this.applyLinks(message);
    // message = this.formatEventInfoFromJson(message);

    return message;
  }

  private applyBold(value: string): string {
    let message = value;
    message = message.replace(/\*([^\s-].*?)\*/g, '<strong>$1</strong>');

    return message;
  }

  private applyItalic(value: string): string {
    let message = value;
    message = message.replace(/_([^\s-].*?)_/g, '<i>$1</i>');

    return message;
  }

  private applyLineBreaks(value: string): string {
    let message = value;
    message = message.replace(/\n/g, ' <br>');

    return message;
  }

  private applyLinks(value: string) {
    let message = value;

    message = message.replace(/(https?:\/\/[^\s-]+)/g, '<a href="$1">$1</a>');
    message = message.replace(/([^\/])(www\.[^\s-]+)/g, '$1<a href="http://$2">$2</a>');

    return message;
  }

  private formatEventInfoFromJson(message: string, eventPart: string[]) {
    if (eventPart === undefined || eventPart === null || eventPart.length === 0) {
      return message;
    }

    let result = eventPart[0];

    let match: any[];
    let eventInfoRegex = /\[eventStart\](.+?)\[eventEnd\]/g;
    match = eventInfoRegex.exec(result);

    if (!match) {
      // Remove incomplete markup in case we failed to pass all values correctly.
      return message;
    }

    let event = JSON.parse(match[1]);

    // Format event info.
    result = message + result.replace(
      /\[eventStart\].+?\[eventEnd\]/g,
      `<br>
      <div style="background-color: lightgrey">
        <a href="https://persice.com/event/${event.id}">${event.name}</a> in ${event.location_name}<br>
        Event hosted by ${event.hosted_by}
      </div>`);

    // Replace the text in the existing event link so it looks more presentable.
    result = result.replace(/>https?:\/\/persice.com\/event\/(\d+)\/?</g, `>"${event.name}"<`);

    return result;
  }

  private markAsSafeHtml(message: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(message);
  }
}
