# More Components and Custom Validators

Check code at: https://github.com/wghglory/angular2-fundamental

We can vote for sessions whatever user likes.

### Voter function

1) events/event-detail/session-list.component.html add this:

```html
<div class="col-md-1">
    <div *ngIf="auth.isAuthenticated()">
        <upvote (vote)="toggleVote(session)" [count]="session.voters.length" [voted]="userHasVoted(session)"></upvote>
    </div>
</div>
```

2) events/event-detail/session-list.component.ts

```javascript
import { Component, Input, OnChanges } from '@angular/core'
import { ISession } from '../shared/index'
+ import { AuthService } from '../../user/auth.service'
+ import { VoterService } from './voter.service'

@Component({
    selector: 'session-list',
    templateUrl: 'app/events/event-detail/session-list.component.html'
})
export class SessionListComponent implements OnChanges {
    @Input() sessions: ISession[]
    @Input() filterBy: string
    visibleSessions: ISession[] = [];
    @Input() sortBy: string

+    constructor(private auth: AuthService, private voterService: VoterService) { }

    //whenever the input variable changes
    ngOnChanges() {
        if (this.sessions) {
            this.filterSessions(this.filterBy);
            this.sortBy === 'name' ? this.visibleSessions.sort(sortByNameAsc) : this.visibleSessions.sort(sortByVotesDesc)
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

+    toggleVote(session: ISession) {
+        if (this.userHasVoted(session)) {
+            this.voterService.deleteVoter(session, this.auth.currentUser.userName);
+        } else {
+            this.voterService.addVoter(session, this.auth.currentUser.userName);
+        }

+        if (this.sortBy === 'votes') {
+            this.visibleSessions.sort(sortByVotesDesc);
+        }
+    }

+    userHasVoted(session: ISession) {
+        return this.voterService.userHasVoted(session, this.auth.currentUser.userName);
+    }
}

function sortByNameAsc(s1: ISession, s2: ISession) {
    if (s1.name > s2.name) return 1;
    else if (s1.name === s2.name) return 0;
    else return -1;
}

function sortByVotesDesc(s1: ISession, s2: ISession) {
    return (s2.voters.length - s1.voters.length);
}
```

3) add events/event-detail/upvote.component.ts, register in barrel and app.module.ts

```javascript
import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
    selector: 'upvote',
    template: `
    <div class="votingWidgetContainer pointable" (click)="onClick()">
        <div class="well votingWidget">
            <div class="votingButton">
                <i *ngIf="voted" class="glyphicon glyphicon-heart"></i>
                <i *ngIf="!voted" class="glyphicon glyphicon-heart-empty"></i>
            </div>
            <div class="badge badge-inverse votingCount">
                <div>{{count}}</div>
            </div>
        </div>
    </div>`,
    styleUrls: ['/app/events/event-detail/upvote.component.css']
})
export class UpvoteComponent {
    @Input() count: number;
    @Input() voted: boolean;
    @Output() vote = new EventEmitter();

    onClick() {
        this.vote.emit({});
    }
}
```

4) voter.service.ts

```javascript
import { Injectable } from '@angular/core'
import { ISession } from '../shared/event.model'

@Injectable()
export class VoterService {
    deleteVoter(session: ISession, voterName: string) {
        session.voters = session.voters.filter(v => v !== voterName);
    }

    addVoter(session: ISession, voterName: string) {
        session.voters.push(voterName);
    }

    userHasVoted(session: ISession, voterName: string) {
        return session.voters.some(v => v === voterName);
    }
}
```

### Update feature: voted red color, unvoted white color

**Using @Input Setters**

upvote.component.ts:

```javascript
import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
    selector: 'upvote',
    template: `
    <div class="votingWidgetContainer pointable" (click)="onClick()">
        <div class="well votingWidget">
            <div class="votingButton">
+                <i [style.color]="iconColor" class="glyphicon glyphicon-heart"></i>
-                <!--
-                    <i *ngIf="voted" class="glyphicon glyphicon-heart"></i>
-                    <i *ngIf="!voted" class="glyphicon glyphicon-heart-empty"></i>
-                -->
            </div>
            <div class="badge badge-inverse votingCount">
                <div>{{count}}</div>
            </div>
        </div>
    </div>`,
    styleUrls: ['/app/events/event-detail/upvote.component.css']
})
export class UpvoteComponent {
    @Input() count: number;
+    iconColor: string;
+    @Input() set voted(val) {
+        this.iconColor = val ? 'red' : 'white';
+    }
    @Output() vote = new EventEmitter();


    onClick() {
        this.vote.emit({});
    }
}
```

### Creating a Complex Custom Validator

when user creates a new event, we want to make sure all 3 location fields or onlineUrl are typed.

location-validator.directive.ts, register it in barrel and app.module.ts

```javascript
import { Directive } from '@angular/core'
import { Validator, FormGroup, NG_VALIDATORS } from '@angular/forms'

@Directive({
    selector: '[validateLocation]',
    providers: [{ provide: NG_VALIDATORS, useExisting: LocationValidator, multi: true }] //use multi:true to add LocationValidator to NG_VALIDATORS which is a list of angular built-in validators, otherwise can replace/override
})
export class LocationValidator implements Validator {

    validate(formGroup: FormGroup): { [key: string]: any } {
        let addressControl = formGroup.controls['address'];
        let cityControl = formGroup.controls['city'];
        let countryControl = formGroup.controls['country'];
        let onlineUrlControl = (<FormGroup>formGroup.root).controls['onlineUrl'];

        console.log(addressControl && addressControl.value)

        if ((addressControl && addressControl.value
            && cityControl && cityControl.value
            && countryControl && countryControl.value)
            || (onlineUrlControl && onlineUrlControl.value)) {
            return null;
        } else {
            return { validateLocation: false }
        }
    }

}
```

create-event.component.ts

```html
<form #newEventForm="ngForm" (ngSubmit)="saveEvent(newEventForm.value)" autocomplete="off" novalidate>

+    <div ngModelGroup="location" validateLocation #locationGroup="ngModelGroup">
        <div class="form-group">
            <label for="address">Event Location:</label>
+            <em *ngIf="locationGroup?.invalid && locationGroup?.touched">You must enter either flll location or online url</em>
            <input [(ngModel)]="address" name="address" id="address" type="text" class="form-control" placeholder="Address of event..." />
        </div>
        <div class="row">
            <div class="col-md-6">
                <input [(ngModel)]="city" name="city" id="city" type="text" class="form-control" placeholder="City..." />
            </div>
            <div class="col-md-6">
                <input [(ngModel)]="country" name="country" id="country" type="text" class="form-control" placeholder="Country..." />
            </div>
        </div>
    </div>

    <div class="form-group">
        <label for="onlineUrl">Online Url:</label>
+        <input (change)="locationGroup.control.controls.address.updateValueAndValidity()" [(ngModel)]="onlineUrl" name="onlineUrl" id="onlineUrl" type="text" class="form-control" placeholder="Online Url..." />
    </div>

</form>
```
