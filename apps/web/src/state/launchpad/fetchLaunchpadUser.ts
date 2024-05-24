import BigNumber from 'bignumber.js'
import { erc20Abi } from 'viem'
import {launchpadForETHABI} from 'config/abi/launchpadForETH'
import {multicallABI} from 'config/abi/Multicall'
import { ZERO_ADDRESS } from 'config/constants'
import { publicClient } from 'utils/wagmi'
import { getMulticallAddress } from 'utils/addressHelpers'
import { SerializedLaunchpadUserData } from './types'

const fetchEthUser = async (
  account: `0x${string}`,
  chainId: number,
): Promise<any> => {
  const multicallAddress = getMulticallAddress()

  const ethBalanceCall = [{
    abi: multicallABI,
    address: multicallAddress,
    functionName: 'getEthBalance',
    args: [account],
  }]

  const client = publicClient({chainId})

  const ethBalancesRaw = await client.multicall({ contracts: ethBalanceCall, allowFailure: true })

  const ethBalance = ethBalancesRaw[0]

  return {
    allowance: 0,
    balance: ethBalance
  }
}

const fetchTokenUser = async (
  launchpad: `0x${string}`,
  account: `0x${string}`,
  token: `0x${string}`,
  chainId: number,
): Promise<any> => {
  const calls = [
    {
      abi: erc20Abi ,
      address: token,
      functionName: 'allowance',
      args: [account, launchpad],
    },
    {
      abi: erc20Abi ,
      address: token,
      functionName: 'balanceOf',
      args: [account],
    },
  ]

  const client = publicClient({chainId})

  const userDataMultiCallResult = await client.multicall({ contracts: calls, allowFailure: true })
  const tokenAllowance = userDataMultiCallResult[0].result
  const tokenBalance = userDataMultiCallResult[1].result
  return {
    allowance: tokenAllowance,
    balance: tokenBalance
  }
}

const fetchLaunchpadUser = async (
  launchpad: `0x${string}`,
  account: `0x${string}`,
  chainId: number,
): Promise<any[]> => {
  const calls = [
    {
      abi: launchpadForETHABI,
      address: launchpad,
      functionName: 'deposits',
      args: [account],
    },
    {
      abi: launchpadForETHABI,
      address: launchpad,
      functionName: 'claimed',
      args: [account],
    },
    {
      abi: launchpadForETHABI,
      address: launchpad,
      functionName: 'whiteList',
      args: [account],
    },
    {
      abi: launchpadForETHABI,
      address: launchpad,
      functionName: 'owner',
    },
    {
      abi: launchpadForETHABI,
      address: launchpad,
      functionName: 'getVestedAmount',
      args: [account],
    },
  ]

  const client = publicClient({chainId})

  // @ts-ignore
  const userDataMultiCallResult = await client.multicall({ contracts: calls, allowFailure: true })
  return userDataMultiCallResult
}

function launchpadTransformer (launchpadUserDataResult : any[], account: `0x${string}`) {
  const [
    deposit,
    claimed,
    whitelisted,
    owner,
    vested,
  ] = launchpadUserDataResult

  return {
    deposit,
    claimed,
    vested,
    owner: owner[0] === account,
    whitelisted
  }
}

const fetchLaunchpadUserData = async (launchpad: `0x${string}`, account: `0x${string}`, chainId: number): Promise<SerializedLaunchpadUserData> => {
  const client = publicClient({chainId})
  const [[token]] = await Promise.all([
    client.multicall({
      contracts: [
        {
          abi: launchpadForETHABI,
          address: launchpad,
          functionName: "buyToken"
        }
      ],
    })[0].result
  ])

  const [launchpadUserDataResult] = await Promise.all([
    fetchLaunchpadUser(launchpad, account, chainId)
  ])

  const [tokenUserDataResult] = token !== ZERO_ADDRESS ? await Promise.all([
    fetchTokenUser(launchpad, account, token, chainId)
  ]) : await Promise.all([
    fetchEthUser(account, chainId)
  ])

  const launchpadUserData = launchpadTransformer(launchpadUserDataResult, account)

  return {...tokenUserDataResult, ...launchpadUserData}
}

export default fetchLaunchpadUserData