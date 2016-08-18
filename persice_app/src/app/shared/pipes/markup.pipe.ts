import { Pipe, Injectable, PipeTransform } from '@angular/core';
import { DomSanitizationService, SafeHtml } from '@angular/platform-browser';

@Injectable()
@Pipe({
  name: 'markup'
})
export class MarkupPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizationService) {}

  transform(value: string, args: any[]): SafeHtml {
    let message: string = value;

    message = this.sanitizeInput(message);
    message = this.applyMarkup(message);

    return this.markAsSafeHtml(message);
  }

  sanitizeInput(value: string) {
    let input: string = value;

    input = input.replace(/<+.+?>+/, '');
    input = input.replace(/<+\/.+?>+/, '');
    input = input.replace(/javascript:\/*[^\s-]*/, '');

    return input;
  }

  applyMarkup(value: string): string {
    let message = value;
    message = this.applyBold(message);
    message = this.applyItalic(message);

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

  private markAsSafeHtml(message: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(message);
  }
}
