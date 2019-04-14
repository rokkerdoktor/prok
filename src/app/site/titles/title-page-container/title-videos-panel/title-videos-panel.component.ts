import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'title-videos-panel',
  templateUrl: './title-videos-panel.component.html',
  styleUrls: ['./title-videos-panel.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleVideosPanelComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
