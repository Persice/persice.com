import {remove, findIndex, debounce} from 'lodash';

const DEFAULT_LIST_LIMIT: number = 12;

interface ListService {
  get: Function;
};

export abstract class ListComponent {
  items: Array<any> = [];
  loading: boolean = false;
  loadingInitial: boolean = false;
  isListEmpty: boolean = false;
  next: string = '';
  total_count: number = 0;
  limit: number = DEFAULT_LIST_LIMIT;
  offset: number = 0;
  itemViewActive = false;
  selectedItem = null;
  currentIndex = 0;
  serviceInstance: any;

  onRefreshList: Function;

  constructor(
    protected listService: ListService,
    protected listType: string,
    protected listLimit: number,
    protected urlProperty: string,
    protected listRefreshTimeout: number
  ) {
    this.limit = listLimit;
    this.onRefreshList = debounce(
      this.refreshList,
      listRefreshTimeout,
      {
        'leading': false,
        'trailing': true
      }
    );
  }

  getList() {
    if (this.loading) {
      return;
    }

    this.isListEmpty = false;
    if (this.next === null) return;
    this.loading = true;
    if (this.next === '') {
      this.loadingInitial = true;
    }
    this.serviceInstance = this.listService.get(this.next, this.limit)
      .subscribe(
      data => {
        this.assignList(data);
      },
      (err) => {
        this.loading = false;
        this.loadingInitial = false;
      });
  }

  refreshList() {
    this.scrollTop();
    this.items = [];
    this.total_count = 0;

    this.currentIndex = 0;
    this.isListEmpty = false;
    this.next = '';
    this.getList();
  }

  assignList(data) {
    this.loading = false;
    this.loadingInitial = false;

    if (data.meta.total_count === 0) {
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
      this.total_count += more.length;
    } else {
      this.items = data.objects;
      this.total_count = data.objects.length;
    }

    this.next = data.meta.next;
    this.offset = data.meta.offset;
  }

  selectItem(id) {
    for (var i = this.items.length - 1; i >= 0; i--) {
      if (this.items[i].id === id) {
        this.selectedItem = this.items[i];
        this.currentIndex = i;
        this.itemViewActive = true;

        // TODO: this check is for connections page only, need to refactor!!!
        if (this.items[i].updated_at === null) {
          this.items[i].updated_at = 'seen';
        }

        this.afterItemSelected();
      }
    }
  }

  setLocation(loc: string) {
    window.history.pushState('', '', '/' + loc);
  }

  closeItemView(event) {
    this.itemViewActive = false;
    this.selectedItem = null;
    this.afterItemClosed();
  }

  previousItem(event) {
    let currentIndex = findIndex(this.items, { id: this.selectedItem.id });
    let newIndex = currentIndex - 1;

    if (newIndex < 0) {
      return;
    }
    if (this.items.length > 0) {
      this.selectedItem = this.items[newIndex];
      this.setLocation(this.selectedItem[this.urlProperty]);
    } else {
      this.closeItemView(true);
      this.isListEmpty = true;
    }
    this.currentIndex = newIndex;
  }

  nextItem(event) {
    let currentIndex = findIndex(this.items, { id: this.selectedItem.id });
    let newIndex = currentIndex + 1;

    if (!this.loading && newIndex > this.items.length - 13 && this.next) {
      this.getList();
    }

    if (newIndex > this.items.length - 1) {
      return;
    }

    if (this.items.length > 0) {
      this.selectedItem = this.items[newIndex];
      this.setLocation(this.selectedItem[this.urlProperty]);
    } else {
      this.closeItemView(true);
      this.isListEmpty = true;
    }
    this.currentIndex = newIndex;
  }

  loadMoreItems(event) {
    if (this.next && !this.loading) {
      this.getList();
    }
  }

  removeItemById(id: number) {
    remove(this.items, (item) => {
      return item.id === id;
    });
    this.total_count--;
  }

  scrollTop() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  afterItemClosed() { }
  afterItemSelected() { }

}
