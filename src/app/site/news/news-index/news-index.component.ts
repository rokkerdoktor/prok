import {Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {NewsArticle} from '../../../models/news-article';
import {NewsService} from '../news.service';
import {finalize} from 'rxjs/operators';
import {InfiniteScroll} from '../../../../common/core/ui/infinite-scroll/infinite.scroll';
import {PaginationResponse} from '../../../../common/core/types/pagination-response';

@Component({
    selector: 'news-index',
    templateUrl: './news-index.component.html',
    styleUrls: ['./news-index.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsIndexComponent extends InfiniteScroll implements OnInit {
    public loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public articles$: BehaviorSubject<PaginationResponse<NewsArticle>> = new BehaviorSubject(null);

    constructor(
        private news: NewsService,
    ) {
        super();
    }

    ngOnInit() {
        this.loadArticles();
        super.ngOnInit();
    }

    private loadArticles() {
        this.loading$.next(true);
        const page = this.articles$.value ? (this.articles$.value.current_page + 1) : 1;
        this.news.getAll({perPage: 10, page, stripHtml: true})
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(response => {
                if (this.articles$.value) {
                    response.data = [...this.articles$.value.data, ...response.data];
                }
                this.articles$.next(response);
            });
    }

    protected loadMoreItems() {
        this.loadArticles();
    }

    protected canLoadMore() {
        return this.articles$.value && (this.articles$.value.current_page < this.articles$.value.last_page);
    }

    protected isLoading() {
        return this.loading$.value;
    }
}
