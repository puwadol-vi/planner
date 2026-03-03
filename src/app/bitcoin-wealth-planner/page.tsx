'use client';

import { useState, useMemo } from 'react';

function InputGroupWithTooltip({
  label,
  value,
  onChange,
  borderColor,
  hint,
  tooltip,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  borderColor: string;
  hint: string;
  tooltip: React.ReactNode;
}) {
  const hintColor =
    borderColor === 'border-emerald-500'
      ? 'text-emerald-400'
      : borderColor === 'border-cyan-400'
        ? 'text-cyan-400'
        : 'text-orange-400';
  return (
    <div
      className={`group relative rounded-xl bg-slate-700/50 p-4 border-t-4 transition focus-within:ring-2 focus-within:ring-sky-400/50 ${borderColor}`}
    >
      <label className="flex justify-between items-center text-slate-400 text-sm font-semibold mb-2">
        {label}
        <span className="w-4 h-4 rounded-full bg-slate-600 text-[10px] flex items-center justify-center text-slate-300 cursor-help">
          ?
        </span>
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) ?? 0)}
        className="w-full bg-transparent border-b-2 border-slate-500 text-white text-xl font-semibold outline-none focus:border-sky-400 pb-1 transition"
      />
      <p className={`text-xs mt-2 font-medium ${hintColor}`}>{hint}</p>
      <div className="absolute bottom-[105%] left-0 hidden group-hover:block w-64 bg-slate-800 text-slate-200 text-xs p-3 rounded-xl border border-slate-600 shadow-2xl z-50">
        {tooltip}
      </div>
    </div>
  );
}
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

const RATE_UST = 0.04; // พันธบัตรรัฐบาล 4%
const YEARS = 20;

function formatMoney(num: number): string {
  return (num / 1_000_000).toFixed(2) + ' ลบ.';
}

