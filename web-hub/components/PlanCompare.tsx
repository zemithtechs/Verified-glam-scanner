import { Check, Minus } from "lucide-react";
import { PRICING, generationsFor, money, num, paygCredits, perCredit, yearlyPerMonth, yearlySavingsPercent } from "@/lib/pricing";

type Cell = string | boolean;
type Row = { label: string; cells: [Cell, Cell, Cell, Cell] };
type Group = { title: string; rows: Row[] };

const P = PRICING;
const minPayg = paygCredits(P.payg.min);
const maxPayg = paygCredits(P.payg.max);

const GROUPS: Group[] = [
  {
    title: "Price",
    rows: [
      { label: "Price", cells: ["Free", `${money(P.monthly.price)} / month`, `${money(P.yearly.price)} / year`, `${money(P.payg.min)} to ${money(P.payg.max)}, one time`] },
      { label: "Effective monthly cost", cells: ["$0", money(P.monthly.price), `${money(yearlyPerMonth)} (save ${yearlySavingsPercent}%)`, "Pay only when you need credits"] },
      { label: "Free trial", cells: [false, false, `${P.yearly.trialDays} days, $0 today`, false] },
      { label: "Billing", cells: ["None", "Monthly, cancel anytime", "Yearly, cancel anytime", "One-time payment"] },
    ],
  },
  {
    title: "Credits",
    rows: [
      { label: "Credits included", cells: [`${P.starter.credits} to start`, `${num(P.monthly.credits)} per month`, `${num(P.yearly.credits)} per year`, `${num(minPayg)} to ${num(maxPayg)}, your choice`] },
      { label: "Price per credit", cells: ["Not applicable", money(perCredit.monthly, 3), money(perCredit.yearly, 3), money(perCredit.payg, 3)] },
      { label: `AI results (${P.creditsPerGeneration} credits each)`, cells: [`About ${generationsFor(P.starter.credits)}`, `About ${generationsFor(P.monthly.credits)} per month`, `About ${num(generationsFor(P.yearly.credits))} per year`, `About ${generationsFor(minPayg)} to ${generationsFor(maxPayg)}`] },
      { label: "What happens to unused credits", cells: ["Stay in your account", "Refresh each month", "Last the whole year", "Never expire"] },
    ],
  },
  {
    title: "What you get",
    rows: [
      { label: "Free-to-try tools", cells: [true, true, true, true] },
      { label: "Pro tools (Hairstyle Changer, Virtual Try-On, Face Beauty Editor)", cells: [false, true, true, true] },
      { label: "Ad-free browsing and results", cells: [false, true, true, true] },
      { label: "Download your results", cells: [true, true, true, true] },
      { label: "Full result history", cells: ["Recent results", true, true, true] },
      { label: "Priority access to new tools", cells: [false, true, true, false] },
    ],
  },
];

const HEAD = ["Starter", "Pro Monthly", "Pro Yearly", "Pay as you go"];

function CellView({ value }: { value: Cell }) {
  if (value === true) return <Check size={18} className="mx-auto text-berry" aria-label="Included" />;
  if (value === false) return <Minus size={18} className="mx-auto text-muted/50" aria-label="Not included" />;
  return <span>{value}</span>;
}

export function PlanCompare() {
  return (
    <div className="overflow-x-auto rounded-3xl border border-line bg-white">
      <table className="w-full min-w-[820px] border-collapse text-left">
        <caption className="sr-only">Compare Starter, Pro Monthly, Pro Yearly and Pay as you go</caption>
        <thead>
          <tr className="border-b border-line bg-blush/60">
            <th scope="col" className="w-[28%] px-5 py-4 text-sm font-semibold text-muted"><span className="sr-only">Feature</span></th>
            {HEAD.map((h, i) => (
              <th key={h} scope="col" className={`px-4 py-4 text-center font-display text-[17px] font-semibold ${i === 2 ? "text-plum" : "text-ink"}`}>
                {h}{i === 2 && <span className="mt-1 block text-[11px] font-semibold uppercase tracking-wide text-berry">Best value</span>}
              </th>
            ))}
          </tr>
        </thead>
        {GROUPS.map((g) => (
          <tbody key={g.title}>
            <tr><th colSpan={5} scope="colgroup" className="bg-cream px-5 pb-2 pt-5 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{g.title}</th></tr>
            {g.rows.map((r) => (
              <tr key={r.label} className="border-t border-line">
                <th scope="row" className="px-5 py-3.5 text-left text-[14px] font-medium leading-5 text-ink">{r.label}</th>
                {r.cells.map((c, i) => <td key={i} className={`px-4 py-3.5 text-center text-[14px] leading-5 text-ink ${i === 2 ? "bg-blush/30" : ""}`}><CellView value={c} /></td>)}
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}
