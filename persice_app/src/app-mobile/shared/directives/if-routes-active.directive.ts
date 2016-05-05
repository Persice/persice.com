import {Directive, OnInit, Input, ViewContainerRef, TemplateRef} from '@angular/core';
import {Router} from '@angular/router-deprecated';

@Directive({
  selector: '[prsIfRoutesActive]'
})
export class IfRoutesActiveDirective implements OnInit {
  @Input() set prsIfRoutesActive(values: string[]) {
    this._pages = values;
  }
  private _pages: string[];

  constructor(
    private _router: Router,
    private _viewContainer: ViewContainerRef,
    private _templateRef: TemplateRef<any>
  ) { }

  ngOnInit() {
    this._router.subscribe((next: any) => {
      this._showIfRoutesAreActive(next, this._pages);
    });
  }

  private _showIfRoutesAreActive(current: string, list: string[]) {
    if (list.indexOf(current) > -1) {
      this._viewContainer.clear();
      this._viewContainer.createEmbeddedView(this._templateRef);
    } else {
      this._viewContainer.clear();
    }
  }

}
