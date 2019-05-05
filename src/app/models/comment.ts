import {User} from '../../common/core/types/models/User';

export class Comment {
    id: number;
    title_id: number;
    user_id: number;
    comment: string;
    season: number;
    episode: number;
    user?: User;

    constructor(params: Object = {}) {
        for (const name in params) {
            this[name] = params[name];
        }
    }
}
