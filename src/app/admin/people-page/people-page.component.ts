import {Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ViewChild, OnDestroy} from '@angular/core';
import {MatSort} from '@angular/material';
import {PaginatedDataTableSource} from '../../../common/admin/data-table/data/paginated-data-table-source';
import {UrlAwarePaginator} from '../../../common/admin/pagination/url-aware-paginator.service';
import {Modal} from '../../../common/core/ui/dialogs/modal.service';
import {CurrentUser} from '../../../common/auth/current-user';
import {Settings} from '../../../common/core/config/settings.service';
import {TitleUrlsService} from '../../site/titles/title-urls.service';
import {ConfirmModalComponent} from '../../../common/core/ui/confirm-modal/confirm-modal.component';
import {Person} from '../../models/person';
import {PeopleService} from '../../site/people/people.service';
import {ImportMediaModalComponent} from '../../site/shared/import-media-modal/import-media-modal.component';
import {MEDIA_TYPE} from '../../site/media-type';
import {Router} from '@angular/router';

@Component({
    selector: 'people-page',
    templateUrl: './people-page.component.html',
    styleUrls: ['./people-page.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeoplePageComponent implements OnInit, OnDestroy {
    @ViewChild(MatSort) matSort: MatSort;
    public dataSource: PaginatedDataTableSource<Person>;

    constructor(
        public paginator: UrlAwarePaginator,
        private people: PeopleService,
        private modal: Modal,
        public currentUser: CurrentUser,
        public settings: Settings,
        public urls: TitleUrlsService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.dataSource = new PaginatedDataTableSource<Person>({
            uri: 'people',
            dataPaginator: this.paginator,
            matSort: this.matSort,
            staticParams: {
                order_by: 'popularity'
            }
        });
    }

    ngOnDestroy() {
        this.paginator.destroy();
    }

    public deleteSelectedPeople() {
        const ids = this.dataSource.selectedRows.selected.map(title => title.id);
        this.people.delete(ids).subscribe(() => {
            this.paginator.refresh();
            this.dataSource.selectedRows.clear();
        });
    }

    public maybeDeleteSelectedPeople() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete People',
            body:  'Are you sure you want to delete selected people?',
            ok:    'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.deleteSelectedPeople();
        });
    }

    public openImportMediaModal() {
        this.modal.open(
            ImportMediaModalComponent,
            {mediaTypes: [MEDIA_TYPE.PERSON]},
        ).beforeClosed().subscribe(mediaItem => {
            if (mediaItem) {
                this.router.navigate(['/admin/people', mediaItem.id, 'edit']);
            }
        });
    }
}
