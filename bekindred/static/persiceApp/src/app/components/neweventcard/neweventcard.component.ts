/// <reference path="../../../typings/_custom.d.ts" />
import {Component, NgClass} from 'angular2/angular2';
import {Router} from 'angular2/router';

import {RemodalDirective} from '../../directives/remodal.directive';
import {SelectDirective} from '../../directives/select.directive';
import {GeocompleteDirective} from '../../directives/geocomplete.directive';
import {EventService} from '../../services/event.service';
import {NotificationService} from '../../services/notification.service';

import {EventModel, EventOpenTo} from '../../models/event.model';
import {NotificationComponent} from '../notification/notification.component';
import {GoogleUtil, ObjectUtil} from '../../core/util';

declare var jQuery: any;

let view = require('./neweventcard.html');

@Component({
  selector: 'newevent-card',
  template: view,
  directives: [
    RemodalDirective,
    SelectDirective,
    NotificationComponent,
    NgClass,
    GeocompleteDirective
  ],
  providers: [EventService]
})
export class NewEventCardComponent {
  model;
  validationErrors = {};
  showValidationError: boolean = false;
  notification = {
    title: 'There are some errors.',
    body: 'Please correct them below.',
    type: 'error'
  };

  openTo: Object = EventOpenTo;

  constructor(
    private router: Router,
    private service: EventService,
    private notificationService: NotificationService
  ) {
    this.router = router;
    this.model = new EventModel();
  }

  saveEvent(event) {
    console.log('Save event');
    this.showValidationError = false;
    this.service.create(this.model).subscribe((res) => {
      console.log('Saving event success');
      this.validationErrors = {};
      this.showValidationError = false;

      this.notificationService.push({
        type: 'success',
        title: 'Success',
        body: 'Your event has been created.',
        autoclose: 4000
      });

      this.router.parent.navigate(['/EventDetails', { 'eventId': res.id }]);

    }, (err) => {
      console.log('Saving event error');
      if ('validationErrors' in err) {
        this.validationErrors = err.validationErrors;
        this.showValidationError = true;
      }

    }, () => {
      console.log('Saving event completed');
      this.validationErrors = {};
      this.showValidationError = false;
    });
  }

  changeOpenTo(event) {
    this.model.access_level = event;
  }

  changeLocation(event) {
    let loc = GoogleUtil.parseLocation(event);

    this.model = ObjectUtil.merge(this.model, loc);


  }

  ngOnDestroy() {
    jQuery('select.js-select-rep-create-event').minimalect('destroy');
  }

  validateForm(attribute) {
    this.service.validate(this.model).subscribe((res) => {
      this.validationErrors = {};
      this.showValidationError = false;
    }, (err) => {
      if ('validationErrors' in err) {
        this.validationErrors = err.validationErrors;
        this.showValidationError = false;
      }
    }, () => {
      this.validationErrors = {};
      this.showValidationError = false;
    });

  }


}




