import { EventEmitter } from '@angular/core';
import { EventMembersService } from '../services/eventmembers.service';
import { Event } from '../models/event';

export abstract class RsvpComponent {
  event: Event;
  username: string;
  userId: string;
  onToggleRsvpElement: EventEmitter<any> = new EventEmitter();

  savingRsvp: boolean = false;
  oldRsvp: any = {};
  authUserUri: string;

  constructor(protected eventMembersService: EventMembersService) {

  }

  onInit() {
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
      // When old response exists.
      let memberResourceUri = `/api/v1/member/${this.oldRsvp.member_id}/`;
      if (this.oldRsvp.rsvp === newRsvp) {
        // TODO: return un-rsvp functionality after backend work is finished in ticket ICE-2201
        //   // When user clicked the same response - toggle.
        //   this.eventMembersService.deleteOneByUri(memberResourceUri)
        //     .subscribe(() => {
        //       this.oldRsvp = {};
        //       this.savingRsvp = false;
        //       this.hideRsvpElement();
        //     });
        this.hideRsvpElement();
        this.savingRsvp = false;
      } else {
        // When user updated response.
        this.eventMembersService.updateOneByUri(memberResourceUri, data)
          .subscribe((res) => {
            this.handleRsvpResponse(res);
          }, (err) => {
            this.hideRsvpElement();
            this.savingRsvp = false;
          });
      }
    } else {
      // When creating a new response.
      this.eventMembersService.createOne(data)
        .subscribe((res) => {
          this.handleRsvpResponse(res);
        }, (err) => {
          this.hideRsvpElement();
          this.savingRsvp = false;
        });
    }
  }

  private handleRsvpResponse(res) {
    this.oldRsvp = { rsvp: res.rsvp, member_id: res.id };
    this.savingRsvp = false;
    this.hideRsvpElement();
  }
}

