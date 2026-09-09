// Cloudflare Worker — custom newsletter subscribe + custom-branded email.
// Deploy with `wrangler deploy` from this folder (see wrangler.toml).
//
// Endpoints:
//   POST /subscribe             body: { "email": "someone@example.com" }
//   GET  /unsubscribe?email=... one-click unsubscribe link, used in the email footer
//
// Secret (set with `wrangler secret put RESEND_API_KEY`, NEVER hardcode this):
//   RESEND_API_KEY   — your Resend API key
//
// KV namespace binding required: SUBSCRIBERS

const ALLOWED_ORIGIN = 'https://vishwavijaysheel.bio';          // ← your real site origin
const FROM_EMAIL = 'hello@vishwavijaysheel.bio'; // ← address on a domain verified in Resend
const WORKER_BASE_URL = 'https://newsletter-subscribe.aarav7509.workers.dev'; // ← your live worker URL

// Update this each time you publish a new post — new subscribers get
// emailed whatever is set here the moment they sign up.
const LATEST_POST = {
  title: 'The Cost of Inconsistent Metrics',
  url: 'https://vishwavijaysheel.bio/cost-of-inconsistent-metrics.html',
  excerpt: 'Why a single source of truth matters more than any individual dashboard.',
  tag: 'Data Strategy',
};

function emailIsValid(email) {
  return typeof email === 'string'
    && email.length < 254
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin === ALLOWED_ORIGIN ? origin : ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

function json(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

// Brand palette, lifted straight from style.css's --accent / --bg tokens
// so the email actually looks like it came from the same site.
const INK = '#f4f4f1';
const INK_DIM = '#a4a7ab';
const INK_FAINT = '#6c6f74';
const BG = '#0a0a0b';
const BG_RAISE = '#131315';
const LINE = 'rgba(244, 244, 241, 0.14)';
const ACCENT = '#ffc400';
const ACCENT_ON = '#0a0a0b';
const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

function buildEmailHtml(email) {
  const unsubscribeUrl = `${WORKER_BASE_URL}/unsubscribe?email=${encodeURIComponent(email)}`;
  return `
<div style="background:${BG}; padding: 40px 20px; font-family: ${SANS};">
  <div style="max-width: 480px; margin: 0 auto;">
    <p style="font-family: ${MONO}; font-size: 12px; color: ${ACCENT}; letter-spacing: 0.02em; margin: 0 0 24px;">
      // subscribed
    </p>
    <p style="color: ${INK}; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
      Thanks for subscribing — here's the latest from the blog.
    </p>
    <div style="border: 1px solid ${LINE}; border-radius: 6px; background: ${BG_RAISE}; padding: 24px; margin-bottom: 28px;">
      <span style="display:inline-block; font-family: ${MONO}; font-size: 10.5px; color: ${INK_DIM}; border: 1px solid ${LINE}; border-radius: 4px; padding: 3px 8px; margin-bottom: 14px;">
        ${LATEST_POST.tag}
      </span>
      <h1 style="color: ${INK}; font-size: 19px; line-height: 1.3; margin: 0 0 10px; font-family: ${SANS};">
        ${LATEST_POST.title}
      </h1>
      <p style="color: ${INK_DIM}; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
        ${LATEST_POST.excerpt}
      </p>
      <a href="${LATEST_POST.url}" style="display:inline-block; font-family: ${MONO}; font-size: 13px; font-weight: 600; background: ${ACCENT}; color: ${ACCENT_ON}; text-decoration: none; padding: 10px 18px; border-radius: 4px;">
        Read the article →
      </a>
    </div>
    <p style="font-family: ${MONO}; font-size: 11px; color: ${INK_FAINT}; line-height: 1.6; margin: 0;">
      You're getting this because you subscribed on the site.
      <a href="${unsubscribeUrl}" style="color: ${INK_FAINT};">Unsubscribe</a>
    </p>
  </div>
</div>`;
}

async function sendCustomEmail(env, email) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: email,
      subject: `New post: ${LATEST_POST.title}`,
      html: buildEmailHtml(email),
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Resend error ${res.status}: ${detail}`);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const headers = corsHeaders(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    // --- Subscribe ---
    if (request.method === 'POST' && url.pathname === '/subscribe') {
      let body;
      try {
        body = await request.json();
      } catch (_) {
        return json({ error: 'Invalid request body' }, 400, headers);
      }

      const email = String(body.email || '').trim().toLowerCase();
      if (!emailIsValid(email)) {
        return json({ error: 'Enter a valid email address' }, 400, headers);
      }

      const key = `sub:${email}`;
      const already = await env.SUBSCRIBERS.get(key);

      if (already) {
        // Already on the list — don't re-send, just confirm.
        return json({ status: 'already_subscribed' }, 200, headers);
      }

      try {
        await sendCustomEmail(env, email);
      } catch (_) {
        return json({ error: 'Could not send confirmation email' }, 502, headers);
      }

      await env.SUBSCRIBERS.put(key, JSON.stringify({ subscribedAt: Date.now() }));
      return json({ status: 'subscribed' }, 200, headers);
    }

    // --- Unsubscribe (one click, no login — required for any real mailing list) ---
    if (request.method === 'GET' && url.pathname === '/unsubscribe') {
      const email = (url.searchParams.get('email') || '').trim().toLowerCase();
      if (emailIsValid(email)) {
        await env.SUBSCRIBERS.delete(`sub:${email}`);
      }
      return new Response("You've been unsubscribed. Sorry to see you go.", {
        headers: { 'Content-Type': 'text/plain; charset=utf-8', ...headers },
      });
    }

    return json({ error: 'Not found' }, 404, headers);
  },
};
