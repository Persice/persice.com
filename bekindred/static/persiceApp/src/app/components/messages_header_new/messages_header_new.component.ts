import {Component, Input} from 'angular2/core';

@Component({
  selector: 'messages-header-new',
  template: `
  <header class="chat-header has-message-drop">
  <div class="layout layout--middle">
    <div class="layout__item 3/4">
      <div class="has-input-left-labeled has-input-left-labeled--big">
        <label class="left-labeled-label" for="">To:</label>
        <div class="left-labeled-input">
          <input type="text" class="left-labeled-input__element js-message-to" placeholder="NAME">
          <div class="message-drop is-invisible">
            <div class="message-drop__results">

            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="layout__item 1/4 text-right"> </div>
  </div>
  </header>
  `
})
export class MessagesHeaderNewComponent {
  constructor() {

  }


  ngOnInit() {
  }
}
