import {Component, ViewEncapsulation, ChangeDetectionStrategy, Inject} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {FormBuilder} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Link} from '../../../../../../models/link';
import {Title} from '../../../../../../models/title';
import {CrupdateTitleState} from '../../../state/crupdate-title-state';
import {Observable} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import { encodeUriFragment } from '@angular/router/src/url_tree';
import {CurrentUser} from '../../../../../../../common/auth/current-user';
interface CrupdateTagModalData {
    link?: Link;
}

@Component({
  selector: 'link-modal',
  templateUrl: './link-modal.component.html',
  styleUrls: ['./link-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkModalComponent {
    @Select(CrupdateTitleState.title) title$: Observable<Title>;

    public nyelv = [
    {name: 'Magyar'},
    {name: 'Angol'},
    {name: 'Angol, magyarfelirat'},
    {name: 'Egyéb'},
    {name: 'Egyéb, magyarfelirat'},
  ];
    public  minoseg = [
    {name: 'BDRip'},
    {name: 'DVD Minőség'},
    {name: 'TV Felvétel'},
    {name: 'DVD Minőség (mozis hanggal)'},
    {name: 'HDRIP'},
    {name: 'R5'},
    {name: 'R5/TS'},
    {name: 'Mozis'},
  ];
    public loading$ = new BehaviorSubject(false);


    constructor(
        private store: Store,
        private fb: FormBuilder,
        public currentUser: CurrentUser,
        private dialogRef: MatDialogRef<LinkModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CrupdateTagModalData,
    ) {
        this.hydrateForm();
    }

    public linkForm = this.fb.group({
        id: [],
        url: [],
        title_id:this.store.selectSnapshot(CrupdateTitleState.title).id,
        label: [],
        quality: [],
        season: [],
        episode: [],
        approved: 1,
        user_name: this.currentUser.get("display_name"),
    });

    public confirm() {
        this.close(this.linkForm.value);
    }

    public close(link?: Link) {
        this.dialogRef.close(link);
    }

    private hydrateForm() {
        if (this.data.link) {
            this.linkForm.patchValue(this.data.link);
        }
    }
}
