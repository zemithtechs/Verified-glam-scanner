"use client";

import { useState } from "react";
import { Check, Minus } from "lucide-react";
import { PRICING, generationsFor, money, num, paygCredits, yearlyPerMonth, yearlySavingsPercent } from "@/lib/pricing";

type Cell = string | boolean;
type Plan = 0 | 1 | 2;
type Row = { label: string; cells: [Cell, Cell, Cell] };
type Group = { title: string; rows: Row[] };

const P = PRICING;
const minPayg = paygCredits(P.payg.min);
const maxPayg = paygCredits(P.payg.max);
const plans = ["Starter", "Pro", "Pay as you go"] as const;

const groups: Group[] = [
  { title: "Price and billing", rows: [
    { label: "Price", cells: ["Free", `${money(P.monthly.price)}/mo or ${money(P.yearly.price)}/yr`, `${money(P.payg.min)} to ${money(P.payg.max)} once`] },
    { label: "Yearly saving", cells: [false, `${yearlySavingsPercent}% vs monthly, ${money(yearlyPerMonth, 2)}/mo equivalent`, false] },
    { label: "Free trial", cells: [false, `${P.yearly.trialDays} days on yearly, $0 today`, false] },
    { label: "Renews?", cells: ["No", "Yes, cancel before renewal", "No"] },
  ] },
  { title: "Credits and results", rows: [
    { label: "Credits", cells: [`${P.starter.credits} to start`, `${num(P.monthly.credits)}/mo or ${num(P.yearly.credits)}/yr`, `${num(minPayg)} to ${num(maxPayg)}, your choice`] },
    { label: "Approx. AI results", cells: [`${generationsFor(P.starter.credits)} to start`, `${generationsFor(P.monthly.credits)}/mo or ${num(generationsFor(P.yearly.credits))}/yr`, `${generationsFor(minPayg)} to ${generationsFor(maxPayg)}`] },
    { label: "Unused credits", cells: ["Remain in your account", "Monthly refresh, yearly last a year", "Never expire"] },
  ] },
  { title: "Tools and experience", rows: [
    { label: "Browse examples and guidance", cells: [true, true, true] },
    { label: "Use every tool with credits", cells: [true, true, true] },
    { label: "Download results", cells: [true, true, true] },
    { label: "Saved to My creations when signed in", cells: [true, true, true] },
    { label: "Priority for new tools", cells: [false, true, false] },
  ] },
];

function CellView({ value }: { value: Cell }) {
  if (value === true) return <span className="inline-grid h-6 w-6 place-items-center rounded-full bg-plum/10 text-plum"><Check size={15} strokeWidth={2.5} aria-label="Included" /></span>;
  if (value === false) return <Minus size={16} className="inline-block text-muted/45" aria-label="Not included" />;
  return <span>{value}</span>;
}

export function PlanCompare() {
  const [mobilePlan, setMobilePlan] = useState<Plan>(1);
  return <div className="overflow-hidden rounded-[22px] border border-line bg-white shadow-[0_10px_32px_rgba(31,18,32,0.035)]">
    <div className="grid grid-cols-3 gap-1 border-b border-line bg-cream p-2 md:hidden" role="group" aria-label="Compare a plan">
      {plans.map((plan, index) => <button key={plan} type="button" aria-pressed={mobilePlan === index} onClick={() => setMobilePlan(index as Plan)} className={`min-h-10 rounded-lg px-2 text-[12px] font-bold transition ${mobilePlan === index ? "bg-plum text-white shadow-sm" : "text-muted hover:bg-blush hover:text-plum"}`}>{plan}</button>)}
    </div>
    <div className="overflow-x-auto">
      <table className="w-full table-fixed border-collapse text-left">
        <caption className="sr-only">Compare Starter, Pro and Pay as you go plans</caption>
        <thead><tr className="border-b border-line bg-cream">
          <th scope="col" className="w-[50%] px-4 py-5 text-xs font-bold uppercase tracking-[0.12em] text-muted sm:px-6 md:w-[31%]">Included</th>
          {plans.map((plan, i) => <th key={plan} scope="col" className={`px-3 py-5 text-center text-[15px] font-bold sm:px-5 ${i === mobilePlan ? "table-cell" : "hidden md:table-cell"} ${i === 1 ? "bg-blush/65 text-plum" : "text-ink"}`}><span>{plan}</span>{i === 1 && <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.11em] text-berry">Recommended</span>}</th>)}
        </tr></thead>
        {groups.map(group => <tbody key={group.title}>
          <tr><th colSpan={4} scope="colgroup" className="border-b border-line bg-[#faf7f8] px-4 pb-2 pt-5 text-[11px] font-bold uppercase tracking-[0.14em] text-plum sm:px-6">{group.title}</th></tr>
          {group.rows.map(row => <tr key={row.label} className="border-b border-line/70 last:border-b-0 hover:bg-cream/60">
            <th scope="row" className="px-4 py-4 text-[13px] font-semibold leading-5 text-ink sm:px-6 sm:text-[14px]">{row.label}</th>
            {row.cells.map((value, i) => <td key={i} className={`px-3 py-4 text-center text-[12px] font-medium leading-5 text-ink sm:px-5 sm:text-[13px] ${i === mobilePlan ? "table-cell" : "hidden md:table-cell"} ${i === 1 ? "bg-blush/30" : ""}`}><CellView value={value} /></td>)}
          </tr>)}
        </tbody>)}
      </table>
    </div>
    <p className="border-t border-line bg-cream px-4 py-4 text-center text-xs leading-5 text-muted sm:px-6">A standard AI result uses {P.creditsPerGeneration} credits. You can see your balance before you create.</p>
  </div>;
}
