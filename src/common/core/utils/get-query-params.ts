export function getQueryParams(url: string) {
    const parts = url.split('?');
    if (!parts[1] || parts.length > 2) return null;
    const hashes = parts[1].split('&');
    const params = {};
    hashes.map(hash => {
        const [key, val] = hash.split('=');
        params[key] = decodeURIComponent(val);
    });
    return params;
}
