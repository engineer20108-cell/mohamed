import React, { useState, useMemo, useEffect } from 'react';
import { FeeConfig, StockItem, AiAdvisorInput } from '../types';
import {
  calculateCoolingOrder,
  formatCurrency,
  formatPercent,
  STANDARD_THNDR_FEE,
  FREE_TRADER_THNDR_FEE,
  EXPRESS_THNDR_FEE,
} from '../utils/feeCalculator';
import { fetchStockQuote } from '../utils/stockData';
import {
  BookmarkPlus,
  Share2,
  Sparkles,
  Zap,
  CheckCircle2,
} from 'lucide-react';

interface AverageCalculatorProps {
  feeConfig: FeeConfig;
  setFeeConfig?: (config: FeeConfig) => void;
  onSaveToPortfolio: (stock: Omit<StockItem, 'id'>) => void;
  onOpenAiAnalysis: (data: AiAdvisorInput) => void;
  onOpenShareModal: (data: any) => void;
  prefillData?: {
    symbol?: string;
    shares?: number;
    avgPrice?: number;
    newPrice?: number;
  } | null;
}

export const AverageCalculator: React.FC<AverageCalculatorProps> = ({
  feeConfig,
  setFeeConfig,
  onSaveToPortfolio,
  onOpenAiAnalysis,
  onOpenShareModal,
  prefillData,
}) => {
  const [symbol, setSymbol] = useState(prefillData?.symbol || '');
  const [companyName, setCompanyName] = useState('');
  const [currentSharesStr, setCurrentSharesStr] = useState(
    prefillData?.shares ? String(prefillData.shares) : '1000'
  );
  const [currentAvgPriceStr, setCurrentAvgPriceStr] = useState(
    prefillData?.avgPrice ? String(prefillData.avgPrice) : '20.00'
  );

  const [buyMode, setBuyMode] = useState<'shares' | 'budget'>('shares');
  const [additionalSharesStr, setAdditionalSharesStr] = useState('1000');
  const [newPriceStr, setNewPriceStr] = useState(
    prefillData?.newPrice ? String(prefillData.newPrice) : '16.00'
  );
  const [budgetStr, setBudgetStr] = useState('16000');

  const [isFetchingPrice, setIsFetchingPrice] = useState(false);
  const [liveQuote, setLiveQuote] = useState<{
    price: number;
    changePercent: number;
    name: string;
  } | null>(null);

  const handleFetchLivePrice = async () => {
    if (!symbol.trim()) {
      alert('يرجى كتابة رمز السهم أولاً (مثل COMI أو FWRY أو SWDY)');
      return;
    }
    setIsFetchingPrice(true);
    try {
      const quote = await fetchStockQuote(symbol);
      if (quote && quote.price > 0) {
        setNewPriceStr(String(quote.price));
        setLiveQuote({
          price: quote.price,
          changePercent: quote.changePercent,
          name: quote.name,
        });
        if (buyMode === 'shares') {
          const qty = parseFloat(additionalSharesStr) || 0;
          setBudgetStr(String((qty * quote.price).toFixed(2)));
        }
      } else {
        alert(`لم نتمكن من جلب سعر حي للسهم "${symbol}". يرجى التأكد من الرمز بالبورصة المصرية.`);
      }
    } catch {
      alert('حدث خطأ أثناء جلب السعر المباشر.');
    } finally {
      setIsFetchingPrice(false);
    }
  };

  useEffect(() => {
    if (prefillData) {
      if (prefillData.symbol) setSymbol(prefillData.symbol);
      if (prefillData.shares) setCurrentSharesStr(String(prefillData.shares));
      if (prefillData.avgPrice) setCurrentAvgPriceStr(String(prefillData.avgPrice));
      if (prefillData.newPrice) setNewPriceStr(String(prefillData.newPrice));
    }
  }, [prefillData]);

  const [saveSuccess, setSaveSuccess] = useState(false);

  const currentShares = Math.max(0, parseFloat(currentSharesStr) || 0);
  const currentAvgPrice = Math.max(0, parseFloat(currentAvgPriceStr) || 0);
  const newPrice = Math.max(0, parseFloat(newPriceStr) || 0);

  const calculatedSharesFromBudget = useMemo(() => {
    const budget = parseFloat(budgetStr) || 0;
    if (newPrice > 0 && budget > 0) {
      return Math.floor(budget / newPrice);
    }
    return 0;
  }, [budgetStr, newPrice]);

  const additionalShares = useMemo(() => {
    if (buyMode === 'budget') return calculatedSharesFromBudget;
    return Math.max(0, parseFloat(additionalSharesStr) || 0);
  }, [buyMode, calculatedSharesFromBudget, additionalSharesStr]);

  const orderDetails = useMemo(() => {
    return calculateCoolingOrder(
      { shares: currentShares, avgPrice: currentAvgPrice },
      { shares: additionalShares, price: newPrice },
      feeConfig
    );
  }, [currentShares, currentAvgPrice, additionalShares, newPrice, feeConfig]);

  const handleApplyQuantityMultiplier = (multiplier: number) => {
    const qty = Math.round(currentShares * multiplier);
    setAdditionalSharesStr(String(qty));
    if (newPrice > 0) {
      setBudgetStr(String((qty * newPrice).toFixed(2)));
    }
  };

  const handleApplyPriceDiscount = (discountPercent: number) => {
    if (currentAvgPrice > 0) {
      const discounted = (currentAvgPrice * (1 - discountPercent / 100)).toFixed(2);
      setNewPriceStr(discounted);
      const priceNum = parseFloat(discounted);
      if (buyMode === 'shares') {
        const qty = parseFloat(additionalSharesStr) || 0;
        setBudgetStr(String((qty * priceNum).toFixed(2)));
      }
    }
  };

  const handleSavePortfolio = () => {
    onSaveToPortfolio({
      symbol: symbol.trim() || 'سهم جديد',
      name: companyName.trim() || symbol.trim() || 'سهم البورصة',
      shares: orderDetails.totalShares,
      avgPrice: Number(orderDetails.newAvgPriceNet.toFixed(3)),
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const quickShortcuts = [
    { symbol: 'COMI', name: 'البنك التجاري الدولي' },
    { symbol: 'FWRY', name: 'فورى' },
    { symbol: 'SWDY', name: 'السويدي إلكتريك' },
    { symbol: 'TMGH', name: 'طلعت مصطفى' },
    { symbol: 'ABUK', name: 'أبو قير للأسمدة' },
    { symbol: 'HRHO', name: 'إي إف جي هيرميس' },
    { symbol: 'EAST', name: 'الشرقية للدخان' },
    { symbol: 'AMOC', name: 'أموك' },
    { symbol: 'JUFO', name: 'جهينة' },
    { symbol: 'EFIH', name: 'إي فاينانس' },
    { symbol: 'MFPC', name: 'موبكو' },
    { symbol: 'ESRS', name: 'حديد عز' },
  ];

  return (
    <div className="space-y-4">
      {/* Stock Shortcuts Bar */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-3.5 sm:p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
            <span className="text-emerald-400 font-bold text-xs sm:text-sm uppercase tracking-wider">
              اختصارات أسهم البورصة المصرية (EGX):
            </span>
            <span className="text-xs text-slate-400">(اختر لتعبئة الرمز)</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickShortcuts.map((item) => (
            <button
              key={item.symbol}
              onClick={() => {
                setSymbol(item.symbol);
                setCompanyName(item.name);
              }}
              className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-mono transition-all cursor-pointer border ${
                symbol === item.symbol
                  ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 font-bold'
                  : 'bg-[#020617] border-slate-800 text-slate-200 hover:border-slate-700 hover:text-white'
              }`}
            >
              {item.symbol} - {item.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Inputs Column */}
        <div className="lg:col-span-7 space-y-4">
          {/* Current Position */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 sm:p-5 shadow-sm space-y-3.5">
            <h2 className="text-emerald-400 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
              <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
              بيانات المركز الحالي (الأسهم المملوكة)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="sm:col-span-2">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs sm:text-sm text-slate-300 font-semibold">
                    رمز السهم / اسم الشركة (اختياري)
                  </label>
                  {symbol.trim() && (
                    <button
                      type="button"
                      onClick={handleFetchLivePrice}
                      disabled={isFetchingPrice}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 transition-all cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                      <span>{isFetchingPrice ? 'جاري السحب...' : 'سحب سعر البورصة المباشر'}</span>
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="مثال: COMI أو FWRY أو SWDY"
                  value={symbol}
                  onChange={(e) => {
                    setSymbol(e.target.value);
                    setLiveQuote(null);
                  }}
                  className="w-full bg-[#020617] border border-slate-800 rounded-lg px-4 py-3 text-base sm:text-lg text-slate-100 font-mono placeholder-slate-600 focus:border-indigo-500 outline-none transition-all"
                />
                {liveQuote && (
                  <div className="mt-2 text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg flex items-center justify-between font-mono">
                    <span>تم سحب سعر السوق لـ {liveQuote.name}:</span>
                    <span className="font-bold">
                      {liveQuote.price.toFixed(2)} EGP ({liveQuote.changePercent >= 0 ? '+' : ''}
                      {liveQuote.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-slate-300 font-semibold mb-1.5">
                  عدد الأسهم الحالية <span className="text-emerald-400">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min="0"
                    placeholder="1000"
                    value={currentSharesStr}
                    onChange={(e) => setCurrentSharesStr(e.target.value)}
                    className="w-full bg-[#020617] border border-slate-800 rounded-lg pl-16 pr-4 py-3 text-base sm:text-lg text-slate-100 font-mono font-bold focus:border-indigo-500 outline-none transition-all"
                  />
                  <span className="absolute left-3.5 text-xs sm:text-sm text-slate-400 font-mono pointer-events-none select-none">
                    سهم
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-slate-300 font-semibold mb-1.5">
                  متوسط السعر الحالي <span className="text-emerald-400">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="20.00"
                    value={currentAvgPriceStr}
                    onChange={(e) => setCurrentAvgPriceStr(e.target.value)}
                    className="w-full bg-[#020617] border border-slate-800 rounded-lg pl-16 pr-4 py-3 text-base sm:text-lg text-slate-100 font-mono font-bold focus:border-indigo-500 outline-none transition-all"
                  />
                  <span className="absolute left-3.5 text-xs sm:text-sm text-slate-400 font-mono pointer-events-none select-none">
                    EGP
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs sm:text-sm text-slate-300">
              <span>إجمالي رأس المال المستثمر الحالي:</span>
              <span className="font-bold text-slate-100 font-mono text-sm sm:text-base">
                {formatCurrency(orderDetails.oldTotalCost, feeConfig.currency)}
              </span>
            </div>
          </div>

          {/* New Order / Cooling Down */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 sm:p-5 shadow-sm space-y-3.5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <h2 className="text-amber-400 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                بيانات التبريد / التعزيز (عملية الشراء الجديدة)
              </h2>

              <div className="flex items-center bg-[#020617] p-1 rounded-lg border border-slate-800 text-xs sm:text-sm">
                <button
                  onClick={() => setBuyMode('shares')}
                  className={`px-3 py-1 rounded font-bold transition-all cursor-pointer ${
                    buyMode === 'shares'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  بعدد الأسهم
                </button>
                <button
                  onClick={() => setBuyMode('budget')}
                  className={`px-3 py-1 rounded font-bold transition-all cursor-pointer ${
                    buyMode === 'budget'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  بالمبلغ
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs sm:text-sm text-slate-300 font-semibold mb-1.5">
                  سعر الشراء الجديد <span className="text-amber-400">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="16.00"
                    value={newPriceStr}
                    onChange={(e) => {
                      setNewPriceStr(e.target.value);
                      const priceNum = parseFloat(e.target.value) || 0;
                      if (buyMode === 'shares' && priceNum > 0) {
                        const qty = parseFloat(additionalSharesStr) || 0;
                        setBudgetStr(String((qty * priceNum).toFixed(2)));
                      }
                    }}
                    className="w-full bg-[#020617] border border-slate-800 rounded-lg pl-16 pr-4 py-3 text-base sm:text-lg text-slate-100 font-mono font-bold focus:border-amber-500 outline-none transition-all"
                  />
                  <span className="absolute left-3.5 text-xs sm:text-sm text-slate-400 font-mono pointer-events-none select-none">
                    EGP
                  </span>
                </div>
              </div>

              {buyMode === 'shares' ? (
                <div>
                  <label className="block text-xs sm:text-sm text-slate-300 font-semibold mb-1.5">
                    عدد الأسهم الإضافية <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      min="0"
                      placeholder="1000"
                      value={additionalSharesStr}
                      onChange={(e) => {
                        setAdditionalSharesStr(e.target.value);
                        const qty = parseFloat(e.target.value) || 0;
                        if (newPrice > 0) {
                          setBudgetStr(String((qty * newPrice).toFixed(2)));
                        }
                      }}
                      className="w-full bg-[#020617] border border-slate-800 rounded-lg pl-16 pr-4 py-3 text-base sm:text-lg text-slate-100 font-mono font-bold focus:border-amber-500 outline-none transition-all"
                    />
                    <span className="absolute left-3.5 text-xs sm:text-sm text-slate-400 font-mono pointer-events-none select-none">
                      سهم
                    </span>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs sm:text-sm text-slate-300 font-semibold mb-1.5">
                    المبلغ المخصص للشراء <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      min="0"
                      placeholder="16000"
                      value={budgetStr}
                      onChange={(e) => setBudgetStr(e.target.value)}
                      className="w-full bg-[#020617] border border-slate-800 rounded-lg pl-16 pr-4 py-3 text-base sm:text-lg text-slate-100 font-mono font-bold focus:border-amber-500 outline-none transition-all"
                    />
                    <span className="absolute left-3.5 text-xs sm:text-sm text-slate-400 font-mono pointer-events-none select-none">
                      EGP
                    </span>
                  </div>
                  {newPrice > 0 && calculatedSharesFromBudget > 0 && (
                    <p className="text-xs text-amber-300 mt-1.5">
                      يشتري لك <span className="font-bold">{calculatedSharesFromBudget}</span> سهم
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Quick Fee Presets bar */}
            {setFeeConfig && (
              <div className="bg-[#020617] border border-slate-800 p-3.5 rounded-lg space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-200 font-bold flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                    نوع حساب ثاندر والعمولة المطبقة:
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {feeConfig.preset === 'thndr_egx_standard'
                      ? 'ثاندر العادي (5 ج + 0.13%)'
                      : feeConfig.preset === 'thndr_trader_free'
                      ? 'ثاندر تريدر (0.03% مجاني)'
                      : feeConfig.preset === 'thndr_express'
                      ? 'إكسبريس (0.08%)'
                      : 'عمولة مخصصة'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setFeeConfig(STANDARD_THNDR_FEE)}
                    className={`px-2.5 py-1.5 rounded-md border text-xs font-semibold transition-all cursor-pointer ${
                      feeConfig.preset === 'thndr_egx_standard'
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold'
                        : 'bg-[#0f172a] border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    ثاندر العادي
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeeConfig(FREE_TRADER_THNDR_FEE)}
                    className={`px-2.5 py-1.5 rounded-md border text-xs font-semibold transition-all cursor-pointer ${
                      feeConfig.preset === 'thndr_trader_free'
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                        : 'bg-[#0f172a] border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    تداول مجاني (50)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeeConfig(EXPRESS_THNDR_FEE)}
                    className={`px-2.5 py-1.5 rounded-md border text-xs font-semibold transition-all cursor-pointer ${
                      feeConfig.preset === 'thndr_express'
                        ? 'bg-teal-500/20 border-teal-500/50 text-teal-300 font-bold'
                        : 'bg-[#0f172a] border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    إكسبريس
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <span className="text-xs text-slate-300 shrink-0">
                    أو إدخال نسبة عمولة مخصصة (%):
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="مثال: 0.15"
                    value={
                      feeConfig.totalFeePercentOverride !== undefined
                        ? feeConfig.totalFeePercentOverride
                        : ''
                    }
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (isNaN(val)) {
                        setFeeConfig({ ...feeConfig, totalFeePercentOverride: undefined });
                      } else {
                        setFeeConfig({
                          ...feeConfig,
                          preset: 'custom',
                          totalFeePercentOverride: val,
                        });
                      }
                    }}
                    className="w-24 bg-[#0f172a] border border-slate-700 rounded-md px-2.5 py-1 text-xs sm:text-sm text-amber-300 font-bold font-mono outline-none focus:border-amber-500"
                  />
                  {feeConfig.totalFeePercentOverride !== undefined && (
                    <button
                      type="button"
                      onClick={() => setFeeConfig(STANDARD_THNDR_FEE)}
                      className="text-xs text-slate-400 hover:text-rose-400 underline cursor-pointer"
                    >
                      إلغاء التخصيص
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Total Order Cost Summary */}
            {orderDetails.newGrossValue > 0 && (
              <div className="bg-[#020617] border border-amber-500/30 p-3.5 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm">
                <div>
                  <span className="text-amber-300 font-bold block">
                    إجمالي تكلفة أمر الشراء الجديد (بعد العمولات):
                  </span>
                  <span className="text-slate-400 text-xs mt-0.5 block">
                    قيمة الأسهم {formatCurrency(orderDetails.newGrossValue, feeConfig.currency)} +
                    عمولات {formatCurrency(orderDetails.newOrderFees.totalFees, feeConfig.currency)}
                  </span>
                </div>
                <span className="text-base font-bold font-mono text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-md border border-amber-500/30 shrink-0">
                  {formatCurrency(orderDetails.newNetTotal, feeConfig.currency)}
                </span>
              </div>
            )}

            {/* Quick Adjustment Buttons */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <p className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider">خيارات التبريد السريع:</p>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400">خصم السعر:</span>
                {[5, 10, 15, 20].map((percent) => (
                  <button
                    key={percent}
                    onClick={() => handleApplyPriceDiscount(percent)}
                    className="px-2.5 py-1 bg-[#020617] hover:bg-slate-800 border border-slate-800 rounded-md text-xs text-slate-200 transition-colors cursor-pointer"
                  >
                    -{percent}%
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400">نسبة الكمية:</span>
                <button
                  onClick={() => handleApplyQuantityMultiplier(0.5)}
                  className="px-2.5 py-1 bg-[#020617] hover:bg-slate-800 border border-slate-800 rounded-md text-xs text-slate-200 transition-colors cursor-pointer"
                >
                  0.5x
                </button>
                <button
                  onClick={() => handleApplyQuantityMultiplier(1.0)}
                  className="px-2.5 py-1 bg-[#020617] hover:bg-slate-800 border border-slate-800 rounded-md text-xs text-emerald-400 font-bold transition-colors cursor-pointer"
                >
                  1x (نفس الكمية)
                </button>
                <button
                  onClick={() => handleApplyQuantityMultiplier(2.0)}
                  className="px-2.5 py-1 bg-[#020617] hover:bg-slate-800 border border-slate-800 rounded-md text-xs text-teal-300 font-bold transition-colors cursor-pointer"
                >
                  2x (ضعف الكمية)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Summary Card Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 sm:p-5 shadow-lg space-y-4">
            <h3 className="text-xs sm:text-sm font-bold text-slate-200 flex justify-between items-center border-b border-slate-800 pb-3 uppercase tracking-wider">
              <span>ملخص عملية التبريد والتزويد</span>
              <span className="text-xs text-indigo-400 font-mono font-bold">EGX / THNDR</span>
            </h3>

            {/* Main Result Card */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-lg flex flex-col items-center justify-center text-center">
              <span className="text-slate-300 text-xs sm:text-sm mb-1 font-medium">متوسط السعر الجديد المتوقع</span>
              <div className="text-3xl sm:text-4xl font-bold font-mono text-emerald-400 tracking-tight my-1">
                {orderDetails.newAvgPriceGross.toFixed(2)}{' '}
                <small className="text-base font-medium text-emerald-300">EGP</small>
              </div>

              {currentShares > 0 && orderDetails.avgPriceChangePercent < 0 && (
                <div className="mt-2.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs sm:text-sm rounded-md font-semibold">
                  وفرت {Math.abs(currentAvgPrice - orderDetails.newAvgPriceGross).toFixed(2)} EGP
                  لكل سهم ({formatPercent(orderDetails.avgPriceChangePercent)})
                </div>
              )}
            </div>

            {/* Total Portfolio Value */}
            <div className="bg-[#020617] border border-slate-800 p-3.5 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">إجمالي قيمة المحفظة الجديدة</span>
                <span className="text-base sm:text-lg font-bold font-mono text-slate-100">
                  {formatCurrency(orderDetails.totalNetCostWithFees, feeConfig.currency)}
                </span>
              </div>
              <span className="text-xs bg-slate-800 text-slate-200 px-2.5 py-1 rounded-md font-mono">
                إجمالي {orderDetails.totalShares.toLocaleString('en-US')} سهم
              </span>
            </div>

            {/* Fees Breakdown */}
            <div className="space-y-2 text-xs sm:text-sm">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                تفاصيل العمولات والتكلفة الإجمالية
              </h4>

              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-300">قيمة الأسهم المباشرة (بدون عمولات)</span>
                <span className="text-slate-100 font-mono font-medium">
                  {formatCurrency(orderDetails.newGrossValue, feeConfig.currency)}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-300">عمولة ثاندر الثابتة</span>
                <span className="text-slate-100 font-mono font-medium">
                  {formatCurrency(orderDetails.newOrderFees.thndrFixed, feeConfig.currency)}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-300">عمولة السمسرة المباشرة</span>
                <span className="text-slate-100 font-mono font-medium">
                  {formatCurrency(orderDetails.newOrderFees.brokerFee, feeConfig.currency)}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-300">رسوم البورصة والمقاصة والرقابة</span>
                <span className="text-slate-100 font-mono font-medium">
                  {formatCurrency(orderDetails.newOrderFees.egxRegulatory, feeConfig.currency)}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800 font-bold text-amber-400">
                <span>إجمالي العمولات والرسوم</span>
                <span className="font-mono">
                  {formatCurrency(orderDetails.newOrderFees.totalFees, feeConfig.currency)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2.5 px-3 bg-amber-500/10 border border-amber-500/30 rounded-lg my-1.5 font-bold text-amber-300">
                <span>إجمالي سعر الشراء الجديد (بعد العمولات)</span>
                <span className="text-sm font-mono">
                  {formatCurrency(orderDetails.newNetTotal, feeConfig.currency)}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800 font-bold text-emerald-400">
                <span>سعر التعادل للبيع بدون خسارة</span>
                <span className="font-mono text-sm">
                  {orderDetails.breakEvenSellPrice.toFixed(2)} EGP
                </span>
              </div>
            </div>

            {/* Investment Tip */}
            <div className="bg-[#020617] rounded-lg p-3.5 border border-dashed border-slate-800 space-y-1">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                نصيحة الاستثمار
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                عملية التبريد هذه ستقلل متوسط تكلفتك بنسبة{' '}
                <span className="text-emerald-400 font-bold">
                  {Math.abs(orderDetails.avgPriceChangePercent).toFixed(1)}%
                </span>
                . تقربك هذه الخطوة من نقطة الخروج أو الربحية بسرعة أكبر.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-1">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={handleSavePortfolio}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold py-2.5 px-3 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors border border-slate-700 cursor-pointer"
                >
                  <BookmarkPlus className="w-4 h-4 text-amber-400" />
                  <span>حفظ بالحافظة</span>
                </button>

                <button
                  onClick={() =>
                    onOpenShareModal({
                      stockSymbol: symbol || 'سهم ثاندر',
                      oldShares: orderDetails.oldShares,
                      oldAvg: orderDetails.oldAvgPrice,
                      newShares: orderDetails.newShares,
                      newPrice: orderDetails.newPrice,
                      newAvgGross: orderDetails.newAvgPriceGross,
                      newAvgNet: orderDetails.newAvgPriceNet,
                      totalShares: orderDetails.totalShares,
                      fees: orderDetails.newOrderFees.totalFees,
                      changePct: orderDetails.avgPriceChangePercent,
                    })
                  }
                  className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold py-2.5 px-3 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors border border-slate-700 cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-emerald-400" />
                  <span>مشاركة النتيجة</span>
                </button>
              </div>

              <button
                onClick={() =>
                  onOpenAiAnalysis({
                    stockSymbol: symbol || 'سهم ثاندر',
                    currentShares: orderDetails.oldShares,
                    currentAvgPrice: orderDetails.oldAvgPrice,
                    newShares: orderDetails.newShares,
                    newPrice: orderDetails.newPrice,
                    dropPercentage: Math.abs(orderDetails.avgPriceChangePercent).toFixed(1),
                  })
                }
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                <span>تحليل جدوى التبريد بواسطة الذكاء الاصطناعي</span>
              </button>

              {saveSuccess && (
                <div className="bg-emerald-950/80 text-emerald-300 border border-emerald-700 p-2.5 rounded-lg text-xs text-center flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>تم حفظ السهم بنجاح في حافظتك الشخصية!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
