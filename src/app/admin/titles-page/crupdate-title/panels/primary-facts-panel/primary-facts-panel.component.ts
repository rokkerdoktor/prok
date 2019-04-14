import {Component, ViewEncapsulation, ChangeDetectionStrategy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Select, Store} from '@ngxs/store';
import {CrupdateTitleState} from '../../state/crupdate-title-state';
import {Observable} from 'rxjs';
import {Title} from '../../../../../models/title';
import {openUploadWindow} from '../../../../../../common/uploads/utils/open-upload-window';
import {UploadInputTypes} from '../../../../../../common/uploads/upload-input-config';
import {UploadQueueService} from '../../../../../../common/uploads/upload-queue/upload-queue.service';
import {CreateTitle, HydrateTitle, LoadSelectOptions, UpdateTitle} from '../../state/crupdate-title-actions';
import {ActivatedRoute} from '@angular/router';
import {TITLE_CERTIFICATION_OPTIONS} from '../../../../../site/titles/components/browse-titles/select-options/title-certification-options';
import {LanguageListItem} from '../../../../../../common/core/services/value-lists.service';

@Component({
    selector: 'primary-facts-panel',
    templateUrl: './primary-facts-panel.component.html',
    styleUrls: ['./primary-facts-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [UploadQueueService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrimaryFactsPanelComponent implements OnInit {
    @Select(CrupdateTitleState.title) title$: Observable<Title>;
    @Select(CrupdateTitleState.loading) loading$: Observable<boolean>;
    @Select(CrupdateTitleState.languageOptions) languageOptions$: Observable<LanguageListItem[]>;
    public certificationOptions = TITLE_CERTIFICATION_OPTIONS;

    public form = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(1)]],
        is_series: [false, [Validators.required]],
        language: [''],
        tagline: ['', [Validators.minLength(1), Validators.maxLength(250)]],
        poster: ['', [Validators.minLength(1), Validators.maxLength(250)]],
        backdrop: ['', [Validators.minLength(1), Validators.maxLength(250)]],
        description: ['', [Validators.minLength(1)]],
        budget: ['', Validators.min(1)],
        revenue: ['', Validators.min(1)],
        runtime: ['', [Validators.min(1), Validators.max(300)]],
        country: ['', [Validators.minLength(1), Validators.maxLength(50)]],
        popularity: [1, [Validators.min(1), Validators.max(100)]],
        certification: ['pg'],
        release_date: [''],
        allow_update: [true],
    });

    constructor(
        private store: Store,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private uploadQueue: UploadQueueService,
    ) {}

    ngOnInit() {
        this.hydrateModel();
        this.store.dispatch(new LoadSelectOptions());
    }

    public uploadImage(type: 'poster'|'backdrop') {
        openUploadWindow({types: [UploadInputTypes.image]}).then(upload => {
            const params = {
                uri: 'uploads/images',
                httpParams: {
                    path: `media-images/${type}s`
                },
            };
            this.uploadQueue.start(upload, params).subscribe(fileEntry => {
                this.form.patchValue({
                    [type]: fileEntry.url
                });
            });
        });
    }

    public submit() {
        if (this.store.selectSnapshot(CrupdateTitleState.title).id) {
            this.store.dispatch(new UpdateTitle(this.form.value));
        } else {
            this.store.dispatch(new CreateTitle(this.form.value));
        }
    }

    private hydrateModel() {
        this.route.params.subscribe(params => {
            if ( ! params.id) return;
            this.store.dispatch(new HydrateTitle(+params.id)).subscribe(() => {
                const title = this.store.selectSnapshot(CrupdateTitleState.title);
                this.form.patchValue({
                    ...title,
                    release_date: title.release_date ? title.release_date.split(' ')[0] : null,
                });
            });
        });
    }
}
