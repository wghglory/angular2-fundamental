import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
    selector: 'upvote',
    template: `
    <div class="votingWidgetContainer pointable" (click)="onClick()">
        <div class="well votingWidget">
            <div class="votingButton">
                <i [style.color]="iconColor" class="glyphicon glyphicon-heart"></i>
                <!--
                    <i *ngIf="voted" class="glyphicon glyphicon-heart"></i>
                    <i *ngIf="!voted" class="glyphicon glyphicon-heart-empty"></i>
                -->
            </div>
            <div class="badge badge-inverse votingCount">
                <div>{{count}}</div>
            </div>
        </div>
    </div>`,
    styleUrls: ['/app/events/event-detail/upvote.component.css']
})
export class UpvoteComponent {
    @Input() count: number;
    iconColor: string;
    @Input() set voted(val) {
        this.iconColor = val ? 'red' : 'white';
    }
    @Output() vote = new EventEmitter();


    onClick() {
        this.vote.emit({});
    }
}
