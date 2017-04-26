# DI

Check code at: https://github.com/wghglory/angular2-fundamental

### Using Third Party Global Services - The Problem

- Now when we edit profile, change lastname or firstname, save, there is no any user-friendly popup. We want our toastr to do this job.
- Our toastr service uses global variable `declare let toastr: any`, it comes from the index.html `<script src="node_modules/toastr/build/toastr.min.js"></script>`
- We want a way that avoiding using global variable, and we don't want to create a toastrService to wrap up all its apis. jQuery has too many apis, we cannot wrap all apis.

### Using OpaqueToken for DI

1) Update common/toastr.service.ts

```javascript
// import { Injectable } from '@angular/core'
//
// //I guess this local variable was assigned the global toastr variable
// declare let toastr: any
//
// @Injectable()
// export class ToastrService {
//
//     success(message: string, title?: string) {
//         toastr.success(message, title);
//     }
//     info(message: string, title?: string) {
//         toastr.info(message, title);
//     }
//     error(message: string, title?: string) {
//         toastr.error(message, title);
//     }
//     warning(message: string, title?: string) {
//         toastr.warning(message, title);
//     }
//
// }

import { OpaqueToken } from '@angular/core'

export let TOASTR_TOKEN = new OpaqueToken('toastr');

//not necessary if api is large, just for intellisense
export interface Toastr {
    success(message: string, title?: string): void;
    info(message: string, title?: string): void;
    error(message: string, title?: string): void;
    warning(message: string, title?: string): void;
}
```

2) Register it in app.module.ts

```javascript
// import { ToastrService } from './common/toastr.service'
+ import { TOASTR_TOKEN, Toastr } from './common/toastr.service'
+ declare let toastr: Toastr

@NgModule({
    imports: [...],
    declarations: [...],
    providers: [
        EventService,
        // ToastrService,
+        { provide: TOASTR_TOKEN, useValue: toastr },
        EventRouteActivator,
        {
            provide: 'canDeactivateCreateEvent',
            useValue: checkDirtyState
        },
        EventListResolver,
        AuthService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

3) Remove all old ToastService in events-list component

### Using the @Inject Decorator

profile.component.ts:

1) import Inject, TOASTR_TOKEN, Toastr.
2) @Inject(TOASTR_TOKEN) private toastr: Toastr, @Inject is angular DI, Toastr is typescript intellisense (not required)
3) use the service: `this.toastr.success('Profile saved successfully!')`

```javascript
+ import { Component, OnInit, Inject } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { AuthService } from './auth.service'
import { Router } from '@angular/router'

+ import { TOASTR_TOKEN, Toastr } from '../common/toastr.service'

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
+    constructor(private authService: AuthService, private router: Router, @Inject(TOASTR_TOKEN) private toastr: Toastr) { }

    profileForm: FormGroup
    private firstName: FormControl
    private lastName: FormControl

    ngOnInit() {
        this.firstName = new FormControl(this.authService.currentUser.firstName, [Validators.required, Validators.pattern('[a-zA-Z].*')])
        this.lastName = new FormControl(this.authService.currentUser.lastName, Validators.required)

        this.profileForm = new FormGroup({
            firstName: this.firstName,
            lastName: this.lastName
        })
    }

    cancel() {
        this.router.navigate(['events'])
    }

    saveProfile(formValues) {
        if (this.profileForm.valid) {
            this.authService.updateCurrentUser(formValues.firstName, formValues.lastName)
    +        this.toastr.success('Profile saved successfully!')
    -        // this.router.navigate(['events'])
        }
    }

    validateFirstName() {
        return this.firstName.valid || this.firstName.untouched
    }

    validateLastName() {
        return this.lastName.valid || this.lastName.untouched
    }
}
```

### The useClass Provider

in app.module.ts:

Someday we might use `{ provide: logger, useClass: fileLogger }`

```javascript
providers: [
    EventService,
    // ToastrService,
    { provide: TOASTR_TOKEN, useValue: toastr },
    EventRouteActivator, //short hand of { provide: EventRouteActivator, useClass: EventRouteActivator },
    {
        provide: 'canDeactivateCreateEvent',
        useValue: checkDirtyState
    },
    EventListResolver,
    AuthService
],
```

### The useExisting and useFactory Providers (rarely use)

You use Logger service. It's a big api which contains 30 methods, but you are going to use only 5 common methods

```javascript
providers: [
    { provide: MinimalLogger, useExisting: Logger },
    { provide: MinimalLogger, useFactory: Logger },
],
```
