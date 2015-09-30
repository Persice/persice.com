# Perscice Angular 2.0 App

Angular 2.0 Persice App using Typescript as a ECMAScript 6 standard.

## Tags
* Angular 2.0
* TypeScript
* ECMAScript 6 Standard
* Traceur for ES6 features support in today's browsers
* SystemJS module loader

# Getting Started
## Dependencies
What is needed to run this app:
* `node`
* `npm`
* `gulp`



Install type definitions

To get the benefits of TypeScript, we want to have the type definitions available for
the compiler and the editor. TypeScript type definitions are typically published in a
repo called DefinitelyTyped. To fetch one of the type definitions to the local directory,
we use the tsd package manager.

```
cd src
tsd install angular2 es6-promise rx rx-lite
```

Build
```
./node_modules/.bin/tsc

```

Watch
```
./node_modules/.bin/tsc --watch -m commonjs -t es5 --experimentalDecorators --emitDecoratorMetadata src/public/app.ts

```

Run local HTTP server:
```
  ./node_modules/http-server/bin/http-server src/public/ -p 8080 -a localhost
```

And visit [http://localhost:8080](http://localhost:8080)


# Angular 2.0 API
reference: https://angular.io/docs/js/latest/api/

# License
  [MIT](/LICENSE)
