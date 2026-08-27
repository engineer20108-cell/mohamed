import React, { useState } from 'react';
import { StockItem, FeeConfig } from '../types';
import { calculateFees, formatCurrency } from '../utils/feeCalculator';
import { resolveSymbol, fetchBatchStockQuotes, fetchStockQuote } from '../utils/stockData';
import {
  Briefcase,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Table,
  LayoutGrid,
  PenLine,
  Trash2,
  Calculator,
  RefreshCw,
  Info,
  Check,
  X,
  Zap,
  Clock,
  Sparkles,
} from 'lucide-react';

interface PortfolioViewProps {
  portfolio: StockItem[];
  feeConfig: FeeConfig;
  onAddStock: (stock: Omit<StockItem, 'id'>) => void;
  onUpdateStock?: (stock: StockItem) => void;
  onDeleteStock: (id: string) => void;
  onSelectForCooling: (stock: StockItem) => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  portfolio,
  feeConfig,
  onAddStock,
  onUpdateStock,
  onDeleteStock,
  onSelectForCooling,
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [calcMethod, setCalcMethod] = useState<'thndr_net' | 'breakeven_avg' | 'gross'>(
    'thndr_net'
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<StockItem | null>(null);

  const [showFormulaInfo, setShowFormulaInfo] = useState(false);

  // Live Batch Sync State
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  // Form states
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);
  const [symbol, setSymbol] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [sharesStr, setSharesStr] = useState('');
  const [avgPriceStr, setAvgPriceStr] = useState('');
  const [marketPriceStr, setMarketPriceStr] = useState('');

  // Inline draft edit prices per stock
  const [inlinePriceDrafts, setInlinePriceDrafts] = useState<Record<string, string>>({});

  const handleSyncAllPrices = async () => {
    if (portfolio.length === 0 || !onUpdateStock) return;

    setIsSyncingAll(true);
    setSyncStatusMsg('جاري الاتصال بالبورصة المصرية وتحديث أسعار الأسهم لحظياً...');

    try {
      const symbols = portfolio.map((s) => s.symbol);
      const quotesMap = await fetchBatchStockQuotes(symbols);

      let updatedCount = 0;
      portfolio.forEach((stock) => {
        const canonical = resolveSymbol(stock.symbol);
        const quote =
          quotesMap[stock.symbol.toUpperCase()] ||
          quotesMap[canonical.toUpperCase()] ||
          quotesMap[stock.symbol];

        if (quote && quote.price > 0) {
          onUpdateStock({
            ...stock,
            marketPrice: quote.price,
            name: quote.name || stock.name,
            lastUpdated: new Date().toISOString(),
          });
          updatedCount++;
        }
      });

      const nowTime = new Date().toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setLastSyncTime(nowTime);

      if (updatedCount > 0) {
        setSyncStatusMsg(`تم تحديث أسعار ${updatedCount} سهم بنجاح وفقاً لأحدث قراءات البورصة!`);
      } else {
        setSyncStatusMsg('تنبيه: لم يتم العثور على رموز مطابقة بالبورصة للحديث التلقائي');
      }
    } catch {
      setSyncStatusMsg('حدث خطأ أثناء جلب أسعار البورصة الحية');
    } finally {
      setIsSyncingAll(false);
      setTimeout(() => setSyncStatusMsg(null), 5000);
    }
  };

