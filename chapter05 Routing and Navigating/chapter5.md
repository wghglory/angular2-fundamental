# Routing and Navigation

Check code at: https://github.com/wghglory/angular2-fundamental

### Adding event-detail page

1) shared/event.service.ts

```javascript
export class EventService {
    getEvents() {
        return EVENTS
    }
    //add getEvent by id
    getEvent(id: number) {
        return EVENTS.find(e => e.id === id)
    }
}
```

2) **Access url parameter**, create app/events/event-detail/event-detail.component.ts

```javascript
//http://localhost:8808/events/3
import {Component, OnInit} from '@angular/core'
import {EventService} from '../shared/event.service'
import {ActivatedRoute} from '@angular/router'

@Component({
    templateUrl: '/app/events/event-detail/event-detail.component.html',
    styles: [`
        .container{padding:0 20px;}
        .event-img{height:100px;}
    `]
})
export class EventDetailComponent implements OnInit {
    constructor(private eventService: EventService, private route: ActivatedRoute) { }

    event: any

    ngOnInit() {
        //+ convert string to number
        this.event = this.eventService.getEvent(+this.route.snapshot.params['id'])
    }
}
```

3) create its template:

```html
<div class="container">
    <img [src]="event?.imageUrl" [alt]="event?.name" class="event-img">
    <div class="row">
        <div class="col-md-11">
            <h2>{{event?.name}} </h2>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6">
            <div><strong>Date:</strong> {{event?.date}}</div>
            <div><strong>Time:</strong> {{event?.time}}</div>
            <div><strong>Price:</strong> ${{event?.price}}</div>
        </div>
        <div class="col-md-6">
            <address>
                <strong>Address:</strong><br />
                {{event?.location?.address}}<br />
                {{event?.location?.city}}, {{event?.location?.country}}
            </address>
        </div>
    </div>
</div>
```

4) register component in module

```javascript
import { EventDetailComponent } from './events/event-detail/event-detail.component'

@NgModule({
    declarations: [AppComponent, EventsListComponent, EventThumbnailComponent, NavBarComponent, EventDetailComponent],
    providers: [EventService, ToastrService],
})
export class AppModule { }
```

### Adding Routing

1) Current app load component like below (app.component.ts). It has `nav-bar` and `events-list` components. `Nav-bar` should show all the time while `events-list` should show only when url is "/", so we should remove `events-list` and use `router-outlet` instead.

old app.component.ts:

```javascript
@Component({
    selector: 'events-app',
    template: `<nav-bar></nav-bar><events-list></events-list>`
})
```

new app.component.ts using router:

```javascript
@Component({
    selector: 'events-app',
    template: `<nav-bar></nav-bar><router-outlet></router-outlet>`
})
```

2) create app/routes.ts

```javascript
import {Routes} from '@angular/router'
import {EventsListComponent} from './events/events-list.component'
import {EventDetailComponent} from './events/event-detail/event-detail.component'

export const appRoutes: Routes = [
    { path: 'events', component: EventsListComponent },
    { path: 'events/:id', component: EventDetailComponent },
    { path: '', redirectTo: '/events', pathMatch: 'full' }  //pathMatch: prefix or full
]
```

3) register routes array and Router module

```javascript
import { RouterModule } from '@angular/router'
import { appRoutes } from './routes'

@NgModule({
    imports: [BrowserModule, RouterModule.forRoot(appRoutes)],
})
export class AppModule { }
```

4) tell angular where app is hosted. Add base in index.html

```html
<head>
    <base href="/">
</head>
```

### Linking to Routes

events-list any thumbnail click => specific events/id page
nav-bar "allEvents" click => load all events: localhost/

event-thumbnail.component.ts: `[routerLink]="['/events', event.id]"`

```html
<div [routerLink]="['/events', event.id]" class="well hoverwell thumbnail">
    <h2>Event: {{event?.name}}</h2>
    <div>Price: \${{event?.price}}</div>
    <div>Date: {{event?.date}}</div>
</div>
```

nav.component.html:

```html
<li><a [routerLink]="['/events']">All Events</a></li>
```

### Navigating from Code

1) create events/create-event.component.ts

