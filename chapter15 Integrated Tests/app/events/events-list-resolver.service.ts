import {Injectable} from '@angular/core'
import {Resolve} from '@angular/router'
import {EventService} from './shared/event.service'

@Injectable()
export class EventListResolver implements Resolve<any>{
    constructor(private eventService: EventService) {

    }

    resolve() {
        // map() return Observable; subscribe() return subscription
        // in resolve, we need to return Observable. angular can watch Observable and see if it finishes
        return this.eventService.getEvents();
    }
}
