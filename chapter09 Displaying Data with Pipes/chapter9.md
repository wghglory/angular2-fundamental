# Displaying Data with Pipes

Check code at: https://github.com/wghglory/angular2-fundamental

### Using Built-in Pipes

Now in event list page, you can see event title case is not unique, so we can use pipe to make all titles uppercase.

Take event-detail.component.html for instance:

```html
    <h2>{{event?.name | uppercase}} </h2>
    <div><strong>Date:</strong> {{event?.date | date:'shortDate'}}</div>
    <div><strong>Price:</strong> {{event?.price | currency:'USD':true}}</div>
```

### Creating a Custom Pipe

Now a problem is duration shows number instead of readable text in event-detail's session list.

1) create events/shared/duration.pipe.ts. Register it in barrel, AppModule

```javascript
import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'duration' })
export class DurationPipe implements PipeTransform {
    transform(value: number): string {
        switch (value) {
            case 1: return 'Half Hour'
            case 2: return 'One Hour'
            case 3: return 'Half Day'
            case 4: return 'Full Hour'
            default: return value.toString();
        }
    }
}
```

2) session-list add duration pipe:

```html
<span>Duration: {{session.duration | duration}}</span>
```

### Sorting and Filtering Overview

Angular 1 has performance issues. One is using filter, sort by pipe. If a object array have thousands of objects and each object has many properties, it will be very costly to filter or sort. Angular 1 checks if each property of all objects has changed...

Angular 2 pipe is no longer responsible for sorting or filtering. By default, angular 2 runs the pipe only when the identity of source has changed. Angular 2 also can use "impure pipes", which is same mechanism as angular 1 with performance issue

### Filtering

<img src="http://om1o84p1p.bkt.clouddn.com//1493229011.png" />

In event-detail page, session-list has "level", and we want to filter session-list by "level". We put 4 buttons on top.

event-detail.component.ts add "filterBy" property:

```javascript
...
export class EventDetailComponent implements OnInit {
    constructor(private eventService: EventService, private route: ActivatedRoute) { }

    event: IEvent
    addMode: boolean = false
+    filterBy: string = 'all';
    ...
}
```

event-detail.component.html

```html
<div class="row" style="margin-bottom:10px;">
    <div class="col-md-2">
        <h3 style="margin:0">Sessions</h3>
    </div>
+    <div class="col-md-7">
+        <button class="btn btn-default" [class.active]="filterBy==='all'" (click)="filterBy='all'">All</button>
+        <button class="btn btn-default" [class.active]="filterBy==='beginner'" (click)="filterBy='beginner'">Beginner</button>
+        <button class="btn btn-default" [class.active]="filterBy==='intermediate'" (click)="filterBy='intermediate'">Intermediate</button>
+        <button class="btn btn-default" [class.active]="filterBy==='advanced'" (click)="filterBy='advanced'">Advanced</button>
+    </div>
    <div class="col-md-2">
        <a (click)="addSession()">Add Session</a>
    </div>
</div>

+ <session-list [filterBy]="filterBy" *ngIf="!addMode" [sessions]="event?.sessions"></session-list>
```

session-list.component.ts

```javascript
+ import { Component, Input, OnChanges } from '@angular/core'
import { ISession } from '../shared/index'

@Component({
    selector: 'session-list',
    templateUrl: 'app/events/event-detail/session-list.component.html'
})
export class SessionListComponent implements OnChanges {
    @Input() sessions: ISession[]
+    @Input() filterBy: string
+    visibleSessions: ISession[] = [];

    //whenever the input variable changes
+    ngOnChanges() {
+        if (this.sessions) {
+            this.filterSessions(this.filterBy);
+        }
+    }

+    filterSessions(filter) {
+        if (filter === 'all') {
+            // this.visibleSessions = this.sessions;  //wrong, we want to make a copy
+            this.visibleSessions = this.sessions.slice(0);  //clone the arr
+        } else {
+            this.visibleSessions = this.sessions.filter(s => {
+                return s.level.toLocaleLowerCase() == filter;
+            })
+        }
+    }
}
```

session-list.component.html: use visiableSessions instead of sessions

```html
<div class="row" *ngFor="let session of visibleSessions">
```

### Sorting

sorting by name, voters


event-detail.component.html

```html
...
    <div class="row" style="margin-bottom:10px;">
        <div class="col-md-2">
            <h3 style="margin:0">Sessions</h3>
        </div>
        <div class="col-md-7">
+            <div class="btn-group btn-group-sm" style="margin:0 20px;">
+                <button class="btn btn-default" [class.active]="sortBy==='name'" (click)="sortBy='name'">By Name</button>
+                <button class="btn btn-default" [class.active]="sortBy==='votes'" (click)="sortBy='votes'">By Votes</button>
+            </div>

            <div class="btn-group btn-group-sm">
                <button class="btn btn-default" [class.active]="filterBy==='all'" (click)="filterBy='all'">All</button>
                <button class="btn btn-default" [class.active]="filterBy==='beginner'" (click)="filterBy='beginner'">Beginner</button>
                <button class="btn btn-default" [class.active]="filterBy==='intermediate'" (click)="filterBy='intermediate'">Intermediate</button>
                <button class="btn btn-default" [class.active]="filterBy==='advanced'" (click)="filterBy='advanced'">Advanced</button>
            </div>
        </div>
        <div class="col-md-2">
            <a (click)="addSession()">Add Session</a>
        </div>
    </div>

+    <session-list [sortBy]="sortBy" [filterBy]="filterBy" *ngIf="!addMode" [sessions]="event?.sessions"></session-list>
    <create-session *ngIf="addMode" (saveNewSession)="saveNewSession($event)" (cancelAddSession)="cancelAddSession()"></create-session>
</div>
```

event-detail.component.ts add sortBy property:

```javascript
sortBy: string = 'votes';  //default votes
```

session-list.component.ts

```javascript
import { Component, Input, OnChanges } from '@angular/core'
import { ISession } from '../shared/index'

@Component({
    selector: 'session-list',
    templateUrl: 'app/events/event-detail/session-list.component.html'
})
export class SessionListComponent implements OnChanges {
    @Input() sessions: ISession[]
    @Input() filterBy: string
    visibleSessions: ISession[] = [];
+    @Input() sortBy: string

    //whenever the input variable changes
    ngOnChanges() {
        if (this.sessions) {
            this.filterSessions(this.filterBy);
+           this.sortBy === 'name' ? this.visibleSessions.sort(sortByNameAsc) : this.visibleSessions.sort(sortByVotesDesc)
        }
    }

    filterSessions(filter) {
        if (filter === 'all') {
            // this.visibleSessions = this.sessions;  //wrong, we want to make a copy
            this.visibleSessions = this.sessions.slice(0);  //clone the arr
        } else {
            this.visibleSessions = this.sessions.filter(s => {
                return s.level.toLocaleLowerCase() == filter;
            })
        }
    }
}

+ function sortByNameAsc(s1: ISession, s2: ISession) {
+    if (s1.name > s2.name) return 1;
+    else if (s1.name === s2.name) return 0;
+    else return -1;
+ }

+ function sortByVotesDesc(s1: ISession, s2: ISession) {
+    return (s2.voters.length - s1.voters.length);
+ }
```
