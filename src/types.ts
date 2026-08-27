export interface FeeConfig {
  preset: 'thndr_egx_standard' | 'thndr_express' | 'thndr_trader_free' | 'custom';
  thndrFixedFee: number; // e.g. 5 EGP (2 Thndr + 3 EGX/MCDR)
  egxFeePercent: number; // e.g. 0.0125%
  mcdrFeePercent: number; // e.g. 0.0125%
  fraFeePercent: number; // e.g. 0.005%
  brokerPercent: number; // e.g. 0.10%
  custodyFeePercent?: number;
  minFee: number;
  applyStampDuty?: boolean;
  totalFeePercentOverride?: number;
  currency: 'EGP' | 'USD' | 'SAR';
}

export interface StockItem {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  marketPrice?: number;
  lastUpdated?: string;
}

export interface OrderFees {
  thndrFixed: number;
  egxRegulatory: number;
  brokerFee: number;
  totalFees: number;
  feePercentOfGross: number;
}

export interface OrderDetails {
  oldShares: number;
  oldAvgPrice: number;
  oldTotalCost: number;
  newShares: number;
  newPrice: number;
  newGrossValue: number;
  newOrderFees: OrderFees;
  newNetTotal: number;
  totalShares: number;
  totalGrossCost: number;
  totalNetCostWithFees: number;
  newAvgPriceGross: number;
  newAvgPriceNet: number;
  priceDifference: number;
  avgPriceChangePercent: number;
  isCoolingDown: boolean;
  isScalingUp: boolean;
  costReductionEgp: number;
  breakEvenSellPrice: number;
}

export interface TargetCalcResult {
  targetAvgPrice: number;
  currentShares: number;
  currentAvgPrice: number;
  marketPriceToBuy: number;
  requiredShares: number;
  requiredGrossCapital: number;
  estimatedBuyFees: OrderFees;
  requiredTotalCapital: number;
  isPossible: boolean;
  errorMessage?: string;
}

export interface SellCalcResult {
  totalShares: number;
  buyAvgPrice: number;
  sellPrice: number;
  grossSalesValue: number;
  sellFees: OrderFees;
  netSalesProceeds: number;
  totalBuyCostWithFees: number;
  netProfitOrLoss: number;
  netProfitPercent: number;
  breakEvenPrice: number;
}

export interface ScenarioRow {
  dropPercent: number;
  newPrice: number;
  multiplier: number;
  newShares: number;
  newGrossCost: number;
  newAvgPrice: number;
  reductionPercent: number;
}

export interface StockQuote {
  symbol: string;
  ticker: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  currency: string;
  name: string;
  source: string;
  lastUpdated: string;
}

export interface AiAdvisorInput {
  stockSymbol: string;
  currentShares: number;
  currentAvgPrice: number;
  newShares: number;
  newPrice: number;
  dropPercentage?: string;
}
