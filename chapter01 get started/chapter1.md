# Get Started

### Systemjs

```javascript
(function (global) {
  System.config({
    paths: {
      'npm:': 'node_modules/'        // paths serve as alias
    },
    // map tells the System loader where to look for things
    map: {
      app: 'app',        // our app is within the app folder
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',        // angular bundles
        ...
      'rxjs': 'npm:rxjs',      // other libraries
    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      app: {
        main: './main.js',
        defaultExtension: 'js'
      },
      rxjs: {
        defaultExtension: 'js'
      }
    }
  });
})(this);
```

### Component

```javascript
import { Component } from '@angular/core'

@Component({
    template: '<h2>hello world</h2>',
    selector: 'events-app'
})
export class EventsAppComponent {

}
```

### Module

```javascript
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { EventsAppComponent } from './events-app.component'

@NgModule({
    imports: [BrowserModule],
    declarations: [EventsAppComponent],
    bootstrap: [EventsAppComponent]
})
export class AppModule {

}
```

### bootstrap main.ts

```javascript
import { platformBrowserDynamic }  from '@angular/platform-browser-dynamic'
import { AppModule } from './app.module'

platformBrowserDynamic().bootstrapModule(AppModule)
```
