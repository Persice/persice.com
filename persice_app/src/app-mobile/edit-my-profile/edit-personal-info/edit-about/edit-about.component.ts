import { Component, OnInit, Input, ElementRef, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'prs-mobile-edit-about',
  template: `
     <textarea [(ngModel)]="aboutMe" class="c-input c-input--textarea c-input--textarea-noborder">
     </textarea>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditAboutMobileComponent implements OnInit {
  @Input() set about(value: string) {
    this.aboutMe = value;
  }

  @Output() onChanged: EventEmitter<any> = new EventEmitter();

  private aboutMe: string = '';
  private isDebouncerSet: boolean = false;

  constructor(private element: ElementRef) {
  }

  ngOnInit() {
    this.setupDebouncer();
  }

  private setupDebouncer(): void {
    // This method should be idempotent - calling it multiple times should cause no ill effect.
    // Do nothing if input field is not initialized.
    let inputElement = this.element.nativeElement;
    if (!inputElement) {
      return;
    }

    // Do nothing if we already registered a debouncer.
    if (this.isDebouncerSet) {
      return;
    }

    this.isDebouncerSet = true;
    Observable.fromEvent(inputElement, 'keyup')
      .debounceTime(500).subscribe(() => {
      this.onChanged.emit(this.aboutMe);
    });
  }

}
