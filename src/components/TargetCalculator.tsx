import React, { useState, useMemo } from 'react';
import { FeeConfig, AiAdvisorInput } from '../types';
import { calculateTargetCooling, formatCurrency } from '../utils/feeCalculator';
import { Target, CheckCircle2, TriangleAlert, Sparkles } from 'lucide-react';

interface TargetCalculatorProps {
  feeConfig: FeeConfig;
  onOpenAiAnalysis: (data: AiAdvisorInput) => void;
}

export const TargetCalculator: React.FC<TargetCalculatorProps> = ({
  feeConfig,
  onOpenAiAnalysis,
}) => {
  const [currentSharesStr, setCurrentSharesStr] = useState('26');
  const [currentAvgPriceStr, setCurrentAvgPriceStr] = useState('215.14');
  const [targetAvgPriceStr, setTargetAvgPriceStr] = useState('200.00');
  const [marketPriceToBuyStr, setMarketPriceToBuyStr] = useState('180.00');

  const currentShares = Math.max(0, parseFloat(currentSharesStr) || 0);
  const currentAvgPrice = Math.max(0, parseFloat(currentAvgPriceStr) || 0);
  const targetAvgPrice = Math.max(0, parseFloat(targetAvgPriceStr) || 0);
  const marketPriceToBuy = Math.max(0, parseFloat(marketPriceToBuyStr) || 0);

  const targetResult = useMemo(() => {
    return calculateTargetCooling(
      currentShares,
      currentAvgPrice,
      targetAvgPrice,
      marketPriceToBuy,
      feeConfig
    );
  }, [currentShares, currentAvgPrice, targetAvgPrice, marketPriceToBuy, feeConfig]);

  const handleApplyQuickTargetDiscount = (discountPercent: number) => {
    if (currentAvgPrice > 0) {
      const target = (currentAvgPrice * (1 - discountPercent / 100)).toFixed(2);
      setTargetAvgPriceStr(target);
    }
  };

  const handleApplyQuickMarketDiscount = (discountPercent: number) => {
    if (currentAvgPrice > 0) {
      const market = (currentAvgPrice * (1 - discountPercent / 100)).toFixed(2);
      setMarketPriceToBuyStr(market);
    }
  };

  return (
    <div className="space-y-4">
      {/* Description Banner */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 sm:p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center text-teal-400 shrink-0 border border-teal-500/30">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2 uppercase tracking-wider">
              <span className="w-2 h-2 bg-teal-400 rounded-full"></span>
              حاسبة التبريد العكسي (حساب السعر المستهدف)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              تحدد لك هذه الحاسبة{' '}
              <span className="text-teal-300 font-bold">العدد الدقيق للأسهم</span> والمبلغ المطلوبة استثماره بسعر السوق الحالي لخفض متوسط السعر إلى{' '}
              <span className="text-emerald-400 font-bold">المستهدف المحدد</span>.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Input Form */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 sm:p-5 shadow-sm space-y-3.5">
            <h3 className="text-xs sm:text-sm font-bold text-teal-400 uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-teal-400 rounded-full"></span>
              مدخلات التبريد المستهدف
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs sm:text-sm text-slate-300 font-semibold mb-1.5">
                  عدد الأسهم الحالية لديك
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min="0"
                    placeholder="26"
                    value={currentSharesStr}
                    onChange={(e) => setCurrentSharesStr(e.target.value)}
                    className="w-full bg-[#020617] border border-slate-800 rounded-lg pl-14 pr-3.5 py-2.5 text-sm sm:text-base text-slate-100 font-mono font-bold focus:border-teal-500 outline-none transition-all"
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
                    min="0"
                    placeholder="215.14"
                    value={currentAvgPriceStr}
                    onChange={(e) => setCurrentAvgPriceStr(e.target.value)}
                    className="w-full bg-[#020617] border border-slate-800 rounded-lg pl-14 pr-3.5 py-2.5 text-sm sm:text-base text-slate-100 font-mono font-bold focus:border-teal-500 outline-none transition-all"
                  />
                  <span className="absolute left-3 text-xs text-slate-400 font-mono pointer-events-none select-none">
                    EGP
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-slate-300 font-semibold mb-1.5">
                  المتوسط المستهدف المأمول <span className="text-teal-400">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="200.00"
                    value={targetAvgPriceStr}
                    onChange={(e) => setTargetAvgPriceStr(e.target.value)}
                    className="w-full bg-[#020617] border border-slate-800 rounded-lg pl-14 pr-3.5 py-2.5 text-sm sm:text-base text-slate-100 font-mono font-bold focus:border-teal-500 outline-none transition-all"
                  />
                  <span className="absolute left-3 text-xs text-slate-400 font-mono pointer-events-none select-none">
                    EGP
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-xs text-slate-400">تخفيض سريع:</span>
                  {[5, 10, 15].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => handleApplyQuickTargetDiscount(pct)}
                      className="text-xs bg-[#020617] hover:bg-slate-800 text-slate-200 border border-slate-800 px-2.5 py-1 rounded transition-colors cursor-pointer"
                    >
                      -{pct}%
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-slate-300 font-semibold mb-1.5">
                  سعر السهم بالسوق للشراء <span className="text-emerald-400">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="180.00"
                    value={marketPriceToBuyStr}
                    onChange={(e) => setMarketPriceToBuyStr(e.target.value)}
                    className="w-full bg-[#020617] border border-slate-800 rounded-lg pl-14 pr-3.5 py-2.5 text-sm sm:text-base text-slate-100 font-mono font-bold focus:border-emerald-500 outline-none transition-all"
                  />
                  <span className="absolute left-3 text-xs text-slate-400 font-mono pointer-events-none select-none">
                    EGP
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-xs text-slate-400">خصم السوق:</span>
                  {[10, 15, 20].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => handleApplyQuickMarketDiscount(pct)}
                      className="text-xs bg-[#020617] hover:bg-slate-800 text-slate-200 border border-slate-800 px-2.5 py-1 rounded transition-colors cursor-pointer"
                    >
                      -{pct}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 sm:p-5 shadow-sm space-y-3.5">
            <h3 className="text-xs sm:text-sm font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center justify-between uppercase tracking-wider">
              <span>الخطة المطلوبة للوصول للمستهدف</span>
              <span className="text-xs text-emerald-400 font-mono">EGX / THNDR</span>
            </h3>

            {targetResult.isPossible ? (
              <div className="space-y-3.5">
                <div className="bg-teal-500/10 border border-teal-500/20 p-5 rounded-lg text-center space-y-1">
                  <span className="text-xs sm:text-sm text-slate-300">
                    عدد الأسهم المطلوب شراؤها بالبورصة:
                  </span>
                  <div className="text-3xl sm:text-4xl font-bold font-mono text-teal-300 tracking-tight mt-1">
                    {targetResult.requiredShares.toLocaleString('en-US')}{' '}
                    <small className="text-sm font-normal text-slate-400">سهم</small>
                  </div>
                </div>

                <div className="space-y-2 text-xs sm:text-sm bg-[#020617] p-3.5 rounded-lg border border-slate-800">
                  <div className="flex justify-between text-slate-300 py-1.5 border-b border-slate-800/80">
                    <span className="text-slate-400">قيمة الأسهم المطلوبة (قبل العمولات):</span>
                    <span className="font-mono font-medium">
                      {formatCurrency(targetResult.requiredGrossCapital, feeConfig.currency)}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-300 py-1.5 border-b border-slate-800/80">
                    <span className="text-slate-400">عمولات ثاندر والبورصة التقديرية:</span>
                    <span className="text-amber-400 font-mono font-bold">
                      {formatCurrency(targetResult.estimatedBuyFees.totalFees, feeConfig.currency)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center font-bold py-2 px-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300">
                    <span>إجمالي تكلفة الشراء المطلوبة (بعد العمولات):</span>
                    <span className="font-mono text-sm">
                      {formatCurrency(targetResult.requiredTotalCapital, feeConfig.currency)}
                    </span>
                  </div>
                </div>

                <div className="bg-[#020617] rounded-lg p-3.5 border border-dashed border-slate-800 text-xs sm:text-sm space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>النتيجة النهائية بعد التنفيذ:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1">
                    سيمتلك حسابك إجمالي{' '}
                    <span className="font-bold text-slate-100 font-mono">
                      {(currentShares + targetResult.requiredShares).toLocaleString('en-US')} سهم
                    </span>{' '}
                    بمتوسط سعر دقيق قدره{' '}
                    <span className="font-bold text-emerald-400 font-mono">
                      {targetAvgPrice.toFixed(2)} EGP
                    </span>
                    .
                  </p>
                </div>

                <button
                  onClick={() =>
                    onOpenAiAnalysis({
                      stockSymbol: 'التبريد المستهدف',
                      currentShares,
                      currentAvgPrice,
                      newShares: targetResult.requiredShares,
                      newPrice: marketPriceToBuy,
                      dropPercentage: (
                        ((currentAvgPrice - targetAvgPrice) / currentAvgPrice) *
                        100
                      ).toFixed(1),
                    })
                  }
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>تقييم الذكاء الاصطناعي لخطة التبريد المستهدف</span>
                </button>
              </div>
            ) : (
              <div className="bg-amber-950/40 border border-amber-800/60 p-4 rounded-lg text-amber-200 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-300 text-xs sm:text-sm">
                  <TriangleAlert className="w-4 h-4 shrink-0" />
                  <span>تعذر حساب التبريد:</span>
                </div>
                <p className="text-xs sm:text-sm text-amber-300/90 leading-relaxed">
                  {targetResult.errorMessage || 'يرجى مراجعة قيم الأسعار المدخلة.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
