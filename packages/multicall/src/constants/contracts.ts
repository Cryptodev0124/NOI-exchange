import { ChainId } from '@pancakeswap/sdk'
import { Address } from 'viem'

export const MULTICALL_ADDRESS: { [key in ChainId]?: Address } = {
  [ChainId.BSC]: '0x39eecaE833c944ebb94942Fa44CaE46e87a8Da17',
  [ChainId.ETHEREUM]: '0xC0916D7E360c31D5F6D0c497E6a36B7B0E80e3cf',
  [ChainId.ARBITRUM]: '0xbFfE39cDD04f0183e0493c1Deb6E275c5cf84AdF',
  [ChainId.POLYGON]: '0xe05b539447B17630Cb087473F6b50E5c5f73FDeb',
  [ChainId.SHIMMER2]: '0x2058D70c6520254058e3e210857d495080c44aaA',
}
