import { Component, Output, Renderer, EventEmitter, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Http } from '@angular/http';
import { CheckImageDirective } from '../../shared/directives';

@Component({
  selector: 'prs-search-connections',
  template: <any>require('./search-connections.html'),
  directives: [CheckImageDirective]
})
export class SearchConnectionsComponent implements OnInit, AfterViewInit {
  @Output() selected: EventEmitter<any> = new EventEmitter();
  @ViewChild('searchTerm') searchTerm: ElementRef;
  results: Observable<any[]>;
  resultsVisible: boolean = false;
  selectedIndex: number = -1;
  resultsCount: number = 0;
  resultsCache: any[] = [];

  constructor(public http: Http, private renderer: Renderer) {
  }

  ngAfterViewInit(): any {
    const eventStream = Observable.fromEvent(this.searchTerm.nativeElement, 'keyup');
    this.results = this._search(eventStream);
  }

  keyEvent(event) {

    switch (event.keyCode) {
      case 13:
        //enter
        if (this.selectedIndex !== -1) {
          this.select(this.resultsCache[this.selectedIndex]);
        }
        break;
      case 40:
        //down
        this.selectedIndex++;

        if (this.selectedIndex > this.resultsCount - 1) {
          this.selectedIndex = this.resultsCount - 1;
        }

        if (this.selectedIndex > 3) {
          setTimeout(() => {
            let container = jQuery('.message-drop');
            let scrollTo = jQuery('.message-drop__results__result.is-active');
            jQuery('.message-drop').scrollTop(
              scrollTo.offset().top - container.offset().top + container.scrollTop()
            );
          });

        }
        break;
      case 38:
        //up
        this.selectedIndex--;
        if (this.selectedIndex < 0) {
          this.selectedIndex = 0;
        }
        if (this.selectedIndex !== -1) {
          setTimeout(() => {
            let container = jQuery('.message-drop');
            let scrollTo = jQuery('.message-drop__results__result.is-active');
            jQuery('.message-drop').scrollTop(
              scrollTo.offset().top - container.offset().top + container.scrollTop()
            );
          });

        }
        //prevent moving cursor to begining of input
        event.preventDefault();
        break;
      case 27:
        //escape
        this.resultsVisible = false;
        break;
      default:
        break;
    }


  }

  ngOnInit() {

  }

  public select(result) {
    this.resultsVisible = false;
    this.resultsCache = [];
    this.renderer.setElementProperty(this.searchTerm.nativeElement, 'value', '');
    this.selected.emit(result);
  }

  private _search(terms: Observable<any>, debounceDuration = 400): Observable<any[]> {
    return terms
      .debounceTime(debounceDuration)
      .distinctUntilChanged()
      .switchMap((term: any) => this._rawSearch(term));
  }

  private _rawSearch(term: string): Observable<any> {
    let url = `/api/v1/connectionssearch/?format=json&first_name=${term}`;
    return this.http
      .get(url)
      .map(request => {
        this.selectedIndex = -1;
        let res = request.json();
        this.resultsCache = res.objects;
        this.resultsCount = res.meta.total_count;
        if (this.resultsCount > 0) {
          this.resultsVisible = true;
        } else {
          this.resultsVisible = false;
        }
        return this.resultsCache;
      });
  }


}
