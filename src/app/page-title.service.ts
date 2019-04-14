import {Injectable} from '@angular/core';
import {TitleService} from '../common/core/services/title.service';
import {MEDIA_TYPE} from './site/media-type';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {Translations} from '../common/core/translations/translations.service';
import {Settings} from '../common/core/config/settings.service';
import {Store} from '@ngxs/store';
import {TitleState} from './site/titles/state/title-state';
import {PersonState} from './site/people/state/person-state';
import {ucFirst} from '../common/core/utils/uc-first';

@Injectable({
    providedIn: 'root'
})
export class PageTitleService extends TitleService {
    constructor(
        protected router: Router,
        protected title: Title,
        protected i18n: Translations,
        protected settings: Settings,
        protected store: Store,
    ) {
        super(router, title, i18n, settings);
    }

    protected getTitle(data): string {
        switch (data.name) {
            case MEDIA_TYPE.MOVIE:
            case MEDIA_TYPE.SERIES:
                return this.getMovieTitle();
            case MEDIA_TYPE.SEASON:
                return this.getSeasonTitle();
            case MEDIA_TYPE.EPISODE:
                return this.getEpisodeTitle();
            case MEDIA_TYPE.PERSON:
                return this.getPersonTitle();
            case 'browse':
                return this.i18n.t('Browse');
            case 'people':
                return this.i18n.t('Popular People');
            case 'news':
                return this.i18n.t('Latest News');
            case 'userLists':
                return this.i18n.t('User Lists');
            case 'watchlist':
                return this.i18n.t('Your Watchlist');
            case 'homepage':
                return this.settings.get('branding.site_name') + ' - ' + this.i18n.t('Movies, TV and Celebrities');
            default:
                return super.getTitle(data);
        }
    }

    private getEpisodeTitle() {
        const episode = this.store.selectSnapshot(TitleState.episode);
        return this.getMovieTitle() + ' - ' + episode.name;
    }

    private getSeasonTitle() {
        const season = this.store.selectSnapshot(TitleState.season);
        return this.getMovieTitle() + ' - ' + ucFirst(this.i18n.t('season')) + ' ' + season.number;
    }

    private getMovieTitle() {
        const title = this.store.selectSnapshot(TitleState.title);
        return title.name + ' (' + title.year + ')';
    }

    private getPersonTitle() {
        const person = this.store.selectSnapshot(PersonState.person);
        return person.name;
    }
}