  const handleFetchSinglePrice = async (targetSymbol: string, mode: 'add' | 'edit') => {
    if (!targetSymbol.trim()) return;
    setIsFetchingPrice(true);
    try {
      const quote = await fetchStockQuote(targetSymbol);
      if (quote && quote.price > 0) {
        if (mode === 'add') {
          setMarketPriceStr(String(quote.price));
          if (quote.name && (!companyName || companyName === 'شركة البورصة')) {
            setCompanyName(quote.name);
          }
        } else if (mode === 'edit' && editingStock) {
          setEditingStock({
            ...editingStock,
            marketPrice: quote.price,
            name: quote.name || editingStock.name,
          });
        }
      } else {
        alert(`لم نتمكن من جلب السعر اللحظي للرمز "${targetSymbol}". تأكد من إدخال رمز السهم بالبورصة (مثل COMI أو FWRY).`);
      }
    } catch {
      alert('حدث خطأ أثناء الاتصال بمزود أسعار الأسهم.');
    } finally {
      setIsFetchingPrice(false);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sharesStr || !avgPriceStr) return;

    const shares = Math.max(0, parseFloat(sharesStr) || 0);
    const avgPrice = Math.max(0, parseFloat(avgPriceStr) || 0);
    const marketPrice = marketPriceStr ? Math.max(0, parseFloat(marketPriceStr) || 0) : undefined;

    onAddStock({
      symbol: symbol.trim() || 'سهم جديد',
      name: companyName.trim() || symbol.trim() || 'شركة البورصة',
      shares,
      avgPrice,
      marketPrice,
    });

    setSymbol('');
    setCompanyName('');
    setSharesStr('');
    setAvgPriceStr('');
    setMarketPriceStr('');
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStock || !onUpdateStock) return;

    onUpdateStock({
      ...editingStock,
      symbol: editingStock.symbol.trim() || 'سهم جديد',
      name: editingStock.name.trim() || editingStock.symbol.trim() || 'شركة البورصة',
      shares: Math.max(0, editingStock.shares || 0),
      avgPrice: Math.max(0, editingStock.avgPrice || 0),
      marketPrice:
        editingStock.marketPrice && editingStock.marketPrice > 0
          ? editingStock.marketPrice
          : undefined,
      lastUpdated: new Date().toISOString(),
    });

