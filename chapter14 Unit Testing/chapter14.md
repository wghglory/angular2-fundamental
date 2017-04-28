# Unit Testing by Jasmine framework and Karma

Check code at: https://github.com/wghglory/angular2-fundamental

`npm install -g karma-cli`

add karma.conf.js and karma-test-shim.js

### Test VoterService and Mock Calls

create events/event-detail/voter.service.spec.ts

```javascript
import { ISession } from '../shared/event.model'
import { VoterService } from './voter.service'
import { Observable } from 'rxjs/Rx'

describe('VoterService', () => {

    let voterService: VoterService,
        mockHttp;

    beforeEach(() => {
        mockHttp = jasmine.createSpyObj('mockHttp', ['delete', 'post']);
        voterService = new VoterService(mockHttp);
    })

    describe('deleteVoter', () => {
        it('should remove the voter from voters list', () => {
            var session = { id: 6, voters: ['joe', 'john'] };
            mockHttp.delete.and.returnValue(Observable.of(false));
            voterService.deleteVoter(3, <ISession>session, 'joe');

            expect(session.voters.length).toBe(1)
            expect(session.voters[0]).toBe('john')
        })

        it('should call http.delete with right url', () => {
            var session = { id: 6, voters: ['joe', 'john'] };
            mockHttp.delete.and.returnValue(Observable.of(false));

            voterService.deleteVoter(3, <ISession>session, 'joe');

            expect(mockHttp.delete).toHaveBeenCalledWith(`/api/events/3/sessions/6/voters/joe`)
        })
    });

    describe('addVoter', () => {
        it('should call http.post with right url', () => {
            var session = { id: 6, voters: ['john'] };
            mockHttp.post.and.returnValue(Observable.of(false));

            voterService.addVoter(3, <ISession>session, 'joe');

            expect(mockHttp.post).toHaveBeenCalledWith(`/api/events/3/sessions/6/voters/joe`, '{}', jasmine.any(Object));
        })
    })

})
```

Run `karma start` and see result

### Testing Components with Isolated Tests

session-list.component.spec.ts

```javascript
import {SessionListComponent} from './session-list.component';
import {ISession} from '../shared/event.model';

describe('SessionListComponent', () => {
    let component: SessionListComponent;
    let mockAuthService, mockVoterService

    beforeEach(() => {
        component = new SessionListComponent(mockAuthService, mockVoterService)
    })

    describe('ngOnChanges', () => {

        it('should filter the sessions correctly', () => {
            component.sessions = <ISession[]>[
                { name: 'session 1', level: 'intermediate' },
                { name: 'session 2', level: 'intermediate' },
                { name: 'session 3', level: 'beginner' },
            ];

            component.filterBy = 'intermediate';
            component.sortBy = 'name';
            component.eventId = 3;

            component.ngOnChanges();

            expect(component.visibleSessions.length).toBe(2)
        });

        it('should sort the sessions correctly', () => {
            component.sessions = <ISession[]>[
                { name: 'session 1', level: 'intermediate' },
                { name: 'session 3', level: 'intermediate' },
                { name: 'session 2', level: 'beginner' },
            ];

            component.filterBy = 'all';
            component.sortBy = 'name';
            component.eventId = 3;

            component.ngOnChanges();

            expect(component.visibleSessions[2].name).toBe('session 3')

        });

    })
})
```
