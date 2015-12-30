import {Component} from 'angular2/core';

let view = require('./signup_connect.html');

@Component({
  selector: 'signup-connect',
  template: view
})
export class SignupConnectComponent {


  link(provider) {
    let w = 400;
    let h = 300;


    let dualScreenLeft = window.screenLeft;
    let dualScreenTop = window.screenTop;

    let width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    let height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    let left = ((width / 2) - (w / 2)) + dualScreenLeft;
    let top = ((height / 2) - (h / 2)) + dualScreenTop;


    let settings = 'height=' + h + ',width=' + w + ',left=' + left + ',top=' + top + ',resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=yes,directories=no,status=yes';
    let url = '/social/associate/' + provider + '/?next=/goals/close_login_popup';
    let newWindow = window.open(url, 'Connecting...', settings);

    if (window.focus) {
      newWindow.focus();
    }
  }
}
