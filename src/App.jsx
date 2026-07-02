import { useState, useEffect, useCallback, useRef } from "react";

// Ícones embutidos (SVG inline) — não dependem de internet, funcionam sempre.
// Baseados no estilo "linha" (Tabler/Feather). stroke=currentColor herda a cor do texto.
const ICON_PATHS = {
  wallet: "M19 7V6a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6 M16 12h4v4h-4a2 2 0 0 1 0-4",
  eye: "M10 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0 M21 12c-2.4 4-5.4 6-9 6s-6.6-2-9-6c2.4-4 5.4-6 9-6s6.6 2 9 6",
  donut: "M12 3a9 9 0 1 0 9 9 M12 3v6 M12 12l5.2 3",
  trending: "M3 17l6-6 4 4 8-8 M21 7h-6 M21 7v6",
  exchange: "M7 10h14l-4-4 M17 14H3l4 4",
  sparkles: "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z",
  bell: "M10 5a2 2 0 1 1 4 0 7 7 0 0 1 4 6v3a4 4 0 0 0 2 3H4a4 4 0 0 0 2-3v-3a7 7 0 0 1 4-6 M9 17v1a3 3 0 0 0 6 0v-1",
  refresh: "M20 11a8 8 0 1 0-.5 4 M20 4v5h-5",
  download: "M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2 M7 11l5 5 5-5 M12 4v12",
  upload: "M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2 M7 9l5-5 5 5 M12 4v12",
  spreadsheet: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2 M3 10h18 M10 3v18",
  plus: "M12 5v14 M5 12h14",
  pencil: "M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3 M13.5 6.5l3 3",
  search: "M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12 M21 21l-5.2-5.2",
  trash: "M4 7h16 M10 11v6 M14 11v6 M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12 M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3",
  list: "M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01",
  layoutGrid: "M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M13 13h7v7h-7z",
  loader: "M12 3v3 M12 18v3 M5.6 5.6l2.1 2.1 M16.3 16.3l2.1 2.1 M3 12h3 M18 12h3 M5.6 18.4l2.1-2.1 M16.3 7.7l2.1-2.1",
  bolt: "M13 3 4 14h7l-1 7 9-11h-7z",
  shield: "M12 3l8 3v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z",
  rocket: "M12 3c3 1 6 4 6 9l-3 3H9l-3-3c0-5 3-8 6-9 M9 15l-2 4 M15 15l2 4 M10 9a2 2 0 1 0 4 0 2 2 0 0 0-4 0",
  alert: "M12 9v4 M12 17h.01 M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
  chart: "M4 19V5 M4 19h16 M8 16v-5 M12 16V8 M16 16v-8",
  coin: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18 M9.5 9a2.5 2 0 0 1 5 0c0 1.5-2.5 1.5-2.5 3 M12 16h.01",
  gear: "M10.3 4.3a1 1 0 0 1 .96-.7h1.48a1 1 0 0 1 .96.7l.34 1.6 1.5.86 1.56-.5a1 1 0 0 1 1.16.44l.74 1.28a1 1 0 0 1-.2 1.22l-1.2 1.1v1.72l1.2 1.1a1 1 0 0 1 .2 1.22l-.74 1.28a1 1 0 0 1-1.16.44l-1.56-.5-1.5.86-.34 1.6a1 1 0 0 1-.96.7h-1.48a1 1 0 0 1-.96-.7l-.34-1.6-1.5-.86-1.56.5a1 1 0 0 1-1.16-.44l-.74-1.28a1 1 0 0 1 .2-1.22l1.2-1.1v-1.72l-1.2-1.1a1 1 0 0 1-.2-1.22l.74-1.28a1 1 0 0 1 1.16-.44l1.56.5 1.5-.86z M12 12a2 2 0 1 0 0 .01",
  user: "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M5 21v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1",
};
function Icon({ name, size = 18, style, className }) {
  const d = ICON_PATHS[name];
  if (!d) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      style={{ verticalAlign: "-3px", flexShrink: 0, ...style }} className={className} aria-hidden="true">
      {d.split(" M").map((seg, i) => <path key={i} d={(i === 0 ? seg : "M" + seg)} />)}
    </svg>
  );
}

const FINNHUB_KEY = "d9377dpr01qq79pbeu20d9377dpr01qq79pbeu2g";

// Bump this when the seed list changes to re-import into existing installs.
const SEED_VERSION = "2026-06-25-katia-v2";

// Carteira da Kátia — extraída da planilha (24/jun/2026)
const SEED_STOCKS = [
  { ticker:"WEN", name:"The Wendy's", assetClass:"Ação", sector:"Consumo Discricionário", status:"COMPRAR", qty:0, avgPrice:0, totalInvested:0, buyTarget:6.17, sellTarget:8.18, dividendYield:2.4, paysDividends:true, leveraged:false },
  { ticker:"DELL", name:"Dell Technologies", assetClass:"Ação", sector:"Tecnologia da Informação", status:"COMPRAR", qty:0, avgPrice:0, totalInvested:0, buyTarget:362.41, sellTarget:477.94, dividendYield:2.0, paysDividends:true, leveraged:false },
  { ticker:"INTC", name:"Intel", assetClass:"Ação", sector:"Tecnologia da Informação", status:"COMPRAR", qty:0, avgPrice:0, totalInvested:0, buyTarget:96.98, sellTarget:134.11, dividendYield:1.5, paysDividends:true, leveraged:false },
  { ticker:"DG", name:"Dollar General", assetClass:"Ação", sector:"Consumo Básico", status:"COMPRAR", qty:0, avgPrice:0, totalInvested:0, buyTarget:102.37, sellTarget:118.2, dividendYield:1.3, paysDividends:true, leveraged:false },
  { ticker:"UEC", name:"Uranium Energy", assetClass:"Ação", sector:"Energia", status:"COMPRAR", qty:0, avgPrice:0, totalInvested:0, buyTarget:9.41, sellTarget:15.45, dividendYield:0, paysDividends:false, leveraged:false },
  { ticker:"DNN", name:"Denison Mines", assetClass:"Ação", sector:"Energia", status:"COMPRAR", qty:0, avgPrice:0, totalInvested:0, buyTarget:2.82, sellTarget:3.66, dividendYield:0, paysDividends:false, leveraged:false },
  { ticker:"OPEN", name:"Opendoor", assetClass:"Ação", sector:"Imobiliário", status:"COMPRAR", qty:0, avgPrice:0, totalInvested:0, buyTarget:4.13, sellTarget:5.59, dividendYield:0, paysDividends:false, leveraged:false },
  { ticker:"EHTH", name:"eHealth", assetClass:"Ação", sector:"Saúde", status:"COMPRAR", qty:0, avgPrice:1.62, totalInvested:0, buyTarget:1.46, sellTarget:1.85, dividendYield:0, paysDividends:false, leveraged:false },
  { ticker:"BNDX", name:"Vanguard Renda Fixa Intl", assetClass:"Renda Fixa", sector:"", status:"MANTER", qty:2.99, avgPrice:100.57, totalInvested:300.8, buyTarget:null, sellTarget:null, dividendYield:4.43, paysDividends:true, leveraged:false },
  { ticker:"VOO", name:"Vanguard S&P 500 ETF", assetClass:"ETF", sector:"", status:"MANTER", qty:1.347, avgPrice:644.26, totalInvested:883.68, buyTarget:666.34, sellTarget:698.81, dividendYield:1.1, paysDividends:true, leveraged:false },
  { ticker:"LIT", name:"Global X Lithium ETF", assetClass:"ETF", sector:"", status:"MANTER", qty:7, avgPrice:82.0, totalInvested:574.0, buyTarget:76.45, sellTarget:87.71, dividendYield:0.8, paysDividends:true, leveraged:false },
  { ticker:"QQQ", name:"Invesco QQQ Trust", assetClass:"ETF", sector:"", status:"MANTER", qty:0.5, avgPrice:598.0, totalInvested:299.0, buyTarget:692.29, sellTarget:747.07, dividendYield:0.45, paysDividends:true, leveraged:false },
  { ticker:"IBIT", name:"iShares Bitcoin", assetClass:"Cripto", sector:"", status:"MANTER", qty:50.311, avgPrice:39.61, totalInvested:1993.18, buyTarget:33.63, sellTarget:43.5, dividendYield:0, paysDividends:false, leveraged:false },
  { ticker:"IAUM", name:"iShares Gold", assetClass:"Ouro/Metais", sector:"", status:"MANTER", qty:9.99, avgPrice:42.14, totalInvested:421.3, buyTarget:40.56, sellTarget:45.55, dividendYield:0, paysDividends:false, leveraged:false },
  { ticker:"PBR", name:"Petrobras", assetClass:"Ação", sector:"Energia", status:"MANTER", qty:47.21, avgPrice:14.88, totalInvested:703.0, buyTarget:14.71, sellTarget:17.36, dividendYield:6.0, paysDividends:true, leveraged:false },
  { ticker:"ITUB", name:"Itaú Unibanco", assetClass:"Ação", sector:"Financeiro", status:"MANTER", qty:100, avgPrice:7.85, totalInvested:785.0, buyTarget:7.41, sellTarget:8.18, dividendYield:6.0, paysDividends:true, leveraged:false },
  { ticker:"IBM", name:"IBM", assetClass:"Ação", sector:"Tecnologia da Informação", status:"MANTER", qty:2, avgPrice:244.41, totalInvested:492.0, buyTarget:221.02, sellTarget:329.55, dividendYield:4.0, paysDividends:true, leveraged:false },
  { ticker:"COP", name:"ConocoPhillips", assetClass:"Ação", sector:"Energia", status:"MANTER", qty:1.995, avgPrice:108.61, totalInvested:216.7, buyTarget:107.61, sellTarget:125.32, dividendYield:2.5, paysDividends:true, leveraged:false },
  { ticker:"BG", name:"Bunge Global", assetClass:"Ação", sector:"Consumo Básico", status:"MANTER", qty:2, avgPrice:116.06, totalInvested:232.17, buyTarget:116.09, sellTarget:134.68, dividendYield:2.3, paysDividends:true, leveraged:false },
  { ticker:"SBS", name:"Sabesp", assetClass:"Ação", sector:"Utilidades", status:"MANTER", qty:10.28, avgPrice:5.36, totalInvested:55.15, buyTarget:5.25, sellTarget:5.88, dividendYield:1.8, paysDividends:true, leveraged:false },
  { ticker:"AVGO", name:"Broadcom", assetClass:"Ação", sector:"Tecnologia da Informação", status:"MANTER", qty:2.865, avgPrice:400.55, totalInvested:1146.34, buyTarget:371.71, sellTarget:487.18, dividendYield:1.6, paysDividends:true, leveraged:false },
  { ticker:"NOC", name:"Northrop Grumman", assetClass:"Ação", sector:"Indústria", status:"MANTER", qty:1, avgPrice:520.0, totalInvested:520.0, buyTarget:516.55, sellTarget:563.67, dividendYield:1.6, paysDividends:true, leveraged:false },
  { ticker:"ORCL", name:"Oracle", assetClass:"Ação", sector:"Tecnologia da Informação", status:"MANTER", qty:4, avgPrice:179.09, totalInvested:717.9, buyTarget:169.05, sellTarget:249.14, dividendYield:1.3, paysDividends:true, leveraged:false },
  { ticker:"NKE", name:"Nike", assetClass:"Ação", sector:"Consumo Discricionário", status:"MANTER", qty:11.64, avgPrice:42.94, totalInvested:500.0, buyTarget:42.44, sellTarget:47.49, dividendYield:1.3, paysDividends:true, leveraged:false },
  { ticker:"AA", name:"Alcoa", assetClass:"Ação", sector:"Materiais", status:"MANTER", qty:2, avgPrice:62.0, totalInvested:124.0, buyTarget:61.63, sellTarget:83.9, dividendYield:1.2, paysDividends:true, leveraged:false },
  { ticker:"FNV", name:"Franco-Nevada", assetClass:"Ação", sector:"Materiais", status:"MANTER", qty:4, avgPrice:224.13, totalInvested:897.08, buyTarget:205.74, sellTarget:239.84, dividendYield:1.2, paysDividends:true, leveraged:false },
  { ticker:"AAPL", name:"Apple", assetClass:"Ação", sector:"Tecnologia da Informação", status:"MANTER", qty:2.009, avgPrice:283.05, totalInvested:526.05, buyTarget:289.16, sellTarget:315.27, dividendYield:0.5, paysDividends:true, leveraged:false },
  { ticker:"NVDA", name:"NVIDIA", assetClass:"Ação", sector:"Tecnologia da Informação", status:"MANTER", qty:4, avgPrice:200.64, totalInvested:804.0, buyTarget:226.12, sellTarget:210.02, dividendYield:0.03, paysDividends:true, leveraged:false },
  { ticker:"LAC", name:"Lithium Americas", assetClass:"Ação", sector:"Materiais", status:"MANTER", qty:80.48, avgPrice:4.01, totalInvested:323.08, buyTarget:3.98, sellTarget:6.1, dividendYield:0, paysDividends:false, leveraged:false },
  { ticker:"CABA", name:"Caballeta Bio", assetClass:"Ação", sector:"Saúde", status:"MANTER", qty:180, avgPrice:3.32, totalInvested:599.14, buyTarget:2.79, sellTarget:4.03, dividendYield:0, paysDividends:false, leveraged:false },
  { ticker:"SPCE", name:"Virgin Galactic", assetClass:"Ação", sector:"Indústria", status:"MANTER", qty:4, avgPrice:162.27, totalInvested:650.0, buyTarget:154.59, sellTarget:217.2, dividendYield:0, paysDividends:false, leveraged:false },
  { ticker:"AMZN", name:"Amazon", assetClass:"Ação", sector:"Consumo Discricionário", status:"MANTER", qty:2.517, avgPrice:238.38, totalInvested:600.0, buyTarget:232.79, sellTarget:273.98, dividendYield:0, paysDividends:false, leveraged:false },
  { ticker:"TSLA", name:"Tesla", assetClass:"Ação", sector:"Consumo Discricionário", status:"MANTER", qty:1, avgPrice:387.83, totalInvested:387.5, buyTarget:381.01, sellTarget:442.94, dividendYield:0, paysDividends:false, leveraged:false },
  { ticker:"GSAT", name:"Globalstar", assetClass:"Ação", sector:"Comunicação", status:"MANTER", qty:4.4, avgPrice:79.79, totalInvested:351.4, buyTarget:80.15, sellTarget:84.58, dividendYield:0, paysDividends:false, leveraged:false },
  { ticker:"NET", name:"Cloudflare", assetClass:"Ação", sector:"Tecnologia da Informação", status:"MANTER", qty:3.089, avgPrice:223.33, totalInvested:690.0, buyTarget:201.75, sellTarget:276.27, dividendYield:0, paysDividends:false, leveraged:false },
  { ticker:"UBER", name:"Uber", assetClass:"Ação", sector:"Indústria", status:"MANTER", qty:6, avgPrice:71.26, totalInvested:428.0, buyTarget:67.7, sellTarget:75.01, dividendYield:0, paysDividends:false, leveraged:false },
  { ticker:"AIV", name:"Apartment Investment", assetClass:"Ação", sector:"Imobiliário", status:"MANTER", qty:9.99, avgPrice:3.07, totalInvested:30.75, buyTarget:2.85, sellTarget:4.29, dividendYield:0, paysDividends:false, leveraged:false },
  { ticker:"BFLY", name:"Butterfly Network", assetClass:"Ação", sector:"Saúde", status:"MANTER", qty:0, avgPrice:0, totalInvested:0, buyTarget:3.94, sellTarget:9.1, dividendYield:0, paysDividends:false, leveraged:false },
  { ticker:"KALA", name:"Kala Bio", assetClass:"Ação", sector:"Saúde", status:"MANTER", qty:0, avgPrice:0, totalInvested:0, buyTarget:2.04, sellTarget:3.59, dividendYield:0, paysDividends:false, leveraged:false },
  { ticker:"HOOD", name:"Robinhood", assetClass:"Ação", sector:"Financeiro", status:"MANTER", qty:0, avgPrice:0, totalInvested:0, buyTarget:73.55, sellTarget:109.57, dividendYield:0, paysDividends:false, leveraged:false },
  { ticker:"DLTR", name:"Dollar Tree", assetClass:"Ação", sector:"Consumo Básico", status:"MANTER", qty:0, avgPrice:0, totalInvested:0, buyTarget:90.16, sellTarget:116.46, dividendYield:0, paysDividends:false, leveraged:false },
  { ticker:"CSN", name:"Cia Siderúrgica Nacional", assetClass:"Ação", sector:"Materiais", status:"VENDER", qty:85, avgPrice:1.17, totalInvested:100.0, buyTarget:1.12, sellTarget:1.46, dividendYield:8.0, paysDividends:true, leveraged:false },
  { ticker:"MVIS", name:"MicroVision", assetClass:"Ação", sector:"Tecnologia da Informação", status:"VENDER", qty:200, avgPrice:0.37, totalInvested:74.6, buyTarget:0.35, sellTarget:0.66, dividendYield:0, paysDividends:false, leveraged:false },
  { ticker:"DJT", name:"Trump Media", assetClass:"Ação", sector:"Comunicação", status:"VENDER", qty:9.99, avgPrice:8.25, totalInvested:82.56, buyTarget:7.79, sellTarget:9.55, dividendYield:0, paysDividends:false, leveraged:false },
  { ticker:"USAS", name:"Americas Gold & Silver", assetClass:"Ação", sector:"Materiais", status:"VENDER", qty:198.77, avgPrice:5.78, totalInvested:1150.0, buyTarget:4.55, sellTarget:6.45, dividendYield:0, paysDividends:false, leveraged:false },
  { ticker:"DFEN", name:"Direxion Aero & Defense Bull 3X", assetClass:"ETF Alavancado", sector:"Indústria", status:"VENDER", qty:5, avgPrice:93.83, totalInvested:471.0, buyTarget:64.47, sellTarget:83.05, dividendYield:0, paysDividends:false, leveraged:true },
  { ticker:"AIFU", name:"AIX (AI Financial)", assetClass:"Ação", sector:"Financeiro", status:"VENDER", qty:100, avgPrice:0.86, totalInvested:86.47, buyTarget:0.63, sellTarget:0.94, dividendYield:0, paysDividends:false, leveraged:false },
  { ticker:"FFAI", name:"Faraday Future", assetClass:"Ação", sector:"Consumo Discricionário", status:"VENDER", qty:100, avgPrice:0.42, totalInvested:42.48, buyTarget:0.3, sellTarget:0.42, dividendYield:0, paysDividends:false, leveraged:false },
  { ticker:"ASTS", name:"AST SpaceMobile", assetClass:"Ação", sector:"Comunicação", status:"VENDER", qty:3.46, avgPrice:86.57, totalInvested:300.0, buyTarget:80.68, sellTarget:133.02, dividendYield:0, paysDividends:false, leveraged:false },
  { ticker:"PLUG", name:"Plug Power", assetClass:"Ação", sector:"Energia", status:"REDUZIR", qty:153.92, avgPrice:2.99, totalInvested:500.0, buyTarget:2.65, sellTarget:4.26, dividendYield:0, paysDividends:false, leveraged:false },
  { ticker:"RUM", name:"Rumble", assetClass:"Ação", sector:"Comunicação", status:"REDUZIR", qty:200.69, avgPrice:7.58, totalInvested:1521.47, buyTarget:6.8, sellTarget:9.75, dividendYield:0, paysDividends:false, leveraged:false },
  { ticker:"GRWG", name:"GrowGeneration", assetClass:"Ação", sector:"Materiais", status:"REDUZIR", qty:399.38, avgPrice:1.54, totalInvested:615.94, buyTarget:1.43, sellTarget:1.8, dividendYield:0, paysDividends:false, leveraged:false },
];

// Build the stock + alert objects from the seed list
function buildSeed() {
  const stocks = SEED_STOCKS.map((s, i) => ({
    id: 1000 + i,
    ticker: s.ticker,
    name: s.name,
    assetClass: s.assetClass || "Ação",
    sector: s.sector || "",
    leveraged: s.leveraged || false,
    strategy: STRATEGY_MAP[s.ticker] || "Satélite",
    stopLoss: null,
    buyDate: null,
    note: "",
    archived: false,
    status: s.status,
    qty: s.qty,
    avgPrice: s.avgPrice,
    totalInvested: s.totalInvested,
    minPrice: null,
    maxPrice: null,
    paysDividends: s.paysDividends,
    dividendYield: s.dividendYield || null,
    dividendFrequency: null,
    realizedPL: 0,
    nextPayDate: null,
    min30: null, max30: null, rangeAt: null,
  }));
  // alerts keyed by ticker, using min-compra (buyTarget) and max-venda (sellTarget)
  const alerts = {};
  SEED_STOCKS.forEach(s => {
    if (s.buyTarget || s.sellTarget) {
      alerts[s.ticker] = { sellTarget: s.sellTarget || null, buyTarget: s.buyTarget || null, active: true };
    }
  });
  return { stocks, alerts };
}

// ── Helpers ────────────────────────────────────────────────────────────────
const fmt = (n, dec = 2) => (n == null || isNaN(n) ? "—" : Number(n).toFixed(dec));
const fmtCurrency = (n) =>
  n == null || isNaN(n) ? "—"
    : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
