//parent Component
import { Component } from '@angular/core'

@Component({
    selector: 'events-list',
    // template: `
    // <div>
    //     <h1>Upcoming Angular 2 Events</h1>
    //     <div class="well hoverwell thumbnail">
    //         <h2>Event: {{event.name}}</h2>
    //         <div>Price: \${{event.price}}</div>
    //         <div>Date: {{event.date}}</div>
    //         <div>Time: {{event.time}}</div>
    //         <div>Address: {{event.location.address}}, {{event.location.city}}, {{event.location.country}}</div>
    //     </div>
    // </div>
    // `
    templateUrl: 'app/events/events-list.component.html'   //relative to index.html
})
export class EventsListComponent {
    event = {
        name: 'ngConf 2025',
        date: '3/1/2025',
        time: '8am',
        price: '599',
        location: { address: '123 Main St', city: 'Salt Lake City, UT', country: 'USA' }
    }

    clickWithAnyName(dataFromChild){
        alert(dataFromChild)
    }
}
