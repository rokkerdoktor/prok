import { Injectable } from '@angular/core';
import {AppHttpClient} from '../../../../../common/core/http/app-http-client.service';
import {BackendResponse} from '../../../../../common/core/types/backend-response';
import {PaginatedBackendResponse} from '../../../../../common/core/types/paginated-backend-response';
import {Comment} from '../../../../models/comment';
import { Location } from '@angular/common';
import {Episode} from '../../../../models/episode';
import {Observable} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {TitleState} from '../../state/title-state';
import {Title} from '../../../../models/title';
import {Router} from '@angular/router';

export interface GetTitleQueryParams {
    titleId?: number;
    seasonNumber?: number;
    episodeNumber?: number;
    fullCredits?: boolean;
    keywords?: boolean;
    seasons?: boolean;
    countries?: boolean;
    skipUpdating?: boolean;
}

@Injectable({
    providedIn: 'root'
})

export class DataService {
    @Select(TitleState.episode) episode$: Observable<Episode>;
    @Select(TitleState.title) title$: Observable<Title>;
    baseUrl:string;
constructor(       private router: Router, private store: Store,private http: AppHttpClient, private location: Location) {
console.log();
}

public getComment(titleId: number){
    const title = this.store.selectSnapshot(TitleState.title);
    const episode = this.store.selectSnapshot(TitleState.episode);
    
    if(this.router.url.includes('episode') == true)
    {
        return this.http.get('comment/' + titleId +'/season/'+ episode.season_number + '/episode/' + episode.episode_number);
       /*   return this.http.get('http://localhost/filmgo/secure/comment/' + titleId +'/season/'+ episode.season_number + '/episode/' + episode.episode_number); */
    }else{
        return this.http.get('comment/' + titleId);
      /*   return this.http.get('http://localhost/filmgo/secure/comment/' + titleId); */
    }


}

}

