import './index.css';

const INDUSTRY_CALLOUT_RATIO = 1 / 10; // callouts per asset per year
const NHM_CALLOUT_RATIO = 1 / 20; // callouts per asset per year
const INDUSTRY_FIRST_FIX = 0.8;
const NHM_FIRST_FIX = 0.95;
const CALLOUT_COST = 100; // £ per callout or revisit

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const root = document.getElementById('root');

if (!root) {
  throw new Error('Unable to mount the ROI widget: missing #root element.');
}

root.innerHTML = `
  <section class="widget-shell" aria-label="NHM ROI widget">
    <header class="widget-hero">
      <div class="brand-mark">
        <span class="brand-icon">NH</span>
        <div>
          <p class="eyebrow">ROI calculator</p>
          <p class="hero-title">Planned maintenance savings</p>
          <p class="hero-subtitle">Estimate the callouts and revisit costs avoided by keeping your fleet on NHM planned preventative maintenance.</p>
        </div>
      </div>
      <div class="pill">Offline-ready HTML · Paste straight into Webflow</div>
    </header>

    <div class="widget-grid">
      <div class="panel input-panel">
        <div class="panel-heading">
          <div>
            <p class="section-kicker">Step 1</p>
            <h2 class="section-title">Enter your asset count</h2>
            <p class="section-desc">Adjust the total number of beds, hoists, baths, stand aids, and similar equipment covered by NHM PPM.</p>
          </div>
          <div class="badge-soft">Live updates</div>
        </div>

        <label class="field">
          <span class="label">Assets under NHM planned maintenance</span>
          <div class="input-wrap">
            <input id="asset-count" type="number" min="0" value="100" placeholder="e.g. 100" inputmode="numeric" />
            <span class="input-unit">assets</span>
          </div>
          <div class="helper">Changing this value instantly refreshes the savings estimates.</div>
        </label>

        <div class="assumptions">
          <strong>Assumptions</strong>
          <ul>
            <li>Industry callout rate: 1 callout per 10 assets per year</li>
            <li>NHM callout rate: 1 callout per 20 assets per year</li>
            <li>Industry first-fix rate: 80% | NHM first-fix rate: 95%</li>
            <li>Average cost per callout or revisit: £100</li>
          </ul>
        </div>
      </div>

      <div class="panel stats-panel" aria-live="polite">
        <div class="panel-heading">
          <div>
            <p class="section-kicker">Step 2</p>
            <h2 class="section-title">View your savings</h2>
            <p class="section-desc">Live calculations that stay bundled with this single HTML/CSS/JS block.</p>
          </div>
          <div class="badge-soft success">Independent</div>
        </div>

        <div class="summary-tile">
          <div>
            <p class="summary-label">Total annual savings</p>
            <p class="summary-value" data-field="total-savings">£0</p>
          </div>
          <p class="summary-subtext">Combined reduction in callout and return visit spend.</p>
        </div>

        <div class="stats-grid">
          <div class="stat-tile">
            <div class="stat-label">Industry callouts / year</div>
            <div class="stat-value" data-field="industry-callouts">0.0</div>
            <p class="stat-subtext">Typical performance without NHM.</p>
          </div>
          <div class="stat-tile">
            <div class="stat-label">NHM callouts / year</div>
            <div class="stat-value" data-field="nhm-callouts">0.0</div>
            <p class="stat-subtext">Expected with planned preventative maintenance.</p>
          </div>
          <div class="stat-tile stat-highlight">
            <div class="stat-label">Callout cost saved</div>
            <div class="stat-value" data-field="callout-savings">£0</div>
            <p class="stat-subtext">Fewer callouts across your assets.</p>
          </div>
          <div class="stat-tile stat-highlight">
            <div class="stat-label">Return visit cost saved</div>
            <div class="stat-value" data-field="return-savings">£0</div>
            <p class="stat-subtext">Higher first-fix success rate.</p>
          </div>
          <div class="stat-tile">
            <div class="stat-label">Estimated callouts avoided</div>
            <div class="stat-value" data-field="callouts-avoided">0.0</div>
            <p class="stat-subtext">Difference between typical performance and NHM.</p>
          </div>
          <div class="stat-tile muted">
            <div class="stat-label">Copy & paste ready</div>
            <div class="stat-value">HTML</div>
            <p class="stat-subtext">No external URLs needed—everything ships in this bundle.</p>
          </div>
        </div>
      </div>
    </div>

    <footer class="widget-footer">
      <p>Download the built <code>dist/</code> folder or copy the raw HTML/CSS/JS into Webflow. No hosted iframe or embed code required.</p>
    </footer>
  </section>
`;

const selectors = {
  assetInput: root.querySelector<HTMLInputElement>('#asset-count'),
  industryCallouts: root.querySelector<HTMLElement>('[data-field="industry-callouts"]'),
  nhmCallouts: root.querySelector<HTMLElement>('[data-field="nhm-callouts"]'),
  calloutSavings: root.querySelector<HTMLElement>('[data-field="callout-savings"]'),
  returnSavings: root.querySelector<HTMLElement>('[data-field="return-savings"]'),
  totalSavings: root.querySelector<HTMLElement>('[data-field="total-savings"]'),
  calloutsAvoided: root.querySelector<HTMLElement>('[data-field="callouts-avoided"]'),
};

const recalc = () => {
  if (!selectors.assetInput) return;
  const parsed = Number(selectors.assetInput.value);
  const assetCount = Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;

  const industryCallouts = assetCount * INDUSTRY_CALLOUT_RATIO;
  const nhmCallouts = assetCount * NHM_CALLOUT_RATIO;
  const calloutsSaved = Math.max(0, industryCallouts - nhmCallouts);
  const calloutSavingsValue = calloutsSaved * CALLOUT_COST;
  const returnVisitsIndustry = industryCallouts * (1 - INDUSTRY_FIRST_FIX);
  const returnVisitsNHM = nhmCallouts * (1 - NHM_FIRST_FIX);
  const returnVisitsSaved = Math.max(0, returnVisitsIndustry - returnVisitsNHM);
  const returnVisitSavingsValue = returnVisitsSaved * CALLOUT_COST;

  selectors.industryCallouts!.textContent = numberFormatter.format(industryCallouts);
  selectors.nhmCallouts!.textContent = numberFormatter.format(nhmCallouts);
  selectors.calloutSavings!.textContent = currencyFormatter.format(calloutSavingsValue);
  selectors.returnSavings!.textContent = currencyFormatter.format(returnVisitSavingsValue);
  selectors.totalSavings!.textContent = currencyFormatter.format(
    calloutSavingsValue + returnVisitSavingsValue,
  );
  selectors.calloutsAvoided!.textContent = numberFormatter.format(calloutsSaved);
};

selectors.assetInput?.addEventListener('input', recalc);
recalc();
