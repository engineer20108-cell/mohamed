import { StockQuote } from '../types';

export const EGX_STOCK_DICTIONARY: Record<string, { symbol: string; name: string }> = {
  COMI: { symbol: 'COMI', name: 'البنك التجاري الدولي (CIB)' },
  CIB: { symbol: 'COMI', name: 'البنك التجاري الدولي (CIB)' },
  'تجاري دولي': { symbol: 'COMI', name: 'البنك التجاري الدولي (CIB)' },
  'البنك التجاري الدولي': { symbol: 'COMI', name: 'البنك التجاري الدولي (CIB)' },

  FWRY: { symbol: 'FWRY', name: 'فوري تكنولوجيا البنوك والمدفوعات' },
  FAWRY: { symbol: 'FWRY', name: 'فوري تكنولوجيا البنوك والمدفوعات' },
  'فوري': { symbol: 'FWRY', name: 'فوري تكنولوجيا البنوك والمدفوعات' },
  'فورى': { symbol: 'FWRY', name: 'فوري تكنولوجيا البنوك والمدفوعات' },

  SWDY: { symbol: 'SWDY', name: 'السويدى إليكتريك' },
  ELSEWEDY: { symbol: 'SWDY', name: 'السويدى إليكتريك' },
  'السويدي': { symbol: 'SWDY', name: 'السويدى إليكتريك' },
  'السويدى': { symbol: 'SWDY', name: 'السويدى إليكتريك' },

  TMGH: { symbol: 'TMGH', name: 'مجموعة طلعت مصطفى القابضة' },
  TALAAT: { symbol: 'TMGH', name: 'مجموعة طلعت مصطفى القابضة' },
  'طلعت مصطفى': { symbol: 'TMGH', name: 'مجموعة طلعت مصطفى القابضة' },

  ABUK: { symbol: 'ABUK', name: 'أبو قير للأسمدة والصناعات الكيماوية' },
  'ABOU KIR': { symbol: 'ABUK', name: 'أبو قير للأسمدة والصناعات الكيماوية' },
  'أبو قير': { symbol: 'ABUK', name: 'أبو قير للأسمدة والصناعات الكيماوية' },
  'ابو قير': { symbol: 'ABUK', name: 'أبو قير للأسمدة والصناعات الكيماوية' },

  HRHO: { symbol: 'HRHO', name: 'مجموعة إي إف جي القابضة (هيرمس)' },
  EFG: { symbol: 'HRHO', name: 'مجموعة إي إف جي القابضة (هيرمس)' },
  HERMES: { symbol: 'HRHO', name: 'مجموعة إي إف جي القابضة (هيرمس)' },
  'هيرمس': { symbol: 'HRHO', name: 'مجموعة إي إف جي القابضة (هيرمس)' },

  EAST: { symbol: 'EAST', name: 'الشرقية - إيسترن كومباني' },
  'إيسترن كومباني': { symbol: 'EAST', name: 'الشرقية - إيسترن كومباني' },
  'الشرقية للدخان': { symbol: 'EAST', name: 'الشرقية - إيسترن كومباني' },

  ETEL: { symbol: 'ETEL', name: 'المصرية للاتصالات (WE)' },
  WE: { symbol: 'ETEL', name: 'المصرية للاتصالات (WE)' },
  'المصرية للاتصالات': { symbol: 'ETEL', name: 'المصرية للاتصالات (WE)' },
  'وي': { symbol: 'ETEL', name: 'المصرية للاتصالات (WE)' },

  AMOC: { symbol: 'AMOC', name: 'الإسكندرية للزيوت المعدنية (أموك)' },
  'أموك': { symbol: 'AMOC', name: 'الإسكندرية للزيوت المعدنية (أموك)' },
  'اموك': { symbol: 'AMOC', name: 'الإسكندرية للزيوت المعدنية (أموك)' },

  JUFO: { symbol: 'JUFO', name: 'جهينة للصناعات الغذائية' },
  'جهينة': { symbol: 'JUFO', name: 'جهينة للصناعات الغذائية' },

  ISPH: { symbol: 'ISPH', name: 'ابن سينا فارما' },
  'ابن سينا': { symbol: 'ISPH', name: 'ابن سينا فارما' },

  EFIH: { symbol: 'EFIH', name: 'إي فاينانس للاستثمارات المالية' },
  'إي فاينانس': { symbol: 'EFIH', name: 'إي فاينانس للاستثمارات المالية' },

  ORAS: { symbol: 'ORAS', name: 'أوراسكوم كونستراكشون' },
  'أوراسكوم': { symbol: 'ORAS', name: 'أوراسكوم كونستراكشون' },

  EKHO: { symbol: 'EKHO', name: 'المصرية الكويتية القابضة' },
  'الكويتية القابضة': { symbol: 'EKHO', name: 'المصرية الكويتية القابضة' },

  ADIB: { symbol: 'ADIB', name: 'مصرف أبوظبي الإسلامي - مصر' },
  'أبوظبي الإسلامي': { symbol: 'ADIB', name: 'مصرف أبوظبي الإسلامي - مصر' },

  MFPC: { symbol: 'MFPC', name: 'مصر لإنتاج السماد (موبكو)' },
  MOPCO: { symbol: 'MFPC', name: 'مصر لإنتاج السماد (موبكو)' },
  'موبكو': { symbol: 'MFPC', name: 'مصر لإنتاج السماد (موبكو)' },

  GBCO: { symbol: 'GBCO', name: 'جي بي كورب (غبور أوتو)' },
  'غبور': { symbol: 'GBCO', name: 'جي بي كورب (غبور أوتو)' },

  HELI: { symbol: 'HELI', name: 'مصر الجديدة للإسكان والتعمير' },
  'مصر الجديدة': { symbol: 'HELI', name: 'مصر الجديدة للإسكان والتعمير' },

  MNHD: { symbol: 'MNHD', name: 'مدينة مصر للإسكان والتعمير' },
  'مدينة مصر': { symbol: 'MNHD', name: 'مدينة مصر للإسكان والتعمير' },

  PHDC: { symbol: 'PHDC', name: 'بالم هيلز للتعمير' },
  'بالم هيلز': { symbol: 'PHDC', name: 'بالم هيلز للتعمير' },

  ORWE: { symbol: 'ORWE', name: 'النساجون الشرقيون' },
  'النساجون': { symbol: 'ORWE', name: 'النساجون الشرقيون' },

  ESRS: { symbol: 'ESRS', name: 'عز للصلب (حديد عز)' },
  'عز للصلب': { symbol: 'ESRS', name: 'عز للصلب (حديد عز)' },
  'حديد عز': { symbol: 'ESRS', name: 'عز للصلب (حديد عز)' },

  EGCH: { symbol: 'EGCH', name: 'الصناعات الكيماوية المصرية (كيما)' },
  'كيما': { symbol: 'EGCH', name: 'الصناعات الكيماوية المصرية (كيما)' },

  CICH: { symbol: 'CICH', name: 'سي آي كابيتال القابضة' },
  'سي آي كابيتال': { symbol: 'CICH', name: 'سي آي كابيتال القابضة' },

  ALCN: { symbol: 'ALCN', name: 'الإسكندرية لتداول الحاويات والبضائع' },
  'إسكندرية للحاويات': { symbol: 'ALCN', name: 'الإسكندرية لتداول الحاويات والبضائع' },

  SKPC: { symbol: 'SKPC', name: 'سيدي كرير للبتروكيماويات' },
  'سيدي كرير': { symbol: 'SKPC', name: 'سيدي كرير للبتروكيماويات' },

  EGAL: { symbol: 'EGAL', name: 'مصر للألومنيوم' },
  'مصر للألومنيوم': { symbol: 'EGAL', name: 'مصر للألومنيوم' },

  ORHD: { symbol: 'ORHD', name: 'أوراسكوم للتنمية مصر' },
  RAYA: { symbol: 'RAYA', name: 'راية القابضة للاستثمارات المالية' },
  'راية': { symbol: 'RAYA', name: 'راية القابضة للاستثمارات المالية' },
};

