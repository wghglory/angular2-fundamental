# Communicating with the Server Using HTTP, Observables, and Rx

Check code at: https://github.com/wghglory/angular2-fundamental

### Observable features

- Can be Synchronous and Async
- Impoved Error Handling
- Can be closed independently of returning a value
- Can deal with Time
- Advanced Operations
    - Mathmetical Aggregation
    - Buffering
    - Debounce
    - Distinct
    - Filtering
    - Combining Observables
    - Retry

### Observables VS Promise

Promise:

- represent a single value in the future
- Async

Observables:

- represent 0 or more values now or in the future
- both sync and async

### HttpModule

app.module.ts

```javascript
+ import {HttpModule} from '@angular/http'

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(appRoutes),
        FormsModule,
        ReactiveFormsModule,
+        HttpModule
    ]})
```

### EventService Http

> note: normally, http return Observable, there must be somewhere call subscribe() to return real data.
> If we don't need response data, probably call subscribe() immediately after the http.
> Otherwise, call subscribe() when you call the service
> Exception: when using resolver, subscribe is not needed (Eventlist and event-detail)

event.service.ts

```javascript
import { Injectable, EventEmitter } from '@angular/core'
import { Subject, Observable } from 'rxjs/RX'
import { IEvent, ISession } from './event.model'

import { Http, Response, Headers, RequestOptions } from '@angular/http'

@Injectable()
export class EventService {

    constructor(private http: Http) { }

    getEvents(): Observable<IEvent[]> {
        return this.http.get('/api/events').map((res: Response) => {
            return <IEvent[]>res.json();
        }).catch(this.handleError);
    }

    getEvent(id: number): Observable<IEvent> {
        return this.http.get('/api/events/' + id).map((res: Response) => {
            return <IEvent>res.json();
        }).catch(this.handleError);
    }

    saveEvent(event): Observable<IEvent> {
        let headers = new Headers({ 'Content-Type': 'applicaton/json' });
        let options = new RequestOptions({ headers: headers });

        //put is exactly same code with post
        return this.http.post('/api/events', JSON.stringify(event), options)
            .map((res: Response) => {
                console.log(res)
                return res.json();
            }).catch(this.handleError);
    }

    // move this to saveEvent, if id passes => update, no id => add
    // updateEvent(event) {
    //     let index = EVENTS.findIndex(x => x.id == event.id)
    //     EVENTS[index] = event
    // }

    searchSessions(searchTerm: string) {
        return this.http.get('/api/sessions/search?search=' + searchTerm).map((res: Response) => {
            return res.json();
        }).catch(this.handleError);
    }

    private handleError(err: Response) {
        return Observable.throw(err.statusText);
    }
}
```

event-list-resolver.service.ts

```javascript
import {Injectable} from '@angular/core'
import {Resolve} from '@angular/router'
import {EventService} from './shared/event.service'

@Injectable()
export class EventListResolver implements Resolve<any>{
    constructor(private eventService: EventService) {    }

    resolve() {
        // subscribe is not needed when calling the service in resolver
        return this.eventService.getEvents();
    }
}
```

create events/event-resolver.service.ts

```javascript
import {Injectable} from '@angular/core'
import {Resolve, ActivatedRouteSnapshot} from '@angular/router'
import {EventService} from './shared/event.service'

@Injectable()
export class EventResolver implements Resolve<any>{
    constructor(private eventService: EventService) {    }

    resolve(route: ActivatedRouteSnapshot) {
        return this.eventService.getEvent(+route.params['id']);
    }
}
```

event-detail.component.ts

```javascript
ngOnInit() {
    // //+ convert string to number
    // this.event = this.eventService.getEvent(+this.route.snapshot.params['id'])

    // whenever route params changes, reset all the states
    this.route.data.forEach((data) => {
        // this.event = this.eventService.getEvent(+params['id']);  //sync

        // //async, removed because we use EventResolver
        // this.eventService.getEvent(+params['id']).subscribe((e: IEvent) => {
        //     this.event = e;
        //     this.addMode = false;
        //     this.filterBy = 'all';
        //     this.sortBy = 'votes';
        // });

        //async and use EventResolver
        this.event = data['event'];
        this.addMode = false;
        this.filterBy = 'all';
        this.sortBy = 'votes';
    });
}
```

delete event-route-activator.ts guard since we don't want to call httprequrest twice, also delete any related code in module, route.

```javascript
export class EventRouteActivator implements CanActivate {
    constructor(private eventService: EventService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot) {
        //call twice
        const eventExists = !!this.eventService.getEvent(+route.params['id'])  //+ convert

        if (!eventExists)
            this.router.navigate(['/404'])

        return eventExists
    }
}
```

modify route.ts

```javascript
{ path: 'events/:id', component: EventDetailComponent, resolve: { event: EventResolver } }, //Guarding Against Route Activation using service
```

create-event.component.ts

