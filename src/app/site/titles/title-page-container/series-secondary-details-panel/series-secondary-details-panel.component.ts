import { Component, OnChanges, Input,ViewEncapsulation,SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import {TitleState} from '../../state/title-state';
import {Observable} from 'rxjs';
import {Title, TitleCredit} from '../../../../models/title';
import {Video} from '../../../../models/video';
import {PlayVideo} from '../../../player/state/player-state-actions';
import {Episode} from '../../../../models/episode';
import {MEDIA_TYPE} from '../../../media-type';
import {Season} from '../../../../models/season';
import {Select, Store} from '@ngxs/store';

@Component({
  selector: 'series-secondary-details-panel',
  templateUrl: './series-secondary-details-panel.component.html',
  styleUrls: ['./series-secondary-details-panel.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeriesSecondaryDetailsPanelComponent implements OnChanges {
  @Select(TitleState.episode) episode$: Observable<Episode[]>;
  @Select(TitleState.title) title$: Observable<Title>;
  @Select(TitleState.videoCoverImage) videoCoverImage$: Observable<string>;
  @Select(TitleState.trailer) trailer$: Observable<Video>;
  @Select(TitleState.seasons) seasons$: Observable<Season[]>;
  @Select(TitleState.season) season$: Observable<Season[]>;
  @Input() item: Title|Episode;

  public credits: {
      director?: TitleCredit,
      writers?: TitleCredit[],
      creators?: TitleCredit[],
      cast?: TitleCredit[],
  };

  constructor(private store: Store) {
  }

  ngOnChanges(changes: {item: SimpleChange}) {
    if (changes.item.currentValue && changes.item.currentValue.credits) {
        this.setCrew();
    }
}

private setCrew() {
  const credits = this.store.selectSnapshot(TitleState.titleOrEpisodeCredits);
  this.credits = {
      director: this.getDirector(credits),
      writers: this.getWriters(credits),
      cast: this.getCast(credits),
      creators: this.getCreators(credits),
  };
}
public language(){
  const title = this.store.selectSnapshot(TitleState.title);
  var nyelv;
  switch (title.links_language) {
    case 'Magyar':
      nyelv = 'https://filmgo.cc/images/flag/hu-hu.png';
      break;
    case 'Magyar Felirat':
       nyelv = 'https://filmgo.cc/images/flag/en-hu.png';
      break;
    case 'Angol, magyarfelirat': 
      nyelv='https://filmgo.cc/images/flag/en-hu.png'
    break;

    case 'Magyar szinkron': 
      nyelv='https://filmgo.cc/images/flag/hu-hu.png'
    break;

    case 'Angol': 
      nyelv='https://filmgo.cc/images/flag/en-en.png'
    break;

    case 'Egyéb': 
    nyelv='https://filmgo.cc/images/flag/en-en.png'
    break;
    case 'Egyéb, magyarfelirat': 
    nyelv = 'https://filmgo.cc/images/flag/en-hu.png';
    break;

    default:
    nyelv='https://filmgo.cc/images/flag/en-en.png'
  }
  return nyelv;

}

public languagetext(){
  const title = this.store.selectSnapshot(TitleState.title);
  var nyelvtext;
  switch (title.links_language) {
    case 'Magyar':
    nyelvtext = 'Magyar nyelvű';
      break;
    case 'Magyar Felirat':
    nyelvtext = 'Angol nyelvű, magyar felirat';
      break;
    case 'Angol, magyarfelirat': 
    nyelvtext='Angol nyelvű, magyar felirat'
    break;

    case 'Magyar szinkron': 
    nyelvtext='Magyar nyelvű'
    break;

    case 'Angol': 
    nyelvtext='Angol nyelvű'
    break;

    case 'Egyéb': 
    nyelvtext='Angol nyelvű'
    break;
    case 'Egyéb, magyarfelirat': 
    nyelvtext = 'Angol nyelvű, magyar felirat';
    break;

    default:
    nyelvtext='Angol nyelvű'
  }
  return nyelvtext;

}

public quality(){
  const title = this.store.selectSnapshot(TitleState.title);
  return title.links_quality;
}

public linkmegtekintes(){
  const title = this.store.selectSnapshot(TitleState.title);
  var url=  'http://linkadatbazis.xyz/url/'+title.urlkey;
  window.open(url, '_blank');

}

public getDirector(credits: TitleCredit[]) {
  return credits.find(person => person.pivot.department === 'directing');
}

private getWriters(credits: TitleCredit[]) {
  return credits.filter(person => person.pivot.department === 'writing');
}

private getCast(credits: TitleCredit[]) {
  return credits.filter(person => person.pivot.department === 'cast').slice(0, 3);
}

private getCreators(credits: TitleCredit[]) {
  return credits.filter(person => person.pivot.department === 'creators');
}
  public isSeries() {
    return this.item.type === MEDIA_TYPE.TITLE && this.item.is_series;
}

}
