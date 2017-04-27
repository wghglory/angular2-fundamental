# Collecting Data with Forms and Validation

Check code at: https://github.com/wghglory/angular2-fundamental

### Using Models for Type Safety

1) create events/shared/event.model.ts

```javascript
export interface IEvent {
    id: number
    name: string
    date: Date
    time: string
    price: number
    imageUrl: string
    location?: {
        address: string
        city: string
        country: string
    },
    onlineUrl?: string
    sessions: ISession[]
}

export interface ISession {
    id: number
    name: string
    presenter: string
    duration: number
    level: string
    abstract: string
    voters: string[]
}
```

2) export in shared index.ts

```javascript
export * from './event.service'
+ export * from './event.model'
```

3) event.service.ts

```javascript
+ import { Subject, Observable } from 'rxjs/RX'
+ import { IEvent } from './event.model'

@Injectable()
export class EventService {
+    getEvents(): Observable<IEvent[]> {

        //simulate async loading data operation, return subject. Need to change events-list.component.ts
+        let subject = new Subject<IEvent[]>()
        setTimeout(() => {
            subject.next(EVENTS);
            subject.complete();
        }, 100)

        return subject;
    }

+    getEvent(id: number): IEvent {
        return EVENTS.find(e => e.id === id)
    }
}

+ const EVENTS: IEvent[] = ...
```

4) update `event:any` to `event:IEvent` in event-detail.component, event-list.component, event-thumbnail.component

### Creating Your First Template-based Form

1) user/login.component.ts

```javascript
import {Component} from '@angular/core'
import {AuthService} from './auth.service'

@Component({
    templateUrl: 'app/user/login.component.html'
})
export class LoginComponent {

    constructor(private authService: AuthService) { }

    login(formValues) {  ////will be object of userName and password
        this.authService.loginUser(formValues.userName, formValues.password)
    }
}
```

2) login.component.html

```html
<h1>Login</h1>
<hr>
<div class="col-md-4">
    <form #loginForm="ngForm" (ngSubmit)="login(loginForm.value)" autocomplete="off">
        <div class="form-group">
            <label for="userName">User Name:</label>
            <input (ngModel)="userName" name="userName" id="userName" type="text" class="form-control" placeholder="User Name..." />
        </div>
        <div class="form-group">
            <label for="password">Password:</label>
            <input (ngModel)="password" name="password" id="password" type="password" class="form-control" placeholder="Password..." />
        </div>

        <button type="submit" class="btn btn-primary">Login</button>
        <button type="button" class="btn btn-default">Cancel</button>
    </form>
</div>
```

3) Register component in UserModule

```javascript
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import {userRoutes} from './user.routes'
import {ProfileComponent} from './profile.component'
+ import {LoginComponent} from './login.component'
+ import {FormsModule} from '@angular/forms'

@NgModule({
    imports: [
        CommonModule,
+        FormsModule,
        RouterModule.forChild(userRoutes)
    ],
    declarations: [
        ProfileComponent,
+        LoginComponent
    ],
})
export class UserModule { }
```

4) Add user.routes.ts path

```javascript
import {ProfileComponent} from './profile.component'
+ import {LoginComponent} from './login.component'

export const userRoutes = [
    { path: 'profile', component: ProfileComponent },
+    { path: 'login', component: LoginComponent }
]
```

5) create user/user.model.ts:

```javascript
export interface IUser {
    id: number
    firstName: string
    lastName: string
    userName: string
}
```

6) create user/auth.service.ts:

```javascript
import {Injectable} from '@angular/core'
import {IUser} from './user.model'

@Injectable()
export class AuthService {
    currentUser: IUser

    loginUser(userName: string, password: string) {
        this.currentUser = {
            id: 1,
            userName: userName,
            firstName: 'guanghui',
            lastName: 'wang'
        }
    }

    isAuthenticated() {
        return !!this.currentUser;
    }
}
```

7) register service in app.module.ts

