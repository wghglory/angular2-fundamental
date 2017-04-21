//click cancel will use router to navigate to /events (load all events)
import {Component} from '@angular/core'
import {Router} from '@angular/router'

@Component({
    template: `
    <h1>New Event</h1>
    <div class="col-md-6">
        <h3>[Create Event Form will go here]</h3>
        <button type="submit" class="btn btn-primary">Save</button>
        <button type="button" class="btn btn-default" (click)="cancel()">Cancel</button>
    </div>
    `
})
export class CreateEventComponent {
    isDirty: boolean = true

    constructor(private router: Router) { }

    cancel() {
        this.router.navigate(['/events'])
    }
}
