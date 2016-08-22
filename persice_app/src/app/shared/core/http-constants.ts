import { Headers } from '@angular/http';
import { TokenUtil, CookieUtil } from './util';

let csrfToken = CookieUtil.getValue('csrftoken');

export const OPTS_REQ_JSON = {

  headers: new Headers({
    'Content-Type': 'application/json'
  })
};

export const OPTS_REQ_JSON_CSRF = {

  headers: new Headers({
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken
  })
};

export const OPTS_REQ_UNDEFINED_CSRF = {

  headers: new Headers({
    'Content-Type': 'undefined',
    'X-CSRFToken': csrfToken
  })
};

