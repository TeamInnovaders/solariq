import { useState } from "react";

// ─── Maryland / Regional Defaults (2026) ───
const DEFAULTS = {
  electricRate: 0.179,       // MD avg $/kWh 2024
  rateIncrease: 0.04,        // 4% annual utility rate increase
  costPerWatt: 2.61,         // MD avg installed $/W
  solarDegradation: 0.005,   // 0.5% annual panel degradation
  systemLifespan: 25,        // years
  sunHoursPerDay: 4.2,       // MD avg peak sun hours
  srecValuePerMwh: 65,       // MD SREC market value
  stateRebate: 1000,         // MD Residential Clean Energy Rebate
  salesTaxRate: 0.06,        // MD sales tax (exempted for solar)
  propertyValueIncrease: 0.038, // ~3.8% home value increase
  leaseMonthly: 113,         // Typical MD solar lease starting payment
  leaseEscalation: 0.029,    // 2.9% annual lease escalation
  ppaRate: 0.12,             // $/kWh PPA rate
  ppaEscalation: 0.029,
  loanApr: 0.065,
  loanTerm: 20,
  // 2026: Federal ITC expired for homeowner-owned. Still available for leases/PPAs via Section 48E
  federalItcPurchase: 0,     // 0% for homeowner-owned in 2026+
  federalItcLeasePpa: 0.30,  // 30% for third-party owned (leases/PPAs) through 2027
};

