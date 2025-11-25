import React, { useMemo, useState } from 'react';

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

type SummaryTileProps = {
  label: string;
  value: string;
  subtext: string;
  highlight?: boolean;
};

const SummaryTile: React.FC<SummaryTileProps> = ({ label, value, subtext, highlight }) => (
  <div className="rounded-2xl bg-white shadow-sm p-4 flex flex-col gap-2 border border-slate-100">
    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 flex items-center gap-1">
      <span>{label}</span>
    </div>
    <div className={`text-3xl font-bold ${highlight ? 'text-nhm-accent' : 'text-slate-900'}`}>{value}</div>
    <p className="text-sm text-nhm-textSecondary leading-snug">{subtext}</p>
  </div>
);

type Tab = {
  id: string;
  label: string;
  active?: boolean;
  disabled?: boolean;
};

const tabs: Tab[] = [
  { id: 'callouts', label: 'Callout Savings', active: true },
  { id: 'staff', label: 'Staff Efficiency', disabled: true },
  { id: 'uptime', label: 'Downtime & Uptime', disabled: true },
  { id: 'compliance', label: 'Compliance & Risk', disabled: true },
];

const highlightStats = [
  { label: 'Avg. callouts avoided each year', value: '50%' },
  { label: 'Higher first-fix success', value: '+15%' },
  { label: 'Estimated annual savings', value: '£100k+' },
];

