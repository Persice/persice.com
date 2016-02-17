import {Component, Output, Input, EventEmitter, ElementRef} from 'angular2/core';
import {Control} from 'angular2/common';
import {Observable} from 'rxjs';
import {Http} from 'angular2/http';

declare var jQuery: any;

@Component({
	selector: 'messages-search-connections',
	template: require('./messages_search_connections.html')
})
export class MessagesSearchConnections {
	@Output() selected: EventEmitter<any> = new EventEmitter();
	searchTerm = new Control();
	results: Observable<any[]>;
	resultsVisible: boolean = false;
	selectedIndex: number = -1;
	resultsCount: number = 0;
	resultsCache: any[] = [];

	constructor(public http: Http) {
		this.results = this._search(this.searchTerm.valueChanges);
	}

	keyEvent(event) {

		switch (event.keyCode) {
			case 13://enter
				if(this.selectedIndex !== -1) {
					this.select(this.resultsCache[this.selectedIndex]);
				}
				break;
			case 40://down
				this.selectedIndex++;
				if (this.selectedIndex > this.resultsCount - 1) {
					this.selectedIndex = 0;
				}
				break;
			case 38://up
				this.selectedIndex--;
				if (this.selectedIndex < 0) {
					this.selectedIndex = this.resultsCount - 1;
				}
				//prevent moving cursor to begining of input
				event.preventDefault();
				break;
			case 27://escape
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
		this.searchTerm.updateValue('');
		this.selected.emit(result);
	}

	private _search(terms: Observable<string>, debounceDuration = 400): Observable<any[]> {
		return terms.debounceTime(debounceDuration)
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
				}
				else {
					this.resultsVisible = false;
				}
				return this.resultsCache;
			});
	}


}
