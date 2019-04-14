import { Injectable } from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, Router} from '@angular/router';
import {LoadTitle} from './state/title-actions';
import {Store} from '@ngxs/store';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class TitleResolverService implements Resolve<void> {
    constructor(
        private store: Store,
        private router: Router,
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<void> {
        const params = {...route.params};
        if (route.data.fullCredits) params.fullCredits = true;
        return this.store.dispatch(new LoadTitle(params.titleId, params)).pipe(catchError(() => {
            this.router.navigateByUrl('/');
            return of(null);
        }));
    }
}