export const FALLBACK_QUOTES: Record<string, { price: number; name: string; changePercent: number }> = {
  COMI: { price: 139.40, name: 'البنك التجاري الدولي (CIB)', changePercent: 1.75 },
  FWRY: { price: 19.26, name: 'فوري تكنولوجيا البنوك والمدفوعات', changePercent: 0.31 },
  SWDY: { price: 119.00, name: 'السويدى إليكتريك', changePercent: 2.58 },
  TMGH: { price: 98.25, name: 'مجموعة طلعت مصطفى القابضة', changePercent: 0.56 },
  ABUK: { price: 76.70, name: 'أبو قير للأسمدة والصناعات الكيماوية', changePercent: 1.56 },
  HRHO: { price: 26.47, name: 'مجموعة إي إف جي القابضة (هيرمس)', changePercent: 0.65 },
  EAST: { price: 36.20, name: 'الشرقية - إيسترن كومباني', changePercent: 0.50 },
  ETEL: { price: 117.90, name: 'المصرية للاتصالات (WE)', changePercent: 0.10 },
  AMOC: { price: 11.40, name: 'الإسكندرية للزيوت المعدنية (أموك)', changePercent: 0.79 },
  JUFO: { price: 26.76, name: 'جهينة للصناعات الغذائية', changePercent: 1.20 },
  ISPH: { price: 13.44, name: 'ابن سينا فارما', changePercent: 3.22 },
  EFIH: { price: 24.70, name: 'إي فاينانس للاستثمارات المالية', changePercent: 0.80 },
  ORAS: { price: 788.80, name: 'أوراسكوم كونستراكشون', changePercent: 0.40 },
  EKHO: { price: 42.00, name: 'المصرية الكويتية القابضة', changePercent: 0.00 },
  ADIB: { price: 54.19, name: 'مصرف أبوظبي الإسلامي - مصر', changePercent: 1.10 },
  MFPC: { price: 39.55, name: 'مصر لإنتاج السماد (موبكو)', changePercent: 1.07 },
  GBCO: { price: 29.65, name: 'جي بي كورب (غبور أوتو)', changePercent: 0.90 },
  HELI: { price: 7.76, name: 'مصر الجديدة للإسكان والتعمير', changePercent: -0.25 },
  MNHD: { price: 3.90, name: 'مدينة مصر للإسكان والتعمير', changePercent: 0.50 },
  PHDC: { price: 15.25, name: 'بالم هيلز للتعمير', changePercent: 1.30 },
  ORWE: { price: 25.65, name: 'النساجون الشرقيون', changePercent: 0.45 },
  ESRS: { price: 18.30, name: 'عز للصلب (حديد عز)', changePercent: 0.20 },
  EGCH: { price: 14.13, name: 'الصناعات الكيماوية المصرية (كيما)', changePercent: -0.15 },
  CICH: { price: 12.30, name: 'سي آي كابيتال القابضة', changePercent: 0.30 },
  ALCN: { price: 32.00, name: 'الإسكندرية لتداول الحاويات والبضائع', changePercent: 0.70 },
  SKPC: { price: 17.93, name: 'سيدي كرير للبتروكيماويات', changePercent: 0.40 },
  EGAL: { price: 334.80, name: 'مصر للألومنيوم', changePercent: 1.80 },
  ORHD: { price: 41.48, name: 'أوراسكوم للتنمية مصر', changePercent: 0.20 },
  RAYA: { price: 7.11, name: 'راية القابضة للاستثمارات المالية', changePercent: -0.10 },
};

