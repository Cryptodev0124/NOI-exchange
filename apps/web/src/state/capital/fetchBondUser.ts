import BigNumber from 'bignumber.js'
// import erc20Abi  from 'config/abi/erc20.json'
import { dcpBondABI } from 'config/abi/dcpBond'
import { Address, erc20Abi  } from 'viem'
import { publicClient } from 'utils/wagmi'
import { BondConfigBaseProps } from '@pancakeswap/capital'

export const fetchBondUserAllowances = async (
  account: Address,
  bondsToFetch: BondConfigBaseProps[],
  chainId: number,
) => {
  const client = publicClient({chainId})
  const calls = bondsToFetch.map((bond) => {
    return { address: bond.bondToken.address, functionName: 'allowance', args: [account, bond.bondAddress], abi: erc20Abi }
  })

  const rawAllowances = await client.multicall({contracts: calls,  allowFailure: false})
  const parsedAllowances = rawAllowances.map((balance) => {
    return balance.toString()
  })

  return parsedAllowances
}

export const fetchBondUserTokenBalances = async (
  account: Address,
  bondsToFetch: BondConfigBaseProps[],
  chainId: number,
) => {
  const client = publicClient({chainId})
  const calls = bondsToFetch.map((bond) => {
    return {
      address: bond.bondToken.address,
      functionName: 'balanceOf',
      args: [account],
      abi: erc20Abi 
    }
  })

  const rawTokenBalances = await client.multicall({contracts: calls, allowFailure: false})
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return tokenBalance.toString()
  })
  return parsedTokenBalances
}

export const fetchBondUserInfos = async (
  account: Address,
  bondsToFetch: BondConfigBaseProps[],
  chainId: number,
) => {
  const client = publicClient({chainId})
  const calls = bondsToFetch.map((bond) => {
    return {
      address: bond.bondAddress,
      functionName: 'bondInfo',
      args: [account],
      abi: dcpBondABI
    }
  })

  const rawInfos = await client.multicall({
    contracts: calls,
    allowFailure: false
  })
  const parsedBondInfos = rawInfos.map((info) => {
    return {
      payout: info[0].toString(),
      vesting: info[0].toString(),
      lastTime: info[0].toString()
    }
  })
  return parsedBondInfos
}

export const fetchBondUserEarnings = async (account: Address, bondsToFetch: BondConfigBaseProps[], chainId: number) => {
  const client = publicClient({chainId})
  const calls = bondsToFetch.map((bond) => {
    return {
      address: bond.bondAddress,
      functionName: 'pendingPayoutFor',
      args: [account],
      abi: dcpBondABI
    }
  })

  const rawEarnings = await client.multicall({ contracts: calls, allowFailure: false })
  const parsedEarnings = rawEarnings.map((earnings) => {
    return earnings[0].toString()
  })
  return parsedEarnings
}