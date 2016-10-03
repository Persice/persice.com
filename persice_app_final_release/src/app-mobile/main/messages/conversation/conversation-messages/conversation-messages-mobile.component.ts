import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  AfterViewChecked,
  ElementRef,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'prs-mobile-conversation-messages',
  templateUrl: './conversation-messages-mobile.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConversationMessagesMobileComponent implements AfterViewChecked {
  @Input() messages;
  @Input() loading;
  @Input() loaded;
  @Input() loadedCount;
  @Input() totalCount;
  @Input() isNewMessageBeingSent;
  @ViewChild('scrollContainer') public scrollContainer: ElementRef;

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
