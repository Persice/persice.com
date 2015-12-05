/// <reference path="../../../typings/_custom.d.ts" />
import {Component, NgClass, Input, Output, EventEmitter} from 'angular2/angular2';

import {RemodalDirective} from '../../directives/remodal.directive';
import {SelectDirective} from '../../directives/select.directive';
import {GeocompleteDirective} from '../../directives/geocomplete.directive';
import {DatepickerDirective} from '../../directives/datepicker.directive';
import {TimepickerDirective} from '../../directives/timepicker.directive';
import {EventService} from '../../services/event.service';
import {NotificationService} from '../../services/notification.service';

import {EventModel, EventOpenTo} from '../../models/event.model';
import {NotificationComponent} from '../notification/notification.component';
import {GoogleUtil, ObjectUtil, DateUtil} from '../../core/util';

declare var jQuery: any;

let view = require('./event_edit.html');

@Component({
  selector: 'event-edit',
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
export class EventEditComponent {
  @Input() event;
  @Output() refreshEvent: EventEmitter<any> = new EventEmitter();
  model;
  validationErrors = {};
  showValidationError: boolean = false;
  notification = {
    title: 'There are some errors. Please correct them below.',
    body: '',
    type: 'error'
  };

  eventId: number = null;
  resourceUri: string = null;

  openTo: any = EventOpenTo;

  START_DATE = DateUtil.todayRoundUp().unix() * 1000;
  END_DATE = DateUtil.todayAddHourRoundUp().unix() * 1000;

  START_TIME = DateUtil.todayRoundUp().hour() * 60 + DateUtil.todayRoundUp().minute();
  END_TIME = DateUtil.todayAddHourRoundUp().hour() * 60 + DateUtil.todayAddHourRoundUp().minute();
  full = true;

  constructor(
    private service: EventService,
    private notificationService: NotificationService
  ) {
    this.model = new EventModel();
  }


  ngOnChanges(values) {
    if ('event' in values && Object.keys(values.event.currentValue).length > 0) {
      let ev = values.event.currentValue;
      this.eventId = ev.id;
      this.resourceUri = ev.resource_uri;
      this.model.name = ev.name;
      this.model.description = ev.description;
      this.model.starts_on = ev.starts_on;
      this.model.ends_on = ev.ends_on;
      this.model.location = ev.location;
      this.model.location_name = ev.location_name;
      this.model.event_location = ev.location_name;
      this.model.max_attendees = ev.max_attendees;
      this.model.access_level = ev.access_level;



      let selectOpenTo = [
        {
          'label': 'Only my connections (default)',
          'value': 'connections',
          'selected': false
        },
        {
          'label': 'Public (all Persice users)',
          'value': 'public',
          'selected': false
        },
        {
          'label': 'Private (only invited)',
          'value': 'private',
          'selected': false
        }
      ];

      for (var i = 0; i < selectOpenTo.length; ++i) {
        if (selectOpenTo[i].value === this.model.access_level) {
          selectOpenTo[i].selected = true;
        }
      }

      this.openTo = selectOpenTo;

      //assing dates
      let startDate = DateUtil.convertToLocal(this.model.starts_on);
      let endDate = DateUtil.convertToLocal(this.model.ends_on);
      this.START_DATE = startDate.unix() * 1000;
      this.END_DATE = endDate.unix() * 1000;
      this.START_TIME = startDate.hour() * 60 + startDate.minute();
      this.END_TIME = endDate.hour() * 60 + endDate.minute();

      this.model.starts_on_date = startDate.format('MM/DD/YYYY');
      this.model.ends_on_date = endDate.format('MM/DD/YYYY');
      this.model.starts_on_time = startDate.format('hh:mm');
      this.model.ends_on_time = endDate.format('hh:mm');

      jQuery('#starts_on_date').pickadate('picker').set('select', this.START_DATE);
      jQuery('#ends_on_date').pickadate('picker').set('select', this.END_DATE);
      jQuery('#starts_on_time').pickatime('picker').set('select', this.START_TIME);
      jQuery('#ends_on_time').pickatime('picker').set('select', this.END_TIME);
    }
  }

  saveEvent(event) {
    console.log('Update event');
    this.showValidationError = false;
    this.service.updateByUri(this.model, this.resourceUri).subscribe((res) => {
      console.log('Saving event success');
      this.validationErrors = {};


      this.notificationService.push({
        type: 'success',
        title: 'Success',
        body: 'Event has been updated.',
        autoclose: 4000
      });

      this.refreshEvent.next(true);
      let remodal = jQuery('[data-remodal-id=edit-event]').remodal();
      remodal.close();

    }, (err) => {
      console.log('Saving event error');
      if ('validationErrors' in err) {
        this.validationErrors = err.validationErrors;
      }

      if ('status' in err && err.status === 400) {
        let parseError = JSON.parse(err.responseText);
        if ('event' in parseError) {
          this.notification.body = parseError.event.error[0];
        }
        else {
          this.notification.body = 'There has been an error during saving this event.';
        }
        this.showValidationError = true;

      }

    }, () => {
      console.log('Saving event completed');


    });
  }

  changeOpenTo(event) {
    this.model.access_level = event;
  }

  changeStartDate(event) {
    if (event !== 'Invalid date') {
      this.model.starts_on_date = event;
      this.combineDateTime('starts_on');
    }
    else {
      this.model.starts_on_date = '';
      this.model.starts_on = '';
      this.validateForm();
    }

  }


  changeStartTime(event) {
    if (event !== 'Invalid time') {
      this.model.starts_on_time = event;
      this.combineDateTime('starts_on');
    }
    else {
      this.model.starts_on_time = '';
      this.model.starts_on = '';
      this.validateForm();
    }

  }

  changeEndDate(event) {
    if (event !== 'Invalid date') {
      this.model.ends_on_date = event;
      this.combineDateTime('ends_on');
    }
    else {
      this.model.ends_on_date = '';
      this.model.ends_on = '';
      this.validateForm();
    }

  }


  changeEndTime(event) {

    if (event !== 'Invalid time') {
      this.model.ends_on_time = event;
      this.combineDateTime('ends_on');
    }
    else {
      this.model.ends_on_time = '';
      this.model.ends_on = '';
      this.validateForm();
    }

  }

  changeLocation(event) {
    let loc = GoogleUtil.parseLocation(event);
    this.model = ObjectUtil.merge(this.model, loc);
  }


  ngAfterViewInit() {

    jQuery('#starts_on_date').pickadate('picker').set('select', this.START_DATE);
    jQuery('#ends_on_date').pickadate('picker').set('select', this.END_DATE);
    jQuery('#starts_on_time').pickatime('picker').set('select', this.START_TIME);
    jQuery('#ends_on_time').pickatime('picker').set('select', this.END_TIME);

    //TODO : rewrite - End time
    // jQuery('.js-end-time-trigger').on('click', function(e) {
    //   e.preventDefault();
    //   jQuery(this)
    //     .closest('.remodal')
    //     .find('.js-end-time')
    //     .toggleClass('hidden');
    //   jQuery(this)
    //     .toggleClass('hidden');
    // });

    // jQuery('.js-remove-end-time-trigger').on('click', function(e) {
    //   e.preventDefault();
    //   jQuery(this).closest('.remodal')
    //     .find('.js-end-time-trigger')
    //     .toggleClass('hidden');
    //   jQuery(this)
    //     .closest('.remodal')
    //     .find('.js-end-time')
    //     .toggleClass('hidden');
    // });
  }

  ngOnDestroy() {
    jQuery('select.js-select-rep-create-event').minimalect('destroy');
  }

  validateForm() {
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


  combineDateTime(type) {
    if (this.model[type + '_date'] && this.model[type + '_time']) {
      let dateParts = this.model[type + '_date'].split('/');
      let datePartsSorted = [dateParts[2], dateParts[0], dateParts[1]];
      let timeParts = this.model[type + '_time'].split(':');
      if (datePartsSorted && timeParts) {
        datePartsSorted[1] -= 1;
        this.model[type] = DateUtil.formatUTC(datePartsSorted.concat(timeParts), 'YYYY-MM-DDTHH:mm:ss');
      }
    }
  }


}




