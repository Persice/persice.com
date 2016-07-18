const SHOW_CHAR_LIMIT: number = 80;

export abstract class ViewMoreComponent {

  lessText: string = '';
  moreText: string = '';

  // Flag for showing more about me
  showMore: boolean = false;

  constructor() {
  }

  public toggleMore(value) {
    this.showMore = value;
  }

  protected setInitialState(value: string) {
    let contents = value !== null ? value : '';
    if (contents.length > SHOW_CHAR_LIMIT) {
      this.lessText = contents.substring(0, SHOW_CHAR_LIMIT);
      this.moreText = contents.substring(SHOW_CHAR_LIMIT, contents.length).trim();
    } else {
      this.lessText = contents;
    }
  }
}
