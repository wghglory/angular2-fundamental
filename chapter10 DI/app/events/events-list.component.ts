//OnInit is like interface which class must implements ngOnInit method
import { Component, OnInit } from '@angular/core'

import {EventService} from './shared/event.service'

import {ActivatedRoute} from '@angular/router'

import {IEvent} from './shared/index'


@Component({
    //selector: 'events-list',  //not needed since we are using route
    templateUrl: 'app/events/events-list.component.html'   //relative to index.html
})
export class EventsListComponent implements OnInit {
    events: IEvent[]

    constructor(private eventService: EventService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        // // this.events = this.eventService.getEvents()
        // this.eventService.getEvents().subscribe(events => { this.events = events })  //since we are using resolver
        this.events = this.route.snapshot.data['events1'];
    }

}
