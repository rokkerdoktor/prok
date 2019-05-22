import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'series-primary-details-panel',
  templateUrl: './series-primary-details-panel.component.html',
  styleUrls: ['./series-primary-details-panel.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeriesPrimaryDetailsPanelComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
