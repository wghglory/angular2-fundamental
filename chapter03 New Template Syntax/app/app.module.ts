import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
import { EventsListComponent } from './events/events-list.component'
import { EventThumbnailComponent } from './events/event-thumbnail.component'
import { NavBarComponent } from './nav/nav.component'

@NgModule({
    imports: [BrowserModule],
    declarations: [AppComponent, EventsListComponent, EventThumbnailComponent, NavBarComponent],
    bootstrap: [AppComponent]
})
export class AppModule {}
