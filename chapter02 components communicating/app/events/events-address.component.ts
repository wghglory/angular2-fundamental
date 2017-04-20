//child component, talk with parent events-list.component.ts
import {Component, Input, Output, EventEmitter} from '@angular/core'

@Component({
    selector: 'events-address',
    template: `
        <div>Address: {{address.address}},{{address.city}},{{address.country}}</div>
        <button (click)="buttonClick()" class="btn-primary btn mybutton">Test output, EventEmitter</button>
    `,
    styles:[
        `.mybutton{background:purple;}`
    ]
})
export class EventsAddressComponent {
    @Input() address: any  //define address object, parent pass value to child

    @Output() myclick = new EventEmitter()
    buttonClick() {
        this.myclick.emit('I am from child component, should pass data to parent component')
    }

    //use template variable to interact with child public method/property: parent accesses child data
    author:string = 'Guanghui Wang'  //child public property
    getAuthor(){
        alert(this.author)
    }
}
