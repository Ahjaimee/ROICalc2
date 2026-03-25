const BASELINE_SAVINGS = 78294;
const BASELINE_HOMES = 13;
const MIN_HOMES = 1;
const MAX_HOMES = 30;

const selectors = {
  homesRange: document.getElementById('homesRange'),
  selectedHomes: document.querySelector('[data-field="selectedHomes"]'),
  estimatedSavings: document.querySelector('[data-field="estimatedSavings"]'),
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
});

function clampHomes(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return BASELINE_HOMES;
  return Math.min(MAX_HOMES, Math.max(MIN_HOMES, Math.round(numericValue)));
}

function calculateEstimatedSavings(selectedHomes) {
  return (BASELINE_SAVINGS / BASELINE_HOMES) * selectedHomes;
}

function updateCalculator(selectedHomesRaw) {
  const selectedHomes = clampHomes(selectedHomesRaw);
  const estimatedSavings = calculateEstimatedSavings(selectedHomes);

  if (selectors.homesRange) selectors.homesRange.value = String(selectedHomes);
  if (selectors.selectedHomes) selectors.selectedHomes.textContent = `${selectedHomes} homes`;
  if (selectors.estimatedSavings) {
    selectors.estimatedSavings.textContent = currencyFormatter.format(estimatedSavings);
  }
}

selectors.homesRange?.addEventListener('input', (event) => {
  updateCalculator(event.target.value);
});

updateCalculator(selectors.homesRange?.value ?? BASELINE_HOMES);
