import {extractRootDomain} from './extractRootDomain';

export function getFaviconFromUrl(url: string) {
    const domain = extractRootDomain(url);
    return 'http://www.google.com/s2/favicons?domain=' + domain;
}
