import { FeeConfig, OrderFees, OrderDetails, TargetCalcResult, SellCalcResult, ScenarioRow } from '../types';

export const STANDARD_THNDR_FEE: FeeConfig = {
  preset: 'thndr_egx_standard',
  thndrFixedFee: 5, // 2 EGP Thndr + 3 EGP EGX/MCDR fixed
  egxFeePercent: 0.0125,
  mcdrFeePercent: 0.0125,
  fraFeePercent: 0.005,
  brokerPercent: 0.10,
  custodyFeePercent: 0,
  minFee: 5,
  applyStampDuty: false,
  currency: 'EGP'
};

export const EXPRESS_THNDR_FEE: FeeConfig = {
  preset: 'thndr_express',
  thndrFixedFee: 0,
  egxFeePercent: 0.0125,
  mcdrFeePercent: 0.0125,
  fraFeePercent: 0.005,
  brokerPercent: 0.05,
  custodyFeePercent: 0,
  minFee: 0,
  applyStampDuty: false,
  currency: 'EGP'
};

export const FREE_TRADER_THNDR_FEE: FeeConfig = {
  preset: 'thndr_trader_free',
  thndrFixedFee: 0,
  egxFeePercent: 0.0125,
  mcdrFeePercent: 0.0125,
  fraFeePercent: 0.005,
  brokerPercent: 0,
  custodyFeePercent: 0,
  minFee: 0,
  applyStampDuty: false,
  currency: 'EGP'
};

export function calculateFees(grossValue: number, config: FeeConfig = STANDARD_THNDR_FEE): OrderFees {
  if (grossValue <= 0) {
    return {
      thndrFixed: 0,
      egxRegulatory: 0,
      brokerFee: 0,
      totalFees: 0,
      feePercentOfGross: 0,
    };
  }

  let totalPercent: number;
  if (config.totalFeePercentOverride !== undefined && config.totalFeePercentOverride >= 0) {
    totalPercent = config.totalFeePercentOverride;
  } else {
    totalPercent =
      config.egxFeePercent +
      config.mcdrFeePercent +
      config.fraFeePercent +
      config.brokerPercent +
      (config.custodyFeePercent || 0);
  }

  const egxRegPercent =
    config.egxFeePercent +
    config.mcdrFeePercent +
    config.fraFeePercent +
    (config.custodyFeePercent || 0);

  const egxRegulatory = grossValue * (egxRegPercent / 100);
  const brokerFee = grossValue * (config.brokerPercent / 100);
  const thndrFixed = config.thndrFixedFee;

  let totalFees = grossValue * (totalPercent / 100) + thndrFixed;

  if (config.minFee > 0 && totalFees < config.minFee) {
    totalFees = config.minFee;
  }

  const feePercentOfGross = grossValue > 0 ? (totalFees / grossValue) * 100 : 0;

  return {
    thndrFixed,
    egxRegulatory,
    brokerFee,
    totalFees,
    feePercentOfGross,
  };
}

export function calculateCoolingOrder(
  current: { shares: number; avgPrice: number },
  newOrder: { shares: number; price: number },
  config: FeeConfig = STANDARD_THNDR_FEE
): OrderDetails {
  const oldShares = Math.max(0, current.shares);
  const oldAvgPrice = Math.max(0, current.avgPrice);
  const oldTotalCost = oldShares * oldAvgPrice;

  const newShares = Math.max(0, newOrder.shares);
  const newPrice = Math.max(0, newOrder.price);
  const newGrossValue = newShares * newPrice;

  const newOrderFees = calculateFees(newGrossValue, config);
  const newNetTotal = newGrossValue + newOrderFees.totalFees;

  const totalShares = oldShares + newShares;
  const totalGrossCost = oldTotalCost + newGrossValue;
  const totalNetCostWithFees = oldTotalCost + newNetTotal;

  const newAvgPriceGross = totalShares > 0 ? totalGrossCost / totalShares : 0;
  const newAvgPriceNet = totalShares > 0 ? totalNetCostWithFees / totalShares : 0;

  const priceDifference = newAvgPriceGross - oldAvgPrice;
  const avgPriceChangePercent =
    oldAvgPrice > 0 ? (priceDifference / oldAvgPrice) * 100 : 0;

  const isCoolingDown = newAvgPriceGross < oldAvgPrice && oldShares > 0;
  const isScalingUp = newAvgPriceGross >= oldAvgPrice && oldShares > 0;
  const costReductionEgp = isCoolingDown ? (oldAvgPrice - newAvgPriceGross) * totalShares : 0;

  const breakEvenSellPrice = calculateBreakEvenPrice(totalShares, totalNetCostWithFees, config);

  return {
    oldShares,
    oldAvgPrice,
    oldTotalCost,
    newShares,
    newPrice,
    newGrossValue,
    newOrderFees,
    newNetTotal,
    totalShares,
    totalGrossCost,
    totalNetCostWithFees,
    newAvgPriceGross,
    newAvgPriceNet,
    priceDifference,
    avgPriceChangePercent,
    isCoolingDown,
    isScalingUp,
    costReductionEgp,
    breakEvenSellPrice,
  };
}

