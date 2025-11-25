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

const sidebarLinks = ['Home', 'Solutions', 'Success', 'Resources', 'Pricing', 'Demo', 'Account'];
const sidebarFooterLinks = ['Help', 'Legal', 'Log out'];

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
      return;
    }
  };

  return (
    <div className="min-h-screen bg-nhm-background text-nhm-textPrimary">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 bg-nhm-navy text-white flex-col justify-between py-8 px-6">
          <div className="space-y-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-lg font-semibold uppercase">
                nhm+
              </div>
              <div>
                <p className="text-sm text-white/60">NH Maintenance</p>
                <p className="text-xl font-semibold">ROI</p>
              </div>
            </div>
            <nav className="space-y-2">
              {sidebarLinks.map((link) => (
                <div
                  key={link}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-white/10 transition ${
                    link === 'Success' ? 'bg-white/10 text-white' : 'text-white/70'
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-white/40" />
                  <span>{link}</span>
                </div>
              ))}
            </nav>
          </div>
          <div className="space-y-2">
            {sidebarFooterLinks.map((link) => (
              <div
                key={link}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/10 transition"
              >
                <span className="h-2 w-2 rounded-full bg-white/30" />
                <span>{link}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-10">
          <header className="mb-6">
            <p className="text-sm font-semibold text-nhm-textSecondary uppercase tracking-wide mb-1">NHM Calculator</p>
            <h1 className="text-3xl font-bold text-slate-900">ROI Calculator</h1>
            <p className="text-nhm-textSecondary mt-2">
              See how much you could save with NHM planned maintenance.
            </p>
          </header>

          {/* Tabs */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition relative ${
                  tab.active
                    ? 'bg-white border-nhm-accent text-slate-900 shadow-sm'
                    : 'border-transparent bg-white/60 text-nhm-textSecondary'
                } ${tab.disabled ? 'opacity-70 cursor-not-allowed' : 'hover:border-nhm-accent/70'}`}
                title={tab.disabled ? 'Coming soon' : ''}
              >
                {tab.label}
                {tab.disabled && (
                  <span className="ml-2 text-[10px] uppercase tracking-wide text-slate-400">Soon</span>
                )}
              </button>
            ))}
            {tabNotice && <span className="text-xs text-nhm-textSecondary">{tabNotice}</span>}
          </div>

          <section className="grid grid-cols-1 lg:grid-cols-[1fr,1.2fr] gap-6">
            {/* Input card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Equipment & Assumptions</h2>
                  <p className="text-sm text-nhm-textSecondary">Update the number of assets covered by NHM PPM.</p>
                </div>
                <span
                  className="text-xs text-white bg-nhm-navy/80 rounded-full px-3 py-1 self-start"
                  title="Plan inputs to see savings"
                >
                  Live update
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  Number of assets under NHM PPM
                  <span
                    className="text-xs text-white bg-nhm-accent rounded-full px-2 py-0.5"
                    title="Beds, hoists, baths, stand aids, etc."
                  >
                    ?
                  </span>
                </label>
                <input
                  type="number"
                  min={0}
                  value={assetInput}
                  onChange={(e) => setAssetInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-lg font-semibold text-slate-900 shadow-inner focus:border-nhm-accent focus:outline-none focus:ring-2 focus:ring-nhm-accent/30"
                  placeholder="Enter asset count"
                />
                <p className="text-xs text-nhm-textSecondary">Beds, hoists, baths, stand aids, etc.</p>
              </div>

              <div className="rounded-xl bg-nhm-background p-4 border border-dashed border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-nhm-accent border border-nhm-accent/20">
                    i
                  </span>
                  Assumptions
                </div>
                <ul className="text-sm text-nhm-textSecondary space-y-1">
                  <li>Industry callout rate: 1 callout per 10 assets per year</li>
                  <li>NHM callout rate: 1 callout per 20 assets per year</li>
                  <li>Industry first-fix rate: 80%</li>
                  <li>NHM first-fix rate: 95%</li>
                  <li>Average cost per callout or revisit: £100</li>
                </ul>
              </div>
            </div>

            {/* Summary grid */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-nhm-textSecondary uppercase tracking-wide">Callout savings</p>
                  <h3 className="text-2xl font-bold text-slate-900">Impact overview</h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-nhm-textSecondary">
                  <span className="h-2 w-2 rounded-full bg-nhm-accent" />
                  Live calculation
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  subtext="From fewer callouts across your assets."
                  highlight
                />
                <SummaryTile
                  label="Return visit cost saved"
                  value={currencyFormatter.format(calculations.returnVisitSavingsValue)}
                  subtext="From a higher first-fix success rate."
                  highlight
                />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default App;
