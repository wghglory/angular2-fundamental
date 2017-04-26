import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { RouterModule } from '@angular/router'
import { appRoutes } from './routes'

import { AppComponent } from './app.component'
import { NavBarComponent } from './nav/nav.component'
import { Error404Component } from './errors/404.component'

import {
    EventsListComponent,
    EventThumbnailComponent,
    EventDetailComponent,
    CreateEventComponent,
    EventRouteActivator,
    EventService,
    EventListResolver,
    CreateSessionComponent,
    SessionListComponent,
    DurationPipe
} from './events/index'

import { TOASTR_TOKEN, Toastr,
    JQ_TOKEN,
    CollapsibleWellComponent,
    SimpleModal, ModalTriggerDirective
} from './common/index'


import {AuthService} from './user/auth.service'

import {FormsModule, ReactiveFormsModule} from '@angular/forms'

declare let toastr: Toastr;
declare let jQuery: Object;

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(appRoutes),
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        AppComponent,
        NavBarComponent,
        EventsListComponent, EventThumbnailComponent, EventDetailComponent, CreateEventComponent,
        CreateSessionComponent, SessionListComponent,
        Error404Component,
        CollapsibleWellComponent,
        SimpleModal, ModalTriggerDirective,
        DurationPipe
    ],
    providers: [
        EventService,
        // ToastrService,
        { provide: TOASTR_TOKEN, useValue: toastr },
        { provide: JQ_TOKEN, useValue: jQuery },
        EventRouteActivator, //short hand of { provide: EventRouteActivator, useClass: EventRouteActivator },
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

//this function can be defined in another file
function checkDirtyState(component: CreateEventComponent) {
    if (component.isDirty) {
        return confirm(`you haven't save the event. Are you sure to cancel?`)
    }
    return true;
}
