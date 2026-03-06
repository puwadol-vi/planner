'use client';

import { useState, useMemo } from 'react';
import {
  TrendingUp,
  History,
  ShieldCheck,
  AlertCircle,
  Wallet,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';

const DATA_KEY_NOMINAL = 'ตัวเลขเงินในบัญชี';
const DATA_KEY_REAL = 'มูลค่าจริง (อำนาจซื้อ)';
const DATA_KEY_INVEST_NOMINAL = 'ตัวเลขพอร์ต (ยังไม่หักเงินเฟ้อ)';
const DATA_KEY_INVEST = 'เก็บในสินทรัพย์เก็บมูลค่า (อำนาจซื้อ)';

type ChartPoint = {
  year: string;
  [DATA_KEY_NOMINAL]: number;
  [DATA_KEY_REAL]: number;
  [DATA_KEY_INVEST_NOMINAL]: number;
  [DATA_KEY_INVEST]: number;
};

export default function PurchasingPowerPage() {
  const [currentSavings, setCurrentSavings] = useState(1_000_000);
  const [monthlySavings, setMonthlySavings] = useState(5_000);
  const [inflationRate, setInflationRate] = useState(3);
  const [investmentReturn, setInvestmentReturn] = useState(5);
  const [showSolution, setShowSolution] = useState(false);

  const pastValue = useMemo(() => {
    return Math.round(
      currentSavings * Math.pow(1 + inflationRate / 100, 5)
    );
  }, [currentSavings, inflationRate]);

  const chartData = useMemo<ChartPoint[]>(() => {
    const data: ChartPoint[] = [];

    for (let year = -5; year < 0; year++) {
      const realValue =
        currentSavings / Math.pow(1 + inflationRate / 100, year);
      data.push({
        year: `ย้อนหลัง ${Math.abs(year)} ปี`,
        [DATA_KEY_NOMINAL]: Math.round(currentSavings),
        [DATA_KEY_REAL]: Math.round(realValue),
        [DATA_KEY_INVEST_NOMINAL]: Math.round(currentSavings),
        [DATA_KEY_INVEST]: Math.round(realValue),
      });
    }

    let nominal = currentSavings;
    let invested = currentSavings;

    for (let year = 0; year <= 20; year++) {
      if (year > 0) {
        nominal += monthlySavings * 12;
        invested =
          (invested + monthlySavings * 12) *
          (1 + investmentReturn / 100);
      }

      const realValue =
        nominal / Math.pow(1 + inflationRate / 100, year);
      const realInvestedValue =
        invested / Math.pow(1 + inflationRate / 100, year);

      data.push({
        year: year === 0 ? 'ปัจจุบัน' : `ปีที่ ${year}`,
        [DATA_KEY_NOMINAL]: Math.round(nominal),
        [DATA_KEY_REAL]: Math.round(realValue),
        [DATA_KEY_INVEST_NOMINAL]: Math.round(invested),
        [DATA_KEY_INVEST]: Math.round(realInvestedValue),
      });
    }
    return data;
  }, [
    currentSavings,
    monthlySavings,
    inflationRate,
    investmentReturn,
  ]);

  const formatMoney = (value: number) =>
    new Intl.NumberFormat('th-TH').format(value);

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; dataKey: string; color: string }>;
    label?: string;
  }) => {
    if (!active || !payload || payload.length < 2) return null;
    const nominal =
      payload.find((p: { dataKey: string }) => p.dataKey === DATA_KEY_NOMINAL)?.value ?? 0;
    const real =
      payload.find((p: { dataKey: string }) => p.dataKey === DATA_KEY_REAL)?.value ?? 0;

    return (
      <div className="bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700">
        <p className="font-bold text-slate-200 mb-2">{label}</p>
        {payload.map((entry: { name: string; value: number; color: string }, index: number) => (
          <div
            key={index}
            className="flex items-center gap-2 text-sm mb-1"
          >
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-400">{entry.name}:</span>
            <span className="font-bold text-white">
              {formatMoney(Number(entry.value))} บาท
            </span>
          </div>
        ))}
        <div className="mt-3 pt-2 border-t border-slate-700 text-sm">
          {nominal < real ? (
            <span className="text-emerald-400 font-medium">
              มูลค่าในอดีตสูงกว่าปัจจุบัน: +
              {formatMoney(Number(real) - Number(nominal))} บาท
            </span>
          ) : (
            <span className="text-rose-400 font-medium">
              เงินเฟ้อขโมยไป: {formatMoney(Number(nominal) - Number(real))}{' '}
              บาท
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-8 font-sans text-slate-300">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2 mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            The Silent Thief of{' '}
            <span className="text-rose-500">Purchasing Power</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            ตัวเลขในสมุดบัญชีอาจจะเพิ่มขึ้นทุกวัน
            แต่มูลค่าที่แท้จริงกำลังหายไป...
            เรามาดูกันว่าเงินของคุณมีค่าลดลงแค่ไหน?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-blue-400" />
                ข้อมูลเงินของคุณ
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="flex justify-between text-sm font-medium text-slate-300 mb-2">
                    <span>เงินเก็บสะสมปัจจุบัน</span>
                    <span className="text-blue-400 font-bold">
                      {formatMoney(currentSavings)} บาท
                    </span>
                  </label>
                  <input
                    type="range"
                    min={10000}
                    max={10000000}
                    step={10000}
                    value={currentSavings}
                    onChange={(e) =>
                      setCurrentSavings(Number(e.target.value))
                    }
                    className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div>
                  <label className="flex justify-between text-sm font-medium text-slate-300 mb-2">
                    <span>เก็บเพิ่มต่อเดือน</span>
                    <span className="text-emerald-400 font-bold">
                      {formatMoney(monthlySavings)} บาท
                    </span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100000}
                    step={1000}
                    value={monthlySavings}
                    onChange={(e) =>
                      setMonthlySavings(Number(e.target.value))
                    }
                    className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <label className="flex justify-between text-sm font-medium text-slate-300 mb-2">
                    <span>อัตราเงินเฟ้อเฉลี่ย</span>
                    <span className="text-rose-500 font-bold">
                      {inflationRate}% / ปี
                    </span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={0.5}
                    value={inflationRate}
                    onChange={(e) =>
                      setInflationRate(Number(e.target.value))
                    }
                    className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-2xl border border-amber-700/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <History className="w-24 h-24 text-amber-500" />
              </div>
              <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2 mb-3">
                <History className="w-5 h-5" />
                ไทม์แมชชีนย้อนเวลา 5 ปี
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                รู้หรือไม่? เพื่อให้ซื้อของได้เท่ากับเงิน{' '}
                <span className="font-bold text-white">
                  {formatMoney(currentSavings)}
                </span>{' '}
                บาทในวันนี้...
              </p>
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700">
                <p className="text-sm text-slate-400 mb-1">
                  เมื่อ 5 ปีที่แล้ว คุณใช้เงินแค่
                </p>
                <p className="text-2xl font-black text-amber-400">
                  {formatMoney(
                    Math.round(
                      currentSavings /
                        Math.pow(1 + inflationRate / 100, 5)
                    )
                  )}{' '}
                  <span className="text-base font-normal">บาท</span>
                </p>
              </div>
              <p className="text-xs text-amber-200/80 mt-4 bg-amber-900/20 p-3 rounded-lg border border-amber-800/40">
                💡 ความหมายคือ: เงินก้อนที่คุณถืออยู่ตอนนี้ มีค่าเท่ากับคนที่มีเงิน{' '}
                <strong className="text-amber-400">
                  {formatMoney(pastValue)}
                </strong>{' '}
                บาทในยุคเมื่อ 5 ปีก่อน (อำนาจซื้อมันหดตัวลงอย่างมาก!)
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 h-[400px] flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    อนาคตของเงินคุณในอีก 20 ปี
                  </h2>
                  <p className="text-sm text-slate-400">
                    เส้นสีแดงคือมูลค่าของเงินที่สามารถนำไปซื้อของได้จริง
                  </p>
                </div>
              </div>

              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 20,
                      bottom: 0,
                    }}
                  >
                    <defs>
                      <linearGradient
                        id="colorNominal"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#60a5fa"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="#60a5fa"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorReal"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#f43f5e"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#f43f5e"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      {showSolution && (
                        <>
                          <linearGradient
                            id="colorInvestNominal"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#c084fc"
                              stopOpacity={0.2}
                            />
                            <stop
                              offset="95%"
                              stopColor="#c084fc"
                              stopOpacity={0}
                            />
                          </linearGradient>
                          <linearGradient
                            id="colorInvest"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#34d399"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="#34d399"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </>
                      )}
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#334155"
                    />
                    <XAxis
                      dataKey="year"
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      tickMargin={10}
                      minTickGap={20}
                    />
                    <YAxis
                      tickFormatter={(value) =>
                        `${(value / 1_000_000).toFixed(1)}M`
                      }
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      width={60}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{
                        fontSize: '14px',
                        paddingTop: '10px',
                        color: '#cbd5e1',
                      }}
                    />
                    <ReferenceLine
                      x="ปัจจุบัน"
                      stroke="#64748b"
                      strokeDasharray="3 3"
                      label={{
                        position: 'insideTopLeft',
                        value: 'วันนี้',
                        fill: '#94a3b8',
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey={DATA_KEY_NOMINAL}
                      stroke="#60a5fa"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorNominal)"
                    />
                    <Area
                      type="monotone"
                      dataKey={DATA_KEY_REAL}
                      stroke="#f43f5e"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorReal)"
                    />
                    {showSolution && (
                      <>
                        <Area
                          type="monotone"
                          dataKey={DATA_KEY_INVEST_NOMINAL}
                          stroke="#c084fc"
                          strokeWidth={2}
                          strokeDasharray="4 4"
                          fillOpacity={1}
                          fill="url(#colorInvestNominal)"
                        />
                        <Area
                          type="monotone"
                          dataKey={DATA_KEY_INVEST}
                          stroke="#34d399"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorInvest)"
                        />
                      </>
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div
              role={showSolution ? undefined : 'button'}
              tabIndex={showSolution ? undefined : 0}
              onKeyDown={
                showSolution
                  ? undefined
                  : (e) => {
                      if (
                        e.key === 'Enter' ||
                        e.key === ' '
                      ) {
                        e.preventDefault();
                        setShowSolution(true);
                      }
                    }
              }
              className={`p-6 rounded-2xl transition-all duration-300 border ${
                showSolution
                  ? 'bg-slate-800 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.08)]'
                  : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 cursor-pointer'
              }`}
              onClick={() =>
                !showSolution && setShowSolution(true)
              }
            >
              {!showSolution ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-700 p-2 rounded-full border border-slate-600">
                      <ShieldCheck className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">
                        ไม่อยากให้เงินด้อยค่าลงทำยังไงดี?
                      </h3>
                      <p className="text-sm text-slate-400">
                        คลิกเพื่อดูทางแก้ปัญหา (The Solution)
                      </p>
                    </div>
                  </div>
                  <span className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg shadow-sm transition-colors">
                    ดูทางรอด
                  </span>
                </div>
              ) : (
                <div className="space-y-4 opacity-100 transition-opacity">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-emerald-900/40 p-2 rounded-full text-emerald-400 border border-emerald-700/50">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-emerald-400">
                        ทางรอด: เปลี่ยนที่เก็บรักษามูลค่า
                      </h3>
                      <p className="text-sm text-emerald-200/80">
                        ถ้าเก็บเงินในสินทรัพย์ที่เก็บมูลค่าได้
                      </p>
                    </div>
                  </div>

                  <div
                    className="bg-slate-900/80 p-5 rounded-xl border border-slate-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <label className="flex justify-between text-sm font-medium text-slate-300 mb-2">
                      <span>สินทรัพย์มูลค่าเติบโต</span>
                      <span className="text-emerald-400 font-bold">
                        {investmentReturn}% / ปี
                      </span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={20}
                      step={1}
                      value={investmentReturn}
                      onChange={(e) =>
                        setInvestmentReturn(
                          Number(e.target.value)
                        )
                      }
                      className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <p className="text-xs text-slate-400 mt-3 flex items-center gap-1 flex-wrap">
                      <AlertCircle className="w-3 h-3 text-slate-500 shrink-0" />
                      ลองเลื่อนให้{' '}
                      <span className="text-emerald-400 mx-1">
                        สินทรัพย์มูลค่าเติบโต ({investmentReturn}%)
                      </span>{' '}
                      มากกว่า{' '}
                      <span className="text-rose-400 mx-1">
                        เงินเฟ้อ ({inflationRate}%)
                      </span>{' '}
                      แล้วดูเส้นสีเขียวสิครับ!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
