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
    EventListResolver
} from './events/index'

import { ToastrService } from './common/toastr.service'


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
        {
            provide: 'canDeactivateCreateEvent',
            useValue: checkDirtyState
        },
        EventListResolver
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

//this function can be defined in another file
function checkDirtyState(component: CreateEventComponent) {
    if (component.isDirty) {
        return confirm('you haven\'t save the event. Are you sure to cancel?')
    }
    return true;
}
