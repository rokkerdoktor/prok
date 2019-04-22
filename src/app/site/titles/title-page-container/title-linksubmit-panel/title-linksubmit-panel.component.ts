import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'title-linksubmit-panel',
  templateUrl: './title-linksubmit-panel.component.html',
  styleUrls: ['./title-linksubmit-panel.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleLinksubmitPanelComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $(function() {
      alert("asd")
   });
  }

}