    setEditingStock(null);
  };

  const handleSaveInlineMarketPrice = (stock: StockItem) => {
    if (!onUpdateStock) return;
    const draft = inlinePriceDrafts[stock.id];
    if (draft === undefined) return;

    const num = parseFloat(draft);
    onUpdateStock({
      ...stock,
      marketPrice: !isNaN(num) && num > 0 ? num : undefined,
      lastUpdated: new Date().toISOString(),
    });

    setInlinePriceDrafts((prev) => {
      const next = { ...prev };
      delete next[stock.id];
      return next;
    });
  };

  const calculateStockMetrics = (stock: StockItem) => {
    const shares = stock.shares;
    const avgPrice = stock.avgPrice;
    const mPrice = stock.marketPrice ?? stock.avgPrice;

    const costVal = shares * avgPrice;
    const buyFees = calculateFees(costVal, feeConfig).totalFees;
    const investedCost = costVal + buyFees;

    const marketVal = shares * mPrice;
    const sellFees = calculateFees(marketVal, feeConfig).totalFees;
    const netMarketVal = marketVal - sellFees;

    if (calcMethod === 'thndr_net') {
      const netCostBasis = investedCost;
      const profitLoss = netMarketVal - netCostBasis;
      const profitLossPercent = netCostBasis > 0 ? (profitLoss / netCostBasis) * 100 : 0;
      return {
        costVal,
        investedCost: netCostBasis,
        marketVal,
        netMarketVal,
        profitLoss,
        profitLossPercent,
        hasMarketPrice: stock.marketPrice !== undefined,
      };
    } else if (calcMethod === 'breakeven_avg') {
      const netCostBasis = costVal;
      const profitLoss = marketVal - netCostBasis;
      const profitLossPercent = netCostBasis > 0 ? (profitLoss / netCostBasis) * 100 : 0;
      return {
        costVal,
        investedCost: netCostBasis,
        marketVal,
        netMarketVal: marketVal,
        profitLoss,
        profitLossPercent,
        hasMarketPrice: stock.marketPrice !== undefined,
      };
    } else {
      const netCostBasis = costVal;
      const profitLoss = marketVal - netCostBasis;
      const profitLossPercent = netCostBasis > 0 ? (profitLoss / netCostBasis) * 100 : 0;
      return {
        costVal,
        investedCost: netCostBasis,
        marketVal,
        netMarketVal: marketVal,
        profitLoss,
        profitLossPercent,
        hasMarketPrice: stock.marketPrice !== undefined,
      };
    }
  };

  const portfolioWithMetrics = portfolio.map((stock) => ({
    stock,
    metrics: calculateStockMetrics(stock),
  }));

  const totalCostValue = portfolioWithMetrics.reduce(
    (acc, item) => acc + item.metrics.costVal,
    0
  );
  const totalInvestedNetCost = portfolioWithMetrics.reduce(
    (acc, item) => acc + item.metrics.investedCost,
    0
  );
  const totalMarketValue = portfolioWithMetrics.reduce(
    (acc, item) => acc + item.metrics.marketVal,
    0
  );
  const totalNetProfitLoss = portfolioWithMetrics.reduce(
    (acc, item) => acc + item.metrics.profitLoss,
    0
  );
  const totalProfitPercent =
    totalInvestedNetCost > 0 ? (totalNetProfitLoss / totalInvestedNetCost) * 100 : 0;
  const totalSharesCount = portfolio.reduce((acc, stock) => acc + stock.shares, 0);

  return (
    <div className="space-y-4">
      {/* Sync All Banner */}
      <div className="bg-[#0f172a] border border-emerald-500/20 rounded-lg p-3.5 sm:p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-slate-100 uppercase tracking-wider">
                تحديث لحظي لأسعار السوق (البورصة المصرية EGX)
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                مباشر
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              جلب أسعار الإغلاق والتداول المباشرة لجميع أسهم حافظتك عبر Google Finance (البورصة المصرية EGX)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {lastSyncTime && (
            <span className="text-xs text-slate-300 font-mono flex items-center gap-1 bg-[#020617] px-2.5 py-1.5 rounded-lg border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              آخر تحديث: {lastSyncTime}
            </span>
          )}
          <button
            onClick={handleSyncAllPrices}
            disabled={isSyncingAll || portfolio.length === 0}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncingAll ? 'animate-spin text-amber-300' : ''}`} />
            <span>{isSyncingAll ? 'جاري الاتصال بالسوق...' : 'تحديث أسعار السوق الآن'}</span>
          </button>
        </div>
      </div>

      <div className="bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs sm:text-sm px-3.5 py-2 rounded-lg flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="leading-relaxed">
            <strong>تنبيه دقة البيانات:</strong> يتم السحب المباشر من مزود <strong>Google Finance (EGX)</strong>. يمكنك دائماً تعديل سعر السوق يدوياً مباشرة بالضغط على خانة السعر بالجدول للتأكد من تطابقه 100% مع تطبيق ثاندر.
          </span>
        </div>
      </div>

      {syncStatusMsg && (
        <div className="bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm px-3.5 py-2.5 rounded-lg flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <span>{syncStatusMsg}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">إجمالي تكلفة الشراء</span>
            <div className="text-lg sm:text-xl font-bold font-mono text-slate-100 mt-1">
              {formatCurrency(totalCostValue, feeConfig.currency)}
            </div>
            {calcMethod === 'thndr_net' && (
              <span className="text-xs text-slate-400 font-mono block mt-1">
                مستثمر فعلي: {formatCurrency(totalInvestedNetCost, feeConfig.currency)}
              </span>
            )}
          </div>
          <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400 border border-emerald-500/20 shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">القيمة السوقية الحالية</span>
            <div className="text-lg sm:text-xl font-bold font-mono text-amber-300 mt-1">
              {formatCurrency(totalMarketValue, feeConfig.currency)}
            </div>
          </div>
          <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-400 border border-amber-500/20 shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">
                {calcMethod === 'thndr_net'
                  ? 'صافي أرباح/خسائر ثاندر'
                  : 'أرباح / خسائر بالسوق'}
              </span>
            </div>
            <div
              className={`text-lg sm:text-xl font-bold font-mono mt-1 flex items-center gap-1.5 ${
                totalNetProfitLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              <span>
                {totalNetProfitLoss >= 0 ? '+' : ''}
                {formatCurrency(totalNetProfitLoss, feeConfig.currency)}
              </span>
              <span className="text-xs font-bold">
                ({totalProfitPercent >= 0 ? '+' : ''}
                {totalProfitPercent.toFixed(2)}%)
              </span>
            </div>
          </div>
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
              totalNetProfitLoss >= 0
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}
          >
            {totalNetProfitLoss >= 0 ? (
              <TrendingUp className="w-5 h-5" />
            ) : (
              <TrendingDown className="w-5 h-5" />
            )}
          </div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">عدد الأسهم الكلي</span>
            <div className="text-lg sm:text-xl font-bold font-mono text-slate-100 mt-1">
              {totalSharesCount.toLocaleString('en-US')} سهم
            </div>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-lg font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة سهم</span>
          </button>
        </div>
      </div>

      {/* Calculation Method Selection Bar */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-2.5 flex flex-wrap items-center justify-between gap-2 shadow-sm">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold text-slate-300">طريقة حساب المكسب والخسارة:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-[#0B0E14] p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setCalcMethod('thndr_net')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              calcMethod === 'thndr_net'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="تطبيق طريقة ثاندر الدقيقة (تخصم عمولات الشراء والبيع)"
          >
            🟢 طريقة ثاندر الصافية (بعد العمولات)
          </button>
          <button
            onClick={() => setCalcMethod('breakeven_avg')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              calcMethod === 'breakeven_avg'
                ? 'bg-amber-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="إذا كان متوسط السعر المدخل هو سعر ثاندر الشامل للعمولة أساساً"
          >
            🟡 متوسط ثاندر الشامل (Break-Even)
          </button>
          <button
            onClick={() => setCalcMethod('gross')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              calcMethod === 'gross'
                ? 'bg-slate-700 text-slate-100 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="الحساب السريع المباشر (سعر السوق - متوسط الشراء بدون عمولات)"
          >
            ⚪ الطريقة المباشرة (بدون عمولات)
          </button>
        </div>

        <button
          onClick={() => setShowFormulaInfo(!showFormulaInfo)}
          className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium bg-emerald-500/10 px-2.5 py-1.5 rounded-xl border border-emerald-500/20 transition-colors cursor-pointer"
        >
          <Info className="w-3.5 h-3.5" />
          <span>شرح المعادلة والتطابق</span>
        </button>
      </div>

      {showFormulaInfo && (
        <div className="bg-[#161B22] border border-emerald-500/30 rounded-2xl p-4 text-xs space-y-2 text-slate-300 animate-in fade-in">
          <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
            <Info className="w-4 h-4" />
            كيف تحسب ثاندر الأرباح والخسائر ونسبة العائد بالضبط؟
          </h4>
          <p className="leading-relaxed text-slate-400">
            تطبيق ثاندر يحسب نسبة العائد <strong>%</strong> والمكسب/الخسارة بناءً على{' '}
            <strong>رأس المال المستثمر الفعلي (Net Cost Basis)</strong> شامل رسوم وعمولات التنفيذ:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-300 font-mono text-[11px] bg-[#0B0E14] p-3 rounded-xl border border-slate-800">
            <li>
              <strong>رأس المال المستثمر</strong> = (عدد الأسهم × متوسط سعر الشراء) + عمولة الشراء المطبقة
            </li>
            <li>
              <strong>صافي البيع التقديري</strong> = (عدد الأسهم × سعر السوق) - عمولة البيع المطبقة
            </li>
            <li>
              <strong>صافي الربح / الخسارة</strong> = صافي البيع التقديري - رأس المال المستثمر
            </li>
            <li>
              <strong>نسبة العائد %</strong> = (صافي الربح / الخسارة ÷ رأس المال المستثمر) × 100
            </li>
          </ul>
          <p className="text-[11px] text-amber-300/90">
            💡 إذا كان متوسط السعر الظاهر لديك في ثاندر يمثل سعر التعادل (Break-Even)، اختر تبويب{' '}
            <strong>"متوسط ثاندر الشامل"</strong> بالأعلى للتطابق التام.
          </p>
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <form
          onSubmit={handleAddSubmit}
          className="bg-[#161B22] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 animate-in fade-in"
        >
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
              تسجيل سهم جديد في حافظة الأسهم
            </h3>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-bold">
                رمز السهم (Symbol)
              </label>
              <input
                type="text"
                placeholder="مثال: COMI"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full bg-[#0B0E14] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-bold">اسم الشركة</label>
              <input
                type="text"
                placeholder="البنك التجاري الدولي"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-[#0B0E14] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-bold">عدد الأسهم *</label>
              <input
                type="number"
                required
                placeholder="1000"
                value={sharesStr}
                onChange={(e) => setSharesStr(e.target.value)}
                className="w-full bg-[#0B0E14] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-mono focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-bold">
                متوسط الشراء (EGP) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="20.00"
                value={avgPriceStr}
                onChange={(e) => setAvgPriceStr(e.target.value)}
                className="w-full bg-[#0B0E14] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-mono focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs text-amber-300 font-bold">
                  سعر السهم بالسوق (EGP)
                </label>
                {symbol.trim() && (
                  <button
                    type="button"
                    onClick={() => handleFetchSinglePrice(symbol, 'add')}
                    disabled={isFetchingPrice}
                    className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 cursor-pointer"
                  >
                    <Zap className="w-3 h-3" />
                    <span>{isFetchingPrice ? 'جاري...' : 'سحب المباشر'}</span>
                  </button>
                )}
              </div>
              <input
                type="number"
                step="0.01"
                placeholder="مثال: 18.50"
                value={marketPriceStr}
                onChange={(e) => setMarketPriceStr(e.target.value)}
                className="w-full bg-[#0B0E14] border border-amber-500/40 rounded-xl px-3.5 py-2 text-xs text-amber-300 font-mono focus:ring-2 focus:ring-amber-500/50 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-medium hover:bg-slate-700 transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500 shadow-md transition-colors cursor-pointer"
            >
              حفظ السهم
            </button>
          </div>
        </form>
      )}

      {/* Edit Modal */}
      {editingStock && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleEditSubmit}
            className="bg-[#161B22] border border-slate-700 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <PenLine className="w-4 h-4" />
                تعديل بيانات السهم وسعر السوق
              </h3>
              <button
                type="button"
                onClick={() => setEditingStock(null)}
                className="text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-bold">
                  رمز السهم (Symbol)
                </label>
                <input
                  type="text"
                  value={editingStock.symbol}
                  onChange={(e) =>
                    setEditingStock({ ...editingStock, symbol: e.target.value })
                  }
                  className="w-full bg-[#0B0E14] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-bold">اسم الشركة</label>
                <input
                  type="text"
                  value={editingStock.name}
                  onChange={(e) => setEditingStock({ ...editingStock, name: e.target.value })}
                  className="w-full bg-[#0B0E14] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-bold">عدد الأسهم</label>
                  <input
                    type="number"
                    value={editingStock.shares}
                    onChange={(e) =>
                      setEditingStock({
                        ...editingStock,
                        shares: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-[#0B0E14] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-bold">
                    متوسط سعر الشراء (EGP)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingStock.avgPrice}
                    onChange={(e) =>
                      setEditingStock({
                        ...editingStock,
                        avgPrice: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-[#0B0E14] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-mono outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs text-amber-300 font-bold">
                    سعر السهم بالسوق الحقيقي (EGP)
                  </label>
                  {editingStock.symbol.trim() && (
                    <button
                      type="button"
                      onClick={() => handleFetchSinglePrice(editingStock.symbol, 'edit')}
                      disabled={isFetchingPrice}
                      className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 cursor-pointer"
                    >
                      <Zap className="w-3 h-3 text-amber-300" />
                      <span>{isFetchingPrice ? 'جاري السحب...' : 'سحب سعر البورصة المباشر'}</span>
                    </button>
                  )}
                </div>
                <input
                  type="number"
                  step="0.01"
                  placeholder="أدخل سعر السوق الحقيقي الآن"
                  value={editingStock.marketPrice ?? ''}
                  onChange={(e) =>
                    setEditingStock({
                      ...editingStock,
                      marketPrice: parseFloat(e.target.value) || undefined,
                    })
                  }
                  className="w-full bg-[#0B0E14] border border-amber-500/50 rounded-xl px-3.5 py-2.5 text-sm text-amber-300 font-bold font-mono outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingStock(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-medium hover:bg-slate-700 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-600 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-500 cursor-pointer"
              >
                حفظ التعديلات
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Header Bar for List */}
      <div className="flex items-center justify-between pt-2">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <span>قائمة الأسهم بالحافظة</span>
          <span className="text-xs font-mono text-slate-500">({portfolio.length})</span>
        </h3>

        <div className="flex items-center gap-2 bg-[#161B22] p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'table'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>عرض جدول</span>
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>عرض بطاقات</span>
          </button>
        </div>
      </div>

      {/* Main List */}
      {portfolio.length === 0 ? (
        <div className="bg-[#161B22] border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
          <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">حافظتك فارغة حالياً</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            قم بإضافة أسهمك الحالية وتحديد سعر السهم بالسوق لتتبع الأرباح والخسائر وحساب التبريد بدقة.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/10 hover:bg-emerald-500 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            إضافة أول سهم
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-[#161B22] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="bg-[#0B0E14] text-slate-400 border-b border-slate-800 font-bold">
                  <th className="p-3.5 text-right">السهم والشركة</th>
                  <th className="p-3.5 text-center">الكمية</th>
                  <th className="p-3.5 text-center">متوسط الشراء</th>
                  <th className="p-3.5 text-center bg-amber-500/5 text-amber-300 border-x border-slate-800/60">
                    سعر السهم بالسوق (قابل للتعديل)
                  </th>
                  <th className="p-3.5 text-center">القيمة السوقية</th>
                  <th className="p-3.5 text-center">أرباح / خسائر</th>
                  <th className="p-3.5 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {portfolioWithMetrics.map(({ stock, metrics }) => {
                  const { marketVal, profitLoss, profitLossPercent, hasMarketPrice } = metrics;
                  const draftPrice = inlinePriceDrafts[stock.id];

                  return (
                    <tr key={stock.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span className="bg-[#0B0E14] text-emerald-400 text-[11px] font-mono px-2 py-0.5 rounded border border-slate-800 font-semibold">
                            {stock.symbol}
                          </span>
                          <span className="font-bold text-slate-200">{stock.name}</span>
                        </div>
                      </td>

                      <td className="p-3.5 text-center font-mono font-bold text-slate-100">
                        {stock.shares.toLocaleString('en-US')}
                      </td>

                      <td className="p-3.5 text-center font-mono text-emerald-400 font-bold">
                        {stock.avgPrice.toFixed(2)} EGP
                      </td>

                      <td className="p-3.5 text-center bg-amber-500/5 border-x border-slate-800/60">
                        <div className="flex items-center justify-center gap-1.5">
                          <input
                            type="number"
                            step="0.01"
                            placeholder="سعر السوق"
                            value={
                              draftPrice !== undefined
                                ? draftPrice
                                : stock.marketPrice !== undefined
                                ? String(stock.marketPrice)
                                : ''
                            }
                            onChange={(e) =>
                              setInlinePriceDrafts({
                                ...inlinePriceDrafts,
                                [stock.id]: e.target.value,
                              })
                            }
                            className="w-24 bg-[#0B0E14] border border-amber-500/40 rounded-lg px-2 py-1 text-xs text-amber-300 font-mono font-bold text-center outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                          />
                          {draftPrice !== undefined && (
                            <button
                              onClick={() => handleSaveInlineMarketPrice(stock)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white p-1 rounded-md transition-colors cursor-pointer"
                              title="حفظ سعر السوق المباشر"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="p-3.5 text-center font-mono font-bold text-slate-200">
                        {formatCurrency(marketVal, feeConfig.currency)}
                      </td>

                      <td className="p-3.5 text-center font-mono">
                        {hasMarketPrice ? (
                          <div
                            className={`font-bold flex items-center justify-center gap-1 ${
                              profitLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            <span>
                              {profitLoss >= 0 ? '+' : ''}
                              {profitLoss.toFixed(2)}
                            </span>
                            <span className="text-[10px] opacity-90">
                              ({profitLossPercent >= 0 ? '+' : ''}
                              {profitLossPercent.toFixed(2)}%)
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px] italic">غير محدد</span>
                        )}
                      </td>

                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onSelectForCooling(stock)}
                            className="bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 border border-emerald-500/30 transition-all cursor-pointer"
                            title="إرسال لحاسبة التبريد"
                          >
                            <Calculator className="w-3.5 h-3.5" />
                            <span>تبريد</span>
                          </button>
                          <button
                            onClick={() => setEditingStock(stock)}
                            className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="تعديل السهم وسعر السوق"
                          >
                            <PenLine className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteStock(stock.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="حذف من الحافظة"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolioWithMetrics.map(({ stock, metrics }) => {
            const { marketVal, profitLoss, profitLossPercent, hasMarketPrice } = metrics;
            const draftPrice = inlinePriceDrafts[stock.id];

            return (
              <div
                key={stock.id}
                className="bg-[#161B22] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl space-y-4 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="bg-[#0B0E14] text-emerald-400 text-[11px] font-mono px-2.5 py-0.5 rounded-md border border-slate-800 font-semibold">
                      {stock.symbol}
                    </span>
                    <h4 className="text-base font-bold text-slate-100 mt-1">{stock.name}</h4>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingStock(stock)}
                      className="p-1.5 text-slate-400 hover:text-amber-300 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                      title="تعديل السهم"
                    >
                      <PenLine className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteStock(stock.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                      title="حذف من الحافظة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs bg-[#0B0E14] p-3.5 rounded-xl border border-slate-800">
                  <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-800/80">
                    <div>
                      <span className="text-slate-500 block text-[11px]">عدد الأسهم:</span>
                      <p className="font-bold font-mono text-slate-100 mt-0.5">
                        {stock.shares.toLocaleString('en-US')} سهم
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">متوسط الشراء:</span>
                      <p className="font-bold font-mono text-emerald-400 mt-0.5">
                        {stock.avgPrice.toFixed(2)} EGP
                      </p>
                    </div>
                  </div>

                  <div className="pt-1 space-y-1">
                    <span className="text-amber-300 block text-[11px] font-bold">
                      تعديل سعر السهم بالسوق:
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="أدخل سعر السوق الآن"
                        value={
                          draftPrice !== undefined
                            ? draftPrice
                            : stock.marketPrice !== undefined
                            ? String(stock.marketPrice)
                            : ''
                        }
                        onChange={(e) =>
                          setInlinePriceDrafts({
                            ...inlinePriceDrafts,
                            [stock.id]: e.target.value,
                          })
                        }
                        className="flex-1 bg-[#161B22] border border-amber-500/40 rounded-xl px-3 py-1.5 text-xs text-amber-300 font-bold font-mono outline-none focus:border-amber-400"
                      />
                      {draftPrice !== undefined && (
                        <button
                          onClick={() => handleSaveInlineMarketPrice(stock)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          حفظ
                        </button>
                      )}
                    </div>
                  </div>

                  {hasMarketPrice && (
                    <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center">
                      <span className="text-slate-400 text-[11px]">أرباح/خسائر بالسوق:</span>
                      <span
                        className={`font-bold font-mono ${
                          profitLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {profitLoss >= 0 ? '+' : ''}
                        {profitLoss.toFixed(2)} EGP ({profitLossPercent >= 0 ? '+' : ''}
                        {profitLossPercent.toFixed(2)}%)
                      </span>
                    </div>
                  )}

                  <div className="pt-1 flex justify-between items-center">
                    <span className="text-slate-500 text-[11px]">القيمة السوقية:</span>
                    <span className="font-bold font-mono text-slate-200">
                      {formatCurrency(marketVal, feeConfig.currency)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectForCooling(stock)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
                >
                  <Calculator className="w-4 h-4 text-emerald-400" />
                  <span>إرسال لحاسبة التبريد بسعر السوق</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
