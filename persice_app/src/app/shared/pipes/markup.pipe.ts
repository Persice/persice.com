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
    message = this.applyLinks(message);
    // this.replaceEventUrlWithTitleAndLink(message);

    return message;
  }

  private applyBold(value: string): string {
    let message = value;
    message = message.replace(/\*([^\s-].*?)\*/g, '<strong>$1</strong>');

    return message;
  }

  private  applyItalic(value: string): string {
    let message = value;
    message = message.replace(/_([^\s-].*?)_/g, '<i>$1</i>');

    return message;
  }

  private applyLinks(value: string) {
    let message = value;
    message = message.replace(/(https?:\/\/[^\s-]+)/g, '<a href="$1">$1</a>');

    return message;
  }

  private replaceEventUrlWithTitleAndLink(value: string) {
    let message: string = value;
    let match: any[];
    let eventMessageId: string;

    let regExp: RegExp = /https?:\/\/persice.com\/event\/(\d+)\/?/g;
    match = regExp.exec(message);

    if (!!match) {
      eventMessageId =  match[1];
      console.log('found event with ID', eventMessageId);
    }

    return '';
  }

  private markAsSafeHtml(message: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(message);
  }
}
