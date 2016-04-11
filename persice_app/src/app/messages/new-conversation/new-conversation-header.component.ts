import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {findIndex} from 'lodash';

import {SearchConnectionsComponent} from './search-connections.component';


const TOKEN_LIMIT: number = 1;

@Component({
  selector: 'prs-new-conversation-header',
  directives: [
    SearchConnectionsComponent
  ],
  template: require('./new-conversation-header.html')
})
export class NewConversationHeaderComponent {
  @Output() selected: EventEmitter<any> = new EventEmitter;
  @Input() initialTokens;
  tokens: any[] = [];
  searchInputVisible: boolean = true;
  activeToken: number = -1;

  ngOnChanges(values) {
    if (values.initialTokens && values.initialTokens.currentValue[0]) {
      //add initial token;
      this.addToken(values.initialTokens.currentValue[0]);
    }
  }

  addToken(token) {
    //check if limit is reached
    if (this.tokens.length < TOKEN_LIMIT) {
      //check if token already exists
      let i = findIndex(this.tokens, { friend_id: token.friend_id });
      if (i === -1) {
        this.tokens = [...this.tokens, token];
        this.activeToken = -1;
        this.selected.emit(this.tokens);
      } else { //make token active
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
