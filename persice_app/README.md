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




Install type definitions

To get the benefits of TypeScript, we want to have the type definitions available for
the compiler and the editor. TypeScript type definitions are typically published in a
repo called DefinitelyTyped. To fetch one of the type definitions to the local directory,
we use the tsd package manager.

```
cd src
tsd install angular2 es6-promise rx rx-lite
```

Build Development
```
npm run build:dev

```

Build Production
```
npm run build:prod

```

Watch
```
npm run watch # or webpack --watch
```

Run local Webpack dev server:
```
  npm run server
```

And visit [http://localhost:8080](http://localhost:8080)

# Testing

### run tests
```bash
npm run test  # or karma start
```

### run webdriver (for end-to-end)
```bash
npm run webdriver-start  # or webdriver-manager start
```

### run end-to-end tests
```bash
# make sure you have webdriver running and a sever for the client app
npm run e2e  # or protractor
```

# Angular 2.0 API
reference: https://angular.io/docs/js/latest/api/

# License
  [MIT](/LICENSE)