```javascript
...
+ import {AuthService} from './user/auth.service'

@NgModule({
    ...
    providers: [
        ...
+        AuthService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

8) inject AuthService in nav.component.ts

```javascript
import {Component} from '@angular/core'
+ import {AuthService} from '../user/auth.service'

@Component({
    selector: 'nav-bar',
    templateUrl: 'app/nav/nav.component.html',
    styles: [`
        .nav.navbar-nav {font-size:15px;}
        #searchForm {margin-right:100px;}
        @media(max-width:1200px) {#searchForm {display:none;}}
        li>a.active{color:#f97924;}
    `]
})
export class NavBarComponent {
+    constructor(private authService: AuthService) { }
}
```

9) modify nav.component.html

```html
<li>
    <a *ngIf="!authService.isAuthenticated()" [routerLink]="['user/login']">Login</a>
    <a *ngIf="authService.isAuthenticated()" [routerLink]="['user/profile']">Welcome {{authService.currentUser.userName}}</a>
</li>
```

Now when you type username, password and then click login, the rightmost area in navbar's "login" will become the userName.

We will finish up the other features below, like when we click login, or cancel, navigate to all events page

So login.component.ts:

```javascript
import {Component} from '@angular/core'
import {AuthService} from './auth.service'

+ import {Router} from '@angular/router'

@Component({
    templateUrl: 'app/user/login.component.html'
})
export class LoginComponent {

+    constructor(private authService: AuthService, private router:Router) { }

    login(formValues) {
        this.authService.loginUser(formValues.userName, formValues.password)

+        this.router.navigate(['events'])
    }

+    cancel(){
+        this.router.navigate(['events'])
+    }
}
```

add cancel click in login.component.html

```html
<button type="button" (click)="cancel()" class="btn btn-default">Cancel</button>
```

### Validating Template-based Forms (LoginForm)

login.component.html

```html
<h1>Login</h1>
<hr>
<div class="col-md-4">
+    <form #loginForm="ngForm" (ngSubmit)="login(loginForm.value)" autocomplete="off" novalidate>
        <div class="form-group">
            <label for="userName">User Name:</label>
+            <em *ngIf="loginForm.controls.userName?.invalid && (loginForm.controls.userName?.touched || mouseoverLogin)">Required</em>
+            <input required (ngModel)="userName" name="userName" id="userName" type="text" class="form-control" placeholder="User Name..." />
        </div>
        <div class="form-group">
            <label for="password">Password:</label>
+            <em *ngIf="loginForm.controls.password?.invalid && (loginForm.controls.password?.touched || mouseoverLogin)">Required</em>
+            <input required (ngModel)="password" name="password" id="password" type="password" class="form-control" placeholder="Password..." />
        </div>
+        <span (mouseenter)="mouseoverLogin=true" (mouseleave)="mouseoverLogin=false">
+            <button [disabled]="loginForm.invalid" type="submit" class="btn btn-primary">Login</button>
+        </span>
        <button type="button" (click)="cancel()" class="btn btn-default">Cancel</button>
    </form>
</div>

<!-- hover on the login button, display the reason if user is not allowed login -->
<!-- disabled button cannot fire event! So have to wrap span around button -->
```

login.component.ts add styles:

```javascript
@Component({
    templateUrl: 'app/user/login.component.html',
    styles:[
        `em {float:right;color:#e05c65;padding-left:10px;}`
    ]
})
```

### Creating Your First Reactive Form (Profile Form)

1) create profile.component.html and update profile.component.ts

```javascript
import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { AuthService } from './auth.service'
import { Router } from '@angular/router'

@Component({
    templateUrl: 'app/user/profile.component.html'
})
export class ProfileComponent implements OnInit {
    constructor(private authService: AuthService, private router: Router) { }

    profileForm: FormGroup

    ngOnInit() {
        let firstName = new FormControl(this.authService.currentUser.firstName)
        let lastName = new FormControl(this.authService.currentUser.lastName)

        this.profileForm = new FormGroup({
            firstName: firstName,
            lastName: lastName
        })
    }

    cancel() {
        this.router.navigate(['events'])
    }

