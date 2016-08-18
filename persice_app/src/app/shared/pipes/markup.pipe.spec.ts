import { MarkupPipe } from './markup.pipe.ts';
import { DomSanitizationServiceImpl } from '@angular/platform-browser/src/security/dom_sanitization_service';

describe('MarkupPipe', () => {
  let pipe: MarkupPipe;
  beforeEach(() => {
    pipe = new MarkupPipe(new DomSanitizationServiceImpl());
  });

  it('removes HTML tags', () => {
    expect(pipe.sanitizeInput('<a>hello</a>')).toBe('hello');
    expect(pipe.sanitizeInput('<<a>>hello</</a>>')).toBe('hello');
  });

  it('removes JavaScript links', () => {
    expect(pipe.sanitizeInput('click here javascript://malicious_site.html now')).toBe('click here  now');
  });

  it('applies bold', () => {
    expect(pipe.applyMarkup('hi *Dave*')).toBe('hi <strong>Dave</strong>');
    expect(pipe.applyMarkup('this is *important* text :*')).toBe('this is <strong>important</strong> text :*');
    expect(pipe.applyMarkup('*bold* test')).toBe('<strong>bold</strong> test');
  });

  it('applies italics', () => {
    expect(pipe.applyMarkup('hi _Dave_')).toBe('hi <i>Dave</i>');
    expect(pipe.applyMarkup('this is _important_ text :*')).toBe('this is <i>important</i> text :*');
    expect(pipe.applyMarkup('_italic_ test')).toBe('<i>i</i> test');
    expect(pipe.applyMarkup('lolololo _ lo_ lololo_')).toBe('lolololo _ lo_ lololo_');
  });

});
