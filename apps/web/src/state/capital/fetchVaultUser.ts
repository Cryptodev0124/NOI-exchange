import BigNumber from 'bignumber.js'
import { Address, erc20Abi } from 'viem'
import { DCP, SDCP } from '@pancakeswap/tokens'
import { publicClient } from 'utils/wagmi'
import { getDcpStakingAddress, getDcpStakingHelperAddress } from 'utils/addressHelpers'


export const fetchVaultUserAllowances = async (
  account: Address,
  chainId: number,
) => {
  const calls = [
    {
      address: DCP[chainId].address,
      functionName: 'allowance',
      args: [account, getDcpStakingHelperAddress(chainId)] as const,
      abi: erc20Abi 
    },
    {
      address: SDCP[chainId].address,
      functionName: 'allowance',
      args: [account, getDcpStakingAddress(chainId)] as const,
      abi: erc20Abi 
    },
  ]

  const client = publicClient({chainId})

  const rawAllowances = await client.multicall({contracts: calls, allowFailure: false})
  const parsedAllowances = rawAllowances.map((balance) => {
    return balance.toString()
  })

  return parsedAllowances
}

export const fetchVaultUserTokenBalances = async (
  account: string,
  chainId: number,
) => {
  const calls = [
    {
    address: DCP[chainId].address,
    functionName: 'balanceOf',
    args: [account],
    abi: erc20Abi 
    },
    {
      address: SDCP[chainId].address,
      functionName: 'balanceOf',
      args: [account],
      abi: erc20Abi 
    },
  ]

  const client = publicClient({chainId})

  const rawTokenBalances = await client.multicall({contracts: calls})
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return tokenBalance.toString()
  })
  return parsedTokenBalances
}