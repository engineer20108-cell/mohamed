import React, { useState, useEffect } from 'react';
import { AiAdvisorInput } from '../types';
import { Sparkles, X, RefreshCw, CircleAlert } from 'lucide-react';

interface AiAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: AiAdvisorInput | null;
}

export const AiAdvisorModal: React.FC<AiAdvisorModalProps> = ({ isOpen, onClose, data }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && data) {
      runAnalysis();
    } else {
      setAnalysis(null);
      setError(null);
    }
  }, [isOpen, data]);

  const runAnalysis = async () => {
    if (!data) return;

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    const oldTotal = data.currentShares * data.currentAvgPrice;
    const newTotal = data.newShares * data.newPrice;
    const totalShares = data.currentShares + data.newShares;
    const combinedCost = oldTotal + newTotal;
    const newAvg = totalShares > 0 ? (combinedCost / totalShares).toFixed(2) : '0';
    const reductionEgp = (data.currentAvgPrice - Number(newAvg)).toFixed(2);
    const reductionPct =
      data.currentAvgPrice > 0
        ? (((data.currentAvgPrice - Number(newAvg)) / data.currentAvgPrice) * 100).toFixed(1)
        : '0';

    const clientFallbackText = `
1. **تقييم جدوى التبريد لـ ${data.stockSymbol || 'السهم'}**:
شراء **${data.newShares} سهم** إضافي بسعر **${data.newPrice} ج.م** يتطلب سيولة قدرها **${newTotal.toLocaleString()} ج.م**. هذا التبريد يقلل متوسط سعر السهم من **${data.currentAvgPrice} ج.م** إلى **${newAvg} ج.م** (تحسين في التكلفة بنسبة **${reductionPct}%** أو توفير **${reductionEgp} ج.م** لكل سهم).

2. **تحليل هيكل المحفظة والمخاطر**:
إجمالي الكمية المملوكة سينتقل إلى **${totalShares} سهم** بتكلفة كلية قدرها **${combinedCost.toLocaleString()} ج.م**. تقليل متوسط التكلفة يقرّبك بشكل ملحوظ من نقطة التعادل (Break-even Point) ويختصر المسافة لتجاوز مرحلة الهبوط عند أول ارتداد للبورصة المصرية.

3. **التوصية الاستراتيجية لتنفيذ الأمر**:
- **تنوع المحفظة**: يوصى بألا تتجاوز القيمة الكلية لهذا السهم أكثر من **25%** من محفظتك في ثاندر/مباشر للحفاظ على التوازن الاحترافي.
- **تكتيك الشراء**: في حال هبوط السوق، يمكن تقسيم الكمية المبردة (${data.newShares} سهم) على جزأين لتأمين أفضل سعر متوسط.
- **خطة الخروج والأرباح**: فور ارتداد السهم ووصوله إلى المتوسط الجديد (**${newAvg} ج.م** شاملة العمولات)، يُفضل بيع جزء من الكمية لاستعادة السيولة واستغلال الفرص في أسهم أخرى.
    `.trim();

    try {
      const res = await fetch('/api/ai-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        setAnalysis(clientFallbackText);
      } else {
        setAnalysis(json.analysis);
      }
    } catch {
      setAnalysis(clientFallbackText);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2 uppercase tracking-wider">
                <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                تحليل الذكاء الاصطناعي لتبريد السهم
              </h3>
              <p className="text-xs text-slate-400 font-mono font-bold mt-0.5">{data.stockSymbol}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Overview */}
        <div className="grid grid-cols-2 gap-2.5 text-xs sm:text-sm bg-[#020617] p-3 rounded-lg border border-slate-800">
          <div>
            <span className="text-slate-400 block text-xs">عدد الأسهم الحالية:</span>
            <span className="font-bold font-mono text-slate-200">{data.currentShares}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-xs">المتوسط الحالي:</span>
            <span className="font-bold font-mono text-amber-400">
              {data.currentAvgPrice} EGP
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-xs">كمية الشراء للتبريد:</span>
            <span className="font-bold font-mono text-emerald-400">
              {data.newShares} سهم
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-xs">سعر التبريد الجديد:</span>
            <span className="font-bold font-mono text-teal-300">{data.newPrice} EGP</span>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="py-8 text-center space-y-2">
            <RefreshCw className="w-7 h-7 text-emerald-400 animate-spin mx-auto" />
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              جاري قياس الجدوى وإدارة المخاطر بواسطة Gemini AI...
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {error && (
              <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg text-amber-300 text-xs sm:text-sm flex items-center gap-2">
                <CircleAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="bg-[#020617] border border-slate-800 rounded-lg p-3.5 text-xs sm:text-sm text-slate-200 leading-relaxed space-y-2.5 max-h-72 overflow-y-auto">
              {analysis
                ? analysis.split('\n').map((line, i) => {
                    if (!line.trim()) return null;
                    const parts = line.split(/(\*\*.*?\*\*)/g);
                    return (
                      <p key={i} className="flex items-start gap-2 text-xs sm:text-sm leading-relaxed">
                        <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                        <span>
                          {parts.map((p, j) =>
                            p.startsWith('**') && p.endsWith('**') ? (
                              <strong key={j} className="text-emerald-300 font-bold">
                                {p.slice(2, -2)}
                              </strong>
                            ) : (
                              p
                            )
                          )}
                        </span>
                      </p>
                    );
                  })
                : null}
            </div>
          </div>
        )}

        {/* Action */}
        <div className="flex justify-end pt-1">
          <button
            onClick={onClose}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold py-2.5 rounded-lg text-xs sm:text-sm transition-colors border border-slate-700 cursor-pointer"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
};
