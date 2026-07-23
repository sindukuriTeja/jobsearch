const fetch = require('node-fetch');

// Vercel / Now serverless function. Deploy this to Vercel (or Netlify with
// minor adaptions) and set `window.PROXY_URL` in the client to point to the
// deployed function URL (for example: https://your-deploy.vercel.app/api/proxy).

module.exports = async (req, res) => {
  const url = req.query.url || req.body && req.body.url;
  if (!url) {
    res.statusCode = 400;
    res.end('Missing url parameter');
    return;
  }

  try {
    const resp = await fetch(url, { headers: { Accept: '*/*', 'User-Agent': 'jobsearch-proxy/1.0' } });
    const contentType = resp.headers.get('content-type') || 'text/plain';
    const body = await resp.buffer();

    // Allow cross-origin requests from anywhere; for production tighten this.
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Content-Type', contentType);
    res.statusCode = resp.status || 200;
    res.end(body);
  } catch (err) {
    res.statusCode = 502;
    res.end('Proxy fetch failed: ' + String(err.message || err));
  }
};
