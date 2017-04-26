import {Component, Input} from '@angular/core'
import {IEvent} from './shared/index'

@Component({
    selector: 'event-thumbnail',
    template: `
        <div [routerLink]="['/events', event.id]" class="well hoverwell thumbnail">
            <h2>Event: {{event?.name | uppercase}}</h2>
            <div>Price: {{event?.price | currency:'USD':true}}</div>
            <div>Date: {{event?.date | date:'shortDate'}}</div>
            <!--<div [class.yellow]="event?.time === '8:00 am'" [ngSwitch]="event?.time">--><!--will add yellow class if true-->
            <!--<div [ngClass]="{yellow:event?.time === '8:00 am',bold:event?.time === '8:00 am'}" [ngSwitch]="event?.time">-->
            <!--<div class="notaffected" [ngClass]="getClasses()" [style.text-decoration]="event?.time === '8:00 am'?'underline':'normal'" [ngSwitch]="event?.time">-->
            <!--<div class="notaffected" [ngClass]="getClasses()" [ngStyle]="{'text-decoration':event?.time === '8:00 am'?'underline':'normal','font-style':'italic'}" [ngSwitch]="event?.time">-->
            <div class="notaffected" [ngClass]="getClasses()" [ngStyle]="getStyles()" [ngSwitch]="event?.time">
                Time: {{event?.time}}
                <span *ngSwitchCase="'8:00 am'">(Early Start)</span>
                <span *ngSwitchCase="'10:00 am'">(Late Start)</span>
                <span *ngSwitchDefault>(Normal Start)</span>
            </div>
            <div *ngIf="event?.location">Address: {{event?.location?.address}}, {{event?.location?.city}}, {{event?.location?.country}}</div>
            <div *ngIf="event?.onlineUrl">Online Url: {{event?.onlineUrl}}</div>
        </div>
    `,
    styles: [`
        .yellow{color:yellow !important;}
        .bold{font-weight:800;}
        .notaffected{font-size:18px;}
        .thumbnail{min-height:210px;}
        .margin-left{margin-left:10px;}
        .well div{color:#bbb;}
    `]
})
export class EventThumbnailComponent {
    @Input() event: IEvent

    //ngClass can accept object, string, array
    getClasses() {
        // const isEarly = this.event && this.event.time === '8:00 am';
        // return { yellow: isEarly, bold: isEarly };

        // if (this.event && this.event.time === '8:00 am')
        //     return 'yellow bold';
        // return '';

        if (this.event && this.event.time === '8:00 am')
            return ['yellow', 'bold']
        return []
    }

    getStyles(): any {
        if (this.event && this.event.time === '8:00 am')
            return { 'text-decoration': 'underline', 'font-style': 'italic' }
        return {}
    }
}
