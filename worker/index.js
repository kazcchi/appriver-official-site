// 静的ファイルの配信を Vercel と同じ挙動にそろえるための最小の処理。
// ① www.appriver.jp と http の要求は https://appriver.jp へ 301 で転送する(Vercel と同じ)
// ②「/」などフォルダ宛ての要求に index.html を返す
// ③ 末尾スラッシュなしのフォルダ(/out/spotify・/buka など)も、Vercel と同じく転送せずに index.html を返す
// ④ Vercel と同じ HSTS(2年)を付ける
const HSTS = 'max-age=63072000';
const HOST = 'appriver.jp';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const prod = url.hostname === HOST || url.hostname === 'www.' + HOST;
    if (prod && (url.hostname !== HOST || url.protocol === 'http:')) {
      url.hostname = HOST;
      url.protocol = 'https:';
      return new Response(null, {
        status: 301,
        headers: { Location: url.toString(), 'Strict-Transport-Security': HSTS },
      });
    }
    const path = url.pathname;
    let res;
    if (path.endsWith('/')) {
      res = await env.ASSETS.fetch(withPath(request, url, path + 'index.html'));
    } else {
      res = await env.ASSETS.fetch(request);
      const last = path.slice(path.lastIndexOf('/') + 1);
      if (res.status === 404 && !last.includes('.')) {
        const dir = await env.ASSETS.fetch(withPath(request, url, path + '/index.html'));
        if (dir.status === 200) res = dir;
      }
    }
    const out = new Response(res.body, res);
    out.headers.set('Strict-Transport-Security', HSTS);
    return out;
  },
};

function withPath(request, url, pathname) {
  const u = new URL(url);
  u.pathname = pathname;
  return new Request(u, request);
}