    saveProfile(formValues) {
        this.authService.updateCurrentUser(formValues.firstName, formValues.lastName)

        this.router.navigate(['events'])
    }
}
```

```html
<div>
    <h1>Edit Your Profile </h1>
    <hr>
    <div class="col-md-4">
        <form [formGroup]="profileForm" (ngSubmit)="saveProfile(profileForm.value)" autocomplete="off" novalidate>
            <div class="form-group">
                <label for="firstName">First Name:</label>
                <input formControlName="firstName" id="firstName" type="text" class="form-control" placeholder="First Name..." />
            </div>
            <div class="form-group">
                <label for="lastName">Last Name:</label>
                <input formControlName="lastName" id="lastName" type="text" class="form-control" placeholder="Last Name..." />
            </div>

            <button type="submit" class="btn btn-primary">Save</button>
            <button (click)="cancel()" type="button" class="btn btn-default">Cancel</button>
        </form>
    </div>
</div>
```

2) import ReactiveFormsModule into user.module.ts

```javascript
...
+ import {FormsModule,ReactiveFormsModule} from '@angular/forms'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
+        ReactiveFormsModule,
        RouterModule.forChild(userRoutes)
    ],
    ...
})
export class UserModule { }
```

3) add updateCurrentUser method in authService

```javascript
export class AuthService {
    ...

    updateCurrentUser(firstName: string, lastName: string) {
        this.currentUser.firstName = firstName;
        this.currentUser.lastName = lastName;
    }
}
```

### Validating Reactive Forms

1) add required Validators, error style, validateFirstName, validateLastName functions in profile.component.ts

```javascript
import { Component, OnInit } from '@angular/core'
+ import { FormControl, FormGroup, Validators } from '@angular/forms'
import { AuthService } from './auth.service'
import { Router } from '@angular/router'

@Component({
    templateUrl: 'app/user/profile.component.html',
+    styles: [
        `
        em {float:right;color:#e05c65;padding-left:10px;}
        .error input{background-color:#e3c3c5;}
        .error ::-webkit-input-placeholder {color:#999;}
        .error ::-moz-placeholder {color:#999;}
        .error :-ms-input-placeholder {color:#999;}
        `
    ]
})
export class ProfileComponent implements OnInit {
    constructor(private authService: AuthService, private router: Router) { }

    profileForm: FormGroup
+   private firstName: FormControl
+   private lastName: FormControl

    ngOnInit() {
+        this.firstName = new FormControl(this.authService.currentUser.firstName, Validators.required)
+        this.lastName = new FormControl(this.authService.currentUser.lastName, Validators.required)

        this.profileForm = new FormGroup({
+            firstName: this.firstName,
+            lastName: this.lastName
        })
    }

    cancel() {
        this.router.navigate(['events'])
    }

    saveProfile(formValues) {
+        if (this.profileForm.valid) {
            this.authService.updateCurrentUser(formValues.firstName, formValues.lastName)
            this.router.navigate(['events'])
        }
    }

+    validateFirstName() {
+        return this.firstName.valid || this.firstName.untouched
+    }

+    validateLastName() {
+        return this.lastName.valid || this.lastName.untouched
+    }
}
```

2) update profile template:

```html
<div>
    <h1>Edit Your Profile </h1>
    <hr>
    <div class="col-md-4">
        <form [formGroup]="profileForm" (ngSubmit)="saveProfile(profileForm.value)" autocomplete="off" novalidate>
+            <div class="form-group" [ngClass]="{'error': !validateFirstName()}">
                <label for="firstName">First Name:</label>
+                <em *ngIf="!validateFirstName()">Required</em>
                <input formControlName="firstName" id="firstName" type="text" class="form-control" placeholder="First Name..." />
            </div>
+            <div class="form-group" [ngClass]="{'error': !validateLastName()}">
                <label for="lastName">Last Name:</label>
+                <em *ngIf="!validateLastName()">Required</em>
                <input formControlName="lastName" id="lastName" type="text" class="form-control" placeholder="Last Name..." />
            </div>

            <button type="submit" class="btn btn-primary">Save</button>
            <button (click)="cancel()" type="button" class="btn btn-default">Cancel</button>
        </form>
    </div>
