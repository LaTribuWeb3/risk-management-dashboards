import {TOKEN_PREFIX} from './constants'

export const removeTokenPrefix = (token) => token.replace(TOKEN_PREFIX, '')

export const precentFormatter = (num) => {
  if (isNaN(num)){
    // not a numerical string
    return num
  } else {
    num = parseFloat(num)
  }
  return (num*100).toFixed(2) + '%'
}