```javascript
export class CreateEventComponent {
    isDirty: boolean = true

    constructor(private router: Router, private eventService: EventService) { }

    cancel() {
        this.router.navigate(['/events'])
    }

    saveEvent(formValues) {
+        this.eventService.saveEvent(formValues).subscribe(e => {
+            this.isDirty = false
+            this.router.navigate(['/events'])
+        });
    }
}
```

### VoterService Http

voter.service.ts

```javascript
import { Injectable } from '@angular/core'
import { ISession } from '../shared/event.model'

import {Http, Response, Headers, RequestOptions} from '@angular/http'
import { Observable } from 'rxjs/Rx'

@Injectable()
export class VoterService {

    constructor(private http: Http) { }

    deleteVoter(eventId: number, session: ISession, voterName: string) {
        session.voters = session.voters.filter(v => v !== voterName);
        let url = `/api/events/${eventId}/sessions/${session.id}/voters/${voterName}`;
        return this.http.delete(url).catch(this.handleError).subscribe();
        //when we don't care the returning result, use subscribe immediately is fine.
        //Otherwise it's better to call subscribe when you actually called the service.
    }

    addVoter(eventId: number, session: ISession, voterName: string) {
        session.voters.push(voterName);

        let headers = new Headers({ 'Content-Type': 'applicaton/json' });
        let options = new RequestOptions({ headers: headers });

        let url = `/api/events/${eventId}/sessions/${session.id}/voters/${voterName}`;

        //put is exactly same code with post
        return this.http.post(url, JSON.stringify({}), options)
            .map((res: Response) => {
                return res.json();
            }).catch(this.handleError).subscribe();

    }

    userHasVoted(session: ISession, voterName: string) {
        return session.voters.some(v => v === voterName);
    }

    private handleError(err: Response) {
        return Observable.throw(err.statusText);
    }
}
```

### Login/Logout

user/auth.service.ts

```javascript
import {Injectable} from '@angular/core'
import {IUser} from './user.model'
+ import {Http, Response, Headers, RequestOptions} from '@angular/http'
+ import { Observable } from 'rxjs/Rx'

@Injectable()
export class AuthService {
+    constructor(private http: Http) { }
    currentUser: IUser

+    loginUser(userName: string, password: string) {

        let headers = new Headers({ 'Content-Type': 'applicaton/json' });
        let options = new RequestOptions({ headers: headers });

        let loginInfo = { username: userName, password: password };

        //put is exactly same code with post
        return this.http.post('/api/login', JSON.stringify(loginInfo), options)
            .do((res: Response) => {
                if (res) {
                    this.currentUser = <IUser>res.json().user;
                }
            }).catch(err => {
                return Observable.of(false);
            });

    }

    isAuthenticated() {
        return !!this.currentUser;
    }

    updateCurrentUser(firstName: string, lastName: string) {
+        this.currentUser.firstName = firstName;
        this.currentUser.lastName = lastName;

        let headers = new Headers({ 'Content-Type': 'applicaton/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.put(`/api/users/${this.currentUser.id}`, JSON.stringify(this.currentUser), options);
    }

    //persist user authentication status, call this is app.component.ts
+    checkAuthenticationStatus() {
        return this.http.get('/api/currentIdentity').map((res: any) => {
            if (res._body) {
                return res.json()
            } else {
                return {}
            }
        }).do(currentUser => {
            if (!!currentUser.userName) {
                this.currentUser = currentUser;
            }
        }).subscribe();
    }

+    logout() {
        this.currentUser = undefined;

        let headers = new Headers({ 'Content-Type': 'applicaton/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post('api/logout', JSON.stringify({}), options);
    }
}
```

app.Component.ts: to persist authentication state, a logged in user should not type username/password within 20 min

```javascript
import { Component } from '@angular/core'
import {AuthService} from './user/auth.service'

@Component({
    selector: 'events-app',
    template: `<nav-bar></nav-bar><router-outlet></router-outlet>`
})
export class AppComponent {
    constructor(private auth: AuthService) { }

    ngOnInit() {
        this.auth.checkAuthenticationStatus();
    }
}
```

login.component.ts

```javascript
export class LoginComponent {

    constructor(private authService: AuthService, private router: Router) { }
+    loginInvalid: boolean = false;

+    login(formValues) {
        this.authService.loginUser(formValues.userName, formValues.password)
            .subscribe(res => {
                if (!res) {
                    this.loginInvalid = true;
                }
                else {
                    this.router.navigate(['events']);
                }
            })

    }

    cancel() {
        this.router.navigate(['events'])
    }
}
```

profile.component.ts

```javascript
export class ProfileComponent implements OnInit {
    constructor(private authService: AuthService, private router: Router, @Inject(TOASTR_TOKEN) private toastr: Toastr) { }

+    saveProfile(formValues) {
+        if (this.profileForm.valid) {
+            this.authService.updateCurrentUser(formValues.firstName, formValues.lastName)
+                .subscribe(() => {
+                    this.toastr.success('Profile saved successfully!')
+                });
+            // this.router.navigate(['events'])
+        }
+    }


+    logout(){
+        this.authService.logout().subscribe(()=>{
+            this.router.navigate(['/user/login']);
+        });
+    }
}
```
