//OnInit is like interface which class must implements ngOnInit method
import { Component, OnInit } from '@angular/core'

import {EventService} from './shared/event.service'
import {ToastrService} from '../common/toastr.service'

@Component({
    selector: 'events-list',
    templateUrl: 'app/events/events-list.component.html'   //relative to index.html
})
export class EventsListComponent implements OnInit {
    events: any[]  //any type of array

    constructor(private eventService: EventService, private toastrService: ToastrService) {
    }

    ngOnInit() {
        this.events = this.eventService.getEvents()
    }

    toastrName(data){
        this.toastrService.success(data);
    }
}
