import { Pipe, Injectable, PipeTransform } from '@angular/core';
import { DomSanitizationService, SafeHtml } from '@angular/platform-browser';

@Injectable()
@Pipe({
  name: 'markup'
})
export class MarkupPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizationService) {}

  public transform(value: string, args: any[]): SafeHtml {
    let message: string = value;

    message = this.sanitizeInput(message);
    message = this.applyMarkup(message);

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
    message = this.formatEventInfo(message);

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
    message = message.replace(/\n/g, '<br>');

    return message;
  }

  private applyLinks(value: string) {
    let message = value;
    message = message.replace(/(https?:\/\/[^\s-]+)/g, '<a href="$1">$1</a>');

    return message;
  }

  private formatEventInfo(value: string) {
    let message = value;

    let match: any[];
    let eventInfoRegex = /\[\s*event:\s*(\d+)\s*\|\|\s*(.+?)\s*?\|\|\s*(.+?)\s*\|\|\s*(.+?)\s*\]/g;
    // let regExp: RegExp = /\[\s*?event:/g;
    match = eventInfoRegex.exec(message);

    if (!match) {
      // Remove incomplete markup in case we failed to pass all values correctly.
      return message.replace(/\[\s*event.+\]/g, '');
    }

    message = message.replace(
      eventInfoRegex,
      '<a href="https://persice.com/event/$1">$2</a> in $4<br>Event hosted by $3');

    return message;
  }

  private markAsSafeHtml(message: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(message);
  }
}
