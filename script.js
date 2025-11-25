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
  calloutsAvoided: document.querySelector('[data-field="calloutsAvoided"]'),
};

function clampNumber(value, min = 0, max = Number.POSITIVE_INFINITY) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return min;
  return Math.min(max, Math.max(min, numeric));
}

function recalc() {
  if (!selectors.form) return;

  const data = new FormData(selectors.form);
  const assets = clampNumber(data.get('assets')); // asset count
  const calloutCost = clampNumber(data.get('calloutCost'));
  const industryRate = clampNumber(data.get('industryRate'));
  const nhmRate = clampNumber(data.get('nhmRate'));
  const industryFix = clampNumber(data.get('industryFix'), 0, 1);
  const nhmFix = clampNumber(data.get('nhmFix'), 0, 1);

  const industryCallouts = assets * industryRate;
  const nhmCallouts = assets * nhmRate;
  const calloutsAvoided = Math.max(0, industryCallouts - nhmCallouts);
  const calloutSavingsValue = calloutsAvoided * calloutCost;

  const returnVisitsIndustry = industryCallouts * (1 - industryFix);
  const returnVisitsNhm = nhmCallouts * (1 - nhmFix);
  const returnVisitsAvoided = Math.max(0, returnVisitsIndustry - returnVisitsNhm);
  const returnVisitSavingsValue = returnVisitsAvoided * calloutCost;

  selectors.industryCallouts.textContent = numberFormatter.format(industryCallouts);
  selectors.nhmCallouts.textContent = numberFormatter.format(nhmCallouts);
  selectors.calloutSavings.textContent = currencyFormatter.format(calloutSavingsValue);
  selectors.returnSavings.textContent = currencyFormatter.format(returnVisitSavingsValue);
  selectors.totalSavings.textContent = currencyFormatter.format(calloutSavingsValue + returnVisitSavingsValue);
  selectors.calloutsAvoided.textContent = numberFormatter.format(calloutsAvoided);
}

selectors.form?.addEventListener('input', recalc);
recalc();