const fmtPct = (n) => (n == null || isNaN(n) ? "—" : `${n > 0 ? "+" : ""}${fmt(n)}%`);
const fmtDate = (s) => {
  if (!s) return "—";
  // Datas no formato "YYYY-MM-DD" devem ser lidas como data local, não UTC
  // (senão o fuso horário pode jogar para o dia anterior).
  let d;
  if (typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [y, m, day] = s.split("-").map(Number);
    d = new Date(y, m - 1, day);
  } else {
    d = new Date(s);
  }
  return isNaN(d) ? "—" : d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
};
const pctColor = (n) =>
  n == null || isNaN(n) ? "#94a3b8" : n > 0 ? "#22c55e" : n < 0 ? "#ef4444" : "#94a3b8";

// Gera um degradê consistente para o "avatar" de cada ação, a partir do ticker.
const TICKER_GRADIENTS = [
  ["#0ea5e9", "#22d3ee"], ["#8b5cf6", "#6366f1"], ["#f59e0b", "#ef4444"],
  ["#10b981", "#22d3ee"], ["#ec4899", "#8b5cf6"], ["#3b82f6", "#8b5cf6"],
  ["#14b8a6", "#10b981"], ["#f97316", "#f59e0b"], ["#06b6d4", "#3b82f6"],
  ["#a855f7", "#ec4899"],
];
const tickerGradient = (ticker) => {
  let h = 0;
  for (let i = 0; i < ticker.length; i++) h = (h * 31 + ticker.charCodeAt(i)) % 1000;
  const [a, b] = TICKER_GRADIENTS[h % TICKER_GRADIENTS.length];
  return `linear-gradient(135deg, ${a}, ${b})`;
};

// ── Chave do logo.dev (logos oficiais das empresas) ──
// Quando o app estiver hospedado online, crie uma chave grátis em https://logo.dev
// e cole abaixo. Enquanto estiver vazia (ou offline, como no Claude), o app usa
// automaticamente o avatar colorido com a sigla — nunca fica um espaço vazio.
const LOGO_DEV_KEY = ""; // ex: "pk_XXXXXXXXXXXX"

// Avatar da ação: tenta o logo oficial; se falhar, mostra o quadradinho com a sigla.
function StockAvatar({ ticker, size = 38, radius = 10 }) {
  const [failed, setFailed] = useState(false);
  const showLogo = LOGO_DEV_KEY && !failed;
  const logoUrl = `https://img.logo.dev/ticker/${ticker}?token=${LOGO_DEV_KEY}&size=${size * 2}&format=png&retina=true`;
  if (showLogo) {
    return (
      <div style={{ width: size, height: size, borderRadius: radius, flexShrink: 0, overflow: "hidden", background: "#16203a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src={logoUrl} alt={ticker} width={size} height={size} style={{ objectFit: "contain" }} onError={() => setFailed(true)} />
      </div>
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: radius, flexShrink: 0,
      background: tickerGradient(ticker),
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'IBM Plex Mono',monospace", fontWeight: 600, fontSize: size <= 34 ? 10 : 11, color: "#fff", letterSpacing: 0.3,
    }}>{ticker.slice(0, 4)}</div>
  );
}

const SIGNAL_CONFIG = {
  COMPRAR:   { bg: "#052e16", border: "#16a34a", text: "#4ade80", icon: "▲" },
  VENDER:    { bg: "#2d0a0a", border: "#dc2626", text: "#f87171", icon: "▼" },
  AGUARDAR:  { bg: "#1c1917", border: "#78716c", text: "#a8a29e", icon: "◆" },
  ACUMULAR:  { bg: "#0c1a2e", border: "#3b82f6", text: "#60a5fa", icon: "●" },
};
const IMPACT_CONFIG = {
  ALTO:  { color: "#ef4444", bg: "#2d0a0a", border: "#7f1d1d", dot: "🔴" },
  MÉDIO: { color: "#f59e0b", bg: "#1c1200", border: "#78350f", dot: "🟡" },
  BAIXO: { color: "#60a5fa", bg: "#0c1a2e", border: "#1e3a5f", dot: "🔵" },
};
const TYPE_CONFIG = {
  AMEAÇA:       { icon: "⚠️", color: "#ef4444", bg: "#1a0404" },
  OPORTUNIDADE: { icon: "✅", color: "#4ade80", bg: "#021a0a" },
  NEUTRO:       { icon: "ℹ️", color: "#94a3b8", bg: "#0d1117" },
  EVENTO:       { icon: "📅", color: "#a78bfa", bg: "#13001a" },
};

// Cores por orientação (status) — usadas no agrupamento da carteira
const STATUS_COLORS = {
  "COMPRAR":          { bg: "#1a0f00", color: "#fb923c" },
  "APORTAR":          { bg: "#0a1a0f", color: "#34d399" },
  "MANTER":           { bg: "#0c1a2e", color: "#60a5fa" },
  "REDUZIR":          { bg: "#1a1505", color: "#fbbf24" },
  "VENDER":           { bg: "#2d0a0a", color: "#f87171" },
  // legados — aparecem como "a reclassificar" até a usuária ajustar manualmente
  "OBSERVAR":         { bg: "#1a1505", color: "#fbbf24" },
  "ETF":              { bg: "#1a1a00", color: "#facc15" },
  "OPÇÃO":            { bg: "#0a1a0a", color: "#4ade80" },
  "VENDER/RECOMPRAR": { bg: "#13001a", color: "#c084fc" },
  "SEM ORIENTAÇÃO":   { bg: "#0d1117", color: "#94a3b8" },
};

// Orientações oficiais (na ordem do ciclo de decisão do investidor)
const STATUS_OPTIONS = ["COMPRAR", "APORTAR", "MANTER", "REDUZIR", "VENDER"];

// Classificação Núcleo (longo prazo) vs Satélite (curto prazo) por ticker
const STRATEGY_MAP = {
  "VOO":"Núcleo","QQQ":"Núcleo","BNDX":"Núcleo","IAUM":"Núcleo","AAPL":"Núcleo","NVDA":"Núcleo",
  "AVGO":"Núcleo","ORCL":"Núcleo","IBM":"Núcleo","AMZN":"Núcleo","PBR":"Núcleo","COP":"Núcleo",
  "ITUB":"Núcleo","NKE":"Núcleo","NOC":"Núcleo","FNV":"Núcleo","BG":"Núcleo","SBS":"Núcleo",
  "WEN":"Satélite","DELL":"Núcleo","INTC":"Satélite","DG":"Satélite","UEC":"Satélite","DNN":"Satélite",
  "OPEN":"Satélite","EHTH":"Satélite","LIT":"Satélite","IBIT":"Satélite","AA":"Satélite","LAC":"Satélite",
  "CABA":"Satélite","SPCE":"Satélite","TSLA":"Satélite","GSAT":"Satélite","NET":"Satélite","UBER":"Núcleo",
  "AIV":"Satélite","BFLY":"Satélite","KALA":"Satélite","HOOD":"Satélite","DLTR":"Satélite","CSN":"Satélite",
  "MVIS":"Satélite","DJT":"Satélite","USAS":"Satélite","DFEN":"Satélite","AIFU":"Satélite","FFAI":"Satélite",
  "ASTS":"Satélite","PLUG":"Satélite","RUM":"Satélite","GRWG":"Satélite",
};

// ── Service Worker & Push Notifications ───────────────────────────────────
const SW_CODE = `
const CACHE = 'katia-trade-v1';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => clients.claim());

// Listen for push messages from the main thread
self.addEventListener('message', e => {
  if (e.data?.type === 'SHOW_NOTIFICATION') {
    const { title, body, tag, icon, badge } = e.data.payload;
    self.registration.showNotification(title, {
      body,
      tag,
      icon: icon || '/favicon.ico',
      badge: badge || '/favicon.ico',
      vibrate: [200, 100, 200],
      requireInteraction: false,
      silent: false,
    });
  }
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window' }).then(cs => {
    if (cs.length) return cs[0].focus();
    return clients.openWindow('/');
  }));
});
`;

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return null;
  try {
    // Inject SW as blob URL so it works in sandboxed environments
    const blob = new Blob([SW_CODE], { type: "application/javascript" });
    const swUrl = URL.createObjectURL(blob);
    const reg = await navigator.serviceWorker.register(swUrl, { scope: "/" });
    await navigator.serviceWorker.ready;
    return reg;
  } catch (e) {
    console.warn("SW registration failed:", e);
    return null;
  }
}

async function requestNotificationPermission() {
  if (!("Notification" in window)) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  const result = await Notification.requestPermission();
  return result;
}

async function sendNativeNotification(swReg, title, body, tag = "katia-trade") {
  // Try via Service Worker first (works in background)
  if (swReg && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "SHOW_NOTIFICATION",
      payload: { title, body, tag },
    });
    return;
  }
  // Fallback: direct Notification API (requires tab focus)
  if (Notification.permission === "granted") {
    new Notification(title, { body, tag });
  }
}

// ── Audio ──────────────────────────────────────────────────────────────────
function useAudio() {
  const ctx = useRef(null);
  const getCtx = () => {
    if (!ctx.current) ctx.current = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.current.state === "suspended") ctx.current.resume();
    return ctx.current;
  };
  const playBuy = useCallback(() => {
    const ac = getCtx();
    [0, 0.18, 0.36].forEach((delay, i) => {
      const osc = ac.createOscillator(); const gain = ac.createGain();
      osc.connect(gain); gain.connect(ac.destination); osc.type = "sine";
      osc.frequency.setValueAtTime([523, 659, 784][i], ac.currentTime + delay);
      gain.gain.setValueAtTime(0, ac.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.4, ac.currentTime + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + 0.35);
      osc.start(ac.currentTime + delay); osc.stop(ac.currentTime + delay + 0.36);
    });
  }, []);
  const playSell = useCallback(() => {
    const ac = getCtx();
    [0, 0.2, 0.4].forEach((delay, i) => {
      const osc = ac.createOscillator(); const gain = ac.createGain();
      osc.connect(gain); gain.connect(ac.destination); osc.type = "sawtooth";
      osc.frequency.setValueAtTime([440, 330, 220][i], ac.currentTime + delay);
      gain.gain.setValueAtTime(0, ac.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.3, ac.currentTime + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + 0.28);
      osc.start(ac.currentTime + delay); osc.stop(ac.currentTime + delay + 0.3);
    });
  }, []);
  const playAlert = useCallback(() => {
    const ac = getCtx();
    [0, 0.25].forEach((delay) => {
      const osc = ac.createOscillator(); const gain = ac.createGain();
      osc.connect(gain); gain.connect(ac.destination); osc.type = "triangle";
      osc.frequency.setValueAtTime(880, ac.currentTime + delay);
      gain.gain.setValueAtTime(0, ac.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.35, ac.currentTime + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + 0.2);
      osc.start(ac.currentTime + delay); osc.stop(ac.currentTime + delay + 0.21);
    });
  }, []);
  const playTest = useCallback((type) => {
    if (type === "sell") playSell(); else if (type === "alert") playAlert(); else playBuy();
  }, [playBuy, playSell, playAlert]);
  return { playBuy, playSell, playAlert, playTest };
}

// ── Finnhub ────────────────────────────────────────────────────────────────
async function fetchQuote(ticker) {
  try {
    const r = await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${FINNHUB_KEY}`);
    return await r.json();
  } catch { return null; }
}

async function fetch30DayRange(ticker) {
  // 1) tenta o histórico de 30 dias (endpoint candle)
  try {
    const to   = Math.floor(Date.now() / 1000);
    const from = to - 30 * 86400;
    const r = await fetch(
      `https://finnhub.io/api/v1/stock/candle?symbol=${ticker}&resolution=D&from=${from}&to=${to}&token=${FINNHUB_KEY}`
    );
    const d = await r.json();
    if (d.s === "ok" && d.h?.length) {
      return { min30: Math.min(...d.l), max30: Math.max(...d.h), fetchedAt: Date.now() };
    }
  } catch { /* segue para o fallback */ }
  // 2) fallback (plano grátis): usa a máxima/mínima do dia da cotação atual
  try {
    const q = await fetchQuote(ticker);
    if (q && q.h && q.l) {
      return { min30: q.l, max30: q.h, fetchedAt: Date.now(), approx: true };
    }
  } catch { /* nada */ }
  return null;
}

async function fetchNews(ticker) {
  try {
    const to   = new Date().toISOString().slice(0, 10);
    const from = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
    const r = await fetch(`https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${from}&to=${to}&token=${FINNHUB_KEY}`);
    const d = await r.json();
    return Array.isArray(d) ? d.slice(0, 12) : [];
  } catch { return []; }
}

async function fetchEarnings(ticker) {
  try {
    const r = await fetch(`https://finnhub.io/api/v1/calendar/earnings?symbol=${ticker}&token=${FINNHUB_KEY}`);
    const d = await r.json();
    return d?.earningsCalendar || [];
  } catch { return []; }
}

// Maps Finnhub industry → our sector list (pt-BR)
function mapSector(finnhubIndustry) {
  if (!finnhubIndustry) return "Outro";
  const i = finnhubIndustry.toLowerCase();
  if (/tech|software|semiconduc|hardware|internet|electronic|it services|media/.test(i)) return "Tecnologia";
  if (/bank|financ|insurance|capital market|asset|invest/.test(i)) return "Financeiro";
  if (/health|pharma|biotech|medical|drug|life science/.test(i)) return "Saúde";
  if (/energy|oil|gas|petrol|coal|renewable/.test(i)) return "Energia";
  if (/retail|consumer|food|beverage|apparel|restaurant|hotel|leisure/.test(i)) return "Consumo";
  if (/industr|machinery|aerospace|defense|manufactur|transport|airline|logistic/.test(i)) return "Indústria";
  if (/real estate|reit|property/.test(i)) return "Imobiliário";
  if (/telecom|communication|wireless/.test(i)) return "Telecom";
  if (/utilit|electric|water|power/.test(i)) return "Utilidades";
  if (/agri|farm|crop|fertiliz/.test(i)) return "Agronegócio";
  return "Outro";
}

// Fetch company profile (sector) + basic financials (dividend yield)
async function fetchProfile(ticker) {
  try {
    const [profileRes, metricsRes] = await Promise.all([
      fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${FINNHUB_KEY}`),
      fetch(`https://finnhub.io/api/v1/stock/metric?symbol=${ticker}&metric=all&token=${FINNHUB_KEY}`),
    ]);
    const profile = await profileRes.json();
    const metrics = await metricsRes.json();
    const m = metrics?.metric || {};
    const yieldVal = m.currentDividendYieldTTM ?? m.dividendYieldIndicatedAnnual ?? null;
    return {
      name: profile?.name || "",
      sector: mapSector(profile?.finnhubIndustry),
      finnhubIndustry: profile?.finnhubIndustry || null,
      paysDividends: yieldVal != null && yieldVal > 0,
      dividendYield: yieldVal != null && yieldVal > 0 ? Number(yieldVal.toFixed(2)) : null,
    };
  } catch { return null; }
}

// Estimate payment frequency from spacing between recent dividends
function estimateFrequency(dividends) {
  if (!dividends || dividends.length < 2) return null;
  const dates = dividends.map(d => new Date(d.payDate || d.date).getTime()).sort((a, b) => b - a);
  const gaps = [];
  for (let i = 0; i < dates.length - 1; i++) gaps.push((dates[i] - dates[i + 1]) / 86400000);
  const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  if (avgGap < 45)  return "Mensal";
  if (avgGap < 135) return "Trimestral";
  if (avgGap < 270) return "Semestral";
  return "Anual";
}

// Fetch dividend history → next/last payment date + frequency
async function fetchDividends(ticker) {
  try {
    const to   = new Date(Date.now() + 120 * 86400000).toISOString().slice(0, 10); // look 120d ahead
    const from = new Date(Date.now() - 400 * 86400000).toISOString().slice(0, 10); // and ~13mo back
    const r = await fetch(`https://finnhub.io/api/v1/stock/dividend?symbol=${ticker}&from=${from}&to=${to}&token=${FINNHUB_KEY}`);
    const d = await r.json();
    if (!Array.isArray(d) || !d.length) return null;
    const now = Date.now();
    // sort ascending by pay date
    const sorted = [...d].sort((a, b) => new Date(a.payDate || a.date) - new Date(b.payDate || b.date));
    const upcoming = sorted.find(x => new Date(x.payDate || x.date).getTime() >= now);
    const last     = [...sorted].reverse().find(x => new Date(x.payDate || x.date).getTime() < now);
    return {
      nextPayDate: upcoming?.payDate || upcoming?.date || null,
      nextExDate:  upcoming?.date || null,
      nextAmount:  upcoming?.amount ?? null,
      lastPayDate: last?.payDate || last?.date || null,
      lastAmount:  last?.amount ?? null,
      frequency:   estimateFrequency(d),
    };
  } catch { return null; }
}

