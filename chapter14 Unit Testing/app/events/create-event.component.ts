//click cancel will use router to navigate to /events (load all events)
import {Component} from '@angular/core'
import {Router} from '@angular/router'
import {EventService} from './shared/event.service'

@Component({
    templateUrl: 'app/events/create-event.component.html',
    styles: [
        `
        em {float:right;color:#e05c65;padding-left:10px;}
        .error input{background-color:#e3c3c5;}
        .error ::-webkit-input-placeholder {color:#999;}
        .error ::-moz-placeholder {color:#999;}
        .error :-ms-input-placeholder {color:#999;}
        `
    ]
})
export class CreateEventComponent {
    isDirty: boolean = true

    constructor(private router: Router, private eventService: EventService) { }

    cancel() {
        this.router.navigate(['/events'])
    }

    saveEvent(formValues) {
        this.eventService.saveEvent(formValues).subscribe(e => {
            this.isDirty = false
            this.router.navigate(['/events'])
        });
    }
}
