import {Component, ViewEncapsulation, ChangeDetectionStrategy, Input} from '@angular/core';
import {ListItem} from '../../../lists/types/list-item';
import {Select, Store} from '@ngxs/store';
import {AddToWatchlist, RemoveFromWatchlist} from '../../../lists/user-lists/state/user-lists-state-actions';
import {UserListsState} from '../../../lists/user-lists/state/user-lists-state';
import {Observable} from 'rxjs';

@Component({
    selector: 'title-action-poster-buttons',
    templateUrl: './title-action-poster-buttons.component.html',
    styleUrls: ['./title-action-poster-buttons.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleActionPosterButtonsComponent {
    @Select(UserListsState.loading) loading$: Observable<boolean>;
    @Input() item: ListItem;

    constructor(private store: Store) {}

    public isInWatchlist() {
        const watchlist = this.store.selectSnapshot(UserListsState.watchlist);
        if ( ! watchlist) return false;
        return watchlist.items.findIndex(i => i.id === this.item.id && i.type === this.item.type) > -1;
    }

    public addToWatchlist() {
        this.store.dispatch(new AddToWatchlist(this.item));
    }

    public removeFromWatchlist() {
        this.store.dispatch(new RemoveFromWatchlist(this.item));
    }
}
