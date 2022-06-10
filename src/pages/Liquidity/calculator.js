import BigNumber from 'bignumber.js'

export function addWithLiquidity(reserve0, reserve1, liquidity, amount) {
  if (!reserve0 || !reserve1 || !liquidity || !amount) return 'Undefined values'
  reserve0 = new BigNumber(reserve0)
  reserve1 = new BigNumber(reserve1)
  liquidity = new BigNumber(liquidity)
  amount = new BigNumber(amount)
  if (amount.isNaN()) return 'Undefined values'
  if (
    reserve0.isGreaterThan(0) &&
    reserve1.isGreaterThan(0) &&
    liquidity.isGreaterThan(0)
  ) {
    const amount0 = new BigNumber(
      reserve0
        .multipliedBy(amount)
        .dividedBy(liquidity)
        .toFixed(0, BigNumber.ROUND_FLOOR),
    ).plus(1)
    const amount1 = new BigNumber(
      reserve1
        .multipliedBy(amount)
        .dividedBy(liquidity)
        .toFixed(0, BigNumber.ROUND_FLOOR),
    ).plus(1)
    return [amount0, amount1, amount]
  } else {
    if (!amount.isGreaterThan(1000)) {
      return 'Too less liquidity'
    }
    return [amount, amount, amount]
  }
}
export function addWithTokenAmount(
  reserve0,
  reserve1,
  liquidity,
  amount0,
  amount1,
) {
  if (!reserve0 || !reserve1 || !liquidity || !amount0 || !amount1)
    return 'Undefined values'
  reserve0 = new BigNumber(reserve0)
  reserve1 = new BigNumber(reserve1)
  liquidity = new BigNumber(liquidity)
  amount0 = new BigNumber(amount0)
  amount1 = new BigNumber(amount1)
  if (amount0.isNaN() || amount1.isNaN()) return 'Undefined values'
  let amount
  if (
    reserve0.isGreaterThan(0) &&
    reserve1.isGreaterThan(0) &&
    liquidity.isGreaterThan(0)
  ) {
    let desired0 = amount0
    amount = new BigNumber(
      desired0
        .multipliedBy(liquidity)
        .dividedBy(reserve0)
        .toFixed(0, BigNumber.ROUND_FLOOR),
    )
    let desired1 = new BigNumber(
      reserve1
        .multipliedBy(desired0)
        .dividedBy(reserve0)
        .toFixed(0, BigNumber.ROUND_FLOOR),
    ).plus(1);
    if (desired1.isGreaterThan(amount1)) {
      desired1 = amount1
      amount = new BigNumber(
        desired1
          .multipliedBy(liquidity)
          .dividedBy(reserve1)
          .toFixed(0, BigNumber.ROUND_FLOOR),
      )
      desired0 = new BigNumber(
        reserve0
          .multipliedBy(desired1)
          .dividedBy(reserve1)
          .toFixed(0, BigNumber.ROUND_FLOOR),
      ).plus(1);
      if (desired0.isGreaterThan(amount0)) {
        return 'Invalid max amounts'
      }
    }
    return [desired0, desired1, amount]
  } else {
    amount = new BigNumber(
      amount0.multipliedBy(amount1).sqrt().toFixed(0, BigNumber.ROUND_FLOOR),
    )
    console.log(amount.toString())
    if (!amount.isGreaterThan(1000)) {
      return 'Too less liquidity'
    }
    return [amount0, amount1, amount]
  }
}
export function removeWithLiquidity(reserve0, reserve1, liquidity, amount) {
  if (!reserve0 || !reserve1 || !liquidity || !amount) return 'Undefined values'
  reserve0 = new BigNumber(reserve0)
  reserve1 = new BigNumber(reserve1)
  liquidity = new BigNumber(liquidity)
  amount = new BigNumber(amount)
  if (amount.isNaN()) return 'Undefined values'
  if (liquidity.minus(amount).isLessThan(1000)) {
    return 'Too less liquidity'
  }
  const amount0 = new BigNumber(
    amount
      .multipliedBy(reserve0)
      .dividedBy(liquidity)
      .toFixed(0, BigNumber.ROUND_FLOOR),
  )
  const amount1 = new BigNumber(
    amount
      .multipliedBy(reserve1)
      .dividedBy(liquidity)
      .toFixed(0, BigNumber.ROUND_FLOOR),
  )
  return [amount0, amount1, amount]
}
export function removeWithTokenAmount(
  reserve0,
  reserve1,
  liquidity,
  amount0,
  amount1,
) {
  if (!reserve0 || !reserve1 || !liquidity || !amount0 || !amount1)
    return 'Undefined values'
  reserve0 = new BigNumber(reserve0)
  reserve1 = new BigNumber(reserve1)
  liquidity = new BigNumber(liquidity)
  amount0 = new BigNumber(amount0)
  amount1 = new BigNumber(amount1)
  if (amount0.isNaN() || amount1.isNaN()) return 'Undefined values'
  if (
    !reserve0.isGreaterThan(0) ||
    !reserve1.isGreaterThan(0) ||
    !liquidity.isGreaterThan(0)
  )
    return 'Empty pool'
  let amount
  let desired0 = amount0
  amount = new BigNumber(
    desired0
      .multipliedBy(liquidity)
      .dividedBy(reserve0)
      .toFixed(0, BigNumber.ROUND_FLOOR),
  )
  let desired1 = new BigNumber(
    reserve1
      .multipliedBy(desired0)
      .dividedBy(reserve0)
      .toFixed(0, BigNumber.ROUND_FLOOR),
  )
  if (desired1.isLessThan(amount1)) {
    desired1 = amount1
    amount = new BigNumber(
      desired1
        .multipliedBy(liquidity)
        .dividedBy(reserve1)
        .toFixed(0, BigNumber.ROUND_FLOOR),
    )
    desired0 = new BigNumber(
      reserve0
        .multipliedBy(desired1)
        .dividedBy(reserve1)
        .toFixed(0, BigNumber.ROUND_FLOOR),
    )
    if (desired0.isLessThan(amount0)) {
      return 'Invalid min amounts'
    }
  }
  return [desired0, desired1, amount]
}
