import {Injectable} from '@angular/core'
import {IUser} from './user.model'
import {Http, Response, Headers, RequestOptions} from '@angular/http'
import { Observable } from 'rxjs/Rx'

@Injectable()
export class AuthService {

    constructor(private http: Http) { }
    currentUser: IUser

    loginUser(userName: string, password: string) {

        let headers = new Headers({ 'Content-Type': 'applicaton/json' });
        let options = new RequestOptions({ headers: headers });

        let loginInfo = { username: userName, password: password };

        //put is exactly same code with post
        return this.http.post('/api/login', JSON.stringify(loginInfo), options)
            .do((res: Response) => {
                if (res) {
                    this.currentUser = <IUser>res.json().user;
                }
            }).catch(err => {
                return Observable.of(false);
            });

    }

    isAuthenticated() {
        return !!this.currentUser;
    }

    updateCurrentUser(firstName: string, lastName: string) {
        this.currentUser.firstName = firstName;
        this.currentUser.lastName = lastName;

        let headers = new Headers({ 'Content-Type': 'applicaton/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.put(`/api/users/${this.currentUser.id}`, JSON.stringify(this.currentUser), options);
    }

    //persist user authentication status, call this is app.component.ts
    checkAuthenticationStatus() {
        return this.http.get('/api/currentIdentity').map((res: any) => {
            if (res._body) {
                return res.json()
            } else {
                return {}
            }
        }).do(currentUser => {
            if (!!currentUser.userName) {
                this.currentUser = currentUser;
            }
        }).subscribe();
    }

    logout() {
        this.currentUser = undefined;

        let headers = new Headers({ 'Content-Type': 'applicaton/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post('api/logout', JSON.stringify({}), options);
    }
}