```javascript
//click cancel will use router to navigate to /events (load all events)
import {Component} from '@angular/core'
import {Router} from '@angular/router'

@Component({
    template: `
    <h1>New Event</h1>
    <div class="col-md-6">
        <h3>[Create Event Form will go here]</h3>
        <button type="submit" class="btn btn-primary">Save</button>
        <button type="button" class="btn btn-default" (click)="cancel()">Cancel</button>
    </div>
    `
})
export class CreateEventComponent {
    constructor(private router:Router){}

    cancel(){
        this.router.navigate(['/events'])
    }
}
```

2) update routes.ts with CreateEventComponent and route `events/new`:

```javascript
import {Routes} from '@angular/router'
import {EventsListComponent} from './events/events-list.component'
import {EventDetailComponent} from './events/event-detail/event-detail.component'
import {CreateEventComponent} from './events/create-event.component'

export const appRoutes: Routes = [
    { path: 'events/new', component: CreateEventComponent }, //order matters
    { path: 'events', component: EventsListComponent },
    { path: 'events/:id', component: EventDetailComponent },
    { path: '', redirectTo: '/events', pathMatch: 'full' }  //pathMatch: prefix or full
]
```

3) nav/nav.component.html

```html
<ul class="nav navbar-nav">
    <li><a [routerLink]="['/events']">All Events</a></li>
    <li><a [routerLink]="['/events/new']">Create Event</a></li>
</ul>
```

4) register component in module:

```javascript
import { CreateEventComponent} from './events/create-event.component'
import { RouterModule } from '@angular/router'
import { appRoutes } from './routes'

@NgModule({
    imports: [BrowserModule, RouterModule.forRoot(appRoutes)],
    declarations: [AppComponent, EventsListComponent, EventThumbnailComponent, NavBarComponent, EventDetailComponent, CreateEventComponent],
})
export class AppModule { }
```

### Guarding Against Route Activation (Invalid event id like 1000 which doesn't exist, navigate to 404)

1) create errors/404.component.ts, register module, register router

```javascript
import { Component } from '@angular/core'

@Component({
    template: `
        <h1 class="errorMessage">404'd</h1>
      `,
    styles: [`
        .errorMessage {
             margin-top:150px;
             font-size: 170px;
             text-align: center;
        }`]
})
export class Error404Component {
    constructor() {

    }

}
```

2) create events/event-detail/event-route-activator.service.ts and register this EventRouteActivator service into app.module.ts providers

```javascript
import { Router, ActivatedRouteSnapshot, CanActivate } from '@angular/router'
import { Injectable } from '@angular/core'
import { EventService} from '../shared/event.service'

@Injectable()
export class EventRouteActivator implements CanActivate {
    constructor(private eventService: EventService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot) {
        const eventExists = !!this.eventService.getEvent(+route.params['id'])  //+ convert

        if (!eventExists)
            this.router.navigate(['/404'])

        return eventExists
    }
}
```

app.component.ts

```javascript
import { Error404Component } from './errors/404.component'
import { EventRouteActivator } from './events/event-detail/event-route-activator.service'
import { RouterModule } from '@angular/router'
import { appRoutes } from './routes'

@NgModule({
    imports: [BrowserModule, RouterModule.forRoot(appRoutes)],
    declarations: [
        AppComponent,
        NavBarComponent,
        EventsListComponent, EventThumbnailComponent, EventDetailComponent, CreateEventComponent,
        Error404Component
    ],
+    providers: [EventService, ToastrService, EventRouteActivator],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

3) routes.ts add canActivate and EventRouteActivator service

> note: route canActivate can use both service and function. Here we're using service

```javascript
import {Routes} from '@angular/router'
import {EventsListComponent} from './events/events-list.component'
import {EventDetailComponent} from './events/event-detail/event-detail.component'
import {CreateEventComponent} from './events/create-event.component'

import {Error404Component} from './errors/404.component'

+ import {EventRouteActivator} from './events/event-detail/event-route-activator.service'

export const appRoutes: Routes = [
    { path: 'events/new', component: CreateEventComponent }, //order matters
    { path: 'events', component: EventsListComponent },
+    { path: 'events/:id', component: EventDetailComponent, canActivate: [EventRouteActivator] },
    { path: '404', component: Error404Component },
    { path: '', redirectTo: '/events', pathMatch: 'full' }  //pathMatch: prefix or full
]
```

### Guarding Against Route De-activation (User navigates to other url before saving data, like cancel button clicking)

1) routes.ts add canDeactivate, and we're using function.

```javascript
import {Routes} from '@angular/router'
import {EventsListComponent} from './events/events-list.component'
import {EventDetailComponent} from './events/event-detail/event-detail.component'
import {CreateEventComponent} from './events/create-event.component'

