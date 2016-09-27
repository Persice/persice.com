import { Component, Input, Output, EventEmitter, AfterViewInit, OnInit } from '@angular/core';
import { ReligiousViewsService } from '../../../../common/services/religiousviews.service';
import { PoliticalViewsService } from '../../../../common/services/politicalviews.service';
import { Person } from '../../../../common/models/person/person';

@Component({
  selector: 'prs-edit-personalinfo',
  templateUrl: './edit-personalinfo.html',
  providers: [ ReligiousViewsService, PoliticalViewsService ]
})
export class EditPersonalInfoComponent implements AfterViewInit, OnInit {
  @Input() person: Person;
  @Output() close: EventEmitter<any> = new EventEmitter;

  loading: boolean = false;

  politicalList: any[] = [];
  religionList: any[] = [];

  politicalMy: any[] = [];
  religionMy: any[] = [];

  constructor(
    private religiousViewsService: ReligiousViewsService, private politicalViewsService: PoliticalViewsService
  ) { }

  ngOnInit(): any {
    // get all religions
    this.religiousViewsService.getIndex('', 100)
      .subscribe(data => {
        this.religionList = data.objects;
      });

    // get my religions
    this.religiousViewsService.my('', 100)
      .subscribe(data => {
        this.religionMy = data.objects;
      });

    // get all politics
    this.politicalViewsService.getIndex('', 100)
      .subscribe(data => {
        this.politicalList = data.objects;
      });

    // get my politics
    this.politicalViewsService.my('', 100)
      .subscribe(data => {
        this.politicalMy = data.objects;
      })
  }

  ngAfterViewInit(): any {
    //Reselect
    jQuery('.js-reselect__trigger').on('click', function (e) {
      e.preventDefault();
      jQuery('.js-reselect__drop').addClass('is-hidden');
      jQuery(this)
        .closest('.reselect')
        .find('.js-reselect__drop')
        .removeClass('is-hidden');
    });

    jQuery('.js-reselect__done').on('click', function () {
      jQuery('.js-reselect__drop').addClass('is-hidden');
    });
  }

  private toggleReligion(religion: string): void {
    this.loading = true;
    if (this.isReligionSelected(religion)) {
      let index = this.findIndexByName(this.religionMy, religion);
      this.religiousViewsService.delete(this.religionMy[ index ].resource_uri)
        .subscribe(() => {
          this.religionMy.splice(index, 1);
          this.loading = false;
        });
    } else {
      this.religiousViewsService.create(religion)
        .subscribe(data => {
          this.religionMy.push({ religious_view: religion, resource_uri: data.resource_uri });
          this.loading = false;
        })
    }
  }

  private togglePolitics(politics: string): void {
    this.loading = true;
    if (this.isPoliticsSelected(politics)) {
      let index = this.findIndexByName(this.politicalMy, politics);
      this.politicalViewsService.delete(this.politicalMy[ index ].resource_uri)
        .subscribe(() => {
          this.politicalMy.splice(index, 1);
          this.loading = false;
        });
    } else {
      this.politicalViewsService.create(politics)
        .subscribe(data => {
          this.politicalMy.push({ political_view: politics, resource_uri: data.resource_uri });
          this.loading = false;
        })
    }
  }

  private isReligionSelected(religion: string): boolean {
    return this.religionMy.find(religionMy => religionMy.religious_view === religion);
  }

  private isPoliticsSelected(politics: string): boolean {
    return this.politicalMy.find(politicsMy => politicsMy.political_view === politics);
  }

  private findIndexByName(list: any[], name: string): number {
    return list.findIndex(element => element.religious_view === name || element.political_view === name);
  }
}
