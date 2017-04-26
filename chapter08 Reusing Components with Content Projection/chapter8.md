# Reusing Components with Content Projection

Check code at: https://github.com/wghglory/angular2-fundamental

### Content Projection

Now in event-detail page, there's a list of sessions for that event. We want to **collapse and expand every session when clicking the session div**. Since this feature is quite common, and probably get reused somewhere else, we need to put this function into common folder.

1) In session-list.component.html

```html
<div class="row" *ngFor="let session of sessions">
    <div class="col-md-10">
        <!-- content projection -->
        <collapsible-well [title]="session.name">
            <h6>{{session.presenter}}</h6>
            <span>Duration: {{session.duration}}</span><br />
            <span>Level: {{session.level}}</span>
            <p>{{session.abstract}}</p>
        </collapsible-well>
        <!-- <div class="well">
            <h4>{{session.name}}</h4>
            <h6>{{session.presenter}}</h6>
            <span>Duration: {{session.duration}}</span><br />
            <span>Level: {{session.level}}</span>
            <p>{{session.abstract}}</p>
        </div> -->
    </div>
</div>
```

2) create common/collapsible-well.component, and register it in module

> Note: <ng-content> is responsible to show html inside its selector "collapsible-well": h6+span+span+p in this case

```javascript
import { Component, Input } from '@angular/core'

@Component({
    selector: 'collapsible-well',
    template: `
        <div (click)="toggleContent()" class="well pointable">
            <h4 class="well-title">{{title}}</h4>
            <ng-content *ngIf="visible"></ng-content>
        </div>
    `
})
export class CollapsibleWellComponent {
    @Input() title: string;
    visible: boolean = true;

    toggleContent() {
        this.visible = !this.visible;
    }
}
```

### Multiple Slot Content Projection

We also want to add a flame icon next to the session title if any session is hot. If we add this feature into collapsible-well template after `<h4 class="well-title">{{title}}</h4>`, this component is not generic.

session-list.component.html:

well-title and well-body attributes can be used as selectors in collapsible-well.component template. Attribute is better than class since it won't give us any conflict for a css class.

```html
<div class="row" *ngFor="let session of sessions">
    <div class="col-md-10">

        <!-- multi slot content projection -->
        <collapsible-well>
            <div well-title>
                {{session.name}}
                <i *ngIf="session.voters.length>3" class="glyphicon glyphicon-fire" style="color:red;"></i>
            </div>

            <div well-body>
                <h6>{{session.presenter}}</h6>
                <span>Duration: {{session.duration}}</span><br />
                <span>Level: {{session.level}}</span>
                <p>{{session.abstract}}</p>
            </div>
        </collapsible-well>

        <!-- content projection -->
        <!-- <collapsible-well [title]="session.name">
            <h6>{{session.presenter}}</h6>
            <span>Duration: {{session.duration}}</span><br />
            <span>Level: {{session.level}}</span>
            <p>{{session.abstract}}</p>
        </collapsible-well> -->

        <!-- <div class="well">
            <h4>{{session.name}}</h4>
            <h6>{{session.presenter}}</h6>
            <span>Duration: {{session.duration}}</span><br />
            <span>Level: {{session.level}}</span>
            <p>{{session.abstract}}</p>
        </div> -->
    </div>
</div>
```

collapsible-well.component.ts updates template:

> Note: ng-content with select is used to display the html. "select" can have id selector, class selector, etc. Attribute selector is best for multiple slot content projection

```javascript
import { Component, Input } from '@angular/core'

@Component({
    selector: 'collapsible-well',
    template: `
        <div (click)="toggleContent()" class="well pointable">
            <h4>
                <ng-content select="[well-title]"></ng-content>
            </h4>
            <ng-content *ngIf="visible" select="[well-body]"></ng-content>
        </div>
    `
})
export class CollapsibleWellComponent {
    @Input() title: string;
    visible: boolean = true;

    toggleContent() {
        this.visible = !this.visible;
    }
}
```
