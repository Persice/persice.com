import { Component, Input, Output, EventEmitter, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfileService } from '../../../../common/services/profile.service';

@Component({
  selector: 'prs-edit-about',
  template: `
    <textarea class="c-input c-input--textarea c-input--textarea-mediumround mb-" [value]="about"></textarea>
  `,
  providers: [ ProfileService ]
})
export class EditAboutComponent implements OnInit, OnDestroy {
  @Input() about;
  @Output() loading: EventEmitter<any> = new EventEmitter;
  private observable;

  constructor(
    private service: ProfileService,
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.observable = Observable.fromEvent(this.el.nativeElement, 'keyup')
      .map((e: any) => e.target.value)
      .debounceTime(500)
      .do(() => this.loading.emit(true))
      .map((value: string) => this.service.update({ about_me: value }))
      .switch()
      .subscribe(
        () => {
          this.loading.emit(false);
        },
        (err: any) => {
          console.log(err);
          this.loading.emit(false);
        },
        () => {
          this.loading.emit(false);
        }
      );
  }

  ngOnDestroy(): void {
    this.observable.unsubscribe();
  }

}
