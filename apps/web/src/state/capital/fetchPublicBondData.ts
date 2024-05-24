import erc20 from 'config/abi/erc20.json'
import {dcpBondABI} from 'config/abi/dcpBond'
import {dcpBondCalculatorABI} from 'config/abi/dcpBondCalculator'
import { Address, erc20Abi  } from 'viem'
import { publicClient } from 'utils/wagmi'
import chunk from 'lodash/chunk'
import { getDcpTreasuryAddress, getDcpBondCalculatorAddress } from 'utils/addressHelpers'
// import { multicallv2, multicallv3 } from 'utils/multicall'
import { BondConfigBaseProps, SerializedBondPublicData } from '@pancakeswap/capital'
import contracts from 'config/constants/contracts'

const fetchPublicBondCalls = (bond: BondConfigBaseProps, chainId: number) => {
  const { bondToken, bondAddress } = bond
  return [
    // Balance of token in the DCP treasury
    {
      abi: erc20Abi ,
      address: bondToken.address,
      functionName: 'balanceOf',
      args: [getDcpTreasuryAddress(chainId)],
    },
    {
      abi: dcpBondABI,
      address: bondAddress,
      functionName: 'terms',
    },
    {
      abi: dcpBondABI,
      address: bondAddress,
      functionName: 'maxPayout',
    },
    {
      abi: dcpBondABI,
      address: bondAddress,
      functionName: 'bondPrice',
    },
    {
      abi: dcpBondABI,
      address: bondAddress,
      functionName: 'bondPriceInUSD',
    },
  ]
}

export const fetchPublicBondData = async (bonds: BondConfigBaseProps[], chainId: number): Promise<any[]> => {
  const client = publicClient({chainId})
  const bondCalls = bonds.flatMap((bond) => fetchPublicBondCalls(bond, chainId))
  const chunkSize = bondCalls.length / bonds.length
  const bondMultiCallResult = await client.multicall({ contracts: bondCalls, allowFailure: true})
  return chunk(bondMultiCallResult, chunkSize)
}

const fetchBondCalcCalls = (bond: SerializedBondPublicData, chainId: number) => {
  const { bondToken, purchased, lpBond } = bond
  return [
    {
      abi: dcpBondABI,
      address: getDcpBondCalculatorAddress(chainId),
      functionName: 'getTotalValue',
      args: [bondToken.address],
    },
    {
      abi: erc20Abi ,
      address: bondToken.address,
      functionName: 'totalSupply',
    },
    {
      abi: dcpBondABI,
      address: getDcpBondCalculatorAddress(chainId),
      functionName: 'markdown',
      args: [bondToken.address],
    },
    {
      abi: dcpBondABI,
      address: getDcpBondCalculatorAddress(chainId),
      functionName: 'valuation',
      args: [bondToken.address, purchased],
    }
  ]
}

export const fetcBondCalcData = async (bonds: SerializedBondPublicData[], chainId: number): Promise<any[]> => {
  const client = publicClient({chainId})
  const bondCalcCalls = bonds.flatMap((bond) => fetchBondCalcCalls(bond, chainId))
  const chunkSize = bondCalcCalls.length / bonds.length
  const bondCalcMultiCallResult = await client.multicall({ contracts: bondCalcCalls, allowFailure: true })
  return chunk(bondCalcMultiCallResult, chunkSize)
}
