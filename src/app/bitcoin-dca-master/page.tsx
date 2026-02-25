'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  Wallet,
  Coins,
  CalendarDays,
  LineChart,
  Info,
  Loader2,
  Calculator,
  Clock,
} from 'lucide-react';

const USD_TO_THB_RATE = 32;

type ViewMode = 'daily' | 'weekly' | 'monthly';

interface SummaryItem {
  savingPerPeriod: number;
  freqName: string;
  totalPeriods: number;
  totalCost: number;
  totalBtc: number;
  currentValue: number;
  profit: number;
  growth: number;
  history: Array<{ date: string; price: number; btc: number }>;
  startDate: string;
  actualDays: number;
}

interface AppData {
  daily: SummaryItem;
  weekly: SummaryItem;
  monthly: SummaryItem;
  chartData: Array<{
    date: string;
    dailyValue: number;
    weeklyValue: number;
    monthlyValue: number;
  }>;
}

export default function BitcoinDcaMasterPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [allRawPrices, setAllRawPrices] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [years, setYears] = useState(5);
  const [dailySaving, setDailySaving] = useState(100);
  const [weeklySaving, setWeeklySaving] = useState(1000);
  const [monthlySaving, setMonthlySaving] = useState(5000);

  useEffect(() => {
    const fetchBitcoinData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          'https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&allData=true'
        );
        if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลจาก Server ได้');
        const json = await response.json();
        if (json.Response === 'Error') throw new Error(json.Message);

        const prices: [number, number][] = json.Data.Data.map(
          (day: { time: number; close: number }) => [
            day.time * 1000,
            day.close * USD_TO_THB_RATE,
          ]
        );
        setAllRawPrices(prices);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchBitcoinData();
  }, []);

  const appData = useMemo<AppData | null>(() => {
    if (allRawPrices.length === 0) return null;

    const daysLimit = years * 365;
    const rawPrices = allRawPrices.slice(-daysLimit);

    const dailyAmt = Number(dailySaving) || 0;
    const weeklyAmt = Number(weeklySaving) || 0;
    const monthlyAmt = Number(monthlySaving) || 0;

    let dailyBtc = 0,
      weeklyBtc = 0,
      monthlyBtc = 0;
    let dailyCost = 0,
      weeklyCost = 0,
      monthlyCost = 0;

    const historyDaily: SummaryItem['history'] = [];
    const historyWeekly: SummaryItem['history'] = [];
    const historyMonthly: SummaryItem['history'] = [];
    const chartData: AppData['chartData'] = [];

    let lastMonth = -1;
    const latestPrice = rawPrices[rawPrices.length - 1][1];

    rawPrices.forEach((dayData, index) => {
      const date = new Date(dayData[0]);
      const price = dayData[1];
      const dateStr = date.toLocaleDateString('th-TH', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      if (price <= 0) return;

      if (dailyAmt > 0) {
        dailyBtc += dailyAmt / price;
        dailyCost += dailyAmt;
        historyDaily.push({ date: dateStr, price, btc: dailyAmt / price });
      }

      if (index % 7 === 0 && weeklyAmt > 0) {
        weeklyBtc += weeklyAmt / price;
        weeklyCost += weeklyAmt;
        historyWeekly.push({ date: dateStr, price, btc: weeklyAmt / price });
      }

      const currentMonth = date.getMonth();
      if (currentMonth !== lastMonth) {
        if (monthlyAmt > 0) {
          monthlyBtc += monthlyAmt / price;
          monthlyCost += monthlyAmt;
          historyMonthly.push({
            date: dateStr,
            price,
            btc: monthlyAmt / price,
          });
        }
        lastMonth = currentMonth;
      }

      if (index % 10 === 0 || index === rawPrices.length - 1) {
        chartData.push({
          date: dateStr,
          dailyValue: dailyBtc * price,
          weeklyValue: weeklyBtc * price,
          monthlyValue: monthlyBtc * price,
        });
      }
    });

    const createSummary = (
      cost: number,
      btc: number,
      freqName: string,
      history: SummaryItem['history'],
      savingAmt: number
    ): SummaryItem => {
      const currentValue = btc * latestPrice;
      const profit = currentValue - cost;
      const growth = cost > 0 ? (profit / cost) * 100 : 0;
      return {
        savingPerPeriod: savingAmt,
        freqName,
        totalPeriods: history.length,
        totalCost: cost,
        totalBtc: btc,
        currentValue,
        profit,
        growth,
        history: [...history].reverse(),
        startDate: new Date(rawPrices[0][0]).toLocaleDateString('th-TH', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        actualDays: rawPrices.length,
      };
    };

    return {
      daily: createSummary(
        dailyCost,
        dailyBtc,
        'วัน',
        historyDaily,
        dailyAmt
      ),
      weekly: createSummary(
        weeklyCost,
        weeklyBtc,
        'สัปดาห์',
        historyWeekly,
        weeklyAmt
      ),
      monthly: createSummary(
        monthlyCost,
        monthlyBtc,
        'เดือน',
        historyMonthly,
        monthlyAmt
      ),
      chartData,
    };
  }, [allRawPrices, years, dailySaving, weeklySaving, monthlySaving]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-slate-300 gap-4">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
        <p className="text-lg font-medium animate-pulse">
          กำลังซิงค์ประวัติราคา Bitcoin แบบจัดเต็ม...
        </p>
      </div>
    );
  }

  if (error || !appData) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-red-400 p-8">
        <p>เกิดข้อผิดพลาด: {error ?? 'ไม่มีข้อมูล'}</p>
      </div>
    );
  }

  const currentData = appData[viewMode];

  const renderCompareChart = () => {
    const data = appData.chartData;
    const width = 800;
    const height = 280;
    const padding = 20;
    const maxVal = Math.max(
      1,
      ...data.map((d) =>
        Math.max(d.dailyValue, d.weeklyValue, d.monthlyValue)
      )
    );

    const createPath = (
      key: 'dailyValue' | 'weeklyValue' | 'monthlyValue'
    ) =>
      data
        .map((d, i) => {
          const x =
            padding + (i / (data.length - 1)) * (width - padding * 2);
          const y =
            height - padding - (d[key] / maxVal) * (height - padding * 2);
          return `${x},${y}`;
        })
        .join(' L ');

    return (
      <div className="w-full bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <LineChart className="w-5 h-5 text-cyan-400" />
              เปรียบเทียบมูลค่าพอร์ต
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              เปรียบเทียบการเติบโตจากงบประมาณของ 3 สไตล์ ในช่วงเวลา {years}{' '}
              ปีที่ผ่านมา
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 text-sm font-medium bg-slate-900 p-3 rounded-xl border border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-slate-300">
                รายวัน {formatCurrency(appData.daily.currentValue)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-slate-300">
                สัปดาห์ {formatCurrency(appData.weekly.currentValue)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-300">
                เดือน {formatCurrency(appData.monthly.currentValue)}
              </span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto min-w-[600px] mt-4"
          >
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <line
                key={ratio}
                x1={padding}
                y1={padding + ratio * (height - padding * 2)}
                x2={width - padding}
                y2={padding + ratio * (height - padding * 2)}
                stroke="#334155"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            ))}
            <path
              d={`M ${createPath('monthlyValue')}`}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={`M ${createPath('weeklyValue')}`}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={`M ${createPath('dailyValue')}`}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans pb-20">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-4 border-b border-slate-700">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
              <Coins className="w-9 h-9 md:w-10 md:h-10 text-amber-500" />
              Bitcoin DCA Master
            </h1>
            <p className="text-slate-400 mt-2 text-sm md:text-base flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              ประมวลผลตามจริง เริ่มตั้งแต่วันที่ {appData.daily.startDate} (รวม{' '}
              {new Intl.NumberFormat('th-TH').format(appData.daily.actualDays)}{' '}
              วัน)
            </p>
          </div>
          <div className="flex items-center gap-3 bg-slate-800 p-1.5 rounded-xl border border-slate-700 w-full md:w-auto">
            <Clock className="w-5 h-5 text-slate-400 ml-2" />
            <span className="text-sm font-medium text-slate-300 mr-2">
              ย้อนหลัง:
            </span>
            <button
              type="button"
              onClick={() => setYears(5)}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                years === 5
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              5 ปี
            </button>
            <button
              type="button"
              onClick={() => setYears(10)}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                years === 10
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              10 ปี
            </button>
          </div>
        </header>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 md:p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-5">
            <Calculator className="w-6 h-6 text-cyan-400" />
            <h2 className="text-lg font-semibold text-white">
              ตั้งค่างบประมาณ (เปลี่ยนตัวเลขเพื่อเปรียบเทียบ)
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 focus-within:border-cyan-500/50 transition-colors">
              <label className="text-sm text-slate-400 font-medium mb-2 flex justify-between items-center">
                <span>งบลงทุนรายวัน</span>
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                  ทุกวัน
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                  ฿
                </span>
                <input
                  type="number"
                  value={dailySaving}
                  onChange={(e) =>
                    setDailySaving(Number(e.target.value) || 0)
                  }
                  className="w-full bg-transparent text-white pl-8 pr-4 py-2 focus:outline-none font-mono text-lg border-0 focus:ring-0"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 focus-within:border-amber-500/50 transition-colors">
              <label className="text-sm text-slate-400 font-medium mb-2 flex justify-between items-center">
                <span>งบลงทุนรายสัปดาห์</span>
                <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">
                  ทุก 7 วัน
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                  ฿
                </span>
                <input
                  type="number"
                  value={weeklySaving}
                  onChange={(e) =>
                    setWeeklySaving(Number(e.target.value) || 0)
                  }
                  className="w-full bg-transparent text-white pl-8 pr-4 py-2 focus:outline-none font-mono text-lg border-0 focus:ring-0"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 focus-within:border-emerald-500/50 transition-colors">
              <label className="text-sm text-slate-400 font-medium mb-2 flex justify-between items-center">
                <span>งบลงทุนรายเดือน</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                  วันแรกของเดือน
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                  ฿
                </span>
                <input
                  type="number"
                  value={monthlySaving}
                  onChange={(e) =>
                    setMonthlySaving(Number(e.target.value) || 0)
                  }
                  className="w-full bg-transparent text-white pl-8 pr-4 py-2 focus:outline-none font-mono text-lg border-0 focus:ring-0"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        {renderCompareChart()}

        <div className="pt-6 border-t border-slate-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-white">
              เจาะลึกสถิติรายวิธี (Deep Dive)
            </h2>
            <div className="flex bg-slate-800 p-1.5 rounded-xl border border-slate-700 w-full sm:w-auto">
              {(['daily', 'weekly', 'monthly'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  className={`flex-1 sm:flex-none px-4 md:px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === mode
                      ? 'bg-slate-700 text-white border border-slate-600'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {mode === 'daily'
                    ? 'ดูโหมดรายวัน'
                    : mode === 'weekly'
                      ? 'ดูโหมดรายสัปดาห์'
                      : 'ดูโหมดรายเดือน'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center gap-3 text-slate-400 mb-2">
                <CalendarDays className="w-5 h-5" />
                <h3 className="text-sm font-medium">จำนวนครั้งที่เข้าซื้อ</h3>
              </div>
              <p className="text-3xl font-bold text-white">
                {new Intl.NumberFormat('th-TH').format(currentData.totalPeriods)}{' '}
                <span className="text-lg font-normal text-slate-500">ครั้ง</span>
              </p>
              <p className="text-xs text-slate-500 mt-2">
                ตกครั้งละ {formatCurrency(currentData.savingPerPeriod)}
              </p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center gap-3 text-slate-400 mb-2">
                <Wallet className="w-5 h-5" />
                <h3 className="text-sm font-medium">ต้นทุนที่ใช้ไปจริง</h3>
              </div>
              <p className="text-3xl font-bold text-white">
                {formatCurrency(currentData.totalCost)}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                เงินต้นทั้งหมดที่หยอดปุก
              </p>
            </div>
            <div className="bg-slate-800 border border-amber-500/30 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-10 pointer-events-none">
                <Coins className="w-32 h-32 text-amber-400" />
              </div>
              <div className="flex items-center gap-3 text-amber-400 mb-2 relative z-10">
                <Coins className="w-5 h-5" />
                <h3 className="text-sm font-medium">จำนวน BTC ที่เก็บได้</h3>
              </div>
              <p className="text-3xl font-bold text-white relative z-10">
                {currentData.totalBtc.toFixed(6)}
              </p>
              <p className="text-xs text-amber-500/80 mt-2 relative z-10">
                เหรียญที่ได้จากวิธี{currentData.freqName}
              </p>
            </div>
            <div className="bg-slate-800 border border-emerald-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 text-emerald-400 mb-2">
                <TrendingUp className="w-5 h-5" />
                <h3 className="text-sm font-medium">มูลค่าพอร์ตวิธีนี้</h3>
              </div>
              <p className="text-3xl font-bold text-emerald-300">
                {formatCurrency(currentData.currentValue)}
              </p>
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <span
                  className={`text-xs px-2.5 py-1 rounded-md font-medium border ${
                    currentData.growth >= 0
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}
                >
                  {currentData.growth >= 0 ? '+' : ''}
                  {currentData.growth.toFixed(2)}%
                </span>
                <span
                  className={`text-xs font-medium ${
                    currentData.profit >= 0
                      ? 'text-emerald-500/80'
                      : 'text-red-500/80'
                  }`}
                >
                  ({currentData.profit >= 0 ? '+' : ''}
                  {formatCurrency(currentData.profit).replace('THB', '')})
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
            <div className="p-5 border-b border-slate-700">
              <h3 className="text-base font-semibold text-white">
                ประวัติการซื้อ (จำลองแบบราย{currentData.freqName})
              </h3>
            </div>
            <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 uppercase bg-slate-900 sticky top-0 z-10 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-3 font-medium">วันที่</th>
                    <th className="px-6 py-3 font-medium text-right">
                      ราคา BTC (THB)
                    </th>
                    <th className="px-6 py-3 font-medium text-right">
                      ได้ BTC กลับมา
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {currentData.history.slice(0, 100).map((row, index) => (
                    <tr
                      key={`${row.date}-${index}`}
                      className="hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-6 py-3 text-slate-300 font-medium">
                        {row.date}
                      </td>
                      <td className="px-6 py-3 text-right font-mono text-slate-400">
                        {new Intl.NumberFormat('th-TH').format(row.price)}
                      </td>
                      <td className="px-6 py-3 text-right font-mono text-amber-400/90">
                        +{row.btc.toFixed(8)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {currentData.history.length > 100 && (
                <div className="p-3 text-center text-xs text-slate-500 bg-slate-800">
                  * กำลังแสดงข้อมูล 100 รายการล่าสุดจากทั้งหมด{' '}
                  {currentData.history.length} รายการ
                </div>
              )}
            </div>
          </div>
        </div>

        <footer className="pt-6 mt-4 pb-8 text-center flex flex-col items-center gap-2">
          <p className="text-slate-500 text-xs md:text-sm flex items-center justify-center gap-1.5">
            <Info className="w-4 h-4 opacity-70" />
            แหล่งที่มาข้อมูล: ราคาตลาดโลกอ้างอิงจาก{' '}
            <span className="text-slate-400 font-medium">
              CryptoCompare API
            </span>
          </p>
          <p className="text-slate-600 text-[10px] md:text-xs">
            (แปลงมูลค่าเป็นเงินบาทเพื่อใช้ประกอบการศึกษาเท่านั้น อิงเรทประมาณการที่
            32 THB/USD)
          </p>
        </footer>
      </div>
    </div>
  );
}
