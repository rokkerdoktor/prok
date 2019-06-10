import {Component, ViewEncapsulation, ChangeDetectionStrategy, Inject} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {FormBuilder} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Link} from '../../../../../../models/link';

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
    nyelv = [
    {name: 'Magyar'},
    {name: 'Angol'},
    {name: 'Angol, magyarfelirat'},
    {name: 'Egyéb'},
    {name: 'Egyéb, magyarfelirat'},
  ];
  minoseg = [
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
    public linkForm = this.fb.group({
        id: [],
        url: [],
        label: [],
        quality: [],
        season: [],
        episode: [],
        user_name: [],
    });

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<LinkModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CrupdateTagModalData,
    ) {
        this.hydrateForm();
    }

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
