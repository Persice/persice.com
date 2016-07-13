import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {EventMembersService} from '../../../app/shared/services/eventmembers.service';
import {Event} from '../../shared/model/event';

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
      event: `/api/v1/event/${this.event.id}/`,
      rsvp: newRsvp,
      user: this.authUserUri
    };

    if (this.oldRsvp.rsvp) {
      let memberResourceUri = `/api/v1/member/${this.oldRsvp.member_id}/`;
      this.eventMembersService.updateOneByUri(memberResourceUri, data)
        .subscribe((res) => {
          this.oldRsvp = { rsvp: res.rsvp, member_id: res.id };
          this.savingRsvp = false;
          this.hideRsvpElement();
        });
    } else {
      this.eventMembersService.createOne(data)
        .subscribe((res) => {
          this.oldRsvp = { rsvp: res.rsvp, member_id: res.id };
          this.savingRsvp = false;
          this.hideRsvpElement();
        });
    }
  }


}

