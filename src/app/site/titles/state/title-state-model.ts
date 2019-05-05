import {Title} from '../../../models/title';
import {Episode} from '../../../models/episode';
import {Season} from '../../../models/season';
import {Comment} from '../../../models/comment';
import {GetTitleQueryParams} from '../titles.service';

export interface TitleStateModel {
    title?: Title;
    titleQueryParams: GetTitleQueryParams;
    related?: Title[];
    comments?: Comment[];
    season?: Season;
    episode?: Episode;
    episodes?: Episode;
    current_episode?: Episode;
    next_episode?: Episode;
}
