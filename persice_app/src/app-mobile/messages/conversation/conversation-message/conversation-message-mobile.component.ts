import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { LoadingComponent } from '../../../../app/shared/components/loading';
import { CheckImageDirective } from '../../../../app/shared/directives';
import { InfiniteScrollReverseDirective } from '../../../../common/directives';
import { MarkupPipe } from '../../../../app/shared/pipes/markup.pipe';
import { EventServiceTemp } from '../../../../app/shared/services/event.service';

@Component({
  selector: 'prs-mobile-conversation-message',
  template: '<div class="message__text" [innerHTML]="message | markup:true">',
  directives: [LoadingComponent, CheckImageDirective, InfiniteScrollReverseDirective],
  providers: [EventServiceTemp],
  pipes: [MarkupPipe]
})
export class ConversationMessageMobileComponent implements OnInit {

  @Input() message;

  // Whether to dynamically insert event info by parsing URLs to event pages.
  private parseEvents = false;

  constructor(
    private eventService: EventServiceTemp,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): any {
    if (this.parseEvents) {
      this.insertEventInfo();
    }
  }

  private insertEventInfo() {
    let match: any[];
    let eventId: string;
    let regExp: RegExp = /https?:\/\/persice.com\/event\/(\d+)\/?/g;
    match = regExp.exec(this.message);

    if (!!match) {
      eventId = match[1];
      this.eventService.findOneById(eventId).subscribe(event => {
        this.message = this.message + `\n[eventStart]${JSON.stringify(event)}[eventEnd]`;

        // This is necessary in order to make the changes visible in the view.
        this.changeDetectorRef.detectChanges();
      });
    }
  }

}
