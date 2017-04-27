import {Routes} from '@angular/router'

import {
    EventsListComponent,
    EventDetailComponent,
    CreateEventComponent,
    CreateSessionComponent,
    EventListResolver, EventResolver
} from './events/index'


import {Error404Component} from './errors/404.component'

export const appRoutes: Routes = [
    //order matters
    { path: 'events/new', component: CreateEventComponent, canDeactivate: ['canDeactivateCreateEvent'] }, //Guarding Against Route De-activation using function, canDeactivateCreateEvent is provider name which points to a function
    { path: 'events', component: EventsListComponent, resolve: { events1: EventListResolver } }, //call EventListResolver before using the component, bind resolver result to a property events1, and this property will be passed to the component
    { path: 'events/:id', component: EventDetailComponent, resolve: { event: EventResolver } }, //Guarding Against Route Activation using service
    { path: 'events/session/new', component: CreateSessionComponent },
    { path: '404', component: Error404Component },
    { path: '', redirectTo: '/events', pathMatch: 'full' },  //pathMatch: prefix or full

    // user prefix, localhost/user/x, will load module here: app/user/user.module and the module name is UserModule, concat '#'
    { path: 'user', loadChildren: 'app/user/user.module#UserModule' }
]
