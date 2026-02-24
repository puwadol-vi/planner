'use client';

import { useState, useMemo } from 'react';
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
  ReferenceArea,
} from 'recharts';
import {
  Calculator,
  HeartPulse,
  TrendingUp,
  AlertTriangle,
  Plus,
  Trash2,
  Unlock,
  Target,
  Search,
  Info,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Premium table (age range -> plan premiums in THB); some rows use p20M for 15M plan
const PREMIUM_DATA: Array<{
  start: number;
  end: number;
  p1M: number;
  p5M: number;
  p15M?: number;
  p20M?: number;
  p25M: number;
}> = [
  { start: 0, end: 5, p1M: 16400, p5M: 20200, p15M: 25500, p25M: 33400 },
  { start: 6, end: 10, p1M: 16400, p5M: 20200, p15M: 25500, p25M: 33400 },
  { start: 11, end: 15, p1M: 13500, p5M: 16500, p20M: 20100, p25M: 26200 },
  { start: 16, end: 20, p1M: 13700, p5M: 16900, p15M: 21600, p25M: 28000 },
  { start: 21, end: 25, p1M: 14700, p5M: 18300, p15M: 26100, p25M: 33800 },
  { start: 26, end: 30, p1M: 15100, p5M: 18900, p15M: 29400, p25M: 37800 },
  { start: 31, end: 35, p1M: 17000, p5M: 20800, p15M: 31800, p25M: 40900 },
  { start: 36, end: 40, p1M: 19200, p5M: 23800, p15M: 36000, p25M: 47300 },
  { start: 41, end: 45, p1M: 21600, p5M: 26700, p15M: 40200, p25M: 52400 },
  { start: 46, end: 50, p1M: 28300, p5M: 35000, p15M: 50100, p25M: 65300 },
  { start: 51, end: 55, p1M: 34100, p5M: 42300, p15M: 63900, p25M: 83000 },
  { start: 56, end: 60, p1M: 40900, p5M: 50600, p15M: 72300, p25M: 94100 },
  { start: 61, end: 65, p1M: 59400, p5M: 72100, p15M: 105000, p25M: 136700 },
  { start: 66, end: 70, p1M: 85400, p5M: 104000, p15M: 152100, p25M: 197800 },
  { start: 71, end: 75, p1M: 122900, p5M: 150000, p15M: 219900, p25M: 286300 },
  { start: 76, end: 80, p1M: 177800, p5M: 217100, p15M: 318300, p25M: 414700 },
  { start: 81, end: 85, p1M: 204500, p5M: 249700, p15M: 366000, p25M: 476900 },
  { start: 86, end: 99, p1M: 235200, p5M: 287200, p15M: 420900, p25M: 548400 },
];

// Row 11-15 has p20M in ref; map to p15M for our shape
const getPremium = (age: number, plan: number): number => {
  const range = PREMIUM_DATA.find((r) => age >= r.start && age <= r.end);
  if (!range) return 0;
  if (plan === 1) return range.p1M;
  if (plan === 5) return range.p5M;
  if (plan === 15) return range.p15M ?? range.p20M ?? 0;
  if (plan === 25) return range.p25M;
  return 0;
};

interface CardProps {
  title: string;
  value: string;
  subtext?: string;
  color?: string;
  icon?: LucideIcon;
}

function Card({ title, value, subtext, color = 'text-white', icon: Icon }: CardProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-lg relative overflow-hidden group">
      <div className="flex justify-between items-start mb-2 relative z-10">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        {Icon && (
          <Icon
            size={18}
            className="text-gray-500 group-hover:text-gray-300 transition-colors"
          />
        )}
      </div>
      <div className={`text-2xl font-bold ${color} relative z-10`}>{value}</div>
      {subtext && (
        <div className="text-xs text-gray-500 mt-1 relative z-10">{subtext}</div>
      )}
    </div>
  );
}

