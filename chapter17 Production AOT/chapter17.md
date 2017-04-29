# Go to Production

Check code at: https://github.com/wghglory/angular2-fundamental

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
