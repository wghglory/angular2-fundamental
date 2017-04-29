import { Injectable } from '@angular/core';
import { ISession } from '../shared/event.model';

import {Headers, Http, RequestOptions, Response} from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class VoterService {

    constructor(private http: Http) { }

    deleteVoter(eventId: number, session: ISession, voterName: string) {
        session.voters = session.voters.filter((v) => v !== voterName);
        const url = `/api/events/${eventId}/sessions/${session.id}/voters/${voterName}`;
        return this.http.delete(url).catch(this.handleError).subscribe();
        //when we don't care the returning result, use subscribe immediately is fine.
        //Otherwise it's better to call subscribe when you actually called the service.
    }

    addVoter(eventId: number, session: ISession, voterName: string) {
        session.voters.push(voterName);

        const headers = new Headers({ 'Content-Type': 'applicaton/json' });
        const options = new RequestOptions({ headers });

        const url = `/api/events/${eventId}/sessions/${session.id}/voters/${voterName}`;

        //put is exactly same code with post
        return this.http.post(url, JSON.stringify({}), options)
            .catch(this.handleError).subscribe();

    }

    userHasVoted(session: ISession, voterName: string) {
        return session.voters.some((v) => v === voterName);
    }

    private handleError(err: Response) {
        return Observable.throw(err.statusText);
    }
}
