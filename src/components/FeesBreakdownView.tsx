import React from 'react';
import { FeeConfig } from '../types';
import {
  STANDARD_THNDR_FEE,
  FREE_TRADER_THNDR_FEE,
  EXPRESS_THNDR_FEE,
} from '../utils/feeCalculator';
import { Percent, CheckCircle2, SlidersVertical } from 'lucide-react';

interface FeesBreakdownViewProps {
  feeConfig: FeeConfig;
  setFeeConfig: (config: FeeConfig) => void;
}

export const FeesBreakdownView: React.FC<FeesBreakdownViewProps> = ({
  feeConfig,
  setFeeConfig,
}) => {
  return (
    <div className="space-y-4">
      {/* Preset Selection Banner */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 sm:p-5 shadow-sm space-y-3.5">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 border border-emerald-500/30 shrink-0">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2 uppercase tracking-wider">
              <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
              تفاصيل عمولات وتكاليف التداول في تطبيق ثاندر
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              اختر نظام الحساب الخاص بك في ثاندر ليتم تطبيق حسابات التبريد والعمولات بدقة 100%.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
          {/* Preset 1 */}
          <div
            onClick={() => setFeeConfig(STANDARD_THNDR_FEE)}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              feeConfig.preset === 'thndr_egx_standard'
                ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-100 shadow-sm'
                : 'bg-[#020617] border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs sm:text-sm text-emerald-300">
                1. ثاندر العادي (Standard)
              </span>
              {feeConfig.preset === 'thndr_egx_standard' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              • رسم ثابت إجمالي 5 جنيه لكل أمر (2 ج ثاندر + 3 ج البورصة/المقاصة).
              <br />• عمولة سمسرة 0.10% + رسوم الهيئة والبورصة 0.03%.
            </p>
          </div>

          {/* Preset 2 */}
          <div
            onClick={() => setFeeConfig(FREE_TRADER_THNDR_FEE)}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              feeConfig.preset === 'thndr_trader_free'
                ? 'bg-amber-500/10 border-amber-500/40 text-slate-100 shadow-sm'
                : 'bg-[#020617] border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs sm:text-sm text-amber-300">
                2. ثاندر تريدر (تداول مجاني)
              </span>
              {feeConfig.preset === 'thndr_trader_free' && (
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              • بدون رسم ثابت (0 جنيه).
              <br />• 0% عمولة سمسرة (أول 50 عملية تداول شهرياً) + رسوم البورصة 0.03% فقط.
            </p>
          </div>

          {/* Preset 3 */}
          <div
            onClick={() => setFeeConfig(EXPRESS_THNDR_FEE)}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              feeConfig.preset === 'thndr_express'
                ? 'bg-teal-500/10 border-teal-500/40 text-slate-100 shadow-sm'
                : 'bg-[#020617] border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs sm:text-sm text-teal-300">
                3. ثاندر إكسبريس (Express)
              </span>
              {feeConfig.preset === 'thndr_express' && (
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              • بدون رسم ثابت (0 جنيه).
              <br />• عمولة سمسرة مخفضة 0.05% + رسوم البورصة والمقاصة.
            </p>
          </div>
        </div>
      </div>

      {/* Breakdown Details */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 sm:p-5 shadow-sm space-y-3.5">
        <h3 className="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
          تفكيك العمولات الدقيقة المعتمدة في البورصة المصرية (EGX)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs sm:text-sm">
          <div className="bg-[#020617] p-3.5 rounded-lg border border-slate-800 space-y-1">
            <span className="text-slate-300 font-semibold text-xs sm:text-sm">1. رسم ثاندر الثابت</span>
            <div className="text-lg font-bold font-mono text-amber-400">
              {feeConfig.thndrFixedFee} EGP / أمر
            </div>
            <p className="text-xs text-slate-400">
              يحتسب لمرة واحدة مع كل أمر شراء أو بيع منفذ.
            </p>
          </div>

          <div className="bg-[#020617] p-3.5 rounded-lg border border-slate-800 space-y-1">
            <span className="text-slate-300 font-semibold text-xs sm:text-sm">2. عمولة البورصة (EGX)</span>
            <div className="text-lg font-bold font-mono text-teal-300">0.0125%</div>
            <p className="text-xs text-slate-400">رسوم التداول المقررة للبورصة المصرية.</p>
          </div>

          <div className="bg-[#020617] p-3.5 rounded-lg border border-slate-800 space-y-1">
            <span className="text-slate-300 font-semibold text-xs sm:text-sm">3. شركة المقاصة (MCDR)</span>
            <div className="text-lg font-bold font-mono text-teal-300">0.0125%</div>
            <p className="text-xs text-slate-400">رسوم الحفظ المركزي والتسوية للأسهم.</p>
          </div>

          <div className="bg-[#020617] p-3.5 rounded-lg border border-slate-800 space-y-1">
            <span className="text-slate-300 font-semibold text-xs sm:text-sm">4. هيئة الرقابة المالية (FRA)</span>
            <div className="text-lg font-bold font-mono text-teal-300">0.005%</div>
            <p className="text-xs text-slate-400">رسوم هيئة الرقابة على الأسواق المالية.</p>
          </div>
        </div>

        {/* Custom Override Controls */}
        <div className="bg-[#020617] p-4 rounded-lg border border-slate-800 space-y-3 pt-3.5">
          <div className="flex items-center gap-2">
            <SlidersVertical className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs sm:text-sm font-bold text-slate-200">
              تخصيص القيم يدويًا (في حال تغير اللوائح):
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs sm:text-sm">
            <div>
              <label className="block text-slate-300 text-xs sm:text-sm font-semibold mb-1.5">الرسم الثابت لثاندر (EGP)</label>
              <input
                type="number"
                step="0.5"
                value={feeConfig.thndrFixedFee}
                onChange={(e) =>
                  setFeeConfig({
                    ...feeConfig,
                    preset: 'custom',
                    thndrFixedFee: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full bg-[#0f172a] border border-slate-800 rounded-lg p-2.5 text-slate-100 font-bold font-mono text-xs sm:text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-xs sm:text-sm font-semibold mb-1.5">عمولة السمسرة المباشرة (%)</label>
              <input
                type="number"
                step="0.005"
                value={feeConfig.brokerPercent}
                onChange={(e) =>
                  setFeeConfig({
                    ...feeConfig,
                    preset: 'custom',
                    brokerPercent: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full bg-[#0f172a] border border-slate-800 rounded-lg p-2.5 text-slate-100 font-bold font-mono text-xs sm:text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-xs sm:text-sm font-semibold mb-1.5">
                الحد الأدنى لعمولة الأمر (EGP)
              </label>
              <input
                type="number"
                step="0.5"
                value={feeConfig.minFee}
                onChange={(e) =>
                  setFeeConfig({
                    ...feeConfig,
                    preset: 'custom',
                    minFee: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full bg-[#0f172a] border border-slate-800 rounded-lg p-2.5 text-slate-100 font-bold font-mono text-xs sm:text-sm outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
