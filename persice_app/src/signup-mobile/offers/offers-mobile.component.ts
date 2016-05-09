import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import {findIndex} from 'lodash';

import {OffersService} from '../../app/shared/services';
import {SignupStateService} from '../../common/services';

import {LoadingComponent} from '../../app/shared/components/loading';


@Component({
  selector: 'prs-mobile-offers',
  template: require('./offers-mobile.html'),
  directives: [
    LoadingComponent
  ]
})
export class SignupOffersMobileComponent implements OnInit, OnDestroy {
  offers: any[] = [];
  newOfferText: string = '';
  sadsf;

  // Lazy loading.
  limit: number = 12;
  query: string = '';
  next: string = '';
  total_count: number = 0;
  offset: number = 0;
  loading: boolean = false;
  saveLoading = false;

  // Whether adding new offer succeeded or not.
  status;

  constructor(
    private offersService: OffersService,
    private signupStateService: SignupStateService
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
        url: '/api/v1/subject/?format=json&limit=30&description__icontains=%QUERY',
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

    var offersInput = jQuery('#offersInput');
    offersInput.typeahead(
      {
        hint: false,
        highlight: true,
        minLength: 2
      },
      {
        source: keywordsEngine,
        limit: 30
      }
    );

    offersInput.bind('typeahead:selected', (ev, suggestion) => {
      this.newOfferText = suggestion;
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
        this.offers.push(newItem);
        this.status = 'success';
        this.total_count++;
        this.signupStateService.counterEmitter.emit({
          type: 'offers',
          count: this.total_count
        });
        this.newOfferText = '';
        jQuery('#offersInput').typeahead('val', '');
        this.saveLoading = false;
      }, (err) => {
        let error = JSON.parse(err._body);
        if ('offer' in error) {
          this.status = 'failure';
        }
        this.saveLoading = false;
      });
  }

  inputChanged(event) {
    // If key is not 'Enter' clear notification.
    if (event.which !== 13) {
      this.status = null;
    }

    if (event.which === 13) {
      this.saveOffer(this.newOfferText);
    }
  }

  addOffer() {
    this.saveOffer(this.newOfferText);
  }

  removeOffer(event) {
    let idx = findIndex(this.offers, event);
    if (this.offers[idx]) {
      this.offersService.delete(event.resource_uri)
        .subscribe((res) => {
          this.offers.splice(idx, 1);
          this.total_count--;
          this.signupStateService.counterEmitter.emit({
            type: 'offers',
            count: this.total_count
          });
        });
    }
  }

  getList() {
    if (this.next === null) return;
    this.loading = true;
    this.offersService.get(this.next, 100)
      .subscribe(data => this.assignList(data),
      () => {
        this.loading = false;
      });
  }

  refreshList() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.offers.splice(0, this.offers.length);
    this.next = '';
    this.getList();
  }

  assignList(data) {
    this.loading = false;

    this.total_count = data.meta.total_count;

    this.signupStateService.counterEmitter.emit({
      type: 'offers',
      count: this.total_count
    });

    if (this.total_count === 0) {
      return;
    }

    if (this.offers.length > 0) {
      let more = data.objects;
      for (var i = 0; i <= more.length - 1; i++) {
        this.offers.push(more[i]);
      }
    } else {
      this.offers = data.objects;
    }

    this.next = data.meta.next;
    this.offset = data.meta.offset;

    // Bind to scroll event to load more data on bottom scroll.
    var offersList = jQuery('#offers');
    if (this.next !== null) {
      offersList.bind('scroll', this.handleScrollEvent.bind(this));
    } else {
      offersList.unbind('scroll');
    }
  }

  handleScrollEvent(event) {
    var offersList = jQuery('#offers');
    let scrollOffset = offersList.scrollTop() + offersList.innerHeight();
    let threshold = offersList[0].scrollHeight;
    if (this.next && scrollOffset >= threshold) {
      if (!this.loading) {
        this.getList();
      }
    }
  }
}
