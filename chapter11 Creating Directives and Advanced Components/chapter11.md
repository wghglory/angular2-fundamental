# Create Directives and Advanced Component

Check code at: https://github.com/wghglory/angular2-fundamental

## Implementing the Session Search

Todo: implement logic for search session textbox, click search, modal window pops up showing sessions

nav.component.html

```html
+ <form (ngSubmit)="searchSessions(searchTerm)" id="searchForm" class="navbar-form navbar-right">
    <div class="form-group">
+        <input [(ngModel)]="searchTerm" name="searchTerm" type="text" class="form-control" placeholder="Search Sessions">
    </div>
    <button class="btn btn-default">Search</button>
</form>
```

event.service.ts add searchSessions function

```javascript
searchSessions(searchTerm: string) {
    var term = searchTerm.toLocaleLowerCase();
    var result: ISession[] = [];

    EVENTS.forEach(e => {
        var matchingSessions = e.sessions.filter(s => {
            return s.name.toLocaleLowerCase().indexOf(term) > -1;
        });
        //we also want to add event id to all filtered sessions
        matchingSessions = matchingSessions.map((session: any) => {
            session.eventId = e.id;
            return session;
        });
        result.push(...matchingSessions);
        // result = result.concat(matchingSessions);
    });

    var emitter = new EventEmitter(true); //async
    setTimeout(() => {
        emitter.emit(result);
    }, 100);

    return emitter;
}
```

nav.component.html

```javascript
import {ISession} from '../events/shared/event.model'
import {EventService} from '../events/shared/event.service'

export class NavBarComponent {
+    constructor(private authService: AuthService, private eventService: EventService) { }

+    searchTerm: string = "";
+    foundSessions: ISession[];

+    searchSessions(searchTerm) {
+        this.eventService.searchSessions(searchTerm)
+            .subscribe(sessions => {
+                this.foundSessions = sessions;
+                console.log(this.foundSessions)
+            });
+    }
}
```

Now if you search "pipe", there should be one matching session in your console.

### Adding jQuery

create common/jQuery.service.ts and create common index barrel.

```javascript
import { OpaqueToken } from '@angular/core'

export let JQ_TOKEN = new OpaqueToken('jQuery');
```

register in app.module.ts

```javascript
import { TOASTR_TOKEN, Toastr,
    JQ_TOKEN,
    CollapsibleWellComponent
} from './common/index'

declare let toastr: Toastr;
declare let jQuery: Object;

providers: [
    { provide: JQ_TOKEN, useValue: jQuery },
],
```

### Creating a Modal Component

<img src="http://om1o84p1p.bkt.clouddn.com//1493243877.png"  />

1) create common/simpleModal.component.ts. Add it to barrel and register in app.module.ts

```javascript
import {Component, Input} from '@angular/core'

@Component({
    selector: 'simple-modal',
    template: `
        <div id="simple-modal" class="modal fade" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">
                            <span>&times;</span>
                        </button>
                        <h4 class="modal-title">{{title}}</h4>
                    </div>
                    <div class="modal-body">
                        <ng-content></ng-content>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
        .modal-body {height:250px;overflow-y:scroll;}
        `
    ]
})
export class SimpleModal {
    @Input() title: string
}
```

2) nav.component.html add below at bottom

```html
<form (ngSubmit)="searchSessions(searchTerm)" id="searchForm" class="navbar-form navbar-right">
    <div class="form-group">
        <input [(ngModel)]="searchTerm" name="searchTerm" type="text" class="form-control" placeholder="Search Sessions">
    </div>
+    <button class="btn btn-default" modal-trigger>Search</button>
</form>

<!-- content projection for modal window when clicking search -->
<simple-modal title="Matching Sessions">
    <div class="list-group">
        <a class="list-group-item" *ngFor="let session of foundSessions" [routerLink]="['/events', session.eventId]">{{session.name}}</a>
    </div>
</simple-modal>
```

### Creating Directives - The Trigger Directive

I don't want bind a click event on the search button and write the function with something like $('#id').modal() in nav.component.ts because this will tightly bind modal openup functions with nav.component. Modal feature should be independent on the nav.component. We want to hide the concrete implements, a good way is directive!

create common/modalTrigger.directive.ts

```javascript
import { Directive, OnInit, Inject, ElementRef } from '@angular/core'
import {JQ_TOKEN} from './jQuery.service'

@Directive({
    selector: '[modal-trigger]'  //attribute selector
})
export class ModalTriggerDirective implements OnInit {
    private el: HTMLElement;

    constructor(ref: ElementRef, @Inject(JQ_TOKEN) private $: any) {
        this.el = ref.nativeElement;
    }

    ngOnInit() {
        this.el.addEventListener('click', e => {
            this.$('#simple-modal').modal({})
        });
    }
}
```

Add it to barrel and register Directive in app.module.ts's declarations

```javascript
import { TOASTR_TOKEN, Toastr,
    JQ_TOKEN,
    CollapsibleWellComponent,
+    SimpleModal, ModalTriggerDirective
} from './common/index'

declare let toastr: Toastr;
declare let jQuery: Object;

@NgModule({
    declarations: [
        CollapsibleWellComponent,
+        SimpleModal, ModalTriggerDirective,
        DurationPipe
    ]})
```

### Binding an ID

issue: we may have many modal windows for different purpose, so we need to pass id dynamically

current common/modalTrigger.directive.ts