</div>
```

### Using Multiple Validators in Reactive Forms

Let's say we want firstName starts with a letter, so we add Validators.pattern

```javascript
import { FormControl, FormGroup, Validators } from '@angular/forms'

@Component({
    templateUrl: 'app/user/profile.component.html',
    styles: [
        `
        em {float:right;color:#e05c65;padding-left:10px;}
        .error input{background-color:#e3c3c5;}
        .error ::-webkit-input-placeholder {color:#999;}
        .error ::-moz-placeholder {color:#999;}
        .error :-ms-input-placeholder {color:#999;}
        `
    ]
})
export class ProfileComponent implements OnInit {
    constructor(private authService: AuthService, private router: Router) { }

    profileForm: FormGroup
    firstName: FormControl
    lastName: FormControl

    ngOnInit() {
+        this.firstName = new FormControl(this.authService.currentUser.firstName, [Validators.required, Validators.pattern('[a-zA-Z].*')])
        this.lastName = new FormControl(this.authService.currentUser.lastName, Validators.required)

        this.profileForm = new FormGroup({
            firstName: this.firstName,
            lastName: this.lastName
        })
    }
    ...
}
```

profile template:

```html
<div>
    <h1>Edit Your Profile </h1>
    <hr>
    <div class="col-md-4">
        <form [formGroup]="profileForm" (ngSubmit)="saveProfile(profileForm.value)" autocomplete="off" novalidate>
            <div class="form-group" [ngClass]="{'error': !validateFirstName()}">
                <label for="firstName">First Name:</label>
+                <em *ngIf="!validateFirstName() && profileForm.controls.firstName.errors.required">Required</em>
+                <em *ngIf="!validateFirstName() && profileForm.controls.firstName.errors.pattern">firstName starts with a letter</em>
                <input formControlName="firstName" id="firstName" type="text" class="form-control" placeholder="First Name..." />
            </div>
            ...
        </form>
    </div>
</div>
```

### Diving Deeper into Template-based Forms (Create New Event)

1) add create-event.component.html

2) create-event.component.ts: Add styles, saveEvent

```javascript
//click cancel will use router to navigate to /events (load all events)
import {Component} from '@angular/core'
import {Router} from '@angular/router'
import {EventService} from './shared/event.service'

@Component({
    templateUrl: 'app/events/create-event.component.html',
    styles: [
        `
        em {float:right;color:#e05c65;padding-left:10px;}
        .error input{background-color:#e3c3c5;}
        .error ::-webkit-input-placeholder {color:#999;}
        .error ::-moz-placeholder {color:#999;}
        .error :-ms-input-placeholder {color:#999;}
        `
    ]
})
export class CreateEventComponent {
    isDirty: boolean = true

    constructor(private router: Router, private eventService: EventService) { }

    cancel() {
        this.router.navigate(['/events'])
    }

    saveEvent(formValues) {
        this.eventService.saveEvent(formValues)
        this.isDirty = false
        this.router.navigate(['/events'])
    }
}
```

we can now add a temporary method in event.service.ts

```javascript
saveEvent(event){
    event.id = 999;
    event.sessions = [];
    EVENTS.push(event);
}
```

3) import FormsModule, ReactiveFormsModule in app.module.ts

4) now when we submit the form, formValues is a object that has city, address, country, name, etc. They are at same level. Our model structure actually has location property which includes address, city, country. So we can use ngModelGroup to wrap up these 3 fields.

```html
+ <div ngModelGroup="location">
    <div class="form-group">
        <label for="address">Event Location:</label>
        <input (ngModel)="address" name="address" id="address" type="text" class="form-control" placeholder="Address of event..." />
    </div>
    <div class="row">
        <div class="col-md-6">
            <input (ngModel)="city" name="city" id="city" type="text" class="form-control" placeholder="City..." />
        </div>
        <div class="col-md-6">
            <input (ngModel)="country" name="country" id="country" type="text" class="form-control" placeholder="Country..." />
        </div>
    </div>
