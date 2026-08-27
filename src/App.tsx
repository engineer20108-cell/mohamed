import React, { useState, useEffect } from 'react';
import { FeeConfig, StockItem, AiAdvisorInput } from './types';
import { STANDARD_THNDR_FEE } from './utils/feeCalculator';
import { Header } from './components/Header';
import { AverageCalculator } from './components/AverageCalculator';
import { TargetCalculator } from './components/TargetCalculator';
import { ScenariosMatrix } from './components/ScenariosMatrix';
import { SellingCalculator } from './components/SellingCalculator';
import { PortfolioView } from './components/PortfolioView';
import { FeesBreakdownView } from './components/FeesBreakdownView';
import { AiAdvisorModal } from './components/AiAdvisorModal';
import { ShareModal } from './components/ShareModal';
import { Calculator, Sparkles, Shield } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('average');

  // Fee Config Persistence
  const [feeConfig, setFeeConfig] = useState<FeeConfig>(() => {
    const saved = localStorage.getItem('thndr_fee_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return STANDARD_THNDR_FEE;
      }
    }
    return STANDARD_THNDR_FEE;
  });

  useEffect(() => {
    localStorage.setItem('thndr_fee_config', JSON.stringify(feeConfig));
  }, [feeConfig]);

  // Portfolio State Persistence
  const [portfolio, setPortfolio] = useState<StockItem[]>(() => {
    const saved = localStorage.getItem('thndr_portfolio');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [
      {
        id: '1',
        symbol: 'COMI',
        name: 'البنك التجاري الدولي',
        shares: 26,
        avgPrice: 215.14,
        marketPrice: 139.40,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: '2',
        symbol: 'FWRY',
        name: 'فوري تكنولوجيا البنوك والمدفوعات',
        shares: 500,
        avgPrice: 22.50,
        marketPrice: 19.26,
        lastUpdated: new Date().toISOString(),
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('thndr_portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  // Modals & Prefill State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiData, setAiData] = useState<AiAdvisorInput | null>(null);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareData, setShareData] = useState<any>(null);

  const [prefillData, setPrefillData] = useState<{
    symbol?: string;
    shares?: number;
    avgPrice?: number;
    newPrice?: number;
  } | null>(null);

  const handleAddStock = (newStock: Omit<StockItem, 'id'>) => {
    const item: StockItem = {
      ...newStock,
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString(),
    };
    setPortfolio((prev) => [item, ...prev]);
  };

  const handleUpdateStock = (updatedStock: StockItem) => {
    setPortfolio((prev) =>
      prev.map((item) => (item.id === updatedStock.id ? updatedStock : item))
    );
  };

  const handleDeleteStock = (id: string) => {
    setPortfolio((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSelectForCooling = (stock: StockItem) => {
    setPrefillData({
      symbol: stock.symbol,
      shares: stock.shares,
      avgPrice: stock.avgPrice,
      newPrice: stock.marketPrice || stock.avgPrice,
    });
    setActiveTab('average');
  };

  const handleOpenAiAnalysis = (data: AiAdvisorInput) => {
    setAiData(data);
    setIsAiModalOpen(true);
  };

  const handleOpenShareModal = (data: any) => {
    setShareData(data);
    setIsShareModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans dir-rtl antialiased selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
      {/* Background Subtle Grid & Glow */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div>
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          feeConfig={feeConfig}
          setFeeConfig={setFeeConfig}
        />

        <main className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 py-4 space-y-4">
          {activeTab === 'average' && (
            <AverageCalculator
              feeConfig={feeConfig}
              setFeeConfig={setFeeConfig}
              onSaveToPortfolio={handleAddStock}
              onOpenAiAnalysis={handleOpenAiAnalysis}
              onOpenShareModal={handleOpenShareModal}
              prefillData={prefillData}
            />
          )}

          {activeTab === 'target' && (
            <TargetCalculator
              feeConfig={feeConfig}
              onOpenAiAnalysis={handleOpenAiAnalysis}
            />
          )}

          {activeTab === 'scenarios' && (
            <ScenariosMatrix
              feeConfig={feeConfig}
              onOpenAiAnalysis={handleOpenAiAnalysis}
            />
          )}

          {activeTab === 'exit' && <SellingCalculator feeConfig={feeConfig} />}

          {activeTab === 'portfolio' && (
            <PortfolioView
              portfolio={portfolio}
              feeConfig={feeConfig}
              onAddStock={handleAddStock}
              onUpdateStock={handleUpdateStock}
              onDeleteStock={handleDeleteStock}
              onSelectForCooling={handleSelectForCooling}
            />
          )}

          {activeTab === 'fees' && (
            <FeesBreakdownView feeConfig={feeConfig} setFeeConfig={setFeeConfig} />
          )}

          {activeTab === 'ai' && (
            <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-5 sm:p-6 space-y-5 max-w-3xl mx-auto shadow-xl">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-mono font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-100 font-mono tracking-tight uppercase">
                    المساعد الذكي لتداول الأسهم في ثاندر
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                    تقييم مخاطر التبريد، وحساب مدى انخفاض المتوسط، وتقديم توجيهات إدارة السيولة.
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-mono">
                <div className="bg-[#020617] p-4 rounded border border-slate-800 space-y-2">
                  <h3 className="font-bold text-indigo-400 text-xs flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                    كيف تستفيد من المستشار الذكي؟
                  </h3>
                  <p className="text-slate-300 text-[11px]">
                    1. افتح تبويب <span className="font-bold text-slate-100">"حاسبة المتوسط والتبريد"</span> وأدخل قيم أسهمك الحالية وسعر الشراء الجديد.
                  </p>
                  <p className="text-slate-300 text-[11px]">
                    2. انقر على زر <span className="font-bold text-indigo-400">"تحليل جدوى التبريد بواسطة الذكاء الاصطناعي"</span>.
                  </p>
                  <p className="text-slate-300 text-[11px]">
                    3. ستقوم النماذج الذكية بإعطائك تحليلاً فورياً لمستوى المخاطر وتوجيهات عملية للتنفيذ.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('average')}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold py-2.5 px-4 rounded text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Calculator className="w-4 h-4" />
                  <span>الذهاب إلى حاسبة المتوسط والتبريد الآن</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="px-6 py-3 bg-[#0f172a] border-t border-slate-800 text-[10px] text-slate-400 font-mono flex flex-col sm:flex-row justify-between items-center gap-2">
        <span className="text-slate-500">
          * جميع الحسابات تقريبية بناءً على لائحة عمولات ثاندر والبورصة المصرية الحالية.
        </span>
        <div className="flex items-center gap-3">
          <span className="text-indigo-400 font-bold">THNDR CALC v2.4.0</span>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span className="text-slate-400">حسابات العمولات المعتمدة</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AiAdvisorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        data={aiData}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        data={shareData}
      />
    </div>
  );
}
