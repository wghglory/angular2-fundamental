import { Injectable } from '@angular/core'
import { ISession } from '../shared/event.model'

import {Http, Response, Headers, RequestOptions} from '@angular/http'
import { Observable } from 'rxjs/Rx'

@Injectable()
export class VoterService {

    constructor(private http: Http) { }

    deleteVoter(eventId: number, session: ISession, voterName: string) {
        session.voters = session.voters.filter(v => v !== voterName);
        let url = `/api/events/${eventId}/sessions/${session.id}/voters/${voterName}`;
        return this.http.delete(url).catch(this.handleError).subscribe();
        //when we don't care the returning result, use subscribe immediately is fine.
        //Otherwise it's better to call subscribe when you actually called the service.
    }

    addVoter(eventId: number, session: ISession, voterName: string) {
        session.voters.push(voterName);

        let headers = new Headers({ 'Content-Type': 'applicaton/json' });
        let options = new RequestOptions({ headers: headers });

        let url = `/api/events/${eventId}/sessions/${session.id}/voters/${voterName}`;

        //put is exactly same code with post
        return this.http.post(url, JSON.stringify({}), options)
            .map((res: Response) => {
                return res.json();
            }).catch(this.handleError).subscribe();

    }

    userHasVoted(session: ISession, voterName: string) {
        return session.voters.some(v => v === voterName);
    }

    private handleError(err: Response) {
        return Observable.throw(err.statusText);
    }
}