const App: React.FC = () => {
  const [assetInput, setAssetInput] = useState<string>('100');
  const [tabNotice, setTabNotice] = useState<string>('');

  const assetCount = useMemo(() => {
    const parsed = Number(assetInput);
    if (Number.isNaN(parsed) || parsed < 0) return 0;
    return parsed;
  }, [assetInput]);

  const calculations = useMemo(() => {
    // Baseline callout estimates
    const industryCallouts = assetCount * INDUSTRY_CALLOUT_RATIO;
    const nhmCallouts = assetCount * NHM_CALLOUT_RATIO;

    // Savings on callouts just from reduced callout rate
    const calloutsSaved = Math.max(0, industryCallouts - nhmCallouts);
    const calloutSavingsValue = calloutsSaved * CALLOUT_COST;

    // Return visits saved based on first-fix rates
    const returnVisitsIndustry = industryCallouts * (1 - INDUSTRY_FIRST_FIX);
    const returnVisitsNHM = nhmCallouts * (1 - NHM_FIRST_FIX);
    const returnVisitsSaved = Math.max(0, returnVisitsIndustry - returnVisitsNHM);
    const returnVisitSavingsValue = returnVisitsSaved * CALLOUT_COST;

    return {
      industryCallouts: Math.max(0, industryCallouts),
      nhmCallouts: Math.max(0, nhmCallouts),
      calloutSavingsValue,
      returnVisitSavingsValue,
    };
  }, [assetCount]);

  const handleTabClick = (tab: Tab) => {
    if (tab.disabled) {
      setTabNotice('Coming soon');
      setTimeout(() => setTabNotice(''), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-nhm-navy/5 via-white to-nhm-background text-nhm-textPrimary">
      <header className="border-b border-white/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-nhm-navy text-lg font-semibold uppercase text-white shadow-md shadow-nhm-navy/10">
              nhm+
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-nhm-textSecondary tracking-wide">ROI Calculator</p>
              <p className="text-lg font-bold text-slate-900">Planned maintenance savings</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3 text-xs text-nhm-textSecondary font-medium">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={`rounded-full px-3 py-2 transition ${
                  tab.active
                    ? 'bg-nhm-navy text-white shadow-sm'
                    : 'bg-white text-nhm-textSecondary border border-slate-200 hover:border-nhm-accent/60'
                } ${tab.disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {tab.label}
              </button>
            ))}
            {tabNotice && <span className="text-[11px] text-nhm-accent font-semibold">{tabNotice}</span>}
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:py-14">
        <section className="grid gap-8 lg:grid-cols-[1.05fr,1fr] items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-nhm-navy shadow-sm shadow-nhm-navy/10">
              <span className="h-2 w-2 rounded-full bg-nhm-accent" />
              Built for the web — instant results
            </div>
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-nhm-textSecondary">NH Maintenance</p>
              <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Run ROI forecasts right inside your webpage</h1>
              <p className="text-lg text-nhm-textSecondary">
                Add your estimated assets and instantly see how NHM planned maintenance reduces callouts and return visits.
                This web-ready calculator is designed to embed on a marketing page or customer portal.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {highlightStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-white/90 p-4 shadow-sm border border-white/80">
                  <p className="text-sm font-semibold text-nhm-textSecondary">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-xl shadow-nhm-navy/5 border border-slate-100 space-y-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Your assets</h2>
                <p className="text-sm text-nhm-textSecondary">Quickly test different scenarios and share the savings.</p>
              </div>
              <span className="rounded-full bg-nhm-navy/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">Live</span>
            </div>

            <label className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                Number of assets under NHM PPM
                <span className="rounded-full bg-nhm-accent px-2 py-0.5 text-[11px] text-white" title="Beds, hoists, baths, stand aids, etc.">
                  ?
                </span>
              </div>
              <input
                type="number"
                min={0}
                value={assetInput}
                onChange={(e) => setAssetInput(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-lg font-semibold text-slate-900 shadow-inner focus:border-nhm-accent focus:outline-none focus:ring-2 focus:ring-nhm-accent/30"
                placeholder="e.g. 100"
              />
              <p className="text-xs text-nhm-textSecondary">Beds, hoists, baths, stand aids, and similar equipment.</p>
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <SummaryTile
                label="Industry callouts / year"
                value={numberFormatter.format(calculations.industryCallouts)}
                subtext="If you followed typical industry performance."
              />
              <SummaryTile
                label="NHM callouts / year"
                value={numberFormatter.format(calculations.nhmCallouts)}
                subtext="Under NHM planned preventative maintenance."
              />
              <SummaryTile
                label="Callout cost saved"
                value={currencyFormatter.format(calculations.calloutSavingsValue)}
                subtext="Fewer callouts across your assets."
                highlight
              />
              <SummaryTile
                label="Return visit cost saved"
                value={currencyFormatter.format(calculations.returnVisitSavingsValue)}
                subtext="Higher first-fix success rate."
                highlight
              />
            </div>

            <div className="rounded-2xl border border-dashed border-slate-200 bg-nhm-background p-4 text-sm text-nhm-textSecondary space-y-1">
              <p className="font-semibold text-slate-800">Assumptions</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Industry callout rate: 1 callout per 10 assets per year</li>
                <li>NHM callout rate: 1 callout per 20 assets per year</li>
                <li>Industry first-fix rate: 80% | NHM first-fix rate: 95%</li>
                <li>Average cost per callout or revisit: £100</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="grid gap-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-nhm-navy/5 lg:grid-cols-[1.3fr,1fr] lg:gap-10">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-nhm-textSecondary">Shareable summary</p>
            <h3 className="text-2xl font-bold text-slate-900">Explain the value on one page</h3>
            <p className="text-nhm-textSecondary">
              Use these figures in proposals, websites, or customer portals. The calculator is responsive and ready to embed
              wherever you need to show ROI. Update the asset count to instantly recalculate every metric.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <SummaryTile
                label="Total annual savings"
                value={currencyFormatter.format(
                  calculations.calloutSavingsValue + calculations.returnVisitSavingsValue,
                )}
                subtext="Combined impact of fewer callouts and higher first-time fix."
                highlight
              />
              <SummaryTile
                label="Estimated callouts avoided"
                value={numberFormatter.format(calculations.industryCallouts - calculations.nhmCallouts)}
                subtext="Difference between typical performance and NHM approach."
              />
            </div>
          </div>

          <div className="space-y-4 rounded-2xl bg-nhm-background p-5 border border-slate-200">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-nhm-accent text-white font-bold">✓</span>
              <div>
                <p className="text-sm font-semibold text-slate-900">Webpage-friendly widget</p>
                <p className="text-xs text-nhm-textSecondary">Drop into a landing page, share the link, or run it as a standalone app.</p>
              </div>
            </div>
            <ul className="space-y-3 text-sm text-nhm-textSecondary">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-nhm-navy" />
                Responsive layout that works on desktop or tablet embeds.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-nhm-navy" />
                Copy-friendly language to paste into proposals or webpages.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-nhm-navy" />
                Live calculations update as visitors adjust the asset count.
              </li>
            </ul>
            <div className="flex flex-wrap gap-3 pt-2">
              <button className="rounded-xl bg-nhm-navy px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-nhm-navy/20 hover:bg-nhm-navy/90">
                Copy embed link
              </button>
              <button className="rounded-xl border border-nhm-accent/60 px-4 py-2 text-sm font-semibold text-nhm-navy bg-white hover:border-nhm-accent">
                Download summary
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
