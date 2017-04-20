import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
import { EventsListComponent } from './events/events-list.component'
import { EventThumbnailComponent } from './events/event-thumbnail.component'
import { NavBarComponent } from './nav/nav.component'

import { EventService } from './events/shared/event.service'
import { ToastrService } from './common/toastr.service'

@NgModule({
    imports: [BrowserModule],
    declarations: [AppComponent, EventsListComponent, EventThumbnailComponent, NavBarComponent],
    providers: [EventService, ToastrService],
    bootstrap: [AppComponent]
})
export class AppModule { }
