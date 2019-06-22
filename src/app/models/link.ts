import {Title} from './title';

export class Link {
    id: number;
    title_id: number;
    url: string;
    season: number;
    episode: number;
    label: string;
    quality:string;
    approved:number;
    user_name:string;
    title?: Title[];
    constructor(params: Object = {}) {
        for (const name in params) {
            this[name] = params[name];
        }
    }
}