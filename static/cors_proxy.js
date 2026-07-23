function proxyUrl(url) {
    const encoded = encodeURIComponent(url);
    return `https://api.allorigins.win/raw?url=${encoded}`;
}

async function fetchWithCors(url, options = {}) {
    try {
        const resp = await fetch(url, options);
        if (resp.ok) return resp;
    } catch (e) {
        console.warn('Direct fetch failed:', url, e.message);
    }

    try {
        const proxy = proxyUrl(url);
        const resp = await fetch(proxy, options);
        if (resp.ok) return resp;
    } catch (e) {
        console.warn('Proxy fetch failed:', url, e.message);
    }

    throw new Error('Fetch blocked by CORS or failed.');
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { fetchWithCors, proxyUrl };
}
