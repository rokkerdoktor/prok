import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {TitleState} from '../../state/title-state';
import {Observable} from 'rxjs';
import {Title} from '../../../../models/title';
import {Episode} from '../../../../models/episode';
import {MEDIA_TYPE} from '../../../media-type';
import {TitleUrlsService} from '../../title-urls.service';
import {ShareableNetworks, shareLinkSocially} from '../../../../../common/core/utils/share-link-socially';
import {Settings} from '../../../../../common/core/config/settings.service';
import {shareViaEmail} from '../../../../../common/core/utils/share-via-email';
import {copyToClipboard} from '../../../../../common/core/utils/copy-link-to-clipboard';
import {MESSAGES} from '../../../../toast-messages';
import {Translations} from '../../../../../common/core/translations/translations.service';
import {Toast} from '../../../../../common/core/ui/toast.service';
import {Season} from '../../../../models/season';
@Component({
  selector: 'series-primary-details-panel',
  templateUrl: './series-primary-details-panel.component.html',
  styleUrls: ['./series-primary-details-panel.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeriesPrimaryDetailsPanelComponent {

  @Select(TitleState.episode) episode$: Observable<Episode[]>;
  @Select(TitleState.title) title$: Observable<Title>;
  @Input() item: Title|Episode;
  @Select(TitleState.season) season$: Observable<Season[]>;
  constructor(
      public urls: TitleUrlsService,
      private settings: Settings,
      private store: Store,
      private i18n: Translations,
      private toast: Toast,
  ) {}

    public shareUsing(type: ShareableNetworks | 'mail' | 'copy') {
        const title = this.store.selectSnapshot(TitleState.title);
        const link = this.settings.getBaseUrl(true) + 'titles/' + title.id;

        if (type === 'mail') {
            const siteName = this.settings.get('branding.site_name');
            const subject = this.i18n.t('Check out this link on ') + siteName;
            const body = `${title.name} - ${siteName} - ${link}`;
            shareViaEmail(subject, body);
        } else if (type === 'copy') {
            if (copyToClipboard(link)) {
                this.toast.open(MESSAGES.COPY_TO_CLIPBOARD_SUCCESS);
            }
        } else {
            shareLinkSocially(type, link, title.name);
        }
    }
}

