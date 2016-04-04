# Persice Angular 2.0 App

Angular 2.0 Persice App using Typescript as a ECMAScript 6 standard.

* Best practices in file and application organization for Angular 2.
* Ready to go build system using Webpack for working with TypeScript.
* Angular 2 examples that are ready to go when experimenting with Angular 2.
* A great Angular 2 seed repo for anyone who wants to start their project.
* Testing Angular 2 code with Jasmine and Karma.
* Coverage with Istanbul and Karma
* End-to-end Angular 2 code using Protractor.
* Type manager with Typings
* Hot Module Replacement with Webpack


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


### Quick start
**Make sure you have node version >= 4.0**

# install the repo with npm
npm install

# start the server
npm start
```
go to [http://test1.com:8000](http://test1.com:8000) in your browser

# Table of Contents
* [File Structure](#file-structure)
* [Getting Started](#getting-started)
    * [Dependencies](#dependencies)
    * [Installing](#installing)
    * [Running the app](#running-the-app)
* [TypeScript](#typescript)
* [Typings](#typings)
* [License](#license)


# File structure
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


# Getting Started
## Dependencies
What you need to run this app:
* `node` and `npm` (`brew install node`)
* Ensure you're running the latest versions Node `v4.1.x`+ and NPM `2.14.x`+

Once you have those, you should install these globals with `npm install --global`:
* `webpack` (`npm install --global webpack`)
* `webpack-dev-server` (`npm install --global webpack-dev-server`)
* `karma` (`npm install --global karma-cli`)
* `protractor` (`npm install --global protractor`)
* `typings` (`npm install --global typings`)
* `typescript` (`npm install --global typescript`)

## Installing
* `npm install` to install all dependencies
* `typings install` to install necessary typings
* `npm run server` to start the dev server in another tab

## Running the app
After you have installed all dependencies you can now run the app. Run `npm run server` to start a local server using `webpack-dev-server` which will watch, build (in-memory), and reload for you. The port will be displayed to you as `http://test1.com:8000`

### server
```bash
# development
npm run server
# production
npm run build:prod
npm run server:prod
```

## Other commands

### build files
```bash
# development
npm run build:dev
# production
npm run build:prod
```

### watch and build files
```bash
npm run watch
```

### run tests
```bash
npm run test
```

### watch and run our tests
```bash
npm run watch:test
```

### run end-to-end tests
```bash
# make sure you have your server running in another terminal
npm run e2e
```

### run webdriver (for end-to-end)
```bash
npm run webdriver:update
npm run webdriver:start
```

### run Protractor's elementExplorer (for end-to-end)
```bash
npm run webdriver:start
# in another terminal
npm run e2e:live
```


# TypeScript
> To take full advantage of TypeScript with autocomplete you would have to install it globally and use an editor with the correct TypeScript plugins.

## Use latest TypeScript compiler
TypeScript 1.8.x includes everything you need. Make sure to upgrade, even if you installed TypeScript previously.

```
npm install --global typescript
```

## Use a TypeScript-aware editor
We have good experience using these editors:

* [Visual Studio Code](https://code.visualstudio.com/)
* [Webstorm 10](https://www.jetbrains.com/webstorm/download/)
* [Atom](https://atom.io/) with [TypeScript plugin](https://atom.io/packages/atom-typescript)
* [Sublime Text](http://www.sublimetext.com/3) with [Typescript-Sublime-Plugin](https://github.com/Microsoft/Typescript-Sublime-plugin#installation)

# Typings
> When you include a module that doesn't include Type Definitions inside of the module you need to include external Type Definitions with Typings

## Use latest Typings module
```
npm install --global typings
```

## Custom Type Definitions
When including 3rd party modules you also need to include the type definition for the module
if they don't provide one within the module. You can try to install it with typings

```
typings install node --save
```

If you can't find the type definition in the registry we can make an ambient definition in
this file for now. For example

```typescript
declare module "my-module" {
  export function doesSomething(value: string): string;
}
```


If you're prototyping and you will fix the types later you can also declare it as type any

```typescript
declare var assert: any;
```

If you're importing a module that uses Node.js modules which are CommonJS you need to import as

```typescript
import * as _ from 'lodash';
```

# License
  [MIT](/LICENSE)
