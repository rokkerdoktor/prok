import { Injectable } from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, Router} from '@angular/router';
import {Store} from '@ngxs/store';
import {Observable, of} from 'rxjs';
import {LoadPerson} from './state/person-state-actions';
import {catchError} from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class PersonResolverService implements Resolve<void> {
    constructor(
        private store: Store,
        private router: Router,
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<void> {
        return this.store.dispatch(new LoadPerson()).pipe(catchError(() => {
            this.router.navigateByUrl('/');
            return of(null);
        }));
    }
}
