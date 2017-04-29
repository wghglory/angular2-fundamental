import './rxjs-extensions';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { appRoutes } from './routes';

import {HttpModule} from '@angular/http';

import { AppComponent } from './app.component';
import { Error404Component } from './errors/404.component';
import { NavBarComponent } from './nav/nav.component';

import {
    CreateEventComponent,
    CreateSessionComponent,
    DurationPipe,
    EventDetailComponent,
    EventListResolver,
    EventResolver,
    EventService,
    EventsListComponent,
    EventThumbnailComponent,
    LocationValidator,
    SessionListComponent,
    UpvoteComponent,
    VoterService,
} from './events/index';

import { CollapsibleWellComponent, JQ_TOKEN,
    ModalTriggerDirective,
    SimpleModal,
    Toastr, TOASTR_TOKEN,
} from './common/index';

import {AuthService} from './user/auth.service';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';

declare let toastr: Toastr;
declare let jQuery: Object;

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(appRoutes),
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
    ],
    declarations: [
        AppComponent,
        NavBarComponent,
        EventsListComponent, EventThumbnailComponent, EventDetailComponent, CreateEventComponent,
        CreateSessionComponent, SessionListComponent,
        Error404Component,
        CollapsibleWellComponent,
        SimpleModal, ModalTriggerDirective,
        DurationPipe,
        UpvoteComponent,
        LocationValidator,
    ],
    providers: [
        EventService,
        // ToastrService,
        { provide: TOASTR_TOKEN, useValue: toastr },
        { provide: JQ_TOKEN, useValue: jQuery },
        {
            provide: 'canDeactivateCreateEvent',
            useValue: checkDirtyState,
        },
        EventResolver,
        EventListResolver,
        AuthService,
        VoterService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }

// this function can be defined in another file
function checkDirtyState(component: CreateEventComponent) {
    if (component.isDirty) {
        return confirm(`you haven't save the event. Are you sure to cancel?`);
    }
    return true;
}
