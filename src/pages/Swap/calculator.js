import BigNumber from 'bignumber.js'

export function Swap0To1(reserve0, reserve1, amount0In) {
  if (!reserve0 || !reserve1 || !amount0In) return 'Undefined values'
  reserve0 = new BigNumber(reserve0)
  reserve1 = new BigNumber(reserve1)
  amount0In = new BigNumber(amount0In)
  const amount0 = amount0In
    .multipliedBy(997)
    .dividedBy(1000)
    .toFixed(0, BigNumber.ROUND_FLOOR)
  const amount1 = reserve1
    .multipliedBy(amount0)
    .dividedBy(reserve0.plus(amount0))
    .toFixed(0, BigNumber.ROUND_FLOOR)
  return [amount0, amount1]
}

export function Swap1To0(reserve0, reserve1, amount1In) {
  if (!reserve0 || !reserve1 || !amount1In) return 'Undefined values'
  reserve0 = new BigNumber(reserve0)
  reserve1 = new BigNumber(reserve1)
  amount1In = new BigNumber(amount1In)
  const amount1 = amount1In
    .multipliedBy(997)
    .dividedBy(1000)
    .toFixed(0, BigNumber.ROUND_FLOOR)
  const amount0 = reserve0
    .multipliedBy(amount1)
    .dividedBy(reserve1.plus(amount1))
    .toFixed(0, BigNumber.ROUND_FLOOR)
  return [amount0, amount1]
}

export function Swap0To1WithMinAmountOut(reserve0, reserve1, minAmount1Out) {
  if (!reserve0 || !reserve1 || !minAmount1Out) return 'Undefined values'
  reserve0 = new BigNumber(reserve0)
  reserve1 = new BigNumber(reserve1)
  minAmount1Out = new BigNumber(minAmount1Out)
  if (reserve1.isLessThan(minAmount1Out)) return 'Not enough reserve'
  const amount0 = reserve0
    .multipliedBy(minAmount1Out)
    .dividedBy(reserve1.minus(minAmount1Out))
  const amount0In = new BigNumber(
    amount0.multipliedBy(1000).dividedBy(997).toFixed(0, BigNumber.ROUND_FLOOR),
  ).plus(1)
  // (r0 + a0)(r1 - a1) = r0 * r1
  // a0 = r0 * r1 / (r1 - a1) - r0
  // a0 = r0 * a1 / (r1 - a1)
  return [amount0In, minAmount1Out]
}

export function Swap1To0WithMinAmountOut(reserve0, reserve1, minAmount0Out) {
  if (!reserve0 || !reserve1 || !minAmount0Out) return 'Undefined values'
  reserve0 = new BigNumber(reserve0)
  reserve1 = new BigNumber(reserve1)
  minAmount0Out = new BigNumber(minAmount0Out)
  if (reserve0.isLessThan(minAmount0Out)) return 'Not enough reserve'
  const amount1 = reserve1
    .multipliedBy(minAmount0Out)
    .dividedBy(reserve0.minus(minAmount0Out))
  const amount1In = new BigNumber(
    amount1.multipliedBy(1000).dividedBy(997).toFixed(0, BigNumber.ROUND_FLOOR),
  ).plus(1)

  return [minAmount0Out, amount1In]
}
