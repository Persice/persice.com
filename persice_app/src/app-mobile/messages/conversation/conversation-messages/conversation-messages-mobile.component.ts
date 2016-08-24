import {
  Component, Input, ChangeDetectionStrategy, Output, EventEmitter, AfterContentChecked, AfterViewInit, AfterViewChecked,
  ElementRef, ViewChild
} from '@angular/core';
import { LoadingComponent } from '../../../../app/shared/components/loading';
import { CheckImageDirective } from '../../../../app/shared/directives';
import { InfiniteScrollReverseDirective } from '../../../../common/directives';
import { MarkupPipe } from '../../../../app/shared/pipes/markup.pipe';
import { ConversationMessageMobileComponent } from '../conversation-message/conversation-message-mobile.component';

@Component({
  selector: 'prs-mobile-conversation-messages',
  template: <any>require('./conversation-messages-mobile.html'),
  directives: [LoadingComponent, CheckImageDirective, InfiniteScrollReverseDirective, ConversationMessageMobileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  pipes: [MarkupPipe]
})
export class ConversationMessagesMobileComponent implements AfterViewChecked {
  @Input() messages;
  @Input() loading;
  @Input() loaded;
  @Input() loadedCount;
  @Input() totalCount;
  @ViewChild('scrollContainer') private scrollContainer: ElementRef;

  @Output() onScrollTop: EventEmitter<any> = new EventEmitter();

  private autoScrollToBottom: boolean = false;
  private finishedLoading: boolean = false;

  ngAfterViewChecked(): any {

    if (this.autoScrollToBottom && !this.finishedLoading && this.messages.length > 0) {
      setTimeout(() => {
        this.scrollToBottom();
      }, 2000);

      this.finishedLoading = true;
    }
  }

  private scrollToBottom() {
    this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
  }
}