export default function BitcoinWealthPlannerPage() {
  const [initial, setInitial] = useState(0);
  const [dca, setDca] = useState(120000);
  const [rateSPX, setRateSPX] = useState(12);
  const [rateBTC, setRateBTC] = useState(30);
  const [inflationRate, setInflationRate] = useState(3);
  const [triggerX, setTriggerX] = useState(10);
  const [showRealValue, setShowRealValue] = useState(false);

  const { chartData, dispSPX, dispTake, dispHODL, s4TriggerYear } = useMemo(() => {
    const rBTC = rateBTC / 100;
    const rSPX = rateSPX / 100;
    const infl = inflationRate / 100;
    const effectiveTrigger = triggerX || 10;

    const rawSPX: number[] = [initial];
    const rawTake: number[] = [initial];
    const rawHODL: number[] = [initial];
    const dispSPX: number[] = [initial];
    const dispTake: number[] = [initial];
    const dispHODL: number[] = [initial];

    let s4Triggered = false;
    let s4TriggerYear = -1;

    for (let i = 1; i <= YEARS; i++) {
      const discountFactor = showRealValue ? Math.pow(1 + infl, i) : 1;

      const val2 = (rawSPX[i - 1] + dca) * (1 + rSPX);
      rawSPX.push(val2);
      dispSPX.push(val2 / discountFactor);

      const val5 = (rawHODL[i - 1] + dca) * (1 + rBTC);
      rawHODL.push(val5);
      dispHODL.push(val5 / discountFactor);

      const prev4 = rawTake[i - 1] + dca;
      const totalPrincipal = initial + dca * i;
      const checkValue = rawTake[i - 1];

      if (i > 1 && checkValue > totalPrincipal * effectiveTrigger) {
        s4Triggered = true;
        if (s4TriggerYear === -1) s4TriggerYear = i - 1;
      }

      let val4: number;
      if (s4Triggered) {
        val4 = prev4 * 0.5 * (1 + rBTC) + prev4 * 0.5 * (1 + RATE_UST);
      } else {
        val4 = prev4 * (1 + rBTC);
      }
      rawTake.push(val4);
      dispTake.push(val4 / discountFactor);
    }

    const chartData = Array.from({ length: YEARS + 1 }, (_, i) => ({
      year: i,
      spx: Math.round(dispSPX[i]),
      hodl: Math.round(dispHODL[i]),
      smart: Math.round(dispTake[i]),
    }));

    return {
      chartData,
      dispSPX,
      dispTake,
      dispHODL,
      s4TriggerYear,
    };
  }, [initial, dca, rateSPX, rateBTC, inflationRate, triggerX, showRealValue]);

  const typeText = showRealValue ? 'หักเงินเฟ้อแล้ว' : 'ยังไม่หักเงินเฟ้อ';
  const finalSPX = dispSPX[YEARS];
  const finalTake = dispTake[YEARS];
  const finalHODL = dispHODL[YEARS];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 md:p-8 flex flex-col">
      <div className="max-w-7xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              💎 Bitcoin Wealth Planner
            </h1>
            <p className="text-slate-400 text-lg">
              วางแผนเกษียณด้วยพลังของ DCA และ Asset Allocation
            </p>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-sm text-slate-500">Scenario Mode</div>
            <div className="text-xl font-semibold text-white">
              Monthly Savings (DCA)
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 shadow-xl">
          {/* Section 1: Input */}
          <h3 className="text-white font-semibold mb-4 flex items-center justify-between text-lg border-b border-slate-700 pb-2">
            <span className="flex items-center gap-2">📝 Input (ข้อมูลพื้นฐาน)</span>
            <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-lg border border-slate-700">
              <span className="text-sm font-semibold text-slate-300">
                หักเงินเฟ้อ (Real Value)
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={showRealValue}
                onClick={() => setShowRealValue((v) => !v)}
                className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 ${showRealValue ? 'bg-cyan-400' : 'bg-slate-600'}`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${showRealValue ? 'translate-x-6' : 'translate-x-1'}`}
                  style={{ top: 2 }}
                />
              </button>
            </div>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <InputGroup
              label="เริ่มต้น (บาท)"
              value={initial}
              onChange={setInitial}
              borderColor="border-blue-500"
              hint="เงินก้อนแรก"
            />
            <InputGroup
              label="ออมเพิ่มต่อปี (บาท)"
              value={dca}
              onChange={setDca}
              borderColor="border-blue-500"
              hint="เฉลี่ยเดือนละ 10,000 บาท"
            />
            <InputGroup
              label="อัตราเงินเฟ้อ (%)"
              value={inflationRate}
              onChange={setInflationRate}
              borderColor="border-red-500"
              hint="ลดทอนมูลค่าเงินในอนาคต"
              step={0.1}
            />
          </div>

          {/* Section 2: Your Plan */}
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2 text-lg border-b border-slate-700 pb-2">
            🛠️ กำหนดแผนการลงทุน (Your Plan)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputGroupWithTooltip
              label="S&P 500 (%)"
              value={rateSPX}
              onChange={setRateSPX}
              borderColor="border-emerald-500"
              hint="📌 Traditional Plan"
              tooltip={
                <>
                  <strong>Traditional Plan:</strong>
                  <br />
                  นำเงินไป DCA ในดัชนีหุ้นสหรัฐฯ 500 บริษัทชั้นนำ
                </>
              }
            />
            <InputGroupWithTooltip
              label="Take Profit Trigger (x)"
              value={triggerX}
              onChange={(v) => setTriggerX(v || 10)}
              borderColor="border-cyan-400"
              hint="📌 Smart Bitcoin Plan"
              tooltip={
                <>
                  <strong>Smart Bitcoin Plan :</strong>
                  <br />
                  ลงทุน Bitcoin แต่ตั้งเป้าหมายไว้ถ้าพอร์ตโตเกิน X เท่าเมื่อไหร่ ให้ &quot;ล็อคกำไร 50%&quot; ย้ายไปพักในพันธบัตรรัฐบาล 4%
                </>
              }
            />
            <InputGroupWithTooltip
              label="Bitcoin Growth (%)"
              value={rateBTC}
              onChange={setRateBTC}
              borderColor="border-orange-500"
              hint="📌 Max HODL Plan"
              tooltip={
                <>
                  <strong>Max HODL Plan :</strong>
                  <br />
                  นำเงินไป DCA ใน Bitcoin แบบ 100% ถือยาว
                </>
              }
            />
          </div>
        </div>

        {/* Results Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ResultCard
            label="Traditional Plan"
            badge="Standard"
            value={formatMoney(finalSPX)}
            sub="S&P 500 Strategy"
            borderColor="border-emerald-500"
            bgColor="bg-emerald-950/20"
            labelColor="text-emerald-300"
            badgeClass="bg-emerald-900 text-emerald-300"
            subColor="text-emerald-400"
            typeText={typeText}
          />
          <ResultCard
            label="Smart Bitcoin Plan"
            badge="Hybrid"
            value={formatMoney(finalTake)}
            sub="With Take Profit System"
            borderColor="border-cyan-400"
            bgColor="bg-cyan-950/20"
            labelColor="text-cyan-300"
            badgeClass="bg-cyan-900 text-cyan-300"
            subColor="text-cyan-400"
            typeText={typeText}
            hero
            noTargetBadge
          />
          <ResultCard
            label="Max HODL Plan"
            badge="Holder"
            value={formatMoney(finalHODL)}
            sub="100% BTC Exposure"
            borderColor="border-orange-500"
            bgColor="bg-orange-950/20"
            labelColor="text-orange-300"
            badgeClass="bg-orange-900 text-orange-300"
            subColor="text-orange-400"
            typeText={typeText}
          />
        </div>

        {/* Chart */}
        <div className="bg-slate-800 rounded-2xl p-4 md:p-8 border border-slate-700 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2 flex-wrap">
              📈 เส้นทางความมั่งคั่ง
              <span
                className={`text-xs px-2 py-1 rounded font-normal ${showRealValue ? 'bg-red-900/50 text-red-300 border border-red-700/50' : 'bg-slate-700 text-slate-300'}`}
              >
                {showRealValue
                  ? 'มูลค่าจริง (Real Value)'
                  : 'มูลค่าตามตัวเลข (Nominal)'}
              </span>
            </h2>
            <div
              className={`hidden md:block text-xs px-3 py-1.5 rounded-full border ${s4TriggerYear > 0 ? 'bg-cyan-900 text-cyan-300 border-cyan-700' : 'bg-orange-900 text-orange-300 border-orange-700'}`}
            >
              {s4TriggerYear > 0
                ? `Triggered at Year ${s4TriggerYear}`
                : 'Accumulating'}
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="year"
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <YAxis
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(v) => (v / 1_000_000).toFixed(1) + 'M'}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid #334155',
                    borderRadius: 8,
                    color: '#e2e8f0',
                  }}
                  formatter={(value) =>
                    typeof value === 'number'
                      ? new Intl.NumberFormat('th-TH', {
                          style: 'currency',
                          currency: 'THB',
                          maximumFractionDigits: 0,
                        }).format(value)
                      : String(value)
                  }
                />
                <Legend
                  wrapperStyle={{ paddingTop: 12 }}
                  iconType="line"
                  iconSize={12}
                  formatter={(value) => <span className="text-slate-300">{value}</span>}
                />
                {s4TriggerYear >= 0 && (
                  <ReferenceLine
                    x={s4TriggerYear}
                    stroke="#fff"
                    strokeDasharray="6 6"
                    strokeWidth={1}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="spx"
                  name="S&P 500 (Traditional)"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="hodl"
                  name="Bitcoin HODL (Holder)"
                  stroke="#f97316"
                  strokeWidth={1}
                  fill="rgba(249, 115, 22, 0.05)"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="smart"
                  name="Smart Plan (Hybrid)"
                  stroke="#22d3ee"
                  strokeWidth={4}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 p-4 bg-slate-800 rounded-xl border border-slate-700">
            <p className="text-slate-300 text-sm leading-relaxed">
              {s4TriggerYear > 0 ? (
                <>
                  <strong className="text-cyan-400">💡 Smart Plan Analysis:</strong>{' '}
                  ระบบสั่ง &quot;ล็อคกำไร&quot; อัตโนมัติในปีที่{' '}
                  <strong>{s4TriggerYear}</strong>
                  {showRealValue ? (
                    <span className="mt-2 block text-red-300">
                      <br />
                      ⚠️ <strong>Reality Check:</strong> ตัวเลขที่คุณเห็นตอนนี้คือ{' '}
                      <strong>&quot;อำนาจซื้อที่แท้จริง&quot;</strong> หลังหักเงินเฟ้อ {inflationRate}%
                      แล้ว จะเห็นว่าแม้ตัวเลขจะลดลงมา แต่แผน Smart
                      Hybrid ก็ยังเพียงพอที่จะซื้ออิสรภาพให้คุณได้จริง
                      โดยไม่ต้องเสี่ยงเกินไปในช่วงบั้นปลาย
                    </span>
                  ) : (
                    <span className="mt-2 block text-slate-400">
                      <br />
                      ลองกดปุ่ม <strong>&quot;หักเงินเฟ้อ&quot;</strong>{' '}
                      ด้านบนดูสิครับ เพื่อดูว่าเงินก้อนนี้จะมีอำนาจซื้อจริงๆ
                      ในอนาคตเท่าไหร่?
                    </span>
                  )}
                </>
              ) : (
                <>ยังอยู่ในช่วงสะสมพลัง เงินยังไม่โตถึงเป้า {triggerX} เท่า</>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface InputGroupProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  borderColor: string;
  hint?: string;
  step?: number;
}

function InputGroup({
  label,
  value,
  onChange,
  borderColor,
  hint,
  step = 1,
}: InputGroupProps) {
  return (
    <div
      className={`rounded-xl bg-slate-700/50 p-4 border-t-4 transition focus-within:ring-2 focus-within:ring-sky-400/50 ${borderColor}`}
    >
      <label className="block text-slate-400 text-sm font-semibold mb-2">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        step={step}
        className="w-full bg-transparent border-b-2 border-slate-500 text-white text-xl font-semibold outline-none focus:border-sky-400 pb-1 transition"
      />
      {hint && <p className="text-xs text-slate-400 mt-2">{hint}</p>}
    </div>
  );
}

interface ResultCardProps {
  label: string;
  badge: string;
  value: string;
  sub: string;
  borderColor: string;
  bgColor: string;
  labelColor: string;
  badgeClass: string;
  subColor: string;
  typeText: string;
  hero?: boolean;
  noTargetBadge?: boolean;
}

function ResultCard({
  label,
  badge,
  value,
  sub,
  borderColor,
  bgColor,
  labelColor,
  badgeClass,
  subColor,
  typeText,
  hero,
  noTargetBadge,
}: ResultCardProps) {
  return (
    <div
      className={`relative rounded-2xl p-6 border shadow-xl ${borderColor} ${bgColor} ${hero ? 'md:-translate-y-2 border shadow-cyan-500/20 shadow-lg' : 'border-slate-700'}`}
    >
      {hero && !noTargetBadge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg z-10">
          🌟 YOUR TARGET
        </div>
      )}
      <div className="flex justify-between items-start mb-2 mt-2">
        <div className={`text-sm font-semibold uppercase tracking-wide ${labelColor}`}>
          {label}
        </div>
        <div className={`text-xs px-2 py-1 rounded ${badgeClass}`}>{badge}</div>
      </div>
      <div className={`font-bold text-white mb-1 ${hero ? 'text-3xl' : 'text-2xl'}`}>{value}</div>
      <div className={`text-sm flex items-center gap-1 ${subColor}`}>
        {sub}{' '}
        <span className="text-[10px] bg-slate-800 px-1 rounded text-slate-400">
          {typeText}
        </span>
      </div>
    </div>
  );
}
