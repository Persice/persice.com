import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'prs-rsvp-element',
  template: require('./rsvp-element.html')
})
export class RsvpElementComponent {
  @Input() event: Event;
  @Output() onToggleRsvpElement: EventEmitter<any> = new EventEmitter();

  showRsvpElement(): void {
    this.onToggleRsvpElement.emit(true);
  }

  hideRsvpElement(): void {
    this.onToggleRsvpElement.emit(false);
  }
}

