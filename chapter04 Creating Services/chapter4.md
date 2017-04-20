### Services and Dependency Injection

1) create shared/event.service.ts

```javascript
//include this in module.ts providers
import { Injectable } from '@angular/core'

@Injectable()
export class EventService {
    getEvents() {
        return EVENTS
    }
}

const EVENTS = [
    {
        id: 1,
        name: 'Angular Connect',
        date: '9/26/2036',
        time: '10:00 am',
        price: 599.99,
        imageUrl: '/app/assets/images/angularconnect-shield.png',
        location: {
            address: '1057 DT',
            city: 'London',
            country: 'England'
        }
    },
    ...
]
```

2) events-list.component.ts

```javascript
//OnInit is like interface which class must implements ngOnInit method
import { Component, OnInit } from '@angular/core'
// import service
import {EventService} from './shared/event.service'

@Component({
    selector: 'events-list',
    templateUrl: 'app/events/events-list.component.html'   //relative to index.html
})
export class EventsListComponent implements OnInit {
    events: any = []

    //DI
    constructor(private eventService: EventService) {
    }

    ngOnInit() {
        this.events = this.eventService.getEvents()
    }
}
```

3) bind service to providers in module

```javascript
import { EventService } from './events/shared/event.service'

@NgModule({
    declarations: [AppComponent, EventsListComponent, EventThumbnailComponent, NavBarComponent],
    providers: [EventService],
})
export class AppModule { }
```

### Wrapping Third Party Services

Feature: Clicking each thumbnail will toastr event name

We're going to use toastr as 3rd party library. After installation, include toastr js and css into index.html

```bash
npm install toastr --save
```

1) create common/toastr.service.ts

```javascript
import { Injectable } from '@angular/core'

//I guess this local variable was assigned the global toastr variable
declare let toastr: any

@Injectable()
export class ToastrService {

    success(message: string, title?: string) {
        toastr.success(message, title);
    }
    info(message: string, title?: string) {
        toastr.info(message, title);
    }
    error(message: string, title?: string) {
        toastr.error(message, title);
    }
    warning(message: string, title?: string) {
        toastr.warning(message, title);
    }
}
```

2) events-list.component.ts inject toastr service, and create toastrName function passing event name

```javascript
//OnInit is like interface which class must implements ngOnInit method
import { Component, OnInit } from '@angular/core'
import {EventService} from './shared/event.service'
import {ToastrService} from '../common/toastr.service'

@Component({
    selector: 'events-list',
    templateUrl: 'app/events/events-list.component.html'   //relative to index.html
})
export class EventsListComponent implements OnInit {
    events: any = []

    constructor(private eventService: EventService, private toastrService: ToastrService) {}

    ngOnInit() {
        this.events = this.eventService.getEvents()
    }

    toastrName(data){
        this.toastrService.success(data);
    }
}
```

wire toastrName function in events-list.component template:

```html
<div>
    <h1>Upcoming Angular 2 Events</h1>
    <div class="row">
        <div class="col-md-5" *ngFor="let e of events">
            <event-thumbnail [event]="e" (click)="toastrName(e.name)"></event-thumbnail>
        </div>
    </div>
</div>
```

3) include ToastrService in module

```javascript
import { EventService } from './events/shared/event.service'
import { ToastrService } from './common/toastr.service'

@NgModule({
    declarations: [AppComponent, EventsListComponent, EventThumbnailComponent, NavBarComponent],
    providers: [EventService, ToastrService],
})
export class AppModule { }
```
