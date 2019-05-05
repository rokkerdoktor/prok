import { Injectable } from '@angular/core';
import {AppHttpClient} from '../../../../../common/core/http/app-http-client.service';
import {BackendResponse} from '../../../../../common/core/types/backend-response';
import {PaginatedBackendResponse} from '../../../../../common/core/types/paginated-backend-response';
import {Comment} from '../../../../models/comment';
import { Location } from '@angular/common';

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
    baseUrl:string;
constructor(private http: AppHttpClient, private location: Location) {

}

public getComment(titleId: number){
    return this.http.get('comment/' + titleId);
}

}

