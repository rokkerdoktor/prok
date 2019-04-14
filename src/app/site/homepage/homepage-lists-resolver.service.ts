import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {LoadLists} from './state/homepage-state.actions';
import {ToggleGlobalLoader} from '../../state/app-state-actions';

@Injectable({
    providedIn: 'root',
})
export class HomepageListsResolverService implements Resolve<void> {
    constructor(private store: Store) {}

    resolve(route: ActivatedRouteSnapshot): Observable<void> {
        return this.store.dispatch([
            new LoadLists(),
            new ToggleGlobalLoader(true),
        ]);
    }
}
