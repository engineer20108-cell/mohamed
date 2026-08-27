import React, { useState, useMemo } from 'react';
import { FeeConfig } from '../types';
import { calculateSellingOrder, formatCurrency } from '../utils/feeCalculator';
import { TrendingUp } from 'lucide-react';

interface SellingCalculatorProps {
  feeConfig: FeeConfig;
}

export const SellingCalculator: React.FC<SellingCalculatorProps> = ({ feeConfig }) => {
  const [sharesStr, setSharesStr] = useState('1000');
  const [buyAvgPriceStr, setBuyAvgPriceStr] = useState('20.00');
  const [sellPriceStr, setSellPriceStr] = useState('24.00');

  const shares = Math.max(0, parseFloat(sharesStr) || 0);
  const buyAvgPrice = Math.max(0, parseFloat(buyAvgPriceStr) || 0);
  const sellPrice = Math.max(0, parseFloat(sellPriceStr) || 0);

  const sellResult = useMemo(() => {
    return calculateSellingOrder(shares, buyAvgPrice, sellPrice, feeConfig);
  }, [shares, buyAvgPrice, sellPrice, feeConfig]);

  const handleApplyProfitMarkup = (markupPercent: number) => {
    if (buyAvgPrice > 0) {
      const price = (buyAvgPrice * (1 + markupPercent / 100)).toFixed(2);
      setSellPriceStr(price);
    }
  };

  return (
    <div className="space-y-4">
      {/* Inputs */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3 mb-3.5">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 border border-emerald-500/30 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2 uppercase tracking-wider">
              <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
              حاسبة صفقة البيع وصافي الأرباح
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              احسب صافي المبلغ الوارد لمحفظتك بعد خصم عمولات الشراء والبيع وحساب نقطة التعادل بالضبط.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-xs sm:text-sm text-slate-300 font-semibold mb-1.5">
              عدد الأسهم المراد بيعها
            </label>
            <div className="relative flex items-center">
              <input
                type="number"
                min="0"
                value={sharesStr}
                onChange={(e) => setSharesStr(e.target.value)}
                className="w-full bg-[#020617] border border-slate-800 rounded-lg pl-14 pr-3.5 py-2.5 text-sm sm:text-base text-slate-100 font-mono font-bold focus:border-emerald-500 outline-none transition-all"
              />
              <span className="absolute left-3 text-xs text-slate-400 font-mono pointer-events-none select-none">
                سهم
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm text-slate-300 font-semibold mb-1.5">
              متوسط السعر الذي اشتريت به السهم
            </label>
            <div className="relative flex items-center">
              <input
                type="number"
                step="0.01"
                value={buyAvgPriceStr}
                onChange={(e) => setBuyAvgPriceStr(e.target.value)}
                className="w-full bg-[#020617] border border-slate-800 rounded-lg pl-14 pr-3.5 py-2.5 text-sm sm:text-base text-slate-100 font-mono font-bold focus:border-emerald-500 outline-none transition-all"
              />
              <span className="absolute left-3 text-xs text-slate-400 font-mono pointer-events-none select-none">
                EGP
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm text-slate-300 font-semibold mb-1.5">
              سعر أمر البيع بالسوق <span className="text-emerald-400">*</span>
            </label>
            <div className="relative flex items-center">
              <input
                type="number"
                step="0.01"
                value={sellPriceStr}
                onChange={(e) => setSellPriceStr(e.target.value)}
                className="w-full bg-[#020617] border border-slate-800 rounded-lg pl-14 pr-3.5 py-2.5 text-sm sm:text-base text-slate-100 font-mono font-bold focus:border-emerald-500 outline-none transition-all"
              />
              <span className="absolute left-3 text-xs text-slate-400 font-mono pointer-events-none select-none">
                EGP
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-xs text-slate-400">نسبة الربح:</span>
              {[5, 10, 15, 20].map((pct) => (
                <button
                  key={pct}
                  onClick={() => handleApplyProfitMarkup(pct)}
                  className="text-xs bg-[#020617] hover:bg-slate-800 text-slate-200 border border-slate-800 px-2.5 py-1 rounded transition-colors cursor-pointer"
                >
                  +{pct}%
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Net Profit Card */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 sm:p-5 shadow-sm space-y-3.5">
          <h3 className="text-xs sm:text-sm font-bold text-slate-200 border-b border-slate-800 pb-2.5 uppercase tracking-wider">
            نتيجة الصفقة وصافي الأرباح
          </h3>

          <div
            className={`p-5 rounded-lg border text-center space-y-1.5 ${
              sellResult.netProfitOrLoss >= 0
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
            }`}
          >
            <span className="text-xs sm:text-sm font-medium text-slate-300 block">
              {sellResult.netProfitOrLoss >= 0
                ? 'صافي أرباح المحفظة المحققة'
                : 'صافي الخسارة المحققة'}
            </span>
            <div className="text-3xl sm:text-4xl font-bold font-mono tracking-tight">
              {formatCurrency(Math.abs(sellResult.netProfitOrLoss), feeConfig.currency)}
            </div>
            <div className="text-xs font-bold font-mono inline-block px-3 py-1 rounded-md bg-[#020617] border border-slate-800">
              النسبة المئوية: {sellResult.netProfitPercent >= 0 ? '+' : ''}
              {sellResult.netProfitPercent.toFixed(2)}%
            </div>
          </div>

          <div className="bg-[#020617] p-3.5 rounded-lg border border-dashed border-slate-800 space-y-1 text-xs sm:text-sm">
            <div className="flex justify-between text-slate-300 py-1 border-b border-slate-800/80">
              <span className="text-slate-400">سعر التعادل الدقيق (Break-Even):</span>
              <span className="font-bold font-mono text-amber-400">
                {sellResult.breakEvenPrice.toFixed(2)} EGP
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              سعر التعادل يحسب السعر الأدنى للبيع الذي يعوضك عن عمولة الشراء والبيع لتطبيق ثاندر والبورصة بدون أي خسارة أو ربح.
            </p>
          </div>
        </div>

        {/* Breakdown Card */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 sm:p-5 shadow-sm space-y-3 text-xs sm:text-sm">
          <h3 className="text-xs sm:text-sm font-bold text-slate-200 border-b border-slate-800 pb-2.5 uppercase tracking-wider">
            تفاصيل الأموال والعمولات
          </h3>

          <div className="flex justify-between py-2 border-b border-slate-800/80 text-slate-300">
            <span className="text-slate-400">إجمالي قيمة المبيعات المباشرة:</span>
            <span className="font-mono font-medium">
              {formatCurrency(sellResult.grossSalesValue, feeConfig.currency)}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-slate-800/80 text-slate-300">
            <span className="text-slate-400">عمولات عملية البيع (ثاندر + EGX):</span>
            <span className="text-amber-400 font-mono font-bold">
              {formatCurrency(sellResult.sellFees.totalFees, feeConfig.currency)}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-slate-800/80 text-slate-300">
            <span className="text-slate-400">صافي الكاش المضاف لحساب ثاندر:</span>
            <span className="font-bold font-mono text-emerald-400">
              {formatCurrency(sellResult.netSalesProceeds, feeConfig.currency)}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-slate-800/80 text-slate-300">
            <span className="text-slate-400">إجمالي التكلفة القديمة لشراء الأسهم:</span>
            <span className="font-mono font-medium">
              {formatCurrency(sellResult.totalBuyCostWithFees, feeConfig.currency)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
