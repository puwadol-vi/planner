'use client'

import React, { useState, useMemo } from 'react';
import {
  Settings,
  ShieldAlert,
  Target,
  Zap,
  Lightbulb,
  Percent,
} from 'lucide-react';

const App = () => {
  // --- Inputs State ---
  const [initialPrincipal, setInitialPrincipal] = useState(0); 
  const [monthlySaving, setMonthlySaving] = useState(10000); 
  const [btcGrowth, setBtcGrowth] = useState(20); 
  const [investProfitRate, setInvestProfitRate] = useState(10); 
  const [investLossRate, setInvestLossRate] = useState(10); 
  const [threshold, setThreshold] = useState(12000000); 
  const [yearsToProject, setYearsToProject] = useState(25);

  const annualSaving = monthlySaving * 12;

  // --- Recommendation Logic ---
  // แนะนำที่ 100 เท่าของเงินออมรายปี เพื่อให้กำไร 10% = เงินออม 1 ปี
  const recommendedThreshold = annualSaving * 100;

  // คำนวณ % ผลกระทบต่อพอร์ตหลัก (Risk Impact on Total Wealth)
  const impactOnTotalWealth = (investLossRate * 0.1).toFixed(2);

  // --- Calculation Logic ---
  const tableData = useMemo(() => {
    const data: Array<{
      year: number;
      wealth: number;
      unitInvest: number;
      profit: number;
      loss: number;
      lossRatio: number;
    }> = [];
    let currentWealth = initialPrincipal;
    let prevProfit = 0;

    for (let i = 1; i <= yearsToProject; i++) {
      currentWealth = (currentWealth + annualSaving + prevProfit) * (1 + (btcGrowth / 100));
      const isAboveThreshold = currentWealth >= threshold;
      const unitInvestment = isAboveThreshold ? currentWealth * 0.10 : 0;
      const profit = isAboveThreshold ? unitInvestment * (investProfitRate / 100) : 0;
      const loss = isAboveThreshold ? unitInvestment * (investLossRate / 100) : 0;
      const lossToWealthRatio = currentWealth > 0 ? (loss / currentWealth) * 100 : 0;
      
      prevProfit = profit;

      data.push({
        year: i,
        wealth: currentWealth,
        unitInvest: unitInvestment,
        profit: profit,
        loss: loss,
        lossRatio: lossToWealthRatio
      });
    }
    return data;
  }, [initialPrincipal, annualSaving, btcGrowth, investProfitRate, investLossRate, threshold, yearsToProject]);

  const formatNum = (num: number) =>
    new Intl.NumberFormat('th-TH', { maximumFractionDigits: 0 }).format(num);
  const formatDec = (num: number) =>
    new Intl.NumberFormat('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <Zap className="text-blue-600 w-8 h-8 fill-blue-600" />
              Strategic Investment Entry Growth Roadmap
            </h1>
            <p className="text-slate-500 text-sm mt-1 uppercase tracking-wider font-bold">แผนที่บริหารความมั่งคั่งและประเมินความเสี่ยง</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 shadow-sm">
              <span className="text-blue-600 text-[10px] font-black block uppercase tracking-tighter mb-1">เงินออมทั้งปี (แรงเรา)</span>
              <span className="text-2xl font-bold text-blue-700">฿ {formatNum(annualSaving)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Inputs Section */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
               <div className="absolute top-0 right-0 p-4">
                  <Settings className="w-10 h-10 text-slate-50 opacity-10" />
               </div>
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                Configurations
              </h2>
              
              <div className="space-y-4 relative z-10">
                <InputBox label="เงินต้นสะสม" value={initialPrincipal} onChange={setInitialPrincipal} unit="บาท" />
                <InputBox label="เงินออมเพิ่มต่อเดือน" value={monthlySaving} onChange={setMonthlySaving} unit="บาท" />
                <InputBox label="BTC โตเฉลี่ยต่อปี (%)" value={btcGrowth} onChange={setBtcGrowth} unit="%" color="text-orange-600" />
                <InputBox label="กำไรจากการลงทุน (%)" value={investProfitRate} onChange={setInvestProfitRate} unit="%" color="text-green-600" />
                <InputBox label="ขาดทุนการลงทุน (%)" value={investLossRate} onChange={setInvestLossRate} unit="%" color="text-red-600" />
                <InputBox label="จำนวนปีที่คำนวณ" value={yearsToProject} onChange={setYearsToProject} unit="ปี" />
                <div className="pt-2 border-t border-slate-50">
                   <InputBox 
                     label="เริ่มแบ่งหน่วยลงทุนเมื่อสะสมเงินถึง" 
                     value={threshold} 
                     onChange={setThreshold} 
                     unit="บาท" 
                     highlight={true}
                   />
                   <button 
                     onClick={() => setThreshold(recommendedThreshold)}
                     className="mt-2 text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md hover:bg-blue-100 transition-colors w-full flex items-center justify-center gap-1 shadow-sm"
                   >
                     <Lightbulb className="w-3 h-3" /> ใช้เลขแนะนำ: ฿{formatNum(recommendedThreshold)}
                   </button>
                </div>
              </div>
            </div>

            <div className="bg-indigo-900 p-6 rounded-2xl text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Target className="w-24 h-24" />
              </div>
              <h3 className="text-[10px] font-black text-indigo-300 mb-3 uppercase flex items-center gap-2">
                <Target className="w-4 h-4" /> Strategy Insight
              </h3>
              <div className="space-y-3 relative z-10">
                <p className="text-sm text-indigo-50 leading-relaxed font-medium">
                  แนะนำให้เริ่มที่ <span className="text-orange-300 font-bold underline underline-offset-4 tracking-wide">{formatNum(recommendedThreshold)} บาท</span>
                </p>
                <div className="bg-indigo-800/50 p-3 rounded-xl border border-indigo-700/50">
                  <p className="text-[11px] text-indigo-100 leading-relaxed italic">
                    &quot;เพราะถ้าคุณเอากำไรได้ {investProfitRate}% จากหน่วยลงทุน คุณจะได้เงินเท่ากับ <span className="text-white font-bold tracking-wide text-xs">เงินออมทั้งปี</span> พอดี&quot;
                  </p>
                </div>
                <div className="bg-red-900/30 p-3 rounded-xl border border-red-700/30">
                  <p className="text-[11px] text-red-100 leading-relaxed font-medium">
                    &quot;และถ้าพลาดขาดทุน {investLossRate}% ของหน่วยลงทุน มันจะกระทบพอร์ตหลักเพียง <span className="text-white font-bold underline underline-offset-2">{impactOnTotalWealth}% เท่านั้น</span> ครับ&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="p-4 text-[10px] font-black text-slate-400 text-center uppercase tracking-tighter">ปีที่</th>
                      <th className="p-4 text-[10px] font-black text-slate-700 uppercase bg-blue-50/50 tracking-tighter">เงินสะสม</th>
                      <th className="p-4 text-[10px] font-black text-slate-700 uppercase tracking-tighter">ลงทุน 10% จากเงินสะสม</th>
                      <th className="p-4 text-[10px] font-black text-green-600 uppercase tracking-tighter">กำไรจากการลงทุน</th>
                      <th className="p-4 text-[10px] font-black text-red-500 uppercase tracking-tighter">ขาดทุน</th>
                      <th className="p-4 text-[10px] font-black text-indigo-600 uppercase tracking-tighter">ขาดทุนเป็นกี่ % ของเงินสะสม</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row) => (
                      <tr key={row.year} className={`border-b border-slate-50 hover:bg-indigo-50/20 transition-colors ${row.unitInvest > 0 ? 'bg-blue-50/5' : ''}`}>
                        <td className="p-4 text-center text-slate-400 font-bold text-xs">{row.year}</td>
                        <td className="p-4 font-black text-blue-800 text-sm">฿ {formatNum(row.wealth)}</td>
                        <td className={`p-4 font-bold text-xs ${row.unitInvest > 0 ? 'text-slate-900' : 'text-slate-200'}`}>
                          {row.unitInvest > 0 ? `฿ ${formatNum(row.unitInvest)}` : '0.00'}
                        </td>
                        <td className={`p-4 font-black text-xs ${row.profit > 0 ? 'text-green-600' : 'text-slate-200'}`}>
                          {row.profit > 0 ? `+ ฿ ${formatNum(row.profit)}` : '0.00'}
                        </td>
                        <td className={`p-4 font-bold text-xs ${row.loss > 0 ? 'text-red-500' : 'text-slate-200'}`}>
                          {row.loss > 0 ? `- ฿ ${formatNum(row.loss)}` : '0.00'}
                        </td>
                        <td className={`p-4 font-black text-sm ${row.lossRatio > 0 ? 'text-indigo-600' : 'text-slate-200'}`}>
                          {row.lossRatio > 0 ? (
                            <div className="flex items-center gap-1">
                              <ShieldAlert className="w-3 h-3" />
                              {formatDec(row.lossRatio)}%
                            </div>
                          ) : '0.00%'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 border-dashed">
              <Percent className="text-indigo-500 w-5 h-5 shrink-0" />
              <p className="text-xs text-indigo-800 leading-snug font-medium">
                <strong>Risk Management Note:</strong> คอลัมน์ &quot;ขาดทุนเป็นกี่ % ของเงินสะสม&quot; ช่วยให้เห็นว่าแม้หน่วยลงทุนจะผิดพลาด แต่พอร์ตหลัก (ทัพหลวง) ของคุณยังคงมีเสถียรภาพอยู่หรือไม่ การคุมตัวเลขนี้ไม่ให้สูงเกินไปคือหัวใจของการอยู่รอดในระยะยาวครับ
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- Sub-component สำหรับ Input ---
interface InputBoxProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  unit: string;
  color?: string;
  highlight?: boolean;
}

const InputBox = ({
  label,
  value,
  onChange,
  unit,
  color = 'text-slate-900',
  highlight = false,
}: InputBoxProps) => (
  <div className="space-y-1">
    <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block tracking-tighter">
      {label}
    </label>
    <div className={`relative group ${highlight ? 'ring-2 ring-blue-500/20 rounded-xl' : ''}`}>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-black focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all ${color}`}
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300 group-focus-within:text-blue-400 transition-colors uppercase">
        {unit}
      </span>
    </div>
  </div>
);

export default App;