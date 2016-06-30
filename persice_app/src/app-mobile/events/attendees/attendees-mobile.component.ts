import {Component, OnInit} from '@angular/core';
import {AppStateService} from '../../shared/services/app-state.service';
import {HeaderState} from '../../header/header.state';
import {Person} from '../../shared/model/person';
import {AttendeeService} from './attendee.service';
import {UserCardMobileComponent} from '../../shared/components/user-card/user-card-mobile.component';

@Component({
  selector: 'prs-mobile-attendees',
  template: require('./attendees-mobile.html'),
  providers: [AttendeeService],
  directives: [UserCardMobileComponent]
})
export class AttendeesMobileComponent implements OnInit {

  attendees: Person[] = [];
  isLoaded: boolean = false;
  isLoading: boolean = false;
  activeTab: AttendeeTab = AttendeeTab.Maybe;

  constructor(private appStateService: AppStateService, private attendeeService: AttendeeService) {
  }

  ngOnInit(): any {
    this.appStateService.headerStateEmitter.emit(HeaderState.attendees);
    this.loadData(this.activeTab);
  }

  loadData(tab: AttendeeTab) {
    this.isLoading = true;
    switch (tab) {
      case(AttendeeTab.Going):
        this.attendeeService.getGoing().subscribe(people => {
          this.finishLoadingData(people);
        });
        break;
      case(AttendeeTab.Maybe):
        this.attendeeService.getMaybe().subscribe(people => {
          this.finishLoadingData(people);
        });
        break;
      case(AttendeeTab.NotGoing):
        this.attendeeService.getNotGoing().subscribe(people => {
          this.finishLoadingData(people);
        });
        break;
      default:
        break;
    }
  }

  activateTab(index: number) {
    this.activeTab = index;
    this.loadData(this.activeTab);
  }

  private finishLoadingData(people: Person[]) {
    this.attendees = people;
    this.isLoaded = true;
    this.isLoading = false;
  }
}

enum AttendeeTab {
  Going = 1,
  Maybe = 2,
  NotGoing = 3
}
