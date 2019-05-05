import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'title-comment-panel-dialog',
  templateUrl: './title-comment-panel-dialog.component.html',
  styleUrls: ['./title-comment-panel-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleCommentPanelDialogComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
