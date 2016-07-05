import {Component, OnInit, OnDestroy} from '@angular/core';
import {AppStateService} from '../../shared/services/app-state.service';
import {HeaderState} from '../../header/header.state';
import {EventService} from '../../../app/shared/services/event.service';
import {ActivatedRoute} from '@angular/router';
import {LoadingComponent} from '../../../app/shared/components/loading/loading.component';
import {Event} from '../../shared/model/event';

@Component({
  selector: 'prs-mobile-event',
  template: require('./event-mobile.html'),
  providers: [EventService],
  directives: [LoadingComponent]
})
export class EventMobileComponent implements OnInit, OnDestroy {

  event: Event;
  eventIdFromUrl: string;
  isLoaded = false;

  constructor(
    private appStateService: AppStateService,
    private eventService: EventService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.eventIdFromUrl = params['eventId'];
    });
  }

  ngOnInit(): any {
    this.appStateService.headerStateEmitter.emit(HeaderState.event);
    this.eventService.findOneById(this.eventIdFromUrl).subscribe(response => {
      this.event = new Event(response);
      this.isLoaded = true;
    });
  }

  ngOnDestroy(): any {
  }

}
