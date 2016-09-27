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
    expect(pipe.applyMarkup('_italic_ test')).toBe('<i>italic</i> test');
    expect(pipe.applyMarkup('lolololo _ lo_ lololo_')).toBe('lolololo _ lo_ lololo_');
  });

  it('applies line breaks', () => {
    expect(pipe.applyMarkup('hi\nDave')).toBe('hi <br>Dave');
  });

  it('applies unordered lists', () => {
    expect(pipe.applyMarkup('checklist: \n- one\n- two\n- three'))
      .toBe('checklist: <ul class="message__text-list pt-"><li>one</li><li>two</li><li>three</li></ul>');
    expect(pipe.applyMarkup('- one\n- two\n- three'))
      .toBe('<ul class="message__text-list pt-"><li>one</li><li>two</li><li>three</li></ul>');
  });

  it('applies headings', () => {
    expect(pipe.applyMarkup('[title]title[title]\nmessage'))
      .toBe('<h4 class="message__system__title">title</h4> <br>message');
  });

  it('applies links', () => {
    expect(pipe.applyMarkup('http://google.com')).toBe('<a href="http://google.com">http://google.com</a>');
    expect(pipe.applyMarkup('link http://google.com')).toBe('link <a href="http://google.com">http://google.com</a>');
    expect(pipe.applyMarkup('link http://google.com/?query=1&param=2'))
      .toBe('link <a href="http://google.com/?query=1&param=2">http://google.com/?query=1&param=2</a>');
    expect(pipe.applyMarkup('link www.google.com')).toBe('link <a href="http://www.google.com">www.google.com</a>');
    expect(pipe.applyMarkup('link www.google.com/?query=1&param=2'))
      .toBe('link <a href="http://www.google.com/?query=1&param=2">www.google.com/?query=1&param=2</a>');
    expect(pipe.applyMarkup('link http://www.google.com'))
      .toBe('link <a href="http://www.google.com">http://www.google.com</a>');
    expect(pipe.applyMarkup('link http://www.google.com google.com another http://persice.com'))
      .toBe('link <a href="http://www.google.com">http://www.google.com</a> google.com another <a href="http://persice.com">http://persice.com</a>');
    expect(pipe.applyMarkup('link [http://google.com google]')).toBe('link <a href="http://google.com">google</a>');
    expect(pipe.applyMarkup('[http://google.com google]')).toBe('<a href="http://google.com">google</a>');
    expect(pipe.applyMarkup('[http://google.com google] is the best search engine, http://google.com'))
      .toBe('<a href="http://google.com">google</a> is the best search engine, <a href="http://google.com">http://google.com</a>');
  });
});
