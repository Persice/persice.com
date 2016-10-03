import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseEventComponent } from './base-event.component';
import { Event } from '../../../../common/models/event';
import { EventService } from '../../../../common/events/event.service';
import { NotificationService } from '../../../../common/services/notification.service';

@Component({
  selector: 'prs-event-edit',
  templateUrl: './event-form.html',
  providers: [ EventService, NotificationService ]
})
export class EventEditComponent extends BaseEventComponent implements OnInit {

  // View event component and edit event component share same event model, but event model object should not be the same
  @Input() set eventToEdit(eventToEdit: Event) {
    if (!this.event) {
      this.setEvent(eventToEdit.clone());
    }
  }

  @Input() type: string;
  @Output() refreshEvent: EventEmitter<any> = new EventEmitter();

  loading: boolean = false;
  full = true;

  constructor(
    eventService: EventService,
    notificationService: NotificationService,
    private router: Router
  ) {
    super(eventService, notificationService, 'edit');
  }

  ngOnInit(): any {
    this.initForEdit();
  }

  ngOnDestroy(): void {
    jQuery('select.js-select-rep-create-event').minimalect('destroy');
  }

  saveEvent(event: MouseEvent) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.showValidationError = false;
    this.eventService.updateByUri(this.event).subscribe((res) => {
      this.loading = false;
      this.validationErrors = {};
      this._notifySuccess('Event has been updated.');
      this.refreshEvent.emit(true);
      this.refreshBackup();
      let remodal = jQuery('[data-remodal-id=edit-event]').remodal();
      remodal.close();
    }, (err) => {
      this.loading = false;
      if ('validationErrors' in err) {
        this.validationErrors = err.validationErrors;
      }
      if ('status' in err && err.status === 400) {
        let parseError = JSON.parse(err.responseText);
        if ('event' in parseError) {
          this.notification.body = parseError.event.error[ 0 ];
        } else {
          this.notification.body = 'There has been an error during saving this event.';
        }
        this.showValidationError = true;
      }
    }, () => {
    });
  }

  deleteEvent() {
    this.showValidationError = false;
    this.eventService.deleteByUri(this.event.resourceUri).subscribe((res) => {
      this.showValidationError = false;
      this._notifySuccess(`Your event ${this.event.name} has been deleted.`);
      this.router.navigateByUrl('/events/all/list');
    }, (err) => {
      if ('status' in err) {
        this.notification.body = 'Your event could not be deleted.';
        this.showValidationError = true;
      }
    });
  }
}
