import React, { useState, useMemo } from 'react';
import { FeeConfig, AiAdvisorInput } from '../types';
import { generateScenariosMatrix, formatCurrency } from '../utils/feeCalculator';
import { ChartColumn, Info, Sparkles } from 'lucide-react';

interface ScenariosMatrixProps {
  feeConfig: FeeConfig;
  onOpenAiAnalysis: (data: AiAdvisorInput) => void;
}

export const ScenariosMatrix: React.FC<ScenariosMatrixProps> = ({
  feeConfig,
  onOpenAiAnalysis,
}) => {
  const [currentSharesStr, setCurrentSharesStr] = useState('1000');
  const [currentAvgPriceStr, setCurrentAvgPriceStr] = useState('20.00');
  const [multiplier, setMultiplier] = useState(1);

  const currentShares = Math.max(0, parseFloat(currentSharesStr) || 0);
  const currentAvgPrice = Math.max(0, parseFloat(currentAvgPriceStr) || 0);

  const matrix = useMemo(() => {
    return generateScenariosMatrix(
      { shares: currentShares, avgPrice: currentAvgPrice },
      multiplier,
      feeConfig
    );
  }, [currentShares, currentAvgPrice, multiplier, feeConfig]);

  return (
    <div className="space-y-4">
      {/* Top Banner & Inputs */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 sm:p-5 shadow-sm space-y-3.5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400 border border-indigo-500/30 shrink-0">
              <ChartColumn className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2 uppercase tracking-wider">
                <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                مصفوفة محاكاة سيناريوهات الهبوط
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                جدول تحليلي استباقي يوضح لك كم سيرتفع/ينخفض متوسط السعر إذا هبط السهم بنسب مختلفة وقمت بالتبريد.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-[#020617] p-1.5 rounded-lg border border-slate-800 text-xs sm:text-sm">
            <span className="text-slate-300 px-1 font-semibold">مضاعف الكمية:</span>
            {[0.5, 1, 2, 3].map((m) => (
              <button
                key={m}
                onClick={() => setMultiplier(m)}
                className={`px-3 py-1 rounded font-bold transition-all cursor-pointer ${
                  multiplier === m
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {m}x
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-2xl">
          <div>
            <label className="block text-xs sm:text-sm text-slate-300 font-semibold mb-1.5">
              عدد الأسهم الحالية لديك
            </label>
            <div className="relative flex items-center">
              <input
                type="number"
                value={currentSharesStr}
                onChange={(e) => setCurrentSharesStr(e.target.value)}
                className="w-full bg-[#020617] border border-slate-800 rounded-lg pl-14 pr-3.5 py-2.5 text-sm sm:text-base text-slate-100 font-mono font-bold focus:border-indigo-500 outline-none transition-all"
              />
              <span className="absolute left-3 text-xs text-slate-400 font-mono pointer-events-none select-none">
                سهم
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm text-slate-300 font-semibold mb-1.5">
              متوسط السعر الحالي لك
            </label>
            <div className="relative flex items-center">
              <input
                type="number"
                step="0.01"
                value={currentAvgPriceStr}
                onChange={(e) => setCurrentAvgPriceStr(e.target.value)}
                className="w-full bg-[#020617] border border-slate-800 rounded-lg pl-14 pr-3.5 py-2.5 text-sm sm:text-base text-slate-100 font-mono font-bold focus:border-indigo-500 outline-none transition-all"
              />
              <span className="absolute left-3 text-xs text-slate-400 font-mono pointer-events-none select-none">
                EGP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scenarios Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs sm:text-sm text-slate-300">
            <thead className="bg-[#020617] text-slate-300 font-bold border-b border-slate-800 text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3.5 text-center">نسبة الهبوط للسهم</th>
                <th className="py-3 px-3.5">سعر السهم بالسوق</th>
                <th className="py-3 px-3.5">عدد الأسهم الشراء ({multiplier}x)</th>
                <th className="py-3 px-3.5">مبلغ الشراء الجديد</th>
                <th className="py-3 px-3.5 text-emerald-400">المتوسط الجديد المحقق</th>
                <th className="py-3 px-3.5 text-center">نسبة خفض المتوسط</th>
                <th className="py-3 px-3.5 text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-medium">
              {matrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3.5 text-center">
                    <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded font-bold text-xs font-mono">
                      -{row.dropPercent}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 font-bold font-mono text-slate-100">
                    {row.newPrice.toFixed(2)} EGP
                  </td>
                  <td className="py-2.5 px-3.5 font-mono text-slate-200">
                    {row.newShares.toLocaleString('en-US')} سهم
                  </td>
                  <td className="py-2.5 px-3.5 font-mono text-slate-200">
                    {formatCurrency(row.newGrossCost, feeConfig.currency)}
                  </td>
                  <td className="py-2.5 px-3.5 font-bold font-mono text-emerald-400 text-sm">
                    {row.newAvgPrice.toFixed(3)} EGP
                  </td>
                  <td className="py-2.5 px-3.5 text-center">
                    <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold text-xs font-mono">
                      -{row.reductionPercent}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 text-center">
                    <button
                      onClick={() =>
                        onOpenAiAnalysis({
                          stockSymbol: 'سهم ثاندر',
                          currentShares,
                          currentAvgPrice,
                          newShares: row.newShares,
                          newPrice: row.newPrice,
                          dropPercentage: row.dropPercent.toString(),
                        })
                      }
                      className="bg-[#020617] hover:bg-slate-800 text-slate-200 border border-slate-700 px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-1 mx-auto cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                      <span>تحليل</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-[#020617] p-3.5 rounded-lg border border-slate-800 text-xs sm:text-sm text-slate-300 flex items-center gap-2.5">
        <Info className="w-4 h-4 text-indigo-400 shrink-0" />
        <p className="leading-relaxed">
          نصيحة استثمارية: التبريد عند هبوط 10% إلى 15% بنفس كمية أسهمك الحالية (1x) يحقق انخفاضاً متوازناً في المتوسط دون استنزاف سيولتك النقدية دفعة واحدة.
        </p>
      </div>
    </div>
  );
};
