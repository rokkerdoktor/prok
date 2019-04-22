import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import {CurrentUser} from 'common/auth/current-user';
import {Title} from '../../../../models/title';
import {Comment} from '../../../../models/comment';
import {Observable} from 'rxjs';
import {TitleState} from '../../state/title-state';
import {Select, Store} from '@ngxs/store';
@Component({
  selector: 'title-comment-panel',
  templateUrl: './title-comment-panel.component.html',
  styleUrls: ['./title-comment-panel.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class TitleCommentPanelComponent implements OnInit {
  @Select(TitleState.title) title$: Observable<Title>;
  @Select(TitleState.backdrop) backdropImage$: Observable<string>;
  constructor( public currentUser: CurrentUser) { }
  myHero = 'Windstorm';
  ngOnInit() {
  }

}
