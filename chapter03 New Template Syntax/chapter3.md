# Exploring the New Template Syntax

Check code at: https://github.com/wghglory/angular2-fundamental

### *ngFor

events-list.Component has events array: [event] is child component object name

```javascript
import { Component } from '@angular/core'

@Component({
    selector: 'events-list',
    template: `<div>
                    <h1>Upcoming Angular 2 Events</h1>
                    <div class="row">
                        <div class="col-md-5" *ngFor="let e of events">
                            <event-thumbnail [event]="e"></event-thumbnail>
                        </div>
                    </div>
                </div>
    `
})
export class EventsListComponent {
    events = [
        {
            id: 1,
            name: 'Angular Connect',
            date: '9/26/2036',
            time: '10:00 am',
            price: 599.99,
            imageUrl: '/app/assets/images/angularconnect-shield.png',
            location: {
                address: '1057 DT',
                city: 'London',
                country: 'England'
            }
        },
        ...
    ]
}
```

event-thumbnail.component:

> Note: event? will not throw err if event is null
>
> `event?.location.address` doesn't need `location?`, `event?` is good enough
>

```javascript
import {Component, Input} from '@angular/core'

@Component({
    selector: 'event-thumbnail',
    template: `
        <div class="well hoverwell thumbnail">
            <h2>Event: {{event?.name}}</h2>
            <div>Price: \${{event?.price}}</div>
            <div>Date: {{event?.date}}</div>
            <div>Time: {{event?.time}}</div>
            <div>Address: {{event?.location.address}}, {{event?.location.city}}, {{event?.location.country}}</div>
        </div>
    `,
    styles: [`
        .thumbnail{min-height:210px;}
        .margin-left{margin-left:10px;}
        .well div{color:#bbb;}
    `]
})
export class EventThumbnailComponent {
    @Input() event: any
}
```

### *ngIf -- will comment out the dom, performance factor

> if we know each event is not null, but some of them has location property, some don't but have onlineUrl property, in this case, we should use `event.location?.address`

if events array has 2 element, first has location but not onlineUrl, second has onlineUrl but not location.

```javascript
import {Component, Input} from '@angular/core'

@Component({
    selector: 'event-thumbnail',
    template: `
        <div class="well hoverwell thumbnail">
            <h2>Event: {{event?.name}}</h2>
            <div>Price: \${{event?.price}}</div>
            <div>Date: {{event?.date}}</div>
            <div>Time: {{event?.time}}</div>
            <div *ngIf="event?.location">Address: {{event?.location?.address}}, {{event?.location?.city}}, {{event?.location?.country}}</div>
            <div *ngIf="event?.onlineUrl">Online Url: {{event?.onlineUrl}}</div>
        </div>
    `,
    styles: [`
        .thumbnail{min-height:210px;}
        .margin-left{margin-left:10px;}
        .well div{color:#bbb;}
    `]
})
export class EventThumbnailComponent {
    @Input() event: any
}
```

### [hidden]

the above *ngIf code can be replaced by [hidden], but ngif performance is better than hidden in this case:

```html
<div [hidden]="!event?.location">Address: {{event?.location?.address}}, {{event?.location?.city}}, {{event?.location?.country}}</div>
<div [hidden]="!event?.onlineUrl">Online Url: {{event?.onlineUrl}}</div>
```

> when you don't want to render a heavy DOM element, use *ngIf, so element comments out
> when the element frequently shows/hides, use [hidden], so element style display none

### [ngSwtich]

```javascript
@Component({
    selector: 'event-thumbnail',
    template: `
            <div [ngSwitch]="event?.time">
                Time: {{event?.time}}
                <span *ngSwitchCase="'8:00 am'">(Early Start)</span>
                <span *ngSwitchCase="'10:00 am'">(Late Start)</span>
                <span *ngSwitchDefault>(Normal Start)</span>
            </div>
    `
})
```

### [ngClass]

1) will add yellow class if `event?.time === '8:00 am'`

```javascript
@Component({
    selector: 'event-thumbnail',
    template: `
            <div [class.yellow]="event?.time === '8:00 am'">
                Time: {{event?.time}}
            </div>
    `,
    styles: [`
        .yellow{color:yellow !important;}
    `]
})
```

2) what if we need to add 2 classes? use ngClass

```javascript
@Component({
    selector: 'event-thumbnail',
    template: `
            <div [ngClass]="{yellow:event?.time === '8:00 am',bold:event?.time === '8:00 am'}">
                Time: {{event?.time}}
            </div>
    `,
    styles: [`
        .yellow{color:yellow !important;}
        .bold{font-weight:800;}
    `]
})
```

3) use function after ngClass

- ngClass won't affect native class
- ngClass can take string, array, object

```javascript
@Component({
    template: `
            <div class="notaffected" [ngClass]="getClasses()">
                Time: {{event?.time}}
            </div>
    `,
    styles: [`
        .yellow{color:yellow !important;}
        .bold{font-weight:800;}
        .notaffected{font-size:18px;}
    `]
})
export class EventThumbnailComponent {
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
}
```

### [ngStyle]

1) only 1 style: use [style.property]=""

```html
<div [style.text-decoration]="event?.time === '8:00 am'?'underline':'normal'">
```

2) multiple styles by ngStyle

```javascript
import {Component, Input} from '@angular/core'

@Component({
    selector: 'event-thumbnail',
    template: `
            <!--<div [ngStyle]="{'text-decoration':event?.time === '8:00 am'?'underline':'normal','font-style':'italic'}" -->
            <div [ngStyle]="getStyles()">
                Time: {{event?.time}}
            </div>
    `
})
export class EventThumbnailComponent {
    getStyles(): any {
        if (this.event && this.event.time === '8:00 am')
            return { 'text-decoration': 'underline', 'font-style': 'italic' }
        return {}
    }
}
```