// ── Claude calls ───────────────────────────────────────────────────────────
async function runIntelligenceScan(stocks, quotesMap) {
  const today = new Date().toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const newsMap = {}; const earningsMap = {};
  await Promise.all(stocks.map(async (s) => {
    newsMap[s.ticker]     = await fetchNews(s.ticker);
    earningsMap[s.ticker] = await fetchEarnings(s.ticker);
  }));
  const portfolioSummary = stocks.map(s => {
    const q  = quotesMap[s.ticker];
    const pl = q?.c ? (((q.c - s.avgPrice) / s.avgPrice) * 100).toFixed(2) : "N/A";
    const news     = newsMap[s.ticker].slice(0, 6).map(n => `  - ${n.headline}`).join("\n");
    const earnings = earningsMap[s.ticker].slice(0, 3).map(e =>
      `  - Data: ${e.date} | EPS est.: ${e.epsEstimate ?? "N/A"} | Receita est.: ${e.revenueEstimate ?? "N/A"}`
    ).join("\n");
    return `AÇÃO: ${s.ticker} (${s.name})\nPreço atual: $${q?.c ?? "N/A"} | Preço médio pago: $${s.avgPrice} | P&L: ${pl}%\nMín 30d: $${fmt(s.min30)} | Máx 30d: $${fmt(s.max30)}\nNotícias:\n${news || "  Sem notícias"}\nEarnings:\n${earnings || "  Sem dados"}`;
  }).join("\n\n---\n");

  const prompt = `Você é um analista sênior de mercado. Hoje é ${today}.
Analise a carteira e identifique 2-5 eventos/catalisadores por ação que podem impactar o preço nas próximas horas, dias ou semanas.
Use as notícias fornecidas E faça buscas adicionais na web.
Eventos: earnings, upgrades/downgrades, lançamentos, regulações (FDA/FTC), processos, macro (Fed/juros), insiders, M&A, concorrência.

CARTEIRA:
${portfolioSummary}

Responda APENAS JSON válido sem markdown:
{"scanDate":"data pt-BR","summary":"panorama geral em 3 frases","items":[{"ticker":"X","title":"título curto","type":"AMEAÇA"|"OPORTUNIDADE"|"NEUTRO"|"EVENTO","impact":"ALTO"|"MÉDIO"|"BAIXO","horizon":"HOJE"|"ESTA SEMANA"|"ESTE MÊS"|"LONGO PRAZO","detail":"2-4 frases com fatos específicos","action":"o que monitorar/fazer","source":"fonte"}]}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6", max_tokens: 4000,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await res.json();
    const text = data.content?.filter(b => b.type === "text").map(b => b.text).join("") || "";
    const result = JSON.parse(text.replace(/```json|```/g, "").trim());
    result._rawDate = new Date().toISOString();
    return result;
  } catch {
    return { scanDate: today, summary: "Erro ao processar scan.", items: [], _rawDate: new Date().toISOString() };
  }
}

async function fetchClaudeAnalysis(stock, quote, newsHeadlines) {
  const prompt = `Analise ${stock.ticker} (${stock.name}). Preço $${quote?.c ?? "N/A"} | Var ${quote?.dp != null ? fmt(quote.dp) + "%" : "N/A"} | Médio $${fmt(stock.avgPrice)} | Qtd ${stock.qty} | Mín30d $${fmt(stock.min30)} | Máx30d $${fmt(stock.max30)}.
Notícias: ${newsHeadlines.slice(0, 5).join(" | ") || "N/A"}
JSON: {"signal":"COMPRAR"|"VENDER"|"AGUARDAR"|"ACUMULAR","confidence":0-100,"summary":"2 frases pt-BR","reasons":["r1","r2","r3"],"risk":"BAIXO"|"MÉDIO"|"ALTO","target":número|null}`;
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6", max_tokens: 800,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await res.json();
    const text = data.content?.filter(b => b.type === "text").map(b => b.text).join("") || "";
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch {
    return { signal: "AGUARDAR", confidence: 50, summary: "Análise indisponível.", reasons: ["Erro"], risk: "MÉDIO", target: null };
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// APP
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const { playBuy, playSell, playAlert, playTest } = useAudio();
  const swRegRef = useRef(null);

  const [stocks, setStocks] = useState(() => {
    // Migração de orientações antigas → as 5 novas (ETF/OPÇÃO/OBSERVAR→MANTER, VENDER/RECOMPRAR→REDUZIR)
    const migrateStatus = (st) => {
      const map = { "ETF": "MANTER", "OPÇÃO": "MANTER", "OBSERVAR": "MANTER", "VENDER/RECOMPRAR": "REDUZIR" };
      return map[st] || st || "MANTER";
    };
    // Garante que toda ação tenha todos os campos atuais (evita "perder" campos ao atualizar o app)
    const normalize = (s) => ({
      id: s.id ?? Date.now() + Math.random(),
      ticker: s.ticker ?? "", name: s.name ?? "", assetClass: s.assetClass ?? "Ação",
      sector: s.sector ?? "", leveraged: !!s.leveraged, strategy: s.strategy ?? "Satélite",
      qty: Number(s.qty) || 0, avgPrice: Number(s.avgPrice) || 0,
      totalInvested: s.totalInvested != null ? Number(s.totalInvested) : (Number(s.qty) || 0) * (Number(s.avgPrice) || 0),
      minPrice: s.minPrice ?? null, maxPrice: s.maxPrice ?? null,
      min30: s.min30 ?? null, max30: s.max30 ?? null, rangeAt: s.rangeAt ?? null,
      paysDividends: !!s.paysDividends, dividendYield: s.dividendYield ?? null, dividendFrequency: s.dividendFrequency ?? null,
      nextPayDate: s.nextPayDate ?? null, status: migrateStatus(s.status), realizedPL: Number(s.realizedPL) || 0,
      stopLoss: s.stopLoss ?? null, buyDate: s.buyDate ?? null, note: s.note ?? "", archived: !!s.archived,
    });
    try {
      const raw = localStorage.getItem("katia_stocks");
      // REGRA DE OURO: se já existe QUALQUER dado salvo, usa ele e nunca sobrescreve.
      if (raw !== null) {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved)) return saved.map(normalize); // normaliza campos faltantes
      }
      return buildSeed().stocks.map(normalize);
    } catch {
      try { const r = localStorage.getItem("katia_stocks"); if (r) return JSON.parse(r).map(normalize); } catch {}
      return buildSeed().stocks.map(normalize);
    }
  });
  const [alerts, setAlerts] = useState(() => {
    try {
      const raw = localStorage.getItem("katia_alerts");
      if (raw !== null) {
        const saved = JSON.parse(raw);
        if (saved && typeof saved === "object") return saved;
      }
      return buildSeed().alerts;
    } catch {
      try { const r = localStorage.getItem("katia_alerts"); if (r) return JSON.parse(r); } catch {}
      return buildSeed().alerts;
    }
  });
  const [intelligence, setIntelligence] = useState(() => {
    try { return JSON.parse(localStorage.getItem("katia_intel") || "null"); } catch { return null; }
  });
  // Fundação: histórico de transações (compra/venda com data) — base para rentabilidade real
  const [transactions, setTransactions] = useState(() => {
    try { return JSON.parse(localStorage.getItem("katia_transactions") || "[]"); } catch { return []; }
  });
  // Histórico do patrimônio (retratos diários do valor da carteira) para o gráfico de evolução
  const [patrimonyHistory, setPatrimonyHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("katia_patrimony_history") || "[]"); } catch { return []; }
  });
  const [showTxForm, setShowTxForm] = useState(false);
  const [txForm, setTxForm] = useState({ ticker: "", type: "COMPRA", qty: "", total: "", date: new Date().toISOString().slice(0, 10), fees: "" });
  const [notifPerm, setNotifPerm] = useState(
    "Notification" in window ? Notification.permission : "unsupported"
  );
  const [intelLoading, setIntelLoading] = useState(false);
  const [alertLog, setAlertLog]         = useState([]);
  const firedRef = useRef({});
  const lastSellResultRef = useRef(null);

  const [quotes, setQuotes]     = useState({});
  const [analyses, setAnalyses] = useState({});
  const [news, setNews]         = useState({});
  const [loading, setLoading]   = useState({});
  const [rangeLoading, setRangeLoading] = useState({});
  const [activeTab, setActiveTab]       = useState("portfolio");
  const [selectedStock, setSelectedStock] = useState(null);
  const [showForm, setShowForm]           = useState(false);
  const [showAlertForm, setShowAlertForm] = useState(null);
  const [expandedIntel, setExpandedIntel] = useState(null);
  const [intelFilter, setIntelFilter]     = useState("TODOS");
  const [groupByStatus, setGroupByStatus] = useState(false); // padrão: lista; true = agrupar por orientação
  const [revealedStatus, setRevealedStatus] = useState({}); // tickers com orientação revelada na Lista
  const [selectedOrientation, setSelectedOrientation] = useState(""); // orientação escolhida na aba Orientação
  const [searchQuery, setSearchQuery]     = useState("");    // busca por ticker/nome
  const [showSettings, setShowSettings]   = useState(false); // menu de configurações (engrenagem)
  const [showProfile, setShowProfile]     = useState(false); // formulário de perfil
  const [userProfile, setUserProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem("katia_profile") || "null") || { name: "Kátia", currency: "USD", risk: "Moderado", satelliteTarget: 30 }; }
    catch { return { name: "Kátia", currency: "USD", risk: "Moderado", satelliteTarget: 30 }; }
  });

  // Filtro de busca por ticker ou nome (ignora acentos e maiúsculas)
  const stripAccents = (str) => (str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const matchesSearch = (s) => {
    if (!searchQuery.trim()) return true;
    const q = stripAccents(searchQuery.trim());
    return stripAccents(s.ticker).includes(q) || stripAccents(s.name).includes(q);
  };

  // Listas BASE (sem busca) — usadas para cálculos de carteira (distribuição, totais)
  // Arredonda qty para evitar problemas de ponto flutuante (ex: 0.9999999)
  const qtyOf = (s) => Math.round((Number(s.qty) || 0) * 10000) / 10000;
  const activeBase   = stocks.filter(s => !s.archived && qtyOf(s) > 0);
  const watchBase    = stocks.filter(s => !s.archived && qtyOf(s) <= 0);
  const archivedBase = stocks.filter(s => s.archived);


  // Listas para EXIBIÇÃO nas tabelas (aplicam a busca)
  const activeStocks   = activeBase.filter(matchesSearch);
  const watchStocks    = watchBase.filter(matchesSearch);
  const archivedStocks = archivedBase.filter(matchesSearch);

  // Setores GICS oficiais (11) — usados para ações
  const SECTORS = [
    "Tecnologia da Informação","Saúde","Financeiro","Consumo Discricionário",
    "Consumo Básico","Comunicação","Indústria","Energia","Materiais",
    "Imobiliário","Utilidades"
  ];
  // Classes de ativo (ETFs, cripto, etc. não têm setor GICS)
  const ASSET_CLASSES = ["Ação","ETF","ETF Alavancado","Cripto","Ouro/Metais","Renda Fixa"];
  const [form, setForm] = useState({ ticker: "", name: "", assetClass: "Ação", qty: "", avgPrice: "", minPrice: "", maxPrice: "", totalInvested: "", sector: "", leveraged: false, strategy: "Satélite", paysDividends: "nao", dividendYield: "", dividendFrequency: "", status: "MANTER", realizedPL: "", stopLoss: "", buyDate: "", note: "", archived: false });
  const [autoFilling, setAutoFilling] = useState(false);
  const [autoFillMsg, setAutoFillMsg] = useState(null);
  const [alertForm, setAlertForm] = useState({ sellTarget: "", buyTarget: "" });
  const [lastUpdate, setLastUpdate] = useState(null);
  const [refreshProgress, setRefreshProgress] = useState(null); // {done, total} enquanto atualiza
  const [editId, setEditId]         = useState(null);
  const [toasts, setToasts]         = useState([]);

  // persist
  useEffect(() => { localStorage.setItem("katia_stocks",  JSON.stringify(stocks)); },      [stocks]);
  useEffect(() => { localStorage.setItem("katia_alerts",  JSON.stringify(alerts)); },      [alerts]);
  useEffect(() => { if (intelligence) localStorage.setItem("katia_intel", JSON.stringify(intelligence)); }, [intelligence]);
  useEffect(() => { localStorage.setItem("katia_transactions", JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem("katia_patrimony_history", JSON.stringify(patrimonyHistory)); }, [patrimonyHistory]);
  useEffect(() => { localStorage.setItem("katia_profile", JSON.stringify(userProfile)); }, [userProfile]);

  // register SW on mount
  useEffect(() => {
    registerServiceWorker().then(reg => { swRegRef.current = reg; });
  }, []);

  // toast helper
  const addToast = useCallback((msg, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 7000);
  }, []);

  // enable push notifications
  // ── Backup: exportar/importar todos os dados (segurança do usuário) ──
  const exportData = () => {
    const payload = {
      versao: "KatiaTrade-backup-1",
      exportadoEm: new Date().toISOString(),
      stocks, alerts, transactions,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `carteira-katia-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast("✅ Backup baixado! Guarde o arquivo em local seguro.", "buy");
  };

  // Exporta a carteira para CSV (abre no Excel / Google Sheets)
  const exportCSV = () => {
    const cols = ["Ticker","Nome","Classe","Setor","Estrategia","Orientacao","Quantidade","PrecoMedio","TotalInvestido","CotacaoAtual","ValorAtual","LucroPrejuizo","RentabilidadePct","PagaDividendos","DividendYield","StopLoss","DataCompra","Nota"];
    const rows = stocks.map(s => {
      const q = quotes[s.ticker];
      const cur = q?.c ? s.qty * q.c : "";
      const inv = s.totalInvested ?? s.qty * s.avgPrice;
      const pl = q?.c ? (s.qty * q.c - inv) : "";
      const plPct = q?.c && inv ? (((s.qty * q.c - inv) / inv) * 100).toFixed(2) : "";
      const esc = (v) => {
        const str = v == null ? "" : String(v);
        return /[",;\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
      };
      return [
        s.ticker, s.name, s.assetClass || "Ação", s.sector || "", s.strategy || "", s.status || "",
        s.qty, s.avgPrice, inv, q?.c ?? "", cur, pl, plPct,
        s.paysDividends ? "Sim" : "Não", s.dividendYield ?? "", s.stopLoss ?? "", s.buyDate ?? "", s.note ?? "",
      ].map(esc).join(";");
    });
    const csv = "\uFEFF" + [cols.join(";"), ...rows].join("\n"); // BOM p/ acentos no Excel
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `carteira-katia-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast("✅ CSV exportado! Abra no Excel ou Google Sheets.", "buy");
  };

  const importInputRef = useRef(null);
  const importData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.stocks || !Array.isArray(data.stocks)) throw new Error("formato inválido");
        if (!window.confirm(`Importar ${data.stocks.length} ações deste backup? Isso substituirá a carteira atual.`)) return;
        setStocks(data.stocks);
        setAlerts(data.alerts || {});
        if (data.transactions) setTransactions(data.transactions);
        addToast(`✅ Backup restaurado: ${data.stocks.length} ações`, "buy");
      } catch (err) {
        addToast("❌ Arquivo inválido. Use um backup gerado pelo próprio app.", "sell");
      }
    };
    reader.readAsText(file);
    e.target.value = ""; // permite reimportar o mesmo arquivo
  };

  const enableNotifications = async () => {
    const perm = await requestNotificationPermission();
    setNotifPerm(perm);
    if (perm === "granted") {
      addToast("✅ Notificações ativadas! Você será avisada mesmo com a aba fechada.", "buy");
      // register SW if not yet done
      if (!swRegRef.current) swRegRef.current = await registerServiceWorker();
    } else if (perm === "denied") {
      addToast("❌ Notificações bloqueadas. Habilite nas configurações do navegador.", "sell");
    }
  };

  // send notification (SW + sound + toast)
  const notify = useCallback(async (title, body, sound = "alert") => {
    // sound (only works if tab is active)
    if (sound === "buy") playBuy();
    else if (sound === "sell") playSell();
    else playAlert();
    // toast (always visible when tab open)
    addToast(`${title}: ${body}`, sound);
    // native notification (works when tab is background/closed)
    if (notifPerm === "granted") {
      await sendNativeNotification(swRegRef.current, title, body);
    }
  }, [playBuy, playSell, playAlert, addToast, notifPerm]);

  // check price alerts
  const checkAlerts = useCallback((qmap, sList, amap) => {
    sList.forEach(s => {
      const q = qmap[s.ticker]; const a = amap[s.ticker];
      if (!q?.c) return;
      const price = q.c;
      const ks = `${s.ticker}_sell`; const kb = `${s.ticker}_buy`;
      if (a?.active && a.sellTarget && price >= Number(a.sellTarget) && !firedRef.current[ks]) {
        firedRef.current[ks] = true;
        notify(`🔴 VENDER — ${s.ticker}`, `Preço ${fmtCurrency(price)} atingiu seu alvo de venda ${fmtCurrency(a.sellTarget)}`, "sell");
        setAlertLog(p => [{ id: Date.now(), ticker: s.ticker, type: "VENDA", price, target: a.sellTarget, time: new Date() }, ...p.slice(0, 49)]);
      }
      if (a?.sellTarget && price < Number(a.sellTarget) * 0.999) firedRef.current[ks] = false;
      if (a?.active && a.buyTarget && price <= Number(a.buyTarget) && !firedRef.current[kb]) {
        firedRef.current[kb] = true;
        notify(`🟢 COMPRAR — ${s.ticker}`, `Preço ${fmtCurrency(price)} atingiu seu piso de compra ${fmtCurrency(a.buyTarget)}`, "buy");
        setAlertLog(p => [{ id: Date.now(), ticker: s.ticker, type: "COMPRA", price, target: a.buyTarget, time: new Date() }, ...p.slice(0, 49)]);
      }
      if (a?.buyTarget && price > Number(a.buyTarget) * 1.001) firedRef.current[kb] = false;
      // Stop-loss: avisa quando o preço cai abaixo do stop definido
      const kstop = `${s.ticker}_stop`;
      if (s.stopLoss && Number(s.qty) > 0 && price <= Number(s.stopLoss) && !firedRef.current[kstop]) {
        firedRef.current[kstop] = true;
        notify(`🛑 STOP-LOSS — ${s.ticker}`, `Preço ${fmtCurrency(price)} caiu até seu stop ${fmtCurrency(s.stopLoss)}. Reavalie a posição.`, "sell");
        setAlertLog(p => [{ id: Date.now(), ticker: s.ticker, type: "STOP", price, target: s.stopLoss, time: new Date() }, ...p.slice(0, 49)]);
      }
      if (s.stopLoss && price > Number(s.stopLoss) * 1.001) firedRef.current[kstop] = false;
    });
  }, [notify]);

  // Refresh cotações em lotes pequenos e sequenciais, respeitando o limite gratuito.
  // Em vez de pedir as 52 de uma vez (estoura o limite), pede de 5 em 5 com pausa.
  const refreshingRef = useRef(false);
  const refreshAll = useCallback(async () => {
    if (!stocks.length || refreshingRef.current) return;
    refreshingRef.current = true;
    const qs = { ...quotes };
    // Ritmo seguro para o plano gratuito do Finnhub (~60 req/min):
    // uma ação de cada vez, com pausa entre elas. Evita o erro 429.
    const PAUSE = 1100; // ~1,1s entre cada ação → no máximo ~55 consultas/min
    try {
      for (let i = 0; i < stocks.length; i++) {
        const s = stocks[i];
        setRefreshProgress({ done: i, total: stocks.length });
        const q = await fetchQuote(s.ticker);
        if (q && q.c) qs[s.ticker] = q;
        setQuotes({ ...qs });
        setLastUpdate(new Date());
        checkAlerts(qs, stocks, alerts);
        if (i < stocks.length - 1) await new Promise(r => setTimeout(r, PAUSE));
      }
    } finally {
      refreshingRef.current = false;
      setRefreshProgress(null);
    }
  }, [stocks, alerts, checkAlerts, quotes]);

  // Atualiza UMA ação sob demanda (rápido, não estoura limite)
  const refreshOne = useCallback(async (ticker) => {
    const q = await fetchQuote(ticker);
    if (q && q.c) {
      setQuotes(p => {
        const next = { ...p, [ticker]: q };
        checkAlerts(next, stocks, alerts);
        return next;
      });
      setLastUpdate(new Date());
    }
  }, [stocks, alerts, checkAlerts]);

  useEffect(() => {
    refreshAll();
    const id = setInterval(refreshAll, 120000); // a cada 2 min (mais leve no limite gratuito)
    return () => clearInterval(id);
    // eslint-disable-next-line
  }, [stocks.length]);

  // fetch 30-day range for a ticker (called when stock added/edited, and weekly refresh)
  const refresh30DayRange = useCallback(async (ticker) => {
    setRangeLoading(p => ({ ...p, [ticker]: true }));
    const range = await fetch30DayRange(ticker);
    if (range) {
      // Atualiza tanto a faixa exibida (min30/max30) quanto os campos do formulário (minPrice/maxPrice)
      setStocks(p => p.map(s => s.ticker === ticker
        ? { ...s, min30: range.min30, max30: range.max30, minPrice: range.min30, maxPrice: range.max30, rangeAt: range.fetchedAt }
        : s));
    }
    setRangeLoading(p => ({ ...p, [ticker]: false }));
  }, []);

  // Ao abrir: atualiza a faixa de 30 dias quando o mês virou desde a última busca (ou se nunca buscou).
  useEffect(() => {
    const now = new Date();
    const thisMonthKey = now.getFullYear() * 12 + now.getMonth();
    stocks.forEach(s => {
      let needs = false;
      if (!s.rangeAt) needs = true;
      else {
        const last = new Date(s.rangeAt);
        const lastMonthKey = last.getFullYear() * 12 + last.getMonth();
        if (thisMonthKey > lastMonthKey) needs = true; // mudou de mês
      }
      if (needs) refresh30DayRange(s.ticker);
    });
  }, []); // eslint-disable-line

  // auto-scan intelligence once per day
  useEffect(() => {
    if (!stocks.length) return;
    const today = new Date().toDateString();
    const lastScan = intelligence?._rawDate ? new Date(intelligence._rawDate).toDateString() : null;
    if (lastScan !== today) runScan();
  }, [stocks.length]); // eslint-disable-line

  const runScan = async () => {
    if (!stocks.length) return;
    setIntelLoading(true);
    const qs = { ...quotes };
    await Promise.all(stocks.map(async s => { if (!qs[s.ticker]) qs[s.ticker] = await fetchQuote(s.ticker); }));
    const result = await runIntelligenceScan(stocks, qs);
    const highItems = (result.items || []).filter(i => i.impact === "ALTO");
    if (highItems.length) {
      playAlert();
      highItems.forEach(item => {
        notify(
          `${TYPE_CONFIG[item.type]?.icon || "⚠️"} ${item.ticker} — ${item.impact} IMPACTO`,
          item.title,
          item.type === "AMEAÇA" ? "sell" : item.type === "OPORTUNIDADE" ? "buy" : "alert"
        );
      });
    }
    setIntelligence(result);
    setIntelLoading(false);
  };

  const analyseStock = async (stock) => {
    setLoading(p => ({ ...p, [stock.ticker]: true }));
    const [quote, newsData] = await Promise.all([fetchQuote(stock.ticker), fetchNews(stock.ticker)]);
    setQuotes(p => ({ ...p, [stock.ticker]: quote }));
    setNews(p => ({ ...p, [stock.ticker]: newsData }));
    const analysis = await fetchClaudeAnalysis(stock, quote, newsData.map(n => n.headline));
    setAnalyses(p => ({ ...p, [stock.ticker]: analysis }));
    setLoading(p => ({ ...p, [stock.ticker]: false }));
    setSelectedStock(stock.ticker); setActiveTab("analysis");
  };

  // Auto-fill company data when ticker field loses focus
  const autoFillFromTicker = async () => {
    const ticker = form.ticker.toUpperCase().trim();
    if (!ticker) return;
    setAutoFilling(true);
    setAutoFillMsg(null);
    const [profile, range, divs] = await Promise.all([
      fetchProfile(ticker),
      fetch30DayRange(ticker),
      fetchDividends(ticker),
    ]);
    setForm(p => {
      const next = { ...p, ticker };
      if (profile) {
        if (!p.name && profile.name)        next.name = profile.name;
        if (!p.sector && profile.sector)    next.sector = profile.sector;
        if (p.paysDividends === "nao" && !p.dividendYield) {
          next.paysDividends = profile.paysDividends ? "sim" : "nao";
          if (profile.dividendYield != null) next.dividendYield = String(profile.dividendYield);
        }
      }
      // dividendos — preenche frequência e marca como pagadora se houver histórico
      if (divs) {
        if (!p.dividendFrequency && divs.frequency) next.dividendFrequency = divs.frequency;
        if (p.paysDividends === "nao" && (divs.nextPayDate || divs.lastPayDate)) next.paysDividends = "sim";
      }
      // Faixa de 30 dias do mercado: preenche os campos Menor/Maior Preço 30D automaticamente
      // (mesmo sem posição), para ações em observação ficarem completas de uma vez.
      if (range) {
        if (range.min30 != null) next.minPrice = String(range.min30.toFixed(2));
        if (range.max30 != null) next.maxPrice = String(range.max30.toFixed(2));
      }
      return next;
    });
    const found = [];
    if (profile?.name)        found.push("nome");
    if (profile?.sector)      found.push("setor");
    if (profile?.paysDividends || divs?.nextPayDate || divs?.lastPayDate) {
      let divInfo = "dividendos";
      if (profile?.dividendYield) divInfo += ` (yield ${profile.dividendYield}%`;
      if (divs?.frequency) divInfo += profile?.dividendYield ? `, ${divs.frequency.toLowerCase()})` : ` (${divs.frequency.toLowerCase()})`;
      else if (profile?.dividendYield) divInfo += ")";
      found.push(divInfo);
    } else if (profile) found.push("sem dividendos");
    if (range)                found.push("mín/máx 30d");
    setAutoFillMsg(found.length ? `✓ Preenchido: ${found.join(", ")}` : "Não encontrei dados automáticos para este ticker.");
    setAutoFilling(false);
  };

  // stock CRUD
  const saveStock = () => {
    const qty      = Number(form.qty);
    const avgPrice = Number(form.avgPrice);
    const s = {
      id: editId || Date.now(),
      ticker: form.ticker.toUpperCase().trim(), name: form.name.trim(),
      qty, avgPrice,
      // Menor/Maior preço dos últimos 30 dias (mercado). Preenchido manualmente agora;
      // será atualizado automaticamente quando o app estiver online.
      minPrice: form.minPrice ? Number(form.minPrice) : null,
      maxPrice: form.maxPrice ? Number(form.maxPrice) : null,
      // new fields — totalInvested defaults to qty×avgPrice if not filled
      totalInvested: form.totalInvested ? Number(form.totalInvested) : qty * avgPrice,
      sector: form.sector || "",
      assetClass: form.assetClass || "Ação",
      leveraged: !!form.leveraged,
      strategy: form.strategy || "Satélite",
      stopLoss: form.stopLoss ? Number(form.stopLoss) : null,
      buyDate: form.buyDate || null,
      note: form.note || "",
      archived: !!form.archived,
      paysDividends: form.paysDividends === "sim",
      dividendYield: form.dividendYield ? Number(form.dividendYield) : null,
      dividendFrequency: form.dividendFrequency || null,
      status: form.status || "MANTER",
      realizedPL: form.realizedPL ? Number(form.realizedPL) : 0,
      nextPayDate: null,
      // min30/max30 = faixa exibida na tabela. Usa o valor manual se informado.
      min30: form.minPrice ? Number(form.minPrice) : null,
      max30: form.maxPrice ? Number(form.maxPrice) : null,
      rangeAt: (form.minPrice || form.maxPrice) ? Date.now() : null,
    };
    // Exige apenas o ticker. Quantidade e preço podem ser 0 (ações em observação).
    if (!s.ticker) return;
    setStocks(p => {
      const existing = p.find(x => x.id === editId);
      // Ao editar: se a usuária informou min/max manual, usa o dela; senão preserva o que já havia.
      const merged = existing ? {
        ...existing, ...s,
        min30: (form.minPrice ? Number(form.minPrice) : existing.min30),
        max30: (form.maxPrice ? Number(form.maxPrice) : existing.max30),
        rangeAt: (form.minPrice || form.maxPrice) ? Date.now() : existing.rangeAt,
      } : s;
      return editId ? p.map(x => x.id === editId ? merged : x) : [...p, s];
    });
    // Busca a faixa real de 30 dias (só funciona quando online; não apaga valor manual em caso de falha)
    setTimeout(() => refresh30DayRange(s.ticker), 300);
    setForm({ ticker: "", name: "", assetClass: "Ação", qty: "", avgPrice: "", minPrice: "", maxPrice: "", totalInvested: "", sector: "", leveraged: false, strategy: "Satélite", paysDividends: "nao", dividendYield: "", dividendFrequency: "", status: "MANTER", realizedPL: "", stopLoss: "", buyDate: "", note: "", archived: false });
    setAutoFillMsg(null);
    setShowForm(false); setEditId(null);
  };
  const deleteStock = (id) => setStocks(p => p.filter(x => x.id !== id));
  const startEdit = (s) => {
    setForm({
      ticker: s.ticker, name: s.name, qty: s.qty, avgPrice: s.avgPrice,
      minPrice: s.min30 ?? s.minPrice ?? "",
      maxPrice: s.max30 ?? s.maxPrice ?? "",
      totalInvested: s.totalInvested ?? "",
      sector: s.sector || "",
      assetClass: s.assetClass || "Ação",
      leveraged: !!s.leveraged,
      strategy: s.strategy || "Satélite",
      stopLoss: s.stopLoss ?? "",
      buyDate: s.buyDate ?? "",
      note: s.note ?? "",
      archived: !!s.archived,
      paysDividends: s.paysDividends ? "sim" : "nao",
      dividendYield: s.dividendYield ?? "",
      dividendFrequency: s.dividendFrequency ?? "",
      status: s.status || "MANTER",
      realizedPL: s.realizedPL ?? "",
    });
    setEditId(s.id); setShowForm(true);
  };

  // alert CRUD
  const openAlertForm = (ticker) => {
    const a = alerts[ticker] || {};
    setAlertForm({ sellTarget: a.sellTarget || "", buyTarget: a.buyTarget || "" });
    setShowAlertForm(ticker);
  };
  const saveAlert = () => {
    const ticker = showAlertForm;
    const sell = alertForm.sellTarget ? Number(alertForm.sellTarget) : null;
    const buy  = alertForm.buyTarget  ? Number(alertForm.buyTarget)  : null;
    setAlerts(p => ({ ...p, [ticker]: { sellTarget: sell, buyTarget: buy, active: !!(sell || buy) } }));
    firedRef.current[`${ticker}_sell`] = false;
    firedRef.current[`${ticker}_buy`]  = false;
    setShowAlertForm(null);
  };
  const clearAlert = (ticker) => {
    setAlerts(p => { const n = { ...p }; delete n[ticker]; return n; });
    firedRef.current[`${ticker}_sell`] = false;
    firedRef.current[`${ticker}_buy`]  = false;
  };

  // ── Transações (fundação para rentabilidade real) ──
  const saveTransaction = () => {
    const qtyNum = Number(txForm.qty);
    const totalNum = Number(txForm.total);
    // O valor total é o que a usuária digita (vem do extrato); o preço por ação é derivado.
    const pricePerShare = qtyNum > 0 ? totalNum / qtyNum : 0;
    const tx = {
      id: Date.now(),
      ticker: txForm.ticker.toUpperCase().trim(),
      type: txForm.type, // COMPRA | VENDA
      qty: qtyNum,
      price: pricePerShare,
      total: totalNum,
      date: txForm.date,
      fees: txForm.fees ? Number(txForm.fees) : 0,
    };
    if (!tx.ticker || !tx.qty || !tx.total) return;

    const editingId = txForm._editingId || null;

    // Se estamos EDITANDO: monta a nova lista (sem a antiga, com a nova) e recalcula a posição do zero.
    if (editingId) {
      const newList = [tx, ...transactions.filter(t => t.id !== editingId)]
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setTransactions(newList);
      recomputePositionFromTx(tx.ticker, newList);
      setShowTxForm(false);
      setTxForm({ ticker: "", type: "COMPRA", qty: "", total: "", date: new Date().toISOString().slice(0, 10), fees: "" });
      addToast(`Transação de ${tx.ticker} atualizada e posição recalculada.`, "info");
      return;
    }

    setTransactions(p => [tx, ...p].sort((a, b) => new Date(b.date) - new Date(a.date)));

    // Atualiza a posição na carteira a partir da transação
    setStocks(prev => {
      const existing = prev.find(s => s.ticker === tx.ticker);
      if (tx.type === "COMPRA") {
        if (existing) {
          // Força tudo a ser número, para evitar somas erradas (ex: "100"+20 como texto)
          const exQty   = Number(existing.qty) || 0;
          const exAvg   = Number(existing.avgPrice) || 0;
          const exTotal = Number(existing.totalInvested) || (exQty * exAvg);
          const oldCost = exQty * exAvg;
          const newCost = tx.qty * tx.price + tx.fees;
          const newQty  = exQty + tx.qty;
          const newAvg  = newQty > 0 ? (oldCost + newCost) / newQty : 0;
          return prev.map(s => s.ticker === tx.ticker
            ? { ...s, qty: newQty, avgPrice: newAvg, totalInvested: exTotal + newCost }
            : s);
        }
        // nova posição
        return [...prev, {
          id: Date.now() + 1, ticker: tx.ticker, name: tx.ticker, assetClass: "Ação", sector: "",
          leveraged: false, strategy: "Satélite",
          qty: tx.qty, avgPrice: tx.price, totalInvested: tx.qty * tx.price + tx.fees,
          minPrice: null, maxPrice: null, paysDividends: false, dividendYield: null,
          dividendFrequency: null, status: "MANTER", realizedPL: 0,
          stopLoss: null, buyDate: tx.date, note: "", archived: false,
          nextPayDate: null, min30: null, max30: null, rangeAt: null,
        }];
      } else { // VENDA
        if (existing) {
          const exQty   = Number(existing.qty) || 0;
          const exAvg   = Number(existing.avgPrice) || 0;
          const exReal  = Number(existing.realizedPL) || 0;
          const exTotal = Number(existing.totalInvested) || (exQty * exAvg);
          const newQty = Math.max(0, exQty - tx.qty);
          // Só calcula lucro realizado se houver um preço médio de compra válido.
          // Sem preço médio (=0), não dá para saber o custo — então não inventa lucro.
          let realizedGain = 0;
          let semCusto = false;
          if (exAvg > 0) {
            realizedGain = (tx.price - exAvg) * tx.qty - tx.fees;
          } else {
            semCusto = true; // marca que a venda foi registrada sem base de custo
          }
          const newRealizedPL = exReal + realizedGain;
          // Reduz o total investido proporcionalmente à parte vendida
          const soldFraction = exQty > 0 ? tx.qty / exQty : 0;
          const newTotalInvested = Math.max(0, exTotal * (1 - soldFraction));
          // Guarda o resultado da venda para a mensagem de confirmação
          lastSellResultRef.current = { ticker: tx.ticker, gain: realizedGain, soldAll: newQty === 0, semCusto };
          return prev.map(s => s.ticker === tx.ticker
            ? { ...s, qty: newQty, realizedPL: newRealizedPL, totalInvested: newTotalInvested }
            : s);
        }
        return prev;
      }
    });

    setTxForm({ ticker: "", type: "COMPRA", qty: "", total: "", date: new Date().toISOString().slice(0, 10), fees: "" });
    setShowTxForm(false);

    // Feedback do resultado da venda
    if (tx.type === "VENDA" && lastSellResultRef.current) {
      const { ticker, gain, soldAll, semCusto } = lastSellResultRef.current;
      if (semCusto) {
        addToast(`⚠️ Venda de ${ticker} registrada, mas sem preço médio de compra cadastrado — o lucro/prejuízo NÃO foi calculado. Edite a ação e informe o preço médio para o cálculo ficar correto.`, "sell");
      } else {
        const gainTxt = gain >= 0 ? `lucro de ${fmtCurrency(gain)}` : `prejuízo de ${fmtCurrency(Math.abs(gain))}`;
        addToast(`${gain >= 0 ? "📈" : "📉"} Venda de ${ticker} registrada — ${gainTxt} realizado.${soldAll ? " Posição zerada (agora em 👀 Observando)." : ""}`, gain >= 0 ? "buy" : "sell");
      }
      lastSellResultRef.current = null;
    }
  };
  // Recalcula a posição de uma ação do zero, a partir de uma lista de transações.
  // Usada ao editar ou apagar transações — garante consistência total.
  const recomputePositionFromTx = (ticker, txList) => {
    const txForTicker = txList
      .filter(t => t.ticker === ticker)
      .sort((a, b) => new Date(a.date) - new Date(b.date) || a.id - b.id);
    setStocks(prev => prev.map(s => {
      if (s.ticker !== ticker) return s;
      let qty = 0, totalCost = 0, realizedPL = 0;
      for (const t of txForTicker) {
        const tQty = Number(t.qty) || 0;
        const tPrice = Number(t.price) || 0;
        const tFees = Number(t.fees) || 0;
        if (t.type === "COMPRA") {
          totalCost += tQty * tPrice + tFees;
          qty += tQty;
        } else {
          const avg = qty > 0 ? totalCost / qty : 0;
          realizedPL += (tPrice - avg) * tQty - tFees;
          const soldFraction = qty > 0 ? tQty / qty : 0;
          totalCost = Math.max(0, totalCost * (1 - soldFraction));
          qty = Math.max(0, qty - tQty);
        }
      }
      const avgPrice = qty > 0 ? totalCost / qty : (Number(s.avgPrice) || 0);
      return { ...s, qty, avgPrice: qty > 0 ? avgPrice : s.avgPrice, totalInvested: totalCost, realizedPL };
    }));
  };

  // Apagar uma transação: remove da lista E recalcula a posição da ação do zero.
  const deleteTransaction = (id) => {
    const txToDelete = transactions.find(t => t.id === id);
    if (!txToDelete) return;
    if (!window.confirm(`Apagar esta transação de ${txToDelete.type === "VENDA" ? "venda" : "compra"} de ${txToDelete.ticker}? A posição da ação será recalculada.`)) return;
    const ticker = txToDelete.ticker;
    const remaining = transactions.filter(t => t.id !== id);
    setTransactions(remaining);
    recomputePositionFromTx(ticker, remaining);
    addToast(`Transação de ${ticker} apagada e posição recalculada.`, "info");
  };

  // ── Fluxo de dividendos (mensal e anual projetado) ──
  const dividendFlow = (() => {
    const monthly = {}; // chave "YYYY-MM" → valor
    let annualTotal = 0;
    stocks.forEach(s => {
      if (!s.paysDividends || !s.dividendYield) return;
      const q = quotes[s.ticker];
      const posValue = q?.c ? s.qty * q.c : s.qty * s.avgPrice;
      const annual = posValue * (s.dividendYield / 100);
      annualTotal += annual;
    });
    return { annualTotal, monthlyAvg: annualTotal / 12 };
  })();

  // ── Custo total real x valor de mercado (base p/ rentabilidade) ──
  const realCostBasis = stocks.reduce((acc, s) => acc + (s.totalInvested || s.qty * s.avgPrice), 0);

  // totals
  const totals = stocks.reduce((acc, s) => {
    const q = quotes[s.ticker];
    // Valor investido = totalInvested (fonte confiável da planilha); fallback p/ qty×médio
    const invested = (s.totalInvested != null && s.totalInvested > 0) ? s.totalInvested : s.qty * s.avgPrice;
    acc.invested += invested;
    acc.current  += q?.c ? s.qty * q.c : invested;
    return acc;
  }, { invested: 0, current: 0 });
  const totalPL    = totals.current - totals.invested;
  const totalPLPct = totals.invested ? (totalPL / totals.invested) * 100 : 0;

  // Registra um retrato diário do patrimônio (só quando há cotações reais carregadas)
  useEffect(() => {
    if (!stocks.length) return;
    const hasLiveQuotes = stocks.some(s => quotes[s.ticker]?.c);
    if (!hasLiveQuotes) return; // offline: não registra ponto falso
    const today = new Date().toISOString().slice(0, 10);
    setPatrimonyHistory(prev => {
      const withoutToday = prev.filter(p => p.date !== today);
      const point = { date: today, value: Math.round(totals.current * 100) / 100, invested: Math.round(totals.invested * 100) / 100 };
      return [...withoutToday, point].sort((a, b) => a.date.localeCompare(b.date)).slice(-365); // guarda 1 ano
    });
    // eslint-disable-next-line
  }, [Math.round(totals.current)]);

  const selStock    = stocks.find(s => s.ticker === selectedStock);
  const selAnalysis = analyses[selectedStock];
  const selNews     = news[selectedStock] || [];
  const selQuote    = quotes[selectedStock];
  const activeAlerts = Object.values(alerts).filter(a => a?.active).length;
  const intelItems   = intelligence?.items || [];
  const filteredItems = intelFilter === "TODOS" ? intelItems
    : intelItems.filter(i => i.type === intelFilter || i.impact === intelFilter || i.ticker === intelFilter);
  const highCount   = intelItems.filter(i => i.impact === "ALTO").length;
  const threatCount = intelItems.filter(i => i.type === "AMEAÇA").length;
  const oppCount    = intelItems.filter(i => i.type === "OPORTUNIDADE").length;

  // ── CSS ───────────────────────────────────────────────────────────────────
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#0a0e17;color:#e6edf5;font-family:'Inter',sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased}
    ::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#243049;border-radius:3px}
    .mono{font-family:'IBM Plex Mono',monospace}
    .ti{font-size:18px;line-height:1;vertical-align:-2px}
    .app{max-width:1200px;margin:0 auto;padding:18px}
    .header{display:flex;align-items:center;justify-content:space-between;padding:18px 0 22px;border-bottom:1px solid #1a2133;margin-bottom:22px;flex-wrap:wrap;gap:12px}
    .logo{font-family:'Inter',sans-serif;font-size:19px;font-weight:700;color:#f4f8fc;letter-spacing:-0.3px;display:flex;align-items:center;gap:9px}
    .logo .logo-mark{width:30px;height:30px;border-radius:9px;background:linear-gradient(135deg,#0ea5e9,#22d3ee);display:flex;align-items:center;justify-content:center;color:#06202e}
    .logo span{background:linear-gradient(135deg,#22d3ee,#34d399);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
    .sub{font-size:11px;color:#5a6b85;margin-top:2px}
    .badge{font-size:11px;background:#111a2b;border:1px solid #1f2a40;padding:4px 10px;border-radius:7px;color:#7b8aa5;display:inline-flex;align-items:center;gap:5px}
    .badge-alert{background:#06231a;border-color:#0f7a52;color:#34d399}
    .badge-threat{background:#23090b;border-color:#7f1d1d;color:#f87171}
    .badge-notif-off{background:#231a05;border-color:#7a5a13;color:#fbbf24;cursor:pointer;transition:all .2s}.badge-notif-off:hover{background:#2e2208}
    .badge-notif-on{background:#06231a;border-color:#0f7a52;color:#34d399}
    .totals{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:22px}
    .card{background:#0f1623;border:1px solid #1c2740;border-radius:14px;padding:18px 20px}
    .card-label{font-size:11px;text-transform:uppercase;letter-spacing:.6px;color:#5a6b85;margin-bottom:7px;font-weight:500}
    .card-val{font-family:'IBM Plex Mono',monospace;font-size:22px;font-weight:600}
    .tabs{display:flex;gap:4px;border-bottom:1px solid #1a2133;margin-bottom:22px;flex-wrap:wrap}
    .tab{padding:11px 16px;font-size:13.5px;cursor:pointer;border-bottom:2px solid transparent;color:#6b7a96;transition:all .18s;background:none;border-top:none;border-left:none;border-right:none;white-space:nowrap;display:inline-flex;align-items:center;gap:7px;font-weight:500;font-family:'Inter',sans-serif}
    .tab.active{color:#f4f8fc;border-bottom-color:#22d3ee}.tab:hover:not(.active){color:#a9b6cc}
    .btn{padding:8px 15px;border-radius:9px;font-size:13px;cursor:pointer;border:none;transition:all .15s;font-family:'Inter',sans-serif;font-weight:500;display:inline-flex;align-items:center;gap:6px}
    .btn-primary{background:linear-gradient(135deg,#0ea5e9,#22d3ee);color:#04141d}.btn-primary:hover{filter:brightness(1.08)}
    .btn-sm{padding:6px 11px;font-size:12px;border-radius:8px}
    .btn-ghost{background:#111a2b;border:1px solid #1f2a40;color:#8b9ab5}.btn-ghost:hover{border-color:#22d3ee;color:#22d3ee}
    .btn-danger{background:transparent;border:1px solid #7f1d1d;color:#ef4444}.btn-danger:hover{background:#23090b}
    .btn-analyse{background:#06231a;border:1px solid #0f7a52;color:#34d399}.btn-analyse:hover{background:#0a3326}
    .btn-bell{background:#111a2b;border:1px solid #1f2a40;color:#5a6b85}.btn-bell:hover{border-color:#22d3ee;color:#8b9ab5}.btn-bell.active{background:#06231a;border-color:#0f7a52;color:#34d399}
    .btn-scan{background:#15082b;border:1px solid #6d28d9;color:#a78bfa}.btn-scan:hover{background:#1d0a3a}
    .table{width:100%;border-collapse:collapse}
    .table th{font-size:10.5px;text-transform:uppercase;letter-spacing:.6px;color:#5a6b85;padding:10px 11px;text-align:left;border-bottom:1px solid #1c2740;font-weight:500}
    .table td{padding:12px 11px;border-bottom:1px solid #141d2e;font-size:13px;vertical-align:middle}
    .table tr:hover td{background:#101a2a}
    .ticker-cell{font-family:'IBM Plex Mono',monospace;font-weight:600;font-size:14px;color:#f4f8fc}
    .name-cell{color:#6b7a96;font-size:11.5px;margin-top:1px}
    .range-cell{font-size:11px;font-family:'IBM Plex Mono',monospace}
    .range-bar-wrap{height:5px;background:#1c2740;border-radius:3px;margin-top:4px;position:relative;overflow:visible}
    .range-bar-fill{height:5px;background:linear-gradient(90deg,#10b981,#f59e0b,#ef4444);border-radius:3px;position:absolute;left:0;top:0}
    .range-dot{width:9px;height:9px;background:#f4f8fc;border-radius:50%;position:absolute;top:-2px;transform:translateX(-50%);border:1.5px solid #0f1623}
    .range-avg{width:3px;height:11px;background:#22d3ee;position:absolute;top:-3px;transform:translateX(-50%);border-radius:1px;box-shadow:0 0 0 1px #0f1623}
    .form-overlay{position:fixed;inset:0;background:rgba(3,7,14,.8);display:flex;align-items:center;justify-content:center;z-index:100;backdrop-filter:blur(6px)}
    .form-box{background:#0f1623;border:1px solid #1c2740;border-radius:16px;padding:28px;width:500px;max-width:95vw;max-height:90vh;overflow-y:auto}
    .form-title{font-size:16px;font-weight:600;margin-bottom:20px;color:#f4f8fc}
    .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:13px;margin-bottom:16px}
    .form-full{grid-column:1/-1}
    .form-group{display:flex;flex-direction:column;gap:5px}
    .form-label{font-size:11px;color:#7b8aa5;text-transform:uppercase;letter-spacing:.5px;font-weight:500}
    .form-input{background:#0a0e17;border:1px solid #1f2a40;border-radius:9px;padding:10px 13px;color:#e6edf5;font-size:13px;font-family:'IBM Plex Mono',monospace;outline:none;transition:border .15s}
    .form-input:focus{border-color:#22d3ee}
    select.form-input option{background:#0f1623;color:#e6edf5}
    .form-hint{font-size:11.5px;color:#5a6b85;margin-top:2px;line-height:1.55}
    .form-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:12px}
    .analysis-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .analysis-main{display:flex;flex-direction:column;gap:14px}
    .signal-card{border-radius:14px;padding:22px;border:1px solid}
    .signal-ticker{font-family:'IBM Plex Mono',monospace;font-size:13px;opacity:.7;margin-bottom:4px}
    .signal-label{font-size:28px;font-weight:600;font-family:'IBM Plex Mono',monospace;letter-spacing:1px;margin-bottom:8px}
    .confidence-bar{height:5px;background:#1c2740;border-radius:3px;margin-top:8px;overflow:hidden}
    .confidence-fill{height:100%;border-radius:3px;transition:width .6s}
    .reasons-list{list-style:none;display:flex;flex-direction:column;gap:7px}
    .reasons-list li{font-size:13px;color:#a9b6cc;padding-left:18px;position:relative;line-height:1.5}
    .reasons-list li::before{content:"→";position:absolute;left:0;color:#5a6b85}
    .news-item{padding:12px 0;border-bottom:1px solid #141d2e}.news-item:last-child{border-bottom:none}
    .news-headline{font-size:13px;color:#cbd5e1;margin-bottom:4px;line-height:1.4}
    .news-meta{font-size:11px;color:#5a6b85;font-family:'IBM Plex Mono',monospace}
    .empty{text-align:center;padding:60px 20px;color:#5a6b85}
    .empty-icon{font-size:40px;margin-bottom:14px;color:#2f3e5a}
    .alert-section{background:#0a0e17;border-radius:11px;padding:16px;margin-bottom:12px;border:1px solid}
    .alert-pill{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-family:'IBM Plex Mono',monospace;padding:3px 8px;border-radius:6px}
    .alert-pill-sell{background:#23090b;border:1px solid #7f1d1d;color:#f87171}
    .alert-pill-buy{background:#06231a;border:1px solid #0f7a52;color:#34d399}
    .test-row{display:flex;gap:8px;margin-top:14px;flex-wrap:wrap}
    .intel-header{background:#0d0618;border:1px solid #3b0764;border-radius:14px;padding:20px;margin-bottom:16px}
    .intel-meta{font-size:11px;color:#a78bfa;font-family:'IBM Plex Mono',monospace;margin-bottom:8px}
    .intel-summary{font-size:14px;color:#c4b5fd;line-height:1.6}
    .intel-stats{display:flex;gap:20px;margin-top:14px;flex-wrap:wrap}
    .intel-stat{display:flex;flex-direction:column;gap:2px}
    .intel-stat-val{font-family:'IBM Plex Mono',monospace;font-size:20px;font-weight:600}
    .intel-stat-label{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#64748b}
    .intel-filters{display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap;align-items:center}
    .filter-btn{padding:4px 10px;border-radius:20px;font-size:11px;cursor:pointer;border:1px solid #1e293b;background:transparent;color:#64748b;transition:all .15s;font-family:'IBM Plex Sans',sans-serif}
    .filter-btn.active{background:#1e293b;color:#e2e8f0;border-color:#334155}
    .intel-item{border:1px solid;border-radius:8px;margin-bottom:10px;overflow:hidden;transition:border-color .2s}
    .intel-item-header{display:flex;align-items:flex-start;gap:12px;padding:14px 16px;cursor:pointer;user-select:none}
    .intel-item-header:hover{background:rgba(255,255,255,.02)}
    .intel-item-body{padding:0 16px 16px;border-top:1px solid rgba(255,255,255,.05)}
    .intel-icon{font-size:20px;flex-shrink:0;margin-top:1px}
    .intel-main{flex:1;min-width:0}
    .intel-title{font-size:14px;font-weight:600;color:#f8fafc;margin-bottom:4px;line-height:1.4}
    .intel-tags{display:flex;gap:6px;flex-wrap:wrap}
    .intel-tag{font-size:10px;padding:2px 7px;border-radius:3px;font-family:'IBM Plex Mono',monospace;font-weight:600;letter-spacing:.5px}
    .intel-right{display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0}
    .intel-ticker{font-family:'IBM Plex Mono',monospace;font-size:13px;font-weight:600;color:#f8fafc}
    .intel-detail{font-size:13px;color:#94a3b8;line-height:1.6;margin:12px 0 10px}
    .intel-action{background:#0f172a;border:1px solid #1e293b;border-radius:5px;padding:10px 12px;font-size:12px;color:#60a5fa;line-height:1.5}
    .intel-action-label{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#3b82f6;margin-bottom:4px;font-weight:600}
    .intel-source{font-size:11px;color:#475569;font-family:'IBM Plex Mono',monospace;margin-top:8px}
    .scan-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;gap:14px}
    .scan-spinner{width:40px;height:40px;border:3px solid #1e293b;border-top-color:#7c3aed;border-radius:50%;animation:spin .8s linear infinite}
    @keyframes spin{to{transform:rotate(360deg)}}
    .log-item{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #0f172a}.log-item:last-child{border-bottom:none}
    .log-badge{font-size:10px;font-weight:700;padding:2px 7px;border-radius:3px;font-family:'IBM Plex Mono',monospace;letter-spacing:.5px}
    .log-badge-sell{background:#2d0a0a;color:#f87171}.log-badge-buy{background:#052e16;color:#4ade80}
    .toast-wrap{position:fixed;bottom:24px;right:24px;display:flex;flex-direction:column;gap:10px;z-index:999;pointer-events:none;max-width:360px}
    .toast{padding:14px 18px;border-radius:8px;font-size:12px;font-weight:500;animation:slideIn .3s ease;pointer-events:auto;line-height:1.5;font-family:'IBM Plex Mono',monospace;word-break:break-word}
    .toast-sell{background:#1a0404;border:1px solid #dc2626;color:#fca5a5;box-shadow:0 0 20px rgba(220,38,38,.2)}
    .toast-buy{background:#021a0a;border:1px solid #16a34a;color:#86efac;box-shadow:0 0 20px rgba(22,163,74,.2)}
    .toast-info{background:#0d1117;border:1px solid #3b82f6;color:#93c5fd}
    .toast-alert{background:#13001a;border:1px solid #7c3aed;color:#c4b5fd}
    @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
    .notif-banner{background:#0a0010;border:1px solid #7c3aed;border-radius:8px;padding:14px 18px;margin-bottom:18px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
    .notif-banner-text{font-size:13px;color:#c4b5fd;line-height:1.5}
    .notif-banner-text strong{color:#f8fafc}
    .pulse{animation:pulse 2s infinite}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
    @media(max-width:760px){.totals{grid-template-columns:1fr 1fr}.analysis-grid{grid-template-columns:1fr}.form-grid{grid-template-columns:1fr}.header{flex-direction:column;align-items:flex-start}}
  `;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>

      <div className="toast-wrap">
        {toasts.map(t => <div key={t.id} className={`toast toast-${t.type}`}>{t.msg}</div>)}
      </div>

      <div className="app">
        {/* HEADER */}
        <div className="header">
          <div>
            <div className="logo"><span className="logo-mark"><Icon name="chart" /></span>{userProfile.name ? `${userProfile.name.toUpperCase()}` : "KÁTIA"}<span>.</span>TRADE</div>
            <div className="sub">Portfólio · IA · Alertas · Inteligência de Mercado</div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            {/* aviso discreto só quando notificações bloqueadas */}
            {notifPerm === "denied" && (
              <span className="badge badge-threat" style={{ cursor: "pointer" }} onClick={() => addToast("As notificações foram bloqueadas pelo navegador. Para reativar: clique no cadeado ao lado do endereço do site, em 'Notificações' escolha 'Permitir', e recarregue a página.", "info")} title="Notificações bloqueadas — clique para saber como reativar"><Icon name="bell" size={14} /> Notificações off</span>
            )}
            {notifPerm !== "granted" && notifPerm !== "denied" && notifPerm !== "unsupported" && (
              <button className="btn btn-ghost btn-sm" onClick={enableNotifications} title="Ativar notificações"><Icon name="bell" /> Ativar avisos</button>
            )}
            {highCount > 0 && <span className="badge badge-threat pulse" style={{ cursor: "pointer" }} onClick={() => setActiveTab("analysis")} title="Ver análises"><Icon name="alert" size={14} /> {highCount} crítico{highCount > 1 ? "s" : ""}</span>}
            {refreshProgress
              ? <span className="badge" style={{ color: "#22d3ee" }}><Icon name="refresh" size={13} /> atualizando {refreshProgress.done}/{refreshProgress.total}…</span>
              : lastUpdate && <span className="badge"><Icon name="refresh" size={13} /> {lastUpdate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>}
            {/* engrenagem com menu */}
            <div style={{ position: "relative" }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowSettings(v => !v)} title="Configurações e ferramentas" aria-label="Configurações"><Icon name="gear" /></button>
              {showSettings && (
                <>
                  <div onClick={() => setShowSettings(false)} style={{ position: "fixed", inset: 0, zIndex: 49 }} />
                  <div style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", zIndex: 50, background: "#0f1623", border: "1px solid #1c2740", borderRadius: 12, padding: 6, minWidth: 210, boxShadow: "0 12px 32px rgba(0,0,0,.5)" }}>
                    {[
                      ["refresh", "Atualizar cotações", () => { refreshAll(); setShowSettings(false); }],
                      ["spreadsheet", "Exportar (Excel/CSV)", () => { exportCSV(); setShowSettings(false); }],
                      ["download", "Fazer backup", () => { exportData(); setShowSettings(false); }],
                      ["upload", "Restaurar backup", () => { importInputRef.current?.click(); setShowSettings(false); }],
                      ["gear", "Perfil da carteira", () => { setShowProfile(true); setShowSettings(false); }],
                    ].map(([icon, label, fn]) => (
                      <button key={label} onClick={fn} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 11px", background: "none", border: "none", color: "#cdd6e4", fontSize: 13, cursor: "pointer", borderRadius: 8, textAlign: "left", fontFamily: "'Inter',sans-serif" }} onMouseEnter={e => e.currentTarget.style.background = "#16203a"} onMouseLeave={e => e.currentTarget.style.background = "none"}>
                        <Icon name={icon} size={16} /> {label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <input ref={importInputRef} type="file" accept="application/json,.json" style={{ display: "none" }} onChange={importData} />
          </div>
        </div>

        {/* NOTIFICATION PROMPT BANNER */}
        {notifPerm !== "granted" && notifPerm !== "denied" && notifPerm !== "unsupported" && (
          <div className="notif-banner">
            <div className="notif-banner-text">
              <strong>Ative as notificações</strong> para receber alertas de preço e inteligência de mercado mesmo com o navegador em segundo plano ou a aba fechada.
            </div>
            <button className="btn btn-primary btn-sm" onClick={enableNotifications}>Ativar agora</button>
          </div>
        )}

        {/* TOTALS */}
        <div className="totals">
          {[
            ["Total Investido", fmtCurrency(totals.invested), "#94a3b8"],
            ["Valor Atual",     fmtCurrency(totals.current),  "#e2e8f0"],
            ["Resultado (P&L)", fmtCurrency(totalPL),         pctColor(totalPL)],
            ["Rentabilidade",   fmtPct(totalPLPct),           pctColor(totalPLPct)],
          ].map(([label, val, color]) => (
            <div className="card" key={label}>
              <div className="card-label">{label}</div>
              <div className="card-val" style={{ color }}>{val}</div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div className="tabs">
          {[["portfolio","wallet","Carteira"],["watchlist","eye","Observando"],["archived","trash","Arquivadas"],["distribution","donut","Distribuição"],["dividends","trending","Resultados"],["transactions","exchange","Transações"],["analysis","sparkles","Análise IA"],["alertlog","bell","Alertas"]].map(([id, icon, label]) => (
            <button key={id} className={`tab${activeTab === id ? " active" : ""}`} onClick={() => setActiveTab(id)}><Icon name={icon} /> {label}</button>
          ))}
        </div>

        {/* Busca + adicionar ação — aparece nas abas de tabela */}
        {["portfolio","watchlist"].includes(activeTab) && (
          <div style={{ marginBottom: 16, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: 1, maxWidth: 360, minWidth: 200 }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#5a6b85", fontSize: 16, pointerEvents: "none" }}><Icon name="search" /></span>
              <input
                className="form-input"
                style={{ width: "100%", paddingLeft: 34, paddingRight: searchQuery ? 34 : 12 }}
                placeholder="Buscar..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  title="Limpar busca"
                  style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>
                  ×
                </button>
              )}
            </div>
            <button className="btn btn-primary btn-sm" style={{ padding: "9px 15px" }} onClick={() => { setShowForm(true); setEditId(null); setForm({ ticker: "", name: "", assetClass: "Ação", qty: "", avgPrice: "", minPrice: "", maxPrice: "", totalInvested: "", sector: "", leveraged: false, strategy: "Satélite", paysDividends: "nao", dividendYield: "", dividendFrequency: "", status: "MANTER", realizedPL: "", stopLoss: "", buyDate: "", note: "", archived: false }); }}><Icon name="plus" /> Ação</button>
          </div>
        )}

        {/* ── DIVIDENDOS (fluxo de renda) ── */}
        {activeTab === "dividends" && (() => {
          const payers = stocks.filter(s => s.paysDividends && s.dividendYield && Number(s.qty) > 0 && !s.archived).map(s => {
            const q = quotes[s.ticker];
            const posValue = q?.c ? s.qty * q.c : s.qty * s.avgPrice;
            const annual = posValue * (s.dividendYield / 100);
            return { ...s, posValue, annual, monthly: annual / 12 };
          }).sort((a, b) => b.annual - a.annual);

          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* RENTABILIDADE TOTAL DA CARTEIRA */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                {[
                  ["Valor Atual", totals.current > 0 ? fmtCurrency(totals.current) : "—", "#e2e8f0"],
                  ["Total Investido", fmtCurrency(totals.invested), "#94a3b8"],
                  ["Lucro/Prejuízo (não realizado)", totals.current > 0 ? fmtCurrency(totalPL) : "—", totalPL >= 0 ? "#4ade80" : "#f87171"],
                  ["Rentabilidade", totals.current > 0 ? `${totalPL >= 0 ? "+" : ""}${totalPLPct.toFixed(2)}%` : "—", totalPL >= 0 ? "#4ade80" : "#f87171"],
                ].map(([label, val, color]) => (
                  <div className="card" key={label} style={{ padding: "14px 16px" }}>
                    <div className="card-label">{label}</div>
                    <div className="card-val" style={{ color, fontSize: 20 }}>{val}</div>
                  </div>
                ))}
              </div>

              {/* GRÁFICO DE EVOLUÇÃO DO PATRIMÔNIO */}
              <div className="card">
                <div className="card-label" style={{ marginBottom: 14 }}>Evolução do Patrimônio</div>
                {patrimonyHistory.length < 2 ? (
                  <div style={{ color: "#475569", fontSize: 13, padding: "20px 0", textAlign: "center" }}>
                    O gráfico aparece quando houver pelo menos 2 dias de histórico (registrado automaticamente quando o app está online com cotações reais).
                  </div>
                ) : (() => {
                  const h = patrimonyHistory;
                  const W = 700, H = 220, pad = 40;
                  const vals = h.flatMap(p => [p.value, p.invested]);
                  const min = Math.min(...vals) * 0.98, max = Math.max(...vals) * 1.02;
                  const x = (i) => pad + (i / (h.length - 1)) * (W - pad * 2);
                  const y = (v) => H - pad - ((v - min) / (max - min || 1)) * (H - pad * 2);
                  const linePath = (key) => h.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(p[key]).toFixed(1)}`).join(" ");
                  const lastUp = h[h.length - 1].value >= h[h.length - 1].invested;
                  return (
                    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
                      <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#1e293b" strokeWidth="1" />
                      <path d={linePath("invested")} fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 4" />
                      <path d={linePath("value")} fill="none" stroke={lastUp ? "#22c55e" : "#ef4444"} strokeWidth="2.5" />
                      <text x={pad} y={H - pad + 16} fill="#64748b" fontSize="10" fontFamily="monospace">{h[0].date.slice(5)}</text>
                      <text x={W - pad} y={H - pad + 16} fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">{h[h.length - 1].date.slice(5)}</text>
                      <text x={W - pad} y={y(h[h.length - 1].value) - 8} fill={lastUp ? "#22c55e" : "#ef4444"} fontSize="11" fontFamily="monospace" textAnchor="end">{fmtCurrency(h[h.length - 1].value)}</text>
                    </svg>
                  );
                })()}
                <div className="form-hint" style={{ marginTop: 10 }}>
                  Linha verde/vermelha = patrimônio atual · linha pontilhada = total investido. Quando a cheia está acima da pontilhada, você está no lucro.
                </div>
              </div>

              {/* RESULTADOS REALIZADOS (lucro/prejuízo em vendas) */}
              {(() => {
                const totalRealized = stocks.reduce((acc, s) => acc + (s.realizedPL || 0), 0);
                const winners = stocks.filter(s => (s.realizedPL || 0) > 0);
                const losers  = stocks.filter(s => (s.realizedPL || 0) < 0);
                const withResults = stocks.filter(s => s.realizedPL && s.realizedPL !== 0)
                  .sort((a, b) => (b.realizedPL || 0) - (a.realizedPL || 0));
                return (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                      {[
                        ["Resultado Realizado (vendas)", fmtCurrency(totalRealized), totalRealized >= 0 ? "#4ade80" : "#f87171"],
                        ["Vendas com Lucro", `${winners.length}`, "#4ade80"],
                        ["Vendas com Prejuízo", `${losers.length}`, "#f87171"],
                      ].map(([label, val, color]) => (
                        <div className="card" key={label}>
                          <div className="card-label">{label}</div>
                          <div className="card-val" style={{ color, fontSize: 20 }}>{val}</div>
                        </div>
                      ))}
                    </div>
                    {withResults.length > 0 && (
                      <div className="card">
                        <div className="card-label" style={{ marginBottom: 14 }}>Histórico de Lucro/Prejuízo por Ação (vendas já realizadas)</div>
                        <table className="table">
                          <thead><tr><th>Ativo</th><th>Setor</th><th>Resultado</th></tr></thead>
                          <tbody>
                            {withResults.map(s => (
                              <tr key={s.id}>
                                <td><div className="ticker-cell">{s.ticker}</div><div className="name-cell">{s.name}</div></td>
                                <td style={{ fontSize: 12, color: "#7c3aed", fontFamily: "'IBM Plex Mono',monospace" }}>{s.sector}</td>
                                <td className="mono" style={{ color: (s.realizedPL || 0) >= 0 ? "#4ade80" : "#f87171", fontWeight: 600 }}>
                                  {fmtCurrency(s.realizedPL)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="form-hint" style={{ marginTop: 12 }}>Valores que você registrou no campo "Lucro/Prejuízo realizado" de cada ação. Edite uma ação (✎) para atualizar.</div>
                      </div>
                    )}
                  </>
                );
              })()}

              {/* PROJEÇÃO DE DIVIDENDOS */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                {[
                  ["Renda Anual Projetada (dividendos)", fmtCurrency(dividendFlow.annualTotal), "#f59e0b"],
                  ["Média Mensal", fmtCurrency(dividendFlow.monthlyAvg), "#fbbf24"],
                  ["Ações Pagadoras", `${payers.length}`, "#4ade80"],
                ].map(([label, val, color]) => (
                  <div className="card" key={label}>
                    <div className="card-label">{label}</div>
                    <div className="card-val" style={{ color, fontSize: 20 }}>{val}</div>
                  </div>
                ))}
              </div>
              <div className="card">
                <div className="card-label" style={{ marginBottom: 14 }}>Renda por Ação (projeção anual baseada no yield atual)</div>
                {payers.length === 0 ? (
                  <div style={{ color: "#475569", fontSize: 13 }}>Nenhuma ação pagadora com yield cadastrado ainda.</div>
                ) : (
                  <table className="table">
                    <thead><tr><th>Ativo</th><th>Posição</th><th>Yield</th><th>Renda/ano</th><th>Renda/mês</th></tr></thead>
                    <tbody>
                      {payers.map(s => (
                        <tr key={s.id}>
                          <td><div className="ticker-cell">{s.ticker}</div><div className="name-cell">{s.name}</div></td>
                          <td className="mono">{fmtCurrency(s.posValue)}</td>
                          <td className="mono" style={{ color: "#f59e0b" }}>{fmt(s.dividendYield)}%</td>
                          <td className="mono" style={{ color: "#4ade80" }}>{fmtCurrency(s.annual)}</td>
                          <td className="mono" style={{ color: "#94a3b8" }}>{fmtCurrency(s.monthly)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                <div className="form-hint" style={{ marginTop: 12 }}>Projeção estimada: posição atual × yield anual. Não considera variação futura de preço nem cortes/aumentos de dividendo.</div>
              </div>
            </div>
          );
        })()}

        {/* ── TRANSAÇÕES (fundação para rentabilidade) ── */}
        {activeTab === "transactions" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
              <div style={{ fontSize: 13, color: "#64748b" }}>
                {transactions.length} {transactions.length === 1 ? "transação registrada" : "transações registradas"}
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => { setTxForm({ ticker: "", type: "COMPRA", qty: "", total: "", date: new Date().toISOString().slice(0, 10), fees: "" }); setShowTxForm(true); }}>
                + Registrar Compra/Venda
              </button>
            </div>
            {transactions.length === 0 ? (
              <div className="empty">
                <div className="empty-icon"><Icon name="exchange" size={40} /></div>
                <div>Nenhuma transação registrada.<br/>Registre suas compras e vendas com data para calcular rentabilidade real, imposto e evolução do patrimônio.</div>
              </div>
            ) : (
              <table className="table">
                <thead><tr><th>Data</th><th>Tipo</th><th>Ativo</th><th>Qtd</th><th>Preço</th><th>Taxas</th><th>Total</th><th></th></tr></thead>
                <tbody>
                  {transactions.map(t => {
                    const total = t.qty * t.price + (t.type === "COMPRA" ? t.fees : -t.fees);
                    return (
                      <tr key={t.id}>
                        <td className="mono" style={{ fontSize: 12 }}>{fmtDate(t.date)}</td>
                        <td>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 3, fontFamily: "'IBM Plex Mono',monospace",
                            background: t.type === "COMPRA" ? "#052e16" : "#2d0a0a", color: t.type === "COMPRA" ? "#4ade80" : "#f87171" }}>
                            {t.type}
                          </span>
                        </td>
                        <td className="ticker-cell">{t.ticker}</td>
                        <td className="mono">{t.qty}</td>
                        <td className="mono">{fmtCurrency(t.price)}</td>
                        <td className="mono" style={{ color: "#64748b" }}>{t.fees ? fmtCurrency(t.fees) : "—"}</td>
                        <td className="mono" style={{ color: t.type === "COMPRA" ? "#f87171" : "#4ade80" }}>{fmtCurrency(total)}</td>
                        <td>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button className="btn btn-ghost btn-sm" title="Editar transação" onClick={() => {
                              // Carrega os dados no formulário e marca qual transação está sendo editada.
                              // A troca só acontece ao SALVAR — assim a transação não some se você desistir.
                              setTxForm({
                                ticker: t.ticker, type: t.type, qty: String(t.qty),
                                total: String(t.total != null ? t.total : (Number(t.qty) * Number(t.price))),
                                date: t.date, fees: t.fees ? String(t.fees) : "",
                                _editingId: t.id,
                              });
                              setShowTxForm(true);
                            }}><Icon name="pencil" size={14} /></button>
                            <button className="btn btn-danger btn-sm" onClick={() => deleteTransaction(t.id)}>✕</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
            <div className="form-hint" style={{ marginTop: 14 }}>
              Registrar uma <strong>compra</strong> atualiza automaticamente a quantidade e o preço médio na carteira. Uma <strong>venda</strong> reduz a posição. Esta é a base para os próximos recursos: gráfico de evolução do patrimônio, rentabilidade real e relatório de imposto.
            </div>
          </div>
        )}

        {/* ── PORTFOLIO ── */}
        {activeTab === "portfolio" && (
          activeStocks.length === 0 ? (
            <div className="empty"><div className="empty-icon"><Icon name={searchQuery ? "search" : "chart"} size={40} /></div><div>{searchQuery ? `Nenhuma ação encontrada para "${searchQuery}".` : (stocks.length === 0 ? 'Nenhuma ação adicionada. Clique em "+ Ação".' : 'Nenhuma ação com posição ativa. Veja a aba Observando para as que você acompanha.')}</div></div>
          ) : (() => {
            // ── Função que renderiza UMA linha da tabela ──
            const renderRow = (s) => {
              const q   = quotes[s.ticker];
              const pl  = q?.c ? ((q.c - s.avgPrice) / s.avgPrice) * 100 : null;
              const plA = q?.c ? (q.c - s.avgPrice) * s.qty : null;
              const a   = alerts[s.ticker];
              const hasAlert = a?.active;
              const myHigh = intelItems.filter(i => i.ticker === s.ticker && i.impact === "ALTO").length;
              const isRangeLoading = rangeLoading[s.ticker];
              const rangePos = (s.min30 != null && s.max30 != null && q?.c && s.max30 !== s.min30)
                ? Math.min(100, Math.max(0, ((q.c - s.min30) / (s.max30 - s.min30)) * 100))
                : null;
              // posição do preço médio na barra (clamped 0-100)
              const avgPos = (s.min30 != null && s.max30 != null && s.avgPrice && s.max30 !== s.min30)
                ? Math.min(100, Math.max(0, ((s.avgPrice - s.min30) / (s.max30 - s.min30)) * 100))
                : null;
              return (
                <tr key={s.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <StockAvatar ticker={s.ticker} size={38} radius={10} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span className="ticker-cell" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 200, display: "inline-block" }} title={s.name || s.ticker}>{s.name || s.ticker}</span>
                          {s.leveraged && <span style={{ color: "#fbbf24", display: "inline-flex", flexShrink: 0 }} title="ETF alavancado — alto risco, não indicado para longo prazo"><Icon name="bolt" size={13} /></span>}
                        </div>
                        {s.assetClass && s.assetClass !== "Ação" && (
                          <div style={{ fontSize: 10, color: "#38bdf8", marginTop: 2, fontFamily: "'IBM Plex Mono',monospace" }}>{s.assetClass}</div>
                        )}
                        {s.strategy && (
                          <div style={{ fontSize: 10, color: s.strategy === "Núcleo" ? "#60a5fa" : "#fbbf24", marginTop: 2, display: "inline-flex", alignItems: "center", gap: 4 }}>
                            <Icon name={s.strategy === "Núcleo" ? "shield" : "rocket"} size={11} /> {s.strategy}
                          </div>
                        )}
                        {s.stopLoss != null && (
                          <div style={{ fontSize: 10, color: "#f87171", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }} title="Preço de saída de emergência"><Icon name="alert" size={11} /> Stop {fmtCurrency(s.stopLoss)}</div>
                        )}
                        {s.note && (
                          <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2, fontStyle: "italic", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={s.note}>{s.note}</div>
                        )}
                        {!groupByStatus && s.status && (
                          revealedStatus[s.ticker] ? (
                            <div onClick={() => setRevealedStatus(p => ({ ...p, [s.ticker]: false }))} style={{
                              display: "inline-block", fontSize: 9, fontWeight: 700, marginTop: 3, cursor: "pointer",
                              padding: "2px 7px", borderRadius: 4, letterSpacing: 0.5,
                              fontFamily: "'IBM Plex Mono',monospace",
                              background: STATUS_COLORS[s.status]?.bg || "#13001a",
                              color: STATUS_COLORS[s.status]?.color || "#c084fc",
                              border: "1px solid currentColor",
                            }} title="Clique para ocultar">{s.status}</div>
                          ) : (
                            <div onClick={() => setRevealedStatus(p => ({ ...p, [s.ticker]: true }))} style={{
                              display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9.5, marginTop: 3, cursor: "pointer",
                              padding: "2px 7px", borderRadius: 4, color: "#6b7a96", border: "1px solid #1f2a40",
                            }} title="Clique para ver a orientação">
                              <Icon name="eye" size={11} /> orientação
                            </div>
                          )
                        )}
                        {s.sector && <div style={{ fontSize: 10, color: "#7c3aed", marginTop: 2, fontFamily: "'IBM Plex Mono',monospace" }}>{s.sector}</div>}
                        {s.paysDividends && s.dividendYield != null && (
                          <div style={{ fontSize: 10, color: "#f59e0b", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}><Icon name="coin" size={11} /> Yield {fmt(s.dividendYield)}%{s.dividendFrequency ? ` · ${s.dividendFrequency}` : ""}</div>
                        )}
                        {s.paysDividends && s.dividendYield == null && (
                          <div style={{ fontSize: 10, color: "#f59e0b", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}><Icon name="coin" size={11} /> Paga dividendos</div>
                        )}
                        {s.realizedPL != null && s.realizedPL !== 0 && (
                          <div style={{ fontSize: 10, color: s.realizedPL > 0 ? "#4ade80" : "#f87171", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                            <Icon name="trending" size={11} /> Realizado: {fmtCurrency(s.realizedPL)}
                          </div>
                        )}
                      </div>
                      {myHigh > 0 && <span style={{ color: "#ef4444", display: "inline-flex" }} title="Evento crítico detectado"><Icon name="alert" size={13} /></span>}
                    </div>
                  </td>
                  <td className="mono">{s.qty}</td>
                  <td className="mono">{fmtCurrency(s.avgPrice)}</td>
                  <td className="mono" style={{ fontSize: 11, color: "#64748b" }}>{fmtCurrency(s.totalInvested ?? s.qty * s.avgPrice)}</td>
                  <td className="mono" style={{ color: q?.c ? "#f8fafc" : "#475569" }}>
                    {q?.c ? fmtCurrency(q.c) : <span className="pulse">…</span>}
                  </td>
                  <td className="mono" style={{ color: pctColor(q?.dp) }}>{q?.dp != null ? fmtPct(q.dp) : "—"}</td>
                  <td>
                    <div className="mono" style={{ color: pctColor(pl) }}>{plA != null ? fmtCurrency(plA) : "—"}</div>
                    <div className="mono" style={{ color: pctColor(pl), fontSize: 11 }}>{fmtPct(pl)}</div>
                  </td>
                  <td style={{ minWidth: 160 }}>
                    {isRangeLoading ? (
                      <span style={{ color: "#475569", fontSize: 11, fontFamily: "'IBM Plex Mono',monospace" }} className="pulse">buscando 30d…</span>
                    ) : s.min30 != null ? (
                      <div className="range-cell">
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ color: "#22c55e" }}>{fmtCurrency(s.min30)}</span>
                          <span style={{ color: "#ef4444" }}>{fmtCurrency(s.max30)}</span>
                        </div>
                        <div className="range-bar-wrap">
                          <div className="range-bar-fill" style={{ width: "100%" }} />
                          {avgPos != null && (
                            <div className="range-avg" style={{ left: `${avgPos}%` }} title={`Seu preço médio: ${fmtCurrency(s.avgPrice)}`} />
                          )}
                          {rangePos != null && (
                            <div className="range-dot" style={{ left: `${rangePos}%` }} title={`Cotação atual: ${fmtCurrency(q?.c)}`} />
                          )}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 5, fontSize: 9.5, color: "#5a6b85" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: "#f4f8fc", display: "inline-block", border: "1px solid #5a6b85" }}></span> agora</span>
                          {avgPos != null && <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><span style={{ width: 3, height: 9, background: "#22d3ee", display: "inline-block", borderRadius: 1 }}></span> médio {fmtCurrency(s.avgPrice)}</span>}
                        </div>
                        {rangePos != null && (
                          <div style={{ fontSize: 10, color: "#64748b", marginTop: 3, textAlign: "center" }}>
                            {rangePos < 25 ? "próximo da mínima" : rangePos > 75 ? "próximo da máxima" : "no meio do range"}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span style={{ color: "#475569", fontSize: 11 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => refresh30DayRange(s.ticker)} style={{ fontSize: 11 }}>buscar 30d</button>
                      </span>
                    )}
                  </td>
                  <td>
                    {hasAlert ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        {a.sellTarget && <span className="alert-pill alert-pill-sell">▼ {fmtCurrency(a.sellTarget)}</span>}
                        {a.buyTarget  && <span className="alert-pill alert-pill-buy" >▲ {fmtCurrency(a.buyTarget)}</span>}
                      </div>
                    ) : <span style={{ color: "#475569", fontSize: 11 }}>sem alerta</span>}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => refreshOne(s.ticker)} title="Atualizar cotação desta ação agora"><Icon name="refresh" /></button>
                      <button className={`btn btn-sm ${hasAlert ? "btn-bell active" : "btn-bell"}`} onClick={() => openAlertForm(s.ticker)}><Icon name="bell" /></button>
                      <button className={`btn btn-sm ${analyses[s.ticker] ? "btn-analyse" : "btn-ghost"}`} onClick={() => analyseStock(s)} disabled={loading[s.ticker]} title={analyses[s.ticker] ? "Ver/refazer análise" : "Analisar com IA"}><Icon name={loading[s.ticker] ? "loader" : "sparkles"} /></button>
                      <button className="btn btn-ghost btn-sm" onClick={() => startEdit(s)} title="Editar / excluir"><Icon name="pencil" /></button>
                    </div>
                  </td>
                </tr>
              );
            };

            const headerRow = (
              <thead>
                <tr><th>Ativo</th><th>Qtd</th><th>Médio</th><th>Total Aportado</th><th>Cotação</th><th>Hoje</th><th>P&L</th><th>Mín/Máx 30d + posição atual</th><th>Alertas</th><th></th></tr>
              </thead>
            );

            // ── Ordem das orientações: as 5 oficiais primeiro, depois legados a reclassificar ──
            const STATUS_ORDER = [...STATUS_OPTIONS];
            const grouped = {};
            activeStocks.forEach(s => {
              const k = s.status || "SEM ORIENTAÇÃO";
              (grouped[k] = grouped[k] || []).push(s);
            });
            const orderedKeys = [
              ...STATUS_ORDER.filter(k => grouped[k]),
              ...Object.keys(grouped).filter(k => !STATUS_ORDER.includes(k)),
            ];

            return (
              <>
                {/* Toggle de visualização */}
                <div style={{ display: "flex", gap: 8, marginBottom: 14, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, color: "#475569" }}>Visualizar:</span>
                  <button className={`btn btn-sm ${!groupByStatus ? "btn-primary" : "btn-ghost"}`} onClick={() => setGroupByStatus(false)}><Icon name="list" size={15} /> Lista</button>
                  <button className={`btn btn-sm ${groupByStatus ? "btn-primary" : "btn-ghost"}`} onClick={() => setGroupByStatus(true)}><Icon name="layoutGrid" size={15} /> Orientação</button>
                </div>

                {groupByStatus ? (
                  <div>
                    {/* Resumo: quantas ações em cada orientação + menu suspenso */}
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                      {orderedKeys.map(statusKey => {
                        const group = grouped[statusKey];
                        const cfg = STATUS_COLORS[statusKey] || { bg: "#13001a", color: "#c084fc" };
                        const isSel = selectedOrientation === statusKey;
                        return (
                          <button key={statusKey} onClick={() => setSelectedOrientation(isSel ? "" : statusKey)}
                            style={{
                              display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 10, cursor: "pointer",
                              background: isSel ? cfg.bg : "#0f1623", border: `1px solid ${isSel ? "currentColor" : "#1c2740"}`,
                              color: isSel ? cfg.color : "#8b9ab5", fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: 13,
                            }}>
                            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700, fontSize: 12 }}>{statusKey}</span>
                            <span style={{ background: isSel ? "#00000033" : "#16203a", borderRadius: 20, padding: "1px 8px", fontSize: 11 }}>{group.length}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Menu suspenso alternativo */}
                    <div style={{ marginBottom: 16, maxWidth: 320 }}>
                      <select className="form-input" value={selectedOrientation} onChange={e => setSelectedOrientation(e.target.value)} style={{ width: "100%" }}>
                        <option value="">— Escolha uma orientação para ver as ações —</option>
                        {orderedKeys.map(k => <option key={k} value={k}>{k} ({grouped[k].length})</option>)}
                      </select>
                    </div>

                    {/* Lista da orientação escolhida */}
                    {selectedOrientation && grouped[selectedOrientation] ? (() => {
                      const group = grouped[selectedOrientation];
                      const cfg = STATUS_COLORS[selectedOrientation] || { bg: "#13001a", color: "#c084fc" };
                      const groupInvested = group.reduce((acc, s) => acc + (s.totalInvested ?? s.qty * s.avgPrice), 0);
                      return (
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 12px", borderRadius: 4, letterSpacing: 0.5, fontFamily: "'IBM Plex Mono',monospace", background: cfg.bg, color: cfg.color, border: "1px solid currentColor" }}>{selectedOrientation}</span>
                            <span style={{ fontSize: 11, color: "#64748b" }}>{group.length} {group.length === 1 ? "ativo" : "ativos"} · {fmtCurrency(groupInvested)} aportado</span>
                          </div>
                          <table className="table">
                            {headerRow}
                            <tbody>{group.map(renderRow)}</tbody>
                          </table>
                        </div>
                      );
                    })() : (
                      <div className="empty" style={{ padding: "40px 20px" }}>
                        <div className="empty-icon"><Icon name="layoutGrid" size={40} /></div>
                        <div>Escolha uma orientação acima para ver as ações daquele grupo.</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <table className="table">
                    {headerRow}
                    <tbody>{activeStocks.map(renderRow)}</tbody>
                  </table>
                )}
              </>
            );
          })()
        )}

        {/* ── ANALYSIS ── */}
        {activeTab === "analysis" && (
          !selectedStock || !selAnalysis ? (
            <div className="empty">
              <div className="empty-icon"><Icon name="sparkles" size={40} /></div>
              <div>{stocks.length === 0 ? "Adicione ações primeiro." : 'Clique no ícone de análise (estrela) na carteira.'}</div>
              {stocks.length > 0 && (
                <div style={{ marginTop: 20, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                  {stocks.map(s => (
                    <button key={s.id} className="btn btn-analyse" onClick={() => analyseStock(s)} disabled={loading[s.ticker]}>
                      {loading[s.ticker] ? "Analisando…" : `Analisar ${s.ticker}`}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                {stocks.map(s => (
                  <button key={s.id} className={`btn btn-sm ${selectedStock === s.ticker ? "btn-primary" : "btn-ghost"}`}
                    onClick={() => { setSelectedStock(s.ticker); if (!analyses[s.ticker]) analyseStock(s); }}>
                    {s.ticker}
                  </button>
                ))}
              </div>
              <div className="analysis-grid">
                <div className="analysis-main">
                  {(() => {
                    const cfg = SIGNAL_CONFIG[selAnalysis.signal] || SIGNAL_CONFIG.AGUARDAR;
                    return (
                      <div className="signal-card" style={{ background: cfg.bg, borderColor: cfg.border }}>
                        <div className="signal-ticker">{selStock?.ticker} · {selStock?.name}</div>
                        <div className="signal-label" style={{ color: cfg.text }}>{cfg.icon} {selAnalysis.signal}</div>
                        <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 12 }}>{selAnalysis.summary}</div>
                        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                          <div>
                            <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: 1 }}>Confiança</div>
                            <div className="mono" style={{ color: cfg.text, fontSize: 18, fontWeight: 600 }}>{selAnalysis.confidence}%</div>
                            <div className="confidence-bar"><div className="confidence-fill" style={{ width: `${selAnalysis.confidence}%`, background: cfg.text }} /></div>
                          </div>
                          <div>
                            <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: 1 }}>Risco</div>
                            <div className="mono" style={{ fontSize: 18, fontWeight: 600, color: selAnalysis.risk === "ALTO" ? "#ef4444" : selAnalysis.risk === "MÉDIO" ? "#f59e0b" : "#22c55e" }}>{selAnalysis.risk}</div>
                          </div>
                          {selAnalysis.target && (
                            <div>
                              <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: 1 }}>Alvo</div>
                              <div className="mono" style={{ fontSize: 18, fontWeight: 600, color: "#e2e8f0" }}>{fmtCurrency(selAnalysis.target)}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                  <div className="card">
                    <div className="card-label" style={{ marginBottom: 12 }}>Posição + Range 30d</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                      {[
                        ["Preço Atual", selQuote?.c ? fmtCurrency(selQuote.c) : "—", pctColor(selQuote?.dp)],
                        ["Var. Hoje",   selQuote?.dp != null ? fmtPct(selQuote.dp) : "—", pctColor(selQuote?.dp)],
                        ["Preço Médio", fmtCurrency(selStock?.avgPrice), "#94a3b8"],
                        ["Alta do Dia", selQuote?.h ? fmtCurrency(selQuote.h) : "—", "#22c55e"],
                        ["Baixa do Dia",selQuote?.l ? fmtCurrency(selQuote.l) : "—", "#ef4444"],
                        ["P&L",         selQuote?.c ? fmtPct(((selQuote.c - selStock.avgPrice) / selStock.avgPrice) * 100) : "—", pctColor(selQuote?.c ? selQuote.c - selStock?.avgPrice : null)],
                        ["Mín 30d",    selStock?.min30 != null ? fmtCurrency(selStock.min30) : "—", "#22c55e"],
                        ["Máx 30d",    selStock?.max30 != null ? fmtCurrency(selStock.max30) : "—", "#ef4444"],
                      ].map(([label, val, color]) => (
                        <div key={label}>
                          <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>{label}</div>
                          <div className="mono" style={{ color, fontSize: 14, fontWeight: 600 }}>{val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-label" style={{ marginBottom: 12 }}>Fatores da Análise</div>
                    <ul className="reasons-list">{selAnalysis.reasons?.map((r, i) => <li key={i}>{r}</li>)}</ul>
                  </div>
                  <button className="btn btn-analyse" onClick={() => analyseStock(selStock)} disabled={loading[selectedStock]} style={{ alignSelf: "flex-start" }}>
                    {loading[selectedStock] ? "Analisando…" : "Reanalisar"}
                  </button>
                </div>
                <div className="card" style={{ maxHeight: 600, overflowY: "auto" }}>
                  <div className="card-label" style={{ marginBottom: 14 }}>Notícias · {selectedStock}</div>
                  {selNews.length === 0 ? <div style={{ color: "#475569", fontSize: 13 }}>Sem notícias.</div>
                    : selNews.map((n, i) => (
                      <div key={i} className="news-item">
                        <a href={n.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                          <div className="news-headline">{n.headline}</div>
                        </a>
                        <div className="news-meta">{n.source} · {new Date(n.datetime * 1000).toLocaleDateString("pt-BR")}</div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )
        )}

        {/* ── DISTRIBUTION ── */}
        {activeTab === "distribution" && (() => {
          if (activeBase.length === 0) return (
            <div className="empty"><div className="empty-icon"><Icon name="donut" size={40} /></div><div>Adicione ações para ver a distribuição.</div></div>
          );

          const PALETTE = [
            "#3b82f6","#22c55e","#f59e0b","#ef4444","#a78bfa","#38bdf8","#fb923c","#f472b6",
            "#34d399","#facc15","#60a5fa","#c084fc","#4ade80","#f87171","#94a3b8",
          ];

          // ── helpers ──
          const totalPortfolio = activeBase.reduce((acc, s) => {
            const q = quotes[s.ticker];
            return acc + (q?.c ? s.qty * q.c : s.totalInvested ?? s.qty * s.avgPrice);
          }, 0);

          const stockValue = (s) => {
            const q = quotes[s.ticker];
            return q?.c ? s.qty * q.c : (s.totalInvested ?? s.qty * s.avgPrice);
          };

          // ── por categoria: ações agrupam por setor GICS; demais por classe de ativo ──
          const bySector = {};
          activeBase.forEach(s => {
            const isStock = (s.assetClass || "Ação") === "Ação";
            const key = isStock ? (s.sector || "Sem setor") : (s.assetClass || "Outro");
            if (!bySector[key]) bySector[key] = { value: 0, tickers: [] };
            bySector[key].value  += stockValue(s);
            bySector[key].tickers.push(s.ticker);
          });
          const sectorSlices = Object.entries(bySector)
            .map(([name, d], i) => ({ name, value: d.value, tickers: d.tickers, color: PALETTE[i % PALETTE.length] }))
            .sort((a, b) => b.value - a.value);

          // ── por classe de ativo (ação vs ETF vs cripto vs ouro vs renda fixa) ──
          const byClass = {};
          activeBase.forEach(s => {
            const k = s.assetClass || "Ação";
            if (!byClass[k]) byClass[k] = { value: 0, tickers: [] };
            byClass[k].value += stockValue(s);
            byClass[k].tickers.push(s.ticker);
          });
          const classSlices = Object.entries(byClass)
            .map(([name, d], i) => ({ name, value: d.value, tickers: d.tickers, color: PALETTE[i % PALETTE.length] }))
            .sort((a, b) => b.value - a.value);

          // ── by stock ──
          const stockSlices = activeBase
            .map((s, i) => ({ name: s.ticker, label: s.name || s.ticker, value: stockValue(s), color: PALETTE[i % PALETTE.length] }))
            .sort((a, b) => b.value - a.value);

          // ── dividend split ──
          const divValue  = activeBase.filter(s => s.paysDividends).reduce((acc, s) => acc + stockValue(s), 0);
          const nodivValue= activeBase.filter(s => !s.paysDividends).reduce((acc, s) => acc + stockValue(s), 0);
          const divSlices = [
            { name: "Paga Dividendos", value: divValue,   color: "#f59e0b" },
            { name: "Sem Dividendos",  value: nodivValue, color: "#475569" },
          ].filter(s => s.value > 0);

          // SVG donut chart builder
          const DonutChart = ({ slices, total, size = 200, hole = 0.62 }) => {
            const cx = size / 2, cy = size / 2, r = size / 2 - 2;
            const innerR = r * hole;
            let cursor = -Math.PI / 2; // start at top
            const paths = slices.map((s, i) => {
              const angle = total > 0 ? (s.value / total) * 2 * Math.PI : 0;
              const x1 = cx + r * Math.cos(cursor);
              const y1 = cy + r * Math.sin(cursor);
              cursor += angle;
              const x2 = cx + r * Math.cos(cursor);
              const y2 = cy + r * Math.sin(cursor);
              const xi1 = cx + innerR * Math.cos(cursor);
              const yi1 = cy + innerR * Math.sin(cursor);
              const xi2 = cx + innerR * Math.cos(cursor - angle);
              const yi2 = cy + innerR * Math.sin(cursor - angle);
              const large = angle > Math.PI ? 1 : 0;
              if (angle < 0.001) return null;
              const d = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi1} ${yi1} A ${innerR} ${innerR} 0 ${large} 0 ${xi2} ${yi2} Z`;
              return <path key={i} d={d} fill={s.color} stroke="#080b10" strokeWidth="2" opacity="0.92" />;
            });
            return (
              <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {paths}
                <circle cx={cx} cy={cy} r={innerR - 1} fill="#080b10" />
              </svg>
            );
          };

          // Horizontal bar chart
          const BarChart = ({ slices, total }) => (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {slices.map((s, i) => {
                const pct = total > 0 ? (s.value / total) * 100 : 0;
                return (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 500 }}>{s.name}</span>
                        {s.tickers && <span style={{ fontSize: 11, color: "#475569", fontFamily: "'IBM Plex Mono',monospace" }}>{s.tickers.join(", ")}</span>}
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <span style={{ fontSize: 13, fontFamily: "'IBM Plex Mono',monospace", color: s.color, fontWeight: 600 }}>{pct.toFixed(1)}%</span>
                        <span style={{ fontSize: 11, color: "#475569", marginLeft: 8, fontFamily: "'IBM Plex Mono',monospace" }}>{fmtCurrency(s.value)}</span>
                      </div>
                    </div>
                    <div style={{ height: 6, background: "#1e293b", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: s.color, borderRadius: 3, transition: "width .6s" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          );

          // Concentration risk — HHI calculado por SETOR (mede concentração real da carteira)
          const herfindahl = sectorSlices.reduce((acc, s) => acc + Math.pow((s.value / totalPortfolio) * 100, 2), 0);
          const concentration = herfindahl > 2500 ? { label: "ALTA", color: "#ef4444", tip: "Carteira muito concentrada em poucos setores — considere diversificar." }
            : herfindahl > 1500 ? { label: "MÉDIA", color: "#f59e0b", tip: "Concentração moderada — razoável, mas monitore os setores maiores." }
            : { label: "BAIXA", color: "#22c55e", tip: "Boa diversificação entre setores e classes." };

          // conta apenas setores GICS de ações (exclui classes de ativo)
          const gicsSectorCount = sectorSlices.filter(s => SECTORS.includes(s.name)).length;
          // maior concentração individual (setor mais pesado)
          const topSector = sectorSlices[0];

          const divCount = activeBase.filter(s => s.paysDividends).length;
          const avgYield = activeBase.filter(s => s.paysDividends && s.dividendYield).reduce((acc, s, _, arr) => acc + s.dividendYield / arr.length, 0);

          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Summary strip */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                {[
                  ["Ativos", activeBase.length, "#e2e8f0"],
                  ["Setores GICS", gicsSectorCount, "#a78bfa"],
                  ["Concentração", concentration.label, concentration.color],
                  ["Yield Médio", divCount > 0 ? `${avgYield.toFixed(2)}%` : "—", "#f59e0b"],
                ].map(([label, val, color]) => (
                  <div className="card" key={label} style={{ padding: "14px 16px" }}>
                    <div className="card-label">{label}</div>
                    <div className="card-val" style={{ color, fontSize: 20 }}>{val}</div>
                  </div>
                ))}
              </div>

              {/* NÚCLEO vs SATÉLITE — estratégia core-satellite */}
              {(() => {
                const nucleoVal = activeBase.filter(s => (s.strategy || "Satélite") === "Núcleo").reduce((a, s) => a + stockValue(s), 0);
                const sateliteVal = activeBase.filter(s => (s.strategy || "Satélite") === "Satélite").reduce((a, s) => a + stockValue(s), 0);
                const nucleoPct = totalPortfolio > 0 ? (nucleoVal / totalPortfolio) * 100 : 0;
                const satelitePct = totalPortfolio > 0 ? (sateliteVal / totalPortfolio) * 100 : 0;
                const TARGET_SAT = userProfile.satelliteTarget || 20;
                const overTarget = satelitePct > TARGET_SAT + 5; // tolerância de 5pp
                return (
                  <div className="card" style={{ border: overTarget ? "1px solid #7f1d1d" : "1px solid #1e293b" }}>
                    <div className="card-label" style={{ marginBottom: 16 }}>Estratégia: Núcleo (longo prazo) vs Satélite (curto prazo)</div>
                    <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
                      <DonutChart slices={[
                        { name: "Núcleo", value: nucleoVal, color: "#3b82f6" },
                        { name: "Satélite", value: sateliteVal, color: "#f59e0b" },
                      ]} total={totalPortfolio} size={150} />
                      <div style={{ flex: 1, minWidth: 240 }}>
                        <BarChart slices={[
                          { name: "Núcleo", value: nucleoVal, color: "#3b82f6" },
                          { name: "Satélite", value: sateliteVal, color: "#f59e0b" },
                        ]} total={totalPortfolio} />
                        <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: 6, background: overTarget ? "#1a0404" : "#0f172a", border: `1px solid ${overTarget ? "#7f1d1d" : "#1e293b"}` }}>
                          <div style={{ fontSize: 12, color: overTarget ? "#fca5a5" : "#94a3b8", lineHeight: 1.6 }}>
                            <strong style={{ color: overTarget ? "#f87171" : "#60a5fa" }}>Sua meta: {TARGET_SAT}% em satélite ({userProfile.risk}).</strong><br/>
                            Você está com <strong style={{ color: "#f8fafc" }}>{satelitePct.toFixed(1)}%</strong> em satélite (curto prazo).
                            {overTarget
                              ? ` Isso está acima da sua meta — sua carteira está mais arriscada do que o perfil que você definiu. Considere realizar lucros dos satélites e reforçar o núcleo, como você planejou.`
                              : ` Dentro da sua meta — bom equilíbrio entre segurança e oportunidade.`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Row 0: By asset class */}
              <div className="card">
                <div className="card-label" style={{ marginBottom: 16 }}>Distribuição por Classe de Ativo</div>
                <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
                  <div style={{ flexShrink: 0 }}>
                    <DonutChart slices={classSlices} total={totalPortfolio} size={180} />
                  </div>
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <BarChart slices={classSlices} total={totalPortfolio} />
                  </div>
                </div>
                <div className="form-hint" style={{ marginTop: 12 }}>Ações, ETFs, cripto, ouro e renda fixa são classes diferentes. Diversificar entre classes reduz risco melhor que diversificar só entre setores.</div>
              </div>

              {/* Row 1: By sector donut + bar */}
              <div className="card">
                <div className="card-label" style={{ marginBottom: 16 }}>Distribuição por Setor (GICS) e Classe</div>
                <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
                  <div style={{ flexShrink: 0 }}>
                    <DonutChart slices={sectorSlices} total={totalPortfolio} size={180} />
                  </div>
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <BarChart slices={sectorSlices} total={totalPortfolio} />
                  </div>
                </div>
                <div className="form-hint" style={{ marginTop: 12 }}>Ações agrupadas pelos 11 setores oficiais GICS. ETFs/cripto/ouro/renda fixa aparecem pela sua classe.</div>
              </div>

              {/* Row 2: By stock donut + bar */}
              <div className="card">
                <div className="card-label" style={{ marginBottom: 16 }}>Distribuição por Ativo (% do portfólio)</div>
                <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
                  <div style={{ flexShrink: 0 }}>
                    <DonutChart slices={stockSlices} total={totalPortfolio} size={180} />
                  </div>
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <BarChart slices={stockSlices} total={totalPortfolio} />
                  </div>
                </div>
              </div>

              {/* Row 3: Dividends + Concentration */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {/* Dividend split */}
                <div className="card">
                  <div className="card-label" style={{ marginBottom: 16 }}>Dividendos vs Crescimento</div>
                  <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
                    <DonutChart slices={divSlices} total={totalPortfolio} size={140} />
                    <div style={{ flex: 1, minWidth: 160 }}>
                      <BarChart slices={divSlices} total={totalPortfolio} />
                      <div style={{ marginTop: 14, padding: "10px 12px", background: "#0f172a", borderRadius: 6, border: "1px solid #1e293b" }}>
                        <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Ativos pagadores</div>
                        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, color: "#f8fafc" }}>
                          {divCount} de {activeBase.length} ações
                        </div>
                        {avgYield > 0 && (
                          <div style={{ fontSize: 11, color: "#f59e0b", marginTop: 3 }}>yield médio {avgYield.toFixed(2)}%/ano</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Concentration risk */}
                <div className="card">
                  <div className="card-label" style={{ marginBottom: 16 }}>Risco de Concentração</div>
                  <div style={{ textAlign: "center", padding: "8px 0 16px" }}>
                    <div style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Índice HHI</div>
                    <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 42, fontWeight: 700, color: concentration.color, lineHeight: 1 }}>
                      {Math.round(herfindahl)}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: concentration.color, marginTop: 6, marginBottom: 10 }}>
                      Concentração {concentration.label}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{concentration.tip}</div>
                  </div>
                  {/* HHI scale bar */}
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#475569", marginBottom: 4, fontFamily: "'IBM Plex Mono',monospace" }}>
                      <span>0 Baixo</span><span>1000 Médio</span><span>2500 Alto</span><span>10000</span>
                    </div>
                    <div style={{ height: 8, borderRadius: 4, background: "linear-gradient(90deg,#22c55e 0%,#f59e0b 25%,#ef4444 60%,#7f1d1d 100%)", position: "relative" }}>
                      <div style={{
                        position: "absolute", top: -2, width: 12, height: 12, borderRadius: "50%",
                        background: "#f8fafc", border: "2px solid #080b10",
                        left: `${Math.min(98, (herfindahl / 10000) * 100)}%`, transform: "translateX(-50%)"
                      }} />
                    </div>
                  </div>

                  {/* Peso por setor/classe */}
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Peso por setor / classe</div>
                    {sectorSlices.map((s, i) => {
                      const pct = totalPortfolio > 0 ? (s.value / totalPortfolio) * 100 : 0;
                      const warn = pct > 25;
                      return (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                          <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: "#f8fafc", width: 120, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</span>
                          <div style={{ flex: 1, height: 5, background: "#1e293b", borderRadius: 3, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${pct}%`, background: warn ? "#ef4444" : s.color, borderRadius: 3 }} />
                          </div>
                          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: warn ? "#ef4444" : "#64748b", width: 38, textAlign: "right", flexShrink: 0 }}>{pct.toFixed(1)}%</span>
                          {warn && <span style={{ color: "#ef4444", display: "inline-flex" }}><Icon name="alert" size={11} /></span>}
                        </div>
                      );
                    })}
                    <div className="form-hint" style={{ marginTop: 8 }}>O aviso marca setores acima de 25% do portfólio — sinal de concentração a monitorar.</div>
                  </div>
                </div>
              </div>

            </div>
          );
        })()}

        {/* ── ALERT LOG ── */}
        {activeTab === "alertlog" && (
          alertLog.length === 0 ? (
            <div className="empty"><div className="empty-icon"><Icon name="bell" size={40} /></div><div>Nenhum alerta disparado ainda.</div></div>
          ) : (
            <div className="card">
              <div className="card-label" style={{ marginBottom: 14 }}>Alertas Disparados — {alertLog.length}</div>
              {alertLog.map(l => (
                <div key={l.id} className="log-item">
                  <span className={`log-badge log-badge-${l.type === "VENDA" ? "sell" : "buy"}`}>{l.type}</span>
                  <div style={{ flex: 1, fontSize: 12, fontFamily: "'IBM Plex Mono',monospace", color: "#94a3b8" }}>
                    <span style={{ color: "#f8fafc", fontWeight: 600 }}>{l.ticker}</span> — atingiu {fmtCurrency(l.price)} (alvo: {fmtCurrency(l.target)})
                  </div>
                  <span style={{ fontSize: 11, color: "#475569", fontFamily: "'IBM Plex Mono',monospace" }}>{l.time.toLocaleTimeString("pt-BR")}</span>
                </div>
              ))}
            </div>
          )
        )}

        {/* ── WATCHLIST (Observando — posição 0) ── */}
        {activeTab === "watchlist" && (
          watchStocks.length === 0 ? (
            <div className="empty"><div className="empty-icon"><Icon name="eye" size={40} /></div><div>Nenhuma ação em observação. Adicione uma ação com quantidade 0 para acompanhá-la sem ter posição.</div></div>
          ) : (
            <div className="card">
              <div className="card-label" style={{ marginBottom: 6 }}>Observando — {watchStocks.length} {watchStocks.length === 1 ? "ativo" : "ativos"} (sem posição)</div>
              <div className="form-hint" style={{ marginBottom: 14 }}>Ações que você acompanha para avaliar a compra. Não entram nos cálculos da carteira.</div>
              <table className="table">
                <thead><tr><th>Ativo</th><th>Cotação</th><th>Hoje</th><th>Alvo compra</th><th>Minha tese</th><th></th></tr></thead>
                <tbody>
                  {watchStocks.map(s => {
                    const q = quotes[s.ticker];
                    const a = alerts[s.ticker];
                    return (
                      <tr key={s.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <StockAvatar ticker={s.ticker} size={34} radius={9} />
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span className="ticker-cell" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 200, display: "inline-block" }} title={s.name || s.ticker}>{s.name || s.ticker}</span>
                                {s.leveraged && <span style={{ color: "#fbbf24", display: "inline-flex", flexShrink: 0 }}><Icon name="bolt" size={12} /></span>}
                              </div>
                              {s.sector && <div style={{ fontSize: 10, color: "#7c3aed", fontFamily: "'IBM Plex Mono',monospace" }}>{s.sector}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="mono" style={{ color: q?.c ? "#f8fafc" : "#475569" }}>{q?.c ? fmtCurrency(q.c) : "…"}</td>
                        <td className="mono" style={{ color: pctColor(q?.dp) }}>{q?.dp != null ? fmtPct(q.dp) : "—"}</td>
                        <td className="mono" style={{ color: "#4ade80" }}>{a?.buyTarget ? fmtCurrency(a.buyTarget) : (s.minPrice ? fmtCurrency(s.minPrice) : "—")}</td>
                        <td style={{ fontSize: 11, color: "#94a3b8", fontStyle: "italic", maxWidth: 220 }}>{s.note || "—"}</td>
                        <td>
                          <div style={{ display: "flex", gap: 4 }}>
                            <button className="btn btn-ghost btn-sm" onClick={() => refreshOne(s.ticker)} title="Atualizar cotação"><Icon name="refresh" /></button>
                            <button className={`btn btn-sm ${analyses[s.ticker] ? "btn-analyse" : "btn-ghost"}`} onClick={() => analyseStock(s)} disabled={loading[s.ticker]} title={analyses[s.ticker] ? "Ver/refazer análise" : "Analisar com IA"}><Icon name={loading[s.ticker] ? "loader" : "sparkles"} /></button>
                            <button className="btn btn-ghost btn-sm" onClick={() => startEdit(s)} title="Editar / excluir"><Icon name="pencil" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        )}

        {activeTab === "archived" && (
          archivedStocks.length === 0 ? (
            <div className="empty"><div className="empty-icon"><Icon name="trash" size={40} /></div><div>Nenhuma ação arquivada. Para arquivar, edite uma ação (lápis) e clique em "Arquivar" — útil para ações que você vendeu e não quer mais acompanhar, sem apagar o histórico.</div></div>
          ) : (
            <div className="card">
              <div className="card-label" style={{ marginBottom: 6 }}>Arquivadas — {archivedStocks.length} {archivedStocks.length === 1 ? "ativo" : "ativos"}</div>
              <div className="form-hint" style={{ marginBottom: 14 }}>Ações que você guardou. Não entram nos cálculos nem na carteira ativa. Para reativar, clique em "Restaurar".</div>
              <table className="table">
                <thead><tr><th>Ativo</th><th>Realizado</th><th>Tese</th><th></th></tr></thead>
                <tbody>
                  {archivedStocks.map(s => (
                    <tr key={s.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <StockAvatar ticker={s.ticker} size={34} radius={9} />
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <span className="ticker-cell" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 200, display: "inline-block" }} title={s.name || s.ticker}>{s.name || s.ticker}</span>
                            {s.sector && <div style={{ fontSize: 10, color: "#7c3aed", fontFamily: "'IBM Plex Mono',monospace" }}>{s.sector}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="mono" style={{ color: (s.realizedPL || 0) >= 0 ? "#4ade80" : "#f87171" }}>{s.realizedPL ? fmtCurrency(s.realizedPL) : "—"}</td>
                      <td style={{ fontSize: 11, color: "#94a3b8", maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={s.note}>{s.note || "—"}</td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => setStocks(p => p.map(x => x.id === s.id ? { ...x, archived: false } : x))} title="Tirar do arquivo e voltar para a carteira/observação">Restaurar</button>
                          <button className="btn btn-danger btn-sm" onClick={() => { if (window.confirm(`Excluir ${s.ticker} definitivamente?`)) deleteStock(s.id); }} title="Apagar de vez"><Icon name="trash" size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

      </div>

      {/* PROFILE FORM */}
      {showProfile && (
        <div className="form-overlay" onClick={() => setShowProfile(false)}>
          <div className="form-box" style={{ width: 420 }} onClick={e => e.stopPropagation()}>
            <div className="form-title" style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon name="user" size={18} /> Perfil da carteira</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Nome da carteira</label>
                <input className="form-input" value={userProfile.name}
                  onChange={e => setUserProfile(p => ({ ...p, name: e.target.value }))} placeholder="Ex: Kátia" />
                <div className="form-hint">Aparece no topo do app.</div>
              </div>
              <div className="form-group">
                <label className="form-label">Moeda de referência</label>
                <select className="form-input" value={userProfile.currency}
                  onChange={e => setUserProfile(p => ({ ...p, currency: e.target.value }))}>
                  <option value="USD">USD — Dólar americano</option>
                  <option value="BRL">BRL — Real brasileiro</option>
                </select>
                <div className="form-hint">Sua corretora (Nomad) opera em dólar. A conversão para real virá numa próxima fase.</div>
              </div>
              <div className="form-group">
                <label className="form-label">Perfil de investidor</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[["Conservador",20],["Moderado",30],["Arrojado",40]].map(([r, target]) => (
                    <button key={r} type="button"
                      style={{ flex: 1, padding: "9px", borderRadius: 9, fontSize: 12.5, fontWeight: 500, cursor: "pointer", fontFamily: "'Inter',sans-serif",
                        border: `1px solid ${userProfile.risk === r ? "#22d3ee" : "#1f2a40"}`,
                        background: userProfile.risk === r ? "#06232b" : "#0a0e17",
                        color: userProfile.risk === r ? "#22d3ee" : "#6b7a96" }}
                      onClick={() => setUserProfile(p => ({ ...p, risk: r, satelliteTarget: target }))}>{r}</button>
                  ))}
                </div>
                <div className="form-hint">Define automaticamente a meta de núcleo vs satélite (referência de mercado): Conservador 80/20, Moderado 70/30, Arrojado 60/40.</div>
              </div>
              <div className="form-group">
                <label className="form-label">Meta de satélite (curto prazo): {userProfile.satelliteTarget}%</label>
                <input type="range" min="10" max="50" step="5" value={userProfile.satelliteTarget}
                  style={{ width: "100%" }}
                  onChange={e => setUserProfile(p => ({ ...p, satelliteTarget: Number(e.target.value) }))} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#5a6b85" }}>
                  <span>Núcleo {100 - userProfile.satelliteTarget}%</span>
                  <span>Satélite {userProfile.satelliteTarget}%</span>
                </div>
                <div className="form-hint">O perfil acima sugere um valor, mas você pode ajustar manualmente. Esta meta aparece no painel de Distribuição.</div>
              </div>
            </div>
            <div className="form-actions" style={{ marginTop: 20 }}>
              <button className="btn btn-primary" onClick={() => { setShowProfile(false); addToast("Perfil salvo.", "buy"); }}>Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* STOCK FORM */}
      {showForm && (
        <div className="form-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="form-box">
            <div className="form-title">{editId ? "Editar Ação" : "Adicionar Nova Ação"}</div>
            <div className="form-grid">
              {/* Ticker + Name */}
              <div className="form-group form-full">
                <label className="form-label">Ticker (ex: AAPL, NVDA)</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input className="form-input" placeholder="AAPL" value={form.ticker}
                    style={{ flex: 1 }}
                    onChange={e => setForm(p => ({ ...p, ticker: e.target.value }))}
                    onBlur={autoFillFromTicker}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); autoFillFromTicker(); } }} />
                  <button type="button" className="btn btn-scan" onClick={autoFillFromTicker} disabled={autoFilling || !form.ticker.trim()}
                    style={{ whiteSpace: "nowrap" }}>
                    {autoFilling ? "Buscando…" : "Buscar dados"}
                  </button>
                </div>
                {autoFillMsg && (
                  <div className="form-hint" style={{ color: autoFillMsg.startsWith("✓") ? "#4ade80" : "#fbbf24", marginTop: 4 }}>
                    {autoFillMsg}
                  </div>
                )}
                {!autoFillMsg && (
                  <div className="form-hint">Digite o ticker e saia do campo (ou clique em Buscar) para preencher nome, setor, dividendos, yield e mín/máx 30d automaticamente.</div>
                )}
              </div>
              <div className="form-group form-full">
                <label className="form-label">Nome da Empresa</label>
                <input className="form-input" placeholder="Apple Inc." value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              {/* Qty + Avg */}
              <div className="form-group">
                <label className="form-label">Quantidade</label>
                <input className="form-input" type="number" step="1" placeholder="10" value={form.qty}
                  onChange={e => setForm(p => ({ ...p, qty: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Preço Médio Pago ($)</label>
                <input className="form-input" type="number" step="0.01" placeholder="180.00" value={form.avgPrice}
                  onChange={e => setForm(p => ({ ...p, avgPrice: e.target.value }))} />
              </div>
              {/* Total invested */}
              <div className="form-group form-full">
                <label className="form-label">Total Aportado ($)</label>
                <input className="form-input" type="number" step="0.01"
                  placeholder={form.qty && form.avgPrice ? `Automático: ${fmtCurrency(Number(form.qty)*Number(form.avgPrice))}` : "Ex: 1800.00"}
                  value={form.totalInvested}
                  onChange={e => setForm(p => ({ ...p, totalInvested: e.target.value }))} />
                <div className="form-hint">Se deixar em branco, calcula automaticamente (Qtd × Preço Médio).</div>
              </div>
              {/* Min + Max 30 dias (mercado) */}
              <div className="form-group">
                <label className="form-label">Menor Preço 30d ($)</label>
                <input className="form-input" type="number" step="0.01" placeholder="Auto quando online" value={form.minPrice}
                  onChange={e => setForm(p => ({ ...p, minPrice: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Maior Preço 30d ($)</label>
                <input className="form-input" type="number" step="0.01" placeholder="Auto quando online" value={form.maxPrice}
                  onChange={e => setForm(p => ({ ...p, maxPrice: e.target.value }))} />
              </div>
              {/* Asset class */}
              <div className="form-group">
                <label className="form-label">Classe de Ativo</label>
                <select className="form-input" value={form.assetClass}
                  onChange={e => setForm(p => ({ ...p, assetClass: e.target.value, sector: e.target.value === "Ação" ? p.sector : "" }))}>
                  {ASSET_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {/* Leveraged flag */}
              <div className="form-group">
                <label className="form-label">Alavancado?</label>
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  {[["sim",true],["nao",false]].map(([lbl,val]) => (
                    <button key={lbl} type="button"
                      style={{ flex: 1, padding: "8px", borderRadius: 5,
                        border: `1px solid ${form.leveraged===val ? (val?"#f59e0b":"#1e293b") : "#1e293b"}`,
                        background: form.leveraged===val ? (val?"#1c1200":"#080b10") : "#080b10",
                        color: form.leveraged===val ? (val?"#fbbf24":"#64748b") : "#64748b",
                        cursor:"pointer", fontSize:13, fontFamily:"'IBM Plex Sans',sans-serif" }}
                      onClick={() => setForm(p => ({ ...p, leveraged: val }))}>
                      {val ? <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Icon name="bolt" size={13} /> Sim</span> : "Não"}
                    </button>
                  ))}
                </div>
              </div>
              {/* Estratégia Núcleo/Satélite */}
              <div className="form-group form-full">
                <label className="form-label">Estratégia</label>
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  {[["Núcleo","#3b82f6","shield","Núcleo (longo prazo)"],["Satélite","#f59e0b","rocket","Satélite (curto prazo)"]].map(([val,col,icon,lbl]) => (
                    <button key={val} type="button"
                      style={{ flex: 1, padding: "9px", borderRadius: 5,
                        border: `1px solid ${form.strategy===val ? col : "#1e293b"}`,
                        background: form.strategy===val ? `${col}22` : "#080b10",
                        color: form.strategy===val ? col : "#64748b",
                        cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"'IBM Plex Sans',sans-serif",
                        display:"inline-flex", alignItems:"center", justifyContent:"center", gap:6 }}
                      onClick={() => setForm(p => ({ ...p, strategy: val }))}>
                      <Icon name={icon} size={14} /> {lbl}
                    </button>
                  ))}
                </div>
              </div>
              {/* Sector — só para ações */}
              {form.assetClass === "Ação" && (
                <div className="form-group form-full">
                  <label className="form-label">Setor (GICS)</label>
                  <select className="form-input" value={form.sector}
                    onChange={e => setForm(p => ({ ...p, sector: e.target.value }))}>
                    <option value="">Selecione…</option>
                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}
              {/* Dividends */}
              <div className="form-group">
                <label className="form-label">Paga Dividendos?</label>
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  {["sim","nao"].map(v => (
                    <button key={v} type="button"
                      style={{ flex: 1, padding: "8px", borderRadius: 5, border: `1px solid ${form.paysDividends===v?"#3b82f6":"#1e293b"}`,
                        background: form.paysDividends===v?"#1e3a5f":"#080b10",
                        color: form.paysDividends===v?"#93c5fd":"#64748b", cursor:"pointer", fontSize:13, fontFamily:"'IBM Plex Sans',sans-serif" }}
                      onClick={() => setForm(p => ({ ...p, paysDividends: v }))}>
                      {v === "sim" ? "Sim" : "Não"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Dividend Yield (%/ano)</label>
                <input className="form-input" type="number" step="0.01" placeholder="Ex: 3.50"
                  disabled={form.paysDividends !== "sim"}
                  style={{ opacity: form.paysDividends !== "sim" ? 0.4 : 1 }}
                  value={form.dividendYield}
                  onChange={e => setForm(p => ({ ...p, dividendYield: e.target.value }))} />
              </div>
              {/* Dividend frequency (data de pagamento removida a pedido) */}
              <div className="form-group">
                <label className="form-label">Frequência Dividendos</label>
                <select className="form-input"
                  disabled={form.paysDividends !== "sim"}
                  style={{ opacity: form.paysDividends !== "sim" ? 0.4 : 1 }}
                  value={form.dividendFrequency}
                  onChange={e => setForm(p => ({ ...p, dividendFrequency: e.target.value }))}>
                  <option value="">—</option>
                  {["Mensal","Trimestral","Semestral","Anual"].map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              {/* Orientação (manter/vender/aportar...) */}
              <div className="form-group">
                <label className="form-label">Orientação</label>
                <select className="form-input" value={form.status}
                  onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                  {STATUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  {/* se a ação ainda estiver numa orientação antiga, mostra para permitir ver/trocar */}
                  {form.status && !STATUS_OPTIONS.includes(form.status) && (
                    <option value={form.status}>{form.status} (antigo — reclassifique)</option>
                  )}
                </select>
                <div className="form-hint">Comprar (iniciar) · Aportar (reforçar) · Manter · Reduzir (vender parte) · Vender (sair).</div>
              </div>
              {/* Lucro/Prejuízo realizado em vendas desta ação */}
              <div className="form-group form-full">
                <label className="form-label">Lucro/Prejuízo já realizado nesta ação ($)</label>
                <input className="form-input" type="number" step="0.01" placeholder="Ex: 120.50 (lucro) ou -45.00 (prejuízo)"
                  value={form.realizedPL}
                  onChange={e => setForm(p => ({ ...p, realizedPL: e.target.value }))} />
                <div className="form-hint">Quanto você já ganhou ou perdeu vendendo esta ação no passado. Alimenta o relatório de ganhos/perdas.</div>
              </div>
              {/* Stop-loss */}
              <div className="form-group">
                <label className="form-label">Stop-loss ($)</label>
                <input className="form-input" type="number" step="0.01" placeholder="Preço de saída de emergência"
                  value={form.stopLoss}
                  onChange={e => setForm(p => ({ ...p, stopLoss: e.target.value }))} />
                <div className="form-hint">Preço em que você venderia para limitar prejuízo.</div>
              </div>
              {/* Data da compra */}
              <div className="form-group">
                <label className="form-label">Data da compra</label>
                <input className="form-input" type="date"
                  value={form.buyDate ? String(form.buyDate).slice(0, 10) : ""}
                  onChange={e => setForm(p => ({ ...p, buyDate: e.target.value }))} />
                <div className="form-hint">Há quanto tempo você segura este ativo.</div>
              </div>
              {/* Nota / tese pessoal */}
              <div className="form-group form-full">
                <label className="form-label">Minha tese (por que comprei / estou avaliando)</label>
                <textarea className="form-input" rows={2} placeholder="Ex: comprei pela tese de IA; espero recuperação até 2027; bom pagador de dividendos…"
                  style={{ resize: "vertical", fontFamily: "'IBM Plex Sans',sans-serif" }}
                  value={form.note}
                  onChange={e => setForm(p => ({ ...p, note: e.target.value }))} />
                <div className="form-hint">Releia isto quando bater a dúvida de vender — ajuda a decidir com a cabeça, não com a emoção.</div>
              </div>
            </div>
            <div className="form-hint" style={{ marginBottom: 12 }}>Menor/Maior preço dos últimos 30 dias: enquanto offline, preencha manualmente; quando o app estiver online, são buscados automaticamente e atualizados a cada virada de mês.</div>
            <div className="form-actions" style={{ justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 8 }}>
                {editId && (
                  <button className="btn btn-danger" onClick={() => {
                    const stk = stocks.find(x => x.id === editId);
                    if (window.confirm(`Excluir ${stk?.ticker || "esta ação"} definitivamente? Esta ação não pode ser desfeita.`)) {
                      deleteStock(editId);
                      setShowForm(false); setEditId(null); setAutoFillMsg(null);
                      addToast(`${stk?.ticker || "Ação"} excluída.`, "info");
                    }
                  }}>Excluir</button>
                )}
                {editId && (
                  <button className="btn btn-ghost" onClick={() => setForm(p => ({ ...p, archived: !p.archived }))}
                    title="Arquivar guarda a ação sem mostrá-la na carteira ativa; ela continua no histórico e pode ser restaurada.">
                    {form.archived ? "Desarquivar" : "Arquivar"}
                  </button>
                )}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-ghost" onClick={() => { setShowForm(false); setEditId(null); setAutoFillMsg(null); }}>Cancelar</button>
                <button className="btn btn-primary" onClick={saveStock}>{editId ? "Salvar" : "Adicionar"}</button>
              </div>
            </div>
            {editId && form.archived && (
              <div className="form-hint" style={{ marginTop: 8, color: "#fbbf24" }}>Esta ação será arquivada ao salvar — sai da carteira e da observação, mas fica guardada e pode voltar depois.</div>
            )}
          </div>
        </div>
      )}

      {/* TRANSACTION FORM */}
      {showTxForm && (
        <div className="form-overlay" onClick={e => e.target === e.currentTarget && setShowTxForm(false)}>
          <div className="form-box">
            <div className="form-title">Registrar Transação</div>
            <div className="form-grid">
              <div className="form-group form-full">
                <label className="form-label">Tipo</label>
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  {["COMPRA","VENDA"].map(v => (
                    <button key={v} type="button"
                      style={{ flex: 1, padding: "10px", borderRadius: 5,
                        border: `1px solid ${txForm.type===v ? (v==="COMPRA"?"#16a34a":"#dc2626") : "#1e293b"}`,
                        background: txForm.type===v ? (v==="COMPRA"?"#052e16":"#2d0a0a") : "#080b10",
                        color: txForm.type===v ? (v==="COMPRA"?"#4ade80":"#f87171") : "#64748b",
                        cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'IBM Plex Sans',sans-serif" }}
                      onClick={() => setTxForm(p => ({ ...p, type: v }))}>
                      {v === "COMPRA" ? "▲ Compra" : "▼ Venda"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group form-full">
                <label className="form-label">Ação</label>
                <select className="form-input" value={txForm.ticker}
                  onChange={e => {
                    const t = e.target.value;
                    if (t === "__nova__") {
                      setTxForm(p => ({ ...p, ticker: "", _novaManual: true }));
                      return;
                    }
                    // Seleciona a ação; o valor total é preenchido pela usuária (vem do extrato)
                    const stk = stocks.find(s => s.ticker === t);
                    setTxForm(p => ({
                      ...p,
                      ticker: t,
                      _novaManual: false,
                    }));
                  }}>
                  <option value="">Selecione uma ação cadastrada…</option>
                  {[...stocks].sort((a, b) => a.ticker.localeCompare(b.ticker)).map(s => (
                    <option key={s.id} value={s.ticker}>
                      {s.ticker} — {s.name}{Number(s.qty) > 0 ? ` (tem ${s.qty})` : " (observando)"}
                    </option>
                  ))}
                  <option value="__nova__">+ Outra ação (digitar manualmente)</option>
                </select>
                {/* Campo manual de ticker, só quando escolhe "Outra ação" */}
                {(txForm._novaManual || (txForm.ticker && !stocks.find(s => s.ticker === txForm.ticker))) && (
                  <input className="form-input" style={{ marginTop: 8 }} placeholder="Digite o ticker (ex: MSFT)"
                    value={txForm.ticker}
                    onChange={e => setTxForm(p => ({ ...p, ticker: e.target.value.toUpperCase() }))} />
                )}
                {/* Resumo da posição atual da ação escolhida */}
                {txForm.ticker && (() => {
                  const stk = stocks.find(s => s.ticker === txForm.ticker);
                  const q = quotes[txForm.ticker];
                  if (!stk) return null;
                  return (
                    <div className="form-hint" style={{ marginTop: 8, lineHeight: 1.7 }}>
                      Posição atual: <strong style={{ color: "#e2e8f0" }}>{stk.qty} cotas</strong> · preço médio <strong style={{ color: "#e2e8f0" }}>{fmtCurrency(stk.avgPrice)}</strong>
                      {q?.c && <> · cotação hoje <strong style={{ color: "#4ade80" }}>{fmtCurrency(q.c)}</strong></>}
                      {txForm.type === "VENDA" && q?.c && (
                        <><br/>Resultado estimado desta venda: <strong style={{ color: (q.c - stk.avgPrice) >= 0 ? "#4ade80" : "#f87171" }}>
                          {fmtCurrency((q.c - stk.avgPrice) * (txForm.qty ? Number(txForm.qty) : stk.qty))}
                        </strong></>
                      )}
                    </div>
                  );
                })()}
              </div>
              <div className="form-group">
                <label className="form-label">Quantidade</label>
                <input className="form-input" type="number" step="0.0001" placeholder="10" value={txForm.qty}
                  onChange={e => setTxForm(p => ({ ...p, qty: e.target.value }))} />
                {txForm.type === "VENDA" && txForm.ticker && (() => {
                  const stk = stocks.find(s => s.ticker === txForm.ticker);
                  if (!stk || !(Number(stk.qty) > 0)) return null;
                  return (
                    <button type="button" className="btn btn-ghost btn-sm" style={{ marginTop: 6 }}
                      onClick={() => setTxForm(p => ({ ...p, qty: String(stk.qty) }))}>
                      Vender tudo ({stk.qty})
                    </button>
                  );
                })()}
              </div>
              <div className="form-group">
                <label className="form-label">Valor total da operação ($)</label>
                <input className="form-input" type="number" step="0.01" placeholder="Ex: 660.03" value={txForm.total}
                  onChange={e => setTxForm(p => ({ ...p, total: e.target.value }))} />
                {txForm.qty && txForm.total && Number(txForm.qty) > 0 && (
                  <div className="form-hint">Preço por ação: {fmtCurrency(Number(txForm.total) / Number(txForm.qty))}</div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Data</label>
                <input className="form-input" type="date" value={txForm.date}
                  onChange={e => setTxForm(p => ({ ...p, date: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Taxas/Corretagem ($)</label>
                <input className="form-input" type="number" step="0.01" placeholder="Opcional" value={txForm.fees}
                  onChange={e => setTxForm(p => ({ ...p, fees: e.target.value }))} />
              </div>
            </div>
            {txForm.qty && txForm.total && (
              <div className="form-hint" style={{ marginBottom: 12 }}>
                {txForm.type === "VENDA" ? "Valor recebido" : "Valor desembolsado"}: <strong style={{ color: "#e2e8f0" }}>{fmtCurrency(Number(txForm.total) + (txForm.type === "COMPRA" && txForm.fees ? Number(txForm.fees) : 0) - (txForm.type === "VENDA" && txForm.fees ? Number(txForm.fees) : 0))}</strong>
                {txForm.fees ? <> (já {txForm.type === "VENDA" ? "descontadas" : "somadas"} as taxas de {fmtCurrency(Number(txForm.fees))})</> : null}
              </div>
            )}
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={() => setShowTxForm(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={saveTransaction}>Registrar</button>
            </div>
          </div>
        </div>
      )}

      {/* ALERT FORM */}
      {showAlertForm && (
        <div className="form-overlay" onClick={e => e.target === e.currentTarget && setShowAlertForm(null)}>
          <div className="form-box">
            <div className="form-title">Alertas — {showAlertForm}</div>
            <div style={{ fontSize: 12, color: "#8b9ab5", marginBottom: 16, lineHeight: 1.5 }}>
              Preencha só o lado que te interessa. Se deixar um campo <strong>vazio</strong>, aquele alerta não dispara. Ex: para uma ação que você só quer vender, preencha apenas o alvo de venda.
            </div>
            <div className="alert-section" style={{ borderColor: "#7f1d1d" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "#f87171", fontWeight: 600 }}>▼ Alerta de VENDA</div>
                {alertForm.sellTarget && <button className="btn btn-ghost btn-sm" style={{ fontSize: 11, padding: "3px 8px" }} onClick={() => setAlertForm(p => ({ ...p, sellTarget: "" }))}>Limpar</button>}
              </div>
              <div className="form-group">
                <label className="form-label">Preço-alvo de venda ($)</label>
                <input className="form-input" type="number" step="0.01" placeholder="deixe vazio para não alertar"
                  value={alertForm.sellTarget} onChange={e => setAlertForm(p => ({ ...p, sellTarget: e.target.value }))} />
                <div className="form-hint">Toca + notificação quando cotação ≥ este valor.</div>
              </div>
            </div>
            <div className="alert-section" style={{ borderColor: "#14532d" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "#4ade80", fontWeight: 600 }}>▲ Alerta de COMPRA</div>
                {alertForm.buyTarget && <button className="btn btn-ghost btn-sm" style={{ fontSize: 11, padding: "3px 8px" }} onClick={() => setAlertForm(p => ({ ...p, buyTarget: "" }))}>Limpar</button>}
              </div>
              <div className="form-group">
                <label className="form-label">Preço-piso de compra ($)</label>
                <input className="form-input" type="number" step="0.01" placeholder="deixe vazio para não alertar"
                  value={alertForm.buyTarget} onChange={e => setAlertForm(p => ({ ...p, buyTarget: e.target.value }))} />
                <div className="form-hint">Toca + notificação quando cotação ≤ este valor.</div>
              </div>
            </div>
            <div className="form-actions">
              {alerts[showAlertForm]?.active && (
                <button className="btn btn-danger" onClick={() => { clearAlert(showAlertForm); setShowAlertForm(null); }}>Remover</button>
              )}
              <button className="btn btn-ghost" onClick={() => setShowAlertForm(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={saveAlert}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
