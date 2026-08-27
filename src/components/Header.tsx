import React from 'react';
import { FeeConfig } from '../types';
import {
  Calculator,
  Target,
  ChartColumn,
  TrendingUp,
  Briefcase,
  Percent,
  Sparkles,
  CircleHelp
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  feeConfig: FeeConfig;
  setFeeConfig: (config: FeeConfig) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  feeConfig,
}) => {
  const tabs = [
    { id: 'average', label: 'حاسبة المتوسط والتبريد', icon: Calculator },
    { id: 'target', label: 'التبريد المستهدف', icon: Target },
    { id: 'scenarios', label: 'مصفوفة السيناريوهات', icon: ChartColumn },
    { id: 'exit', label: 'حاسبة البيع والربح', icon: TrendingUp },
    { id: 'portfolio', label: 'حافظة الأسهم', icon: Briefcase },
    { id: 'fees', label: 'عمولات ثاندر والبورصة', icon: Percent },
    { id: 'ai', label: 'المساعد الذكي', icon: Sparkles, badge: 'جديد' },
  ];

  return (
    <header className="border-b border-slate-800 bg-[#0f172a] shadow-sm">
      {/* High Density System Status Ticker */}
      <div className="bg-[#020617] border-b border-slate-800/80 px-4 py-1.5 text-xs font-mono flex items-center justify-between text-slate-300">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            SYSTEM OPERATIONAL
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 font-semibold">EGX LIVE SYNC</span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:inline">LATENCY: 12.4ms</span>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <span className="hidden md:inline">FEED: THNDR_CALC_ENGINE</span>
          <span className="text-indigo-300 font-bold">EGX_CORE_v2.4</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-3 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-mono font-black text-xl shrink-0 shadow-md">
              T
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-100">
                  حاسبة ثاندر الذكية للبورصة المصرية
                </h1>
                <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-0.5 rounded border border-emerald-500/30 font-semibold">
                  مباشر EGX
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                حساب التبريد والمتوسطات والعمولات بدقة 100% لتطبيق Thndr
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="px-3.5 py-2 bg-[#020617] rounded-lg text-xs sm:text-sm border border-slate-800 text-slate-200 flex items-center gap-2 font-mono">
              <span className="text-slate-400 font-sans">عمولة ثاندر:</span>
              <span className="text-emerald-400 font-bold">
                {feeConfig.thndrFixedFee > 0
                  ? `${feeConfig.thndrFixedFee} EGP ثابت`
                  : '0.00 EGP'}
                {' + ~0.155%'}
              </span>
            </div>
            <button
              onClick={() => setActiveTab('fees')}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs sm:text-sm font-semibold transition-colors text-white flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <CircleHelp className="w-4 h-4" />
              <span>ضبط العمولات</span>
            </button>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-1.5 py-2 border-t border-slate-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 grow sm:grow-0 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white font-bold shadow-md'
                    : 'bg-[#020617]/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-300'
                  }`}
                />
                <span className="truncate">{tab.label}</span>
                {tab.badge && (
                  <span className="mr-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded border border-emerald-500/30 font-bold shrink-0">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
