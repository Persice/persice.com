import {Directive, ElementRef, Inject} from 'angular2/angular2';
@Directive({
  selector: '[autofocus]'
})
export class AutofocusDirective {
  constructor( @Inject(ElementRef) public el: ElementRef) {
    // autofocus fix for multiple views
    if (this.el.nativeElement.focus) {
      this.el.nativeElement.focus();
    }
  }
}