const f$ = (n) => n < 0 ? `-$${Math.abs(n).toLocaleString("en-US", {minimumFractionDigits: 0, maximumFractionDigits: 0})}` : `$${n.toLocaleString("en-US", {minimumFractionDigits: 0, maximumFractionDigits: 0})}`;
const f$d = (n) => `$${n.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

const S = {
  page: { minHeight: "100vh", background: "#0c1117", color: "#e8ecf1", fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif" },
  wrap: { maxWidth: 580, margin: "0 auto", padding: "20px 16px 40px" },
  card: { background: "#131920", borderRadius: 16, border: "1px solid #1e2a36", padding: 22, marginBottom: 16 },
  label: { display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#8a9bb0", marginBottom: 6 },
  inputWrap: (f) => ({ display: "flex", alignItems: "center", background: "#0c1117", border: `1.5px solid ${f ? "#f59e0b" : "#1e2a36"}`, borderRadius: 10, padding: "0 14px", transition: "border-color 0.15s" }),
  input: { flex: 1, background: "transparent", border: "none", outline: "none", color: "#e8ecf1", fontSize: 22, fontWeight: 700, padding: "14px 0", fontFamily: "'JetBrains Mono', monospace", width: "100%" },
  prefix: { color: "#f59e0b", fontWeight: 800, fontSize: 22, marginRight: 4 },
  suffix: { color: "#8a9bb0", fontSize: 13, fontWeight: 500, marginLeft: 8 },
  hint: { fontSize: 12, color: "#6b7f94", marginTop: 4, marginBottom: 0, lineHeight: 1.4 },
  divider: { height: 1, background: "#1e2a36", margin: "16px 0" },
  accent: "#f59e0b", green: "#10b981", red: "#ef4444", blue: "#3b82f6", muted: "#8a9bb0", dimmed: "#6b7f94",
  sun: "#f59e0b",
};

function Input({ label, value, onChange, prefix, suffix, hint, step, min }) {
  const [f, setF] = useState(false);
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={S.label}>{label}</label>
      <div style={S.inputWrap(f)} onFocus={() => setF(true)} onBlur={() => setF(false)}>
        {prefix && <span style={S.prefix}>{prefix}</span>}
        <input type="number" value={value} onChange={(e) => onChange(e.target.value)} step={step || "any"} min={min || "0"} style={S.input} />
        {suffix && <span style={S.suffix}>{suffix}</span>}
      </div>
      {hint && <p style={S.hint}>{hint}</p>}
    </div>
  );
}

function Stat({ label, value, color, sub, big }) {
  return (
    <div style={{ background: "#0c1117", borderRadius: 10, padding: big ? "18px 10px" : "12px 8px", textAlign: "center" }}>
      <div style={{ fontSize: 10, color: S.muted, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: big ? 26 : 16, fontWeight: 800, color: color || "#e8ecf1", fontFamily: "'JetBrains Mono', monospace", marginTop: 4, lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: S.muted, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function Row({ label, value, color, sub }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
      <div>
        <span style={{ fontSize: 13, color: S.muted, fontWeight: 500 }}>{label}</span>
        {sub && <div style={{ fontSize: 11, color: S.dimmed }}>{sub}</div>}
      </div>
      <span style={{ fontSize: 17, fontWeight: 700, color: color || "#e8ecf1", fontFamily: "'JetBrains Mono', monospace" }}>{value}</span>
    </div>
  );
}

function CompareCard({ title, color, badge, rows, highlight, highlightColor }) {
  return (
    <div style={{ ...S.card, borderColor: color + "44", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontSize: 16, fontWeight: 800, color }}>{title}</span>
        {badge && <span style={{ fontSize: 11, background: color + "22", color, padding: "4px 12px", borderRadius: 20, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{badge}</span>}
      </div>
      {rows.map((r, i) => <Row key={i} label={r[0]} value={r[1]} color={r[2]} sub={r[3]} />)}
      {highlight && (
        <div style={{ background: (highlightColor || color) + "11", border: `1px solid ${(highlightColor || color)}33`, borderRadius: 10, padding: "14px 14px", textAlign: "center", marginTop: 10 }}>
          <div style={{ fontSize: 10, color: S.muted, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>{highlight[0]}</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: highlightColor || color, fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>{highlight[1]}</div>
        </div>
      )}
    </div>
  );
}

function AdSlot() {
  return (
    <div style={{ background: "#0f151b", border: "1px dashed #1e2a36", borderRadius: 12, padding: "24px 18px", textAlign: "center", marginBottom: 16, minHeight: 90, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 10, color: S.dimmed, textTransform: "uppercase", letterSpacing: "0.08em" }}>Sponsored</div>
      <div style={{ fontSize: 9, color: "#2a3440", marginTop: 4 }}>Ad unit — replace with AdSense code</div>
    </div>
  );
}

// ─── Sun Logo ───
function SunLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="8" fill="#f59e0b" />
      {[0,45,90,135,180,225,270,315].map((a, i) => {
        const r1 = 11, r2 = 15, rad = a * Math.PI / 180;
        return <line key={i} x1={16 + r1*Math.cos(rad)} y1={16 + r1*Math.sin(rad)} x2={16 + r2*Math.cos(rad)} y2={16 + r2*Math.sin(rad)} stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />;
      })}
    </svg>
  );
}

export default function SolarCalc() {
  const [monthlyBill, setMonthlyBill] = useState("180");
  const [homeValue, setHomeValue] = useState("350000");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [electricRate, setElectricRate] = useState("0.179");
  const [rateIncrease, setRateIncrease] = useState("4");
  const [costPerWatt, setCostPerWatt] = useState("2.61");
  const [showLead, setShowLead] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [tab, setTab] = useState("overview");

  // Parse inputs
  const bill = parseFloat(monthlyBill) || 0;
  const hv = parseFloat(homeValue) || 0;
  const er = parseFloat(electricRate) || DEFAULTS.electricRate;
  const ri = (parseFloat(rateIncrease) || 4) / 100;
  const cpw = parseFloat(costPerWatt) || DEFAULTS.costPerWatt;

  // ─── Core Calculations ───
  const annualUsageKwh = (bill / er) * 12;
  const dailyUsageKwh = annualUsageKwh / 365;
  const systemSizeKw = Math.ceil((dailyUsageKwh / DEFAULTS.sunHoursPerDay) * 10) / 10;
  const systemSizeW = systemSizeKw * 1000;
  const numPanels = Math.ceil(systemSizeW / 400); // 400W panels
  const annualProductionKwh = systemSizeKw * DEFAULTS.sunHoursPerDay * 365;
  const annualProductionMwh = annualProductionKwh / 1000;

  // ─── PURCHASE PATH ───
  const grossSystemCost = systemSizeW * cpw;
  const salesTaxSaved = grossSystemCost * DEFAULTS.salesTaxRate;
  const netPurchaseCost = grossSystemCost - DEFAULTS.stateRebate; // No federal ITC in 2026 for purchase
  const annualSrecIncome = annualProductionMwh * DEFAULTS.srecValuePerMwh;
  const propertyValueAdd = hv * DEFAULTS.propertyValueIncrease;

  // 25-year savings calculation (purchase)
  let purchaseSavings25 = 0, purchaseCumulativeByYear = [];
  for (let y = 0; y < 25; y++) {
    const yearRate = er * Math.pow(1 + ri, y);
    const yearProduction = annualProductionKwh * Math.pow(1 - DEFAULTS.solarDegradation, y);
    const yearSavings = yearProduction * yearRate + annualSrecIncome * Math.pow(0.97, y); // SRECs decline slightly
    purchaseSavings25 += yearSavings;
    purchaseCumulativeByYear.push(purchaseSavings25 - netPurchaseCost);
  }
  const purchasePaybackYear = purchaseCumulativeByYear.findIndex(v => v >= 0) + 1;
  const purchaseRoi = netPurchaseCost > 0 ? ((purchaseSavings25 - netPurchaseCost) / netPurchaseCost * 100) : 0;

  // ─── LEASE PATH (SunRun model) ───
  let leaseTotalCost25 = 0, leaseSavings25 = 0;
  for (let y = 0; y < 25; y++) {
    const yearRate = er * Math.pow(1 + ri, y);
    const yearProduction = annualProductionKwh * Math.pow(1 - DEFAULTS.solarDegradation, y);
    const yearElecSavings = yearProduction * yearRate;
    const yearLeasePayment = DEFAULTS.leaseMonthly * 12 * Math.pow(1 + DEFAULTS.leaseEscalation, y);
    leaseTotalCost25 += yearLeasePayment;
    leaseSavings25 += (yearElecSavings - yearLeasePayment);
  }

  // ─── PPA PATH ───
  let ppaTotalCost25 = 0, ppaSavings25 = 0;
  for (let y = 0; y < 25; y++) {
    const yearRate = er * Math.pow(1 + ri, y);
    const yearProduction = annualProductionKwh * Math.pow(1 - DEFAULTS.solarDegradation, y);
    const yearElecCostWithout = yearProduction * yearRate;
    const yearPpaRate = DEFAULTS.ppaRate * Math.pow(1 + DEFAULTS.ppaEscalation, y);
    const yearPpaCost = yearProduction * yearPpaRate;
    ppaTotalCost25 += yearPpaCost;
    ppaSavings25 += (yearElecCostWithout - yearPpaCost);
  }

  // ─── Utility cost without solar (25 years) ───
  let utilityCost25 = 0;
  for (let y = 0; y < 25; y++) {
    utilityCost25 += annualUsageKwh * er * Math.pow(1 + ri, y);
  }

  // Year 1 savings
  const year1ElecSavings = annualProductionKwh * er;
  const year1LeasePayment = DEFAULTS.leaseMonthly * 12;
  const year1LeaseSavings = year1ElecSavings - year1LeasePayment;
  const year1PpaCost = annualProductionKwh * DEFAULTS.ppaRate;
  const year1PpaSavings = year1ElecSavings - year1PpaCost;

  const handleLeadSubmit = () => {
    if (leadName && leadEmail.includes("@") && leadPhone.length >= 10) {
      setLeadSubmitted(true);
      // In production: POST to your backend/CRM/SunRun referral form
    }
  };

  return (
    <div style={S.page}>
      <style>{`html, body, #root { margin: 0; padding: 0; background: #0c1117; min-height: 100vh; }`}</style>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={S.wrap}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <SunLogo />
            <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em" }}>Solar<span style={{ color: S.sun }}>IQ</span></span>
          </div>
          <p style={{ color: S.muted, fontSize: 14, margin: 0, fontWeight: 500 }}>See if solar makes sense for your home</p>
          <p style={{ color: S.dimmed, fontSize: 12, margin: "4px 0 0", fontWeight: 500 }}>Updated for 2026 tax law changes · Maryland data</p>
        </div>

        {/* 2026 Alert Banner */}
        <div style={{ background: "#f59e0b11", border: "1px solid #f59e0b33", borderRadius: 12, padding: "14px 18px", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: S.sun }}>2026 Federal Tax Credit Update</div>
          <p style={{ fontSize: 12, color: S.muted, margin: "6px 0 0", lineHeight: 1.6 }}>
            The 30% federal solar tax credit for homeowner-purchased systems expired Dec 31, 2025. Solar leases and PPAs (like SunRun) still qualify for the federal credit through 2027 — making leasing more attractive than ever.
          </p>
        </div>

        {/* Inputs */}
        <div style={S.card}>
          <Input label="Monthly Electric Bill" value={monthlyBill} onChange={setMonthlyBill} prefix="$" hint="Your current average monthly electric bill" />
          <Input label="Home Value (estimated)" value={homeValue} onChange={setHomeValue} prefix="$" hint="Used to calculate property value increase from solar" />

          <button onClick={() => setShowAdvanced(!showAdvanced)} style={{ background: "none", border: "none", color: S.muted, fontSize: 12, cursor: "pointer", padding: 0, textDecoration: "underline", fontWeight: 600 }}>
            {showAdvanced ? "Hide" : "Customize"} energy assumptions
          </button>
          {showAdvanced && (
            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              <Input label="Electric Rate" value={electricRate} onChange={setElectricRate} prefix="$" suffix="/kWh" />
              <Input label="Rate Increase" value={rateIncrease} onChange={setRateIncrease} suffix="%/yr" />
              <Input label="Cost/Watt" value={costPerWatt} onChange={setCostPerWatt} prefix="$" suffix="/W" />
            </div>
          )}
        </div>

        {/* System Recommendation */}
        <div style={S.card}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: S.muted, marginBottom: 12 }}>Your Recommended System</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Stat label="System Size" value={`${systemSizeKw} kW`} color={S.sun} big />
            <Stat label="Panels" value={`${numPanels}`} color="#e8ecf1" sub="400W each" big />
            <Stat label="Annual Output" value={`${(annualProductionKwh/1000).toFixed(1)}K kWh`} color={S.green} sub="per year" big />
            <Stat label="Offset" value={`${Math.min(100, Math.round(annualProductionKwh / annualUsageKwh * 100))}%`} color={S.green} sub="of your usage" big />
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: 16, borderBottom: "2px solid #1e2a36" }}>
          {[{ id: "overview", label: "Overview" }, { id: "compare", label: "Buy vs Lease vs PPA" }, { id: "incentives", label: "MD Incentives" }].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, background: tab === t.id ? S.sun : "transparent",
              color: tab === t.id ? "#0c1117" : S.muted, border: "none",
              borderRadius: "8px 8px 0 0", padding: "12px 0", fontSize: 13,
              fontWeight: 800, cursor: "pointer", textTransform: "uppercase",
              letterSpacing: "0.06em", fontFamily: "'Outfit', sans-serif", transition: "all 0.15s",
            }}>{t.label}</button>
          ))}
        </div>

        {/* ═══ OVERVIEW TAB ═══ */}
        {tab === "overview" && (<>
          <div style={S.card}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: S.muted, marginBottom: 12 }}>25-Year Financial Summary</div>
            <Row label="Cost of electricity WITHOUT solar" value={f$(utilityCost25)} color={S.red} sub="At current rates + 4%/yr increase" />
            <div style={S.divider} />
            <Row label="Purchase — 25yr net savings" value={f$(purchaseSavings25 - netPurchaseCost)} color={S.green} sub={`After ${f$(netPurchaseCost)} system cost`} />
            <Row label="Lease — 25yr net savings" value={f$(leaseSavings25)} color={S.green} sub="$0 down, payments included" />
            <Row label="PPA — 25yr net savings" value={f$(ppaSavings25)} color={S.green} sub={`At ${f$d(DEFAULTS.ppaRate)}/kWh starting rate`} />
            <div style={S.divider} />
            <Row label="Property value increase" value={`+${f$(propertyValueAdd)}`} color={S.blue} sub="~3.8% avg increase from solar (purchase only)" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Stat label="Without Solar (25yr)" value={f$(utilityCost25)} color={S.red} big />
            <Stat label="Best Solar Option" value={f$(Math.max(purchaseSavings25 - netPurchaseCost, leaseSavings25, ppaSavings25))} color={S.green} sub="25yr savings" big />
          </div>
          <AdSlot />
        </>)}

        {/* ═══ COMPARE TAB ═══ */}
        {tab === "compare" && (<>
          <CompareCard
            title="Cash Purchase" color={S.blue} badge="You own it"
            rows={[
              ["Gross system cost", f$(grossSystemCost), "#e8ecf1"],
              ["Sales tax exemption (6%)", `-${f$(salesTaxSaved)}`, S.green],
              ["MD Clean Energy Rebate", `-${f$(DEFAULTS.stateRebate)}`, S.green],
              ["Federal tax credit (2026)", "$0", S.red, "Expired for homeowner purchases"],
              ["Net cost after incentives", f$(netPurchaseCost), S.sun],
              ["Year 1 electricity savings", f$(year1ElecSavings), S.green],
              ["Annual SREC income", f$(annualSrecIncome), S.green, `${annualProductionMwh.toFixed(1)} MWh × $${DEFAULTS.srecValuePerMwh}`],
              ["Payback period", `${purchasePaybackYear} years`, purchasePaybackYear <= 10 ? S.green : S.sun],
            ]}
            highlight={["25-Year Net Savings", f$(purchaseSavings25 - netPurchaseCost)]}
            highlightColor={S.green}
          />

          <CompareCard
            title="Solar Lease (SunRun-style)" color={S.sun} badge="$0 Down"
            rows={[
              ["Upfront cost", "$0", S.green, "Installer owns the system"],
              ["Federal tax credit", "30% (claimed by installer)", S.green, "Passed to you as lower payments"],
              ["Starting monthly payment", f$(DEFAULTS.leaseMonthly), "#e8ecf1"],
              ["Annual escalation", `${(DEFAULTS.leaseEscalation * 100).toFixed(1)}%`, "#e8ecf1"],
              ["Year 1 electricity savings", f$(year1ElecSavings), S.green],
              ["Year 1 lease payments", f$(year1LeasePayment), S.red],
              ["Year 1 net savings", f$(year1LeaseSavings), year1LeaseSavings >= 0 ? S.green : S.red],
              ["You own SRECs?", "No (installer keeps them)", S.muted],
            ]}
            highlight={["25-Year Net Savings", f$(leaseSavings25)]}
            highlightColor={leaseSavings25 >= 0 ? S.green : S.red}
          />

          <CompareCard
            title="Power Purchase Agreement (PPA)" color={S.green} badge="Pay per kWh"
            rows={[
              ["Upfront cost", "$0", S.green],
              ["Starting rate", `${f$d(DEFAULTS.ppaRate)}/kWh`, "#e8ecf1", `vs utility at ${f$d(er)}/kWh`],
              ["Day 1 savings", `${f$d(er - DEFAULTS.ppaRate)}/kWh`, S.green, `${Math.round((1 - DEFAULTS.ppaRate/er) * 100)}% cheaper than utility`],
              ["Annual escalation", `${(DEFAULTS.ppaEscalation * 100).toFixed(1)}%`, "#e8ecf1"],
              ["Year 1 electricity cost (PPA)", f$(year1PpaCost), "#e8ecf1"],
              ["Year 1 cost without solar", f$(annualUsageKwh * er), S.red],
              ["Year 1 net savings", f$(year1PpaSavings), year1PpaSavings >= 0 ? S.green : S.red],
            ]}
            highlight={["25-Year Net Savings", f$(ppaSavings25)]}
            highlightColor={ppaSavings25 >= 0 ? S.green : S.red}
          />
          <AdSlot />
        </>)}

        {/* ═══ INCENTIVES TAB ═══ */}
        {tab === "incentives" && (<>
          <div style={S.card}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: S.muted, marginBottom: 12 }}>Maryland Solar Incentives (2026)</div>

            <Row label="MD Residential Clean Energy Rebate" value={f$(DEFAULTS.stateRebate)} color={S.green} sub="One-time grant, first-come first-served" />
            <Row label="Sales Tax Exemption (6%)" value={f$(salesTaxSaved)} color={S.green} sub="No sales tax on solar equipment" />
            <Row label="Property Tax Exemption" value="100%" color={S.green} sub="Solar value excluded from property tax" />
            <Row label="Net Metering" value="1:1 Retail" color={S.green} sub="Full retail credit for excess energy to grid" />
            <Row label="SREC Income (annual est.)" value={`${f$(annualSrecIncome)}/yr`} color={S.green} sub={`${annualProductionMwh.toFixed(1)} MWh × $${DEFAULTS.srecValuePerMwh}/SREC`} />
            <Row label="SREC Income (25 years est.)" value={f$(annualSrecIncome * 20)} color={S.green} sub="Assuming ~20 years of SREC eligibility" />

            <div style={S.divider} />
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: S.red, marginBottom: 8 }}>No Longer Available</div>
            <Row label="Federal 30% ITC (homeowner purchase)" value="EXPIRED" color={S.red} sub="Ended Dec 31, 2025 (Big Beautiful Bill)" />
            <Row label="MD Energy Storage Tax Credit" value="FUNDS EXHAUSTED" color={S.red} sub="30% up to $5,000 — fully reserved for FY2026" />

            <div style={S.divider} />
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: S.sun, marginBottom: 8 }}>Still Available via Lease/PPA</div>
            <Row label="Federal 30% ITC (Section 48E)" value="30%" color={S.green} sub="Available for third-party owned systems (leases/PPAs) through 2027" />

            <div style={{ background: S.sun + "11", border: `1px solid ${S.sun}33`, borderRadius: 10, padding: 14, marginTop: 12 }}>
              <p style={{ fontSize: 13, color: S.muted, margin: 0, lineHeight: 1.6 }}>
                <strong style={{ color: S.sun }}>Why leasing became more attractive in 2026:</strong> With the federal tax credit gone for homeowner purchases, the only way to capture the 30% federal credit is through a lease or PPA — where the installer claims the credit and passes savings to you as lower monthly payments. This is why companies like SunRun are offering $0-down leases starting around $113/month in Maryland.
              </p>
            </div>
          </div>
          <AdSlot />
        </>)}

        {/* ─── CTA / Lead Capture ─── */}
        {!leadSubmitted ? (
          <div style={{ ...S.card, background: "linear-gradient(135deg, #1a2530, #131920)", borderColor: S.sun + "44" }}>
            <div style={{ textAlign: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#e8ecf1" }}>Ready to see your actual savings?</div>
              <p style={{ fontSize: 13, color: S.muted, margin: "6px 0 0", lineHeight: 1.6 }}>Get a free, no-obligation solar quote from a trusted installer in your area. See exact pricing, incentives, and monthly savings for your specific home.</p>
            </div>

            {!showLead ? (
              <button onClick={() => setShowLead(true)} style={{
                width: "100%", background: "linear-gradient(135deg, #f59e0b, #d97706)",
                color: "#0c1117", border: "none", borderRadius: 12, padding: "16px 0",
                fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
              }}>Get My Free Solar Quote</button>
            ) : (
              <div>
                {[
                  { l: "Full Name", v: leadName, fn: setLeadName, ph: "John Smith" },
                  { l: "Email", v: leadEmail, fn: setLeadEmail, ph: "you@email.com" },
                  { l: "Phone", v: leadPhone, fn: setLeadPhone, ph: "(301) 555-1234" },
                ].map((f) => (
                  <div key={f.l} style={{ marginBottom: 10 }}>
                    <label style={S.label}>{f.l}</label>
                    <div style={S.inputWrap(false)}>
                      <input type={f.l === "Email" ? "email" : f.l === "Phone" ? "tel" : "text"} value={f.v} onChange={(e) => f.fn(e.target.value)} placeholder={f.ph}
                        style={{ ...S.input, fontSize: 16, fontWeight: 500, fontFamily: "'Outfit', sans-serif" }} />
                    </div>
                  </div>
                ))}
                <button onClick={handleLeadSubmit} style={{
                  width: "100%", background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  color: "#0c1117", border: "none", borderRadius: 12, padding: "14px 0",
                  fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
                  marginTop: 4, opacity: (leadName && leadEmail && leadPhone) ? 1 : 0.5,
                }}>Submit — Get My Free Quote</button>
                <p style={{ fontSize: 11, color: S.dimmed, textAlign: "center", marginTop: 8, lineHeight: 1.5 }}>
                  By submitting, you agree to be contacted by a solar installation partner. No purchase obligation. Your information is never sold.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div style={{ ...S.card, textAlign: "center", borderColor: S.green + "44" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{"\u2600\uFE0F"}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: S.green }}>Quote request submitted!</div>
            <p style={{ fontSize: 12, color: S.muted, marginTop: 6 }}>A solar advisor will contact you within 24 hours with a customized savings analysis for your home.</p>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <SunLogo size={16} />
            <span style={{ fontSize: 13, fontWeight: 700, color: S.muted }}>Solar<span style={{ color: S.sun }}>IQ</span></span>
          </div>
          <p style={{ fontSize: 11, color: S.dimmed, lineHeight: 1.6, maxWidth: 420, margin: "0 auto" }}>
            SolarIQ is an independent educational tool. Calculations are estimates based on Maryland averages and publicly available data as of March 2026. Actual savings depend on roof orientation, shading, utility rates, system design, and installer pricing. The federal solar ITC for homeowner-purchased systems expired December 31, 2025. Leases/PPAs may still qualify for the Section 48E credit through 2027. Consult a tax professional for personal tax advice. Always get multiple quotes before committing to a solar installation.
          </p>
        </div>
      </div>
    </div>
  );
}
