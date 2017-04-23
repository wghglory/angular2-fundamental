# Creating and Communicating Between Components

Check code at: https://github.com/wghglory/angular2-fundamental

## Creating Our First Data-bound Component

1) create events/events-list.component.ts:

```javascript
import { Component } from '@angular/core'

@Component({
    selector: 'events-list',
    template: `
    <div>
        <h1>Upcoming Angular 2 Events</h1>
        <div class="well hoverwell thumbnail">
            <h2>Event: {{event.name}}</h2>
            <div>Price: \${{event.price}}</div>     //in ts file must use \$ as $!
            <div>Date: {{event.date}}</div>
            <div>Time: {{event.time}}</div>
            <div>Address: {{event.location.address}}, {{event.location.city}}, {{event.location.country}}</div>
        </div>
    </div>
    `
})
export class EventsListComponent {
    event = {
        name: 'ngConf 2025',
        date: '3/1/2025',
        time: '8am',
        price: '599',
        location: { address: '123 Main St', city: 'Salt Lake City, UT', country: 'USA' }
    }
}
```

2) modify app.component.ts:

```javascript
import { Component } from '@angular/core'

@Component({
    selector: 'events-app',
-    // template: '<h2>hello world</h2>'
+    template: '<events-list></events-list>'
})
export class AppComponent {}
```

3) update module:

```javascript
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
+ import { EventsListComponent } from './events/events-list.component'

@NgModule({
    imports: [BrowserModule],
+   declarations: [AppComponent, EventsListComponent],
    bootstrap: [AppComponent]
})
export class AppModule {}
```

## Using External Templates

1) create events-list.component.html as template:

```html
<div>
    <h1>Upcoming Angular 2 Events</h1>
    <div class="well hoverwell thumbnail">
        <h2>Event: {{event.name}}</h2>
        <div>Price: ${{event.price}}</div>  <!-- no need \$ -->
        <div>Date: {{event.date}}</div>
        <div>Time: {{event.time}}</div>
        <div>Address: {{event.location.address}}, {{event.location.city}}, {{event.location.country}}</div>
    </div>
</div>
```

2) modify events-list.component.ts using templateUrl instead of template:

```javascript
import { Component } from '@angular/core'

@Component({
    selector: 'events-list',
-    // template: ``
+    templateUrl: 'app/events/events-list.component.html'   //relative to index.html
})
export class EventsListComponent {
    event = {
        name: 'ngConf 2025',
        date: '3/1/2025',
        time: '8am',
        price: '599',
        location: { address: '123 Main St', city: 'Salt Lake City, UT', country: 'USA' }
    }
}
```

## Components Interaction

### 1. Communicating with Child Components Using @Input (Parent pass data to child)

I want to create a address component as a child component. The parent component, events-list, will pass the event object to the child. To get this done:

- child component needs import Input from angular/core
- parent template uses the child selector, and [child object name] = "parent"

1) create child component events-address.component.ts

```javascript
//child component, talk with parent events-list.component.ts
import {Component,Input} from '@angular/core'

@Component({
    selector: 'events-address',
    template: '<span>{{address.address}},{{address.city}},{{address.country}}</span>'
})
export class EventsAddressComponent{
    @Input() address:any  //define address object
}
```

2) modify parent component template, [address] is child object name, "event.location" is parent data

```html
<div>
    <h1>Upcoming Angular 2 Events</h1>
    <div class="well hoverwell thumbnail">
        <h2>Event: {{event.name}}</h2>
        <div>Price: ${{event.price}}</div>
        <div>Date: {{event.date}}</div>
        <div>Time: {{event.time}}</div>
        <!-- <div>Address: {{event.location.address}}, {{event.location.city}}, {{event.location.country}}</div> -->
        <events-address [address]="event.location"></events-address>
    </div>
</div>
```

3) import child component to app.module

```javascript
import { EventsAddressComponent } from './events/events-address.component'

@NgModule({
    declarations: [AppComponent, EventsListComponent, EventsAddressComponent],
})
```

### 2. Communicating with Parent Components Using @Output and EventEmitter (child pass data to parent)

1) child component "events-address.component.ts":

- import Output, EventEmitter
- define a variable accepting EventEmitter
- define buttonClick
- the EventEmitter variable emit any data from child component

```javascript
//child component, talk with parent events-list.component.ts
import {Component, Output, EventEmitter} from '@angular/core'

@Component({
    selector: 'events-address',
    template: '<button (click)="buttonClick()">Click me!</button>'
})
export class EventsAddressComponent{
    @Output() myclick = new EventEmitter()

    buttonClick(){
        this.myclick.emit('I am from child component, should pass data to parent component')
    }
}
```

2) parent Component "events-list.component.ts":

- update template: (the EventEmitter variable name defined in child component) = "randomFuncInParent($event)"

    ```html
    <events-address (myclick)="clickWithAnyName($event)"></events-address>
    ```
- define random function in parent component class

    ```javascript
    export class EventsListComponent {
        clickWithAnyName(dataFromChild){
            alert(dataFromChild)
        }
    }
    ```

### 3. Using Template Variables To Interact with Child Components (parent access to child data, easier than method 2)

1) child component events-address.component.ts define public property and method

```javascript
//child component, talk with parent events-list.component.ts
@Component({
    selector: 'events-address',
    template: ''
})
export class EventsAddressComponent {
    //use template variable to interact with child public method/property: parent accesses child data
    author:string = 'Guanghui Wang'  //child public property
    getAuthor(){
        alert(this.author)
    }
}
```

2) access child component data from parent component template's childPointer variable

```html
<events-address [address]="event.location" (myclick)="clickWithAnyName($event)" #childPointer></events-address>
<button (click)="childPointer.getAuthor()" class="btn-primary btn">Test template variable</button>
<h3>{{childPointer.author}}</h3>
```

## Styling Components

> By default, style scope is current component: the class defined below works only in current component, any other component applied same class won't work.
>
> Global css can be placed in styles.css

```javascript
@Component({
    template: `<button class="mybutton">styling component</button>`,
    styles: [`.mybutton{background:purple;}`]
})
export class EventsAddressComponent {}
```

## Create Navbar

create nav/nav.component.ts and its template nav.component.html, then export component into module.

```javascript
import {Component} from '@angular/core'

@Component({
    selector: 'nav-bar',
    templateUrl: 'app/nav/nav.component.html',
    styles: [`
        .nav.navbar-nav {font-size:15px;}
        #searchForm {margin-right:100px;}
        @media(max-width:1200px) {#searchForm {display:none;}}
    `]
})
export class NavBarComponent { }
```
