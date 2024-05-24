import BigNumber from 'bignumber.js'
import { getUnixTime } from 'date-fns'
import { BIG_TEN, BIG_TWO, BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { DCP, SDCP } from '@pancakeswap/tokens'
// import erc20 from 'config/abi/erc20.json'
import { erc20Abi } from 'viem'
import {sdcpABI} from 'config/abi/sdcp'
import {multicallABI} from 'config/abi/Multicall'
import {dcpStakingABI} from 'config/abi/dcpStaking'
import { publicClient } from 'utils/wagmi'
import { getDcpStakingAddress, getMulticallAddress } from 'utils/addressHelpers'
import { SerializedVault } from '@pancakeswap/capital'

const multicallAddress = getMulticallAddress()

const fetchVaultCalls = (chainId: number) => {
  return [
    {
      abi: erc20Abi ,
      address: DCP[chainId].address,
      functionName: 'totalSupply',
    },
    {
      abi: sdcpABI,
      address: SDCP[chainId].address,
      functionName: 'circulatingSupply',
    },
    {
      abi: multicallABI,
      address: multicallAddress,
      functionName: 'getBlockNumber',
    },
    {
      abi: dcpStakingABI,
      address: getDcpStakingAddress(chainId),
      functionName: 'epoch',
    },
    {
      abi: dcpStakingABI,
      address: getDcpStakingAddress(chainId),
      functionName: 'index',
    }
  ]
}

export const fetchVaultData = async (chainId: number): Promise<any[]> => {
  const client = publicClient({chainId})
  const bondMultiCallResult = await client.multicall({ contracts: fetchVaultCalls(chainId), allowFailure: true })
  return bondMultiCallResult
}

function vaultTransformer (marketPrice: bigint, vaultResult : any[]) {
  const [
    totalSupply,
    circSupply,
    blockNumber,
    epoch,
    index
  ] = vaultResult

  const marketCap = totalSupply * marketPrice / BigInt(10**9)
  const stakingTVL = circSupply * marketPrice / BigInt(10**9)
  const stakingReward = epoch.distribute;
  const stakingRebase = stakingReward / circSupply
  const fiveDayRate = (stakingRebase + 1) ** (5*3) - 1
  const stakingAPY = (stakingRebase + 1) ** (365*3) - 1


  return {
    currentIndex: index.toString(),
    totalSupply: totalSupply.toString(),
    marketCap: marketCap.toString(),
    circSupply: circSupply.toString(),
    fiveDayRate: fiveDayRate.toString(),
    stakingAPY: stakingAPY.toString(),
    stakingTVL: stakingTVL.toString(),
    stakingRebase: stakingRebase.toString(),
    marketPrice: marketPrice.toString(),
    currentBlock: blockNumber.toString(),
    currentBlockTime: getUnixTime(new Date()),
    nextRebase: epoch.endTime,
  }
}

const fetchVault = async (marketPrice: bigint, chainId: number): Promise<SerializedVault> => {
  const [vaultResult] = await Promise.all([
    fetchVaultData(chainId)
  ])

  return vaultTransformer(marketPrice, vaultResult)
}

export default fetchVault
