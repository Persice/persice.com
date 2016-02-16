import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {findIndex} from 'lodash';
/**
 * Components
 */
import {MessagesSearchConnections} from '../messages_search_connections/messages_search_connections.component';


const TOKEN_LIMIT: number = 1;

@Component({
  selector: 'messages-header-new',
  directives: [
    MessagesSearchConnections
  ],
  template: require('./messages_header_new.html')
})
export class MessagesHeaderNewComponent {
  @Output() selected: EventEmitter<any> = new EventEmitter;
  tokens: any[] = [];
  searchInputVisible: boolean = true;
  activeToken: number = -1;

  addToken(token) {
    //check if limit is reached
    if (this.tokens.length < TOKEN_LIMIT) {
      //check if token already exists
      let i = findIndex(this.tokens, { id: token.id });
      if (i === -1) {
        this.tokens = [...this.tokens, token];
        this.activeToken = -1;
        this.selected.emit(this.tokens);
      }
      else { //make token active
        this.activeToken = i;
      }
      //if token limit reached, hide search input
      if (this.tokens.length === TOKEN_LIMIT) {
        this.searchInputVisible = false;
      }
    }
  }

  removeToken(index) {
    this.activeToken = -1;
    this.tokens.splice(index, 1);
    this.selected.emit(this.tokens);
    this.searchInputVisible = true;
  }
}
