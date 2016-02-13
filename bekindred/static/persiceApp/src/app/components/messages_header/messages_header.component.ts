import {Component, Input} from 'angular2/core';

import {DropdownDirective} from '../../directives/dropdown.directive';

@Component({
  selector: 'messages-header',
  directives: [
    DropdownDirective
  ],
  template: `
  <header class="chat-header">
    <div class="layout layout--middle">
      <div class="layout__item 3/4">
        <div class="has-input-left-labeled has-input-left-labeled--big">
          <label class="left-labeled-label is-hidden" for="">To:</label>
          <div class="left-labeled-input">
            <input type="text" class="left-labeled-input is-hidden" placeholder="NAME">
            <span class="left-labeled-value">{{name}}</span>
          </div>
        </div>
      </div>
      <div class="layout__item 1/4 text-right">
        <div class="has-dropdown-basic">
          <a class="btn btn-1 btn-1--red btn--icon-circle-small js-share mr" dropdown="#messagesDropdown">
            <svg role="img" class="icon icon--tiny">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/static/persiceApp/src/assets/icons/icons.svg#icon-more"></use>
            </svg>
          </a>
          <div class="dropdown-basic dropdown-basic--medium dropdown-basic--arrow-right" id="messagesDropdown">
            <ul class="list-bare">
              <li><a>Delete conversation</a></li>
              <li><a>Report spam</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </header>
  `
})
export class MessagesHeaderComponent {
  @Input() name;
  constructor() {

  }


  ngOnInit() {
  }
}