```javascript
import { Directive, OnInit, Inject, ElementRef } from '@angular/core'
import {JQ_TOKEN} from './jQuery.service'

@Directive({
    selector: '[modal-trigger]'  //attribute selector
})
export class ModalTriggerDirective implements OnInit {
    private el: HTMLElement;

    constructor(ref: ElementRef, @Inject(JQ_TOKEN) private $: any) {
        this.el = ref.nativeElement;
    }

    ngOnInit() {
        this.el.addEventListener('click', e => {
            this.$('#simple-modal').modal({})  // bad because we hardcode the id
        });
    }
}
```

So we add `elementId="searchResult"` in nav.component. Note modal-trigger value and elementId value are same! So I can tell which button triggers which modal.

```html
+ <button class="btn btn-default" modal-trigger="searchResult">Search</button>

<!-- content projection for modal window when clicking search -->
+ <simple-modal title="Matching Sessions" elementId="searchResult">
    <div class="list-group">
        <a class="list-group-item" *ngFor="let session of foundSessions" [routerLink]="['/events', session.eventId]">{{session.name}}</a>
    </div>
</simple-modal>
```

SimpleModal.component.ts, we pass the elementId:

```javascript
import {Component, Input} from '@angular/core'

@Component({
    selector: 'simple-modal',
    template: `
+        <div id="{{elementId}}" class="modal fade" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">
                            <span>&times;</span>
                        </button>
                        <h4 class="modal-title">{{title}}</h4>
                    </div>
                    <div class="modal-body">
                        <ng-content></ng-content>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
        .modal-body {height:250px;overflow-y:scroll;}
        `
    ]
})
export class SimpleModal {
    @Input() title: string;
+    @Input() elementId: string;
}
```

ModalTriggerDirective

```javascript
import { Directive, OnInit, Inject, ElementRef, Input } from '@angular/core'
import {JQ_TOKEN} from './jQuery.service'

@Directive({
    selector: '[modal-trigger]'  //attribute selector
})
export class ModalTriggerDirective implements OnInit {
    private el: HTMLElement;
    // @Input() modal-trigger: string  I want to write like this but typescript cannot compile dash...So use alias
+    @Input('modal-trigger') modalId: string;

    constructor(ref: ElementRef, @Inject(JQ_TOKEN) private $: any) {
        this.el = ref.nativeElement;
    }

    ngOnInit() {
        this.el.addEventListener('click', e => {
            // issue: we may have many modal windows for different purpose, so need to pass id dynamically
            // this.$('#simple-modal').modal({})

+            this.$('#${this.modalId}').modal({});
        });
    }
}
```

### Routing to the Same Component

Current event-detail page has a bug: when clicking any item in modal window, the url does change, but page doesn't navigate to the right url...

event-detail.Component.ts

snapshot.params is good for the first time to load the page. We need use observable

```javascript
+ import {ActivatedRoute, Params} from '@angular/router'

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
-        // //+ convert string to number
-        // this.event = this.eventService.getEvent(+this.route.snapshot.params['id'])

+        // whenever route params changes, reset all the states
+        this.route.params.forEach((params: Params) => {
+            this.event = this.eventService.getEvent(+params['id']);
+            this.addMode = false;
+            this.filterBy = 'all';
+            this.sortBy = 'votes';
+        });
    }
}
```

### Using the @ViewChild Decorator

We want to close the modal when clicking any item

simpleModal.component.ts

```javascript
+ import {Component, Input, ViewChild, ElementRef, Inject} from '@angular/core'
+ import {JQ_TOKEN} from './jQuery.service'

@Component({
    selector: 'simple-modal',
    template: `
+        <div id="{{elementId}}" #modalcontainer class="modal fade" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">
                            <span>&times;</span>
                        </button>
                        <h4 class="modal-title">{{title}}</h4>
                    </div>
                    <div class="modal-body" (click)="closeModal()">
                        <ng-content></ng-content>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
        .modal-body {height:250px;overflow-y:scroll;}
        `
    ]
})
export class SimpleModal {
    @Input() title: string;
    @Input() elementId: string;
+    @ViewChild('modalcontainer') containerEl: ElementRef;

+    constructor( @Inject(JQ_TOKEN) private $: any) { }

+    closeModal() {
+        this.$(this.containerEl.nativeElement).modal('hide');  // we can still use previous way like modalTrigger.directive.ts
+    }
}
```

### Creating Settings on Components

For some modal windows, we may want to close modal when clicking body while others don't. So we create settings for this purpose.

nav.component.html add `closeOnBodyClick="true"`

```html
+ <simple-modal closeOnBodyClick="true" title="Matching Sessions" elementId="searchResult">
    <div class="list-group">
        <a class="list-group-item" *ngFor="let session of foundSessions" [routerLink]="['/events', session.eventId]">{{session.name}}</a>
    </div>
</simple-modal>
```

SimpleModal.component.ts

```javascript
import {Component, Input, ViewChild, ElementRef, Inject} from '@angular/core'
import {JQ_TOKEN} from './jQuery.service'

@Component({
    selector: 'simple-modal',
    template: `
        <div id="{{elementId}}" #modalcontainer class="modal fade" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">
                            <span>&times;</span>
                        </button>
                        <h4 class="modal-title">{{title}}</h4>
                    </div>
                    <div class="modal-body" (click)="closeModal()">
                        <ng-content></ng-content>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
        .modal-body {height:250px;overflow-y:scroll;}
        `
    ]
})
export class SimpleModal {
    @Input() title: string;
    @Input() elementId: string;
    @ViewChild('modalcontainer') containerEl: ElementRef;
+    @Input() closeOnBodyClick: string;

    constructor( @Inject(JQ_TOKEN) private $: any) { }

    closeModal() {
+        if (this.closeOnBodyClick.toLocaleLowerCase() === 'true') {
            this.$(this.containerEl.nativeElement).modal('hide');  // we can still use previous way like modalTrigger.directive.ts
+        }
    }
}
```
