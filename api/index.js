import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';

const app = express();
app.use(express.json());

app.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: false
  })
);

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "frame-ancestors 'self' https://*.duda.co https://*.responsivewebsitebuilder.io"
  );
  next();
});

const DUDA_API_TOKEN = process.env.DUDA_API_TOKEN || '0394b843802a41839b738d6daa304d19';
const DUDA_API_BASE = process.env.DUDA_API_BASE || 'https://api.duda.co';
const PORT = process.env.PORT || 3000;

const translations = {
  en: {
    hello: 'Hello',
    upgradeTitle: 'Choose Your Site Subscription',
    upgradeSubtitle: 'Grow your business with eComm and booking features.',
    publishTitle: 'Publish Your Website',
    publishSubtitle: 'Enter payment details to publish your site.',
    elite: 'Elite',
    select: 'Select',
    cardTitle: 'Payment details',
    cardNumber: 'Card number',
    expiry: 'Expiry',
    cvc: 'CVC',
    payAndPublish: 'Pay & Publish',
    processing: 'Processing...',
    core: 'All Core features plus:'
  },
  de: {
    hello: 'Hallo',
    upgradeTitle: 'Wähle dein Website-Abo',
    upgradeSubtitle: 'Erweitere dein Geschäft mit eComm- und Buchungsfunktionen.',
    publishTitle: 'Website veröffentlichen',
    publishSubtitle: 'Gib Zahlungsdetails ein, um deine Website zu veröffentlichen.',
    elite: 'Elite',
    select: 'Auswählen',
    cardTitle: 'Zahlungsdetails',
    cardNumber: 'Kartennummer',
    expiry: 'Ablaufdatum',
    cvc: 'CVC',
    payAndPublish: 'Bezahlen & veröffentlichen',
    processing: 'Wird verarbeitet...',
    core: 'Alle Core-Funktionen plus:'
  },
  es: {
    hello: 'Hola',
    upgradeTitle: 'Elige tu suscripción del sitio',
    upgradeSubtitle: 'Haz crecer tu negocio con funciones de eComm y reservas.',
    publishTitle: 'Publica tu sitio web',
    publishSubtitle: 'Ingresa los datos de pago para publicar tu sitio.',
    elite: 'Elite',
    select: 'Seleccionar',
    cardTitle: 'Datos de pago',
    cardNumber: 'Número de tarjeta',
    expiry: 'Vencimiento',
    cvc: 'CVC',
    payAndPublish: 'Pagar y publicar',
    processing: 'Procesando...',
    core: 'Todas las funciones Core más:'
  }
};

const features = [
  ['Bookings'],
  ['10 Staff calendars'],
  ['Connect calendars'],
  ['Customize availability'],
  ['Charge for appointments'],
  ['eCommerce'],
  ['20,000 products'],
  ['400 variants per product'],
  ['25 product customization'],
  ['0% transaction fee'],
  ['eComm API access (available with custom plan)'],
  ['Sell services & accept donations'],
  ['Sell digital products'],
  ['Automatic taxes'],
  ['Product filtering & sorting'],
  ['Automatic shipping'],
  ['Sell subscriptions']
];

function getLocale(locale) {
  return ['en', 'de', 'es'].includes(locale) ? locale : 'en';
}

function safeText(value = '') {
  return String(value).replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
}

function headers() {
  return {
    Authorization: `Bearer ${DUDA_API_TOKEN}`,
    'Content-Type': 'application/json'
  };
}

