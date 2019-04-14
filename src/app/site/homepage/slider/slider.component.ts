import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {HomepageState} from '../state/homepage-state';
import {Observable} from 'rxjs';
import {List} from '../../../models/list';
import {ChangeSlide} from '../state/homepage-state.actions';
import {TitleUrlsService} from '../../titles/title-urls.service';
import {ListItem} from '../../lists/types/list-item';
import {MEDIA_TYPE} from '../../media-type';
import {Title} from '../../../models/title';
import {PlayVideo} from '../../player/state/player-state-actions';
import {BreakpointsService} from '../../../../common/core/ui/breakpoints.service';

@Component({
    selector: 'slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderComponent {
    @Select(HomepageState.sliderList) sliderList$: Observable<List>;
    @Select(HomepageState.activeSlide) activeSlide$: Observable<number>;

    constructor(
        private store: Store,
        public urls: TitleUrlsService,
        public breakpoints: BreakpointsService,
    ) {}

    public changeSlide(index: number|'previous'|'next') {
        const active = this.store.selectSnapshot(HomepageState.activeSlide);
        if (index === 'next') {
            index = active + 1;
        } else if (index === 'previous') {
            index = active - 1;
        }

        this.store.dispatch(new ChangeSlide(index));
    }

    public filterTitles(items: ListItem[]): Title[] {
        return items.filter(item => {
            return item.type === MEDIA_TYPE.TITLE;
        }) as Title[];
    }

    public playVideo(title: Title) {
        this.store.dispatch(new PlayVideo(title.videos[0], title));
    }
}
