import { Component, Input, OnChanges } from '@angular/core'
import { ISession } from '../shared/index'

@Component({
    selector: 'session-list',
    templateUrl: 'app/events/event-detail/session-list.component.html'
})
export class SessionListComponent implements OnChanges {
    @Input() sessions: ISession[]
    @Input() filterBy: string
    visibleSessions: ISession[] = [];
    @Input() sortBy: string

    //whenever the input variable changes
    ngOnChanges() {
        if (this.sessions) {
            this.filterSessions(this.filterBy);
            this.sortBy === 'name' ? this.visibleSessions.sort(sortByNameAsc) : this.visibleSessions.sort(sortByVotesDesc)
        }
    }

    filterSessions(filter) {
        if (filter === 'all') {
            // this.visibleSessions = this.sessions;  //wrong, we want to make a copy
            this.visibleSessions = this.sessions.slice(0);  //clone the arr
        } else {
            this.visibleSessions = this.sessions.filter(s => {
                return s.level.toLocaleLowerCase() == filter;
            })
        }
    }
}

function sortByNameAsc(s1: ISession, s2: ISession) {
    if (s1.name > s2.name) return 1;
    else if (s1.name === s2.name) return 0;
    else return -1;
}

function sortByVotesDesc(s1: ISession, s2: ISession) {
    return (s2.voters.length - s1.voters.length);
}
