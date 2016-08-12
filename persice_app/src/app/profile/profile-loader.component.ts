// TODO: After update to RC.5, update code for dynamically creating component
// Example:
// import {Component, Compiler, ViewContainerRef, ViewChild, ComponentRef, ComponentFactory, ComponentFactoryResolver} from '@angular/core'
// import {HelloComponent} from './hello.component'
//
// @Component({
//   selector: 'my-app',
//   providers: [],
//   template: `
//     <div>
//       <h2>Dynamicaly Add Elements</h2>
//       <button (click)="addItem()">add hello</button>
//       <div #placeholder></div>
//     </div>
//   `,
//   entryComponents: [HelloComponent]
// })
// export class App {
//   @ViewChild('placeholder', {read: ViewContainerRef}) viewContainerRef;
//   private componentFactory: ComponentFactory<any>;
//
//   constructor(componentFactoryResolver: ComponentFactoryResolver, compiler: Compiler) {
//     this.componentFactory = componentFactoryResolver.resolveComponentFactory(HelloComponent);
//     //this.componentFactory = compiler.compileComponentSync(HelloComponent);
//   }
//
//   addItem () {
//     this.viewContainerRef.createComponent(this.componentFactory, 0);
//   }
// }
import {
  Component,
  ViewChild,
  OnDestroy,
  ComponentResolver,
  AfterViewInit,
  ViewContainerRef,
  ComponentRef,
  ComponentFactory
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileViewComponent } from './profile-view.component';
import { ProfileMyComponent } from './profile-my.component';
import { CookieUtil } from '../shared/core';

@Component({
  selector: 'prs-profile-loader',
  template: `<div #target></div>`,
})
export class ProfileLoader implements AfterViewInit, OnDestroy {
  @ViewChild('target', {read: ViewContainerRef}) target;

  private cmpRef: ComponentRef<any>;
  private username: string;
  private usernameParam: string;
  private sub: any;
  private isViewInitialized: boolean = false;

  constructor(private resolver: ComponentResolver, private _route: ActivatedRoute) { }

  ngAfterViewInit() {
    this.username = CookieUtil.getValue('user_username');
    this.isViewInitialized = true;
    this.sub = this._route.params.subscribe((params) => {
      this.usernameParam = params['username'];
      if (this.username === this.usernameParam) {
        this.updateComponent(ProfileMyComponent);
      } else {
        this.updateComponent(ProfileViewComponent);
      }
    });
  }

  ngOnDestroy(): any {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.cmpRef) {
      this.cmpRef.destroy();
    }
  }

  private updateComponent(type) {
    if (!this.isViewInitialized) {
      return;
    }
    if (this.cmpRef) {
      this.cmpRef.destroy();
    }
    this.resolver.resolveComponent(type).then((factory: ComponentFactory<any>) => {
      this.cmpRef = this.target.createComponent(factory);
      if (type === ProfileViewComponent) {
        this.cmpRef.instance.setUsername(this.usernameParam);
      }
    });
  }

}