export function resolveSymbol(rawInput: string): string {
  if (!rawInput) return '';
  const trimmed = rawInput.trim();
  const upper = trimmed.toUpperCase().replace(/\.CA$/i, '').replace(/:EGX$/i, '');

  if (EGX_STOCK_DICTIONARY[trimmed]) return EGX_STOCK_DICTIONARY[trimmed].symbol;
  if (EGX_STOCK_DICTIONARY[upper]) return EGX_STOCK_DICTIONARY[upper].symbol;

  return upper;
}

export function getCompanyName(rawInput: string): string {
  const trimmed = rawInput.trim();
  const upper = trimmed.toUpperCase().replace(/\.CA$/i, '').replace(/:EGX$/i, '');

  if (EGX_STOCK_DICTIONARY[trimmed]) return EGX_STOCK_DICTIONARY[trimmed].name;
  if (EGX_STOCK_DICTIONARY[upper]) return EGX_STOCK_DICTIONARY[upper].name;

  const symbol = resolveSymbol(rawInput);
  if (FALLBACK_QUOTES[symbol]) return FALLBACK_QUOTES[symbol].name;

  return rawInput;
}

export async function fetchStockQuote(rawSymbol: string): Promise<StockQuote | null> {
  const symbol = resolveSymbol(rawSymbol);
  if (!symbol) return null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`/api/stock-price?symbol=${encodeURIComponent(symbol)}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.quote) {
        return data.quote;
      }
    }
  } catch (err) {
    console.warn(`Server API quote fetch failed for ${symbol}, trying client fallback...`, err);
  }

  // Client TradingView Scan fallback
  try {
    const tvRes = await fetch('https://scanner.tradingview.com/egypt/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symbols: { tickers: [`EGX:${symbol}`] },
        columns: ['close', 'change', 'change_abs', 'description', 'currency'],
      }),
    });

    if (tvRes.ok) {
      const tvData = await tvRes.json();
      if (tvData && Array.isArray(tvData.data) && tvData.data.length > 0) {
        const d = tvData.data[0].d;
        if (d && typeof d[0] === 'number' && d[0] > 0) {
          const price = d[0];
          const changePercent = typeof d[1] === 'number' ? d[1] : 0;
          const changeAbs = typeof d[2] === 'number' ? d[2] : 0;
          const name = getCompanyName(symbol);
          return {
            symbol,
            ticker: `EGX:${symbol}`,
            price: Number(price.toFixed(2)),
            previousClose: Number((price - changeAbs).toFixed(2)),
            change: Number(changeAbs.toFixed(2)),
            changePercent: Number(changePercent.toFixed(2)),
            currency: d[4] || 'EGP',
            name: d[3] ? `${name} (${d[3]})` : name,
            source: 'TradingView (البورصة المصرية EGX)',
            lastUpdated: new Date().toISOString(),
          };
        }
      }
    }
  } catch (err) {
    console.warn('Client fallback fetch failed:', err);
  }

  // Fallback quote dictionary
  const fallback = FALLBACK_QUOTES[symbol];
  if (fallback) {
    return {
      symbol,
      ticker: `EGX:${symbol}`,
      price: fallback.price,
      previousClose: fallback.price,
      change: 0,
      changePercent: fallback.changePercent || 0,
      currency: 'EGP',
      name: fallback.name,
      source: 'بيانات مرجعية بالبورصة المصرية',
      lastUpdated: new Date().toISOString(),
    };
  }

  return null;
}

export async function fetchBatchStockQuotes(symbols: string[]): Promise<Record<string, StockQuote>> {
  if (!Array.isArray(symbols) || symbols.length === 0) return {};

  const quotesMap: Record<string, StockQuote> = {};

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const res = await fetch('/api/batch-stock-prices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbols }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.quotes && Object.keys(data.quotes).length > 0) {
        Object.keys(data.quotes).forEach((key) => {
          const quote = data.quotes[key];
          quotesMap[key.toUpperCase()] = quote;
          if (quote.symbol) {
            quotesMap[quote.symbol.toUpperCase()] = quote;
          }
        });
        return quotesMap;
      }
    }
  } catch (err) {
    console.warn('Batch stock price API failed, fetching individually...', err);
  }

  await Promise.all(
    symbols.map(async (raw) => {
      const canonical = resolveSymbol(raw);
      if (!quotesMap[canonical.toUpperCase()] && !quotesMap[raw.toUpperCase()]) {
        const quote = await fetchStockQuote(raw);
        if (quote) {
          quotesMap[canonical.toUpperCase()] = quote;
          quotesMap[raw.toUpperCase()] = quote;
        }
      }
    })
  );

  return quotesMap;
}
