export const config = { matcher: ['/p/:slug*'] };

const BOT_UA = /bot|crawl|spider|slack|discord|telegram|twitter|facebook|whatsapp|linkedinbot|preview|wget|curl|facebookexternalhit|twitterbot|rogerbot|embedly|quora|outbrain|w3c_validator/i;

export default async function middleware(request) {
  const ua = request.headers.get('user-agent') || '';
  if (!BOT_UA.test(ua)) return; // let humans through to the SPA

  const url = new URL(request.url);
  const slug = url.pathname.replace('/p/', '').replace(/^\//, '');
  if (!slug) return;

  try {
    const res = await fetch(`https://api.cenner.hr/api/v1/links/p/${slug}`);
    if (!res.ok) return;
    const data = await res.json();
    const page = data.page;
    if (!page) return;

    const title = `${page.name} | Cenner Links`;
    const desc  = page.bio || `${page.handle} — check out my links`;
    const pageUrl = `https://links.cenner.hr/p/${slug}`;
    const img   = `https://api.cenner.hr/api/v1/links/p/${slug}/og`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <meta name="description" content="${desc}" />
  <!-- Open Graph -->
  <meta property="og:type"        content="website" />
  <meta property="og:url"         content="${pageUrl}" />
  <meta property="og:title"       content="${title}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:image"       content="${img}" />
  <meta property="og:site_name"   content="Cenner Links" />
  <!-- Twitter -->
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="${title}" />
  <meta name="twitter:description" content="${desc}" />
  <meta name="twitter:image"       content="${img}" />
  <!-- Redirect humans that land here -->
  <meta http-equiv="refresh" content="0;url=${pageUrl}" />
</head>
<body><a href="${pageUrl}">${title}</a></body>
</html>`;

    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 's-maxage=60' },
    });
  } catch {
    return; // fall through to SPA on any error
  }
}
