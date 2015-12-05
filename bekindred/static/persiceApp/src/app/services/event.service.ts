/// <reference path="../../typings/_custom.d.ts" />

import {provide, Injectable, Observable} from 'angular2/angular2';
import {Http, Response} from 'angular2/http';
import {CookieUtil, FormUtil} from '../core/util';
import {pick} from 'lodash';
declare var jQuery: any;

let validate = require('validate.js');

@Injectable()
export class EventService {
  static API_URL: string = '/api/v1/event/';
  static VALIDATION_OPTIONS = {
    fullMessages: true
  };
  next: string = '';
  validationErrors = {};

  constraints = {
    name: {
      presence: true,
      length: {
        maximum: 300
      }
    },
    max_attendees: {
      presence: true,
      numericality: {
        onlyInteger: true,
        greaterThan: 0
      }
    },
    access_level: {
      presence: true
    },
    starts_on_date: {
      presence: true
    },
    starts_on_time: {
      presence: true
    },
    ends_on_date: {
      presence: true
    },
    ends_on_time: {
      presence: true
    },
    event_location: {
      presence: true
    },
    description: {
      presence: true,
      length: {
        maximum: 300
      }
    }
  };

  constructor(private http: Http) {

  }

  public get(url: string, limit: number): Observable<any> {

    if (url === '') {
      let params: string = [
        `format=json`,
        `limit=${limit}`,
        `offset=0`,
      ].join('&');

      let apiUrl = `${EventService.API_URL}`;
      this.next = `${apiUrl}?${params}`;
    }
    else {
      this.next = url;
    }

    return this.http.get(this.next).map((res: Response) => res.json());
  }


  public findOneByUri(resourceUri: string): Observable<any> {
    return this.http.get(resourceUri).map((res: Response) => res.json());
  }

  public findOneById(id: string): Observable<any> {

    let params: string = [
      `format=json`,
    ].join('&');

    let apiUrl = `${EventService.API_URL}${id}/`;
    let url = `${apiUrl}?${params}`;
    return this.http.get(url).map((res: Response) => res.json());
  }


  public create(data): Observable<any> {

    let userId = CookieUtil.getValue('userid');
    let event = data;
    event.user = '/api/v1/auth/user/' + userId + '/';

    //fix location if not found by autocomplete
    if (data.location === '' || data.location === undefined || data.location === null) {
      data.location = '0,0';
      data.location_name = data.event_location;
    }

    let body = FormUtil.formData(event);
    let csrftoken = CookieUtil.getValue('csrftoken');

    return Observable.create(observer => {

      if (!this._validateData(event)) {
        observer.error({
          validationErrors: this.validationErrors
        });
      } else {
        jQuery.ajax({
          url: EventService.API_URL,
          data: body,
          processData: false,
          type: 'POST',
          beforeSend: (xhr, settings) => {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
          },
          contentType: false,
          success: (data) => {
            observer.next(data);
            observer.complete();
          },
          error: (error) => {
            observer.error(error);
          }
        });
      }



    });


  }

  public validate(data): Observable<any> {
    return Observable.create(observer => {

      if (!this._validateData(data)) {
        observer.error({
          validationErrors: this.validationErrors
        });

      } else {
        observer.next('Validation success.');
        observer.complete();
      }

    });

  }


  private _validateData(data): boolean {
    this.validationErrors = {};

    let errors = validate(data, this.constraints, EventService.VALIDATION_OPTIONS);


    this.validationErrors = errors;

    if (this.validationErrors && Object.keys(this.validationErrors).length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  private _validateSingle(data, attribute): boolean {
    this.validationErrors = {};

    let errors = validate(data, this.constraints, EventService.VALIDATION_OPTIONS);


    this.validationErrors = pick(errors, attribute);

    if (this.validationErrors && Object.keys(this.validationErrors).length > 0) {
      return false;
    }
    else {
      return true;
    }
  }




}

export var eventServiceInjectables: Array<any> = [
  provide(EventService, { useClass: EventService })
];
