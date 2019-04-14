import {PaginationResponse} from '../../../../../common/core/types/pagination-response';
import {Action, Selector, State, StateContext, Store} from '@ngxs/store';
import {finalize, tap} from 'rxjs/operators';
import {LoadFilterOptions, LoadMoreTitles, ReloadTitles, UpdateFilters} from './browse-title-actions';
import {Title} from '../../../../models/title';
import {BrowseTitlesQueryParams, TitlesService} from '../../titles.service';
import {
    CountryListItem,
    LanguageListItem,
    ValueLists
} from '../../../../../common/core/services/value-lists.service';
import {TITLE_CERTIFICATION_OPTIONS} from '../../components/browse-titles/select-options/title-certification-options';
import {Navigate} from '@ngxs/router-plugin';
import {Settings} from '../../../../../common/core/config/settings.service';

interface BrowseTitleStateModel {
    loading: boolean;
    titles?: PaginationResponse<Title>;
    filters: object;
    filterOptions: {
        countries: CountryListItem[],
        languages: LanguageListItem[],
        genres: string[],
        certifications: string[]
    };
}

@State<BrowseTitleStateModel>({
    name: 'browseTitles',
    defaults: {
        loading: false,
        filters: {},
        filterOptions: {
            genres: [],
            certifications: TITLE_CERTIFICATION_OPTIONS,
            countries: [],
            languages: [],
        }
    }
})
export class BrowseTitleState {
    @Selector()
    static titles(state: BrowseTitleStateModel) {
        return state.titles.data;
    }

    @Selector()
    static loading(state: BrowseTitleStateModel) {
        return state.loading;
    }

    @Selector()
    static canLoadMore(state: BrowseTitleStateModel) {
        return state.titles.current_page < state.titles.last_page;
    }

    @Selector()
    static doesNotHaveResults(state: BrowseTitleStateModel) {
        // loaded titles from backend at least once
        return state.titles.data && !state.titles.data.length;
    }

    @Selector()
    static anyFilterActive(state: BrowseTitleStateModel) {
        return Object.keys(state.filters).length > 0;
    }

    @Selector()
    static countries(state: BrowseTitleStateModel) {
        return state.filterOptions.countries;
    }

    @Selector()
    static languages(state: BrowseTitleStateModel) {
        return state.filterOptions.languages;
    }

    @Selector()
    static genres(state: BrowseTitleStateModel) {
        return state.filterOptions.genres;
    }

    @Selector()
    static certifications(state: BrowseTitleStateModel) {
        return state.filterOptions.certifications;
    }

    @Selector()
    static filters(state: BrowseTitleStateModel) {
        return state.filters;
    }

    constructor(
        private store: Store,
        private titles: TitlesService,
        private valueLists: ValueLists,
        private settings: Settings,
    ) {}

    static queryParamsToFilters(params: object): BrowseTitlesQueryParams {
        const formValues = {};
        const keys = ['genre'];
        Object.keys(params).forEach(key => {
            if (!params[key]) return;
            formValues[key] = keys.indexOf(key) > -1 && !Array.isArray(params[key]) ?
                params[key].split(',') :
                params[key];
        });
        return formValues;
    }

    static filtersToQueryParams(values: object) {
        const queryParams = {};
        Object.keys(values).forEach(key => {
            if (!values[key]) return;
            queryParams[key] = Array.isArray(values[key]) ?
                values[key].join(',') :
                values[key];
        });
        return queryParams;
    }

    @Action(ReloadTitles)
    reloadTitles(ctx: StateContext<BrowseTitleStateModel>, action: ReloadTitles) {
        const newFilters = BrowseTitleState.queryParamsToFilters(action.params);
        ctx.patchState({
            loading: true,
            filters: newFilters,
        });

        // apply specified filters as query params to current url
        this.store.dispatch(
            new Navigate([], BrowseTitleState.filtersToQueryParams(newFilters))
        );

        return this.titles.getAll(action.params).pipe(
            tap(response => ctx.patchState({titles: response})),
            finalize(() => ctx.patchState({loading: false}))
        );
    }

    @Action(LoadMoreTitles)
    loadMoreTitles(ctx: StateContext<BrowseTitleStateModel>) {
        ctx.patchState({loading: true});
        const filters = {
            ...ctx.getState().filters,
            page: ctx.getState().titles.current_page + 1
        };
        return this.titles.getAll(filters).pipe(
            tap(response => {
                const oldData = ctx.getState().titles.data.slice();
                response.data = [...oldData, ...response.data];
                ctx.patchState({titles: response});
            }),
            finalize(() => ctx.patchState({loading: false}))
        );
    }

    @Action(UpdateFilters)
    updateFilters(ctx: StateContext<BrowseTitleStateModel>, action: UpdateFilters) {
        ctx.patchState({
            filters: BrowseTitleState.queryParamsToFilters(action.filters),
        });
    }

    @Action(LoadFilterOptions)
    loadFilterOptions(ctx: StateContext<BrowseTitleStateModel>) {
        ctx.patchState({
            filterOptions: {
                ...ctx.getState().filterOptions,
                genres: this.settings.getJson('browse.genres')
            }
        });
        this.valueLists.get(['countries', 'languages']).subscribe(response => {
            ctx.patchState({
                filterOptions: {
                    ...ctx.getState().filterOptions,
                    languages: response.languages,
                    countries: response.countries,
                }
            });
        });
    }
}