import {Error404Component} from './errors/404.component'

import {EventRouteActivator} from './events/event-detail/event-route-activator.service'

export const appRoutes: Routes = [
+    { path: 'events/new', component: CreateEventComponent, canDeactivate: ['canDeactivateCreateEvent'] },
    { path: 'events', component: EventsListComponent },
    { path: 'events/:id', component: EventDetailComponent, canActivate: [EventRouteActivator] },
    { path: '404', component: Error404Component },
    { path: '', redirectTo: '/events', pathMatch: 'full' }  //pathMatch: prefix or full
]
```

We defined `canDeactivateCreateEvent` function, and we should register this in module's providers. Now our providers are like `providers: [EventService, ToastrService, EventRouteActivator]`. Actually we already used the shorthand way for providers. Take EventService for instance, the longhand is `providers: [{provide:EventService, useValue:EventService}]`. So below is how we register the `canDeactivateCreateEvent` function into the providers.

app.module.ts:

```javascript
@NgModule({
    imports: [BrowserModule, RouterModule.forRoot(appRoutes)],
    declarations: [
        AppComponent,
        NavBarComponent,
        EventsListComponent, EventThumbnailComponent, EventDetailComponent, CreateEventComponent,
        Error404Component
    ],
    providers: [
        EventService,
        ToastrService,
        EventRouteActivator,
+        {
+            provide: 'canDeactivateCreateEvent',
+            useValue: checkDirtyState
+        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

//this function can be defined in another file
+function checkDirtyState(component: CreateEventComponent) {
+    if(component.isDirty){
+        return confirm('you haven\'t save the event. Are you sure to cancel?')
+    }
+    return true;
+}
```

2) create-event.component.ts add isDirty

```javascript
//click cancel will use router to navigate to /events (load all events)
import {Component} from '@angular/core'
import {Router} from '@angular/router'

@Component({})
export class CreateEventComponent {
+    isDirty: boolean = true

    constructor(private router: Router) { }

    cancel() {
        this.router.navigate(['/events'])
    }
}
```

### Pre-loading Data for Components

In real world, we may have some delay to receive data from ajax call. To show this issue,

1) simulate ajax loading data in event.service.ts, so it takes 2 second to get data

```javascript
+ import { Subject } from 'rxjs/RX'

@Injectable()
export class EventService {
    getEvents() {
        //simulate async loading data operation, return subject. Need to change events-list.component.ts
+        let subject = new Subject()
+        setTimeout(() => {
+            subject.next(EVENTS);
+            subject.complete();
+        }, 2000)

+        return subject;
    }
}
```

2) in events-list.component.ts

```javascript
export class EventsListComponent implements OnInit {
+    events: any   //before was events: any[], now compiler won't complain

    ngOnInit() {
-        // this.events = this.eventService.getEvents()
+        this.eventService.getEvents().subscribe(events => { this.events = events })
    }
}
```

Now when we navigate to base page, we can immediately see `<h1>Upcoming Angular 2 Events</h1>`, but it takes 2 second before showing data. Similar issue is like table header shows immediately but data is still loading. So we will use a resolver to make sure the template html along with data will be loaded once at the same time

3) create events-list-resolver.service.ts and then register provider in module

```javascript
import {Injectable} from '@angular/core'
import {Resolve} from '@angular/router'
import {EventService} from './shared/event.service'

@Injectable()
export class EventListResolver implements Resolve<any>{
    constructor(private eventService: EventService) {

    }

    resolve() {
        // map() return Observable; subscribe() return subscription
        // in resolve, we need to return Observable. angular can watch Observable and see if it finishes
        return this.eventService.getEvents().map(events => events);
    }
}
```

4) use resolver in the routes by `resolve: { events:1 EventListResolver }`. events1 is property that will be passed to component after calling Resolver.

```javascript
+ import {EventListResolver} from './events/events-list-resolver.service'

export const appRoutes: Routes = [
    //order matters
    { path: 'events/new', component: CreateEventComponent, canDeactivate: ['canDeactivateCreateEvent'] }, //Guarding Against Route De-activation using function, canDeactivateCreateEvent is provider name which points to a function
+    { path: 'events', component: EventsListComponent, resolve: { events1: EventListResolver } }, //call EventListResolver before using the component, bind resolver result to a property events1, and this property will be passed to the component
    { path: 'events/:id', component: EventDetailComponent, canActivate: [EventRouteActivator] }, //Guarding Against Route Activation using service
    { path: '404', component: Error404Component },
    { path: '', redirectTo: '/events', pathMatch: 'full' }  //pathMatch: prefix or full
]
```

5) consume the events property in events-list.component

```javascript
import {ActivatedRoute} from '@angular/router'

export class EventsListComponent implements OnInit {
    events: any[]

    constructor(private eventService: EventService, private toastrService: ToastrService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        // // this.events = this.eventService.getEvents()
        // this.eventService.getEvents().subscribe(events => { this.events = events })  //since we are using resolver
        this.events = this.route.snapshot.data['events1'];
    }
}
```

### Styling Active Links

1) define active class in nav.component.ts

```javascript
import {Component} from '@angular/core'

@Component({
    selector: 'nav-bar',
    templateUrl: 'app/nav/nav.component.html',
    styles: [`
        .nav.navbar-nav {font-size:15px;}
        #searchForm {margin-right:100px;}
        @media(max-width:1200px) {#searchForm {display:none;}}
+        li>a.active{color:#f97924;}
    `]
})
export class NavBarComponent { }
```

2) in nav.component.html add `routerLinkActive="active"`

When navigating to events/new, both will have active class by default. This is because routerLinkActive finds both start with **/events**. So we also add `[routerLinkActiveOptions]="{exact:true}"`

```html
<li><a [routerLink]="['/events']" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">All Events</a></li>
<li><a [routerLink]="['/events/new']" routerLinkActive="active">Create Event</a></li>
```

### Lazily Loading Feature Modules

For now we only have 1 module.

let's create a user profile and since user is different part of our app, we want to use another lazily loading feature module. This module will be loaded only when user navigates to the module, so it affects the performance for a larger application.

1) user/user.module.ts

```javascript
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import {userRoutes} from './user.routes'
import {ProfileComponent} from './profile.component'

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(userRoutes)
    ],
    declarations: [
        ProfileComponent
    ],
    providers: [

    ],
    bootstrap: []
})
export class UserModule { }
```

2) user/profile.component.ts

```javascript
import { Component } from '@angular/core'

@Component({
  template: `
    <h1>Edit Your Profile</h1>
    <hr>
    <div class="col-md-6">
      <h3>[Edit profile form will go here]</h3>
      <br />
      <br />
      <button type="submit" class="btn btn-primary">Save</button>
      <button type="button" class="btn btn-default">Cancel</button>
    </div>
  `,
})
export class ProfileComponent {}
```

3) user/user.routes.ts

```javascript
import {ProfileComponent} from './profile.component'

export const userRoutes = [
    { path: 'profile', component: ProfileComponent }
]
```

4) In routes.ts:

```javascript
export const appRoutes: Routes = [
    ...
    // user prefix, localhost/user/x, will load module here: app/user/user.module and the module name is UserModule, concat '#'
    { path: 'user', loadChildren: 'app/user/user.module#UserModule' }
]
```

5) in nav/nav.component.html

```html
<li><a [routerLink]="['user/profile']">Welcome Guanghui</a></li>
```

### Organizing Your Exports with Barrels

Now our app.component.ts has too many import, we can use Barrels to simplify the **Event** import

1) create index.ts under events folder and its subfolder. In this case, there should be 3 index.ts

events/index.ts

```javascript
export * from './create-event.component'
export * from './event-thumbnail.component'
export * from './events-list-resolver.service'
export * from './events-list.component'
export * from './shared/index'
export * from './event-detail/index'
```

events/shared/index.ts

```javascript
export * from './event.service'
```

events/event-detail/index.ts

```javascript
export * from './event-detail.component'
export * from './event-route-activator.service'
```

2) delete all event related import, and use below:

```javascript
import {
    EventsListComponent,
    EventThumbnailComponent,
    EventDetailComponent,
    CreateEventComponent,
    EventRouteActivator,
    EventService,
    EventListResolver
} from './events/index'
```
