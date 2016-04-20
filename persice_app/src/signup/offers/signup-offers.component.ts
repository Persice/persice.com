import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy
} from 'angular2/core';

import {findIndex} from 'lodash';

import {OffersService} from '../../app/shared/services';

import {LoadingComponent} from '../../app/shared/components/loading';

@Component({
  selector: 'prs-signup-offers',
  template: require('./signup-offers.html'),
  directives: [
    LoadingComponent
  ]
})
export class SignupOffersComponent implements OnInit, OnDestroy {

  @Output() counter: EventEmitter<any> = new EventEmitter();

  items: any[] = [];
  loading: boolean = false;
  isListEmpty: boolean = false;
  limit: number = 12;
  query: string = '';
  next: string = '';
  total_count: number = 0;
  offset: number = 0;
  newOffer = '';
  status;
  saveLoading = false;

  constructor(
    private offersService: OffersService
  ) {

  }


  ngOnInit() {
    this.initializeTokenInput();
    this.getList();
  }

  ngOnDestroy() {
    jQuery('#offersInput').typeahead('destroy');
  }

  initializeTokenInput() {
    let keywordsEngine = new Bloodhound({
      remote: {
        url: '/api/v1/subject/?format=json&limit=100&description__icontains=%QUERY',
        filter: (x: any) => {
          return jQuery.map(x.objects, (item) => {
            return item.description;
          });
        },
        wildcard: '%QUERY'
      },
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace
    });

    keywordsEngine.initialize();

    jQuery('#offersInput').typeahead(
      {
        hint: false,
        highlight: true,
        minLength: 2
      },
      {
        source: keywordsEngine,
        limit: 100
      }
    );

    jQuery('#offersInput').bind('typeahead:selected', (ev, suggestion) => {
      this.newOffer = suggestion;
      this.saveOffer(suggestion);
    });

  }

  saveOffer(offer) {
    if (this.saveLoading === true) {
      return;
    }
    this.saveLoading = true;


    if (offer.length === 0 || offer.length > 100) {
      this.status = 'failure';
      this.saveLoading = false;
      return;
    }

    this.offersService.save(offer)
      .subscribe((res) => {
        let newItem = res;
        this.items.push(newItem);
        this.status = 'success';
        this.total_count++;
        this.counter.next({
          type: 'offers',
          count: this.total_count
        });
        if (this.total_count === 0) {
          this.isListEmpty = true;
        } else {
          this.isListEmpty = false;
        }
        this.newOffer = '';
        jQuery('#offersInput').typeahead('val', '');
        this.saveLoading = false;
      }, (err) => {
        let error = JSON.parse(err._body);
        if ('offer' in error) {
          this.status = 'failure';
        }
        this.saveLoading = false;
      }, () => {

      });
  }

  inputChanged(event) {
    //if key is not enter clear notification
    if (event.which !== 13) {
      this.status = null;
    }

    if (event.which === 13) {
      this.saveOffer(this.newOffer);
    }

  }

  addOffer() {
    this.saveOffer(this.newOffer);
  }

  removeOffer(event) {
    let idx = findIndex(this.items, event);
    if (this.items[idx]) {
      this.offersService.delete(event.resource_uri)
        .subscribe((res) => {
          this.items.splice(idx, 1);
          this.total_count--;
          this.counter.next({
            type: 'offers',
            count: this.total_count
          });
          if (this.total_count === 0) {
            this.isListEmpty = true;
          } else {
            this.isListEmpty = false;
          }
        });
    }

  }


  getList() {
    if (this.next === null) return;
    this.loading = true;
    this.offersService.get(this.next, 100)
      .subscribe(data => this.assignList(data),
      (err) => {
        this.loading = false;
      },
      () => {

      });
  }


  refreshList() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.items.splice(0, this.items.length);
    this.isListEmpty = false;
    this.next = '';
    this.getList();
  }

  assignList(data) {

    this.loading = false;

    this.total_count = data.meta.total_count;

    this.counter.next({
      type: 'offers',
      count: this.total_count
    });

    if (this.total_count === 0) {
      this.isListEmpty = true;
      return;
    } else {
      this.isListEmpty = false;
    }

    if (this.items.length > 0) {
      let more = data.objects;
      for (var i = 0; i <= more.length - 1; i++) {
        this.items.push(more[i]);
      }

    } else {
      this.items = data.objects;
    }

    this.next = data.meta.next;
    this.offset = data.meta.offset;


    //bind to scroll event to load more data on bottom scroll
    if (this.next !== null) {
      jQuery('#offers').bind('scroll', this.handleScrollEvent.bind(this));
    } else {
      jQuery('#offers').unbind('scroll');
    }
  }

  handleScrollEvent(event) {
    let scrollOffset = jQuery('#offers').scrollTop() + jQuery('#offers').innerHeight();
    let threshold = jQuery('#offers')[0].scrollHeight;
    if (this.next && scrollOffset >= threshold) {
      if (!this.loading) {
        this.getList();
      }
    }

  }

}
