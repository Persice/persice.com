import './polyfills.browser.aot';
import './rxjs.imports';
import { enableProdMode } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';
import { AppMobileModuleNgFactory } from './compiled/src/app-mobile/app-mobile.module.ngfactory';
declare var ENV: string;

if ('production' === ENV) {
  enableProdMode();
}

export function main() {
  return platformBrowser().bootstrapModuleFactory(AppMobileModuleNgFactory)
    .catch(err => console.log(err));
}

export function bootstrapDomReady() {
  document.addEventListener('DOMContentLoaded', main);
}

bootstrapDomReady();