function pageShell({ title, subtitle, name, content, script }) {
  return `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Inter, Arial, sans-serif;
      color: #282c36;
      background: #ffffff;
    }
    .close {
      position: fixed;
      right: 28px;
      top: 22px;
      font-size: 28px;
      color: #555;
    }
    .page {
  padding: 40px 20px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
    }
    .headline {
  font-size: 56px;
  line-height: 1;
  font-weight: 800;
  letter-spacing: -2px;
  margin: 0 0 18px;
  text-align: center;
    }
    .subtitle {
      text-align: center;
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 80px;
    }
    .hello {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 12px;
  text-align: center;
    }
    .center {
      max-width: 920px;
      margin: 0 auto;
    }
    .plans {
      display: flex;
      justify-content: center;
    }
    .plan {
      width: 360px;
      background: #f5f5f7;
      border-radius: 16px;
      padding: 28px 24px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.06);
    }
    .badge {
      display: inline-block;
      background: #d8c4ff;
      color: #4b3b76;
      font-size: 12px;
      font-weight: 800;
      padding: 5px 10px;
      border-radius: 4px;
      margin-bottom: 18px;
    }
    .icon {
      width: 38px;
      height: 38px;
      border-radius: 8px;
      background: #a7c58b;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      margin-bottom: 18px;
    }
    .plan h2 {
      font-size: 22px;
      margin: 0 0 24px;
    }
    button {
      width: 100%;
      border: 0;
      background: #282c36;
      color: white;
      border-radius: 8px;
      padding: 14px 18px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
    }
    button:hover { opacity: 0.92; }
    .section-title {
      margin-top: 56px;
      font-size: 17px;
      font-weight: 800;
    }
    .features {
      margin-top: 34px;
    }
    .feature {
      padding: 13px 0;
      border-bottom: 1px solid #e3e3e8;
      font-size: 15px;
    }
    .feature strong {
      display: block;
      font-size: 17px;
      margin-top: 8px;
      margin-bottom: 14px;
    }
    .checkout {
      max-width: 460px;
      margin: 0 auto;
      background: #f5f5f7;
      border-radius: 18px;
      padding: 30px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.06);
    }
    label {
      display: block;
      font-size: 14px;
      font-weight: 700;
      margin: 18px 0 8px;
    }
    input {
      width: 100%;
      height: 48px;
      border-radius: 8px;
      border: 1px solid #d9d9df;
      padding: 0 14px;
      font-size: 16px;
      background: white;
    }
    .row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }
    #status {
      margin-top: 18px;
      text-align: center;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <div class="close" id="closeBtn" style="display:none;">×</div>
  <main class="page">
    <div class="hello">${name}</div>
    <h1 class="headline">${title}</h1>
    <div class="subtitle">${subtitle}</div>
    ${content}
  </main>
  ${script}
</body>
</html>
`;
}

function upgradePage(req, res) {
  const locale = getLocale(req.query.locale);
  const copy = translations[locale];
  const name = `${copy.hello}, ${safeText(req.query.external_uid || 'User')}`;

  const content = `
    <div class="plans">
      <div class="plan">
        <div class="badge">MOST POPULAR</div>
        <div class="icon">✹</div>
        <h2>${copy.elite}</h2>
        <button onclick="submitUpgrade()">${copy.select}</button>

        <div class="section-title">${copy.core}</div>
        <div class="features">
          ${features.map(([f]) =>
            ['Bookings', 'eCommerce'].includes(f)
              ? `<div class="feature"><strong>${f}</strong></div>`
              : `<div class="feature">${f}</div>`
          ).join('')}
        </div>

        <p id="status"></p>
      </div>
    </div>
  `;

  const script = `
<script>
async function submitUpgrade() {
  document.getElementById('status').innerText = '${copy.processing}';
  const params = new URLSearchParams(window.location.search);

  const response = await fetch('/upgrade', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(Object.fromEntries(params.entries()))
  });

  const data = await response.json();

  if (data.ssoUrl) {
    window.location.href = data.ssoUrl;
  } else {
    document.getElementById('status').innerText = data.error || 'Error';
  }
}
const isIframe = window.self !== window.top;
    const isIframe = window.self !== window.top;

const closeBtn = document.getElementById('closeBtn');

if (isIframe) {
  closeBtn.style.display = 'block';

  closeBtn.onclick = () => {
    if (window.publishOverlayAPI) {
      publishOverlayAPI.closeOverlay();
    } else {
      // fallback (just in case)
      window.history.back();
    }
  };
}
</script>`;

  res.send(pageShell({
    title: copy.upgradeTitle,
    subtitle: copy.upgradeSubtitle,
    name,
    content,
    script
  }));
}

