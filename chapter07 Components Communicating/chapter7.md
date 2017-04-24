# Components Communicating (Parent and Child, Same as chapter02)

Check code at: https://github.com/wghglory/angular2-fundamental

### Pass parent component to child component (@Input())

Now in event-detail page, we don't show the session information. We want to show session-list for a specific event-detail. Let's create session-list at bottom of event-details.component page

Add below html into event-detail.component.html (parent component template):

```html
<hr>
<session-list [sessions]="event?.sessions"></session-list>
```

Create events/event-detail/session-list.component.ts and its template html page. Don't forget to register component. Child component imports `Input`.

```javascript
import { Component, Input } from '@angular/core'
import { ISession } from '../shared/index'

@Component({
    selector: 'session-list',
    templateUrl: 'app/events/events-detail/session-list.component.html'
})
export class SessionListComponent {
    @Input() sessions: ISession[]
}

```

### Pass child component to parent (@Output(), EventEmitter)

We want to add session or cancel addNewSession for a detail event, so still in event-detail template (Parent component), add this:

```html
<hr>

<div class="row">
    <div class="col-md-2">
        <h3 style="margin:0">Sessions</h3>
    </div>
    <div class="col-md-2">
        <a (click)="addSession()">Add Session</a>
    </div>
</div>

<session-list *ngIf="!addMode" [sessions]="event?.sessions"></session-list>
<create-session *ngIf="addMode" (saveNewSession)="saveNewSession($event)" (cancelAddSession)="cancelAddSession()"></create-session>
```

event-detail.component.ts (Parent component)

```javascript
//http://localhost:8808/events/3

import {Component, OnInit} from '@angular/core'
import {EventService} from '../shared/event.service'
import {ActivatedRoute} from '@angular/router'

+ import {IEvent, ISession} from '../shared/index'


@Component({
    templateUrl: '/app/events/event-detail/event-detail.component.html',
    styles: [`
        .container{padding:0 20px;}
        .event-img{height:100px;}
+        a {cursor:pointer;}
    `]
})
export class EventDetailComponent implements OnInit {
    constructor(private eventService: EventService, private route: ActivatedRoute) { }

    event: IEvent
+    addMode: boolean = false

    ngOnInit() {
        //+ convert string to number
        this.event = this.eventService.getEvent(+this.route.snapshot.params['id'])
    }

+    addSession() {
+        this.addMode = true;
+    }

+    saveNewSession(session: ISession) {
+        //find max id, and newSession id should = id + 1
+        // const maxId = Math.max.apply(null, this.event.sessions.map(s => s.id))
+        const maxId = Math.max(...this.event.sessions.map(s => s.id))

+        session.id = maxId + 1;
+        this.event.sessions.push(session)
+        this.eventService.updateEvent(this.event)
+        this.addMode = false
+    }

+    cancelAddSession() {
+        this.addMode = false
+    }
}
```

shared/event.service.ts add updateEvent method:

```javascript
updateEvent(event) {
    let index = EVENTS.findIndex(x => x.id == event.id)
    EVENTS[index] = event
}
```

When we creates a new session, save or cancel it in create-session.component, the data will be passed to its parent, event-detail.component.

create-session.component.ts (Child component):

```javascript
+ import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ISession, restrictedWords } from '../shared/index'

@Component({
+    selector: 'create-session',
    templateUrl: 'app/events/event-detail/create-session.component.html',
    styles: [
        `
        em {float:right;color:#e05c65;padding-left:10px;}
        .error input, .error select, .error textarea {background-color:#e3c3c5;}
        .error ::-webkit-input-placeholder {color:#999;}
        .error ::-moz-placeholder {color:#999;}
        .error :-ms-input-placeholder {color:#999;}
        `
    ]
})
export class CreateSessionComponent implements OnInit {
+    @Output() saveNewSession = new EventEmitter()
+    @Output() cancelAddSession = new EventEmitter()

    newSessionForm: FormGroup
    name: FormControl
    presenter: FormControl
    duration: FormControl
    level: FormControl
    abstract: FormControl

    ngOnInit() {
        this.name = new FormControl('', Validators.required)
        this.presenter = new FormControl('', Validators.required)
        this.duration = new FormControl('', Validators.required)
        this.level = new FormControl('', Validators.required)
        this.abstract = new FormControl('', [Validators.required, Validators.maxLength(400), restrictedWords(['foo', 'bar'])])

        this.newSessionForm = new FormGroup({
            name: this.name,
            presenter: this.presenter,
            duration: this.duration,
            level: this.level,
            abstract: this.abstract
        })
    }

+    saveSession(formValues) {
        let session: ISession = {
            id: undefined,
            name: formValues.name,
            duration: +formValues.duration,  //convert
            presenter: formValues.presenter,
            level: formValues.level,
            abstract: formValues.abstract,
            voters: []
        }

+        this.saveNewSession.emit(session)
    }

+    cancel(){
+        this.cancelAddSession.emit()
+    }
}
```

wire up cancel button in create-session.component.html

```html
<div class="col-md-12">
    <h3>Create Session</h3>
</div>
<div class="col-md-6">
    <form [formGroup]="newSessionForm" (ngSubmit)="saveSession(newSessionForm.value)" autocomplete="off">
        <div class="form-group" [ngClass]="{'error': name.invalid && name.dirty}">
            <label for="sessionName">Session Name:</label>
            <em *ngIf="name.invalid && name.dirty">Required</em>
            <input formControlName="name" id="sessionName" type="text" class="form-control" placeholder="session name..." />
        </div>
        <div class="form-group" [ngClass]="{'error': presenter.invalid && presenter.dirty}">
            <label for="presenter">Presenter:</label>
            <em *ngIf="presenter.invalid && presenter.dirty">Required</em>
            <input formControlName="presenter" id="presenter" type="text" class="form-control" placeholder="presenter..." />
        </div>
        <div class="form-group" [ngClass]="{'error': duration.invalid && duration.dirty}">
            <label for="duration">Duration:</label>
            <em *ngIf="duration.invalid && duration.dirty">Required</em>
            <select formControlName="duration" class="form-control">
                <option value="">select duration...</option>
                <option value="1">Half Hour</option>
                <option value="2">1 Hour</option>
                <option value="3">Half Day</option>
                <option value="4">Full Day</option>
            </select>
        </div>
        <div class="form-group" [ngClass]="{'error': level.invalid && level.dirty}">
            <label for="level">Level:</label>
            <em *ngIf="level.invalid && level.dirty">Required</em>
            <select formControlName="level" class="form-control">
                <option value="">select level...</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
            </select>
        </div>
        <div class="form-group" [ngClass]="{'error': abstract.invalid && abstract.dirty}">
            <label for="abstract">Abstract:</label>
            <em *ngIf="abstract.invalid && abstract.dirty && abstract?.errors.required">Required</em>
            <em *ngIf="abstract.invalid && abstract.dirty && abstract?.errors.maxlength">Cannot exceed 400 characters</em>
            <em *ngIf="abstract.invalid && abstract.dirty && abstract?.errors.restrictedWords">Restricted Words found: {{abstract.errors.restrictedWords}}</em>
            <textarea formControlName="abstract" id="abstract" rows="3" class="form-control" placeholder="abstract..."></textarea>
        </div>
        <button type="submit" [disabled]="newSessionForm.invalid" class="btn btn-primary">Save</button>
+        <button type="button" (click)="cancel()" class="btn btn-default">Cancel</button>
    </form>
</div>
```