+ </div>
```

data is like  `{name: "fdsa", date: "1010/2/2", time: "8:00", price: 34432, location: {address: "fds", city: "fdasfdas", country: "fdsa"}, …}`

### Diving Deeper into Reactive Forms (Event-detail shows session)

1) create /events/event-detail/create-session.component.ts, its template. Don't forget to export in index.ts and register in app.module.ts

```javascript
import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ISession } from '../shared/index'

@Component({
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
        this.abstract = new FormControl('', [Validators.required, Validators.maxLength(400)])

        this.newSessionForm = new FormGroup({
            name: this.name,
            presenter: this.presenter,
            duration: this.duration,
            level: this.level,
            abstract: this.abstract
        })
    }

    saveSession(formValues) {
        // console.log(formValues);

        let session: ISession = {
            id: undefined,
            name: formValues.name,
            duration: +formValues.duration,  //convert
            presenter: formValues.presenter,
            level: formValues.level,
            abstract: formValues.abstract,
            voters: []
        }
        console.log(session)
    }
}
```

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
            <textarea formControlName="abstract" id="abstract" rows="3" class="form-control" placeholder="abstract..."></textarea>
        </div>
        <button type="submit" [disabled]="newSessionForm.invalid" class="btn btn-primary">Save</button>
        <button type="button" class="btn btn-default">Cancel</button>
    </form>
</div>
```

2) register it in routes.ts

```javascript
import {CreateSessionComponent} from './events/event-detail/create-session.component'

export const appRoutes: Routes = [
    //order matters
    { path: 'events/new', component: CreateEventComponent, canDeactivate: ['canDeactivateCreateEvent'] }, //Guarding Against Route De-activation using function, canDeactivateCreateEvent is provider name which points to a function
    { path: 'events', component: EventsListComponent, resolve: { events1: EventListResolver } }, //call EventListResolver before using the component, bind resolver result to a property events1, and this property will be passed to the component
    { path: 'events/:id', component: EventDetailComponent, canActivate: [EventRouteActivator] }, //Guarding Against Route Activation using service
+    { path: 'events/session/new', component: CreateSessionComponent },
    { path: '404', component: Error404Component },
    { path: '', redirectTo: '/events', pathMatch: 'full' },  //pathMatch: prefix or full

    // user prefix, localhost/user/x, will load module here: app/user/user.module and the module name is UserModule, concat '#'
    { path: 'user', loadChildren: 'app/user/user.module#UserModule' }
]
```

### Custom Validation

create-session.component.ts

```javascript
import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ISession, restrictedWords } from '../shared/index'

@Component({
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

    saveSession(formValues) {
        // console.log(formValues);

        let session: ISession = {
            id: undefined,
            name: formValues.name,
            duration: +formValues.duration,  //convert
            presenter: formValues.presenter,
            level: formValues.level,
            abstract: formValues.abstract,
            voters: []
        }
        console.log(session)
    }

    //custom validation
    // private restrictedWords(control: FormControl): { [key: string]: any } {
    //     return control.value.includes('foo')
    //         ? { 'restrictedWords': 'foo' }
    //         : null
    // }

    // this will be put into shared folder
    // private restrictedWords(words) {
    //     return (control: FormControl): { [key: string]: any } => {
    //
    //         if (!words) return null;
    //
    //         var invalidWords = words.map(w => control.value.includes(w) ? w : null)
    //             .filter(w => w != null);
    //
    //         return invalidWords && invalidWords.length > 0
    //             ? { 'restrictedWords': invalidWords.join(', ') }
    //             : null
    //     }
    // }
}
```

shared/restricted-words.validator.ts, and don't forget export in index.ts barrel

```javascript
import {FormControl} from '@angular/forms'

export function restrictedWords(words) {
    return (control: FormControl): { [key: string]: any } => {

        if (!words) return null;

        var invalidWords = words.map(w => control.value.includes(w) ? w : null)
            .filter(w => w != null);

        return invalidWords && invalidWords.length > 0
            ? { 'restrictedWords': invalidWords.join(', ') }
            : null
    }
}
```
