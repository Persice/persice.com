/// <reference path="../../../typings/_custom.d.ts" />
import {Component, NgClass} from 'angular2/angular2';
import {Router} from 'angular2/router';

import {RemodalDirective} from '../../directives/remodal.directive';
import {SelectDirective} from '../../directives/select.directive';
import {GeocompleteDirective} from '../../directives/geocomplete.directive';
import {DatepickerDirective} from '../../directives/datepicker.directive';
import {TimepickerDirective} from '../../directives/timepicker.directive';
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
    GeocompleteDirective,
    DatepickerDirective,
    TimepickerDirective
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

    this.service.create(this.model).subscribe((res) => {
      console.log('Saving event success');
      this.validationErrors = {};


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
      }

    }, () => {
      console.log('Saving event completed');
      this.validationErrors = {};

    });
  }

  changeOpenTo(event) {
    this.model.access_level = event;
  }

  changeStartDate(event) {
    console.log(event);
  }


  changeStartTime(event) {
    console.log(event);
  }

  changeEndDate(event) {
    console.log(event);
  }


  changeEndTime(event) {
    console.log(event);
  }

  changeLocation(event) {
    let loc = GoogleUtil.parseLocation(event);

    this.model = ObjectUtil.merge(this.model, loc);


  }


  ngAfterViewInit() {
    //TODO : rewrite - End time
    jQuery('.js-end-time-trigger').on('click', function(e) {
      e.preventDefault();
      jQuery(this)
        .closest('.remodal')
        .find('.js-end-time')
        .toggleClass('hidden');
      jQuery(this)
        .toggleClass('hidden');
    });

    jQuery('.js-remove-end-time-trigger').on('click', function(e) {
      e.preventDefault();
      jQuery(this).closest('.remodal')
        .find('.js-end-time-trigger')
        .toggleClass('hidden');
      jQuery(this)
        .closest('.remodal')
        .find('.js-end-time')
        .toggleClass('hidden');
    });
  }

  ngOnDestroy() {
    jQuery('select.js-select-rep-create-event').minimalect('destroy');
  }

  validateForm(attribute) {
    this.service.validate(this.model).subscribe((res) => {
      this.validationErrors = {};

    }, (err) => {
      if ('validationErrors' in err) {
        this.validationErrors = err.validationErrors;

      }
    }, () => {
      this.validationErrors = {};

    });

  }


}




