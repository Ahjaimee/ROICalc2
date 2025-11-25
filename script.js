const INDUSTRY_CALLOUT_RATIO = 1 / 10;
const NHM_CALLOUT_RATIO = 1 / 20;
const INDUSTRY_FIRST_FIX = 0.8;
const NHM_FIRST_FIX = 0.95;
const CALLOUT_COST = 100;

const numberFormatter = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
});

const selectors = {
  form: document.getElementById('inputs'),
  industryCallouts: document.querySelector('[data-field="industryCallouts"]'),
  nhmCallouts: document.querySelector('[data-field="nhmCallouts"]'),
  calloutSavings: document.querySelector('[data-field="calloutSavings"]'),
  returnSavings: document.querySelector('[data-field="returnSavings"]'),
  totalSavings: document.querySelector('[data-field="totalSavings"]'),
};

function clampToNumber(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 0) return 0;
  return numeric;
}

function recalc() {
  if (!selectors.form) return;

  const data = new FormData(selectors.form);
  const assets = clampToNumber(data.get('assets'));

  const industryCallouts = assets * INDUSTRY_CALLOUT_RATIO;
  const nhmCallouts = assets * NHM_CALLOUT_RATIO;
  const calloutsSaved = Math.max(0, industryCallouts - nhmCallouts);
  const calloutSavingsValue = calloutsSaved * CALLOUT_COST;

  const returnVisitsIndustry = industryCallouts * (1 - INDUSTRY_FIRST_FIX);
  const returnVisitsNHM = nhmCallouts * (1 - NHM_FIRST_FIX);
  const returnVisitsSaved = Math.max(0, returnVisitsIndustry - returnVisitsNHM);
  const returnVisitSavingsValue = returnVisitsSaved * CALLOUT_COST;

  selectors.industryCallouts.textContent = numberFormatter.format(industryCallouts);
  selectors.nhmCallouts.textContent = numberFormatter.format(nhmCallouts);
  selectors.calloutSavings.textContent = currencyFormatter.format(calloutSavingsValue);
  selectors.returnSavings.textContent = currencyFormatter.format(returnVisitSavingsValue);
  selectors.totalSavings.textContent = currencyFormatter.format(
    calloutSavingsValue + returnVisitSavingsValue,
  );
}

selectors.form?.addEventListener('input', recalc);
recalc();
