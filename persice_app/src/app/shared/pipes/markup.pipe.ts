import { Pipe, Injectable, PipeTransform } from '@angular/core';
import { DomSanitizationService, SafeHtml } from '@angular/platform-browser';
import { eventWidgetAsHtml } from './html/event.html';

@Injectable()
@Pipe({
  name: 'markup'
})
export class MarkupPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizationService) {}

  private eventInfoRegex = /\[eventStart\].+?\[eventEnd\]/g; // anything inside [eventStart][eventEnd] tags

  /**
   * Replace special markup with HTML equivalents. Supported markup is:
   *
   * - text enclosed in asterisks is made bold (wrapped in 'strong' tags)
   * - text enclose in underscores is italicized (wrapped in 'i' tags)
   * - line breaks are preserved (changed to 'br' tags)
   * - text links are changed to 'a' tags
   * - links in format '[http://example.com Page title]' are changed to 'a' tags
   * - if formatEventInfo is true change tags [eventStart]json data[eventEnd] into event widget, otherwise remove tags
   * from output text
   *
   * @param value to be parsed
   * @param formatEventInfo whether to insert Event info widget
   *
   * @returns {SafeHtml}
   */
  public transform(value: string, formatEventInfo: boolean): SafeHtml {
    if (!value) {
      return value;
    }

    let message: string = value.replace(this.eventInfoRegex, '');
    let eventInfo: string[] = this.eventInfoRegex.exec(value);

    message = this.sanitizeInput(message);
    message = this.applyMarkup(message);

    if (formatEventInfo) {
      message = this.formatEventInfoFromJson(message, eventInfo);
    }

    return this.markAsSafeHtml(message);
  }

  public sanitizeInput(value: string) {
    let input: string = value;

    input = input.replace(/<+.+?>+/, ''); // tags
    input = input.replace(/<+\/.+?>+/, ''); // tags inside tags
    input = input.replace(/javascript:\/*[^\s-]*/, ''); // 'javascript:' text followed by non-space

    return input;
  }

  public applyMarkup(value: string): string {
    let message = value;
    message = this.applyBold(message);
    message = this.applyItalic(message);
    message = this.applyHeadings(message);
    message = this.applyUnorderedLists(message);
    message = this.applyLineBreaks(message);
    message = this.applyAutodetectedLinks(message);
    message = this.applyMarkupLinks(message);

    return message;
  }

  private applyBold(value: string): string {
    let message = value;
    message = message.replace(/\*([^\s-].*?)\*/g, '<strong>$1</strong>'); // text enclosed in asterisks without space padding on the left side

    return message;
  }

  private applyItalic(value: string): string {
    let message = value;
    message = message.replace(/_([^\s-].*?)_/g, '<i>$1</i>'); // text enclosed in underscores without space padding in the left side

    return message;
  }

  private applyLineBreaks(value: string): string {
    let message = value;
    message = message.replace(/\n/g, ' <br>'); // newlines

    return message;
  }

  private applyHeadings(value: string): string {
    let message = value;
    message = message.replace(/\[title\](.*?)\[title\]/g, '<h4 class="message__system__title">$1</h4>');

    return message;
  }

  private applyUnorderedLists(value: string): string {
    let message = value;
    message = message.replace(/(?:^|\n)-\s(.+)/g, '<li>$1</li>'); // newline or string start, followed by dash and space
    message = message.replace(/(<li>.+<\/li>)/g, '<ul class="message__text-list pt-">$1</ul>');

    return message;
  }

  private applyAutodetectedLinks(value: string) {
    let message = value;

    message = message.replace(/([^\[]|^)(https?:\/\/[^\s-]+)/g, '$1<a href="$2" style="color:#6ad6f7">$2</a>'); // http(s) not starting with [ followed by non-spaces
    message = message.replace(/([^\/])(www\.[^\s-]+)/g, '$1<a href="http://$2" style="color:#6ad6f7">$2</a>'); // www. not starting with / followed by non-spaces

    return message;
  }

  private applyMarkupLinks(value: string) {
    let message = value;

    let regExp: RegExp = /\[(https?:\/\/)(.+?)\s+(.*)\]/g; // [http(s) followed by text, space, text and closed by ]

    let match: string[] = regExp.exec(message);

    if (match === undefined || match === null || match.length === 0) {
      return message;
    }

    let schema: string = match[1];
    let link: string = match[2];
    let title: string = match[3];

    message = message.replace(regExp, `<a href="${schema}${link}" style="color:#6ad6f7">${title}</a>`);

    return message;
  }

  private formatEventInfoFromJson(message: string, eventPart: string[]) {
    if (eventPart === undefined || eventPart === null || eventPart.length === 0) {
      return message;
    }

    let result = eventPart[0];

    let match: any[];
    let eventInfoRegex = /\[eventStart\](.+?)\[eventEnd\]/g; // anything inside [eventStart][eventEnd] tags
    match = eventInfoRegex.exec(result);

    if (!match) {
      // Remove incomplete markup in case we failed to pass all values correctly.
      return message;
    }

    let event = JSON.parse(match[1]);

    // Format event info.
    result = message + result.replace(/\[eventStart\].+?\[eventEnd\]/g, eventWidgetAsHtml(event));

    // Replace the text in the existing event link so it looks more presentable.
    result = result.replace(/>https?:\/\/persice.com\/event\/(\d+)\/?</g, `>"${event.name}"<`);

    return result;
  }

  private markAsSafeHtml(message: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(message);
  }
}