interface MedicalEvent {
  id: number;
  age: number;
  cost: number;
}

interface SimRow {
  age: number;
  s1: number;
  s2: number;
  rawS1: number;
  rawS1_prev: number;
  s1_growth_amt: number;
  rawS2: number;
  rawS2_prev: number;
  s2_growth_amt: number;
  annualSavings: number;
  premium: number;
  medicalCost: number;
  outOfPocket: number;
  difference: number;
  discountFactor: number;
  isBankrupt: boolean;
  isSick: boolean;
  isRetired: boolean;
  isSelfInsured: boolean;
}

export default function BitcoinVsInsuranceSimulatorPage() {
  const [startAge, setStartAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [initialCapital, setInitialCapital] = useState(500000);
  const [monthlySavings, setMonthlySavings] = useState(20000);
  const [btcGrowth, setBtcGrowth] = useState(20);
  const [selectedPlan, setSelectedPlan] = useState(5);
  const [inflationRate, setInflationRate] = useState(3);
  const [showRealValue, setShowRealValue] = useState(false);
  const [chartView, setChartView] = useState<'accumulation' | 'lifetime'>(
    'accumulation'
  );
  const [medicalEvents, setMedicalEvents] = useState<MedicalEvent[]>([]);

  const simulationData = useMemo(() => {
    const data: SimRow[] = [];
    const maxAge = 80;

    if (startAge > maxAge) return { data, selfInsuredAge: null as number | null };

    let s1_balance = initialCapital;
    let s2_balance = initialCapital;
    const planLimit = selectedPlan * 1_000_000;
    let selfInsuredAge: number | null = null;

    for (let age = startAge; age <= maxAge; age++) {
      const yearIndex = age - startAge;
      const isWorking = age < retirementAge;
      const annualSavings = isWorking ? monthlySavings * 12 : 0;
      const premium = getPremium(age, selectedPlan);
      const event = medicalEvents.find((e) => e.age === age);
      const medicalCost = event ? event.cost : 0;

      const rawS1_prev = s1_balance;
      let s1_growth_amt = 0;
      if (yearIndex > 0 && s1_balance > 0) {
        s1_growth_amt = s1_balance * (btcGrowth / 100);
      }
      const s1_pre_deduction = s1_balance + s1_growth_amt + annualSavings;
      const isBankrupt = s1_pre_deduction < medicalCost;
      s1_balance = s1_pre_deduction - medicalCost;

      if (selfInsuredAge === null && s1_balance >= planLimit) {
        selfInsuredAge = age;
      }

      const rawS2_prev = s2_balance;
      let s2_growth_amt = 0;
      if (yearIndex > 0 && s2_balance > 0) {
        s2_growth_amt = s2_balance * (btcGrowth / 100);
      }
      const outOfPocket = Math.max(0, medicalCost - planLimit);
      s2_balance =
        s2_balance +
        s2_growth_amt +
        (annualSavings - premium) -
        outOfPocket;

      const difference = s1_balance - s2_balance;
      let displayS1 = s1_balance;
      let displayS2 = s2_balance;
      let displayDiff = difference;
      const discountFactor = Math.pow(1 + inflationRate / 100, yearIndex);

      if (showRealValue) {
        displayS1 = s1_balance / discountFactor;
        displayS2 = s2_balance / discountFactor;
        displayDiff = difference / discountFactor;
      }

      data.push({
        age,
        s1: Math.round(displayS1),
        s2: Math.round(displayS2),
        rawS1: s1_balance,
        rawS1_prev,
        s1_growth_amt,
        rawS2: s2_balance,
        rawS2_prev,
        s2_growth_amt,
        annualSavings,
        premium,
        medicalCost,
        outOfPocket,
        difference: Math.round(displayDiff),
        discountFactor,
        isBankrupt,
        isSick: medicalCost > 0,
        isRetired: !isWorking,
        isSelfInsured: s1_balance >= planLimit,
      });
    }
    return { data, selfInsuredAge };
  }, [
    startAge,
    retirementAge,
    initialCapital,
    monthlySavings,
    btcGrowth,
    selectedPlan,
    medicalEvents,
    inflationRate,
    showRealValue,
  ]);

  const chartData = simulationData.data;
  const selfInsuredAge = simulationData.selfInsuredAge;
  const yearsToFreedom = selfInsuredAge ? selfInsuredAge - startAge : null;

  const displayChartData =
    chartView === 'accumulation'
      ? chartData.filter((d) => d.age <= retirementAge)
      : chartData;

  const addEvent = () => {
    const newId =
      medicalEvents.length > 0
        ? Math.max(...medicalEvents.map((e) => e.id), 0) + 1
        : 1;
    setMedicalEvents([
      ...medicalEvents,
      { id: newId, age: startAge + 10, cost: 5000000 },
    ]);
  };

  const updateEvent = (id: number, field: keyof MedicalEvent, value: number) => {
    setMedicalEvents(
      medicalEvents.map((e) =>
        e.id === id ? { ...e, [field]: value } : e
      )
    );
  };

  const removeEvent = (id: number) => {
    setMedicalEvents(medicalEvents.filter((e) => e.id !== id));
  };

  const formatMoney = (val: number | undefined | null): string => {
    if (val === undefined || val === null || isNaN(val)) return '0 ฿';
    const absVal = Math.abs(val);
    const sign = val < 0 ? '-' : '';
    if (absVal >= 1_000_000_000)
      return sign + (absVal / 1_000_000_000).toFixed(2) + 'B';
    if (absVal >= 1_000_000) return sign + (absVal / 1_000_000).toFixed(2) + 'M';
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDetail = (val: number): string => {
    return new Intl.NumberFormat('th-TH', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const worstCase = chartData.reduce(
    (prev, current) =>
      current.difference < prev.difference ? current : prev,
    { difference: 0, age: 0, isBankrupt: false } as SimRow
  );

  const finalData =
    chartData.length > 0 ? chartData[chartData.length - 1] : { s1: 0, s2: 0 };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-700 pb-4">
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
              Bitcoin vs Insurance Simulator
            </h1>
            <p className="text-gray-400 mt-1">
              Free Your Time System: Visualizing the &quot;Fiat Shield&quot;
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Show Real Value</span>
              <button
                type="button"
                onClick={() => setShowRealValue(!showRealValue)}
                className={`w-12 h-6 rounded-full transition p-1 ${showRealValue ? 'bg-orange-500' : 'bg-gray-700'}`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition transform ${showRealValue ? 'translate-x-6' : ''}`}
                />
              </button>
            </div>
            <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-600 flex items-center gap-2">
              <Target size={16} className="text-green-400" />
              <div>
                <span className="text-xs text-gray-400 block">Plan Limit</span>
                <span className="font-bold text-xl text-green-400">
                  {selectedPlan}M
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calculator size={20} className="text-orange-400" /> Parameters
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Age Start
                  </label>
                  <input
                    type="number"
                    value={startAge}
                    onChange={(e) => setStartAge(Number(e.target.value))}
                    className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white outline-none focus:border-orange-500 transition"
                  />
                </div>
                <div>
                  <label className="flex text-xs text-gray-400 mb-1 justify-between">
                    <span>Retirement Age</span>
                    <span className="text-gray-500">(Stop Saving)</span>
                  </label>
                  <input
                    type="number"
                    value={retirementAge}
                    onChange={(e) =>
                      setRetirementAge(Number(e.target.value))
                    }
                    className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white outline-none focus:border-orange-500 transition"
                  />
                </div>
                <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-600">
                  <label className="block text-xs text-orange-400 font-semibold mb-1">
                    Initial Capital (THB)
                  </label>
                  <input
                    type="number"
                    value={initialCapital}
                    onChange={(e) =>
                      setInitialCapital(Number(e.target.value))
                    }
                    className="w-full bg-gray-900 border border-orange-500/50 rounded p-2 text-white outline-none focus:border-orange-500 transition"
                    placeholder="เงินก้อนเริ่มต้น"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Monthly Savings (THB)
                  </label>
                  <input
                    type="number"
                    value={monthlySavings}
                    onChange={(e) =>
                      setMonthlySavings(Number(e.target.value))
                    }
                    className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white outline-none focus:border-orange-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    BTC Growth (% per year)
                  </label>
                  <input
                    type="number"
                    value={btcGrowth}
                    onChange={(e) => setBtcGrowth(Number(e.target.value))}
                    className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white outline-none focus:border-orange-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Inflation Rate (%)
                  </label>
                  <input
                    type="number"
                    value={inflationRate}
                    onChange={(e) =>
                      setInflationRate(Number(e.target.value))
                    }
                    className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white outline-none focus:border-orange-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Insurance Plan
                  </label>
                  <select
                    value={selectedPlan}
                    onChange={(e) =>
                      setSelectedPlan(Number(e.target.value))
                    }
                    className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white outline-none focus:border-orange-500 transition"
                  >
                    <option value={1}>Plan 1M</option>
                    <option value={5}>Plan 5M</option>
                    <option value={15}>Plan 15M</option>
                    <option value={25}>Plan 25M</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <HeartPulse size={20} className="text-red-400" /> Sickness
                  Events
                </h2>
                <button
                  type="button"
                  onClick={addEvent}
                  className="bg-gray-700 hover:bg-gray-600 p-1 rounded transition"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="space-y-3">
                {medicalEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-gray-900 p-3 rounded border border-gray-700 relative group"
                  >
                    <button
                      type="button"
                      onClick={() => removeEvent(event.id)}
                      className="absolute top-2 right-2 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-gray-500">Age</label>
                        <input
                          type="number"
                          value={event.age}
                          onChange={(e) =>
                            updateEvent(event.id, 'age', Number(e.target.value))
                          }
                          className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500">
                          Cost
                        </label>
                        <input
                          type="number"
                          value={event.cost}
                          onChange={(e) =>
                            updateEvent(
                              event.id,
                              'cost',
                              Number(e.target.value)
                            )
                          }
                          className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-red-300"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-9 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card
                title="Time to Self-Insure"
                value={
                  yearsToFreedom != null ? `${yearsToFreedom} Years` : 'Never'
                }
                icon={Unlock}
                color="text-blue-400"
                subtext={
                  selfInsuredAge
                    ? `Portfolio > Plan at Age ${selfInsuredAge}`
                    : 'Portfolio never exceeds limit'
                }
              />
              <Card
                title={
                  showRealValue ? 'Real Wealth (S1)' : 'Final Wealth (S1)'
                }
                value={formatMoney(finalData.s1)}
                icon={TrendingUp}
                color={
                  finalData.s1 < 0 ? 'text-red-500' : 'text-orange-400'
                }
                subtext={
                  showRealValue ? 'Adjusted for Inflation' : 'Nominal Value'
                }
              />
              <Card
                title="Worst Case Status"
                value={
                  worstCase.isBankrupt
                    ? '💀 In Debt'
                    : worstCase.difference < 0
                      ? '⚠️ Loss'
                      : '✅ S1 Wins'
                }
                icon={AlertTriangle}
                color={
                  worstCase.isBankrupt
                    ? 'text-red-600'
                    : worstCase.difference < 0
                      ? 'text-yellow-400'
                      : 'text-green-400'
                }
                subtext={
                  worstCase.difference < 0
                    ? `Max Loss: ${formatMoney(Math.abs(worstCase.difference))}`
                    : 'No major loss recorded'
                }
              />
            </div>

            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    Portfolio Value Over Time
                  </h2>
                  <div className="flex flex-wrap gap-4 text-xs mt-2">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-orange-400 rounded-full" />
                      <span>Bitcoin Only</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-400 rounded-full" />
                      <span>Bitcoin + Insurance</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-1 border-t-2 border-dashed border-red-500" />
                      <span className="text-gray-400">
                        Coverage Limit ({selectedPlan}M)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-700">
                  <button
                    type="button"
                    onClick={() => setChartView('accumulation')}
                    className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-md transition ${chartView === 'accumulation' ? 'bg-gray-700 text-white font-semibold' : 'text-gray-400 hover:text-white'}`}
                  >
                    <Search size={14} /> ซูมช่วงวัยทำงาน
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartView('lifetime')}
                    className={`px-3 py-1.5 text-xs rounded-md transition ${chartView === 'lifetime' ? 'bg-gray-700 text-white font-semibold' : 'text-gray-400 hover:text-white'}`}
                  >
                    ตลอดชีพ
                  </button>
                </div>
              </div>

              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={displayChartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="age" stroke="#9CA3AF" />
                    <YAxis
                      stroke="#9CA3AF"
                      width={65}
                      tickFormatter={(val) => {
                        const sign = val < 0 ? '-' : '';
                        const a = Math.abs(val);
                        if (a >= 1_000_000_000)
                          return sign + (a / 1_000_000_000).toFixed(1) + 'B';
                        if (a >= 1_000_000)
                          return sign + (a / 1_000_000).toFixed(0) + 'M';
                        return sign + (a / 1000).toFixed(0) + 'k';
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                      }}
                      formatter={(value: unknown) =>
                        formatMoney(
                          typeof value === 'number' ? value : undefined
                        )
                      }
                    />
                    <Legend />
                    <ReferenceLine
                      y={0}
                      stroke="#9CA3AF"
                      strokeWidth={2}
                    />
                    <ReferenceLine
                      y={selectedPlan * 1_000_000}
                      stroke="red"
                      strokeDasharray="3 3"
                      label={{
                        position: 'insideTopLeft',
                        value: `Limit (${selectedPlan}M)`,
                        fill: '#ef4444',
                        fontSize: 12,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="s1"
                      name="S1"
                      stroke="#FB923C"
                      strokeWidth={3}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="s2"
                      name="S2"
                      stroke="#4ADE80"
                      strokeWidth={3}
                      dot={false}
                    />
                    {medicalEvents
                      .filter(
                        (e) =>
                          chartView === 'lifetime' || e.age <= retirementAge
                      )
                      .map((e) => (
                        <ReferenceArea
                          key={e.id}
                          x1={e.age}
                          x2={e.age + 0.5}
                          stroke="red"
                          strokeOpacity={0.3}
                          fill="red"
                          fillOpacity={0.1}
                        />
                      ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-bold">Detailed Breakdown</h2>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Info size={14} /> ชี้ที่ตัวเลขพอร์ตเพื่อดูวิธีคำนวณ
                </span>
              </div>
              <div className="overflow-x-auto max-h-[400px]">
                <table className="w-full text-sm text-left text-gray-300">
                  <thead className="text-xs text-gray-400 uppercase bg-gray-900 sticky top-0 z-20">
                    <tr>
                      <th className="px-6 py-3">Age</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-orange-400">
                        S1 Portfolio
                      </th>
                      <th className="px-6 py-3 text-green-400">
                        S2 Portfolio
                      </th>
                      <th className="px-6 py-3">Medical Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((row) => {
                      let s1Tooltip = `[วิธีคิด S1 อายุ ${row.age}]\nเงินปีก่อน (รวมเงินต้น): ${formatDetail(row.rawS1_prev)}\n+ ดอกเบี้ยปีนี้: ${formatDetail(row.s1_growth_amt)}\n+ เติมเงินออม: ${formatDetail(row.annualSavings)}\n- จ่ายค่าหมอ: ${formatDetail(row.medicalCost)}\n= ยอดสุทธิ (Nominal): ${formatDetail(row.rawS1)}`;
                      if (showRealValue && row.age > startAge) {
                        s1Tooltip += `\n\n[ปรับเงินเฟ้อ (Real Value)]\nยอดสุทธิ: ${formatDetail(row.rawS1)}\n÷ อัตราเงินเฟ้อสะสม: ${row.discountFactor.toFixed(2)}\n= มูลค่าจริง: ${formatDetail(row.s1)}`;
                      } else if (showRealValue && row.age === startAge) {
                        s1Tooltip += `\n\n[ปรับเงินเฟ้อ (Real Value)]\nปีแรกยังไม่คิดเงินเฟ้อสะสม\n= มูลค่าจริง: ${formatDetail(row.s1)}`;
                      }

                      let s2Tooltip = `[วิธีคิด S2 อายุ ${row.age}]\nเงินปีก่อน (รวมเงินต้น): ${formatDetail(row.rawS2_prev)}\n+ ดอกเบี้ยปีนี้: ${formatDetail(row.s2_growth_amt)}\n+ เติมเงินออม: ${formatDetail(row.annualSavings)}\n- ค่าเบี้ยประกัน: ${formatDetail(row.premium)}\n- จ่ายค่าหมอส่วนเกิน: ${formatDetail(row.outOfPocket)}\n= ยอดสุทธิ (Nominal): ${formatDetail(row.rawS2)}`;
                      if (showRealValue && row.age > startAge) {
                        s2Tooltip += `\n\n[ปรับเงินเฟ้อ (Real Value)]\nยอดสุทธิ: ${formatDetail(row.rawS2)}\n÷ อัตราเงินเฟ้อสะสม: ${row.discountFactor.toFixed(2)}\n= มูลค่าจริง: ${formatDetail(row.s2)}`;
                      } else if (showRealValue && row.age === startAge) {
                        s2Tooltip += `\n\n[ปรับเงินเฟ้อ (Real Value)]\nปีแรกยังไม่คิดเงินเฟ้อสะสม\n= มูลค่าจริง: ${formatDetail(row.s2)}`;
                      }

                      return (
                        <tr
                          key={row.age}
                          className={`border-b border-gray-700 ${row.isSick ? 'bg-red-900/20' : 'hover:bg-gray-700/50'}`}
                        >
                          <td className="px-6 py-4 font-bold">{row.age}</td>
                          <td className="px-6 py-4">
                            {row.isRetired ? (
                              <span className="text-xs text-gray-500 border border-gray-600 px-1 rounded">
                                Retired
                              </span>
                            ) : (
                              <span className="text-xs text-blue-400 border border-blue-900 px-1 rounded">
                                Saving
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 cursor-help" title={s1Tooltip}>
                            <div className="flex items-center gap-2 border-b border-transparent hover:border-orange-500 w-max">
                              <span
                                className={
                                  row.s1 < 0 ? 'text-red-500 font-bold' : ''
                                }
                              >
                                {formatMoney(row.s1)}
                              </span>
                              {row.s1 < 0 && (
                                <span className="text-[10px] bg-red-600 text-white px-1 rounded">
                                  DEBT
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 cursor-help" title={s2Tooltip}>
                            <div className="flex items-center gap-2 border-b border-transparent hover:border-green-500 w-max">
                              <span
                                className={
                                  row.s2 < 0 ? 'text-red-500 font-bold' : ''
                                }
                              >
                                {formatMoney(row.s2)}
                              </span>
                              {row.s2 < 0 && (
                                <span className="text-[10px] bg-red-600 text-white px-1 rounded">
                                  DEBT
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-red-400 font-medium">
                            {row.medicalCost > 0
                              ? formatMoney(row.medicalCost)
                              : '-'}
                            {row.outOfPocket > 0 && (
                              <div className="text-xs text-red-500 mt-1">
                                (S2 Pay: {formatMoney(row.outOfPocket)})
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
