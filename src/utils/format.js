import BigNumber from 'bignumber.js'
import { isNumeric } from './index'


export function formatAddress(address) {
  return address.slice(0, 6) + '...' + address.slice(-4)
}

export function formatNumber(number, fractionDigits, returnOnError = '---') {
  if (!isNumeric(number)) {
    return returnOnError
  }
  if (isNumeric(fractionDigits)) {
    return numberWithCommas(Number(parseFloat(number).toFixed(fractionDigits)))
  } else {
    return numberWithCommas(Number(number))
  }
}

/**
 * Compact large number
 * @param {*} n The number
 * @param {Number} fractionDigits Number of digits after the decimal point
 */
export function compactNumber(n, fractionDigits = 1) {
  const suffixes = ['', 'K', 'M', 'B', 'T']
  const suffixNum = Math.floor((('' + parseInt(n)).length - 1) / 3)

  let shortValue = parseFloat(
    (n / Math.pow(1000, suffixNum)).toPrecision(fractionDigits + 1),
  )

  if (shortValue % 1 !== 0) {
    shortValue = shortValue.toFixed(fractionDigits)
  }

  return shortValue + suffixes[suffixNum]
}

export function numberWithCommas(x) {
  const [naturalPart, decimalPart] = x.toString().split('.')
  let out = naturalPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  if (decimalPart) {
    out += '.' + decimalPart
  }
  return out
}

export function toDecimal(balance, decimal) {
  BigNumber.config({
    FORMAT: {
      prefix: '',
      decimalSeparator: '.',
      groupSeparator: ',',
      groupSize: 3,
      secondaryGroupSize: 0,
      fractionGroupSeparator: ' ',
      fractionGroupSize: 0,
      suffix: '',
    },
  })
  const bn = new BigNumber(balance)
  return bn.dividedBy(10 ** decimal).toFormat(2)
}
