//http://localhost:8808/events/3

import {Component, OnInit} from '@angular/core'
import {EventService} from '../shared/event.service'
import {ActivatedRoute, Params} from '@angular/router'

import {IEvent, ISession} from '../shared/index'


@Component({
    templateUrl: '/app/events/event-detail/event-detail.component.html',
    styles: [`
        .container{padding:0 20px;}
        .event-img{height:100px;}
        a {cursor:pointer;}
    `]
})
export class EventDetailComponent implements OnInit {
    constructor(private eventService: EventService, private route: ActivatedRoute) { }

    event: IEvent
    addMode: boolean = false
    filterBy: string = 'all';
    sortBy: string = 'votes';  //default sortBy votes

    ngOnInit() {
        // //+ convert string to number
        // this.event = this.eventService.getEvent(+this.route.snapshot.params['id'])

        // whenever route params changes, reset all the states
        this.route.params.forEach((params: Params) => {
            this.event = this.eventService.getEvent(+params['id']);
            this.addMode = false;
            this.filterBy = 'all';
            this.sortBy = 'votes';
        });
    }

    addSession() {
        this.addMode = true;
    }

    saveNewSession(session: ISession) {
        //find max id, and newSession id should = id + 1
        // const maxId = Math.max.apply(null, this.event.sessions.map(s => s.id))
        const maxId = Math.max(...this.event.sessions.map(s => s.id))

        session.id = maxId + 1;
        this.event.sessions.push(session)
        this.eventService.updateEvent(this.event)
        this.addMode = false
    }

    cancelAddSession() {
        this.addMode = false
    }
}