export function calculateTargetCooling(
  currentShares: number,
  currentAvgPrice: number,
  targetAvgPrice: number,
  marketPriceToBuy: number,
  config: FeeConfig = STANDARD_THNDR_FEE
): TargetCalcResult {
  if (currentShares <= 0 || currentAvgPrice <= 0) {
    return {
      targetAvgPrice,
      currentShares,
      currentAvgPrice,
      marketPriceToBuy,
      requiredShares: 0,
      requiredGrossCapital: 0,
      estimatedBuyFees: calculateFees(0, config),
      requiredTotalCapital: 0,
      isPossible: false,
      errorMessage: 'يرجى إدخال عدد الأسهم الحالية ومتوسط السعر الحالي بشكل صحيح.',
    };
  }

  if (targetAvgPrice >= currentAvgPrice) {
    return {
      targetAvgPrice,
      currentShares,
      currentAvgPrice,
      marketPriceToBuy,
      requiredShares: 0,
      requiredGrossCapital: 0,
      estimatedBuyFees: calculateFees(0, config),
      requiredTotalCapital: 0,
      isPossible: false,
      errorMessage: 'المتوسط المستهدف يجب أن يكون أقل من المتوسط الحالي لحساب التبريد.',
    };
  }

  if (marketPriceToBuy >= targetAvgPrice) {
    return {
      targetAvgPrice,
      currentShares,
      currentAvgPrice,
      marketPriceToBuy,
      requiredShares: 0,
      requiredGrossCapital: 0,
      estimatedBuyFees: calculateFees(0, config),
      requiredTotalCapital: 0,
      isPossible: false,
      errorMessage: `سعر الشراء بالسوق (${marketPriceToBuy} ج.م) يجب أن يكون أقل من المتوسط المستهدف (${targetAvgPrice} ج.م) للتمكن من الوصول إليه.`,
    };
  }

  // Exact formula: (N_old * (P_target - P_old)) / (P_market - P_target)
  const exactShares = (currentShares * (targetAvgPrice - currentAvgPrice)) / (marketPriceToBuy - targetAvgPrice);
  const requiredShares = Math.ceil(exactShares);
  const requiredGrossCapital = requiredShares * marketPriceToBuy;
  const estimatedBuyFees = calculateFees(requiredGrossCapital, config);
  const requiredTotalCapital = requiredGrossCapital + estimatedBuyFees.totalFees;

  return {
    targetAvgPrice,
    currentShares,
    currentAvgPrice,
    marketPriceToBuy,
    requiredShares,
    requiredGrossCapital,
    estimatedBuyFees,
    requiredTotalCapital,
    isPossible: requiredShares > 0,
  };
}

export function calculateSellingOrder(
  shares: number,
  buyAvgPrice: number,
  sellPrice: number,
  config: FeeConfig = STANDARD_THNDR_FEE
): SellCalcResult {
  const grossSalesValue = shares * sellPrice;
  const sellFees = calculateFees(grossSalesValue, config);
  const netSalesProceeds = grossSalesValue - sellFees.totalFees;

  const buyGrossValue = shares * buyAvgPrice;
  const buyFees = calculateFees(buyGrossValue, config);
  const totalBuyCostWithFees = buyGrossValue + buyFees.totalFees;

  const netProfitOrLoss = netSalesProceeds - totalBuyCostWithFees;
  const netProfitPercent = totalBuyCostWithFees > 0 ? (netProfitOrLoss / totalBuyCostWithFees) * 100 : 0;

  const breakEvenPrice = calculateBreakEvenPrice(shares, totalBuyCostWithFees, config);

  return {
    totalShares: shares,
    buyAvgPrice,
    sellPrice,
    grossSalesValue,
    sellFees,
    netSalesProceeds,
    totalBuyCostWithFees,
    netProfitOrLoss,
    netProfitPercent,
    breakEvenPrice,
  };
}

export function calculateBreakEvenPrice(
  shares: number,
  totalNetCostWithFees: number,
  config: FeeConfig = STANDARD_THNDR_FEE
): number {
  if (shares <= 0) return 0;

  const totalFeePercent =
    (config.totalFeePercentOverride ??
      config.egxFeePercent +
        config.mcdrFeePercent +
        config.fraFeePercent +
        config.brokerPercent +
        (config.custodyFeePercent || 0)) / 100;

  const netFactor = shares * (1 - totalFeePercent);
  if (netFactor <= 0) return totalNetCostWithFees / shares;

  const breakEven = (totalNetCostWithFees + config.thndrFixedFee) / netFactor;
  return Number(breakEven.toFixed(3));
}

export function generateScenariosMatrix(
  current: { shares: number; avgPrice: number },
  quantityMultiplier: number = 1,
  config: FeeConfig = STANDARD_THNDR_FEE
): ScenarioRow[] {
  const drops = [5, 10, 15, 20, 25, 30, 40];
  const matrix: ScenarioRow[] = [];

  if (current.shares <= 0 || current.avgPrice <= 0) return matrix;

  drops.forEach((drop) => {
    const newPrice = Number((current.avgPrice * (1 - drop / 100)).toFixed(2));
    const newShares = Math.round(current.shares * quantityMultiplier);
    const newGrossCost = newShares * newPrice;

    const result = calculateCoolingOrder(
      current,
      { shares: newShares, price: newPrice },
      config
    );

    const reductionPercent =
      current.avgPrice > 0
        ? ((current.avgPrice - result.newAvgPriceGross) / current.avgPrice) * 100
        : 0;

    matrix.push({
      dropPercent: drop,
      newPrice,
      multiplier: quantityMultiplier,
      newShares,
      newGrossCost,
      newAvgPrice: Number(result.newAvgPriceGross.toFixed(3)),
      reductionPercent: Number(reductionPercent.toFixed(2)),
    });
  });

  return matrix;
}

export function formatCurrency(amount: number, currency: string = 'EGP'): string {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
  }).format(amount);
  return `${formatted} ${currency === 'EGP' ? 'EGP' : currency === 'USD' ? '$' : 'SAR'}`;
}

export function formatPercent(value: number): string {
  const absVal = Math.abs(value).toFixed(2);
  return `${value >= 0 ? '+' : '-'}${absVal}%`;
}
