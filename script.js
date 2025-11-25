const INDUSTRY_CALLOUT_RATIO = 1 / 10;
const NHM_CALLOUT_RATIO = 1 / 20;
const INDUSTRY_FIRST_FIX = 0.8;
const NHM_FIRST_FIX = 0.95;
const CALLOUT_COST = 100;
const MAX_ASSETS = 10000;

const numberFormatter = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
});

const selectors = {
  form: document.getElementById('inputs'),
  assetNumber: document.querySelector('input[name="assets"]'),
  assetSlider: document.querySelector('input[name="assetsRange"]'),
  industryCallouts: document.querySelector('[data-field="industryCallouts"]'),
  nhmCallouts: document.querySelector('[data-field="nhmCallouts"]'),
  calloutsSaved: document.querySelector('[data-field="calloutsSaved"]'),
  returnVisitsSaved: document.querySelector('[data-field="returnVisitsSaved"]'),
  calloutSavings: document.querySelector('[data-field="calloutSavings"]'),
  returnSavings: document.querySelector('[data-field="returnSavings"]'),
  totalSavings: document.querySelector('[data-field="totalSavings"]'),
};

const tabButtons = document.querySelectorAll('[data-tab-target]');
const tabPanels = document.querySelectorAll('.tab-panel');

function clampAssets(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 0) return 0;
  return Math.min(MAX_ASSETS, Math.round(numeric));
}

function syncAssetInputs(source) {
  if (!selectors.assetNumber || !selectors.assetSlider) return;

  const clampedValue = clampAssets(source.value);

  selectors.assetNumber.value = clampedValue;
  selectors.assetSlider.value = clampedValue;
}

function activateTab(target) {
  tabButtons.forEach((button) => {
    const isActive = button.dataset.tabTarget === target;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-selected', String(isActive));
  });

  tabPanels.forEach((panel) => {
    const isActive = panel.id === `tab-${target}`;
    panel.classList.toggle('is-active', isActive);
    panel.setAttribute('aria-hidden', String(!isActive));
    panel.tabIndex = isActive ? 0 : -1;
  });
}

function recalc() {
  if (!selectors.form) return;

  const assets = clampAssets(selectors.assetNumber?.value ?? 0);
  syncAssetInputs({ value: assets });

  const industryCallouts = Math.round(assets * INDUSTRY_CALLOUT_RATIO);
  const nhmCallouts = Math.round(assets * NHM_CALLOUT_RATIO);
  const calloutsSaved = Math.max(0, industryCallouts - nhmCallouts);
  const calloutSavingsValue = calloutsSaved * CALLOUT_COST;

  const returnVisitsIndustry = Math.round(industryCallouts * (1 - INDUSTRY_FIRST_FIX));
  const returnVisitsNHM = Math.round(nhmCallouts * (1 - NHM_FIRST_FIX));
  const returnVisitsSaved = Math.max(0, returnVisitsIndustry - returnVisitsNHM);
  const returnVisitSavingsValue = returnVisitsSaved * CALLOUT_COST;

  selectors.industryCallouts.textContent = numberFormatter.format(industryCallouts);
  selectors.nhmCallouts.textContent = numberFormatter.format(nhmCallouts);
  selectors.calloutsSaved.textContent = numberFormatter.format(calloutsSaved);
  selectors.returnVisitsSaved.textContent = numberFormatter.format(returnVisitsSaved);
  selectors.calloutSavings.textContent = currencyFormatter.format(calloutSavingsValue);
  selectors.returnSavings.textContent = currencyFormatter.format(returnVisitSavingsValue);
  selectors.totalSavings.textContent = currencyFormatter.format(
    calloutSavingsValue + returnVisitSavingsValue,
  );
}

selectors.assetNumber?.addEventListener('input', (event) => {
  syncAssetInputs(event.target);
  recalc();
});

selectors.assetSlider?.addEventListener('input', (event) => {
  syncAssetInputs(event.target);
  recalc();
});
tabButtons.forEach((button) => {
  button.addEventListener('click', () => activateTab(button.dataset.tabTarget));
});

if (selectors.assetNumber) {
  syncAssetInputs(selectors.assetNumber);
}

activateTab('callouts');
recalc();
