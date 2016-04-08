import {EventsService, FilterService} from '../shared/services';

declare var jQuery: any;

export abstract class EventsBaseComponent {
  items: Array<any> = [];
  loading: boolean = false;
  loadingInitial: boolean = false;
  isListEmpty: boolean = false;
  limit: number = 12;
  filter: boolean = true;
  next: string = '';
  total_count: number = 0;
  offset: number = 0;
  notification = {
    body: '',
    title: '',
    active: false,
    type: 'success'
  };

  constructor(
    public service: EventsService,
    public filterService: FilterService,
    public type: string
    ) {
    this.type = type;
  }

  ngOnInit() {
    this.getList();
    //create new observer and subscribe
    this.filterService.addObserver(`events${this.type}`);
    this.filterService.observer(`events${this.type}`)
      .subscribe(
      (data) => this.refreshList(),
      (err) => console.log(err),
      () => console.log('event completed')
      );

  }


  ngOnDestroy() {
    this.filterService.observer(`events${this.type}`).unsubscribe();
    this.filterService.removeObserver(`events${this.type}`);
  }


  refreshList() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.items = [];
    this.total_count = 0;
    this.isListEmpty = false;
    this.next = '';
    this.getList();
  }



  getList() {
    this.closeNotification();
    if (this.next === null) return;
    this.loading = true;
    if (this.next === '') {
      this.loadingInitial = true;
    }
    this.service.get(this.next, this.limit, this.filter, this.type)
      .subscribe(data => this.assignList(data),
      (err) => {
        console.log(err);
        this.loading = false;
      },
      () => {

      });

  }

  assignList(data) {

    this.loading = false;
    this.loadingInitial = false;

    this.total_count = data.meta.total_count;
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

    this.matchHeight();

    this.next = data.meta.next;
    this.offset = data.meta.offset;


    //bind to scroll event to load more data on bottom scroll
    if (this.next !== null) {
      jQuery(window).bind('scroll', this.handleScrollEvent.bind(this));
    } else {
      jQuery(window).unbind('scroll');
    }
  }

  matchHeight() {
    setTimeout(() => {
      jQuery('.js-match-height-1').matchHeight({
        byRow: false
      });
    });
  }


  closeNotification() {
    this.notification.active = false;
  }

  handleScrollEvent(event) {
    let scrollOffset = jQuery(window).scrollTop();
    let threshold = jQuery(document).height() - jQuery(window).height() - 60;

    if (this.next && scrollOffset > threshold) {
      if (!this.loading) {
        this.getList();
      }
    }

  }


}