function publishPage(req, res) {
  const locale = getLocale(req.query.locale);
  const copy = translations[locale];
  const name = `${copy.hello}, ${safeText(req.query.external_uid || 'User')}`;

  const content = `
    <div class="checkout">
      <h2>${copy.cardTitle}</h2>

      <label>${copy.cardNumber}</label>
      <input placeholder="4242 4242 4242 4242" />

      <div class="row">
        <div>
          <label>${copy.expiry}</label>
          <input placeholder="12/30" />
        </div>
        <div>
          <label>${copy.cvc}</label>
          <input placeholder="123" />
        </div>
      </div>

      <label>Name on card</label>
      <input value="${safeText(req.query.external_uid || '')}" />

      <br><br>
      <button onclick="submitPublish()">${copy.payAndPublish}</button>
      <p id="status"></p>
    </div>
  `;

  const script = `
<script>
async function submitPublish() {
  document.getElementById('status').innerText = '${copy.processing}';
  const params = new URLSearchParams(window.location.search);

  const response = await fetch('/publish', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(Object.fromEntries(params.entries()))
  });

  const data = await response.json();

  if (data.ssoUrl) {
    window.location.href = data.ssoUrl;
  } else {
    document.getElementById('status').innerText = data.error || 'Error';
  }
}
</script>`;

  res.send(pageShell({
    title: copy.publishTitle,
    subtitle: copy.publishSubtitle,
    name,
    content,
    script
  }));
}

app.get('/', (req, res) => {
  const { origin, planid } = req.query;

const normalizedOrigin = String(origin || '').toUpperCase();
const normalizedPlanId = String(planid || '');

if (normalizedOrigin === 'PUBLISH') {
  return publishPage(req, res);
}

if (normalizedOrigin === 'UPGRADE' && normalizedPlanId === '7') {
  return upgradePage(req, res);
}

  res.status(400).send('Invalid flow');
});

app.post('/publish', async (req, res) => {
  try {
    const { sitename, accountname } = req.body;

    if (!sitename || !accountname) {
      return res.status(400).json({ error: 'Missing sitename or accountname' });
    }

    const publishRes = await fetch(
      `${DUDA_API_BASE}/api/sites/multiscreen/publish/${encodeURIComponent(sitename)}`,
      {
        method: 'POST',
        headers: headers()
      }
    );

    if (!publishRes.ok && publishRes.status !== 204) {
      return res.status(500).json({ error: await publishRes.text() });
    }

    const ssoRes = await fetch(
      `${DUDA_API_BASE}/api/accounts/sso/${encodeURIComponent(accountname)}/link?site_name=${encodeURIComponent(sitename)}&target=EDITOR`,
      { headers: headers() }
    );

    const ssoData = await ssoRes.json();

    res.json({ ssoUrl: ssoData.url || ssoData.link || ssoData.sso_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/upgrade', async (req, res) => {
  try {
    const { sitename, accountname, origin, planid } = req.body;

    if (origin !== 'UPGRADE' || planid !== '7') {
      return res.status(400).json({ error: 'Invalid upgrade flow' });
    }

    if (!sitename || !accountname) {
      return res.status(400).json({ error: 'Missing sitename or accountname' });
    }

    const planRes = await fetch(
      `${DUDA_API_BASE}/api/sites/multiscreen/${encodeURIComponent(sitename)}/plan/22`,
      {
        method: 'POST',
        headers: headers()
      }
    );

    if (!planRes.ok && planRes.status !== 204) {
      return res.status(500).json({ error: await planRes.text() });
    }

    const ssoRes = await fetch(
      `${DUDA_API_BASE}/api/accounts/sso/${encodeURIComponent(accountname)}/link?site_name=${encodeURIComponent(sitename)}&target=STORE_MANAGEMENT`,
      { headers: headers() }
    );

    const ssoData = await ssoRes.json();

    res.json({ ssoUrl: ssoData.url || ssoData.link || ssoData.sso_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default app;