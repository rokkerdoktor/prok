import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'title-comment-panel',
  templateUrl: './title-comment-panel.component.html',
  styleUrls: ['./title-comment-panel.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleCommentPanelComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
