export default {
  async fetch(request) {
    const url = new URL(request.url).searchParams.get('url');

    if (!url) {
      return new Response(JSON.stringify({ error: 'No URL provided' }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SkycareBot/1.0)' }
      });
      const html = await res.text();

      const og = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)
                || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
      const title = html.match(/<title[^>]*>([^<]+)<\/title>/i);

      const name = (og?.[1] || title?.[1] || '').trim();

      return new Response(JSON.stringify({ name }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
  }
};
