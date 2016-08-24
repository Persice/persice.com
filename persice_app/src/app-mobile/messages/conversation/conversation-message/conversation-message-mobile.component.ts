import {
  Component, Input, OnInit, ChangeDetectorRef
} from '@angular/core';
import { LoadingComponent } from '../../../../app/shared/components/loading';
import { CheckImageDirective } from '../../../../app/shared/directives';
import { InfiniteScrollReverseDirective } from '../../../../common/directives';
import { MarkupPipe } from '../../../../app/shared/pipes/markup.pipe';
import { EventService } from '../../../../app/shared/services/event.service';

@Component({
  selector: 'prs-mobile-conversation-message',
  template: '<div class="message__text" [innerHTML]="message | markup">',
  directives: [LoadingComponent, CheckImageDirective, InfiniteScrollReverseDirective],
  providers: [EventService],
  pipes: [MarkupPipe]
})
export class ConversationMessageMobileComponent implements OnInit {

  @Input() message;

  constructor(
    private eventService: EventService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): any {
    let match: any[];
    let eventId: string;
    let regExp: RegExp = /https?:\/\/persice.com\/event\/(\d+)\/?/g;
    match = regExp.exec(this.message);

    if (!!match) {
      eventId =  match[1];
      this.eventService.findOneById(eventId).subscribe(event => {
        this.message = this.message + `\n[event: ${event.id}||${event.name}||${event.hosted_by}||${event.location_name}]`;

        // This is necessary in order to make the changes visible in the view.
        this.changeDetectorRef.detectChanges();
      });
    }
  }
}
