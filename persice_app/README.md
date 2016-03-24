# Persice Angular 2.0 App

Angular 2.0 Persice App using Typescript as a ECMAScript 6 standard.

## Tags
* Angular 2.0
* TypeScript
* ECMAScript 6 Standard
* SystemJS module loader
* Testing Angular 2 code with Jasmine and Karma
* end-to-end Angular 2 code using Protractor

# Getting Started
## Dependencies
What is needed to run this app:
* `node`
* `npm`
* `gulp`
* `npm install phantomjs --global` #for testing end-to-end

# Angular 2.0 API
reference: https://angular.io/docs/js/latest/api/

# License
  [MIT](/LICENSE)

# Folder structure
```
persice_app/
 ├──src/                           * our source files that will be compiled to javascript
 |   ├──main.ts                    * our entry file for our browser environment
 │   │
 |   ├──index.html                 * index.html: where we generate our index page
 │   │
 |   ├──polyfills.ts               * our polyfills file
 │   │
 |   ├──vendor.ts                  * our vendor file
 │   │
 │   ├──app/                       * WebApp: folder all of components, services, directives
 │   │   ├──components/            * app components
 │   │   ├──core/                  * app core libraries
 │   │   ├──directives/            * app directives
 │   │   ├──models/                * app models
 │   │   ├──pipes/                 * app pipes (filters)
 │   │   ├──services/              * app services
 │   │   ├──app.component.spec.ts  * a simple test of components in app.ts
 │   │   ├──app.spec.ts            * a simple test of components in app.ts
 │   │   ├──app.e2e.ts             * a simple end-to-end test for /
 │   │   └──app.comppnen.ts        * a root component for our Angular2 app
 │   │
 │   └──assets/                    * static assets are served here
 │       ├──icon/
 │       ├──robots.txt             * for search engines to crawl your website
 │       └──human.txt              * for humans to know who the developers are
 │
 ├──helpers.js                     * helper functions for our configuration files
 ├──spec-bundle.js                 * sets up our angular 2 testing environment
 ├──karma.conf.js                  * karma config for our unit tests
 ├──protractor.conf.js             * protractor config for our end-to-end tests
 ├──webpack.dev.js                 * our development webpack config
 ├──webpack.prod.js                * our production webpack config
 ├──webpack.test.js                * our testing webpack config
 ├──tslint.json                    * typescript lint config
 ├──typedoc.json                   * typescript documentation generator
 ├──tsconfig.json                  * config that webpack uses for typescript
 ├──typings.json                   * our typings manager
 └──package.json                   * what npm uses to manage it's dependencies
 ```
