# Go to Production

Check code at: https://github.com/wghglory/angular2-fundamental

### Tslint

```bash
npm i typescript -g
npm i tslint -g     #globally
npm i tslint --save-dev     #locally
node_modules/.bin/tslint --init  #locally
```

List all errors:

```bash
node_modules/.bin/tslint "app/**/*.ts"
```

```
ERROR: app/user/user.module.ts[8, 64]: Missing semicolon
ERROR: app/user/user.module.ts[24, 18]: Missing trailing comma
```

Fix all errors:

```bash
node_modules/.bin/tslint "app/**/*.ts" --fix
```

### Tuning Your rxJS Requests

Now when running the project, you can see lots of useless requests involved Observable.js like NeverObservable.js, PairObservable.js, etc

voter.service.ts and other file, use Observable instead of Rx library

```javascript
- import { Observable } from 'rxjs/Rx';
+ import { Observable } from 'rxjs/Observable';
```

Now in auth.service.ts, some operation is not available (do, of, map)

```javascript
return this.http.post('/api/login', JSON.stringify(loginInfo), options)
    .do((res: Response) => {}).catch((err) => {
        return Observable.of(false);
    });
```

So we create rxjs-extension.ts

```javascript
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
```

Now import this file to app.module.ts, afte this, "do, of, map" in auth.service.ts should not have errors

```javascript
import './rxjs-extensions';
```

Refresh browser and you can see requests number is much lesser.

### Enabling Production Mode

Angular 2 is running in the development mode. Call enableProdMode() to enable the production mode.

main.ts: based on environment.js, enableProdMode

```javascript
import { enableProdMode } from '@angular/core';
enableProdMode();
```

### Ahead of Time Compiler Overview

AOT benefits:

- faster rendering
- few requests
- smaller angular framework
- detect template errors
- better security

##### JIT vs AOT:

When compiling Templates in development, angular use Just in time (JIT) compiler,
much of angular needed in browser is the complier.
It takes time to compile templates.

Production uses Ahead of time compiler

##### AOT no-no's

- form.controls.controlName
- control.errors?.someError
- default exports
- functions in providers, routes or declarations of a module
- any filed used in a template, including inputs, must be public
- declare var for globals

##### ES6 module tree

main.ts --> app.module.ts --> many component.ts, service.ts

### Preparing for the AOT Compiler

```bash
npm i @angular/compiler-cli @angular/platform-server
```

1. create tsconfig-aot.json
2. create main-aot.ts
3. note now index.html is new aot html, index-jit is old one

### Making Coding Fixes for the AOT Compiler

create-event.component.ts now templateUrl is full path, AOT has to use relative path.

```javascript
@Component({
    templateUrl: 'app/events/create-event.component.html',
})
export class CreateEventComponent {}
```

update as below if using systemjs:

```javascript
@Component({
    moduleId: module.id,
    templateUrl: 'create-event.component.html',
})
```

update as below if using webpack:

```javascript
@Component({
    moduleId: module.id,
    templateUrl: './create-event.component.html',
})
```

handle 3rd party library:

app.module.ts

```javascript
- declare let toastr: Toastr
- declare let jQuery: Object

+ let toastr: Toastr = window['toastr'];
+ let jQuery: Object = window['$'];
```
