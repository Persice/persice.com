import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {EventMembersService} from '../../../app/shared/services/eventmembers.service';

@Component({
  selector: 'prs-rsvp-element',
  template: require('./rsvp-element.html')
})
export class RsvpElementComponent implements OnInit {
  @Input() event: Event;
  @Input() username: string;
  @Input() userId: string;
  @Output() onToggleRsvpElement: EventEmitter<any> = new EventEmitter();
  
  private savingRsvp: boolean = false;
  private oldRsvp: any = {};
  private authUserUri: string;

  constructor(private eventMembersService: EventMembersService) {

  }

  ngOnInit() {
    this.oldRsvp = this.event.rsvpOfUsername(this.username);
    this.authUserUri = `/api/v1/auth/user/${this.userId}/`;
  }

  showRsvpElement(): void {
    this.onToggleRsvpElement.emit(true);
  }

  hideRsvpElement(): void {
    this.onToggleRsvpElement.emit(false);
  }

  changeRsvpStatus(newRsvp: string) {
    if (this.savingRsvp) {
      return;
    }
    this.savingRsvp = true;

    let data = {
      event: this.event.resourceUri,
      rsvp: newRsvp,
      user: this.authUserUri
    };

    if (this.oldRsvp.rsvp) {
      let memberResourceUri = `/api/v1/member/${this.oldRsvp.member_id}/`;

      console.log('update', data);
      console.log('uri', memberResourceUri);
      this.eventMembersService.updateOneByUri(memberResourceUri, data)
        .subscribe((res) => {
          setTimeout(() => {
            this.refreshEventStats(this.event.id);
          }, 250);
          this.savingRsvp = false;
          console.log('got response', res);

        });
    } else {
      console.log('create', data);
      this.eventMembersService.createOne(data)
        .subscribe((res) => {
          this.oldRsvp = { rsvp: res.rsvp, member_id: res.resource_uri.replace('/api/v1/member/', '').replace('/', '') };
          this.savingRsvp = false;
          console.log('got response', res);
          setTimeout(() => {
            this.refreshEventStats(this.event.id);
          }, 250);
        });
    }
  }

  refreshEventStats(eventId) {

  }
}

