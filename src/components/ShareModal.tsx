import React, { useState } from 'react';
import { Share2, X, Check, Copy } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    stockSymbol?: string;
    oldShares?: number;
    oldAvg?: number;
    newShares?: number;
    newPrice?: number;
    newAvgGross?: number;
    newAvgNet?: number;
    totalShares?: number;
    fees?: number;
    changePct?: number;
  } | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, data }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !data) return null;

  const shareText = `
⚡ حاسبة تبريد وتزويد الأسهم - تطبيق ثاندر (Thndr)
----------------------------------------
📌 السهم: ${data.stockSymbol || 'سهم البورصة'}
• عدد الأسهم القديمة: ${data.oldShares} سهم
• متوسط السعر القديم: ${data.oldAvg} ج.م
• كمية الشراء للتبريد: ${data.newShares} سهم
• سعر الشراء الجديد: ${data.newPrice} ج.م
----------------------------------------
🎯 متوسط السعر الجديد: ${data.newAvgGross?.toFixed(3)} ج.م
💸 المتوسط شاملاً كافة العمولات: ${data.newAvgNet?.toFixed(3)} ج.م
📊 إجمالي الأسهم الكلي: ${data.totalShares} سهم
----------------------------------------
تم الحساب بواسطة تطبيق حاسبة أسهم ثاندر التفاعلي.
  `.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 border border-emerald-500/30">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2 uppercase tracking-wider">
              <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
              مشاركة ملخص التبريد
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <pre className="bg-[#020617] border border-slate-800 rounded-lg p-3.5 text-xs sm:text-sm font-mono text-emerald-300 leading-relaxed whitespace-pre-wrap dir-rtl">
          {shareText}
        </pre>

        <div className="flex gap-2 pt-1">
          <button
            onClick={handleCopy}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>تم النسخ للحافظة!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>نسخ النص للمشاركة</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
