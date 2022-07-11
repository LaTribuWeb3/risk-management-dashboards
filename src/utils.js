import {TOKEN_PREFIX} from './constants'

export const removeTokenPrefix = (token) => token.replace(TOKEN_PREFIX, '')