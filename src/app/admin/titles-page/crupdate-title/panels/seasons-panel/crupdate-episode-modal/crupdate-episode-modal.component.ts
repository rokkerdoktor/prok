import {Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Inject} from '@angular/core';
import {Episode} from '../../../../../../models/episode';
import {Select, Store} from '@ngxs/store';
import {CrupdateTitleState} from '../../../state/crupdate-title-state';
import {BehaviorSubject, Observable} from 'rxjs';
import {Toast} from '../../../../../../../common/core/ui/toast.service';
import {FormBuilder, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {CreateEpisode, LoadEpisodeCredits, UpdateEpisode} from '../../../state/crupdate-title-actions';
import {MESSAGES} from '../../../../../../toast-messages';
import {openUploadWindow} from '../../../../../../../common/uploads/utils/open-upload-window';
import {UploadInputTypes} from '../../../../../../../common/uploads/upload-input-config';
import {UploadQueueService} from '../../../../../../../common/uploads/upload-queue/upload-queue.service';
import {Season} from '../../../../../../models/season';

interface CrupdateEpisodeModalData {
    episode?: Episode;
    season?: Season;
}

@Component({
    selector: 'crupdate-episode-modal',
    templateUrl: './crupdate-episode-modal.component.html',
    styleUrls: ['./crupdate-episode-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [UploadQueueService],
})
export class CrupdateEpisodeModalComponent implements OnInit {
    @Select(CrupdateTitleState.loading) loading$: Observable<boolean>;
    public episode$: BehaviorSubject<Episode> = new BehaviorSubject(null);

    public episodeForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(1)]],
        poster: ['', [Validators.minLength(1), Validators.maxLength(250)]],
        description: ['', [Validators.minLength(1)]],
        popularity: [50, [Validators.min(1), Validators.max(1000)]],
        release_date: [''],
    });

    constructor(
        private store: Store,
        private toast: Toast,
        private fb: FormBuilder,
        private uploadQueue: UploadQueueService,
        private dialogRef: MatDialogRef<CrupdateEpisodeModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CrupdateEpisodeModalData,
    ) {}

    ngOnInit() {
        if (this.data.episode) {
            this.bindToStoreEpisode();
            this.episodeForm.patchValue(this.episode$.value);
            setTimeout(() => this.loadEpisodeCredits());
        }
    }

    public confirm() {
        if (this.data.episode) {
            this.updateEpisode();
        } else {
            this.createEpisode();
        }
    }

    public close() {
        this.dialogRef.close();
    }

    private createEpisode() {
        this.store.dispatch(new CreateEpisode(this.data.season, this.episodeForm.value)).subscribe(() => {
            this.toast.open(MESSAGES.EPISODE_CREATE_SUCCESS);
            const episodes = this.store.selectSnapshot(CrupdateTitleState.seasons)
                .find(s => s.id === this.data.season.id).episodes;
            this.data.episode = episodes[episodes.length - 1];
        });
    }

    private updateEpisode() {
        this.store.dispatch(new UpdateEpisode(this.data.episode, this.episodeForm.value)).subscribe(() => {
            this.toast.open(MESSAGES.EPISODE_UPDATE_SUCCESS);
            this.close();
        });
    }

    public uploadPoster() {
        openUploadWindow({types: [UploadInputTypes.image]}).then(upload => {
            const params = {
                uri: 'uploads/images',
                httpParams: {
                    path: 'media-images/posters'
                },
            };
            this.uploadQueue.start(upload, params).subscribe(fileEntry => {
                this.episodeForm.patchValue({
                    poster: fileEntry.url
                });
            });
        });
    }

    private bindToStoreEpisode() {
        this.store.select(CrupdateTitleState.title)
            .subscribe(title => {
               if (title.seasons) {
                   const episode = title.seasons.find(s => s.number === this.data.episode.season_number)
                       .episodes.find(e => e.episode_number === this.data.episode.episode_number);
                   this.episode$.next({...episode});
               }
            });
    }

    private loadEpisodeCredits() {
        if ( ! this.data.episode.credits) {
            this.store.dispatch(new LoadEpisodeCredits(this.episode$.value)).toPromise();
        }
    }
}
