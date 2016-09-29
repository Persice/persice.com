const DEFAULT_CHAR_LIMIT: number = 80;

export abstract class ViewMoreComponent {
  protected static SHOW_CHAR_LIMIT = DEFAULT_CHAR_LIMIT;
  lessText: string = '';
  moreText: string = '';
  displayedText: string = '';
  type;

  // Flag for showing more text
  moreVisible: boolean = false;

  constructor(limit?: number) {
    if (limit) {
      ViewMoreComponent.SHOW_CHAR_LIMIT = limit;
    }
  }

  public toggleMore(isMoreVisible: boolean): void {
    this.moreVisible = isMoreVisible;

    if (!!isMoreVisible) {
      this.displayedText = this.lessText + this.moreText;
    } else {
      this.displayedText = this.lessText;
    }
  }

  protected setInitialState(value: string): void {
    this.lessText = '';
    this.moreText = '';
    this.displayedText = '';
    this.moreVisible = false;

    let contents = value !== null ? value : '';
    if (contents.length > ViewMoreComponent.SHOW_CHAR_LIMIT) {
      this.lessText = contents.substring(0, ViewMoreComponent.SHOW_CHAR_LIMIT);
      this.moreText = contents.substring(ViewMoreComponent.SHOW_CHAR_LIMIT, contents.length).trim();
      this.moreVisible = false;
    } else {
      this.moreVisible = true;
      this.lessText = contents;
    }

    this.displayedText = this.lessText;
  }
}
